import { Router } from "express";
import { getAllPaymentsFromUser } from "../controllers/paymentController";
import verifyJWT from "../helpers/verifyJWT";

const router = Router();
router.post("/user-payments", verifyJWT(), getAllPaymentsFromUser);
export default router;
