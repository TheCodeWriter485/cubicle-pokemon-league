"use client"
import SideBar from "../sidebar";
import MatchForm from '@/app/match_form'
import AccountForm from '@/app/admin/account_form'
import { useState, useEffect } from 'react'

export default function Admin() {

    const [loggedIn, setLoggedIn] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

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

    const bookmarks = [{ id: 1, name: 'button' }]
    return (
        <main className="page">
            <SideBar bookmarks={bookmarks} />
            <div className="window">
                {loggedIn && isAdmin ?
                    <>
                        <h1 >
                            Admin Panel 🛠️
                        </h1>
                        <AccountForm />
                        <div className="h-10"></div>
                        <MatchForm />
                    </> :
                    (!loggedIn ? (
                        <>
                            <h1>
                                Please log in to access the admin page 🔐
                            </h1>
                        </>
                    ) : (
                        <h1>
                            You do not have access to the admin page 🚫
                        </h1>
                    ))
                }
            </div>

        </main>
    );
}
