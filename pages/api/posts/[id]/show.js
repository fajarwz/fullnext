import db from "../../../../libs/db";
import authorization from "../../../../middlewares/authorization";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const auth = await authorization(req, res);

        const { id } = req.query;

        const data = await db("posts").where("id", id).first();

        res.status(200).json({
            meta: {
                code: 200,
                message: "Post fetched successfully",
            },
            data,
        });
    }

    return res.status(405).end();
}
