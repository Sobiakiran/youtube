import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import {User} from '../models/user.models.js';
import uploadOnCloudinary from '../utils/fileupload.cloudinary.js'
import apiResponse from '../utils/apiResponse.js';

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
// if (fullName || userName || email || password === ""){
//    throw new apiError(400, "all fields must be filled")
// }
if (
   [fullName, userName, email, password].some((field)=>
      field?.trim() === "")
){
   throw new  apiError(400, "All fields are required")
}

// check for existed user
const existedUser = await User.findOne({
   // $or: [{email}, {userName}]
   email
})
   console.log("existing user : ", existedUser)
if(existedUser){
   throw new apiError(409, "you are alredy registered")
}

// check for Images
const avatarLocalPath = req.files?.avatar[0]?.path
if (!avatarLocalPath){
   throw new apiError(400, " avatar local path is required")
}

//const coverImageLocalPath = req.files?.coverImage[0]?.path   // or 
let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
   coverImageLocalPath = req.files.coverImage[0].path
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
   userName,
   email,
   password,
   avatar: avatar.url,
   coverImage: coverImage?.url || ""
 })

 // response password and refresh token field from response

 const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"
 );

// check for user creation
 if(!createdUser){
   throw new apiError(500, "something went wrong while creating a new user")
 }

 // return response
 return res.status(201).json(
   new apiResponse(200, createdUser, "user Registered successfully")
   
 )

 return res.status(201).json(
   new apiResponse(200, createdUser, "User Registered successfully")
);
})
export default registerUser

/* import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import uploadOnCloudinary from '../utils/fileupload.cloudinary.js';
import apiResponse from '../utils/apiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body;

    if (!fullName || !userName || !email || !password) {
        throw new apiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new apiError(409, "You are already registered");
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new apiError(500, "Failed to upload avatar");
    }

    const user = await User.create({
        fullName,
        userName,
        email,
        password,
        coverImage,
        avatar: avatar.url
    });

    if (!user) {
        throw new apiError(500, "Failed to create user");
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new apiError(500, "Failed to fetch created user");
    }

    return res.status(201).json(new apiResponse(201, createdUser, "User registered successfully"));
});

export default registerUser;
*/