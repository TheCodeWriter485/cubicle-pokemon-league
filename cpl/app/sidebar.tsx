import SideBarButton from "./sidebarButton";

export default function SideBar({ bookmarks }: { bookmarks: { id: string | number, name: string }[] })
{
    return (
        <div className="sideContainer">
		<div className ="spacer"></div>
            {bookmarks.map((bookmark) => (
                <SideBarButton key={bookmark.id} id={bookmark.id} name={bookmark.name} />
            ))}
        </div>
    );
}
