import express from "express";

import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { CLIENT_URL, PORT } from "./config";

// require("dotenv").config(); // Load environment variables - need to be at top

const app = express();

app.use(
  cors({
    origin: CLIENT_URL || "http://localhost:3000",
    credentials: true, // impt for how we are gona use our authentication
  })
);

app.use(compression());
app.use(cookieParser()); // used when working with cookies
app.use(bodyParser.json());

const port = PORT || 8080;

app.use("/api/v1", routes); // => /api/v1 -> define the prefix with version

app.use(errorHandler); // => global error handler -> need to be added after all the routes, otherwise it will not catch the route errors

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port as number, "0.0.0.0", () => {
      console.log(`✅ Server listening on port: ${port}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();
