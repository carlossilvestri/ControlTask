//Lo que tenga ./ son archivos internos exportados de tus carpetas y los que no tengan eso, los exportas directamente de node
const express = require('express');
const path = require('path'); //Libreria de express
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const routes = require('./routes');
//Importar las variables de entorno:
require('dotenv').config({ path: 'variables.env' });


//Helpers con algunas funciones
const helpers = require('./helpers');


//Crear la conexion a la BD:
const db = require('./config/db.js');

//Importar el modelo:
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
//Tambien puedes usar authenticate() en vez de sync() para comprobar si esta conectado.
db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));


//Crear una app de express
const app = express();

//Habilitar BodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

//Agregamos express validator a toda la aplicacion
//app.use(expressValidator());

//Donde cargar los archivos estaticos:
app.use(express.static('public'));

//Habilitar Pug como Template Engine.
app.set('view engine', 'pug');

//Añadir la carpeta de las vistas:
app.set('views', path.join(__dirname, './views')); //__dirname retornara el archivo principal (index).

app.use(cookieParser());

//Agregar flash messages
app.use(flash());

app.use(passport.initialize());
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//Pasar vardump a la aplicacion
app.use((req, res, next) => {
    //Con res.locals puedes crear variables y consumirlo en el resto de tus archivos.
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;
    next(); //Garantiza que se pase al siguiente middleware.
});


//Ruta para el home
//Requests: Es la consulta. El response es la resputa que te da el servidor. get, post, patch,

app.use('/', routes());

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.listen(port, host, () => {
    console.log('El servidor esta funcionando' + ' en el puerto ' + port + ' y en el host ' + host);
});