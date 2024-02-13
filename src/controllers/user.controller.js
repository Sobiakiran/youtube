import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import {User} from '../models/user.models.js';
import uploadOnCloudinary from '../utils/fileupload.cloudinary.js'

const registerUser = asyncHandler(async (req, res)=>{
   // get all details of user from frontend
   // validation
   // chech if user alredy exists
   // check for images, check for avatar
   // upload them to cloudinary , Avatar
   // create user object - create entry in db
   // response password and refresh token field from response
   // check for user creation
   // return response.


   // get user details through req.body
   const {fullName, userName, email, password} = req.body
   console.log("fullName :",  fullName)

   // check if any field is empty (validation)
// if (fullName === ""){
//    throw new apiError(400, "Please provide your full Name")
// }


if (
   [fullName, userName, email, password].some((field)=>
      field?.trim() === "")
){
   throw new  apiError(400, "All fields are required")
}

// check for existed user
const existedUser = User.find({
   $or: [{email}, {userName}]
})
if(existedUser){
   throw new apiError(409, "you are alredy registered")
}

// check for Images
const avatarLocalPath = req.files?.avatar[0]?.path
const coverImageLocalPath = req.files?.coverImage[0]?.path

if (!avatarLocalPath || !coverImageLocalPath){
   throw new apiError(400, " both avatar and cover images are required")
}

// upload images to cloudinary
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

// check if avatar is uploded because it is required field
if(!avatar){
   throw new apiError(400, "Avatar is required")
}

 // create user object,  Create entry in db
 const user = await User.create({
   fullName, 
   userName: userName.toLoverCase(),
   email,
   password,
   avatar: avatar.url,
   coverImage: coverImage?.url || ""
 })

 // response password and refresh token field from response

 const createdUser = await User.findById(user._Id).select(
   "-password -refreshToken"
 )

// check for user creation
 if(createdUser){
   throw new apiError(500, "something went wrong while creating a new user")
 }

 // return response
 










})









export default registerUser