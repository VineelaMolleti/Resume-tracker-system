const Candidate = require('../model/candidateSchema');

exports.createCandidate = async(req,res)=>{
    try{
    const candidate = new Candidate({
        name:req.body.name,
        email:req.body.email,
        phoneNo:req.body.phoneNo,
        skills:req.body.skills,
        status:req.body.status||'Applied'
    });

    await candidate.save();

    res.status(201).json({
        success:true,
        date : candidate
    });
  }
  catch(err){
    res.status(400).json({
        success:false,
        error:err.message
    });
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
            return res.status(404).json({
                success:false,
                error:'Candidate not found'
            });
        }

        res.status(200).json({
            success:true,
            data:candidate
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        })
    }
}

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
        res.status(400).json({
        success:false,
        error:err.message
       });
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
            data:{}
        });

    }
    catch(err){
        res.status(500).json({
            success:false,
            error:'Server Error'
        });
    };
}