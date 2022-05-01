import db from "../../../libs/db";
import authorization from "../../../middlewares/authorization";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const auth = await authorization(req, res);
        
        const { title, content } = req.body;

        const create = await db("posts").insert({
            title,
            content,
        });

        const created = await db("posts").where("id", create);

        res.status(200).json({
            meta: {
                code: 200,
                message: "Post created successfully",
            },
            data: created,
        });
    }

    return res.status(405).end();
}
