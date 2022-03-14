import mongoose from "mongoose";
const CollegeSchema=new mongoose.Schema({
    university:{type:String,required:true},
    college_name:{type:String,required:true},
    branch:[{type:String,required:true}],
},{
    timestamps:true,
});

export const CollegeModel=mongoose.model("universities",CollegeSchema); 
