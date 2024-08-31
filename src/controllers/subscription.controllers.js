import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channel } = req.params
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    const channelUser = await User.findOne({userName:channel}).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"Unauthorized Access...!")
    }
    if(!channelUser){
        throw new ApiError(401,"Can't find channel...!")
    }

    const data = await Subscription.findOne({
        subscriber: user._id,
        subscribeTo: channelUser._id
    })

    if(!data){
        const createdData = await Subscription.create({
            subscriber: user._id,
            subscribeTo: channelUser._id
        })
        if(!createdData){
            throw new ApiError(501,"Something went wrong while subscribing...!")
        }

        return res.status(201).json(new ApiResponse(201,{},"Subscribed channel...!"))
    }else{
        if(await Subscription.findByIdAndDelete(data._id)){
            return res.status(201).json(new ApiResponse(201,{},"Unsubscribed channel...!"))       
        }
        throw new ApiError(500,"Something went wrong while Unsubscribing...!")
    }

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const data = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscribeTo",
                as:"subscribers"
            }
        },
        {
            $project:{
                subscribers:1
            }
        }
    ])

    if(!data){
        throw new ApiError(401,"Somthing went wrong while fetching the deta...!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,{data},"Sent subscribers successfully...!")
    )
}) 

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const data = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"channels"
            }
        },
        {
            $project:{
                channels:1
            }
        }
    ])

    if(!data){
        throw new ApiError(401,"Somthing went wrong while fetching the deta...!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,{data},"Sent subscribed channels successfully...!")
    )
}) 


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}