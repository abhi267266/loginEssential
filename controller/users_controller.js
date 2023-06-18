const bcrypt = require('bcrypt');
const User = require('../config/user');

module.exports.signup = async (req, res) => {
  return res.render('user_sign_up', {
    title: "Signup Page",
    layout: false
  });
};

module.exports.login = async (req, res) => {
  return res.render('user_log_in', {
    title: "Login Page",
    layout: false
  });
};

module.exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      req.flash('error', 'A user with this email already exists.');
      return res.redirect('/users/login');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    req.flash('success', 'User registered successfully!');
    res.redirect('/users/login');
  } catch (error) {
    console.error('Failed to create user:', error);
    req.flash('error', 'Failed to create user.');
    res.redirect('/users/signup');
  }
};

module.exports.profile = (req, res) => {
  return res.render("profile", {
    title: "Profile",
    name: req.user.name
  });
};

module.exports.destroySession = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log('Error logging out:', err);
      req.flash('error', 'Error while logging out.');
      return res.redirect('/'); // Handle the error case, e.g., redirect to the home page
    }
    req.flash('success', 'Logged out successfully!');
    return res.redirect('/users/login');
  });
};

module.exports.createSession = async (req, res) => {
  req.flash('success', 'Logged in successfully!');
  return res.redirect('/users/profile');
};
