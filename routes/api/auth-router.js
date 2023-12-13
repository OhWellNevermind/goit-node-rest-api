import express from "express";
import authController from "../../controllers/auth-controller.js";
import { isBodyEmpty } from "../../middlewares/isBodyEmpty.js";
import authenticate from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/login", isBodyEmpty, authController.signin);
authRouter.post("/register", isBodyEmpty, authController.signup);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.signout);
authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authController.updateAvatar
);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", isBodyEmpty, authController.resendVerification);

export default authRouter;
