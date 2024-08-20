import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localfilePath) => {
    try {
        if(!localfilePath) return null;
        const response = await cloudinary.uploader.upload(localfilePath,{resource_type: "auto"})
        // console.log("File is uploaded on Cloudinary : ",response.url);
        fs.unlinkSync(localfilePath);
        return response;
    } catch (error) {
        // fs.unlinkSync(localfilePath);
        return null;
    }
}


export { uploadOnCloudinary }