import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectID,
            ref:"User",
            required:true
        },
        content:{
            type: String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Tweet = mongoose.model("Tweet",tweetSchema)