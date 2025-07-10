const sendError = require('../utilities/sendError');
const sendSuccess = require('../utilities/sendSuccess');
const HiringTeam = require('../models/HiringTeam');

exports.createTeamMember = async(req,res) => {
    try{
        const existingMember = await HiringTeam.findOne({email:req.body.email.toLowerCase()});
        if(existingMember) return sendError(res,400,'Member already exists');
        const createMember = await HiringTeam.create({
            ...req.body,
            isActive : true,
            permissions:{
                canSchedule:req.body.permissions?.canSchedule||false,
                canEvaluate : req.body.permissions?.canEvaluate||false,
                canManageCandidates: req.body.permissions?.canManageCandidates||false
            }
        });
        return sendSuccess(res,201,createMember,'Created a team member');
    }
    catch(err){
        return sendError(res,500,'Internal Server Error');
    }
};

exports.getAllTeamMembers = async(req,res) => {
    try{
        const filter ={};
        if(req.query.role) filter.role=req.query.role;
        if(req.query.department) filter.department = req.query.department;
        if(req.query.active) filter.isActive = req.query.active==='true';
        const getData = await HiringTeam.find(filter).sort({createdAt:-1});
        if(getData.length===0) 
            return sendSuccess(res,200,[],'No Team members found');
        else
        return sendSuccess(res,200,getData,'Fetch All Team Members data successfully')
    }
    catch(err){
        return sendError(res,500,'Internal Server Error');
    }
};

exports.getTeamMemberById = async(req,res) => {
    try{
        const member = await HiringTeam.findById(req.params.id);
        if(!member) return sendError(res,404,'Team Member data not found');
        return sendSuccess(res,200,member,'Data fetched successfully');
    }
    catch(err){
        return sendError(res,500,'Internal Server Error');
    }
};

exports.updateTeamMember = async(req,res) => {
    try{
        if(req.body.email) return sendError(res,400,'Email Cannot be changed through this endpoint')//Duplicates may occur
        const updatedMember = await HiringTeam.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true,runValidators:true}
        );
        if(!updatedMember) return sendError(res,404,'Member not found to update');
        return sendSuccess(res,200,updatedMember,'Updated Team Member data successfully');
    }
    catch(err){
        return sendError(res,500,'Internal Server Error');
    }
};

//Activated/DeActivated member
exports.deActivateTeamMember = async(req,res) => {
    try{
        if(typeof req.body.isActive !=='boolean') 
            return sendError(res,400,'isActive must be a boolean');
        const member = await HiringTeam.findByIdAndUpdate(
            req.params.id,
            {isActive:req.body.isActive},
            {new:true}
        );
        if(!member) return sendError(res,404,'Team Member not found');
        const status = member.isActive?'Activated':'DeActivated';
        return sendSuccess(res,200,member,`Team member ${status} successfully`);
    }
    catch(err){
        return sendError(res,500,'Internal Server Error');
    }
};

exports.updatePermissions = async(req,res) =>{
    try{

        const updateFields = {};
        if('canSchedule' in req.body) updateFields['permissions.canSchedule'] = req.body.canSchedule;
        if('canEvaluate' in req.body) updateFields['permissions.canEvaluate'] = req.body.canEvaluate;
        if('canManageCandidates' in req.body) updateFields['permissions.canManageCandidates'] = req.body.canManageCandidates;
        const member = await HiringTeam.findByIdAndUpdate(
            req.params.id,
            {
                // $set:{
                //     'permissions.canSchedule':req.body.canSchedule,
                //     'permissions.canEvaluate':req.body.canEvaluate,
                //     'permissions.canManageCandidates':req.body.canManageCandidates
                // }
                $set:updateFields
           },
           {new:true}
        );
        if(!member) return sendError(res,404,'Team member does not exists');
        return sendSuccess(res,200,member,'Updated permissions successfully');
    }
    catch(err){
        return sendError(res,500,'Internal Server Error');
    }
}