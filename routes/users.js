const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controller/users_controller');

router.get('/signup', usersController.signup);
router.get('/login', usersController.login);
router.get('/profile',passport.checkAuthentication, usersController.profile);
router.post('/create', usersController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-up'},
),
usersController.createSession);
router.get('/logout', usersController.destroySession)



module.exports = router;