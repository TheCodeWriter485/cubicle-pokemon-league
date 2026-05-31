"use client"
import SideBar from "../sidebar";
import MatchForm from '@/app/match_form'
import AccountForm from '@/app/admin/account_form'
import DraftForm from '@/app/admin/draft_form'
import { useState, useEffect } from 'react'

type Team = {
    id: number | string
    Username?: string
    TeamName?: string
}

type Match = {
    match_id: number | string
    week: string
    done?: boolean | number
    player1?: string
    player2?: string
    team_1?: number | string
    team_2?: number | string
    team_1_name?: string
    team_2_name?: string
}

export default function Admin() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [matches, setMatches] = useState<Match[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [selectedMatchId, setSelectedMatchId] = useState<string>("")

    // Create match state
    const [team1, setTeam1] = useState("")
    const [team2, setTeam2] = useState("")
    const [week, setWeek] = useState("")

    async function checkLogin() {
        const response = await fetch("http://localhost:3030/auth/status", {
            credentials: "include"
        })
        const data = await response.json()
        setLoggedIn(data.loggedin)
        setIsAdmin(data.admin)
    }

    async function fetchMatches() {
        const response = await fetch("http://localhost:3030/matches")
        const data = await response.json()
        if (Array.isArray(data)) {
            setMatches(data)
        }
    }

    async function fetchTeams() {
        const response = await fetch("http://localhost:3030/team")
        const data = await response.json()
        if (Array.isArray(data)) {
            setTeams(data)
        }
    }

    useEffect(() => {
        async function loadInitialData() {
            await Promise.all([
                checkLogin(),
                fetchMatches(),
                fetchTeams()
            ])
        }

        loadInitialData()
    }, [])

    const handleCreateMatch = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const formattedWeek = week + ' 00:00:00'
            const res = await fetch("http://localhost:3030/matches/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ team_1: team1, team_2: team2, week: formattedWeek })
            })
            const data = await res.json()
            if (data.sqlMessage) {
                alert("Error: " + data.sqlMessage)
            } else {
                alert("Match created successfully!")
                setTeam1("")
                setTeam2("")
                setWeek("")
                fetchMatches()
            }
        } catch (error) {
            console.error(error)
            alert("Failed to create match.")
        }
    }

    const handleDeleteMatch = async () => {
        if (!selectedMatchId) return;
        if (!confirm("Are you sure you want to delete this match?")) return;
        
        try {
            const res = await fetch(`http://localhost:3030/matches/delete/${selectedMatchId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.sqlMessage) {
                alert("Error: " + data.sqlMessage);
            } else {
                alert("Match deleted successfully!");
                setSelectedMatchId("");
                fetchMatches();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete match.");
        }
    }

    const selectedMatch = matches.find(m => m.match_id.toString() === selectedMatchId)
    const teamName = (team: Team) => team.TeamName || team.Username || `Team ${team.id}`
    const matchTeam1Name = (match: Match) => match.team_1_name || match.player1 || `Team ${match.team_1}`
    const matchTeam2Name = (match: Match) => match.team_2_name || match.player2 || `Team ${match.team_2}`
    const bookmarks = [{ id: 1, name: 'button' }]

    return (
        <main className="page flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
            <SideBar bookmarks={bookmarks} />
            <div className="window flex-1 p-8 md:p-12 overflow-y-auto w-full max-w-5xl mx-auto">
                {loggedIn && isAdmin ?
                    <div className="space-y-12">
                        <header>
                            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-4">
                                Admin Panel 🛠️
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Manage accounts, create team matches, and update match data.</p>
                        </header>

                        <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">Account Management</h2>
                            <AccountForm />
                        </div>

                        <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">Create New Match</h2>
                            <form onSubmit={handleCreateMatch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-semibold">Team 1</label>
                                        <select
                                            required
                                            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            value={team1}
                                            onChange={e => setTeam1(e.target.value)}
                                        >
                                            <option value="">-- Select Team 1 --</option>
                                            {teams.map(team => (
                                                <option key={team.id} value={team.id}>{teamName(team)} ({team.Username})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-semibold">Team 2</label>
                                        <select
                                            required
                                            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            value={team2}
                                            onChange={e => setTeam2(e.target.value)}
                                        >
                                            <option value="">-- Select Team 2 --</option>
                                            {teams.map(team => (
                                                <option key={team.id} value={team.id}>{teamName(team)} ({team.Username})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-semibold">Week (Monday)</label>
                                        <input
                                            type="date"
                                            required
                                            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            value={week}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (!val) {
                                                    setWeek("");
                                                    return;
                                                }
                                                const [y, m, d] = val.split('-').map(Number);
                                                const dateObj = new Date(y, m - 1, d);
                                                const day = dateObj.getDay();
                                                const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
                                                dateObj.setDate(diff);

                                                const year = dateObj.getFullYear();
                                                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                                                const dateStr = String(dateObj.getDate()).padStart(2, '0');

                                                setWeek(`${year}-${month}-${dateStr}`);
                                            }}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors mt-2">
                                    Create Match
                                </button>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-zinc-900/80 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">Update or Delete Match</h2>
                            <div className="flex flex-col gap-2 mb-8">
                                <label className="text-sm font-semibold">Select Match to Edit or Delete</label>
                                <div className="flex items-center gap-4">
                                    <select
                                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-md w-full"
                                        value={selectedMatchId}
                                        onChange={e => setSelectedMatchId(e.target.value)}>
                                        <option value="">-- Select a match --</option>
                                        {matches.map(m => (
                                            <option key={m.match_id} value={m.match_id}>
                                                ID: {m.match_id} | {matchTeam1Name(m)} vs {matchTeam2Name(m)} ({new Date(m.week).toLocaleDateString()}) {m.done ? '[Done]' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMatchId && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteMatch}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shrink-0"
                                        >
                                            Delete Match
                                        </button>
                                    )}
                                </div>
                            </div>

                            {selectedMatch && (
                                <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                                    <MatchForm
                                        match={selectedMatch}
                                        onClose={() => {
                                            setSelectedMatchId("")
                                            fetchMatches()
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div> :
                    (!loggedIn ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                            <h1 className="text-3xl font-bold mb-2">Please log in to access the admin page 🔐</h1>
                            <p className="text-zinc-500">You must be authenticated as an administrator.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                            <h1 className="text-3xl font-bold mb-2 text-red-500">Access Denied 🚫</h1>
                            <p className="text-zinc-500">You do not have administrative privileges.</p>
                        </div>
                    ))
                }
                <div className="h-10"></div>
                        <DraftForm />
            </div>
        </main>
    );
}