'use client'
import { useEffect, useState } from 'react'

export default function TierList()
{

  const [pokemon, setPokemon] = useState(null);

  useEffect(() =>
  {
    fetch('http://localhost:3030/pokedata')
      .then((res) => res.json())
      .then((res) =>
      {
        let arr: string[][] = Array.from({ length: 22 }, () => []);
        let count = 0;
        //make temp array of array
        // if loop to sort pokemon by pointvalue
        // sort pokemon
        // setPokemon(res)
        // Issue #1 v

        while (count < res.length)
        {
          arr[res[count].PointValue].push(res[count]);
          count += 1;
        }

        res = arr

        setPokemon(res)
        console.log(res)
      })
  }, [])

  //need function that returns a Div for each invidual Pokemon and a Div that returns the entire tier they're nested in
  const displayMon = () =>
  {
    return
  }

  return (
    <main className="page">
      <div className="sideNav">

      </div>
      <div className="window">

        <h1>
          Tier List
        </h1>
        <p>
          { JSON.stringify(pokemon) }
        </p>
      </div>
    </main>
  );
}
