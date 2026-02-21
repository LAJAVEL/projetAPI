const express = require('express');
const router = express.Router();
const { getPartners, createPartner, updatePartner, deletePartner } = require('../controllers/partnerController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getPartners).post(protect, admin, createPartner);
router.route('/:id').put(protect, admin, updatePartner).delete(protect, admin, deletePartner);

module.exports = router;
