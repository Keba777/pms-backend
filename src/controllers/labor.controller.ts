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

    // Allowed enums for validation
    const allowedSex = ["Male", "Female"];
    const allowedTerms = ["Part Time", "Contract", "Temporary", "Permanent"];

    // Process each labor entry sequentially (keeps file pointer deterministic)
    for (let i = 0; i < laborsData.length; i++) {
      const laborEntry = laborsData[i];

      const {
        role,
        siteId,
        unit = laborEntry.unit ?? "unit",
        quantity,
        minQuantity,
        // Fields moved to LaborInformation (extracted here but not used for Labor)
        estimatedHours,
        rate,
        overtimeRate,
        totalAmount,
        skill_level,
        responsiblePerson,
        allocationStatus,
        utilization_factor,
        totalTime,
        startingDate,
        dueDate,
        shiftingDate,
        status,
      } = laborEntry;

      // Check existing labor by role + siteId
      let labor = await Labor.findOne({ where: { role, siteId } });

      // If not exists, create the labor (only core planning fields)
      if (!labor) {
        labor = await Labor.create({
          role,
          siteId,
          unit,
          quantity,
          minQuantity,
          status,
          responsiblePerson,
        } as any);
      } else {
        // Update existing labor (quantity, minQuantity, status, responsiblePerson)
        await labor.update({
          quantity: quantity ?? labor.quantity,
          minQuantity: minQuantity ?? labor.minQuantity,
          status: status ?? labor.status,
          responsiblePerson: responsiblePerson ?? labor.responsiblePerson,
        });
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
          // Skip invalid info entries
          console.warn("Skipping labor information due to missing required fields:", info);
          continue;
        }

        // Handle profile picture logic (omitted for brevity, assume same helper usage)
        let profilePictureUrl: string | undefined = undefined;
        // ... (existing helper logic would go here, effectively re-using previous blocks or keeping as is if not replacing huge block)
        const picture = info.profile_picture;

        // 1) If profile_picture is a URL -> re-upload to Cloudinary
        if (typeof picture === "string" && picture.startsWith("http")) {
          try {
            const url = await uploadToCloudinary(picture);
            if (url) profilePictureUrl = url;
          } catch (e) {
            console.warn("Failed to upload profile picture from URL:", e);
          }
        }
        // 2) If it's a base64 data URI
        else if (typeof picture === "string" && picture.startsWith("data:image")) {
          try {
            // ... base64 logic ...
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
          } catch (e) {
            console.warn("Failed to handle base64 profile picture:", e);
          }
        }
        // 3) If an uploaded file exists and info.fileName provided
        else if (uploadedFiles && uploadedFiles.length > 0) {
          let matchedFile: Express.Multer.File | undefined;
          if (info.fileName) {
            matchedFile = uploadedFiles.find((f) => f.originalname === info.fileName || f.filename === info.fileName);
          }
          if (!matchedFile) {
            if (globalFilePointer < uploadedFiles.length) {
              matchedFile = uploadedFiles[globalFilePointer];
              globalFilePointer += 1;
            }
          }
          if (matchedFile) {
            try {
              const url = await uploadToCloudinary(matchedFile.path);
              try { fs.unlinkSync(matchedFile.path); } catch (e) { }
              if (url) profilePictureUrl = url;
            } catch (e) {
              console.warn("Failed to upload matched file for profile picture:", e);
            }
          }
        }

        // Prepare optional fields
        let sexValue: "Male" | "Female" | undefined = undefined;
        if (info.sex && typeof info.sex === "string") {
          // ... validation ...
          const trimmed = info.sex.trim();
          if (allowedSex.includes(trimmed)) sexValue = trimmed as "Male" | "Female";
        }
        let termsValue: any = undefined;
        if (info.terms && typeof info.terms === "string") {
          const trimmed = info.terms.trim();
          if (allowedTerms.includes(trimmed)) termsValue = trimmed as any;
        }

        let estSalaryValue: number | undefined = undefined;
        if (info.estSalary !== undefined && info.estSalary !== null && info.estSalary !== "") {
          const parsed = Number(info.estSalary);
          if (!Number.isNaN(parsed)) estSalaryValue = parsed;
        }

        const positionValue = typeof info.position === "string" && info.position.trim() !== "" ? info.position.trim() : undefined;
        const educationLevelValue = typeof info.educationLevel === "string" && info.educationLevel.trim() !== "" ? info.educationLevel.trim() : undefined;

        // Use values from info OR fallback to laborEntry top-level fields (legacy support)
        // If the user provided these at the top level, we apply them to the individual
        // Note: info properties take precedence if both exist.
        const mergedEstimatedHours = info.estimatedHours ?? estimatedHours;
        const mergedRate = info.rate ?? rate;
        const mergedOvertimeRate = info.overtimeRate ?? overtimeRate;
        const mergedTotalAmount = info.totalAmount ?? totalAmount;
        const mergedSkillLevel = info.skill_level ?? skill_level;
        const mergedResponsiblePerson = info.responsiblePerson ?? responsiblePerson;
        const mergedUtilizationFactor = info.utilization_factor ?? utilization_factor;
        const mergedTotalTime = info.totalTime ?? totalTime;
        const mergedStartingDate = info.startingDate ?? startingDate;
        const mergedDueDate = info.dueDate ?? dueDate;
        const mergedShiftingDate = info.shiftingDate ?? shiftingDate;
        const mergedStatus = info.status ?? allocationStatus ?? "Unallocated";

        // Create the LaborInformation row
        try {
          await LaborInformation.create({
            firstName: info.firstName,
            lastName: info.lastName,
            laborId: labor.id,
            startsAt: new Date(info.startsAt),
            endsAt: new Date(info.endsAt),
            status: mergedStatus,
            profile_picture: profilePictureUrl,
            phone: info.phone,
            position: positionValue,
            sex: sexValue,
            terms: termsValue,
            estSalary: estSalaryValue,
            educationLevel: educationLevelValue,
            // New fields mapped to LaborInformation
            estimatedHours: mergedEstimatedHours,
            rate: mergedRate,
            overtimeRate: mergedOvertimeRate,
            totalAmount: mergedTotalAmount,
            skill_level: mergedSkillLevel,
            utilization_factor: mergedUtilizationFactor,
            totalTime: mergedTotalTime,
            shiftingDate: mergedShiftingDate ? new Date(mergedShiftingDate) : undefined,
          } as any);
        } catch (err) {
          console.error("Failed to create LaborInformation for", info, err);
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
