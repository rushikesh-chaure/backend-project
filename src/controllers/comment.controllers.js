import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId || videoId?.trim()==""){
        throw new ApiError(401,"video ID required...!")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(401,"Video not found...!")
    }

    const data = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
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

    if(!videoId || videoId?.trim()==""){
        throw new ApiError(401,"video ID required...!")
    }
    if(!content || content?.trim()==""){
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
    .catch(err => {
        throw new ApiError(501,"Something went wrong while creating comment...!",err)
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,{comment},"Comment added successfully...!")
    )
})

const deleteComment = asyncHandler(async (req,res) => {
    const { commentId } = req.params

    if(!commentId || commentId?.trim()==""){
        throw new ApiError(401,"Comment ID required...!")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404,"Comment not find...!")
    }

    const video = Video.findById(comment.owner).select("-password -refreshToken")

    if(!video){
        throw new ApiError(501,"Something went wrong...!")
    }
    if(!req.user._id.equals(comment.owner) && !req.user._id.equals(video.owner)){
        throw new ApiError(402,"Unauthorized access...!")
    }

    await Comment.findByIdAndDelete(commentId)
    .then(deleted => {
        if(deleted){
            return res
            .status(200)
            .json(
                new ApiResponse(200,{},"Comment deleted successfully...!")
            )
        }else{
            return res
            .status(404)
            .json(
                new ApiResponse(404,{},"Comment not found...!")
            )
        }
    })
    .catch(err =>{
        throw new ApiError(501,"Something went wrong while deleting comment...!",err)
    })

    
    // return res.status(200).json(new ApiResponse(200,{},"Comment deleted successfully...!"))
})

const updateComment = asyncHandler(async (req,res) => {
    const { commentId } = req.params
    const { content } = req.body

    if(!commentId || commentId?.trim()==""){
        throw new ApiError(401,"comment ID required...!")
    }
    if(!content || content?.trim()==""){
        throw new ApiError(401,"Content required...!")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken")
    .catch(err =>{
        throw new ApiError(500,"Something went wrong...!")
    })

    const comment = await Comment.findOne({_id:commentId})

    if(!user._id.equals(comment.owner)){
        throw new ApiError(401,"Unauthorized access...!")
    }

    comment.content = content.trim()

    await comment.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Comment updated...!")
    )
})

export {
    getVideoComments, 
    addComment, 
    deleteComment,
    updateComment
}