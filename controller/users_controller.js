const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports.signup = async (req, res)=>{
    return res.render('user_sign_up', {
        title: "Sigup Page",
        layout: false 

    });
}

module.exports.login = async (req, res)=>{
    return res.render('user_log_in',{
        title: "Log in Page",
        layout: false 
    });
}




module.exports.create = async (req, res)=>{
    const {name, email, password} = req.body;

    try {

        const users = await User.findOne({email});
        if (users) {
            req.flash('error', 'user with this email already exists');
            return res.redirect('/users/login');
          }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('')


        const newUser = new User({
            name,
            email,
            password: hashedPassword
          });

          await newUser.save();

    req.flash('success', 'User registered successfully');
    res.redirect('/users/login');
        
    } catch (error) {
        console.error('Failed to create employee:', error);
        req.flash('error', 'Failed to create user');
        res.redirect('/users/signup');
    }
}


module.exports.profile = (req,res)=>{
    return res.render("profile",{
        title: "Profile",
        name: req.user.name
    });
}

module.exports.destroySession = (req,res)=>{
    req.logout(function (err) {
        if (err) {
          console.log('Error logging out:', err);
          req.flash('error', 'Error while logout');
          return res.redirect('/'); // Handle the error case, e.g., redirect to home page
        }
        // Redirect the user to the desired page after logout
        return res.redirect('/users/login');
      });
}


module.exports.createSession = async (req, res)=>{
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/users/profile');
}