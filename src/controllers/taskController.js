
import { taskModel } from "../models/taskModel.js";


export const createTask = async (req,res)=>{
    try{
        console.log("req.user:", req?.user);
        if(!req?.user?.id){
            return res.send({msg: "unauthorized."})
        }
        if(!req.body.name  || !req.body.dueDate){ //|| !req.body.author
            return res.send({status : 422, code: "parameter missing!"})
        }

        const taskName = await taskModel.findOne({name: req.body.name});
        if(taskName) return res.send({code: "Task name already exists."});
        req.body.author = req.user.id;
        console.log("req.body:", req.body)
        await taskModel.create(req.body).
        then((data)=> {
            return res.send({status: 200 , code: "Task Created."})}).
        catch((error)=>{
                return res.send({error: error, msg: "Error on Task creation." })
            }); //add userId noted
    }catch(error){
        console.error('Error on Task Creation: ', error);
        throw error;
    }
    
}

export const editTaskbyId = async (req,res)=>{
    try{ 
        if(!req.params.id){  
            return res.send({status : 422, code: "parameter missing!"})
        }
        if(!req.body.name && !req.body.dueDate && !req.body.status){
            return res.send({status : 422, code: "Only Task name or dueDate only editable."})
        }

        let updateData={};

        if(req.body.name) updateData.name = req.body.name;
        if(req.body.dueDate) updateData.dueDate = req.body.dueDate; 
        if(req.body.status) updateData.status = req.body.status; 
        console.log("\n updateddata:", updateData)

        const taskData = await taskModel.findByIdAndUpdate(req.params.id,updateData).
        then((data)=> {
            return res.send({status: 200 ,data: data, code: "Task Edited."})}).
        catch((error)=>{
                return res.send({error: error, msg: "Error on Task Updation." })
            }); 
    }catch(error){
        console.error('Error on Task Updation: ', error);
        throw error;
    }
    
}

export const getTasks = async (req,res)=>{
    try{ 

        const page = req.query?.page ? Number(req.query.page) : 1;
        const limit = req.query?.limit ? Number(req.query.limit) : 10;
        const skip = (page -1) * limit;

        let filter= {};
         req.query?.status ? filter.status = req.query.status : {}; 
         req.query?.category ? filter.priority = req.query.category : {};
        console.log("filter: ", filter)
        const query = [
            {
                $match: filter 
            },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorData"
              }
            },
            {
              $unwind: {
                path: "$authorData",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 0,
                name: 1,
                dueDate: 1,
                status: 1,
                priority: 1,
                active: 1,
                author: "$authorData.name"
              }
            },
            {
              $skip: skip
            },
          
            {
              $limit: limit
            },
            {
              $sort: {
                name: 1
              }
            }
          ]
        const taskData = await taskModel.aggregate(query).
        then((data)=> {
            return res.send({status: 200,tasks: data})}).
        catch((error)=>{
                return res.send({error: error, msg: "Error on Task view." })
            }); 
    }catch(error){
        console.error('Error on Task View: ', error);
        throw error;
    }
}

export const deleteTaskbyId = async (req,res)=>{
    try{ 
        if(!req.params.id){  
            return res.send({status : 422, code: "parameter missing!"})
        } 
        const taskData = await taskModel.findByIdAndDelete(req.params.id).
        then((data)=> {
            return res.send({status: 200 , code: "Task Deleted."})}).
        catch((error)=>{
                return res.send({error: error, msg: "Error on Task Deletion." })
            }); 
    }catch(error){
        console.error('Error on Task Deletion: ', error);
        throw error;
    }
}