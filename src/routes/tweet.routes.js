import { Router } from "express";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js" 


const router = Router();



router.route("/create-tweet").post(verifyJWT,createTweet)
router.route("/get-user-tweets/:username").get(verifyJWT,getUserTweets)
router.route("/update-tweet/:tweetId").patch(verifyJWT,updateTweet)
router.route("/delete-tweet/:tweetId").delete(verifyJWT,deleteTweet)


export default router 
