'use client'
import { useEffect, useState } from 'react'
import { PokemonClient } from 'pokenode-ts'; // Import the Client
import SideBar from "../sidebar";

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

        /*if(pokemon != null){
            api.getPokemonByName(pokemon[1].PointValue)
            .then((data) => console.log(data.stats)) // will output "Luxray"
            .catch((error) => console.error(error));
        }*/

        /*{pokemon.map((tier, tierIndex) => (
          <div key={tierIndex}>
            {tier.map((poke: any, pokeIndex: number) => (
              <div key={pokeIndex} className="pokemon-card">
                <img src={poke.sprite} alt={poke.name} />
                <h3>{poke.NamePoke}</h3>
              </div>
            ))}
          </div>
        ))} */

      })

  }, [pokemon])

  function Car({ poke })
  {
    return (
      <h2>I am a { poke } Car!</h2>
    );
  }
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


                  <h3>{ poke.PointValue }</h3>
                  <h3>{ poke.NamePoke }</h3>
                </div>
              )) }
            </div>
          )) }
        </h2>
      </div>
    </main>
  );
}
