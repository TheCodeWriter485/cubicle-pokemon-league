import SideBar from "../sidebar";
import MatchForm from '@/app/match_form'

export default function Admin()
{
    const bookmarks = [{ id: 1, name: 'button' }]
    return (
        <main className="page">

            <SideBar bookmarks={ bookmarks } />
            <div className="window">

                <h1>
                    Admin
                </h1>
                <MatchForm />
            </div>

        </main>
    );
}