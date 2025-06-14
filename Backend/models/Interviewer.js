const mongoose = require('mongoose');
const interviewerSchema = new mongoose.Schema({
    name:{type:String,required:[true,'Interviewer name is required']},
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Invalid Email']
    },
    department:{
        type:String,
        enum:['Engineering','Product','HR','Design'],
        required:true
    },
    skills:[{
        name:{
            type:String,
            enum:['JavaScript','Python','System Design','Frontend','Backend'],
            required:true
        },
        level:{
            type:String,
            enum:['Junior','Intermediate','Senior'],
            default:'Intermediate'
        }
    }],
    available:{
        type:Boolean,
        default:true
    },
    maxInterviewsPerWeek:{
        type:Number,
        default:8,
        min:1
    },
    unavailableSlots:[{
        start:Date,
        end:Date,
        reason:String
    }]
},{timestamps:true});

module.exports = mongoose.model('Interviewer',interviewerSchema);