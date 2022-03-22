//Library
import express from "express";
import jwt from "jsonwebtoken";
import jwt_decode from 'jwt-decode';
import cookieParser from "cookie-parser";

// models
import { UserModel } from "../models/user";
import { QuestionModel } from "../models/question";

const Router = express.Router();
Router.use(cookieParser())

// Route: /moderator
// Description : Rendering moderator page
// params: none
// Access: Public
// Method : GET
Router.get('/',async(req, res)=>{
  const userid= jwt_decode(req.cookies.jwt).user
  const moderatordetail = await UserModel.findById(userid).populate('question_submited')
  const subjects = moderatordetail.subject.map(elem=>{
    return elem.subject_name
  })

  // res.send(moderatordetail.question_submited);
  res.render('moderatorDashboard',{usertype:"moderator",moderatordetail,subjects}); 

})


Router.get('/moderatorquestions',async(req, res)=>{
  const pendingquestions = await QuestionModel.find({isValid:false})
  
  res.render('moderate-questions',{usertype:"moderator",pendingquestions}); 
})

Router.get('/moderatorquestionsvalidated',async(req, res)=>{
  const userid= jwt_decode(req.cookies.jwt).user
  const validatedquestions = await UserModel.find({_id:userid}).populate('question_validated').select('question_validated');
  // res.send(validatedquestions[0].question_validated)
  res.render('moderate-questions-validated',{usertype:"moderator",validatedquestions}); 
})


Router.get('/profile',async(req, res)=>{
  const userid= jwt_decode(req.cookies.jwt).user
  const profile = await UserModel.findById(userid)
  res.render('profile',{usertype:"moderator",profile}); 
})

export default Router;