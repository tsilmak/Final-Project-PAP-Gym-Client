import { Router } from "express";
import {
  userProfile,
  userChangePassword,
  userCheckIfUniqueData,
  getSignatureFromUser,
  changeUserDetails,
} from "../controllers/userController";
import verifyJWT from "../helpers/verifyJWT";

const router = Router();

router.get("/profile", verifyJWT(), userProfile);

router.post("/change/password", verifyJWT(), userChangePassword);
router.post("/check-if-unique", userCheckIfUniqueData);
router.post("/signature", verifyJWT(), getSignatureFromUser);
router.post("/change/details", verifyJWT(), changeUserDetails);

export default router;
