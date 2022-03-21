//Library
import express from "express";
import jwt from "jsonwebtoken";
import jwt_decode from 'jwt-decode';
import cookieParser from "cookie-parser";

// models
import { UserModel } from "../models/user";

const Router = express.Router();
Router.use(cookieParser())

// Route: /faculty
// Description : Rendering faculty page
// params: none
// Access: Public
// Method : GET

Router.get('/',async(req, res)=>{
  const userid= jwt_decode(req.cookies.jwt).user
  const facultydetail = await UserModel.findById(userid).populate('question_submited')
  const fromdatabase = await UserModel.findById(userid)

  const subjects = fromdatabase.subject.map(elem=>{
    return elem.subject_name
  })

  // res.send(facultydetail.question_submited);
  res.render('facultyDashboard',{usertype:"faculty",facultydetail,subjects}); 

})

Router.get('/profile',async(req, res)=>{
  try {
    const userid= jwt_decode(req.cookies.jwt).user
  const profile = await UserModel.findById(userid)
  res.render('profile',{usertype:"faculty",profile});
  } catch (error) {
    
  } 
})


export default Router;