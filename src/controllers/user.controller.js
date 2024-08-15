import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
// import { isPasswordCorrect } from "../models/user.model.js"


const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = await user.generateAccessToken(user._id)
        const refreshToken = await user.generateRefreshToken(user._id)

        user.refreshToken = refreshToken

        user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"Somthing went wrong while generating access and refresh token...!")
    }
    

}
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
    let userExists = await User.findOne({userName: username})
    if(userExists){
        throw new ApiError(409,"Username is already taken...!")
    }
    userExists = await User.findOne({email: email})
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
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    
    // upload it on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    let avatarURL,coverImageURL;
    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar image...!")
    }else{
        avatarURL = avatar.url;
    }
    if(coverImage){
        coverImageURL = coverImage.url;
    }


    // create database object
    const user = await User.create({
        userName : username,
        fullName,
        email,
        password,
        avatar: avatarURL,
        coverImage: coverImageURL || "",

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

const loginUser = asyncHandler( async (req,res) => {

    // get data from req
    // check in database 
    // stroe the object 
    // generate cookies 
    // send them 

    const {password,userName,email} = req.body
    // console.log(req.body)

    if(!(userName || email)){
        throw new ApiError(400,"username required...!")
    }

    if(!password){
        throw new ApiError(400,"password is required...!")
    }

    const user = await User.findOne({
        $or : [{userName},{email}]
    })

    if(!user){
        throw new ApiError(404,"User not found...!")
    }

    if(!await user.isPasswordCorrect(password)){
        throw new ApiError(401,"Wrong password...!")
    }
    // user.isPasswordCorrect(password)

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if(!loggedInUser){
        throw new ApiError(500,"Somthing went wrong while generating access and refresh token...!")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "Logged in successfully...!")
    )

})

const logoutUser = asyncHandler( async (req,res) => {

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"Logged out...!")
    )
})

export { registerUser, loginUser, logoutUser}