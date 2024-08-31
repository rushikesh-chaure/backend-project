import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js" 
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controllers.js"

const router = Router();

router.route("/create").post(verifyJWT,createPlaylist)
router.route("/user/:username").get(verifyJWT,getUserPlaylists)
router.route("/:playlistId").get(verifyJWT,getPlaylistById)
router.route("/add-video").put(verifyJWT,addVideoToPlaylist)
router.route("/remove-video").delete(verifyJWT,removeVideoFromPlaylist)
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/update/:playlistId").patch(verifyJWT,updatePlaylist)




export default router 
