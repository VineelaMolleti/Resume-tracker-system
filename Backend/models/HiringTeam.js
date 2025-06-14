const mongoose = require('mongoose');
const hiringSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    department:{type:String,
        enum:['Engineering','HR','Talnent Acquisition','Leadership'],
        default:'Engineering'
    },
    email:{type:String,unique:true,trim:true,lowercase:true,required:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Invalid Email']
    },
    role:{type:String,required:true,
        enum:['Recruiter','Hiring Manager','Interviewer','Coordinator']
    },
},{timestamps:true});

module.exports=mongoose.model('HiringTeam',hiringSchema);