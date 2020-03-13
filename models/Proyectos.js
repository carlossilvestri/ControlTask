const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug'); //Paquete instalado para validar strings
const shortid = require('shortid'); //Paquete instalado para generar un pequeño id al final de un string

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: { type: Sequelize.STRING(100) },
    url: Sequelize.STRING(110)
}, {
    //Los hooks corren una funcion en un determinado tiempo
    //En la pag de Sequelize te salen todas las funciones: Ejm: beforeCreate
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`
        }

    }
});

module.exports = Proyectos;