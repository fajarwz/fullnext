import db from "../../../libs/db";
import jwt from "jsonwebtoken";
import authorization from "../../../middlewares/authorization";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const auth = await authorization(req, res);

        const posts = await db("posts");

        return res.status(200).json({
            meta: {
                code: 200,
                message: "Posts fetched successfully",
            },
            data: posts,
        });
    }

    return res.status(405).end();
}
