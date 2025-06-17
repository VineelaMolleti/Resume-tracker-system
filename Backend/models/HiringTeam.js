const mongoose = require('mongoose');
const hiringSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Team Member name is required'],
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Invalid Email']
    },
    role:{
        type:String,
        required:true,
        enum:['Recruiter','Hiring Manager','Interviewer','Coordinator']
    },
    permissions:{
        canSchedule:{type:Boolean,default:false},
        canEvaluate:{type:Boolean,default:false},
        canManageCandidates:{type:Boolean,default:false}
    },
    isActive:{
        type:Boolean,
        default:true
    },
    department: {
    type: String,
    enum: ['Recruitment', 'HR', 'Management', 'Coordination'],
    required: true
  }
},{timestamps:true});

module.exports=mongoose.model('HiringTeam',hiringSchema);