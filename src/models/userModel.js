import mongoose,{ Schema } from "mongoose";

const userSchema = new Schema({
    id: {
        type: String,
        autoGenerate : true
    },
    name: {
        type: String,
        require: true,    
        trim : true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    mblNo: {
        type: Number,
        require: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        require: true 
    },
    role: {
        type: String,
        enum: ['team-lead','experienced','midlevel','fresher','employee'],
        default: 'employee'
    },
    country: String, 
    city: String, 
    state: String,
    gender:{
        type: String,
        require: true,
        enum: ['male','female','others']
    },
    active: {
        type: Boolean,
        default: true,
        enum: [true,false]
    }
},{
    timestamps : true
});

userSchema.index({email : 1, mblNo: 1});
export const userModel = mongoose.model('User',userSchema);