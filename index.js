const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3000;
const urlMongoDb =
    process.env.URL_DB || 'mongodb://127.0.0.1:27017/db_auth';

mongoose.connect(
    urlMongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (err, res) => {
        try {
            if (err) {
                throw err;
            } else {
                console.log(
                    'La conexion a la base de datos es correcta'
                );

                app.listen(port, () => {
                    console.log(
                        `Servidor del API REST esta funcionando en http://localhost:${port}`
                    );
                });

                app.use('/', (req, res) =>
                    res.send('me quiero morir')
                );
            }
        } catch (error) {
            console.error(error);
        }
    }
);