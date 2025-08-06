import {PORT,dbUrl} from './config.js'
import express from "express";
import mongoose from 'mongoose';
import userRouter from "./routes/userRouter.js"; 
import taskRouter from "./routes/taskRouter.js";
import { verifyToken } from './middleware/jwtAuthenticator.js';

const app = express();
app.use(express.json()); 

app.use('/',userRouter); 
app.use('/',verifyToken,taskRouter);

mongoose.connect(dbUrl).
then(()=> console.log("mongoDB connected..")).
catch((error)=> console.log("Error: ", error)); 

app.listen(process.env.PORT,()=> console.log(`server started on ${PORT}`))