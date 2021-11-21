const express = require('express');
const user = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');

const router = express.Router();

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/protected', [md_auth.validate], user.protected);

module.exports = router;