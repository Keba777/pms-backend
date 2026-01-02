import { NextFunction, Request, Response } from "express";
import sequelize from "../config/db";
import ErrorResponse from "../utils/error-response.utils";
import User from "../models/User.model";
import LoginAttempt from "../models/LoginAttempt.model";
import Approval from "../models/Approval.model";
import { Op } from "sequelize";

// @desc    Get system statistics
// @route   GET /api/v1/admin/stats
export const getSystemStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Database Health Check
        let dbStatus = "Disconnected";
        try {
            await sequelize.authenticate();
            dbStatus = "Connected";
        } catch (error) {
            console.error("Database connection failed:", error);
            dbStatus = "Error";
        }

        // 2. Pending Approvals
        // Assuming 'status' field in Approval model. Check model if unsure.
        // If Approval model doesn't have status, we might count rows or check another logic.
        // Let's assume standard 'Pending' status.
        const pendingApprovals = await Approval.count({
            where: {
                status: "Pending"
            }
        });

        // 3. Failed Login Attempts (Last 24h)
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const yesterday = new Date(Date.now() - ONE_DAY_MS);

        const failedLogins = await LoginAttempt.count({
            where: {
                status: "FAILED",
                createdAt: {
                    [Op.gte]: yesterday
                }
            }
        });

        // 4. Active Sessions (Estimate: Users with SUCCESS login in last 24h)
        // Or distinct users who logged in recently.
        // Note: This is an approximation since we don't store session state in DB.
        const activeSessions = await LoginAttempt.count({
            where: {
                status: "SUCCESS",
                createdAt: {
                    [Op.gte]: yesterday
                }
            },
            distinct: true,
            col: 'email'
        });

        res.status(200).json({
            success: true,
            data: {
                health: {
                    apiStatus: "Operational",
                    dbStatus: dbStatus,
                    lastBackup: "Automated (Check Provider)" // Placeholder as discussed
                },
                security: {
                    pendingApprovals,
                    failedLogins,
                    activeSessions
                }
            }
        });

    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Server Error", 500));
    }
};
