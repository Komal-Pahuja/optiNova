const express = require('express');
const { apiLogin, apiRegister, loginValidators, registerValidators } = require('../controllers/authController');
const handleValidation = require('../middleware/validate');
// routes
const router = express.Router();

router.post('/register', registerValidators, handleValidation, apiRegister);
router.post('/login', loginValidators, handleValidation, apiLogin);

module.exports = router;
