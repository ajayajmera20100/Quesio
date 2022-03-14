import mongoose from "mongoose";
const AdminSchema=new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:Number},
    password:{type:String,required:true},
    email_id:{type:String,required:true},
    university:{type:String,required:true},
},{
    timestamps:true,
});

export const AdminModel=mongoose.model("admins",AdminSchema);