import express from "express";
import authController from "../../controllers/auth-controller.js";
import { isBodyEmpty } from "../../middlewares/isBodyEmpty.js";
import authenticate from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";
import { isNoImage } from "../../middlewares/isNoImage.js";

const authRouter = express.Router();

authRouter.post("/register", isBodyEmpty, authController.signup);
authRouter.post("/login", isBodyEmpty, authController.signin);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.signout);
authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  isNoImage,
  authenticate,
  authController.updateAvatar
);

export default authRouter;
