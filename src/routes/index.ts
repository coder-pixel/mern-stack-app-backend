import { Router } from "express";
import authRoutes from "./public/auth.routes";
import userRoutes from "./protected/users.routes";
import { checkAuthentication } from "../middlewares/checkAuthentication";
import dashboardRoutes from "./protected/dashboard.routes";

const router = Router();

// public routes, no need to add middleware here, list all the public routes here
router.use("/auth", authRoutes);

// protected routes (middleware added here) - can manually add middleware to each route depending on the route, whether it's protected or not
router.use("/users", checkAuthentication, userRoutes);
router.use("/dashboard", checkAuthentication, dashboardRoutes);

export default router;
