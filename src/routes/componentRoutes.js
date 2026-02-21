const express = require('express');
const router = express.Router();
const { getComponents, getComponentById, createComponent, updateComponent, deleteComponent } = require('../controllers/componentController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getComponents).post(protect, admin, createComponent);
router.route('/:id').get(getComponentById).put(protect, admin, updateComponent).delete(protect, admin, deleteComponent);

module.exports = router;
