const router = require("express").Router();
const middleware = require("./middleware")
const controller = require("./controller");


router.post('/checktoken', middleware.validateToken)
router.post('/checkEmail', middleware.validateEmail, controller.isexistemail)
router.post('/signup',middleware.validateSignUp, controller.signup);
router.post('/login', middleware.validateLogin, controller.login);

module.exports = router;            