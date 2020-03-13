const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

//Parametros: 1ero Nombre del modelo, 2do los atributos de la tabla
const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, //El campo no puede quedar vacio
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Valido.'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado.'
        },
        notEmpty: {
            msg: 'El email no puede ir vacio.'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false, //El campo no puede quedar vacio
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio.'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});
//Metodos personalizados:
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;