//Library
import express from "express";

// models
import { UserModel } from "../models/user";

const Router = express.Router();

// Route: /moderator
// Description : Rendering moderator page
// params: none
// Access: Public
// Method : GET
Router.get('/',(req, res)=>{
  res.render('moderatorDashboard'); 
})


export default Router;