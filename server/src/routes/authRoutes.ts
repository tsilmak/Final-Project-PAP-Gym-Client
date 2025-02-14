import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

router.post("/login", authController.login);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout);

router.post("/register", authController.register);

export default router;
