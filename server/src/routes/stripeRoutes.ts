import { Router } from "express";
import {
  createStripePaymentIntent,
  verifyPaymentStripe,
} from "../controllers/stripeController";
import verifyJWT from "../helpers/verifyJWT";

const router = Router();
router.post("/create-payment-intent", verifyJWT(), createStripePaymentIntent);
//gets 1 param ?payment_intent=
router.get("/verify-payment", verifyJWT(), verifyPaymentStripe);
export default router;
