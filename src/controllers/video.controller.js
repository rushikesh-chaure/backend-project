import {Video} from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"


const uploadVideo = asyncHandler(async (req, res) => {

    const { description, title } = req.body
    
    if(!description || description.trim()==""){
        throw new ApiError(401,"description is required...!")
    }
    if(!title || title.trim()==""){
        throw new ApiError(401,"title is required...!")
    }

    if(!req.user){
        throw new ApiError(401,"Unauthorized Access...!")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken")
    
    if(!user){
        throw new ApiError(401,"Invalid User access...!")
    }

    let videoLocalPath;
    if(req.files && req.files.video[0] && req.files.video[0].path){
        videoLocalPath = req.files.video[0].path
    }else{
        throw new ApiError(401,"Video NOT found...!")
    }

    let thumbnailLocalPath;
    if(req.files && req.files.thumbnail[0] && req.files.thumbnail[0].path){
        thumbnailLocalPath = req.files.thumbnail[0].path
    }else{
        throw new ApiError(401,"thumbnail NOT found...!")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video?.url){
        throw new ApiError(500,"Failed to upload video on cloudinary...!")
    }
    if(!thumbnail?.url){
        throw new ApiError(500,"Failed to upload on thumbnail cloudinary...!")
    }

    const videoObject = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title: title.trim(),
        owner: user._id,
        description: description.trim()
    })

    if(!videoObject){
        throw new ApiError(500,"Failed to create an Object in DB...!")
    }

    const UploadedVideo = await Video.findById(videoObject._id)

    if(!videoObject){
        throw new ApiError(500,"Failed to create an Object in DB...!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201,{UploadedVideo},"Video uploaded successfully...!")
    )

})

const getVideoById = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    // console.log(videoId)
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"Video not found...!")
    }
    if(!video.isPublished){
        throw new ApiError(404,"Video not found...!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,{video},"video sent successfully...!")
    )
})

const getAllVideos = asyncHandler(async (req,res) => {
    const userName = req.params.username
    
    if(!userName || !userName.trim()){
        throw new ApiError(401,"User name required...!")
    }

    const user = await User.findOne({userName:userName.trim()}).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"User does not exist...!")
    }

    const data = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"videos"
            }
        },
        {
            $project:{
                videos:1
            }
        }
    ])

    if(!data){
        throw new ApiError(501,"Something went wrong while getting videos...!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,{data},"Video data sent successfully...!")
    )
})

const updateVideo = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    const { isThumbNail, title, description } = req.body

    let thumbNail;
    if(isThumbNail){
        if(req.files && req.files.thumbNail[0] && req.files.thumbNail[0].path){
            const thumbNailLocalPath = req.files.thumbNail[0].path
            thumbNail = await uploadOnCloudinary(thumbNailLocalPath)
            if(!thumbNail || !thumbNail.url){
                throw new ApiError(500,"Something went wrong while uploading thubnail...!")
            }
        }else{
            throw new ApiError(400,"Thubnail Not Found...!")
        }    
    }
    
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400,"Video Not found...!")
    }

    video.thumbNail = thumbNail?.url || video.thumbNail
    video.title = title?.trim() || video.title
    video.description = description?.trim() || video.description

    await video.save({validateBeforeSave:false})

    return res.status(201).json(
        new ApiResponse(200, {},"Video details updated...!") 
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId || !videoId.trim()){
        throw new ApiError(401,"Video ID required...!")
    }

    const video = await Video.findById(videoId)
    if(video){
        await Video.findByIdAndDelete(videoId)
        return new ApiResponse(201,{},"Video deleted successfully...")
    }

    return res.status(201).json(new ApiResponse(200,{},"Video not found...!"))
})

const togglePublishStatus = asyncHandler(async (req,res) => {

    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(401,"Video ID required...!")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(401,"Video Not Found...!")
    }

    if(!video.owner.equals(req.user._id)){
        throw new ApiError(401,"Unauthorized Access...!")
    }

    video.isPublished = !video.isPublished

    await video.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(200,{},"Toggled publish status...!")
    )
})


export {
    uploadVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}