import db from "../../../libs/db";
import bcrypt from "bcryptjs/dist/bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);

        const register = await db("users").insert({
            email,
            password: passwordHash,
        });

        const registeredUser = await db("users").where("id", register).first();

        res.status(200).json({
            meta: {
                code: 200,
                message: "User registered successfully",
            },
            data: registeredUser,
        });
    }

    return res.status(405).end();
}
