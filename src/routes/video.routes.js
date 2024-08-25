import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js" 
import { 
    uploadVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    deleteVideo,
    togglePublishStatus
 } from "../controllers/video.controller.js";

const router = Router();


router.route("/upload-video").post(
    verifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount:1
        },
        {
            name: "thumbnail",
            maxCount:1
        }
    ]),
    uploadVideo
)

router.route("/:videoId").get(verifyJWT,getVideoById)
router.route("/user/:username").get(verifyJWT,getAllVideos)
router.route("/update-video/:videoId").patch(verifyJWT,updateVideo)
router.route("/delete-video/:videoId").delete(verifyJWT,deleteVideo)
router.route("/toggle-publish-status/:videoId").patch(verifyJWT,togglePublishStatus)


export default router