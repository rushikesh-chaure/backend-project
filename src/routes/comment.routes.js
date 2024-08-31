import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js" 
import {
    getVideoComments, 
    addComment, 
    deleteComment,
    updateComment
} from "../controllers/comment.controllers.js"

const router = Router();

router.route("/get/:videoId").get(verifyJWT,getVideoComments)
router.route("/add/:videoId").post(verifyJWT,addComment)
router.route("/delete/:commentId").delete(verifyJWT,deleteComment)
router.route("/update/:commentId").patch(verifyJWT,updateComment)

export default router 
