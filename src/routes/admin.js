//Library
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// models
import { AdminModel } from "../models/admin";
import { QuestionModel } from "../models/question";
import { CollegeModel } from '../models/college'
import { UserModel } from '../models/user'
import { SubjectModel } from '../models/subject'

// Authorisation
import isAuth from "../isauth";

const Router = express.Router();
Router.use(cookieParser())



Router.get('/', async (req, res) => {
    const total_ques = await QuestionModel.find().count()
    const approved_question = await QuestionModel.find({ isValid: { '$eq': true } }).count()
    const pending_question = await QuestionModel.find({ isValid: { '$eq': false } }).count()
    const total_college = await CollegeModel.find().count()
    const total_faculty = await UserModel.find({ isVarified: { '$eq': true } }).count()
    const total_moderator = await UserModel.find({ isExpert: { '$eq': true } }).count()
    const total_subject = await SubjectModel.find().count()


    const total_chapter = await SubjectModel.aggregate([{ $project: { chapter: 1 } }])
    const chapters = total_chapter.map(elem => {
        return elem.chapter
    })
    const totalchapter = [... new Set([].concat.apply([], chapters))].length

    const total_branch = await CollegeModel.aggregate([{ $project: { branch: 1 } }])
    const branches = total_branch.map(elem => {
        return elem.branch
    })
    const totalbranch = [... new Set([].concat.apply([], branches))].length





    res.render('admin', {
        total_ques: total_ques, approved_question: approved_question,
        total_college: total_college, total_faculty: total_faculty, total_moderator: total_moderator,
        total_subject: total_subject, totalchapter: totalchapter, totalbranch: totalbranch, pending_question: pending_question
    })
})


Router.get('/college', async (req, res) => {
    const collegefaculty = await UserModel.aggregate([
        { $match: { isExpert: { $eq: false } } },
        {
            "$group": {
                "_id": "$college",
                faculty: { $sum: 1 }
            }
        }])
    const collegeexpert = await UserModel.aggregate([
        { $match: { isExpert: { $eq: true } } },
        {
            "$group": {
                "_id": "$college",
                moderator: { $sum: 1 }
            }
        }])



const collegelist=[]
const data=[]
collegefaculty.forEach(faculty => {
    collegelist.push(faculty._id)
});
collegeexpert.forEach(moderator => {
   collegelist.push(moderator._id)
});
let uniquecollegelist=[... new Set(collegelist)]


uniquecollegelist.forEach(moderator => {
    data.push(moderator._id)
 });


// res.send(collegeexpert)
console.log(collegeexpert)
console.log(collegefaculty)
console.log(collegelist)

res.render('adminCollege', { collegefaculty, collegeexpert,collegelist,infaculty:false,inexpert:false })
})


Router.get('/faculty',async (req, res) => {
    const facultydata= await UserModel.find({'isVarified':true,'isExpert':false})

    res.render('adminFaculty',{facultydata})
})

Router.get('/moderator',async (req, res) => {
    const moderatordata= await UserModel.find({'isVarified':true,'isExpert':true})
    
    res.render('adminModerator',{moderatordata})
})

Router.get('/questions', async (req, res) => {
    const questiondata = await QuestionModel.find()
    res.render('adminQuestions', { questiondata: questiondata })
})


Router.get('/moderator', (req, res) => {
    res.render('adminModerator')
})


Router.get('/branchs', (req, res) => {
    res.render('adminBranch')
})


Router.get('/subjects', (req, res) => {
    res.render('adminSubject')
})


export default Router;