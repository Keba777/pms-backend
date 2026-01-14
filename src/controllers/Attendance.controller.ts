import { NextFunction, Request, Response } from "express";
import { LaborTimesheet } from "../models/Timesheet.model";
import ErrorResponse from "../utils/error-response.utils";
import LaborInformation from "../models/LaborInformation.model";
import User from "../models/User.model";
import { Op } from "sequelize";

// @desc    Check-In (Morning or Afternoon)
// @route   POST /api/v1/attendance/check-in
export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { resourceId, type, session } = req.body; // type: 'User' | 'Labor'
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const timeString = today.toLocaleTimeString('en-US', { hour12: true });

        if (!resourceId || !type || !session) {
            return next(new ErrorResponse("Missing resourceId, type, or session", 400));
        }

        let timesheet = await LaborTimesheet.findOne({
            where: {
                date: dateString,
                [type === 'User' ? 'userId' : 'laborInformationId']: resourceId
            }
        });

        if (session === 'Morning') {
            if (timesheet) {
                return next(new ErrorResponse("Morning Check-In already exists", 400));
            }
            // Create new Timesheet
            const data: any = {
                date: dateString,
                morningIn: timeString,
                morningOut: '', // Placeholder
                mornHrs: 0,
                afternoonIn: '',
                afternoonOut: '',
                aftHrs: 0,
                rate: 0, // Should fetch rate from Labor/User
                totalPay: 0,
                status: 'Pending',
                orgId: (req as any).user?.orgId || null // Assuming auth middleware populates user
            };

            if (type === 'User') {
                data.userId = resourceId;
                // Fetch user for rate if needed, or default
            } else {
                data.laborInformationId = resourceId;
                // Fetch labor info -> labor -> rate
                const laborInfo = await LaborInformation.findByPk(resourceId as string);
                // Logic to get rate from Labor... (omitted for brevity, can be refined)
            }

            timesheet = await LaborTimesheet.create(data);
        } else if (session === 'Afternoon') {
            if (!timesheet) {
                // Prevent Afternoon check-in if no Morning record? 
                // User Requirement: "make sure that they can't have afternoon time started veefore morning time starts????"
                // If no morning record, forbid? Or create one with morning skipped?
                // Let's forbid for now as per "before morning time starts".
                return next(new ErrorResponse("Cannot Check-In Afternoon before Morning", 400));
            }
            if (timesheet.afternoonIn) {
                return next(new ErrorResponse("Afternoon Check-In already exists", 400));
            }

            // Check if morningOut is missing. If so, auto-checkout morning at 12:30 PM
            if (!timesheet.morningOut) {
                timesheet.morningOut = "12:30 PM";
                // Calculate mornHrs...
                // Simplification: Assume 8:00 start -> 12:30 = 4.5 hrs. 
                // Need proper time diff logic.
                timesheet.mornHrs = 4.5; // Placeholder logic
            }

            timesheet.afternoonIn = timeString;
            await timesheet.save();
        }

        res.status(200).json({ success: true, data: timesheet });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error Checking In", 500));
    }
};

// @desc    Check-Out (Morning or Afternoon)
// @route   POST /api/v1/attendance/check-out
export const checkOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { resourceId, type, session } = req.body;
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const timeString = today.toLocaleTimeString('en-US', { hour12: true });

        const timesheet = await LaborTimesheet.findOne({
            where: {
                date: dateString,
                [type === 'User' ? 'userId' : 'laborInformationId']: resourceId
            }
        });

        if (!timesheet) {
            return next(new ErrorResponse("No attendance record found for today", 404));
        }

        if (session === 'Morning') {
            if (timesheet.morningOut) {
                return next(new ErrorResponse("Already Checked Out (Morning)", 400));
            }
            timesheet.morningOut = timeString;
            // Calculate Hours Logic Here
            timesheet.mornHrs = 4; // Mock calculation
        } else if (session === 'Afternoon') {
            if (!timesheet.afternoonIn) {
                return next(new ErrorResponse("Afternoon session not started", 400));
            }
            if (timesheet.afternoonOut) {
                return next(new ErrorResponse("Already Checked Out (Afternoon)", 400));
            }
            timesheet.afternoonOut = timeString;
            // Calculate Hours Logic Here
            timesheet.aftHrs = 4; // Mock calculation
        }

        await timesheet.save();
        res.status(200).json({ success: true, data: timesheet });

    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error Checking Out", 500));
    }
};
