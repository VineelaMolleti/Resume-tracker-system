const mongoose = require('mongoose');
const referralSchema = new mongoose.Schema({
 candidate :{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Candidate',
    required:true
 },
 referredBy:{
    type:String,
    required:true,
    trim:true
},
 referredEmail:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    unique:true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
},
 referralNote:{
    type:String,
    maxlength:500
},
 jobPosition:{
    type:String,
    trim:true,
    required:true,
 },
 referralStatus:{
    type:String,
    enum:['Pending','Accepted','Rejected'],
    default:'Pending'
},
 referralBonusEligible :{
    type:Boolean,
    default:false
},
 bonusPaid:{
    type:Boolean,
    default:false
},
 date:{type:Date,default:Date.now}
},{timestamps:true});
module.exports = mongoose.model('Referral',referralSchema);
