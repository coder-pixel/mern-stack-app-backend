import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getAllUsers } from "../../controlllers/users.controller";

const router = Router();

// define all the user related routes here
router.get("/", asyncHandler(getAllUsers));

export default router;
