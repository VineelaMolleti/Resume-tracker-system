const express = require('express');
const router = express.Router();

const {
    createTeamMember,
    getAllTeamMembers,
    getTeamMemberById,
    updateTeamMember,
    deActivateTeamMember,
    updatePermissions
} = require('../controllers/HiringTeamController');

router.post('/',createTeamMember);
router.get('/',getAllTeamMembers);
router.get('/:id',getTeamMemberById);
router.put('/:id',updateTeamMember);
router.patch(':/id/deactivate',deActivateTeamMember);
router.patch(':/id/permissions',updatePermissions);

module.exports=router;