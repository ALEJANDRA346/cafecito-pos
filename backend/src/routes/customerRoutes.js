const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer); // <--- ESTA ES LA NUEVA

module.exports = router;