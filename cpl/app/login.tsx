import Form from 'next/form'

export default function Login() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh", width: "90vw", backgroundColor: "#ffffffff" }}>
            <form action="/auth" method="post">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}