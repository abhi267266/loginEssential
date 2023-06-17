const User = require('../models/user');
const transporter = require('../config/nodemailer');
const kue = require('kue');
const jobs = kue.createQueue();
const crypto = require('crypto');


module.exports.resetPasswordPage = (req, res) => {
  res.render('resetPasswordForm',{
    title:"reset password"
  });
}

module.exports.sendEmailForAuth = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const otp = generateOTP(); // Assume you have a function to generate the OTP
      user.resetOTP = otp;
      await user.save();

      // Enqueue the job to send the OTP email
      const job = jobs.create('sendEmail', { email, otp }).save();

      res.redirect('/users/check');
    } else {
      console.log("here it is !!");
      res.redirect('/users/login');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/users/login');
  }
};

module.exports.checkOTPGet = (req, res)=>{
  return res.render('checkOtpForm', {
    title:"ENTER OTP"
  })
}

module.exports.checkOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({ resetOTP: otp });
    if (user) {
      res.redirect('/users/create-new-password');
    } else {
      console.log("user not found!!");
      res.redirect('/users/login');
    }
  } catch (error) {
  console.log(error);
    res.redirect('/users/login');
  }
};


module.exports.updatePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (newPassword === confirmPassword) {
      user.password = newPassword;
      user.resetOTP = undefined;
      await user.save();

      console.log('Password updated successfully');
      res.redirect('/users/login');
    } else {
      console.log('Passwords do not match');
      res.redirect('/users/create-new-password');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/users/login');
  }
};

//all the unexported funtion

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};


jobs.process('sendEmail', function (job, done) {
  const { email, otp } = job.data;

  // Configure the email message
  const mailOptions = {
    from: 'kendra.hudson40@ethereal.email',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  // Send the email using the transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    done();
  });
});