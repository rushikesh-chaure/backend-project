// import mongoose from "mongoose"
import mongoose from "mongoose"
import { Tweet } from "../models/tweet.model"
import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from "../utils/ApiResponse"


const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content || content.trim()===""){
        throw new Error(401,"Add some content...!")
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
    const {userId} = req.params

    const user = await User.findById(userId).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"User not found...!")
    }

    const data = await User.aggregate([
        {
            $match:{
                _id:mongoose.Types.ObjectId(user._id)
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
                "$tweets":1
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
    const { tweetId } = req.body
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