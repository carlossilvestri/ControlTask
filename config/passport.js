const passport = require('passport');
const LocalStrategy = require('passport-local');

//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//Local Strategy. Login con credenciales propias.
passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //El usuario existe pero password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña incorrecta.'
                    })
                }
                //El email existe y el password es correcto:
                return done(null, usuario);
            } catch (error) {
                //Ese usuario no existe:
                return done(null, false, {
                    message: 'La cuenta no existe'
                })
            }
        }
    )
);

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});
//Deserializar el usuario (Colocarlo junto como un objeto)
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});
//Exportar
module.exports = passport;