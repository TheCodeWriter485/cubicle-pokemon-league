'use client'
import { useEffect, useState } from 'react';
import SideBar from "./sidebar";

export default function Home() {
  const [teams, setTeams] = useState<any[]>([]);
  const bookmarks = [{ id: "please", name: 'halep' }, { id: "test", name: 'Test Button' }];

  useEffect(() => {
    fetch('http://localhost:3030/team')
      .then(res => res.json())
      .then(data => setTeams(data));
  }, []);

  const getLeagueTeams = (league: string) => {
    return teams
      .filter(t => t.League === league)
      .sort((a, b) => b.Elo - a.Elo);
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
            {leagueTeams.map((team, i) => (
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

  const bookmarks2 = [{ id: "please", name: 'halep' }, { id: "test", name: 'Test Button' }]

  return (
    <main className="page">
      <SideBar bookmarks={bookmarks} />
      <div id="main" className="window">
        <h1>Welcome to the Cubicle Pokemon League!</h1>

        {/* League Rankings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #dee2e6', paddingBottom: '2rem' }}>
          {renderLeague('Major')}
          <div style={{ width: '1px', backgroundColor: '#dee2e6' }} />
          {renderLeague('Intermediate')}
          <div style={{ width: '1px', backgroundColor: '#dee2e6' }} />
          {renderLeague('Minor')}
        </div>

        <h1 id="please"> ;-;</h1>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pharetra justo velit, et aliquet est congue in.
          Aliquam posuere odio a nulla vestibulum, vel fringilla mauris vestibulum. Donec condimentum ipsum metus, mollis faucibus mi efficitur eu.
          Praesent venenatis bibendum mauris ac efficitur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida convallis elit,
          vitae rutrum ex commodo vel. Donec semper viverra nisi. Nunc iaculis, quam sed sagittis pulvinar, risus justo bibendum tellus, vitae aliquam.
        </div>

        <div>
          urna erat id justo. Cras dapibus consequat felis, vel imperdiet elit pretium ut. Morbi varius, lacus non pharetra scelerisque, elit diam
          accumsan sapien, eget dignissim odio purus id libero. Suspendisse vulputate nisi massa, a laoreet metus imperdiet tempus. Mauris at rhoncus
          eros, et feugiat felis. Vivamus quis metus volutpat, maximus lectus vitae, interdum augue.
        </div>

        <div>
          Cras molestie tortor vel tellus iaculis congue. Nunc non ex neque. Praesent lobortis finibus lorem, vitae blandit risus sollicitudin sed.
          Proin viverra viverra molestie. Aliquam et consectetur velit. Nulla luctus mauris nulla, vel maximus justo vulputate nec. In congue tincidunt
          urna at lacinia. Etiam nec ante at turpis vulputate semper ac quis enim.
          Curabitur a elit odio. Duis sit amet ante turpis. In pulvinar vel massa in luctus. Aliquam erat volutpat. Vivamus et nisl nec lorem imperdiet
          efficitur. Suspendisse eget nisl sed dolor consequat eleifend in ut nulla. Praesent aliquet, purus vitae rutrum dapibus, quam nisi mollis lorem,
          eu ornare tortor ante eget dui. In a euismod metus, eget efficitur dolor. Donec dictum ligula id vestibulum laoreet. Nullam ultricies maximus
          eros in ullamcorper. Curabitur convallis, magna congue commodo dictum, sem dui eleifend augue, et condimentum sem nisl ut quam. Integer vel
          diam dolor.
          Quisque eget finibus lectus. Curabitur feugiat non purus ullamcorper luctus.
        </div>

        <div>
          Quisque et posuere justo. Morbi sed nibh eu libero pretium sollicitudin nec at lorem. Praesent quis lacus nec turpis volutpat sollicitudin
          eget nec erat. Nam sed enim auctor, blandit justo sed, euismod diam. Nulla molestie maximus orci, eu feugiat nunc fermentum ac. Praesent ligula
          diam, dictum eget nunc pharetra, pellentesque pulvinar massa. Sed vitae nunc id quam varius iaculis et non libero. Nulla rutrum cursus imperdiet.
          Phasellus non lectus augue. Vivamus venenatis eros elit, ut tincidunt purus posuere sit amet.
        </div>

        <div>
          Donec vel mi turpis. Maecenas efficitur, metus iaculis accumsan vulputate, nulla augue consectetur tortor, at ullamcorper diam enim at ex.
          Quisque at congue lorem. Sed in dignissim dui, imperdiet interdum sem. Duis blandit sem a risus viverra congue. In congue, nibh non euismod viverra,
          libero ipsum lacinia arcu, vel ultrices nisi orci id justo. Pellentesque in dignissim enim, nec condimentum nisl. Nullam at orci nulla. Aliquam in
          nisi mollis, bibendum nibh rhoncus, gravida neque. Praesent dignissim elit vitae arcu congue, porta mollis diam egestas. Etiam rutrum id orci eget
          finibus. Cras eu nunc et erat congue ultricies in quis lacus.
        </div>

        <h1 id="test"> hi</h1>
      </div>
    </main>
  );
}