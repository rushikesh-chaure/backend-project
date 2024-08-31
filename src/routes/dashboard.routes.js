import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js" 
import { getChannelVideos } from "../controllers/dashboard.controllers.js"

const router = Router();



router.route("/").get(verifyJWT,getChannelVideos)


export default router 
