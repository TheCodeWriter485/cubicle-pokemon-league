"use client"
export default function SideBarButton({ bookmarks })
{


    function ScrollToElement()
    {
        const element = document.getElementById(bookmarks.id);

        //const { scrollX, scrollY } = window;
        element?.scrollIntoView({ behavior: 'smooth' });
        // window.scroll(scrollX, scrollY);

        //element.parentElement.scrollTop = element.offsetTop - 50;
    }

    return (

        <button onClick={ ScrollToElement } className="sideButton" >{ bookmarks.name }</button>

    );
}