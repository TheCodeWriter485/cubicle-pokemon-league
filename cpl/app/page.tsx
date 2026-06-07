'use client'
import { useEffect, useState } from 'react';
import SideBar from "./sidebar";

export default function Home() {
  const [teams, setTeams] = useState<any[]>([]);
  const [fullTeams, setFullTeams] = useState<any[]>([]);
  const [pokeData, setPokeData] = useState<any[]>([]);
  const bookmarks = [{ id: "1", name: 'Score' },{ id: "2", name: 'MVP' }, { id: "3", name: 'Rules' }];

  useEffect(() => {
    fetch('http://129.80.79.84:3030/team')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTeams(data); });

    fetch('http://129.80.79.84:3030/team/full')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setFullTeams(data); });

    fetch('http://129.80.79.84:3030/pokedata')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPokeData(data); });
  }, []);

  const getLeagueTeams = (league: string) => {
    return teams
      .filter(t => t.League === league)
      .sort((a, b) => b.Elo - a.Elo);
  };

  const getTopPokemon = (league: string) => {
    // Get all team IDs in this league
    const leagueTeamIds = fullTeams
      .filter(t => t.League === league)
      .map(t => t.id.toString());

    // Get pokemon owned by teams in this league
    const leaguePokemon = pokeData.filter(p =>
      p.OwnedBy !== null &&
      fullTeams.some(t =>
        t.League === league &&
        t.Username === p.OwnedBy
      )
    );

    // Sort by Score descending, take top 10
    return leaguePokemon
      .sort((a, b) => (b.Score ?? 0) - (a.Score ?? 0))
      .slice(0, 10);
  };

  const renderLeague = (league: string) => {
    const leagueTeams = getLeagueTeams(league);
    return (
      <div style={{ flex: 1, padding: '0 1rem' }}>
        <h3 style={{ textAlign: 'center', borderBottom: '2px solid #dee2e6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          {league} League
        </h3>
        {leagueTeams.length > 0 ? (
          <ol style={{ paddingLeft: '1.5rem' }}>
            {leagueTeams.map((team) => (
              <li key={team.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{team.TeamName}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6c757d', marginLeft: '8px' }}>
                    {team.Wins}W / {team.Losses}L
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  {team.Username} — Elo: {team.Elo}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ color: '#6c757d', textAlign: 'center' }}>No teams yet</p>
        )}
      </div>
    );
  };

  const renderPokemonLeague = (league: string) => {
    const topPokemon = getTopPokemon(league);
    return (
      <div style={{ flex: 1, padding: '0 1rem' }}>
        <h3 style={{ textAlign: 'center', borderBottom: '2px solid #dee2e6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          {league} League
        </h3>
        {topPokemon.length > 0 ? (
          <ol style={{ paddingLeft: '1.5rem' }}>
            {topPokemon.map((poke, i) => (
              <li key={poke.NamePoke} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>{poke.NamePoke}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6c757d', marginLeft: '8px' }}>
                    Score: {poke.Score ?? 0}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', display: 'flex', gap: '8px' }}>
                  <span>W: {poke.Wins ?? 0}</span>
                  <span>K: {poke.Kills ?? 0}</span>
                  <span>D: {poke.Death ?? 0}</span>
                  <span>Dif: {poke.Diff ?? 0}</span>
                  <span style={{ marginLeft: 'auto' }}>Owner: {poke.OwnedBy}</span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ color: '#6c757d', textAlign: 'center' }}>No Pokémon data yet</p>
        )}
      </div>
    );
  };

  return (
    <main className="page">
      <SideBar bookmarks={bookmarks} />
      <div id="1" className="window">
        <h1>Welcome to the Cubicle Pokemon League!</h1>

        {/* Team League Rankings */}
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Team Standings</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #dee2e6', paddingBottom: '2rem' }}>
          {renderLeague('Major')}
          <div style={{ width: '1px', backgroundColor: '#dee2e6' }} />
          {renderLeague('Intermediate')}
          <div style={{ width: '1px', backgroundColor: '#dee2e6' }} />
          {renderLeague('Minor')}
        </div>

        {/* Top Pokemon Rankings */}
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Top Pokémon</h2>
        <div id="2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #dee2e6', paddingBottom: '2rem' }}>
          {renderPokemonLeague('Major')}
          <div style={{ width: '1px', backgroundColor: '#dee2e6' }} />
          {renderPokemonLeague('Intermediate')}
          <div style={{ width: '1px', backgroundColor: '#dee2e6' }} />
          {renderPokemonLeague('Minor')}
        </div>

        <div id="3">
          <h1 style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>Drafting and Trading Rules</h1>
          <br />1. On Draft Day everyone will pick 10 Pokemon in a snake draft format.
          <br />2. You will be given 95 points to draft with and you can not exceed this limit.
          <br />3. You can only draft 2 Pokemon worth 17 points of more.
          <br />4. Once you have drafted you will have 10 additional trades you can make with the Tier List. You can only make trades on Sundays and after you've completed your battle for the week. First you sell the Pokemon on your team and then buy the new one from the Tier List.
        </div>

        <div>
          <h1 style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>Battling Rules</h1>
          <br />1. Battles are due the Sunday of that week at 11:59pm. Without an extension the ruling of the battle will be decided by the Champion.
          <br />2. All battles are 6v6 and Best of 3 in on our custom server under the format ' '.
          <br />3. All battle replays must be submitted in the #replay channel on the discord. Any battle without a replay will be ruled null
          <br />4. You have to use the team of 10 Pokemon you had the Monday at 12am for your week's battle.
        </div>

        <div>
          <h1 style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>Clauses</h1>
          <br />1. Sleep Cause: You can only put 1 of your opponent's Pokemon to sleep at a time. If the opponent puts their own Pokemon to sleep that does not count toward's your 1 sleep at a time.
          <br />2. Endless Battles: You can not purposely create a scerino where a battle can never end.
          <br />3. Species Clause: You can not have the same species of Pokemon on your team when you battle
          <br />4. Item Clause: All Pokemon on a team must be holding unique items from each other
        </div>

        <div>
          <br />
          <h1 style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>Ban List</h1>
          <br />1. Evasion <br />Items: Bright Powder, Lax Incense <br />Moves: Accupressure, Double Team, Minimize <br />Abilities: Arena Trap, Sand Veil, Snow Cloak, Tangled Feet, Wonder Skin
          <br />2. OHKO Moves
          <br />3. The following moves: Flash, Kinesis, Mud Slap, Sand Attack, Smokescreen, Revival Blessing, Dark Void, Swagger, Hidden Power
          <br />4. The following abilities: Shadow Tag (expect Mega Gengar), Moody
        </div>

        <h1></h1>
      </div>
    </main>
  );
}