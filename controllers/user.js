const Model = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('../services/jwt');

async function register(req, res) {
    const user = new Model(req.body);
    const { email, password } = req.body;

    try {
        if (!email) throw 'el email es obligatorio';
        if (!password) throw 'el password es obligatorio';

        // comprobando si ya existe el email en db
        const foundEmail = await Model.findOne({ email: email });
        if (foundEmail) throw 'el email ya esta en uso';

        // encriptacion de la contraseña
        user.password = await bcryptjs.hash(password, 10);

        user.save();
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await Model.findOne({ email });
        if (!user) throw 'error en el email o password';

        const passwordSucess = await bcryptjs.compare(
            password,
            user.password
        );

        if (!passwordSucess) throw 'error en el email o password';

        res.status(200).send({ token: jwt.create(user, '12h') });
    } catch (err) {
        res.status(500).send(err);
    }
}

function protected(req, res) {
    res.status(200).send({ msg: 'contenido del endpoint protegido' });
}

module.exports = {
    register,
    login,
    protected
};