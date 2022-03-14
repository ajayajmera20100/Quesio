//Library
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// models
import { UserModel } from "../models/user";

// Authorisation
import isAuth from "../isauth";

const Router = express.Router();
Router.use(cookieParser())



Router.get('/as',isAuth,(req,res)=>{
    // res.json({token: req.mytoken})
    res.render('home')
})

// Route: /login
// Description : Rendering login page
// params: none
// Access: Public
// Method : GET
Router.get('/',(req, res)=>{
  res.render('login'); 
  
})

// Route: /login
// Description : Loging in user
// params: none
// Access: Public
// Method : POST
Router.post('/',async(req, res)=>{
  try {
    const user = await UserModel.findByEmailAndPassword(req.body.password,req.body.email);
    // generate jwt token
    const token = user.generateJwtToken();
    // console.log(token)
    // res.redirect('/')
   res.cookie('jwt',token)
    // res.json({
    //   token:token
    // })
    res.redirect('/admin')
  } catch (error) {
      console.log(`You got a error ${error.message}`);
      res.json({"error":error.message});
  }
})


export default Router;