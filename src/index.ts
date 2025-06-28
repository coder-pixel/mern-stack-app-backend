import express, { Request, Response } from "express";

import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

require("dotenv").config(); // Load environment variables - need to be at top

const app = express();

app.use(
  cors({
    credentials: true, // impt for how we are gona use our authentication
  })
);

app.use(compression());
app.use(cookieParser()); // used when working with cookies
app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server running  dfg just fine");
});

const startServer = async () => {
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
};

startServer();
