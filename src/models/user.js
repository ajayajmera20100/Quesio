import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String},
    password:{type:String},
    email_id:{type:String,required:true},
    university:{type:String,required:true},
    college:{type:String,required:true},
    phone:{type:Number},
    question_submited:[{type:mongoose.Types.ObjectId,ref:"questions"}],
    question_validated:[{type:mongoose.Types.ObjectId,ref:"questions"}],
    subject:[{subject_name:String,yearofexp:Number}],
    document:{type:String},
    isExpert:{type:Boolean,default:false},
    isVarified:{type:Boolean,default:false},
    branch:{type:String,required:true}
},{
    timestamps:true,
});



// Statics
UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({ user: this._id }, "Quesio8bit");
};


UserSchema.statics.findByEmailAndPassword = async (password, email) => {
    // check whether email exists
    const user = await UserModel.findOne({ email_id:email });
    if (!user) throw new Error("User does not exist!!!");

    // Compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) throw new Error("Invalid Password!!!");

    return user;
};


UserSchema.statics.findByEmail = async (email) => {
    //check whether email exists
    const checkUserByEmail = await UserModel.findOne({email_id: email });

    if (checkUserByEmail) {
        throw new Error("User Already Exists...!");
    }

    return false;
};

UserSchema.pre("save", function (next) {
    const user = this;

    //password is modified
    if (!user.isModified("password")) return next();

    //password bcrypt salt
    bcrypt.genSalt(8, (error, salt) => {
        if (error) return next(error);

        //hash the password
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error);

            //assigning hashed password
            user.password = hash;
            return next();
        });
    });
});


export const UserModel=mongoose.model("users",UserSchema);