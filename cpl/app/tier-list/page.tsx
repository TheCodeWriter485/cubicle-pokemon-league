'use client'
import { useEffect, useState } from 'react'
import { PokemonClient } from 'pokenode-ts'; // Import the Client
import SideBar from "../sidebar";
//pokecard for later
function Headline(props: { name: string, value: number })
{
  return (
    <h1>
      { props.name }
      <h3>
        { props.value }
      </h3>
    </h1>
  );
}
export default function TierList()
{
  const [pokemon, setPokemon] = useState<string[][]>([]);
  const api = new PokemonClient();
  //need function that returns a Div for each invidual Pokemon and a Div that returns the entire tier they're nested in
  
  useEffect(() =>
  {
    fetch('http://localhost:3030/pokedata')
      .then((res) => res.json())
      .then((res) =>
      {
        let arr: string[][] = Array.from({ length: 22 }, () => []);
        let count = 0;
        setPokemon(arr);
        while (count < res.length)
        {
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
      <SideBar bookmarks={ bookmarks } />
      <div className="window">
        <h1>
          Tier List
        </h1>
        <h2>
          { pokemon.map((tier, tierIndex) => (
            <div key={ tierIndex }>
              { tier.map((poke: any, pokeIndex: number) => (
                <div key={ pokeIndex } className="pokemon-card">
                  <Headline name={ poke.NamePoke } value={ poke.PointValue } />
                </div>
              )) }
            </div>
          )) }
        </h2>
      </div>
    </main>
  );
}