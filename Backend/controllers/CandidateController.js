const Candidate = require('../model/candidateSchema');
const sendError = require('../utilities/sendError');
const sendSuccess = require('../utilities/sendSuccess');

const sendEmail = require('../utilities/sendEmail');
const createdCandidate = require('../utilities/emailTemplates/referral/createdCandidate');



exports.createCandidate = async(req,res)=>{
    try{
    const candidate = new Candidate({
        name:req.body.name,
        email:req.body.email,
        phoneNo:req.body.phoneNo,
        skills:req.body.skills,
        status:req.body.status||'Applied'
    });

    await candidate.save();//(or) const candidate = await Candidate.create(req.body);

    try{
        await sendEmail({
            to:candidate.email,
            subject:"You've been added as a candidate!",
            html:createdCandidate(candidate.name)
        });
    }
    catch(emailErr){
        console.error('Email failed: ',emailErr.message);
    }

    sendSuccess(res,201,candidate,'Created candidate successfully');
  }
  catch(err){
    if(err.code === 11000 && err.keyPattern?.email){
        return sendError(res,400,'Email already exists');
    }
    if(err.name === 'ValidationError'){
        return sendError(res,400,err.message);
    }
    sendError(res,500,'Internal Server Error');
  }
};


exports.getAllCandidates = async(req,res)=>{
    try{
        const candidates = await Candidate.find();
        res.status(200).json({
            success:true,
            count:candidates.length,
            data:candidates
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            error:'Internal Server Error'
        });
    }
};

exports.getCandidateById = async(req,res)=>{
    try{
        const candidate = await Candidate.findById(req.params.id);
        
        if(!candidate){
            return sendError(res,404,'Candidate Not Found');
        }

        res.status(200).json({
            success:true,
            data:candidate
        });
    }
    catch(err){
        if(err.name === 'CastError'){
            return sendError(res,400,'Invalid Candidate ID');
        }
        sendError(res,500,err.message);
    }
};

exports.updateCandidate = async(req,res)=>{
    try{
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,{
                new:true,
                runValidators:true
            }
        );

        if(!candidate){
            return res.status(404).json({
                success:false,
                error:'Candidate Not Found'
            });
        }

        res.status(200).json({
            success:true,
            data:candidate
        });
    }
    catch(err){
    if(err.code === 11000){
        return sendError(res,400,'Duplicate field exists');
    }
    if(err.name === 'ValidationError'){
        return sendError(res,400,err.message);
    }
    sendError(res,500,'Internal Server Error');
  }
};

exports.updateCandidateStatus = async(req,res) =>{
    try{
        const allowedStatuses = ['Applied', 'Interviewing', 'Hold', 'Accepted', 'Rejected', 'Shortlisted'];
        const status = req.body.status;

         if (!allowedStatuses.includes(status)) {
            return sendError(res, 400, 'Invalid status value');
        }     

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            {status},
            {new:true,
                runValidators:true
            }
        );
        if(!candidate){
            return res.status(404).json({
                success:false,
                error:'Candidate Not Found'
            });
        }

        res.status(200).json({
            success:true,
            data:candidate
        });
    }
    catch(err){
    if(err.code === 11000){
        return sendError(res,400,'Duplicate field exists');
    }
    if(err.name === 'ValidationError'){
        return sendError(res,400,err.message);
    }
    sendError(res,500,'Internal Server Error');
  }
}
exports.deleteCandidate = async(req,res)=>{
    try{
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if(!candidate){
            return res.status(404).json({
                success:false,
                error:'Candidate Not Found'
            });
        }

        res.status(200).json({
            success:true,
            message:'Candidate Deleted Successfully',
            data:candidate
        });

    }
    catch(err){
        res.status(500).json({
            success:false,
            error:'Server Error'
        });
    };
};