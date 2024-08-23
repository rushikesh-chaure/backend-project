import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    updatePassword, 
    getCurrentUser, 
    updateAvatar,
    updateCoverImage
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js" 


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)


// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/update-password").post(verifyJWT, updatePassword)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)
router.route("/update-avatar").post(verifyJWT,upload.fields([{name:"avatarImage",maxCount:1}]),updateAvatar)
router.route("/update-cover-image").post(verifyJWT,upload.fields([{name:"coverImage",maxCount:1}]),updateCoverImage)


export default router 