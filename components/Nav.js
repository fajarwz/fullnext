import Link from "next/link";
import Cookies from "js-cookie";
import Router from "next/router";

export default function Nav() {
    function logoutHandler(e) {
        e.preventDefault();

        Cookies.remove("token");
        Router.replace("/auth/login");
    }

    return (
        <>
            <div>
                <Link href="/posts">Posts</Link> |{" "}
                <Link href="/posts/create">Create Post</Link> |{" "}
                <a href="javascript:;" onClick={logoutHandler.bind(this)}>
                    Logout
                </a>
            </div>
        </>
    );
}
