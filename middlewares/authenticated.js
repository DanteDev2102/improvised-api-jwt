const moment = require('moment');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'kpowejfewipfjiwepjhfiowejopfijweijwpof';

function ensureAuth(req, res, next) {
    if (!req.headers.authorization)
        return res.status(403).send({ msg: 'Invalid authorization' });

    const token = req.headers.authorization.replace(/['"]+/g, '');

    const payload = jwt.decode(token, SECRET_KEY);
    try {
        if (payload.exp <= moment().unix())
            return res.status(400).send({ msg: 'TOKEN EXPIRED' });
    } catch (err) {
        return res.status(404).send({ msg: 'Invalid Token' });
    }

    req.user = payload;
    next();
}

module.exports = {
    validate: ensureAuth
};