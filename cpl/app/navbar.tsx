import { match } from 'assert'
import Link from 'next/link'



export default function Navbar()
{
    return (
        <div>
            <header className='navBar'>
                <div className='navDiv'>
                    <Link className='navButton1' href="/">  </Link>
                    <Link className='link' href="/">Home</Link>
                </div>
                <div className='navDiv'>

                    <Link className='navButton2' href="/news"> </Link>
                    <Link className='link' href="/news">News</Link>
                </div>
                <div className='navDiv'>

                    <Link className='navButton1' href="/teams"> </Link>
                    <Link className='link' href="/teams">Teams</Link>
                </div>
                <div className='navDiv'>

                    <Link className='navButton2' href="/tier-list"> </Link>
                    <Link className='link' href="/tier-list">Tier List</Link>
                </div>
                <div className='navDiv'>

                    <Link className='navButton1' href="/history"> </Link>
                    <Link className='link' href="/history">History</Link>
                </div>
            </header>
        </div>);
}