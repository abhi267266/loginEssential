const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'alchemy.cn18',
        pass: 'codingninjas'
    }
    // kendra.hudson40@ethereal.email
    // VY9t8eKvx4r4M8VbYQ
});


module.exports = transporter;