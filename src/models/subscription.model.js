import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectID,
            ref:"User"
        },
        subscribeTo: {
            type: mongoose.Schema.Types.ObjectID,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

export const Subscription = mongoose.model("Subscription",subscriptionSchema)