'use client'
import { useEffect, useState } from 'react'
import SideBar from "../sidebar";
import Card from "../card";

export default function TierList() {
  const [pokemon, setPokemon] = useState<string[][]>([]);

  useEffect(() => {
    fetch('http://localhost:3030/pokedata')
      .then((res) => res.json())
      .then((res) => {
        let arr: string[][] = Array.from({ length: 21 }, () => []);
        let count = 0;
        while (count < res.length) {
          const pointValue = res[count].PointValue;
          // Ignore anything 21 or higher
          if (pointValue <= 20) {
            arr[pointValue].push(res[count]);
          }
          count += 1;
        }
        setPokemon(arr);
      })
  }, [])

  const bookmarks = [{ id: 1, name: 'button' }]

  // Reverse so we start at 20 and go down to 0
  const reversedTiers = [...pokemon].reverse();

  return (
    <main className="page">
      <SideBar bookmarks={bookmarks} />
      <div className="window">
        <h1>Tier List</h1>
        {reversedTiers.map((tier, index) => {
          const tierIndex = 20 - index;
          return (
            <div key={tierIndex} style={{ marginBottom: '2rem' }}>

              {/* Tier Header */}
              <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', borderBottom: '2px solid #dee2e6', marginBottom: '12px' }}>
                {tierIndex} Points
              </h2>

              {/* Pokemon Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                {tier.length > 0
                  ? tier.map((poke: any, pokeIndex: number) => (
                    <div key={pokeIndex} className="pokemon-card">
                      <Card name={poke.NamePoke} value={poke.PointValue} image={poke.ID} />
                    </div>
                  ))
                  : <p style={{ color: '#6c757d' }}>No Pokémon at this tier</p>
                }
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}