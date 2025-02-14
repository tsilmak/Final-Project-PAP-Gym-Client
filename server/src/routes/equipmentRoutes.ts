import { Router } from "express";
import equipmentController from "../controllers/equipmentController";

const router = Router();

router.get("/cardio", equipmentController.getCardioEquipment);
router.get("/strength", equipmentController.getStrengthEquipment);
router.get("/functional", equipmentController.getFunctionalEquipment);

export default router;
