import mongoose,{ Schema } from "mongoose";

const taskSchema = new Schema({
    id: {
        type: String,
        autoGenerate : true
    },
    name: {
        type: String,
        require: true,  
        unique: true,  
        trim : true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true
    },
    description: String, 
    dueDate: {
        type: Date,
        require: true, 
    },
    startDate: Date,
    endDate : Date,
    status: {
        type: String,
        enum: ['pending','process','hold','completed'],
        default: 'pending'
    },
    priority:{
        type: String,
        enum: ['normal','high','onDemand'],
        default: 'normal'
    }, 
    active: {
        type: Boolean,
        default: true,
        enum: [true,false]
    }
},{
    timestamps : true
});
 
export const taskModel = mongoose.model('Task',taskSchema);