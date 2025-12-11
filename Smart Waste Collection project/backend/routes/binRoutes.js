const express = require('express');
const router = express.Router();
const binController = require('../controllers/binController');

router.get('/', binController.getAllBins);
router.get('/:id', binController.getBinById);
router.post('/update', binController.updateBin);
router.post('/update-multiple', binController.updateMultipleBins);
router.post('/create', binController.createBin);

module.exports = router;




