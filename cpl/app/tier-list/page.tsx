'use client'
import { useEffect, useState } from 'react'
import { PokemonClient } from 'pokenode-ts'; // Import the Client
import SideBar from "../sidebar";
import Card from "../card";
import CardGroup from 'react-bootstrap/CardGroup';
//pokecard for later
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

  let tier = "0";
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <SideBar bookmarks={ bookmarks } />
      <div className="window">
        <h1>
          Tier List
        </h1>
<<<<<<< Updated upstream
        <div style={ { display: "flex" } }>
=======
        {/* Beginning of card
        Flex allows grid? */}
        <div style={{ display: "flex"}}>
          {/* map through pokemon database */}
>>>>>>> Stashed changes
          { pokemon.map((tier, tierIndex) => (
            // tier is the point from the database
            // tier index is the value you use to group pokemon
            <div key={ tierIndex }>
              { tier.map((poke: any, pokeIndex: number) => (
                // pokemon card class
                <div key={ pokeIndex } className="pokemon-card">
<<<<<<< Updated upstream
                  <script>console.log(pokeIndex)</script>
                  <Card name={ poke.NamePoke } value={ poke.PointValue } image={ poke.ID } />
=======
                {/* Using poke as the object, Card takes a string for name
                takes a number for value
                and ID for image */}
                  <Card name={ poke.NamePoke } value={ poke.PointValue } image={poke.ID} />
>>>>>>> Stashed changes
                </div>
              )) }
            </div>
          )) }
        </div>
      </div>
    </main>
  );
}