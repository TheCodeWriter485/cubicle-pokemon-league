import { useState } from "react"
import Form from 'next/form'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function AccountForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isUserAdmin, setIsUserAdmin] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3030/account/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ username: username, password: password, admin: (isUserAdmin ? 1 : 0) }),
        });
        const result = await response.json();
        // check if "errno" in result
        if (result.errno) {
            alert(`Account ${username} creation failed!`);
        }
        else {
            alert(`Account ${username} created successfully!`);
            setUsername("");
            setPassword("");
            setIsUserAdmin(false);
        }
    }

    return (
        <>
            < h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50" > Account Creation Form</h1 >
            <Form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input className="bg-zinc-50 text-black rounded-md p-2" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input className="bg-zinc-50 text-black rounded-md p-2" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="flex flex-row gap-2">
                    <label htmlFor="isUserAdmin">Admin</label>
                    <input className="bg-zinc-50 text-black rounded-md" type="checkbox" id="isUserAdmin" name="isUserAdmin" value={isUserAdmin} onChange={(e) => setIsUserAdmin(e.target.checked)} />
                </div>
                <button className="bg-blue-400 text-white rounded-md p-2 hover:bg-blue-500 cursor-pointer mt-4" type="submit">Create Account</button>
            </Form>
        </>
    );
}
