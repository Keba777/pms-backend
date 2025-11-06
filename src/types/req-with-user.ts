// src/types/req-with-user.ts
import { Request } from "express";

/**
 * Shared request type: extends Express.Request to include
 * optional `user`, `file` and `files` properties used in your app.
 * Replace `any` with your specific User instance type if you want stronger typing.
 */
export type ReqWithUser = Request & {
  user?: { id: string } | any;
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | any;
};
