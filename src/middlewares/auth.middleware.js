import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

const verifyJWT = async (req,res,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401,"Unauthorized Access...!")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    // console.log(decodedToken)
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"Invalid Access Token, Please refresh your Access Token...!")
    }

    // console.log(user)

    req.user = user
    next()
}

export {verifyJWT}