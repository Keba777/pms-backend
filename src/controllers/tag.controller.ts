import { NextFunction, Request, Response } from "express";
import Tag from "../models/Tag.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new tag
// @route   POST /api/v1/tags
const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json({ success: true, data: tag });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating tag", 500));
    }
};

// @desc    Get all tags
// @route   GET /api/v1/tags
const getAllTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving tags", 500));
    }
};

// @desc    Get a tag by ID
// @route   GET /api/v1/tags/:id
const getTagById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return next(new ErrorResponse("Tag not found", 404));
        }
        res.status(200).json({ success: true, data: tag });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving tag", 500));
    }
};

// @desc    Update a tag
// @route   PUT /api/v1/tags/:id
const updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return next(new ErrorResponse("Tag not found", 404));
        }

        await tag.update(req.body);
        res.status(200).json({ success: true, data: tag });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating tag", 500));
    }
};

// @desc    Delete a tag
// @route   DELETE /api/v1/tags/:id
const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return next(new ErrorResponse("Tag not found", 404));
        }

        await tag.destroy();
        res.status(200).json({ success: true, message: "Tag deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting tag", 500));
    }
};

export { createTag, getAllTags, getTagById, updateTag, deleteTag };
