import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import Role from "../models/Role.model";
import ErrorResponse from "../utils/error-response.utils";
import cloudinary from "../config/cloudinary";
import bcrypt from "bcryptjs";

declare module "express-serve-static-core" {
  interface Request {
    file?: Express.Multer.File;
  }
  interface Request {
    user?: {
      id: string;
    };
  }
}

// @desc    Register user
// @route   POST /api/v1/auth/register
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      first_name,
      last_name,
      phone,
      role_name,
      password,
      department_id,
      siteId,
      responsiblities,
      status,
      access
    } = req.body;

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
      profile_picture = result.secure_url;
    }

    // Create user
    const user = await User.create({
      email,
      first_name,
      last_name,
      phone,
      role_id: role.id,
      password: hashedPassword,
      profile_picture,
      department_id: department_id || null,
      siteId: siteId,
      responsiblities: responsiblities || null,
      access: access || "Low Access",
      status: status || "Active",
    });

    sendingTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// @desc    Check if user exists and log in
// @route   POST /api/v1/auth/login
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }],
    });

    // Check if user exists
    if (!user) {
      return next(new ErrorResponse("Invalid credentials email", 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials password", 401));
    }

    sendingTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.user?.id, {
      include: ["projects", "tasks", "activities"],
    });
    if (!user) {
      return next(new ErrorResponse("User doesn't exist", 400));
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Server error", 500));
  }
};

// Function to send token response
const sendingTokenResponse = (user: User, statusCode: number, res: Response) => {
  const token = user.getSignedJwtToken();
  const options: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || "10") * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options["secure"] = true;
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
        siteId: user.siteId,
        responsiblities: user.responsiblities,
        access: user.access,
        status: user.status,
        token,
      },
    });
};

export { registerUser, loginUser, getCurrentUser };
