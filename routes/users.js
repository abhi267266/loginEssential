const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controller/users_controller');
const resetPasswordController= require('../controller/reset_password_controller');

router.get('/signup', usersController.signup);
router.get('/login', usersController.login);
router.get('/profile',passport.checkAuthentication, usersController.profile);
router.post('/create', usersController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/signup'},
),
usersController.createSession);
router.get('/logout', usersController.destroySession)

//reset password
router.get('/resetPassword', resetPasswordController.resetPasswordPage);
router.post('/sendEmailForAuth', resetPasswordController.sendEmailForAuth);
router.get('/check', resetPasswordController.checkOTPGet);
router.post('/check', resetPasswordController.checkOTP);
router.get('/create-new-password', resetPasswordController.updatePasswordGet);
router.post('/create-new-password', resetPasswordController.updatePassword)

//######################################

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);



module.exports = router;