import mongoose from 'mongoose';
import connectDB from './db/db.js '
import dotenv from 'dotenv'
import app from './app.js'

dotenv.config({
    path: './env'
})


connectDB()
.then(() =>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(`App is running on port: ${process.env.PORT}`)
    //     
    })
})
.catch((err)=>{
    console.log("mongo db connerction failed:", err)
})

























/*
import {DB_NAME} from './constants.js'
import express from 'express'
const app = express()

(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("ERROR:", error)
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listining on prort: ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log("ERROR:" , error)
        throw error
    }
})()*/