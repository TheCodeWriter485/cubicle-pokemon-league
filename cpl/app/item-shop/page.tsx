'use client'
import { useEffect, useState } from 'react'
import SideBar from "../sidebar";
import Card from "../item";

export default function ItemShop() {
  const [items, setItems] = useState<{ megaStones: any[], misc: any[] }>({ megaStones: [], misc: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = new Promise(resolve => setTimeout(resolve, 1000));

    const fetchItems = fetch('/api/itemshop')
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
      .catch((err) => {
        console.error("Failed to fetch items:", err);
      });

    // Wait for both the fetch AND the 3 second delay before hiding the loader
    Promise.all([fetchItems, delay]).finally(() => {
      setLoading(false);
    });
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

        {/* Loading Screen */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999
          }}>
            <img
              src="https://archives.bulbagarden.net/media/upload/8/87/Champions_Omni_Ring.png"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'contain',
                animation: 'spin 1.5s linear infinite'
              }}
            />
            <p style={{
              color: 'white',
              fontSize: '1.5rem',
              marginTop: '1rem',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>
              Loading...
            </p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Item Shop</h1>
        {renderGroup(items.megaStones, "Mega Stone", "mega-stone")}
        {renderGroup(items.misc, "Misc", "misc")}
      </div>
    </main>
  );
}