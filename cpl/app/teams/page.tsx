import SideBar from "../sidebar";
export default function Teams()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">
      <SideBar bookmarks={ bookmarks } />
      <div className="window">

        <h1>
          Teams
        </h1>
      </div>
    </main>
  );
}
