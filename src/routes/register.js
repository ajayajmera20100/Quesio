//Library
import express from "express";

// models
import { UserModel } from "../models/user";

const Router = express.Router();

// Route: /register
// Description : Rendering register page
// params: none
// Access: Public
// Method : GET
Router.get('/',(req, res)=>{
  res.render('register'); 
})

// Route: /register
// Description : Registering a new  user
// params: none
// Access: Public
// Method : POST
Router.post('/',async(req, res)=>{
   try {
      const confirm_password =req.body.confirmpassword;
      const password =req.body.password;
      if (confirm_password===password){
          await UserModel.findByEmail(req.body.email);

          //save to db
          const newUser = await UserModel.create({
            name:req.body.name,
            password:req.body.password,
            email_id:req.body.email,
          });
         //  generate jwt token
         
         res.redirect('/login')
      
      }else{
          console.log("check your password");
      }
       
   } catch (error) {
      console.log(`you got a error ${error.message}`);
      res.json({"error":error.message});
   }
})

export default Router;