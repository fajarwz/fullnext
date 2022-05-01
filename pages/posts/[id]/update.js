import { useEffect, useState } from "react";
import { authPage } from "../../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../../components/Nav";

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);
    const { id } = ctx.query;

    const postReq = await fetch(`http://localhost:3000/api/posts/${id}/show`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    const post = await postReq.json();

    return {
        props: {
            token,
            post,
        },
    };
}

export default function PostUpdate(props) {
    useEffect(() => {
        document.title = "Update Post | Fullnext";
    }, []);

    const { post } = props;

    const [form, setForm] = useState({
        title: post.data.title,
        content: post.data.content,
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function updateHandler(id, e) {
        e.preventDefault();

        setLoading(true);

        const { token } = props;

        const create = await fetch(`/api/posts/${id}/update`, {
            method: "PUT",
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
            <h1>Update a post</h1>
            <Nav />

            {message && (
                <div style={error ? { color: "red" } : { color: "green" }}>
                    {message}
                </div>
            )}
            <form onSubmit={updateHandler.bind(this, post.data.id)}>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        defaultValue={post.data.title}
                        onChange={fieldHandler.bind(this)}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Content"
                        name="content"
                        defaultValue={post.data.content}
                        onChange={fieldHandler.bind(this)}
                    ></textarea>
                </div>
                <div>
                    <button type="submit">{loading ? "Loading..." : "Update Post"}</button>
                </div>
            </form>
        </>
    );
}
