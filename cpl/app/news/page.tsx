import SideBar from "../sidebar";
export default function News()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">

      <SideBar bookmarks={ bookmarks } />

      <div className="window">

        <h1>
          news
        </h1>
      </div>
    </main>
  );
}