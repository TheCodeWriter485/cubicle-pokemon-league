import SideBar from "../sidebar";
export default function News()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <div className="sideContainer">

        <SideBar bookmarks={ bookmarks } />
      </div>
      <div className="window">

        <h1>
          news
        </h1>
      </div>
    </main>
  );
}