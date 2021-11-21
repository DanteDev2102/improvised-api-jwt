const fs = require('fs');
const path = require('path');

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

function uploadAvatar(req, res) {
    const params = req.params;

    Model.findById({ _id: params.id }, (err, userData) => {
        if (err) res.status(500).send({ msg: 'Internal error' });
        else if (!userData)
            res.status(404).send({ msg: 'User not found' });
        else {
            let user = userData;

            if (req.files) {
                const filePath = req.files.avatar.path;
                const fileSplit = filePath.split('\\');
                const fileName = fileSplit[1];

                const extSplit = filePath.split('.');
                const fileExt = extSplit[1];

                if (fileExt !== 'png' && fileExt !== 'jpg')
                    res.status(400).send({
                        msg: 'Invalid file extension'
                    });
                else {
                    user.avatar = fileName;
                    Model.findOneAndUpdate({ _id: params.id },
                        user,
                        (err, userResult) => {
                            if (err)
                                res.status(500).send({
                                    msg: 'Internal Error'
                                });
                            else if (!userResult)
                                res.status(404).send({
                                    msg: 'User not found'
                                });
                            else
                                res.status(200).send({
                                    msg: 'avatar update'
                                });
                        }
                    );
                }
            }
        }
    });
}

function getAvatar(req, res) {
    const { avatarName } = req.params;
    const filePath = `./uploads/${avatarName}`;

    fs.stat(filePath, (err, stat) => {
        console.log(filePath);
        if (err) {
            res.status(404).send('avatar not found');
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

module.exports = {
    register,
    login,
    protected,
    uploadAvatar,
    getAvatar
};