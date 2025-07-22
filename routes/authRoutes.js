const express = require('express');
const router = express.Router();

const { logIn , signUp } = require('../controllers/authController.js');

router.post('/signup', signUp);
router.post('/login', logIn);


module.exports = router;
 