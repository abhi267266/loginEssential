const User = require('../config/user');
const crypto = require('crypto');
const nodeMailer = require('../config/nodemailer');
const bcrypt = require('bcrypt');

module.exports.resetPasswordPage = (req, res) => {
  res.render('resetPasswordForm', {
    title: "Reset Password"
  });
};

module.exports.sendEmailForAuth = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      await user.save();

      // Invoke the newOtp function to send the OTP email
      nodeMailer.newOtp(user);

      req.flash('success', 'OTP sent successfully!');
      res.redirect('/users/check');
    } else {
      req.flash('error', 'User not found!');
      res.redirect('/users/login');
    }
  } catch (error) {
    console.log(error);
    req.flash('error', 'An error occurred while sending OTP.');
    res.redirect('/users/login');
  }
};

module.exports.checkOTPGet = (req, res) => {
  return res.render('checkOtpForm', {
    title: "ENTER OTP"
  });
};

module.exports.checkOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({ otp: otp });

    if (user) {
      // Create a session and store the user ID in it
      req.session.userId = user._id;

      res.redirect('/users/create-new-password');
    } else {
      req.flash('error', 'Invalid OTP entered!');
      res.redirect('/users/login');
    }
  } catch (error) {
    console.log(error);
    req.flash('error', 'An error occurred while checking OTP.');
    res.redirect('/users/login');
  }
};


module.exports.updatePasswordGet = (req, res)=>{
  return res.render('reset_password_form',{
    title:"ENTER PASSWORD"
  });
}

module.exports.updatePassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  try {
    const userId = req.session.userId; // Retrieve the user ID from the session

    if (!userId) {
      req.flash('error', 'User not authenticated!');
      return res.redirect('/users/login');
    }

    const user = await User.findById(userId);

    if (newPassword === confirmPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOTP = undefined;
      await user.save();

      req.flash('success', 'Password updated successfully!');
      res.redirect('/users/login');
    } else {
      req.flash('error', 'Passwords do not match!');
      res.redirect('/users/create-new-password');
    }
  } catch (error) {
    console.log(error);
    req.flash('error', 'An error occurred while updating the password.');
    res.redirect('/users/login');
  }
};
