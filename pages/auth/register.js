import { useState, useEffect } from "react";
import { unauthPage } from "../../middlewares/authorizationPage";
import Link from "next/link";

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);

    return {
        props: {},
    };
}

export default function Register() {
    useEffect(() => {
        document.title = "Register | Fullnext";
    }, []);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function registerHandler(e) {
        e.preventDefault();

        setLoading(true);

        const registerReq = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (!registerReq.ok) {
            setError(true);
            return setMessage("error! Please try again later");
        }

        const registerRes = await registerReq.json();

        if (registerRes.meta.code !== 200) {
            setError(true);
        }

        return setMessage(registerRes.meta.message);
    }

    function fieldHandler(e) {
        const name = e.target.getAttribute("name");

        setForm({
            ...form,
            [name]: e.target.value,
        });
    }

    return (
        <>
            <h1>Register</h1>

            <p>Register to create account</p>

            {message && (
                <div style={error ? { color: "red" } : { color: "green" }}>
                    {message}
                </div>
            )}
            <form onSubmit={registerHandler.bind(this)}>
                <div>
                    <input
                        type="text"
                        name="email"
                        onChange={fieldHandler.bind(this)}
                        placeholder="Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        onChange={fieldHandler.bind(this)}
                        placeholder="Password"
                    />
                </div>
                <div>
                    <button type="submit">
                        {loading ? "Loading..." : "Register"}
                    </button>&nbsp;
                </div>
                <div>
                    Already have an account? <Link href="/auth/login">Login</Link>
                </div>
            </form>
        </>
    );
}
