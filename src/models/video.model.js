import mongoose from "mongoose";
import aggregatePaginate  from "mongoose-aggregate-paginate-v2"

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String,
            required: true,
            trim:true,
            // unique: true,
        },
        thumbnail: {
            type: String,
            required: true,
            trim:true,
        },
        title: {
            type: String,
            required: true,
            trim:true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim:true,
        },
        duration: {
            type: Number,
            // required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        }


    },
    {
        timestamps: true
    }
)

videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model("Video",videoSchema)