// Import necessary modules and dependencies
const kue = require('kue');
const queue = kue.createQueue();
const nodemailer = require('nodemailer');
const { gmailConfig } = require('../config/nodemailer');

// Create a job for sending the password reset OTP email
queue.process('passwordReset', (job, done) => {
  const { email, otp } = job.data;

  const transporter = nodemailer.createTransport(gmailConfig);

  const mailOptions = {
    from: 'kendra.hudson40@ethereal.email',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending password reset OTP email:', error);
    } else {
      console.log('Password reset OTP email sent:', info.response);
    }

    done();
  });
});

const enqueue = (data) => {
  const job = queue.create('passwordReset', data).save((error) => {
    if (error) {
      console.error('Error creating password reset job:', error);
    } else {
      console.log('Password reset job created:', job.id);
    }
  });
};

module.exports = {
  enqueue,
};
