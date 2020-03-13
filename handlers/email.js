const nodemailer = require('nodemailer');
//Importar las variables de entorno:
require('dotenv').config({ path: 'variables.env' });
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');



// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // user
        pass: process.env.PASSWORDEMAIL // password
    }
});
const generarHTML = (archivo, opciones) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

// send mail with defined transport object
exports.enviar = async(opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let info = {
        from: 'av85699@gmail.com', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
    };
    const enviarEmail = util.promisify(transporter.sendMail, transporter);
    return enviarEmail.call(transporter, info);

}