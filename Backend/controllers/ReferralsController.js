const Referral = require('../models/Referrals');
const Candidate = require('../models/Candidates');
const sendError = require('../utilities/sendError');
const sendSuccess = require('../utilities/sendSuccess');
const mongoose = require('mongoose');

exports.createReferral = async(req,res)=>{
    try{
        const candidate = await Candidate.findById(req.body.candidate);
        if(!candidate) return sendError(res,404,'Candidate Not Found');// In order to create a referral, He/She must have a candidate to refer
        const existingReferral = await Referral.findOne({referredEmail:req.body.referredEmail}); // Prevent duplicate referrals to the same referredEmail
        if(existingReferral) return sendError(res,400,'This Email Already present');
        if (!req.body.candidate || !req.body.referredEmail) {
            return sendError(res, 400, 'Candidate and referredEmail are required');
        }

        const newReferral = await Referral.create({
            ...req.body,
            referralStatus : 'Pending'
        });
        return sendSuccess(res,201,newReferral,'Referral created successfully');

    }
    catch(err) {return sendError(res,500,err.message);}
};

exports.getAllReferrals = async(req,res)=>{
    try{
        const filters ={};
        if(req.query.status) filters.referralStatus = req.query.status;
        if(req.query.bonusEligible) filters.referralBonusEligible = req.query.bonusEligible === 'true';

        const referrals = await Referral.find(filters).populate('candidate','name email status').sort({createdAt:-1});
        return sendSuccess(res,200,referrals,'Referral Data fetched successfully');
    }

    catch(err) {
        return sendError(res,500,'Internal Server Error');
    }
};

exports.getReferralById = async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return sendError(res, 400, 'Invalid Referral ID');
        }
        const referral = await Referral.findById(req.params.id).populate('candidate');
        if(!referral) return sendError(res,404,'Referral Not Found');
        return sendSuccess(res,200,referral,'Referral data fetched successfully');
    }
    catch(err) {
        return sendError(res,500,"Internal Server Error");
    }
};

exports.updateReferralStatus = async(req,res) => {
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return sendError(res, 400, 'Invalid Referral ID');
        }
        const validStatus = ['Pending','Accepted','Rejected'];//Even though we handle these values from backend there is a chance to have other than this values so better to have a check in backend
        const {status} = req.body;
        if(!validStatus.includes(status)){
            return sendError(res,400,'Invalid Status value');
        }
        const referral = await Referral.findByIdAndUpdate(req.params.id,{
            referralStatus:status,
            referralBonusEligible:status==='Accepted'//Auto Set the value to accepted
        },{new:true,runValidators:true});

        if(!referral) return sendError(res,404,'Referral Not Found');
        return sendSuccess(res,200,referral,'Referral Status Updated Successfully');
    }
    catch(err) {
        return sendError(res,500,err.message);
    }
};

exports.processReferralBonus = async(req,res) => {
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return sendError(res, 400, 'Invalid Referral ID');
        }
        const referral = await Referral.findById(req.params.id);
        if(!referral)
            return sendError(res,404,'Referral Not Found');
        if(!referral.referralBonusEligible){
            return sendError(res,400,'Referral is not eligible for Bonus');
        }
        if(referral.bonusPaid){
            return sendError(res,400,'Bonus already paid');
        }
        referral.bonusPaid = true;
        await referral.save();
        return sendSuccess(res,200,referral,'Bonus Payment proceed successfully');
    }
    catch(err) {
        return sendError(res,500,'Internal Server error');
    }
};