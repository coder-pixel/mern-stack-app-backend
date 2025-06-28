import { Request, Response } from "express";
import { getUsers } from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const usersList = await getUsers();

  res.status(200).json({
    error: false,
    users: usersList,
    totalCount: usersList?.length,
  });
};
