import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
    {
        id: {
            type :  String
        },
        content: {
            type: String,
            required: true
        },
        video: {
            type: mongoose.Schema.Types.objectId,
            ref: "Video"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {timestamps: true}
)
export const Comment = mongoose.model("Comment", commentSchema)