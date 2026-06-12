const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware.js");
const accountController = require("../controllers/account.controller.js")

router.post("/create",authMiddleware.authMiddleware,accountController.createAccountController);


module.exports = router;