const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Use local strategy for users authentication
const bcrypt = require('bcrypt');
const User = require('./user');

// Define the LocalStrategy for users authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    async function (req, email, password, done) {
      try {
        // Find the users by email
        const user = await User.findOne({ email });

        // If no users found, return failure
        if (!user) {
          req.flash('error', 'Invalid email or password');
          return done(null, false);
        }

        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If passwords match, return success
        if (passwordMatch) {
          return done(null, user);
        } else {
          req.flash('error', 'Invalid email or password');
          return done(null, false);
        }
      } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Login error');
        return done(err);
      }
    }
  )
);

// Serialize the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.log('Error in finding user --> Passport', err);
    return done(err);
  }
});


// Check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in, pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not signed in, redirect to the sign-in page
  return res.redirect('/users/signup');
};
  
// Set the authenticated users in locals for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.users contains the current signed-in users from the session cookie, and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
