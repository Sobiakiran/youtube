import { User } from "../models/user.models.js"
import apiError from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res , next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        console.log("token is: ", token)
 
if(!token){
    throw new apiError(401, "unauthorized request")
}
const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
const user =  User.findById(decodedToken?._id).select("-password -refreshToken")

if (!user) {
    throw new apiError(401, "Invalid Access token")
} 
req.user = user
next()
        
    } catch (error) {
         throw new apiError(401, Error?.message || "invalid accesstoken")
    }
})  

