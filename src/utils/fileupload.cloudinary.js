import {V2 as cloudinary} from 'clodinary'
import fs from 'fs'   // file syatem.

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath) =>{
    try{
        if(!localFilePath)  return null;
         
        // upload file on cloudinary
        const response = await cloudinary.uploader.upoad(localFilePath, {
            resource_type: "auto"
        })
        //File has been uploaded successfully

        console.log("File has been uploaded successfully", response.url);
        return response;

    }
    catch(error){
        fs.unlink(localFilePath)  // remove the locally saved file as the upload operation got failed.
        return null;
    }
}

export default uploadOnCloudinary