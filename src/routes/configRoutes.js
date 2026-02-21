const express = require('express');
const router = express.Router();
const { createConfig, getMyConfigs, getConfigById, getConfigs, exportConfigPDF, deleteConfig } = require('../controllers/configController');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, createConfig).get(protect, admin, getConfigs);
router.route('/my').get(protect, getMyConfigs);
router.route('/:id').get(protect, getConfigById).delete(protect, deleteConfig);
router.route('/:id/pdf').get(protect, exportConfigPDF);

module.exports = router;
