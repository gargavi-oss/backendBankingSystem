const express = require('express');
const transactionController = require('../controllers/transaction.controller.js');

const router = express.Router();


router.post("/create",transactionController)

module.exports = router;