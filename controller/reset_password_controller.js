const User = require('../models/user');
const crypto = require('crypto');
const nodeMailer = require('../config/nodemailer');


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
      const otp = crypto.randomInt(100000, 999999).toString();; // Assume you have a function to generate the OTP
      user.otp = otp;
      await user.save();

      // Invoke the newOtp function to send the OTP email
      nodeMailer.newOtp(user);

      res.redirect('/users/check');
    } else {
      console.log("User not found!");
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
    const user = await User.findOne({ resetOTP: otp });//<---work from here
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


