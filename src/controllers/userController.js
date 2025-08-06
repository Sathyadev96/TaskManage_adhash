import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {userModel} from "../models/userModel.js";
import { jwtSecretKey } from "../config.js"; 
//import { verifyToken } from '../middleware/jwtAuthenticator.js';

export const userRegistration = async(req,res)=>{
    try{

        if(!req.body.name || !req.body.email || !req.body.mblNo){ 
            return res.send({status: 422, message: 'Parameter not found!'})
        }

        if(!req.body.password){ 
            return res.send({status: 401, message: 'Parameter not found!'})
        }
        const userData = await userModel.findOne({email: req.body.email});
        if(userData){
            return res.send({error: 'Already exists emailId!',message: 'User available with this email'});
        }
        const salt = await bcrypt.genSalt(10);  
        const hashedCode = await bcrypt.hash(req.body.password, salt); 
        req.body.password = hashedCode; 
        console.log("\n body :", req.body)
          await userModel.create(req.body).then((data)=>{
            return res.send({status: 200 , message: "User Registrated Successfully.."});
          }).catch((error)=>{ 
            return res.send({status: 400 , error: error, message: "Error on User Registration.."});
          })

    }catch(error){
        console.error('Error on User Registration: ', error);
        throw error;
    }
}

export const userLogin = async(req,res)=>{
    try{
        if(!req.body.email || !req.body.password){
            return res.send({status: 422, message: 'Credentials not found!'});
        }
        const userData = await userModel.findOne({email: req.body.email});
        if(!userData){
            return res.send({status: 422, error: 'Invalid emailId!',message: 'User not available for this email'});
        }
        const authenticate = await bcrypt.compare(req.body.password, userData?.password); 
        if(!authenticate) return res.send({status: 403, error: "Invalid Password."}); 
        const token = jwt.sign({ id: userData._id }, jwtSecretKey, { expiresIn: '1d' }); 
        return res.send({ token : token})
    }catch(error){
        console.error('Error on User Lgin: ', error);
        throw error;
    }
}

  export default {userRegistration,userLogin};