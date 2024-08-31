import mongoose from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"



const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || name.trim()==""){
        throw new ApiError(401,"Playlist name required...!")
    }

    if(!req.user){
        throw new ApiError(401,"Unotherized Access...!")
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description?.trim() || "",
        owner: req.user._id,
        videos: []
    })

    if(!playlist){
        throw new ApiError(501,"Something went wrong while creating playlist...!")
    }

    return res.status(201).json(new ApiResponse(201,{playlist},"Created playlist successfully...!"))
}) 

const getUserPlaylists = asyncHandler(async (req, res) => {
    
    const { username } = req.params
    if(!username){
        throw new ApiError(401,"Username required...!")
    }
    const user = await User.findOne({ userName:username })

    const data = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup:{
                from:"playlists",
                localField:"_id",
                foreignField:"owner",
                as:"playlists"
            }
        },
        {
            $project:{
                playlists: 1
            }
        }
    ])
    if(!data){
        throw new ApiError(401,"Cannot find any playlist...!")
    }

    return res.status(201).json(new ApiResponse(201,{data},"Sent all playlists...!"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(401,"Can't find playlist...!")
    }

    return res.status(201).json(new ApiResponse(200,{playlist},"Sent playlist...!"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId,videoId} = req.body
    if(!playlistId){
        throw new ApiError(401,"Cannot get playlist ID...!")
    }
    if(!videoId){
        throw new ApiError(401,"Cannot get video ID...!")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if(!playlist){
        throw new ApiError(401,"Cannot find Playlist...!")
    }
    if(!video){
        throw new ApiError(401,"Cannot find video...!")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!user._id.equals(playlist.owner) || !user._id.equals(video.owner)){
        throw new ApiError(401,"Unauthorized access...!")
    }
    
    playlist.videos.push(video._id);

    await playlist.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{playlist},"Added new video to playlist...!")
    )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId,videoId} = req.body
    if(!playlistId){
        throw new ApiError(401,"Cannot get playlist ID...!")
    }
    if(!videoId){
        throw new ApiError(401,"Cannot get video ID...!")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(401,"Cannot find Playlist...!")
    }
    if(!await Video.findById(videoId)){
        throw new ApiError(401,"Cannot find video...!")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!user._id.equals(playlist.owner)){
        throw new ApiError(401,"Unauthorized access...!")
    }

    playlist.videos = playlist.videos.filter(id => !id.equals(videoId))

    await playlist.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{playlist},"Removed video from playlist...!")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!playlistId?.trim()){
        throw new ApiError(401,"Playlist ID not found...!")
    }
    const playlist = await Playlist.findById(playlistId)
    
    if(!playlist){
        throw new ApiError(401,"Playlist not found...!")
    }

    if(!user._id.equals(playlist.owner)){
        throw new ApiError(401,"Unauthorized access...!")
    }

    playlist.name = name?.trim() || playlist.name
    playlist.description = description?.trim() || playlist.description

    await playlist.save({validateBeforeSave:false})

    return res
    .status(201)
    .json(
        new ApiResponse(201,{playlist},"Playlist uppdated successfully...!")
    ) 
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if(!playlistId){
        throw new ApiError(401,"Playlist ID not found...!")
    }

    await Playlist.findOneAndDelete({_id:playlistId})

    const playlist = await Playlist.findById(playlistId)

    if(playlist){
        throw new ApiError(500,"Somthing went wrong while deleting playlist...!")
    }

    return res.status(201).json(new ApiResponse(200,{},"Playlist deleted...!"))
})
    

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}