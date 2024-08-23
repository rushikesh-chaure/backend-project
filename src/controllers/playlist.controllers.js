import mongoose from "mongoose"
import { Playlist } from "../models/playlist.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import { User } from "../models/user.model"
import { Video } from "../models/video.model"



const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || name?.trim().length()==0){
        throw new ApiError(401,"Can't get playlist name...!")
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
    if(!req.user){
        throw new ApiError(401,"User not found...!")
    }

    const data = await User.aggregate([
        {
            $match:{
                _id:mongoose.Types.ObjectId(req.user._id)
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
                playlist: 1
            }
        }
    ])
    if(!data){
        throw new ApiError(401,"Cannot find any playlist...!")
    }

    return res.status(201).json(new ApiResponse(201,{data},"Sent all playlists...!"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.body

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

    playlist.videos.push(video._id);

    playlist.save({validateBeforeSave: false})

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

    playlist.videos = playlist.videos.filter(id => id !== videoId)

    playlist.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{playlist},"Removed video from playlist...!")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description, playlistId } = req.body

    if(!playlist?.trim()){
        throw new ApiError(401,"Playlist ID not found...!")
    }
    const playlist = await Playlist.findById(playlistId)
    
    if(!playlist){
        throw new ApiError(401,"Playlist not found...!")
    }

    playlist.name = name?.trim() || playlist.name
    playlist.description = description?.trim() || playlist.description

    playlist.save({validateBeforeSave:false})

    return res
    .status(201)
    .json(
        new ApiResponse(201,{playlist},"Playlist uppdated successfully...!")
    ) 
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.body

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