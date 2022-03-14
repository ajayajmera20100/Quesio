import mongoose from "mongoose";
const QuestionSchema=new mongoose.Schema({
    question:{type:String,required:true},
    options:[{type:String,required:true}],
    correct_options:[{type:String,required:true}],
    difficulty:{type:String,required:true},
    isValid:{type:Boolean,default:false},
    subject:{type:String,required:true},
    chapter:{type:String,required:true},
    university:{type:String,required:true},
    branch:{type:String,required:true},
   
},{
    timestamps:true,
});

export const QuestionModel=mongoose.model("questions",QuestionSchema);
