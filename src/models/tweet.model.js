import mongoose, { Types } from "mongoose";

const tweetSchema = new mongoose.Schema(
    {
        owner:{
            Type: mongoose.Schema.Types.ObjectID,
            ref:"User",
            required:true
        },
        content:{
            Type: String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Tweet = mongoose.model("Tweet",tweetSchema)