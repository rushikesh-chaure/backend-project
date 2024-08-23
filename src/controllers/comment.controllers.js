import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId || videoId?.trim().length()<1){
        throw new ApiError(401,"video ID required...!")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(401,"Video not found...!")
    }

    const data = await Video.aggregate([
        {
            $match:{
                _id:mongoose.Types.ObjectID(videoId)
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignfield:"video",
                as:"comments"
            }
        },
        {
            $project:{
                comments:1
            }
        }
    ])

    if(!data){
        throw new ApiError(501,"Something went wrong while fetching data...!")
    }

    return res.status(201).json(new ApiResponse(200,{data},"Comments sent successfully...!"))
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body
    const user = req.user

    if(!user || !user?._id){
        throw new ApiError(401,"Unauthorized access...!")
    }
    if(!videoId || videoId?.trim().length()<1){
        throw new ApiError(401,"video ID required...!")
    }
    if(!content || content?.trim().length()<1){
        throw new ApiError(401,"content required...!")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(401,"Video not found...!")
    }

    const comment = await Comment.create({
        content,
        owner:user._id,
        video:video._id
    })

    if(!comment){
        throw new ApiError(501,"Something went wrong while creating comment...!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{comment},"Comment added successfully...!")
    )
})

const deleteComment = asyncHandler(async (req,res) => {

})

export {
    getVideoComments, 
    addComment, 
    // updateComment,
    // deleteComment
}