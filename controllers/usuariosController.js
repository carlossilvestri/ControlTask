const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (req, res, next) => {
    res.render('crearCuenta2', {
        nombrePagina: 'Crear Cuenta en ControlTask'

    })
}

exports.formIniciarSesion = (req, res, next) => {
    const { error } = res.locals.mensajes;
    console.log(error);
    res.render('iniciarSesion2', {

        nombrePagina: 'Iniciar Sesión en ControlTask',
        error

    })
}

exports.crearCuenta = async(req, res, next) => {
    //Leer los datos
    //Puedes usar re.body gracias al paquete bodyParser que te ayuda a leer datos http
    const { email, password } = req.body;
    console.log("Email: " + email)

    try { //Crear el usuario
        await Usuarios.create({
                email,
                password
            })
            //Redirigir al usuario
        req.flash('success', 'Enviamos un correo, confirma tu cuenta.');
        res.redirect('/iniciar-sesion');
        //Crear una URL de confirmar
        const confirmarEmail = `http://${req.headers.host}/confirmar/${email}`;
        //Crear el objeto de usuario
        const usuario = {
                email
            }
            //Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta ControlTask',
            confirmarEmail,
            archivo: 'confirmar-cuenta'
        });
    } catch (error) {
        res.render('crearCuenta2', {
            errores: error.errors,
            nombrePagina: 'Crear Cuenta en ControlTask',
            email,
            password
        })
    }
}
exports.formRestablecerPasword = (req, res) => {
        res.render('reestablecer2', {
            nombrePagina: 'Reestablecer tu contraseña'
        })
    }
    //Cambia el estado de una cuenta: (Si esta confirmada o no en el correo).
exports.confirmarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({
            where: {
                email: req.params.correo
            }
        })
        //Si no existe el usuario
    if (!usuario) {
        req.flash('danger', 'No válido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();

    req.flash('success', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}