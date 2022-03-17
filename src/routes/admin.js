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
    const total_faculty = await UserModel.find({ isVarified: { '$eq': 1 } }).count()
    const total_moderator = await UserModel.find({ isExpert: { '$eq': 1 } }).count()
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
   
    const collegedata = await UserModel.aggregate([
        {
            $match: { isVarified: { $eq: 1 } }
        },
        {
            "$group": {
                "_id": "$college",
                "faculty":{$sum:"$isFaculty"},
                "expert":{$sum:"$isExpert"}

            }
        }

    ])

    res.render('adminCollege',{collegedata})
})


Router.get('/faculty', async (req, res) => {
    const facultydata = await UserModel.find({ 'isVarified': 1, 'isExpert': 0 })

    res.render('adminFaculty', { facultydata })
})

Router.get('/moderator', async (req, res) => {
    const moderatordata = await UserModel.find({ 'isVarified': 1, 'isExpert': 1 })

    res.render('adminModerator', { moderatordata })
})

Router.get('/questions', async (req, res) => {
    const questiondata = await QuestionModel.find({isValid:true})
    res.render('adminQuestions', { questiondata: questiondata })
})



Router.get('/branchs', async (req, res) => {
    const branchdata = await UserModel.aggregate([
        {
            $match: { isVarified: { $eq: 1 } }

        },
        {
            "$group": {
                "_id": "$branch",
                "faculty":{$sum:"$isFaculty"},
                "expert":{$sum:"$isExpert"},
                "data": { $push: "$$ROOT.question_submited" }

            }
        }

    ])
    // res.send(branchdata)

// console.log(branchdata);

    res.render('adminBranch',{branchdata})
    
})


Router.get('/subjects', async(req, res) => {
    const subjects=await SubjectModel.aggregate([{$project:{_id:0,subject_name:1}}])
    const data = await UserModel.aggregate([
        {
            $match: { isVarified: { $eq: 1 } }

        },
        {
            "$group": {
                "_id": "$subject.subject_name",
                "faculty":{$sum:"$isFaculty"},
                "expert":{$sum:"$isExpert"},
                "questions": { $push: "$$ROOT.question_submited" }

            }
        }

    ])
    let subject_detail=[]
    subjects.forEach(subject=>{
        let facultycount=0
        let expertcount=0
        let questioncount=0
        data.forEach(data=>{
            if(data._id.includes(subject.subject_name)){
                facultycount=facultycount+data.faculty;
                expertcount=expertcount+data.expert;
                questioncount=questioncount+data.questions[0].length
            }
        })
    subject_detail.push({'subject':subject.subject_name,"faculty":facultycount,"expert":expertcount,'questioncount':questioncount})
    })

//    res.send(subject_detail)

  
    res.render('adminSubject',{subject_detail})
})


export default Router;