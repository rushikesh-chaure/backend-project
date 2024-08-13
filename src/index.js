// require('dotenv').config({path: './env'});
import 'dotenv/config';
import connectDB from './db/db.js';
import {app} from './app.js'

const port = process.env.PORT || 8000;
connectDB()
.then(()=>{
    app.listen(port,() => {
        console.log(`server is running on http://localhost:${port}`);
    })
})
.catch((err) => {
    console.log(">>>>>>>>>>><<<<<<<<<< Connection Error >>>>>>>>>>><<<<<<<<<<");
})