import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    let token: string = "";
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1];
    }
    //  else if (req.cookies.token) {
    //     // Set token from cookie
    //     token = req.cookies.token;
    //   }

    // Make sure token exists
    if (!token) {
        res
            .status(401)
            .json({ error: "Not authorized to access this route" });
        return;
    }

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || ""
        ) as JwtPayload;
        const user = await User.findByPk(decoded.id);
        if (!user) {
            res.status(401).json({ error: "Not authorized to access this route" });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res
            .status(401)
            .json({ error: "Not authorized to access this route" });
    }
};

export default protectRoute;