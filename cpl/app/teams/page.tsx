'use client'
import { useEffect, useState } from 'react';
import SideBar from "../sidebar";
import { PokemonTeamCard, ItemTeamCard } from "../teamcard";

export default function Teams() {
    const [teams, setTeams] = useState<any[]>([]);
    const [username, setUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const bookmarks = [{ id: 1, name: 'button' }];

    useEffect(() => {
        async function loadData() {
            const authRes = await fetch("http://localhost:3030/auth/status", { credentials: "include" });
            const authData = await authRes.json();
            setLoggedIn(authData.loggedin);
            setUsername(authData.username ?? "");

            const teamRes = await fetch("http://localhost:3030/team/full");
            const teamData = await teamRes.json();
            setTeams(teamData);
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

    const renderTeam = (team: any) => (
        <div key={team.id} style={{ border: '1px solid #000000', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{team.TeamName}</h2>
                <span style={{ fontWeight: 'bold' }}>{team.League}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>{team.Username}</span>
                <span><strong>{team.Points} pts</strong></span>
            </div>

            <p style={{ fontStyle: 'italic', color: '#ffffff', marginTop: '4px' }}>{team.TrainerTip}</p>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div><strong>W</strong><br />{team.Wins}</div>
                <div><strong>L</strong><br />{team.Losses}</div>
                <div><strong>KO</strong><br />{team.KO}</div>
                <div><strong>Dif</strong><br />{team.Dif}</div>
                <div><strong>Elo</strong><br />{team.Elo}</div>
            </div>

            <hr />

            <div>
                <strong>Pokémon:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {team.members.length > 0
                        ? team.members.map((m: any, i: number) => (
                            <PokemonTeamCard
                                key={i}
                                name={m.pokemon}
                                isOwner={loggedIn && team.Username === username}
                                teamId={team.id}
                                username={username}
                            />
                        ))
                        : <span style={{ color: '#6c757d' }}>No Pokémon yet</span>
                    }
                </div>
            </div>

            <div style={{ marginTop: '8px' }}>
                <strong>Items:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {team.items.length > 0
                        ? team.items.map((item: any, i: number) => (
                            <ItemTeamCard
                                key={i}
                                name={item.item}
                                isOwner={loggedIn && team.Username === username}
                                teamId={team.id}
                                username={username}
                            />
                        ))
                        : <span style={{ color: '#6c757d' }}>No items yet</span>
                    }
                </div>
            </div>
        </div>
    );

    return (
        <main className="page">
            <SideBar bookmarks={bookmarks} />
            <div className="window">
                <h1>Teams</h1>
                {sortedTeams().map(group => (
                    <div key={group.league}>
                        <h2 style={{ borderBottom: '2px solid #000000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                            {group.league} League
                        </h2>
                        {group.teams.map(team => renderTeam(team))}
                    </div>
                ))}
            </div>
        </main>
    );
}