import SideBarButton from "./sidebarButton";

export default function SideBar({ bookmarks })
{
    return (
        <div className="sideContainer">
            <div className="spacer"></div>

            <div className="sideNav">
                { bookmarks.map((b) => (<SideBarButton bookmarks={ b } key={ b.id } />)) }
            </div>
        </div >
    );
}