import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);

    const postReq = await fetch("http://localhost:3000/api/posts", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    const posts = await postReq.json();

    return {
        props: {
            posts: posts.data,
            token,
        },
    };
}

export default function PostIndex(props) {
    useEffect(() => {
        document.title = "Posts | Fullnext";
    }, []);

    const router = useRouter();

    const [posts, setPosts] = useState(props.posts);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    function editHandler(id, e) {
        e.preventDefault();

        return router.push(`/posts/${id}/update`);
    }

    async function deleteHandler(id, e) {
        e.preventDefault();

        const ask = confirm("Anda yakin ingin menghapus data ini?");

        if (ask) {
            setLoading(true);

            const { token } = props;

            const create = await fetch(`/api/posts/${id}/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            setLoading(false);

            if (!create.ok && create.status !== 401) {
                setError(true);
                return setMessage("error! Please try again later");
            }

            const res = await create.json();

            if (res.meta.code === 200) {
                const postsAfterDelete = posts.filter(function (post) {
                    return post.id !== id;
                });

                setError(false);
                return setPosts(postsAfterDelete);
            }

            setError(true);
            return setMessage(res.meta.message);
        }
    }

    return (
        <>
            <h1>Posts</h1>
            <Nav />

            {message && (
                <div style={error ? { color: "red" } : { color: "green" }}>
                    {message}
                </div>
            )}
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <div>
                        <button onClick={editHandler.bind(this, post.id)}>
                            Edit
                        </button>
                        <button onClick={deleteHandler.bind(this, post.id)}>
                            {loading ? "Loading..." : "Delete"}
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
