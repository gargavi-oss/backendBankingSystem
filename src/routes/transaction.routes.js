const express = require('express');
const transactionController = require('../controllers/transaction.controller.js');
const authMiddleware = require("../middlewares/auth.middleware.js")
const router = express.Router();


router.post("/create",authMiddleware.authMiddleware,transactionController.createTransaction)
router.post("/system/intial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createIntialFundsTransaction);


module.exports = router;