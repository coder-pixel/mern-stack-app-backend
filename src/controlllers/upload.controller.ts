import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { updateUserById } from "../services/user.service";
import { IFile, UploadTypeEnum } from "../types";

export const uploadFileToCloudinary = async (
  req: any,
  res: Response,
  type: UploadTypeEnum
) => {
  if (!req.file && !req?.files) {
    throw new AppError("No file uploaded", 400); // no file uploaded error
  }

  // for single file upload
  if (req?.file) {
    const file = req?.file as IFile;

    if (type === UploadTypeEnum.Document) {
      const updatedUser = await updateUserById(
        req?.user?._id || req?.user?.id,
        {
          document: file?.path,
        }
      );
    } else if (type === UploadTypeEnum.ProfileImage) {
      await updateUserById(req?.user?.id || req?.user?._id, {
        profileImage: file?.path,
      });
    }

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
    const urls = req?.files?.map((file: IFile) => ({
      url: file?.path,
      filename: file?.filename,
    }));

    if (type === UploadTypeEnum.Images) {
      await updateUserById(req?.user?._id, { images: urls });
    }

    return res.status(200).json({
      error: false,
      message: "Files uploaded successfully",
      data: urls,
    });
  }
};
