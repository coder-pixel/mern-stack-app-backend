import express, { Request, Response } from "express";

import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

require("dotenv").config(); // Load environment variables - need to be at top

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // impt for how we are gona use our authentication
  })
);

app.use(compression());
app.use(cookieParser()); // used when working with cookies
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.use("/api", routes); // => /api/v1 -> define the prefix with version

app.get("/", (req: Request, res: Response) => {
  res.send("Server running  dfg just fine");
});

app.get(
  "/dashboard",
  checkAuthentication,
  (req: AuthenticatedRequest, res: Response) => {
    res.send({ message: "You are authenticated!", user: req.user });
  }
);

app.get("/error-test", () => {
  throw new Error("Test error");
});

app.use(errorHandler); // => global error handler -> need to be added after all the routes, otherwise it will not catch the route errors

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT as number, "0.0.0.0", () => {
      console.log(`✅ Server listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();
