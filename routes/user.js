const express = require('express');
const multiparty = require('connect-multiparty');
const user = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');
const md_uploadAvatar = multiparty({ uploadDir: './uploads' });

const router = express.Router();

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/protected', [md_auth.validate], user.protected);
router.put(
    '/upload-avatar/:id', [md_auth.validate, md_uploadAvatar],
    user.uploadAvatar
);
router.get('/avatar/:avatarName', user.getAvatar);

module.exports = router;