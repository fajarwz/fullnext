import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Router from "next/router";
import { unauthPage } from "../../middlewares/authorizationPage";
import Link from "next/link";

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);

    return {
        props: {},
    };
}

export default function Login() {
    useEffect(() => {
        document.title = "Login | Fullnext";
    }, []);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function loginHandler(e) {
        e.preventDefault();

        setLoading(true);

        const loginReq = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (!loginReq.ok && loginReq.status !== 401) {
            setError(true);
            return setMessage("error! Please try again later");
        }

        const loginRes = await loginReq.json();

        if (loginRes.meta.code === 200) {
            setError(false);
            Cookies.set("token", loginRes.data.token);
            return Router.push("/posts");
        } 

        setError(true);
        return setMessage(loginRes.meta.message);
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
            <h1>Login</h1>

            <p>Please login first</p>

            {message && (
                <div style={error ? { color: "red" } : { color: "green" }}>
                    {message}
                </div>
            )}
            <form onSubmit={loginHandler.bind(this)}>
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
                        {loading ? "Loading..." : "Login"}
                    </button>&nbsp;
                </div>
                <div>Don't have an account yet? <Link href="/auth/register">Register</Link></div>
            </form>
        </>
    );
}
