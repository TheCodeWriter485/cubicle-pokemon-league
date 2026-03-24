export default function SideBar({ bookmarks })
{
    return (
        <>
            <div className="spacer"></div>

            <div className="sideNav">
                { bookmarks.map((b) => (<button className="sideButton" key={ b.id }>{ b.name }</button>)) }
            </div>
        </>
    );
}