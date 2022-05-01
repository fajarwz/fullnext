import db from "../../../../libs/db";
import authorization from "../../../../middlewares/authorization";

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        const auth = await authorization(req, res);
        
        const { id } = req.query;

        const deleteData = await db("posts").where("id", id).del();

        res.status(200).json({
            meta: {
                code: 200,
                message: "Post deleted successfully",
            },
            data: {},
        });
    }

    return res.status(405).end();
}
