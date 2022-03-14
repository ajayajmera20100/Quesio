import express, { json } from "express";
import { QuestionModel } from "../models/question";
import isAuth from "../isauth";
import jwt from "jsonwebtoken";
import jwt_decode from 'jwt-decode';
import cookieParser from "cookie-parser";
import { UserModel } from "../models/user";
import { SubjectModel } from "../models/subject";

const Router = express.Router();
Router.use(cookieParser())






// Route: /questions
// Description : Rendering questions page
// params: none
// Access: Public
// Method : GET
Router.get('/',async(req, res)=>{
  const encrypteduserdata= req.cookies.jwt;
  const userdata=jwt_decode(encrypteduserdata)
  const userid = JSON.parse(JSON.stringify(userdata.user))
  const fromdatabase = await UserModel.findById(userid)

  const subjects = fromdatabase.subject.map(elem=>{
    return elem.subject_name
  })
  


  res.render('questions',{subjects:subjects}); 
})

// Route: /questions
// Description : Questions Input
// params: none
// Access: Public
// Method : POST

Router.get('/update:qid',async(req, res)=>{
  const {qid} = req.params;
  const questionData=await QuestionModel.findById(qid)


  res.render('questionUpdate',{questionData:questionData,qid:qid}); 
})




Router.post('/',isAuth, async(req, res)=>{
  try {
     const {subject,chapter,diff,question,option1,option2,option3,option4,correct} = req.body;
     const questions = new QuestionModel({
      question:question,
      options:[option1,option2,option3,option4],
      correct_options:[correct],
      difficulty:diff,
      subject:subject,
      chapter:chapter,
      university:"Mumbai",
      branch:"INFT",
     })
    //  console.log(questions)
     await questions.save();
     res.json({message:"Data added to the database"})
    }
    catch (error) {
     console.log(`you got a error ${error.message}`);
     res.json({"error":error.message});
  }
})


// Route: /question/update:qid
// Description : Update Questions
// params: qid
// Access: Public
// Method : POST

Router.post('/update:qid',isAuth, async(req, res)=>{
  try {
     const qid = req.params.qid;
     const {subject,chapter,diff,question,option1,option2,option3,option4,correct} = req.body;
     const questions = await QuestionModel.findByIdAndUpdate(qid,{
      $set:{
      question:question,
      options:[option1,option2,option3,option4],
      correct_options:[correct],
      difficulty:diff,
      subject:subject,
      chapter:chapter,
      university:"Mumbai",
      branch:"INFT",
     }})
    //  console.log(questions)
     await questions.save();
     res.json({message:"Data added to the database"})
    }
    catch (error) {
     console.log(`you got a error ${error.message}`);
     res.json({"error":error.message});
  }
})

// Route: /questions/chapter:subject_name
// Description : Update Questions
// params: subject_name
// Access: Public
// Method : GET
Router.get("/chapter:subject_name",async(req,res)=> {
  const {subject_name} = req.params;
  const subject_data = await SubjectModel.find({subject_name});
  res.json(subject_data)
})

export default Router;