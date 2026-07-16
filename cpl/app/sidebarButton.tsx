'use client'

export default function SideBarButton({ id, name }: { id: string | number, name: string })
{
    function ScrollToElement()
    {
        const element = document.getElementById(String(id));
        element?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold cursor-pointer rounded" style={{ width: "90%", height: "40px", margin: "0 auto", display: "block" }} onClick={ScrollToElement}>
            {name}
        </button>
    );
}
