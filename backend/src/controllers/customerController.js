const Customer = require('../models/Customer');
exports.getCustomers = async (req, res) => res.json(await Customer.find());
