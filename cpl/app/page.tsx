import SideBar from "./sidebar";

export default function Home()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <div className="sideContainer">
        <div className="spacer"></div>
        <SideBar bookmarks={ bookmarks } />
      </div>

      <div className="window">

        <h1>
          Welcome to the Cubicle Pokemon League!
        </h1>

      </div>
    </main>
  );
}