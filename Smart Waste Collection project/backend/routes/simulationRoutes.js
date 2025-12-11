const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

router.get('/', simulationController.getAllSimulations);
router.post('/random', simulationController.randomSimulation);
router.post('/manual', simulationController.manualSimulation);
router.post('/time-based', simulationController.timeBasedSimulation);

module.exports = router;




