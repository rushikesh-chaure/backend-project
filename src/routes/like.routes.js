import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js" 
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controllers.js"


const router = Router();

router.route("/comment/:commentId").post(verifyJWT,toggleCommentLike)
router.route("/tweet/:tweetId").post(verifyJWT,toggleTweetLike)
router.route("/video/:videoId").post(verifyJWT,toggleVideoLike)
router.route("/videos").get(verifyJWT,getLikedVideos)

export default router 
