const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
    interview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interview',
        required:true
    },
    interviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interviewer',
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    technicalScore:{
        type:Number,
        min:1,
        max:5
    },
    communicationScore:{
        type:Number,
        min:1,
        max:5
    },
    decision:{
        type:String,
        enum:['Strong Yes','Yes','No','Strong No','Neutral'],
        required:true
    },
    comments:{
        type:String,
        maxlength:1000
    }
},{timestamps:true});
module.exports = mongoose.model('Feedback',feedbackSchema);