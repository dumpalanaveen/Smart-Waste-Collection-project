const express = require('express');
const router = express.Router();
const optimizationController = require('../controllers/optimizationController');

router.post('/', optimizationController.optimizeRoute);
router.post('/compare', optimizationController.compareAlgorithms);

module.exports = router;




