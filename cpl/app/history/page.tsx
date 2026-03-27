import SideBar from "../sidebar";
export default function History()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <div className="sideContainer">

        <SideBar bookmarks={ bookmarks } />
      </div>
      <div className="window">

        <h1>
          history
        </h1>
      </div>
    </main>
  );
}
