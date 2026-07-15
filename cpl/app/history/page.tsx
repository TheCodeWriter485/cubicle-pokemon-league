import SideBar from "../sidebar";
export default function History()
{
  const bookmarks = [{ id: 1, name: 'button' }]
  return (
    <main className="page">

      <SideBar bookmarks={ bookmarks } />
      <div className="window">

        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          history
        </h1>
      </div>
    </main>
  );
}
