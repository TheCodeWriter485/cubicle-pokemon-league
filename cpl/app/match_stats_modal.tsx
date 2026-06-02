'use client'

type Team = {
    id: number | string
    Username?: string
    TeamName?: string
}

type RoundPlayer = {
    pokemon?: string[]
    diff?: number
    kills?: number
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
    p1?: {
        round_wins?: number
    }
    p2?: {
        round_wins?: number
    }
}

export type MatchStatsMatch = {
    match_id: number | string
    week: string
    team_1?: number | string
    team_2?: number | string
    team_1_name?: string
    team_2_name?: string
    round1_url?: string | null
    round2_url?: string | null
    round3_url?: string | null
    match_data?: MatchData | string | null | unknown
}

const parseStoredMatchData = (matchData: MatchStatsMatch["match_data"]): MatchData | null => {
    if (!matchData) return null;
    if (typeof matchData === "object") return matchData as MatchData;
    if (typeof matchData !== "string") return null;

    try {
        return JSON.parse(matchData);
    } catch (error) {
        console.warn("Could not parse match data:", error);
        return null;
    }
}

const sameId = (a?: number | string, b?: number | string) => a?.toString() === b?.toString();

const sumRoundValue = (rounds: RoundData[], side: "p1" | "p2", key: "kills" | "diff") => {
    return rounds.reduce((total, round) => total + (Number(round?.[side]?.[key]) || 0), 0);
}

export default function MatchStatsModal({ match, teams, onClose }: { match: MatchStatsMatch, teams: Team[], onClose: () => void }) {
    const teamName = (side: 1 | 2) => {
        const joinedName = side === 1 ? match.team_1_name : match.team_2_name;
        const teamId = side === 1 ? match.team_1 : match.team_2;
        const team = teams.find(t => sameId(t.id, teamId));

        return joinedName || team?.TeamName || team?.Username || `Team ${teamId}`;
    }

    const matchData = parseStoredMatchData(match.match_data);
    const rounds = Array.isArray(matchData?.round_data) ? matchData.round_data : [];
    const hasStats = rounds.length > 0;
    const replayUrls = [
        { round: 1, url: match.round1_url?.trim() },
        { round: 2, url: match.round2_url?.trim() },
        { round: 3, url: match.round3_url?.trim() }
    ].filter((replay): replay is { round: number, url: string } => Boolean(replay.url));
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
        <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl text-zinc-900 dark:text-zinc-100">
                <button
                    type="button"
                    aria-label="Close match stats"
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {teamName(1)} vs {teamName(2)}
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            Week of {new Date(match.week).toLocaleDateString()}
                        </p>
                    </div>

                    {replayUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {replayUrls.map(({ round, url }) => (
                                <a
                                    key={url}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950"
                                >
                                    Round {round} Replay
                                </a>
                            ))}
                        </div>
                    )}

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
                                    <div className="mt-1 text-sm font-medium">{teamName(1)}</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Rounds Won</div>
                                    <div className="mt-2 text-3xl font-bold">{team2Wins}</div>
                                    <div className="mt-1 text-sm font-medium">{teamName(2)}</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Total KO</div>
                                    <div className="mt-2 text-3xl font-bold">{sumRoundValue(rounds, "p1", "kills")}</div>
                                    <div className="mt-1 text-sm font-medium">{teamName(1)}</div>
                                </div>
                                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Total KO</div>
                                    <div className="mt-2 text-3xl font-bold">{sumRoundValue(rounds, "p2", "kills")}</div>
                                    <div className="mt-1 text-sm font-medium">{teamName(2)}</div>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-semibold">Round</th>
                                            <th className="px-4 py-3 text-sm font-semibold">{teamName(1)}</th>
                                            <th className="px-4 py-3 text-sm font-semibold">{teamName(2)}</th>
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
            </div>
        </div>
    );
}
