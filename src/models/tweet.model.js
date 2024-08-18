import mongoose, { Types } from "mongoose";

const tweetSchema = new mongoose.Schema(
    {
        owner:{
            Type: mongoose.Schema.Types.ObjectID,
            ref:"User"
        },
        content:{
            Type: String
        }
    },
    {
        timestamps:true
    }
)

export const Tweet = mongoose.model("Tweet",tweetSchema)