import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hello");
})
app.get("/login",(req,res)=>{
    res.send("login");
})

// route imports
import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"




// routes 
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/dashboard",dashboardRouter);
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/like",likeRouter);
app.use("/api/v1/playlist",playlistRouter);
app.use("/api/v1/subscription",subscriptionRouter);
app.use("/api/v1/tweet",tweetRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/video",videoRouter);



export { app }
