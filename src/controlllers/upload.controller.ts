import { Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const uploadFileToCloudinary = async (req: Request, res: Response) => {
  if (!req.file || !req?.files) {
    throw new AppError("No file uploaded", 400); // no file uploaded error
  }

  // for single file upload
  if (req?.file) {
    const file = req?.file as Express.Multer.File & { path?: string };

    return res.status(200).json({
      error: false,
      message: "File uploaded successfully",
      data: {
        url: file?.path,
        filename: file?.filename,
      },
    });
  }

  // for multiple file upload
  if (Array.isArray(req?.files)) {
    const urls = req?.files?.map((file) => ({
      url: file?.path,
      filename: file?.filename,
    }));

    return res.status(200).json({
      error: false,
      message: "Files uploaded successfully",
      data: urls,
    });
  }
};
