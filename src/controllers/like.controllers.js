import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Like } from "../models/like.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Video } from "../models/video.model.js"


const toggleCommentLike = asyncHandler(async (req, res) => {
    const user = req.user
    const { commentId } = req.params

    if(!user || !user?._id){
        throw new ApiError(401,"Unauthorized access...!")
    }

    if(!commentId || commentId?.trim().length()<1){
        throw new ApiError(401,"Comment ID required...!")
    }
    if(!await Comment.findById(commentId)){
        throw new ApiError(401,"Comment not found...!")
    }

    const like = await Like.find({owenr:user._id,comment:commentId})

    if(!like){
        const newLike = await Like.create({
            owenr:user._id,
            comment:commentId.trim()
        })

        if(!newLike){
            throw new ApiError(500,"Something went wrong while addinglike to comment...!")
        }
        return res.status(201).json(new ApiResponse(201,{},"Comment like added...!"))
    }

    if(!await Like.findByIdAndDelete(like._id)){
        throw new ApiError(501,"Something went wrong while deleting like...!")
    }

    return res.status(200).json(new ApiResponse(201,{},"Comment like removed...!"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const user = req.user
    const { tweetId } = req.params

    if(!user || !user?._id){
        throw new ApiError(401,"Unauthorized access...!")
    }

    if(!tweetId || tweetId?.trim().length()<1){
        throw new ApiError(401,"tweet ID required...!")
    }
    if(!await Tweet.findById(tweetId)){
        throw new ApiError(401,"Tweet not found...!")
    }

    const like = await Like.find({owenr:user._id,tweet:tweetId})

    if(!like){
        const newLike = await Like.create({
            owenr:user._id,
            tweet:tweetId.trim()
        })

        if(!newLike){
            throw new ApiError(500,"Something went wrong while adding like to tweet...!")
        }
        return res.status(201).json(new ApiResponse(201,{},"tweet like added...!"))
    }

    if(!await Like.findByIdAndDelete(like._id)){
        throw new ApiError(501,"Something went wrong while deleting like...!")
    }

    return res.status(200).json(new ApiResponse(201,{},"Tweet like removed...!"))
})

const toggleVideoLike = asyncHandler(async (req, res) => {
    const user = req.user
    const { videoId } = req.params

    if(!user || !user?._id){
        throw new ApiError(401,"Unauthorized access...!")
    }

    if(!videoId || videoId?.trim().length()<1){
        throw new ApiError(401,"Video ID required...!")
    }
    if(!await Video.findById(videoId)){
        throw new ApiError(401,"Video not found...!")
    }

    const like = await Like.find({owenr:user._id,video:videoId})

    if(!like){
        const newLike = await Like.create({
            owenr:user._id,
            video:videoId.trim()
        })

        if(!newLike){
            throw new ApiError(500,"Something went wrong while addinglike to video...!")
        }
        return res.status(201).json(new ApiResponse(201,{},"video like added...!"))
    }

    if(!await Like.findByIdAndDelete(like._id)){
        throw new ApiError(501,"Something went wrong while deleting like...!")
    }

    return res.status(200).json(new ApiResponse(201,{},"Video like removed...!"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"Unauthorized Accesss...!")
    }

    const likes = await Like.aggregate([
        {
            $match:{
                owner:user._id,
                video:{$ne : null}
            }
        }
    ])
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}