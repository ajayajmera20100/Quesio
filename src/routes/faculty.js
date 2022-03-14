//Library
import express from "express";

// models
import { UserModel } from "../models/user";

const Router = express.Router();

// Route: /faculty
// Description : Rendering faculty page
// params: none
// Access: Public
// Method : GET
Router.get('/',(req, res)=>{
  res.render('facultyDashboard'); 
})


export default Router;