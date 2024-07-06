import { info } from "console";
import jwt from "jsonwebtoken";

export const verifier = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        if(!token){
            return res.json({msg:"not logged in"}).status(403);
        } else{
            jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
                if (err) {
                    console.log(err);
                    return res.json({ msg: "some error occured" }).status(500);
                } else {
                    const {password, iat, exp, ...info} = payload
                    req.user = info;
                    next();
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.json({ msg: "some error occured" }).status(500);
    }
}