import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

const connectDB = async ()=>{
    try{
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI }/${DB_NAME}`)
        console.log("MongoDB connected!")
        // optional console //console.log(`MongoDB connected! DB Host: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("MongooDB connection error:", error)
        process.exit(1) // instead of thow.
    } 
}

export default connectDB