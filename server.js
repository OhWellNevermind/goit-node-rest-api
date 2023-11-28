import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";
import { error } from "console";

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(process.env.PORT, () => {
      console.log(`Server running. Use our API on port: ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log(error.message);
    process.exit(1);
  });
