import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User.model";
import Role from "../models/Role.model";
import { ReqWithUser } from "../types/req-with-user";

const protectRoute = async (req: ReqWithUser, res: Response, next: NextFunction): Promise<void> => {
    let token: string = "";
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res
            .status(401)
            .json({ error: "Not authorized to access this route" });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || ""
        ) as JwtPayload;
        const user = await User.findByPk(decoded.id, {
            include: ['role']
        });
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