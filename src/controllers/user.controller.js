import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {
    
    // Algorithm 
    // get data from frontend
    // validate data all fields
    // check for account duplication 
    // get images to local server using multer 
    // validate images 
    // upload it on cloudinary
    // create database object 
    // store object 
    // delete password and refresh token from response 
    // return response 


    // get data from frontend
    const { userName, email, fullName, password } = req.body
    // console.log("email :",email)

    // validate data all fields
    if([userName,email,fullName,password].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"All fields are required...!")
    }

    // check for account duplication
    let username = userName.toLowerCase();
    let userExists = await User.findOne({username})
    if(userExists){
        throw new ApiError(409,"Username is already taken...!")
    }
    userExists = await User.findOne({email})
    if(userExists){
        throw new ApiError(409,"User of this email already exist...!")
    }

    // we got images to local server using multer middleware before calling this function 
    // validate images
    // console.log(req.files?.avatar[0]?.path)
    let avatarLocalPath;
    if(req.files?.avatar[0]?.path){
        avatarLocalPath = req.files?.avatar[0]?.path;
    }else{
        throw new ApiError(400,"Avatar image is required...!")
    }
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    // upload it on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar image...!")
    }

    // create database object
    const user = await User.create({
        userName : username,
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url || "",

    })

    // store object
    // delete password and refresh token from response 
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong...!")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered...!")
    )
})

export {registerUser}