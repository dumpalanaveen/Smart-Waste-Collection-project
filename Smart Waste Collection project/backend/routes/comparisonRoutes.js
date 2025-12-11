const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

router.get('/', comparisonController.getAllComparisons);
router.post('/', comparisonController.runComparison);

module.exports = router;




