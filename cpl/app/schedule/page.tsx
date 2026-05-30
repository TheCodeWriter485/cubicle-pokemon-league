'use client'
import SideBar from "../sidebar";
import { useEffect, useState } from "react";
import MatchForm from "../match_form";

type Match = {
    match_id: number | string
    week: string
    done?: boolean | number
    winner?: string
    player1?: string
    player2?: string
    team_1?: number | string
    team_2?: number | string
    team_1_name?: string
    team_2_name?: string
    team_1_username?: string
    team_2_username?: string
}

export default function Schedule() {
    const bookmarks = [{ id: 1, name: 'button' }]
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const fetchData = () => {
        fetch('http://localhost:3030/auth/status', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setIsLoggedIn(data.loggedin))
            .catch(console.error);

        fetch('http://localhost:3030/matches')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sorted = (data as Match[]).sort((a: Match, b: Match) => new Date(a.week).getTime() - new Date(b.week).getTime());
                    setMatches(sorted);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleCloseModal = () => {
        setSelectedMatch(null);
        fetchData(); // Refresh to see updated done status
    };

    const team1Name = (match: Match) => match.team_1_name || match.player1 || `Team ${match.team_1}`;
    const team2Name = (match: Match) => match.team_2_name || match.player2 || `Team ${match.team_2}`;
    const winnerName = (match: Match) => {
        if (!match.winner) return "";
        if (match.winner === match.team_1_username || match.winner === match.player1 || match.winner === match.team_1_name) {
            return team1Name(match);
        }
        if (match.winner === match.team_2_username || match.winner === match.player2 || match.winner === match.team_2_name) {
            return team2Name(match);
        }
        return match.winner;
    };

    const groupedMatches = matches.reduce((acc, match) => {
        const weekDate = new Date(match.week).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
        if (!acc[weekDate]) {
            acc[weekDate] = [];
        }
        acc[weekDate].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    return (
        <main className="page flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SideBar bookmarks={bookmarks} />

            <div className="window flex-1 p-8 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Match Schedule
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        View upcoming matches and past results.
                    </p>
                </header>

                <div className="space-y-12">
                    {Object.entries(groupedMatches).map(([weekDate, weekMatches]: [string, Match[]]) => (
                        <div key={weekDate}>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-4 text-zinc-800 dark:text-zinc-200">
                                <span className="whitespace-nowrap">Week of {weekDate}</span>
                                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {weekMatches.map((match: Match) => (
                                    <div key={match.match_id}
                                        className={`group relative p-6 rounded-2xl border transition-all duration-300
                                             ${isLoggedIn ? 'hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-teal-900/20 hover:border-teal-500/50' : ''}
                                             ${match.done
                                                ? 'bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800'
                                                : 'bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50 border-zinc-200 dark:border-zinc-800'
                                            }
                                         `}>

                                        <div className="flex justify-between items-start mb-4 mt-2">
                                            {match.done ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                                    Upcoming
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center justify-center space-y-4 my-6">
                                            <div className="text-xl font-bold text-center">
                                                {team1Name(match)}
                                            </div>
                                            <div className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                                VS
                                            </div>
                                            <div className="text-xl font-bold text-center">
                                                {team2Name(match)}
                                            </div>
                                        </div>

                                        {match.winner && (
                                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
                                                <span className="text-sm text-zinc-500 dark:text-zinc-400">Winner: </span>
                                                <span className="font-semibold text-amber-500 dark:text-amber-400">🏆 {winnerName(match)}</span>
                                            </div>
                                        )}

                                        {isLoggedIn && (
                                            <div className="mt-6 flex justify-center z-10 relative">
                                                <button
                                                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm w-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMatch(match);
                                                    }}>
                                                    {match.done ? 'Edit Match Data' : 'Enter Match Data'}
                                                </button>
                                            </div>
                                        )}

                                        {isLoggedIn && (
                                            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-teal-500/50 pointer-events-none transition-all duration-300"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {matches.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                            No matches scheduled yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Match Form */}
            {selectedMatch && (
                <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        <button
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            onClick={() => setSelectedMatch(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-2xl font-bold">
                                Edit Match: <span className="text-teal-500">{team1Name(selectedMatch)}</span> vs <span className="text-blue-500">{team2Name(selectedMatch)}</span>
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">Week of {new Date(selectedMatch.week).toLocaleDateString()}</p>
                        </div>
                        <MatchForm match={selectedMatch} onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </main>
    );
}
