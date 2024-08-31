import mongoose, { mongo } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Playlist } from "../models/playlist.model.js"
import { Tweet } from "../models/tweet.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Comment } from "../models/comment.model.js"


const getChannelVideos = asyncHandler(async (req, res) => {
    const { options } = req.body
    
    const myAggregate = Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId("66cb0e5a6bed9145a803521c")
            }
        },
        {
            $sort:{createdAt:-1}
        }
    ]);
    Comment.aggregatePaginate(myAggregate, options)
    .then(function (results) {
        console.log(results);
        return res.status(201).json(new ApiResponse(201,{results},"Data sent successfully...!"))
    })
    .catch(function (err) {
        throw new ApiError(501,"Something went wrong...!")
    });
})

  

export {
//     getChannelStats, 
    getChannelVideos
}