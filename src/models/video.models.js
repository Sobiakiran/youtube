import mongoose,  {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    id:{
        type: string,
        required: true
    },
    videoFile: {
        type: string,  // cloudinary url
        required: true
    },
    thumbnail:{     
        type: string ,   // cloudinary url
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,    
        ref: "users"
    },
    title:{
        type: string,
        required: true
    },
    description: {
        type: string,
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