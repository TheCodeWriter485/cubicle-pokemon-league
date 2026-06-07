'use client'
import { useEffect, useState } from 'react';
import SideBar from "../sidebar";
import { PokemonTeamCard, ItemTeamCard } from "../teamcard";
import MatchStatsModal from "../match_stats_modal";

type Match = {
    match_id: number | string
    week: string
    done?: boolean | number
    winner?: string
    team_1?: number | string
    team_2?: number | string
    team_1_name?: string
    team_2_name?: string
    round1_url?: string | null
    round2_url?: string | null
    round3_url?: string | null
    match_data?: unknown
}

type TeamMember = {
    pokemon: string
}

type TeamItem = {
    item: string
}

type Team = {
    id: number | string
    Username?: string
    TeamName?: string
    League?: string
    Points?: number | string
    TrainerTip?: string
    Wins?: number | string
    Losses?: number | string
    KO?: number | string
    Dif?: number | string
    Elo?: number | string
    ELO?: number | string
    members: TeamMember[]
    items: TeamItem[]
}

const sameId = (a?: number | string, b?: number | string) => a?.toString() === b?.toString();

function TeamCard({ team, matches, teams, loggedIn, username, onSelectMatch }: { team: Team, matches: Match[], teams: Team[], loggedIn: boolean, username: string, onSelectMatch: (match: Match) => void }) {
    const [showMatches, setShowMatches] = useState(false);

    const getTeamMatches = () => {
        return matches
            .filter(m => sameId(m.team_1, team.id) || sameId(m.team_2, team.id))
            .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
    };

    const getOpponentName = (match: Match) => {
        const opponentId = sameId(match.team_1, team.id) ? match.team_2 : match.team_1;
        const opponent = teams.find(t => sameId(t.id, opponentId));
        return opponent ? opponent.TeamName : (sameId(match.team_1, team.id) ? match.team_2_name : match.team_1_name) || `Team ${opponentId}`;
    };

    const teamMatches = getTeamMatches();

    return (
        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{team.TeamName}</h2>
                <span style={{ fontWeight: 'bold' }}>{team.League}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>{team.Username}</span>
                <span><strong>{team.Points} pts</strong></span>
            </div>

            <p style={{ fontStyle: 'italic', color: '#6c757d', marginTop: '4px' }}>{team.TrainerTip}</p>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><strong>W</strong><br />{team.Wins}</div>
                <div><strong>L</strong><br />{team.Losses}</div>
                <div><strong>KO</strong><br />{team.KO}</div>
                <div><strong>Dif</strong><br />{team.Dif}</div>
                <div><strong>Elo</strong><br />{team.Elo}</div>
            </div>

            <hr />

            {/* Pokemon */}
            <div>
                <strong>Pokémon:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {team.members.length > 0
                        ? team.members.map((m, i: number) => (
                            <PokemonTeamCard
                                key={i}
                                name={m.pokemon}
                                isOwner={loggedIn && team.Username === username}
                                teamId={Number(team.id)}
                                username={username}
                            />
                        ))
                        : <span style={{ color: '#6c757d' }}>No Pokémon yet</span>
                    }
                </div>
            </div>

            {/* Items */}
            <div style={{ marginTop: '8px' }}>
                <strong>Items:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {team.items.length > 0
                        ? team.items.map((item, i: number) => (
                            <ItemTeamCard
                                key={i}
                                name={item.item}
                                isOwner={loggedIn && team.Username === username}
                                teamId={Number(team.id)}
                                username={username}
                            />
                        ))
                        : <span style={{ color: '#6c757d' }}>No items yet</span>
                    }
                </div>
            </div>

            {/* Matches Dropdown */}
            {teamMatches.length > 0 && (
                <>
                    <hr />
                    <div
                        onClick={() => setShowMatches(!showMatches)}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                    >
                        <strong>Matches</strong>
                        <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>
                            {showMatches ? '▲' : '▼'}
                        </span>
                    </div>

                    {showMatches && (
                        <div style={{ marginTop: '8px' }}>
                            {teamMatches.map((match) => {
                                const won = match.winner === team.TeamName;
                                const opponent = getOpponentName(match);

                                let backgroundColor = '#2a2a2a';
                                let borderColor = '#444';
                                if (match.done) {
                                    backgroundColor = won ? '#1a3a1a' : '#3a1a1a';
                                    borderColor = won ? '#28a745' : '#dc3545';
                                }

                                return (
                                    <div
                                        key={match.match_id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => onSelectMatch(match)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                onSelectMatch(match);
                                            }
                                        }}
                                        style={{
                                            backgroundColor,
                                            border: `1px solid ${borderColor}`,
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            marginBottom: '6px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ color: 'white' }}>
                                            <span style={{ fontWeight: 'bold' }}>vs {opponent}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#aaa', marginLeft: '8px' }}>
                                                Week of {new Date(match.week).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            {match.done ? (
                                                <span style={{ fontWeight: 'bold', color: won ? '#28a745' : '#dc3545' }}>
                                                    {won ? 'WIN' : 'LOSS'}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Upcoming</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [username, setUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const bookmarks = [
    { id: "league-Major", name: 'Major' },
    { id: "league-Intermediate", name: 'Inter' },
    { id: "league-Minor", name: 'Minor' }
];

    useEffect(() => {
        async function loadData() {
            const authRes = await fetch("http://129.80.79.84:3030/auth/status", { credentials: "include" });
            const authData = await authRes.json();
            setLoggedIn(authData.loggedin);
            setUsername(authData.username ?? "");

            const teamRes = await fetch("http://129.80.79.84:3030/team/full");
            const teamData = await teamRes.json();
            setTeams(teamData);

            const matchRes = await fetch("http://129.80.79.84:3030/matches");
            const matchData = await matchRes.json();
            setMatches(matchData);
        }
        loadData();
    }, []);

    const sortedTeams = () => {
        const leagueOrder = ['Major', 'Intermediate', 'Minor'];

        if (loggedIn) {
            const userTeam = teams.find(t => t.Username === username);
            const userLeague = userTeam?.League;
            const orderedLeagues = userLeague
                ? [userLeague, ...leagueOrder.filter(l => l !== userLeague)]
                : leagueOrder;

            return orderedLeagues.map(league => ({
                league,
                teams: [
                    ...teams.filter(t => t.League === league && t.Username === username),
                    ...teams.filter(t => t.League === league && t.Username !== username)
                ]
            })).filter(group => group.teams.length > 0);
        } else {
            return leagueOrder.map(league => ({
                league,
                teams: teams.filter(t => t.League === league)
            })).filter(group => group.teams.length > 0);
        }
    };

    return (
        <main className="page">
            <SideBar bookmarks={bookmarks} />
            <div className="window">
                <h1>Teams</h1>
                {sortedTeams().map(group => (
                    <div key={group.league} id={`league-${group.league}`}>
                        <h2 style={{ borderBottom: '2px solid #dee2e6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                            {group.league} League
                        </h2>
                        {group.teams.map(team => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                matches={matches}
                                teams={teams}
                                loggedIn={loggedIn}
                                username={username}
                                onSelectMatch={setSelectedMatch}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {selectedMatch && <MatchStatsModal match={selectedMatch} teams={teams} onClose={() => setSelectedMatch(null)} />}
        </main>
    );
}
