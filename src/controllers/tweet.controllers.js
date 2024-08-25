// import mongoose from "mongoose"
import mongoose from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if(!content || content.trim()===""){
        throw new ApiError(401,"Add some content...!")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401,"Unauthorized Access...!")
    }

    const tweet = await Tweet.create({
        owner:user._id,
        content:content.trim()
    })

    if(!tweet){
        throw new ApiError(500,"Something went wrong while creating tweet...!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{tweet},"Uploaded Tweet successfully...!")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({userName:username}).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"User not found...!")
    }

    const data = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup:{
                from:"tweets",
                localField:"_id",
                foreignField:"owner",
                as:"tweets"
            }
        },
        {
            $project:{
                tweets:1
            }
        }
    ])

    if(!data){
        throw new ApiError(500,"Something went wrong while fiinding tweets...!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200,{data},"Tweet sent successfully...!")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {newTweet} = req.body

    if(!tweetId){
        throw new ApiError(401,"Invalid request...!")
    }
    if(!newTweet || newTweet?.trim()===""){
        throw new ApiError(401,"Updated tweet requiired...!")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(401,"Tweet Not Found...!")
    }

    tweet.content = newTweet.trim()

    tweet.save({validateBeforeSave:false})

    return res
    .status(201)
    .json(
        new ApiResponse(200,{tweet},"tweet updated...!")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if(!tweetId || tweetId.trim()===""){
        throw new ApiError(401,"Required tweet ID...!")
    }

    if(await Tweet.findByIdAndDelete(tweetId)){
        return res.status(201).json(new ApiResponse(201,{},"Tweet deleted...!"))
    }
    throw new ApiError(501,"Somthing went wrong while deleting tweet...!")
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}