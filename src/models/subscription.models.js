import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
    {
        id: {
            type : String,
           
        },
        subscriber: {
            type : Schema.Types.ObjectId,
            ref: "User"
        },
        channel: {
            type : Schema.Types.ObjectId,
            ref:  "User"
           
        }
    },
    {timestamps:true}
)


export const Subscription = mongoose.model("Subscription", subscriptionSchema) 