import { useRef } from 'react';
export default function SideBarButton({ b })
{


    const ScrollToElement = () =>
    {
        const element = document.getElementById(b.id);
        element?.scrollIntoView({ behavior: 'smooth' })
    }
}