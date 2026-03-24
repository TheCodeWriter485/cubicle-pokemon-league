import SideBar from "../sidebar";
export default function Teams()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <div className="sideContainer">

        <SideBar bookmarks={ bookmarks } />
      </div>
      <div className="window">

        <h1>
          Teams
        </h1>
      </div>
    </main>
  );
}
