// controllers/labor.controller.ts
import { NextFunction, Request, Response } from "express";
import Labor from "../models/Labor.model";
import ErrorResponse from "../utils/error-response.utils";
import LaborInformation from "../models/LaborInformation.model";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

// @desc    Create a new labor
// @route   POST /api/v1/labors
export const createLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.create(req.body);
        res.status(201).json({ success: true, data: labor });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating labor", 500));
    }
};

// @desc    Get all labors
// @route   GET /api/v1/labors
export const getAllLabors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labors = await Labor.findAll({
            include: [
                { model: LaborInformation, as: "laborInformations" }
            ],
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json({ success: true, data: labors });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving labors", 500));
    }
};

// @desc    Get a labor by ID
// @route   GET /api/v1/labors/:id
export const getLaborById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.findByPk(req.params.id, {
            include: [
                { model: LaborInformation, as: "laborInformations" }
            ],
            order: [["createdAt", "ASC"]],
        });
        if (!labor) {
            return next(new ErrorResponse("Labor not found", 404));
        }
        res.status(200).json({ success: true, data: labor });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving labor", 500));
    }
};

// @desc    Update a labor
// @route   PUT /api/v1/labors/:id
export const updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) {
            return next(new ErrorResponse("Labor not found", 404));
        }
        await labor.update(req.body);
        res.status(200).json({ success: true, data: labor });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating labor", 500));
    }
};

// @desc    Delete a labor
// @route   DELETE /api/v1/labors/:id
export const deleteLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) {
            return next(new ErrorResponse("Labor not found", 404));
        }
        await labor.destroy();
        res.status(200).json({ success: true, message: "Labor deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting labor", 500));
    }
};

/**
 * Helper: upload a local file path to Cloudinary and return secure_url or null
 */
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

// ----------------------
// Import labors endpoint
// ----------------------
// @desc    Import multiple labors and their laborInformations
// @route   POST /api/v1/labors/import
export const importLabors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse incoming labors data (support JSON array or field "labors" with stringified JSON)
    let laborsData: any[] = [];

    if (Array.isArray(req.body)) {
      laborsData = req.body;
    } else if (req.body.labors) {
      if (typeof req.body.labors === "string") {
        try {
          laborsData = JSON.parse(req.body.labors);
        } catch (err) {
          return next(new ErrorResponse("Invalid JSON in labors field", 400));
        }
      } else if (Array.isArray(req.body.labors)) {
        laborsData = req.body.labors;
      } else {
        return next(new ErrorResponse("Invalid labors field", 400));
      }
    } else {
      return next(new ErrorResponse("Missing labors data", 400));
    }

    if (laborsData.length === 0) {
      return next(new ErrorResponse("Expected a non-empty array of labors", 400));
    }

    // Uploaded files (if multipart)
    const uploadedFiles = req.files as Express.Multer.File[] | undefined;

    // We'll keep a pointer for files when files are not explicitly matched by name
    let globalFilePointer = 0;

    // Validate essential fields at labor level (role + siteId required)
    for (const ld of laborsData) {
      if (!ld.role || !ld.siteId) {
        return next(new ErrorResponse("Missing required fields (role or siteId) in one or more labors", 400));
      }
    }

    const createdLaborsIds: string[] = [];

    // Process each labor entry sequentially (keeps file pointer deterministic)
    for (let i = 0; i < laborsData.length; i++) {
      const laborEntry = laborsData[i];

      const {
        role,
        siteId,
        unit = laborEntry.unit ?? "unit",
        quantity,
        minQuantity,
        estimatedHours,
        rate,
        overtimeRate,
        totalAmount,
        skill_level,
        responsiblePerson,
        allocationStatus,
        status,
        utilization_factor,
        totalTime,
        startingDate,
        dueDate,
        shiftingDate,
      } = laborEntry;

      // Check existing labor by role + siteId
      let labor = await Labor.findOne({ where: { role, siteId } });

      // If not exists, create the labor (use provided fields when available)
      if (!labor) {
        const newLabor = await Labor.create({
          role,
          siteId,
          unit,
          quantity,
          minQuantity,
          estimatedHours,
          rate,
          overtimeRate,
          totalAmount,
          skill_level,
          responsiblePerson,
          allocationStatus,
          status,
          utilization_factor,
          totalTime,
          startingDate,
          dueDate,
          shiftingDate,
        } as any);
        labor = newLabor;
      } else {
        // Optionally we could update labor's fields from import; for safety, we don't overwrite existing values here.
      }

      // Create labor informations for this labor
      // Support:
      // - laborEntry.laborInformations (array)
      // - OR single record fields on laborEntry: firstName, lastName, startsAt, endsAt, status (and optional profile_picture/fileName)
      const infoCandidates: any[] = Array.isArray(laborEntry.laborInformations)
        ? laborEntry.laborInformations
        : (laborEntry.firstName ? [laborEntry] : []);

      for (let j = 0; j < infoCandidates.length; j++) {
        const info = infoCandidates[j];

        // Required for laborInformation: firstName, lastName, startsAt, endsAt
        if (!info.firstName || !info.lastName || !info.startsAt || !info.endsAt) {
          // Skip invalid info entries (or you can choose to error)
          console.warn("Skipping labor information due to missing required fields:", info);
          continue;
        }

        // Handle profile picture for labor information.
        // Possible forms: info.profile_picture (http URL), base64 data URI, or an uploaded file (match by fileName or take next file)
        let profilePictureUrl: string | undefined = undefined;
        const picture = info.profile_picture;

        // 1) If profile_picture is a URL -> re-upload to Cloudinary
        if (typeof picture === "string" && picture.startsWith("http")) {
          const url = await uploadToCloudinary(picture);
          if (url) profilePictureUrl = url;
        }

        // 2) If it's a base64 data URI
        else if (typeof picture === "string" && picture.startsWith("data:image")) {
          const base64Data = picture.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const tempPath = path.join(__dirname, `../../temp/laborinfo_${Date.now()}_${i}_${j}.png`);
          fs.writeFileSync(tempPath, buffer);
          const url = await uploadToCloudinary(tempPath);
          try {
            fs.unlinkSync(tempPath);
          } catch (e) {
            // ignore
          }
          if (url) profilePictureUrl = url;
        }

        // 3) If an uploaded file exists and info.fileName provided, try to match by originalname
        else if (uploadedFiles && uploadedFiles.length > 0) {
          let matchedFile: Express.Multer.File | undefined;

          if (info.fileName) {
            matchedFile = uploadedFiles.find((f) => f.originalname === info.fileName || f.filename === info.fileName);
          }

          // If not matched by name, attempt to take next available file by pointer
          if (!matchedFile) {
            if (globalFilePointer < uploadedFiles.length) {
              matchedFile = uploadedFiles[globalFilePointer];
              globalFilePointer += 1;
            }
          }

          if (matchedFile) {
            // upload and attempt to unlink temp path
            const url = await uploadToCloudinary(matchedFile.path);
            try {
              fs.unlinkSync(matchedFile.path);
            } catch (e) {
              // ignore unlink errors
            }
            if (url) profilePictureUrl = url;
          }
        }

        // Create the LaborInformation row
        try {
          // Removed unused 'createdInfo' variable — we no longer assign to an unused const.
          await LaborInformation.create({
            firstName: info.firstName,
            lastName: info.lastName,
            laborId: labor.id,
            startsAt: new Date(info.startsAt),
            endsAt: new Date(info.endsAt),
            status: info.status ?? "Unallocated",
            // If your LaborInformation model already has profile_picture column this will be saved.
            // If not present in model this field is ignored (but you said you only wanted controller changes).
            profile_picture: profilePictureUrl,
          } as any);
        } catch (err) {
          console.error("Failed to create LaborInformation for", info, err);
          // continue creating other items rather than aborting whole import
        }
      } // end infoCandidates loop

      createdLaborsIds.push(labor.id);
    } // end laborsData loop

    // Fetch created/used labors with their laborInformations and return
    const resultLabors = await Labor.findAll({
      where: { id: { [Op.in]: createdLaborsIds } },
      include: [{ model: LaborInformation, as: "laborInformations" }],
      order: [["createdAt", "ASC"]],
    });

    return res.status(201).json({ success: true, data: resultLabors });
  } catch (error: any) {
    console.error("Import labors error:", error);
    return next(new ErrorResponse(error.message || "Error importing labors", 500));
  }
};
