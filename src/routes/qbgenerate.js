//Library
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { QuestionModel } from "../models/question";

const Router = express.Router();

Router.get('/',(req, res)=>{
  res.render('qbgenerate')
  
})

Router.post('/',async(req, res)=>{

    const {university,branch,subject,chapter,totalquestions,easyquestions,moderatequestions,hardquestions} = req.body;
    
    const data=await QuestionModel.aggregate([
     {$group:{
     "_id":"$difficulty",
     "questiondata": {
       $push: "$$ROOT"
   },count:{$sum:1}
     }
   }])
   
   
   function shuffle(array) {
     let currentIndex = array.length,  randomIndex;
     // While there remain elements to shuffle...
     while (currentIndex != 0) {
       // Pick a remaining element...
       randomIndex = Math.floor(Math.random() * currentIndex);
       currentIndex--;
       // And swap it with the current element.
       [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
     }
     return array;
   }
   
   let mydata ={"easy":[],"medium":[],"hard":[]}
   for (let index = 0; index < data.length; index++) {
       if (data[index]._id=='easy'){
        mydata.easy.push(data[index].questiondata)
       }
       if (data[index]._id=='medium'){
        mydata.medium.push(data[index].questiondata)
       }
       if (data[index]._id=='hard'){
        mydata.hard.push(data[index].questiondata)
       }
   }
   
  //  let myeasy=mydata.easy[0].slice(0,ceasy)
  let myeasy=shuffle(mydata.easy[0]).slice(0,easyquestions)
  let mymedium=shuffle(mydata.medium[0]).slice(0,moderatequestions)
  let myhard=shuffle(mydata.hard[0]).slice(0,hardquestions)
   
  res.render('questionpaper',{subject,branch,myeasy,mymedium,myhard,count:1})

   
   });



export default Router;