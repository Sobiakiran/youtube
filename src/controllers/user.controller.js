import asyncHandler from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import {User} from '../models/user.models.js';
import uploadOnCloudinary from '../utils/fileupload.cloudinary.js'
import apiResponse from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async(userId)=>{
   try {
      const user =  await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
     await user.save({validateBeforeSave : false })
     return { accessToken, refreshToken }

   } catch (error) {
      throw new apiError(500, 
         "something went wrong while generating refresh and access token")
   }
} 

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



//login 
const loginUser = asyncHandler(async(req, res)=>{
// req.body -> fetch data
// check userName or email
// find user
// pasword check
// access and refresh token
// send cookies
// return response

// data from req.body
const {userName, email, password} = req.body
if(!(email || userName)){
   throw new apiError(400, "email or User Name is required")
}
// find if user already exists
const user = await User.findOne({
   $or: [{userName},{email}]
})
if(!user){
   throw new apiError(404, "user does not exist") 
}
// check if password is valid
const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
   throw new apiError(401, "password incorrect")
}
// access Token and Refresh token
const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
const logedInUser = await User.findById(user._id).select("-password -refreshToken")

// send cookies
const options = {
   https: true,
   secure: true
}
return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(new apiResponse(200, {user: logedInUser, accessToken, refreshToken}, "User LogedIn successfully"))

})



// logout 
const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(req.user._id,{
      $set: {
         refreshToken: undefined
      }
    }, 
    {
      new: true
    }
    )
    const options = {
      https: true,
      secure: true
   }
   return res.status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new apiError(200, {}, "User logedOut successfully."))
})

//Refresh AccessToken
const refreshAccessToken = asyncHandler(async(req, res)=>{
   
   try {
      const incommingREfreshToken = req.cookies.refreshToken || req.body.refreshToken
      if(!incommingREfreshToken) {
         throw new apiError(401,"unauthorized request")
      }
   
      const incommingDecodedToken = jwt.verify(
         incommingREfreshToken,
          process.env.REFRESH_TOKEN_SECRET
      )
   const user = await User.findById(incommingDecodedToken?._id)
   if(!user){
      throw new apiError(401, "Invalid refresh Token")
   }
   if(incommingREfreshToken !== User?.refreshToken){
      throw new apiError(401, "Refresh token is expired or used")
   }
   
   const options = {
      httpOnly: true,
      secure: true
   }
   const {accessToken, newRefreshToken} = await
    generateAccessAndRefreshToken(user._id)
   
    return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
               new apiResponse(200, {accessToken, newRefreshToken}, "Access Token Refreshed")
            )
   } catch (error) {
      throw new apiError(401, error?.message || "Invalid refresh Token" )
   }
})

// Change password
const changeCurrentPassword = asyncHandler(async(req, res)=>{
      const {oldPassword, newPassword} = req.body
      const user = await User.findById(req.user?._id)
      
     const isPasswordCorrect = await User.isPasswordCorrect(oldPassword)

     if(!isPasswordCorrect){
      throw new apiError(400, "incorrect old password")
     }

     user.password = newPassword
     await user.save({validateBeforeSave: false})

     return res.status(200).json(new apiResponse(200, {}, "password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
   return res.status(200).json(200, req.user, "current user fetched successfully")

  })

const updateAccountDetails = asyncHandler(async(req, res) =>{
   const {fullName, email} = req.body

   if(!fullName || !email){
      throw new apiError(400, "All fields are required")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id, 
      {
         $set: {
            fullName,
            email
         }
      }, 
      {new: true}).select("-password")

      return res.status(200).json(new apiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
   const avatarLocalPath = req.file?.path
   if(!avatarLocalPath){
      throw new apiError(400, "Avatar not found")
   }

   // TODO  ------ Delete old image------  Assignment
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   if(!avatar.url){
      throw new apiError(400, "Error while uploading avatar")
   }

  const user = await User.findByIdAndUpdate(
      req.user?._id, 
      {
         $set: {
            avatar: avatar.url
         }
      },
   {new: true}
   ).select("password")
return res.status(200).json(new apiResponse(200, user, "Avatar image updated successfully"))

})

// update coverImage
const updateCoverImage = asyncHandler(async(req, res)=>{
   const coverImageLocalPath = req.file?.path
   if(!coverImageLocalPath){
      throw new apiError(400, "cover image not found")
   }
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if(!coverImage.url){
      throw new apiError(400, "Error while uploading cover Image")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id, 
      {
         $set: {
            coverImage: coverImage.url
         }
      },
   {new: true}
   ).select("password")

   return res.status(200).json(new apiResponse(200, user, "cover image updated successfully"))
})

// get channel profie 
const getUserChannelProfile = asyncHandler(async(req, res)=>{
   const {userName} = req.params

   if(!userName?.trim()){
      throw new apiError(400, "user name is missing")
   }

   const channel = await User.aggregatePaginate([
      {
         $match: {
            userName : userName?.toLoweCase()
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "Subscribers"

         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "SubscribedTo"

         }
      },
      {
         $addFields: {
            subscribersCount: {
               $size: "$Subscribers"
            },
            channelsSubscribedToCount: {
               $size: "$SubscribedTo"
            },
            isSubscribed: {
               $cond: {
                  if: { $in: [req.user?._id, "$Subscribers.subscriber"]},
                  then: true,
                  $lse: false
               }
            }
         },
      },
      {
         $project: {
            userName: 1,
            fullName: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            email: 1,
            avatar: 1,
            coverImage: 1
         }
      }
   ])

   if(!channel?.length){
      throw new apiResponse(400, "channel does not exists")
   }
   return res.status(200).json(new apiResponse(200, "user channel fatched successfully"))
})

// watch History
const watchHistory = asyncHandler(async(res, req)=>{
   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
         }
      }
   ])
})

export {
        registerUser, 
        loginUser, 
        logoutUser, 
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar,
        updateCoverImage,
        getUserChannelProfile
      } 
