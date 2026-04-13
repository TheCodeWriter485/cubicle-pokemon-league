"use client"
import { match } from 'assert'
import Link from 'next/link'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useEffect } from 'react'


export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    async function checkLogin() {
        const response = await fetch("http://localhost:3030/auth/status", {
            credentials: "include"
        })
        const data = await response.json()
        setLoggedIn(data.loggedin)
        setIsAdmin(data.admin)
    }
    useEffect(() => {
        checkLogin()
    }, [])

    const handleLogout = async () => {
        const response = await fetch('http://localhost:3030/auth/logout', {
            method: 'POST',
            credentials: "include",
        });
        // const result = await response.json();
        // console.log(JSON.stringify(result));
        await checkLogin();
        window.location.reload();
    };

    const handleLogin = async () => {
        const response = await fetch('http://localhost:3030/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ username: username, password: password }),
        });
        if (response.status === 401) {
            alert("Incorrect Username and/or Password!");
            return;
        }
        await checkLogin();
        setIsOpen(false);
        window.location.reload();
    };

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
                {isAdmin ? (
                    <div className='navDiv'>
                        <Link className='navButton1' href="/admin"></Link>
                        <Link className='link' href="/admin">Admin</Link>
                    </div>
                ) : <></>}
                <div className='navDiv'>
                    {loggedIn ? (
                        <div>
                            <button className='navButton1' onClick={handleLogout}></button>
                            <button className='link' onClick={(e) => {
                                handleLogout();
                            }}>Sign Out</button>
                        </div>
                    ) : (
                        <div>
                            <button className='navButton1' onClick={() => setIsOpen(true)}></button>
                            <button className='link' onClick={() => setIsOpen(true)}>Login</button>
                        </div>
                    )}
                </div>
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-4 border bg-white dark:bg-black p-12">
                            <DialogTitle className="font-bold">Account Login</DialogTitle>
                            <form>
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" className="dark:text-black bg-white" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" className="dark:text-black bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button className="hover:bg-orange-500 hover:text-black" onClick={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}>Login</button>
                            </form>
                            <div className="flex gap-4">
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </header>
        </div>);
}