const express = require('express');
const router = express.Router();

const {
    createReferral,
    getAllReferrals,
    getReferralById,
    updateReferralStatus,
    processReferralBonus
} = require('../controllers/ReferralsController');

router.post('/',createReferral);
router.get('/',getAllReferrals);
router.get('/:id',getReferralById);
router.patch('/:id/status',updateReferralStatus);
router.patch('/:id/process-bonus',processReferralBonus);

module.exports = router;