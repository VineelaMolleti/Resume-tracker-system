const mongoose = require('mongoose');
const interviewSchema = new mongoose.Schema({
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Candidate',
        required:true
    },
    interviewer:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interviewer'
    }],
    scheduledTime:{
        type:Date,
        required:[true,'Interview Scheduled Time is required']
    },
    duration:{
        type:Number,
        default:60,
        min:30
    },
    type:{
        type:String,
        enum:['Technical','Behavioural','Coding Test','System Design'],
        required:true
    },
    status:{
        type:String,
        enum:['Scheduled','Completed','Cancelled'],
        default:'Scheduled'
    },
    meetingLink:String,
    notes:String
},{timestamps:true});
module.exports = mongoose.model('Interview',interviewSchema);