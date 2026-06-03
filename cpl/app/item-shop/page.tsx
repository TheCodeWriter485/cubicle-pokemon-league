'use client'
import { useEffect, useState } from 'react'
import SideBar from "../sidebar";
import Card from "../item";

export default function ItemShop() {
  const [items, setItems] = useState<{ megaStones: any[], misc: any[] }>({ megaStones: [], misc: [] });

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

        megaStones.sort((a, b) => a.item.localeCompare(b.item));
        misc.sort((a, b) => a.item.localeCompare(b.item));

        setItems({ megaStones, misc });
      })
  }, [])

  const bookmarks = [{ id: 'mega-stone', name: 'Mega Stone' }, { id: 'misc', name: 'Misc' }]

  const renderGroup = (groupItems: any[], header: string, anchorId: string) => {
    return (
      <div id={anchorId} style={{ marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '12px' }}>
          {header}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {groupItems.map((item: any, i: number) => (
            <div key={i} className="item-card">
              <Card name={item.item} value={item.points} image={item.id} desc={item.descr} />
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
        {renderGroup(items.megaStones, "Mega Stone", "mega-stone")}
        {renderGroup(items.misc, "Misc", "misc")}
      </div>
    </main>
  );
}