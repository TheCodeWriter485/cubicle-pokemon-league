'use client'
import { useEffect, useState } from 'react'
import { PokemonClient } from 'pokenode-ts';
import SideBar from "../sidebar";
import Card from "../card";
import CardGroup from 'react-bootstrap/CardGroup';

export default function TierList() {
  const [pokemon, setPokemon] = useState<string[][]>([]);
  const api = new PokemonClient();

  useEffect(() => {
    fetch('http://localhost:3030/pokedata')
      .then((res) => res.json())
      .then((res) => {
        let arr: string[][] = Array.from({ length: 22 }, () => []);
        let count = 0;
        setPokemon(arr);
        while (count < res.length) {
          arr[res[count].PointValue].push(res[count]);
          count += 1;
        }

        res = arr
        setPokemon(res);
      })

  }, [pokemon])

  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <SideBar bookmarks={bookmarks} />
      <div className="window">
        <h1>Tier List</h1>
        <div style={{ display: "flex" }}>
          {pokemon.map((tier, tierIndex) => (
            <div key={tierIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

    {/* Tier Header */}
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '8px' }}>
        {tierIndex}
    </div>

    {tier.map((poke: any, pokeIndex: number) => (
        <div key={pokeIndex} className="pokemon-card">
            <Card name={poke.NamePoke} value={poke.PointValue} image={poke.ID} />
        </div>
    ))}
</div>
          ))}
        </div>
      </div>
    </main>
  );
}