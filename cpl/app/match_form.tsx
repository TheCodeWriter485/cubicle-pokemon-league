'use client'
import { useState } from 'react'
import { parseMatchData } from './utils';

type RoundPlayer = {
    name: string
    showdown_name?: string
    pokemon: string[]
    diff: number
    kills: number
    pokemon_left: number
    winner: boolean
}

type RoundData = {
    id: string
    source_url?: string
    pokemon_kills: Record<string, number>
    pokemon_deaths: Record<string, number>
    winner: string
    p1: RoundPlayer
    p2: RoundPlayer
}

type MatchData = {
    round_ids: string[]
    round_data: RoundData[]
    total_pokemon_kills: Record<string, number>[]
    total_pokemon_deaths: Record<string, number>[]
    match_winner: string
    p1: {
        name: string
        round_wins: number
        winner: boolean
    }
    p2: {
        name: string
        round_wins: number
        winner: boolean
    }
}

type Match = {
    match_id: number | string
    match_data?: unknown
    round1_url?: string | null
    round2_url?: string | null
    round3_url?: string | null
    team_1?: number | string
    team_2?: number | string
    team_1_name?: string
    team_2_name?: string
    team_1_username?: string
    team_2_username?: string
    team_1_showdown_acct?: string | null
    team_2_showdown_acct?: string | null
}

const parseStoredMatchData = (matchData: unknown): MatchData | null => {
    if (!matchData) return null;
    if (typeof matchData === "object") return matchData as MatchData;
    if (typeof matchData !== "string") return null;
    try {
        return JSON.parse(matchData);
    } catch (error) {
        console.warn("Could not parse stored match data:", error);
        return null;
    }
}

const toShowdownId = (value?: string | number | null) => {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

const cleanReplayUrl = (url: string) => {
    return url.trim().split("?")[0].replace(/\.json$/, "");
}

// Parse a Showdown HTML replay file into the same format as the JSON API
const parseHtmlReplay = (html: string): { id: string, log: string, p1: string, p2: string } | null => {
    try {
        // Extract battle log from <script type="text/plain" class="battle-log-data">
        const logMatch = html.match(/<script[^>]+class="battle-log-data"[^>]*>([\s\S]*?)<\/script>/);
        if (!logMatch) return null;
        const log = logMatch[1];

        // Extract player names from |player|p1|Name| and |player|p2|Name|
        const p1Match = log.match(/\|player\|p1\|([^|]+)\|/);
        const p2Match = log.match(/\|player\|p2\|([^|]+)\|/);
        if (!p1Match || !p2Match) return null;

        // Extract replay id from the hidden input
        const idMatch = html.match(/name="replayid" value="([^"]+)"/);
        const id = idMatch ? idMatch[1] : `html-${Date.now()}`;

        return {
            id,
            log,
            p1: p1Match[1],
            p2: p2Match[1]
        };
    } catch (err) {
        console.error("Failed to parse HTML replay:", err);
        return null;
    }
}

export default function MatchForm({ match, onClose }: { match?: Match, onClose?: () => void }) {
    const teamName = (side: 1 | 2) => {
        if (!match) return "";
        const name = side === 1 ? match.team_1_name : match.team_2_name;
        const username = side === 1 ? match.team_1_username : match.team_2_username;
        const id = side === 1 ? match.team_1 : match.team_2;
        return name || username || `Team ${id}`;
    }

    // Match players by showdown_acct
    const teamCandidates = (side: 1 | 2) => {
        if (!match) return [];
        const showdownAcct = side === 1 ? match.team_1_showdown_acct : match.team_2_showdown_acct;
        return [showdownAcct]
            .map(candidate => toShowdownId(candidate))
            .filter(Boolean);
    }

    const matchedSide = (playerName?: string) => {
        const playerId = toShowdownId(playerName);
        if (!playerId) return null;
        if (teamCandidates(1).includes(playerId)) return 1;
        if (teamCandidates(2).includes(playerId)) return 2;
        return null;
    }

    const playerMatchedSide = (player: RoundPlayer) => {
        return matchedSide(player.showdown_name || player.name);
    }

    // Winner matching now checks showdown_acct first, then team names
    const winnerMatchedSide = (winnerName: string) => {
        const winnerId = toShowdownId(winnerName);

        // Check showdown_acct match first
        if (teamCandidates(1).includes(winnerId)) return 1;
        if (teamCandidates(2).includes(winnerId)) return 2;

        // Fall back to team name match
        if (winnerName === teamName(1)) return 1;
        if (winnerName === teamName(2)) return 2;

        return matchedSide(winnerName);
    }

    const displayPlayer = (player: RoundPlayer, side: 1 | 2): RoundPlayer => ({
        ...player,
        showdown_name: player.showdown_name || player.name,
        name: teamName(side)
    });

    const validateRoundForMatch = (roundData: RoundData): string | null => {
        if (!match) return "Select a match before adding replay data.";
        if (teamCandidates(1).length === 0) return `${teamName(1)} is missing a Showdown username.`;
        if (teamCandidates(2).length === 0) return `${teamName(2)} is missing a Showdown username.`;

        const p1Side = playerMatchedSide(roundData.p1);
        const p2Side = playerMatchedSide(roundData.p2);

        if (!p1Side || !p2Side) {
            const p1Name = roundData.p1.showdown_name || roundData.p1.name;
            const p2Name = roundData.p2.showdown_name || roundData.p2.name;
            return `Replay players "${p1Name}" and "${p2Name}" do not match ${teamName(1)} (${match.team_1_showdown_acct}) and ${teamName(2)} (${match.team_2_showdown_acct}).`;
        }

        if (p1Side === p2Side) {
            const p1Name = roundData.p1.showdown_name || roundData.p1.name;
            const p2Name = roundData.p2.showdown_name || roundData.p2.name;
            return `Replay players "${p1Name}" and "${p2Name}" both match the same team.`;
        }

        if (!winnerMatchedSide(roundData.winner)) {
            return `Replay winner "${roundData.winner}" does not match either team. Expected ${match.team_1_showdown_acct} or ${match.team_2_showdown_acct}.`;
        }

        return null;
    }

    const normalizeRoundForMatch = (roundData: RoundData): RoundData => {
        if (!match) return roundData;

        const p1Side = playerMatchedSide(roundData.p1);
        const p2Side = playerMatchedSide(roundData.p2);
        const winnerSide = winnerMatchedSide(roundData.winner);

        if (p1Side === 2 || p2Side === 1) {
            return {
                ...roundData,
                winner: winnerSide ? teamName(winnerSide) : roundData.winner,
                p1: displayPlayer(roundData.p2, 1),
                p2: displayPlayer(roundData.p1, 2)
            };
        }

        return {
            ...roundData,
            winner: winnerSide ? teamName(winnerSide) : roundData.winner,
            p1: p1Side === 1 ? displayPlayer(roundData.p1, 1) : roundData.p1,
            p2: p2Side === 2 ? displayPlayer(roundData.p2, 2) : roundData.p2
        };
    }

    const initialRound = (roundIndex: number) => {
        if (!match) return null;
        const storedMatchData = parseStoredMatchData(match.match_data);
        const storedRounds = storedMatchData?.round_data || [];
        const urls = [match.round1_url, match.round2_url, match.round3_url];
        if (!storedRounds[roundIndex]) return null;
        return {
            ...normalizeRoundForMatch(storedRounds[roundIndex]),
            source_url: cleanReplayUrl(urls[roundIndex] || "")
        };
    }

    const [round1, setRound1] = useState<RoundData | null>(() => initialRound(0));
    const [round2, setRound2] = useState<RoundData | null>(() => initialRound(1));
    const [round3, setRound3] = useState<RoundData | null>(() => initialRound(2));
    const [showRound1, setShowRound1] = useState(false);
    const [showRound2, setShowRound2] = useState(false);
    const [showRound3, setShowRound3] = useState(false);
    const [round1Url, setRound1Url] = useState(match?.round1_url || "");
    const [round2Url, setRound2Url] = useState(match?.round2_url || "");
    const [round3Url, setRound3Url] = useState(match?.round3_url || "");
    const [formError, setFormError] = useState("");

    const buildMatchData = (rounds: RoundData[]): MatchData => {
        const round_ids = rounds.map(round => round.id);
        const total_pokemon_kills_temp = rounds.map(round => round.pokemon_kills);
        const total_pokemon_deaths_temp = rounds.map(round => round.pokemon_deaths);
        const p1 = { name: teamName(1), round_wins: 0, winner: false }
        const p2 = { name: teamName(2), round_wins: 0, winner: false }

        rounds.forEach(round => {
            p1.round_wins += round.p1.winner ? 1 : 0;
            p2.round_wins += round.p2.winner ? 1 : 0;
        });

        let match_winner = "";
        if (p1.round_wins > p2.round_wins) { match_winner = p1.name; p1.winner = true; }
        else if (p2.round_wins > p1.round_wins) { match_winner = p2.name; p2.winner = true; }

        return {
            round_ids,
            round_data: rounds,
            total_pokemon_kills: total_pokemon_kills_temp,
            total_pokemon_deaths: total_pokemon_deaths_temp,
            match_winner, p1, p2
        };
    }

    const processRoundData = (data: unknown, round: number, sourceUrl: string) => {
        const parsedRound = parseMatchData(data) as RoundData;
        const validationError = validateRoundForMatch(parsedRound);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        const normalizedRound = {
            ...normalizeRoundForMatch(parsedRound),
            source_url: sourceUrl
        };

        if (round === 1) { setRound1Url(sourceUrl); setRound1(normalizedRound); setShowRound1(true); }
        else if (round === 2) { setRound2Url(sourceUrl); setRound2(normalizedRound); setShowRound2(true); }
        else if (round === 3) { setRound3Url(sourceUrl); setRound3(normalizedRound); setShowRound3(true); }
    }

    const fetch_round_data = (url: string, round: number) => {
        const replayUrl = cleanReplayUrl(url);
        if (!replayUrl) return;
        setFormError("");

        fetch(`${replayUrl}.json`)
            .then((res) => res.json())
            .then((res) => processRoundData(res, round, replayUrl))
            .catch((error) => {
                console.error(error);
                setFormError("Could not load replay data. Check that the replay URL is valid and public.");
            });
    }

    const handle_html_file = (file: File, round: number) => {
        setFormError("");
        const reader = new FileReader();
        reader.onload = (e) => {
            const html = e.target?.result as string;
            const parsed = parseHtmlReplay(html);
            if (!parsed) {
                setFormError("Could not parse the HTML replay file. Make sure it's a valid Showdown replay.");
                return;
            }

            // Convert to the same format as the JSON API response
            const fakeJsonData = {
                id: parsed.id,
                log: parsed.log,
                p1: parsed.p1,
                p2: parsed.p2
            };

            processRoundData(fakeJsonData, round, `html-file:${file.name}`);
        };
        reader.readAsText(file);
    }

    const validateSubmission = () => {
        const roundEntries = [
            { roundNumber: 1, round: round1, url: round1Url, required: true },
            { roundNumber: 2, round: round2, url: round2Url, required: true },
            { roundNumber: 3, round: round3, url: round3Url, required: false }
        ];
        const loadedRounds: RoundData[] = [];
        const loadedReplayIds = new Set<string>();

        for (const entry of roundEntries) {
            if (entry.required && !entry.url) return { error: `Round ${entry.roundNumber} URL or file is required.`, rounds: [] };
            if (entry.url && !entry.round) return { error: `Round ${entry.roundNumber} data has not been loaded yet.`, rounds: [] };
            if (!entry.round) continue;

            const validationError = validateRoundForMatch(entry.round);
            if (validationError) return { error: `Round ${entry.roundNumber}: ${validationError}`, rounds: [] };

            if (loadedReplayIds.has(entry.round.id)) return { error: `Round ${entry.roundNumber} uses a replay that has already been added.`, rounds: [] };

            loadedReplayIds.add(entry.round.id);
            loadedRounds.push(entry.round);
        }

        const p1Wins = loadedRounds.filter(round => round.p1.winner).length;
        const p2Wins = loadedRounds.filter(round => round.p2.winner).length;

        if (loadedRounds.length < 2) return { error: "At least two rounds are required.", rounds: [] };
        if (p1Wins === p2Wins) return { error: "Match must have a winner. Add the deciding round.", rounds: [] };
        if (Math.max(p1Wins, p2Wins) < 2) return { error: "A team must win at least two rounds.", rounds: [] };

        return { error: "", rounds: loadedRounds };
    }

    const round_data_preview = (round_data: RoundData) => (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm mt-4">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Team</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Showdown</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">KO</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Diff</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Pokemon Left</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Pokemon</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {[round_data.p1, round_data.p2].map((player, i) => (
                        <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{player.name} {player.winner ? "(Winner)" : ""}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{player.showdown_name || player.name}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{player.kills}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{player.diff}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{player.pokemon_left}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 italic">{player.pokemon.join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Pokemon</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Kills</th>
                        <th className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Deaths</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {[...round_data.p1.pokemon, ...round_data.p2.pokemon].map((pokemon) => (
                        <tr key={pokemon} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{pokemon}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{round_data.pokemon_kills[pokemon] ?? 0}</td>
                            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{round_data.pokemon_deaths[pokemon] ?? 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!match) return;

        setFormError("");
        const validation = validateSubmission();
        if (validation.error) { setFormError(validation.error); return; }

        const match_data = buildMatchData(validation.rounds);

        try {
            const response = await fetch('/api/matches/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    match_id: match.match_id,
                    match_data,
                    winner: match_data.match_winner,
                    round1_url: round1Url,
                    round2_url: round2Url,
                    round3_url: round3Url
                })
            });
            if (response.ok) {
                alert("Match updated successfully!");
                if (onClose) onClose();
            } else {
                const error = await response.json().catch(() => null);
                setFormError(error?.error || "Could not update match data.");
            }
        } catch (error) {
            console.error(error);
            setFormError("Could not update match data.");
        }
    };

    const roundInput = (
        round: number,
        url: string,
        setUrl: (v: string) => void,
        roundData: RoundData | null,
        setShow: (v: boolean) => void,
        show: boolean,
        label: string
    ) => (
        <div className="space-y-2">
            <label htmlFor={`round${round}`}>{label}</label>

            {/* URL input */}
            <div className="flex gap-2 flex-wrap">
                <input
                    className="bg-zinc-50 text-black rounded-md p-2 flex-1 min-w-0"
                    id={`round${round}`}
                    placeholder="Paste Showdown replay URL..."
                    value={url.startsWith('html-file:') ? '' : url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    className="bg-orange-400 text-white rounded-md p-2 hover:bg-orange-500 cursor-pointer whitespace-nowrap"
                    type="button"
                    onClick={() => fetch_round_data(url, round)}
                >
                    Load URL
                </button>
            </div>

            {/* HTML file upload */}
            <div className="flex gap-2 items-center flex-wrap">
                <span className="text-sm text-zinc-500">or upload HTML file:</span>
                <input
                    type="file"
                    accept=".html"
                    className="text-sm"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handle_html_file(file, round);
                    }}
                />
            </div>

            {/* Show/hide loaded data */}
            {roundData && (
                <button
                    className="bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 cursor-pointer"
                    type="button"
                    onClick={() => setShow(!show)}
                >
                    {show ? "Hide" : "Show"} Round {round} Data
                    {url.startsWith('html-file:') && <span className="ml-2 text-xs opacity-75">(from file)</span>}
                </button>
            )}
            {roundData && show && round_data_preview(roundData)}
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Match Data Input Form</h1>

            {match && (
                <div className="mb-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-sm">
                    <span className="font-semibold">{teamName(1)}</span>
                    <span className="text-zinc-500 ml-1">({match.team_1_showdown_acct || 'no showdown acct'})</span>
                    <span className="mx-2 text-zinc-400">vs</span>
                    <span className="font-semibold">{teamName(2)}</span>
                    <span className="text-zinc-500 ml-1">({match.team_2_showdown_acct || 'no showdown acct'})</span>
                </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {formError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                        {formError}
                    </div>
                )}

                {roundInput(1, round1Url, setRound1Url, round1, setShowRound1, showRound1, "Round 1:")}
                {roundInput(2, round2Url, setRound2Url, round2, setShowRound2, showRound2, "Round 2:")}
                {roundInput(3, round3Url, setRound3Url, round3, setShowRound3, showRound3, "Round 3 (optional):")}

                <button className="bg-blue-400 text-white rounded-md p-2 hover:bg-blue-500 cursor-pointer mt-4" type="submit">
                    Submit Final Data
                </button>
            </form>
        </div>
    );
}