import { Router } from "express";
import { register, login, refer, claim, myReferrals } from "../controllers/controller.mjs";
import { verifier } from "../utils/middlewares.mjs";
const router = Router();

router.post("/register", register);
router.post("/login",login);
router.get("/refer/create",verifier, refer);
router.post("/refer/claim",verifier,claim);
router.get("/refer/my",verifier, myReferrals);

export default router;