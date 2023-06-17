const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'armando89@ethereal.email',
        pass: 'HGwmmbHu8Vpgaheeuf'
    }
});


let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailer/reset/', relativePath),
        data,
        function(err, template){
            if (err) {
                console.log('Error in rendering template', err);
                return;
            }
            mailHTML = template;
        }
    );
    return mailHTML;
};

let newOtp = (user) => {
    let htmlString = renderTemplate({ user }, 'reset_password.ejs');

    let mailOptions = {
        from: "armando89@ethereal.email",
        to: user.email,
        subject: 'Reset Password',
        html: htmlString
    };

    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
    });
};

module.exports = {
    transporter,
    renderTemplate,
    newOtp
};
