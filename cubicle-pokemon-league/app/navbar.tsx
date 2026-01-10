import { match } from 'assert'
import Link from 'next/link'



export default function Navbar() {

    return (
    <div>
       <header className="flex flex-row justify-between" style={{marginLeft: "35vw", marginRight: "35vw", marginTop: "1.5rem", marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "500"}}>
            <Link className='text-black dark:text-zinc-50 hover:text-orange-400' href="/">Home</Link>
            <Link className='text-black dark:text-zinc-50 hover:text-orange-400' href="/news">News</Link>
            <Link className='text-black dark:text-zinc-50 hover:text-orange-400' href="/teams">Teams</Link>
            <Link className='text-black dark:text-zinc-50 hover:text-orange-400' href="/tier-list">Tier List</Link>
            <Link className='text-black dark:text-zinc-50 hover:text-orange-400' href="/history">History</Link>
         </header>
    </div>);
}