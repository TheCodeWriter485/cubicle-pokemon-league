'use client'

export default function SideBarButton({ id, name }: { id: string | number, name: string })
{
    function ScrollToElement()
    {
        const element = document.getElementById(String(id));
        element?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <button onClick={ScrollToElement}>
            {name}
        </button>
    );
}
