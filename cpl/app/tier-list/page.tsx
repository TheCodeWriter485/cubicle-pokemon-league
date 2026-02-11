'use client'
import {useEffect, useState} from 'react'

export default function TierList() {

  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3030/pokedata')
    .then((res) => res.json())
    .then((res) => {
      let arr: string[][] = Array.from({ length: 22 }, () => []);
      let count = 0;
      //make temp array of array
      // if loop to sort pokemon by pointvalue
      // sort pokemon
      // setPokemon(res)
      // Issue #1 v

      while(count < res.length){
        arr[res[count].PointValue].push(res[count]);
        count+=1;
      }

      res = arr
      
      setPokemon(res)
      console.log(res)
    })
  },[])

  //need function that returns a Div for each invidual Pokemon and a Div that returns the entire tier they're nested in
  const displayMon = () => {
    return
  } 

  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-10 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Tier List
          </h1>
          <p>
            {JSON.stringify(pokemon)}
          </p>
        </div>
      </main>
    </div>
  );
}
