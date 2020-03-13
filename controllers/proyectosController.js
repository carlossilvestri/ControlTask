const Proyectos = require('../models/Proyectos');
const slug = require('slug');
const Tareas = require('../models/Tareas');

exports.proyectoHome = async(req, res) => {
    //console.log(res.locals.usuario);
    //findAll trae todos los registros
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } }); //findAll funcion del ORM de Sequelize.

    res.render('nuevoProyecto2', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}
exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    res.render('nuevoProyecto2', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}
exports.nuevoProyecto = async(req, res) => {
    //Enviar a la consola lo que el usuario envie
    // console.log(req.body); // Puedes ver los valores del formulario con eso, pero en la consola de comandos de Windows
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    //Validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = []; //Arreglo.

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' });
    }
    //Si hay errores
    if (errores.length > 0) {
        //Mostrar los errores a la Vista
        res.render('nuevoProyecto2', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //No hay errores. Insertar en la BD.
        //const url = slug(nombre).toLowerCase();
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}
exports.proyectoPorUrl = async(req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del proyecto actual.
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
        /*
        //Esta parte es como si fuera un JOIN pero en un ORM no haces eso, lo haces de esta forma.
        include: [
            { model: Proyectos }
        ]*/
    });


    if (!proyecto) return next();

    //Render a la vista:

    res.render('tareas2', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}
exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId

        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    //Render a la vista
    res.render('nuevoProyecto2', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}
exports.actualizarProyecto = async(req, res) => {
    //Enviar a la consola lo que el usuario envie
    // console.log(req.body); // Puedes ver los valores del formulario con eso, pero en la consola de comandos de Windows
    const proyectos = await Proyectos.findAll();
    //Validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = []; //Arreglo.

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' });
    }
    //Si hay errores
    if (errores.length > 0) {
        //Mostrar los errores a la Vista
        res.render('nuevoProyecto2', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //No hay errores. Insertar en la BD.
        const url = slug(nombre).toLowerCase();
        await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
        res.redirect('/');
    }
}
exports.eliminarProyecto = async(req, res, next) => {
    // req. query o params
    //console.log(req.query);
    const { urlProyecto } = req.query;
    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });
    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente.');
}