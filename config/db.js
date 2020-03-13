//Importar ORM = Object Relational Mapping
const Sequelize = require('sequelize');
//Extraer valores de variables.env
require('dotenv').config({ path: 'variables.env' });

// Option 1: Passing parameters separately
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
//Esto nos sirve para exportar el objeto y poder utilizarlo en los demas archivos.
module.exports = db;