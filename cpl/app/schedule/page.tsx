'use client'
import SideBar from "../sidebar";
import { useEffect, useState } from "react";
import MatchForm from "../match_form";

type Team = {
    id: number | string
    Username?: string
    TeamName?: string
}

type RoundPlayer = {
    name?: string
    pokemon?: string[]
    diff?: number
    kills?: number
    pokemon_left?: number
    winner?: boolean
}

type RoundData = {
    id?: string
    pokemon_kills?: Record<string, number>
    pokemon_deaths?: Record<string, number>
    p1?: RoundPlayer
    p2?: RoundPlayer
}

type MatchData = {
    round_data?: RoundData[]
    match_winner?: string
    p1?: {
        name?: string
        round_wins?: number
        winner?: boolean
    }
    p2?: {
        name?: string
        round_wins?: number
        winner?: boolean
    }
}

type Match = {
    match_id: number | string
    week: string
    done?: boolean | number
    winner?: string
    team_1?: number | string
    team_2?: number | string
    team_1_name?: string
    team_2_name?: string
    team_1_username?: string
    team_2_username?: string
    match_data?: MatchData | string | null
}

const parseStoredMatchData = (matchData: Match["match_data"]): MatchData | null => {
    if (!matchData) return null;
    if (typeof matchData === "object") return matchData;

    try {
        return JSON.parse(matchData);
    } catch (error) {
        console.warn("Could not parse match data:", error);
        return null;
    }
}

const sumRoundValue = (rounds: RoundData[], side: "p1" | "p2", key: "kills" | "diff") => {
    return rounds.reduce((total, round) => total + (Number(round?.[side]?.[key]) || 0), 0);
}

export default function Schedule() {
    const bookmarks = [{ id: 1, name: 'button' }]
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [statsMatch, setStatsMatch] = useState<Match | null>(null);

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

        fetch('http://localhost:3030/team')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTeams(data);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleCloseModal = () => {
        setSelectedMatch(null);
        fetchData();
    };

    const teamById = (teamId?: number | string) => {
        return teams.find(team => team.id?.toString() === teamId?.toString());
    }

    const teamName = (match: Match, side: 1 | 2) => {
        const joinedName = side === 1 ? match.team_1_name : match.team_2_name;
        const teamId = side === 1 ? match.team_1 : match.team_2;
        const fallbackTeam = teamById(teamId);

        return joinedName || fallbackTeam?.TeamName || fallbackTeam?.Username || `Team ${teamId}`;
    }

    const winnerName = (match: Match) => {
        if (!match.winner) return "";

        const matchData = parseStoredMatchData(match.match_data);
        const winner = match.winner;

        if (
            winner === match.team_1_username ||
            winner === match.team_1_name ||
            winner === matchData?.p1?.name
        ) {
            return teamName(match, 1);
        }

        if (
            winner === match.team_2_username ||
            winner === match.team_2_name ||
            winner === matchData?.p2?.name
        ) {
            return teamName(match, 2);
        }

        return winner;
    };

    const groupedMatches = matches.reduce((acc, match) => {
        const weekDate = new Date(match.week).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
        if (!acc[weekDate]) {
            acc[weekDate] = [];
        }
        acc[weekDate].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    const renderMatchStats = (match: Match) => {
        const matchData = parseStoredMatchData(match.match_data);
        const rounds = Array.isArray(matchData?.round_data) ? matchData.round_data : [];
        const hasStats = rounds.length > 0;
        const team1Wins = Number(matchData?.p1?.round_wins) || rounds.filter(round => round?.p1?.winner).length;
        const team2Wins = Number(matchData?.p2?.round_wins) || rounds.filter(round => round?.p2?.winner).length;
        const pokemonTotals = rounds.reduce((totals, round) => {
            const pokemon = [
                ...(round?.p1?.pokemon || []),
                ...(round?.p2?.pokemon || [])
            ];

            pokemon.forEach(name => {
                if (!totals[name]) {
                    totals[name] = { kills: 0, deaths: 0 };
                }
                totals[name].kills += Number(round?.pokemon_kills?.[name]) || 0;
                totals[name].deaths += Number(round?.pokemon_deaths?.[name]) || 0;
            });

            return totals;
        }, {} as Record<string, { kills: number, deaths: number }>);

        const sortedPokemonTotals = Object.entries(pokemonTotals)
            .sort(([, a], [, b]) => b.kills - a.kills || a.deaths - b.deaths);

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        {teamName(match, 1)} vs {teamName(match, 2)}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Week of {new Date(match.week).toLocaleDateString()}
                    </p>
                </div>

                {!hasStats ? (
                    <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-zinc-500 dark:text-zinc-400">
                        No match stats have been recorded yet.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Rounds Won</div>
                                <div className="mt-2 text-3xl font-bold">{team1Wins}</div>
                                <div className="mt-1 text-sm font-medium">{teamName(match, 1)}</div>
                            </div>
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Rounds Won</div>
                                <div className="mt-2 text-3xl font-bold">{team2Wins}</div>
                                <div className="mt-1 text-sm font-medium">{teamName(match, 2)}</div>
                            </div>
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total KO</div>
                                <div className="mt-2 text-3xl font-bold">{sumRoundValue(rounds, "p1", "kills")}</div>
                                <div className="mt-1 text-sm font-medium">{teamName(match, 1)}</div>
                            </div>
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total KO</div>
                                <div className="mt-2 text-3xl font-bold">{sumRoundValue(rounds, "p2", "kills")}</div>
                                <div className="mt-1 text-sm font-medium">{teamName(match, 2)}</div>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold">Round</th>
                                        <th className="px-4 py-3 text-sm font-semibold">{teamName(match, 1)}</th>
                                        <th className="px-4 py-3 text-sm font-semibold">{teamName(match, 2)}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {rounds.map((round, index) => (
                                        <tr key={round.id || index}>
                                            <td className="px-4 py-3 text-sm font-medium">Round {index + 1}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {round?.p1?.kills ?? 0} KO, {round?.p1?.diff ?? 0} diff
                                                {round?.p1?.winner ? <span className="ml-2 text-amber-500 font-semibold"> (Winner)</span> : null}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {round?.p2?.kills ?? 0} KO, {round?.p2?.diff ?? 0} diff
                                                {round?.p2?.winner ? <span className="ml-2 text-amber-500 font-semibold"> (Winner)</span> : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {sortedPokemonTotals.length > 0 && (
                            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold">Pokemon</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Kills</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Deaths</th>
                                            <th className="px-4 py-3 text-sm font-semibold">Diff</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {sortedPokemonTotals.map(([pokemon, totals]) => (
                                            <tr key={pokemon}>
                                                <td className="px-4 py-3 text-sm font-medium">{pokemon}</td>
                                                <td className="px-4 py-3 text-sm">{totals.kills}</td>
                                                <td className="px-4 py-3 text-sm">{totals.deaths}</td>
                                                <td className="px-4 py-3 text-sm">{totals.kills - totals.deaths}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

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
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setStatsMatch(match)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setStatsMatch(match);
                                            }
                                        }}
                                        className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500
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
                                                {teamName(match, 1)}
                                            </div>
                                            <div className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                                VS
                                            </div>
                                            <div className="text-xl font-bold text-center">
                                                {teamName(match, 2)}
                                            </div>
                                        </div>

                                        {match.winner && (
                                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
                                                <span className="text-sm text-zinc-500 dark:text-zinc-400">Winner: </span>
                                                <span className="font-semibold text-amber-500 dark:text-amber-400">{winnerName(match)}</span>
                                            </div>
                                        )}

                                        {isLoggedIn && (
                                            <div className="mt-6 flex justify-center z-10 relative">
                                                <button
                                                    type="button"
                                                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm w-full text-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMatch(match);
                                                    }}>
                                                    {match.done ? 'Edit Match Data' : 'Enter Match Data'}
                                                </button>
                                            </div>
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

            {statsMatch && (
                <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        <button
                            type="button"
                            aria-label="Close match stats"
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            onClick={() => setStatsMatch(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        {renderMatchStats(statsMatch)}
                    </div>
                </div>
            )}

            {selectedMatch && (
                <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        <button
                            type="button"
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            onClick={() => setSelectedMatch(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-2xl font-bold">
                                Edit Match: <span className="text-teal-500">{teamName(selectedMatch, 1)}</span> vs <span className="text-blue-500">{teamName(selectedMatch, 2)}</span>
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
