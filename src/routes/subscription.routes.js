import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js" 
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controllers.js"


const router = Router();



router.route("/subscribe/:channel").post(verifyJWT,toggleSubscription)
router.route("/subscribers").get(verifyJWT,getUserChannelSubscribers)
router.route("/channels").get(verifyJWT,getSubscribedChannels)


export default router 
