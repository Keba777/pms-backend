import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import Role from "../models/Role.model";
import LoginAttempt from "../models/LoginAttempt.model";
import ErrorResponse from "../utils/error-response.utils";
import cloudinary from "../config/cloudinary";
import bcrypt from "bcryptjs";
import fs from "fs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Organization from "../models/Organization.model";

/**
 * Local Request type that includes the optional `user` and `file` fields.
 * Using a local intersection type avoids module augmentation problems.
 */
export type ReqWithUser = Request & {
  user?: { id: string } | any;
  file?: Express.Multer.File;
};

// @desc    Register user
// @route   POST /api/v1/auth/register
const registerUser = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email: rawEmail,
      first_name,
      last_name,
      phone,
      role_name,
      password,
      department_id,
      siteId,
      responsibilities,
      status,
      access,
      username,
      gender,
      position,
      terms,
      joiningDate,
      estSalary,
      ot,
    } = req.body;

    const email = rawEmail.toLowerCase(); // Normalize to lowercase

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorResponse("User already exists", 400));
    }

    // Check if role exists
    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return next(new ErrorResponse("Role doesn't exist", 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload profile picture if provided
    let profile_picture: string | undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "/pms/images",
        use_filename: true,
      });
      fs.unlink(req.file.path, () => { });
      profile_picture = result.secure_url;
    }

    // Find default organization (Nilepms)
    const nilepms = await Organization.findOne({ where: { orgName: "Nilepms" } as any });
    if (!nilepms) {
      return next(new ErrorResponse("System not ready: Default organization not found", 500));
    }

    // Create user with lowercase email
    const user = await User.create({
      email,
      first_name,
      last_name,
      phone,
      role_id: role.id,
      orgId: nilepms.id, // Assign to Nilepms by default
      password: hashedPassword,
      profile_picture,
      department_id: department_id || null,
      siteId: siteId,
      responsibilities: responsibilities || null,
      access: access || "Low Access",
      status: status || "Active",
      username: username ? username.toLowerCase() : undefined,
      gender: gender || 'Male',
      position,
      terms,
      joiningDate,
      estSalary,
      ot,
    });

    sendingTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// @desc    Check if user exists and log in
// @route   POST /api/v1/auth/login
const loginUser = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email: rawEmail, password } = req.body;

    const email = rawEmail.toLowerCase(); // Normalize to lowercase

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }],
    });

    // Check if user exists
    if (!user) {
      // Log failed attempt (unknown user)
      await LoginAttempt.create({
        email: email,
        status: "FAILED",
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers["user-agent"],
      });
      return next(new ErrorResponse("Invalid credentials email", 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed attempt (wrong password)
      await LoginAttempt.create({
        email: email,
        status: "FAILED",
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers["user-agent"],
      });
      return next(new ErrorResponse("Invalid credentials password", 401));
    }

    // Log successful attempt
    await LoginAttempt.create({
      email: email,
      status: "SUCCESS",
      ip_address: req.ip || req.socket.remoteAddress,
      user_agent: req.headers["user-agent"],
    });

    sendingTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
const getCurrentUser = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.user?.id, {
      include: ["projects", "tasks", "activities"],
    });
    if (!user) {
      return next(new ErrorResponse("User doesn't exist", 400));
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// @desc    Change password (requires old password)
// @route   PATCH /api/v1/auth/change-password
const changePassword = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new ErrorResponse("Old password is incorrect", 400));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// @desc    Forgot password - send reset link
// @route   POST /api/v1/auth/forgot-password
const forgotPassword = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email: rawEmail } = req.body;

    const email = rawEmail.toLowerCase(); // Normalize to lowercase

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorResponse("No user with that email", 404));
    }

    // Generate JWT reset token
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "this is the secret",
      { expiresIn: "1h" } // 1 hour expiration
    );

    const frontendUrl =
      process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`; // Use env or fallback to backend host
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`; // Frontend route
    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please click on the following link to reset your password: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`;

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Token",
      text: message,
    });

    res.status(200).json({ success: true, message: "Reset email sent" });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Email could not be sent", 500));
  }
};

// @desc    Reset password using token
// @route   PUT /api/v1/auth/reset-password/:resetToken
const resetPassword = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const resetToken = req.params.resetToken as string;

    let payload;
    try {
      payload = jwt.verify(
        resetToken,
        process.env.JWT_SECRET || "this is the secret"
      ) as unknown as { id: string };
    } catch (err) {
      return next(new ErrorResponse("Invalid or expired token", 400));
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const { password } = req.body;

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    sendingTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// Function to send token response
const sendingTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = user.getSignedJwtToken();
  const options: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() +
      parseInt(process.env.JWT_COOKIE_EXPIRE || "7") * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options["secure"] = true;
  }

  // Define default permissions for all users
  const DEFAULT_PERMISSIONS = [
    'dashboard:view',
    'projects:view',
    'activities:view',
    'tasks:view',
    'todos:view',
    'requests:view', // Covers 'requests' and 'approvals' context usually
    'request-approval:view',
    'chat:view'
  ];

  let permissions: string[] = [];

  if (user.role && user.role.name === 'Admin') {
    permissions = ['*'];
  } else if (user.role && user.role.permissions) {
    // Flatten permissions
    const rolePermissions = user.role.permissions;
    const flattened: string[] = [];

    // Add defaults first
    flattened.push(...DEFAULT_PERMISSIONS);

    Object.keys(rolePermissions).forEach((resource) => {
      const actions = rolePermissions[resource];
      if (actions) {
        Object.keys(actions).forEach((action) => {
          if (actions[action as keyof typeof actions] === true) {
            flattened.push(`${resource}:${action}`);
          }
        });
      }
    });

    // Deduplicate just in case
    permissions = Array.from(new Set(flattened));
  } else {
    // Fallback if no role/permissions, still give defaults
    permissions = DEFAULT_PERMISSIONS;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role_id: user.role_id,
        role: user.role,
        profile_picture: user.profile_picture,
        department_id: user.department_id,
        orgId: user.orgId,
        siteId: user.siteId,
        responsibilities: user.responsibilities,
        access: user.access,
        status: user.status,
        username: user.username,
        gender: user.gender,
        position: user.position,
        terms: user.terms,
        joiningDate: user.joiningDate,
        estSalary: user.estSalary,
        ot: user.ot,
        token,
        permissions, // Send the flattened permissions
      },
    });
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
