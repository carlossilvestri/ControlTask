const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios.'
});
//Funcion para revisar si el usuario esta logueado.
exports.usuarioAutenticado = (req, res, next) => {
        //Si el usuario esta autenticado, adelante

        if (req.isAuthenticated()) {
            return next();
        }
        //Sino entonces redirigir al formulario
        return res.redirect('/iniciar-sesion');
    }
    //Funcion para cerrar sesion
exports.cerrarSesion = (req, res, next) => {
        req.session.destroy(() => {
            res.redirect('/'); //Al cerrar sesion nos lleva al login.
        })
    }
    //genera un token si el usuario es válido
exports.enviarToken = async(req, res) => {
    //verificar que el usuario exista.
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } })
        //Si no existe el usuario
    if (!usuario) {
        req.flash('danger', 'No existe la cuenta.')
        res.redirect('/reestablecer');
    }
    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    //Guardarlos en la BDD
    await usuario.save();
    //URL de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Reestablecer Contraseña',
        resetUrl,
        archivo: 'reestablecer-password'
    });
    //Terminar
    req.flash('success', 'Se envió un mensaje a tu corrreo.');
    res.redirect('/iniciar-sesion');
}
exports.validarToken = async(req, res) => {
        const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
        //Si no hay usuario
        if (!usuario) {
            req.flash('danger', 'No válido');
            res.redirect('/reestablecer');

        }
        //Formulario para generar el password
        res.render('resetPassword2', {
            nombrePagina: 'Reestablecer contraseña'

        })
    }
    //Cambia el password por uno nuevo
exports.actualizarPassword = async(req, res, next) => {
    //Verifica el token válido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    console.log('Token: ' + req.params.token);
    console.log(usuario);
    //Verificamos si el usuario existe:
    if (!usuario) {
        req.flash('danger', 'No válido');
        res.redirect('/reestablecer');
    }
    //Hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    //Guardamos el nuevo password
    await usuario.save();
    req.flash('success', 'Tu contraseña se ha modificado correctamente.');
    res.redirect('/iniciar-sesion');


}

//Despues borrar
exports.autenticarUsuario2 = (req, res, next) => {
    console.log(req.body);
    res.send('Enviaste el formulario');
}