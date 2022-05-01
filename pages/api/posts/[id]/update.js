import db from "../../../../libs/db";
import authorization from "../../../../middlewares/authorization";

export default async function handler(req, res) {
    if (req.method === "PUT") {
        const auth = await authorization(req, res);

        const { id } = req.query;
        const { title, content } = req.body;

        const update = await db("posts").where("id", id).update({
            title,
            content,
        });

        const updated = await db("posts").where("id", id);

        res.status(200).json({
            meta: {
                code: 200,
                message: "Post updated successfully",
            },
            data: updated,
        });
    }

    return res.status(405).end();
}
