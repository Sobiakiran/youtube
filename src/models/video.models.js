import mongoose,  {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    id:{
        type: String,
        required: true
    },
    videoFile: {
        type: String,  // cloudinary url
        required: true
    },
    thumbnail:{     
        type: String ,   // cloudinary url
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,    
        ref: "users"
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: number,
        required: true
    },
    views: {
        type: number,
        default: 0
    },
    isPublished:  { 
        type: boolean,      
        default: true
    }
},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)