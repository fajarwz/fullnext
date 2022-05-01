import db from "../../../libs/db";
import bcrypt from "bcryptjs/dist/bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        const checkUser = await db("users").where("email", email).first();

        if (!checkUser)
            return res.status(401).json({
                meta: {
                    code: 401,
                    message: "Email or password is wrong",
                },
                data: {},
            });

        const checkPassword = await bcrypt.compare(
            password,
            checkUser.password
        );

        if (!checkPassword)
            return res.status(401).json({
                meta: {
                    code: 401,
                    message: "Email or password is wrong",
                },
                data: {},
            });

        const token = jwt.sign(
            {
                id: checkUser.id,
                email: checkUser.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            meta: {
                code: 200,
                message: "User logged in successfully",
            },
            data: {
                token,
            },
        });
    }

    return res.status(405).end();
}
