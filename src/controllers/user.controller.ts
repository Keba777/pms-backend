import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import ErrorResponse from "../utils/error-response.utils";
import RequestModel from "../models/Request.model";
import Role from "../models/Role.model";
import Department from "../models/Department.model";
import Site from "../models/Site.model";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { Op } from 'sequelize';
import bcrypt from "bcryptjs";
import path from "path";

const uploadToCloudinary = async (source: string): Promise<string | null> => {
  try {
    const result = await cloudinary.uploader.upload(source, {
      folder: "/pms/images",
      use_filename: true,
    });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
};

// @desc    Get all users
// @route   GET /api/v1/users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    attributes: ["id", "name", "permissions"],
                },
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
                {
                    model: Site,
                    as: "site",
                    attributes: ["id", "name"],
                },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving users", 500));
    }
};

// @desc    Get a user by ID
// @route   GET /api/v1/users/:id
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    attributes: ["id", "name", "permissions"],
                },
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
                {
                    model: Site,
                    as: "site",
                    attributes: ["id", "name"],
                },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
        });

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving user", 500));
    }
};

// @desc    Create a new user
// @route   POST /api/v1/users
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract and validate required fields
        const { first_name, last_name, phone, email, password = "123456", role_id, siteId, username, gender, position, terms, joiningDate, estSalary, ot } = req.body;

        if (!first_name || !last_name || !phone || !email) {
            return next(new ErrorResponse("Missing required fields", 400));
        }

        let finalRoleId = role_id;
        if (!finalRoleId) {
            const userRole = await Role.findOne({ where: { name: "User" } });
            if (userRole) {
                finalRoleId = userRole.id;
            } else {
                 console.warn("Default 'User' role not found. Creating user without role or with provided invalid role_id.");
                 // You might want to handle this case: error out or create the role? 
                 // For now, adhering to instruction "make sure that I have registered the role User by default it exists everytime"
                 // Ideally we should assume it exists or error if critical.
                 // let's error if we can't find a role, or just let it fail at db level if role_id is required?
                 // User model says role_id is allowNull: false. So we MUST provide it.
                 return next(new ErrorResponse("Default 'User' role not found", 500));
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profile_picture;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "/pms/images",
                use_filename: true,
            });

            fs.unlink(req.file.path, (err: any) => {
                if (err) console.warn("Failed to delete temp file:", err);
            });

            profile_picture = result.secure_url;
        }

        const userData = {
            first_name,
            last_name,
            phone,
            email,
            password: hashedPassword,
            role_id: finalRoleId,
            siteId,
            profile_picture,
            department_id: req.body.department_id,
            status: req.body.status,
            access: req.body.access,
            responsiblities: req.body.responsibilities,
            username: username ? username.toLowerCase() : undefined,
            gender: gender || 'Male',
            position,
            terms,
            joiningDate,
            estSalary,
            ot,
        };

        const user = await User.create(userData);

        const newUser = await User.findByPk(user.id, {
            attributes: { exclude: ["password"] },
            include: [
                { model: Role, attributes: ["id", "name", "permissions"] },
                { model: Department, as: "department", attributes: ["id", "name"] },
                { model: Site, as: "site", attributes: ["id", "name"] },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
        });

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating user", 500));
    }
};

// @desc    Import multiple users
// @route   POST /api/v1/users/import
const importUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.body will be an array when sent as JSON (most common for CSV/Excel import)
    // req.files will contain uploaded files when using multipart/form-data
    let usersData: any[] = [];

    if (Array.isArray(req.body)) {
      usersData = req.body;
    } else if (req.body.users) {
      if (typeof req.body.users === 'string') {
        try {
          usersData = JSON.parse(req.body.users);
        } catch (err) {
          return next(new ErrorResponse("Invalid JSON in users field", 400));
        }
      } else if (Array.isArray(req.body.users)) {
        usersData = req.body.users;
      } else {
        return next(new ErrorResponse("Invalid users field", 400));
      }
    } else {
      return next(new ErrorResponse("Missing users data", 400));
    }

    if (usersData.length === 0) {
      return next(new ErrorResponse("Expected a non-empty array of users", 400));
    }

    // ------------------------------------------------------------------ //
    // 1. Process profile pictures (URL, base64, or actual uploaded file)
    // ------------------------------------------------------------------ //
    const uploadedFiles = req.files as Express.Multer.File[] | undefined;

    await Promise.all(
      usersData.map(async (userData: any, index: number) => {
        const picture = userData.profile_picture;

        // 1. Public URL → upload to Cloudinary
        if (typeof picture === "string" && picture.startsWith("http")) {
          const url = await uploadToCloudinary(picture);
          userData.profile_picture = url;
        }

        // 2. Base64 string → write temp file → upload
        else if (typeof picture === "string" && picture.startsWith("data:image")) {
          const base64Data = picture.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const tempPath = path.join(__dirname, `../../temp/import_${Date.now()}_${index}.png`);
          fs.writeFileSync(tempPath, buffer);
          const url = await uploadToCloudinary(tempPath);
          fs.unlinkSync(tempPath);
          userData.profile_picture = url;
        }

        // 3. Actual uploaded file (multipart) → match by index or email
        else if (uploadedFiles && uploadedFiles.length > index) {
          const file = uploadedFiles[index];
          const url = await uploadToCloudinary(file.path);
          fs.unlink(file.path, () => {});
          userData.profile_picture = url;
        }

        // If nothing matched → leave undefined (no picture)
      })
    );

    // Rename responsibilities to responsiblities to match model
    usersData.forEach(userData => {
      if ('responsibilities' in userData) {
        userData.responsiblities = userData.responsibilities;
        delete userData.responsibilities;
      } else {
        userData.responsiblities = [];
      }
    });

    // ------------------------------------------------------------------ //
    // 2. Validate required fields + hash passwords
    // ------------------------------------------------------------------ //
    for (const userData of usersData) {
      const { first_name, last_name, phone, email, password = "123456", role_id, siteId } = userData;

      if (!first_name || !last_name || !phone || !email) {
        return next(new ErrorResponse("Missing required fields in one or more users", 400));
      }

      if (!role_id) {
          const userRole = await Role.findOne({ where: { name: "User" } });
          if (userRole) {
              userData.role_id = userRole.id;
          } else {
             return next(new ErrorResponse("Default 'User' role not found", 500));
          }
      }

      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
      if (userData.username) userData.username = userData.username.toLowerCase();
      if (userData.estSalary) userData.estSalary = parseFloat(userData.estSalary);
      if (userData.ot) userData.ot = parseFloat(userData.ot);
      if (userData.joiningDate) userData.joiningDate = new Date(userData.joiningDate);
    }

    // ------------------------------------------------------------------ //
    // 3. Create users
    // ------------------------------------------------------------------ //
    const createdUsers = await User.bulkCreate(usersData, { validate: true });

    const newUsers = await User.findAll({
      where: { id: createdUsers.map((u) => u.id) },
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, attributes: ["id", "name", "permissions"] },
        { model: Department, as: "department", attributes: ["id", "name"] },
        { model: Site, as: "site", attributes: ["id", "name"] },
        { model: Project, through: { attributes: [] } },
        { model: Task, through: { attributes: [] } },
        { model: Activity, through: { attributes: [] } },
        { model: RequestModel },
      ],
    });

    res.status(201).json({ success: true, data: newUsers });
  } catch (error: any) {
    console.error("Import error:", error);
    next(new ErrorResponse(error.message || "Error importing users", 500));
  }
};

// @desc    Update a user
// @route   PUT /api/v1/users/:id
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        const updates: Record<string, any> = { ...req.body };
        if (updates.password) {
            // Hash password if provided
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "/pms/images",
                use_filename: true,
            });

            fs.unlink(req.file.path, (err: any) => {
                if (err) console.warn("Failed to delete temp file:", err);
            });

            updates.profile_picture = result.secure_url;
        }

        // Rename responsibilities to responsiblities to match model
        if ('responsibilities' in updates) {
          updates.responsiblities = updates.responsibilities;
          delete updates.responsibilities;
        }

        if (updates.username) updates.username = updates.username.toLowerCase();
        if (updates.estSalary) updates.estSalary = parseFloat(updates.estSalary);
        if (updates.ot) updates.ot = parseFloat(updates.ot);
        if (updates.joiningDate) updates.joiningDate = new Date(updates.joiningDate);

        await user.update(updates);
        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
            include: [
                { model: Role, attributes: ["id", "name", "permissions"] },
                { model: Department, as: "department", attributes: ["id", "name"] },
                { model: Site, as: "site", attributes: ["id", "name"] },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
        });

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating user", 500));
    }
};

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        await user.destroy();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting user", 500));
    }
};

const fetchUsersExcluding = async (excludeId: string) => {
    return User.findAll({
        where: {
            id: { [Op.ne]: excludeId }
        },
        attributes: ['id', 'name', 'email']
    });
};

export { getAllUsers, getUserById, createUser, importUsers, updateUser, deleteUser, fetchUsersExcluding };
