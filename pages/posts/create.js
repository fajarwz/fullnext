import { useEffect, useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);

    return {
        props: {
            token
        },
    };
}

export default function PostCreate(props) {
    useEffect(() => {
        document.title = "Create Post | Fullnext";
    }, []);

    const [form, setForm] = useState({
        title: "",
        content: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function createHandler(e) {
        e.preventDefault();

        setLoading(true);

        const { token } = props;

        const create = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (!create.ok && create.status !== 401) {
            setError(true);
            return setMessage("error! Please try again later");
        }

        const res = await create.json();

        if (res.meta.code === 200) {
            setError(false);
            return Router.push("/posts");
        } 

        setError(true);
        return setMessage(res.meta.message);
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
            <h1>Create a post</h1>
            <Nav />

            {message && (
                <div style={error ? { color: "red" } : { color: "green" }}>
                    {message}
                </div>
            )}
            <form onSubmit={createHandler.bind(this)}>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        onChange={fieldHandler.bind(this)}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Content"
                        name="content"
                        onChange={fieldHandler.bind(this)}
                    ></textarea>
                </div>
                <div>
                    <button type="submit">{loading ? "Loading..." : "Create Post"}</button>
                </div>
            </form>
        </>
    );
}
