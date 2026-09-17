import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const generarToken = (payload: object) => {

    return jwt.sign(payload, SECRET, {

        expiresIn: "8h"

    });

}