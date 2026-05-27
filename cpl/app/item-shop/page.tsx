'use client'
import { useEffect, useState } from 'react'
import { PokemonClient } from 'pokenode-ts';
import SideBar from "../sidebar";
import Card from "../item";

export default function ItemShop() {
  const [items, setItems] = useState<{ megaStones: any[], misc: any[] }>({ megaStones: [], misc: [] });
  const api = new PokemonClient();

  useEffect(() => {
    fetch('http://localhost:3030/itemshop')
      .then((res) => res.json())
      .then((res) => {
        let megaStones: any[] = [];
        let misc: any[] = [];

        res.forEach((item: any) => {
          if (item.id >= 100 && item.id < 200) {
            megaStones.push(item);
          } else if (item.id >= 200 && item.id < 300) {
            misc.push(item);
          }
        });

        // Sort alphabetically
        megaStones.sort((a, b) => a.item.localeCompare(b.item));
        misc.sort((a, b) => a.item.localeCompare(b.item));

        setItems({ megaStones, misc });
      })
  }, [])

  const bookmarks = [{ id: 1, name: 'button' }]

  const chunkArray = (arr: any[], size: number) => {
    let chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const renderGroup = (groupItems: any[], header: string) => {
    const columns = chunkArray(groupItems, Math.ceil(groupItems.length / 3));
    return (
      <div style={{ marginBottom: '2rem' }}>
        {/* Group Header spanning all 3 columns */}
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '12px' }}>
          {header}
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {columns.map((col, colIndex) => (
            <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              {col.map((poke: any, pokeIndex: number) => (
                <div key={pokeIndex} className="item-card">
                  <Card name={poke.item} value={poke.points} image={poke.id} desc={poke.descr} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="page">
      <SideBar bookmarks={bookmarks} />
      <div className="window">
        <h1>Item Shop</h1>
        {renderGroup(items.megaStones, "Mega Stone")}
        {renderGroup(items.misc, "Misc")}
      </div>
    </main>
  );
}