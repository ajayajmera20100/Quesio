//Library
import express from "express";
import jwt from "jsonwebtoken";
import jwt_decode from 'jwt-decode';
import cookieParser from "cookie-parser";

// models
import { UserModel } from "../models/user";

const Router = express.Router();

// Route: /moderator
// Description : Rendering moderator page
// params: none
// Access: Public
// Method : GET
Router.get('/',(req, res)=>{
   try {
    
    res.render('moderatorDashboard',{usertype:"moderator"}); 
   } catch (error) {
     
   }

})


Router.get('/moderatorquestions',(req, res)=>{
  res.render('moderate-questions',{usertype:"moderator"}); 
})


Router.get('/profile',(req, res)=>{
  res.render('profile',{usertype:"moderator"}); 
})

export default Router;