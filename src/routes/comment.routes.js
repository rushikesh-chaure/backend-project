import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js" 


const router = Router();



router.route("/").post()


export default router 
