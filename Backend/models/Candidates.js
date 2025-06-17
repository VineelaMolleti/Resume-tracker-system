const mongoose =require('mongoose');
const candidateSchema = new mongoose.Schema({
    name:{type:String,required:[true,'Candidate name is required'],trim:true},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Invalid Email']
    },
    phoneNo:{
        type:String,trim:true,
        match:[/^\+?[1-9]\d{1,14}$/,'Invalid contact number']
    },
    resumeUrl:String,
    status:{
        type:String,
        enum:["Applied","Interviewing","Hold","Accepted","Rejected","Shortlisted"],
        default:"Applied",
    },
    skills:[{type:String,
        enum:['JavaScript','Python','Java','React','Node','Devops']
    }],
    interviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interview'
    }],
    appliedAt:{type:Date,default:Date.now},
},{timestamps:true});

module.exports = mongoose.model('Candidate',candidateSchema);