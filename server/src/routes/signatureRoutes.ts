import { Router } from "express";
import { getAllPaymentsFromUser } from "../controllers/paymentController";
import verifyJWT from "../helpers/verifyJWT";
import signatureController from "../controllers/signatureController";

const router = Router();
// router.post("/user", verifyJWT(), signatureController.getSignatureFromUser);
router.post(
  "/gymplan/change",
  verifyJWT(),
  signatureController.setSignatureGymPlan
);
export default router;
