import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    return new Promise((resolve, reject) => {
        const { authorization } = req.headers;

        if (!authorization)
            return res.status(401).json({
                meta: {
                    code: 401,
                    message: "Unauthorized",
                },
                data: {},
            });

        const authSplit = authorization.split(" ");
        const [authType, authToken] = [authSplit[0], authSplit[1]];

        if (authType !== "Bearer")
            return res.status(401).json({
                meta: {
                    code: 401,
                    message: "Unauthorized",
                },
                data: {},
            });

        return jwt.verify(
            authToken,
            process.env.JWT_SECRET,
            function (err, decoded) {
                if (err)
                    return res.status(401).json({
                        meta: {
                            code: 401,
                            message: "Unauthorized",
                        },
                        data: {},
                    });

                return resolve(decoded);
            }
        );
    });
}
