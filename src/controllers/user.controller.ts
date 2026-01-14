import { NextFunction, Response } from "express";
import { ReqWithUser } from "../types/req-with-user";
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
import Organization from "../models/Organization.model";
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
const getAllUsers = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const where: any = {};

    if (user?.role?.name?.toLowerCase() !== "systemadmin") {
      where.orgId = user?.orgId;
    }

    const users = await User.findAll({
      where,
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
        {
          model: Organization,
          attributes: ["id", "orgName", "logo"],
        },
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
const getUserById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id as string, {
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

    const currentUser = req.user;
    // Allow if SystemAdmin OR user is accessing themselves OR user belongs to same org
    const isSystemAdmin = currentUser?.role?.name?.toLowerCase() === "systemadmin";
    const isSelf = currentUser?.id === user.id;
    const isSameOrg = currentUser?.orgId && user.orgId === currentUser.orgId;

    if (!isSystemAdmin && !isSelf && !isSameOrg) {
      return next(new ErrorResponse("Not authorized to access this user", 403));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving user", 500));
  }
};

// @desc    Create a new user
// @route   POST /api/v1/users
const createUser = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    // Extract and validate required fields
    let { first_name, last_name, phone, email, password, role_id, siteId, username, gender, position, terms, joiningDate, estSalary, ot } = req.body;

    if (!first_name || !last_name || !phone || !email) {
      return next(new ErrorResponse("Missing required fields", 400));
    }

    // Auto-generate username if not provided
    if (!username || username.trim() === "") {
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
      username = `${first_name.toLowerCase()}${last_name.toLowerCase()}${randomNumber}`;
    }

    // Set default password if not provided or empty
    if (!password || password.trim() === "") {
      password = "123456";
    }

    let finalRoleId = role_id;
    if (!finalRoleId) {
      const userRole = await Role.findOne({ where: { name: "User" } });
      if (userRole) {
        finalRoleId = userRole.id;
      } else {
        console.warn("Default 'User' role not found. Creating user without role or with provided invalid role_id.");
        return next(new ErrorResponse("Default 'User' role not found", 500));
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profile_picture;
    if (req.file) {
      // Use absolute path for upload
      const absolutePath = path.resolve(req.file.path);
      const result = await cloudinary.uploader.upload(absolutePath, {
        folder: "/pms/images",
        use_filename: true,
      });

      fs.unlink(absolutePath, (err: any) => {
        if (err) console.warn("Failed to delete temp file:", err);
      });

      profile_picture = result.secure_url;
    }

    const currentUser = req.user;
    const isSystemAdmin = currentUser?.role?.name?.toLowerCase() === "systemadmin";
    const isSuperAdmin = currentUser?.role?.name?.toLowerCase() === "superadmin";

    // 1) Authorization check: who can create what?
    if (!isSystemAdmin && !isSuperAdmin) {
      return next(new ErrorResponse("Not authorized to create users", 403));
    }

    // 2) Role validation
    const targetRole = await Role.findByPk(finalRoleId);
    if (!targetRole) {
      return next(new ErrorResponse("Target role not found", 404));
    }

    const targetRoleName = targetRole.name.toLowerCase();

    // Only SystemAdmin can create SuperAdmins or SystemAdmins
    if (["systemadmin", "superadmin"].includes(targetRoleName) && !isSystemAdmin) {
      return next(new ErrorResponse("Only SystemAdmin can create SuperAdmin or SystemAdmin users", 403));
    }

    // 3) Organization assignment
    let finalOrgId = req.body.orgId;

    if (isSystemAdmin) {
      // SystemAdmin can specify orgId, or if not provided, it might be null (global user)
      // but usually users should belong to an org if they are not SystemAdmin.
    } else if (isSuperAdmin) {
      // SuperAdmin can ONLY create users for their own organization
      finalOrgId = currentUser?.orgId;
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
      responsibilities: req.body.responsibilities,
      username: username ? username.toLowerCase() : undefined,
      gender: gender || 'Male',
      position,
      terms,
      joiningDate,
      estSalary,
      ot,
      orgId: finalOrgId,
      isStricted: req.body.isStricted || false
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
const importUsers = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const currentUser = req.user;
    const isSystemAdmin = currentUser?.role?.name?.toLowerCase() === "systemadmin";
    const isSuperAdmin = currentUser?.role?.name?.toLowerCase() === "superadmin";

    if (!isSystemAdmin && !isSuperAdmin) {
      return next(new ErrorResponse("Not authorized to import users", 403));
    }

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
          fs.unlink(file.path, () => { });
          userData.profile_picture = url;
        }

        // If nothing matched → leave undefined (no picture)
      })
    );

    // responsibilities is now correctly named in the model

    // ------------------------------------------------------------------ //
    // 2. Validate required fields + hash passwords + enforce orgId
    // ------------------------------------------------------------------ //
    for (const userData of usersData) {
      const { first_name, last_name, phone, email, password = "123456", role_id, siteId } = userData;

      if (!first_name || !last_name || !phone || !email) {
        return next(new ErrorResponse("Missing required fields in one or more users", 400));
      }

      // Enforce Org ID
      if (!isSystemAdmin) {
        userData.orgId = currentUser?.orgId;
      }
      // If system admin, they can pass orgId, or we leave it (or default logic)

      if (!role_id) {
        // Fallback to "User" role for that Org (or global "User" role if scoped roles not used strictly yet)
        // Best effort: find a role named "User"
        // Ideally we should find "User" role scoped to this org if roles are scoped.
        // For now, simple logic:
        const userRole = await Role.findOne({
          where: {
            name: "User",
            // orgId: userData.orgId // Optional: refine this if roles are strict
          }
        });
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
const updateUser = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const currentUser = req.user;
    const isSystemAdmin = currentUser?.role?.name?.toLowerCase() === "systemadmin";
    const isSameOrg = currentUser?.orgId && user.orgId === currentUser.orgId;

    if (!isSystemAdmin && !isSameOrg) {
      return next(new ErrorResponse("Not authorized to update this user", 403));
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

    // responsibilities is now correctly named in the model

    if (updates.username) updates.username = updates.username.toLowerCase();
    if (updates.estSalary) updates.estSalary = parseFloat(updates.estSalary);
    if (updates.ot) updates.ot = parseFloat(updates.ot);
    if (updates.joiningDate) updates.joiningDate = new Date(updates.joiningDate);

    // Only SuperAdmin or Admin can change isStricted
    const isPrivileged = ["admin", "superadmin", "systemadmin"].includes(
      currentUser?.role?.name?.toLowerCase()
    );

    if (!isPrivileged && updates.hasOwnProperty("isStricted")) {
      delete updates.isStricted;
    }

    await user.update(updates);
    const updatedUser = await User.findByPk(req.params.id as string, {
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
const deleteUser = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const currentUser = req.user;
    const isSystemAdmin = currentUser?.role?.name?.toLowerCase() === "systemadmin";
    const isSameOrg = currentUser?.orgId && user.orgId === currentUser.orgId;

    if (!isSystemAdmin && !isSameOrg) {
      return next(new ErrorResponse("Not authorized to delete this user", 403));
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

