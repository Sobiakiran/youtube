import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: string,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true,
            index: true
        },
        email: {
            type: string,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true,
        },
        fullname: {
            type: string,
            required: true,
            trim: true,
            index: true
        }, 
        avatr: {
            type : string,
            required: true
        },
        coverImage:{
            type: string,  // cloudinary url
        },
        watchHistory:[
            {
                type: mongoose.Schema.Types.ObjectId,
                re: "Video"
            }
        ],
        password: {
            type: string,
            required: [true, 'Password is required']
        },
        RefreshToken:{
            type: string,

        }
      
    }
,{timestamps:true})


export const User = mongoose.model("User", userSchema) 