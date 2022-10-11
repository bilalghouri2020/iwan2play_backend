// const { ErrorHandler } = require("../../helpers/errorHandler");
const jwt = require("jsonwebtoken");
const { existingUserByEmail, passwordEncryption, createUser } = require("../../helpers/userHelper");

const AuthController = {

  isexistemail: async (req, res, next) => {
    try {
      const user = await existingUserByEmail(req.body.email);
      console.log('user...', user);
      if (user) {
        if (!user.isFacebook && !user.isGoogle) res.json({ loginState: 3, haveAChild: user?.haveAChild || false })
        if (user.isGoogle && !user.isFacebook) res.json({ loginState: 2, googleId: user?.GoogleId || null, haveAChild: user?.haveAChild || false })
        if (!user.isGoogle && user.isFacebook) res.json({ loginState: 1, haveAChild: user?.haveAChild || false })
        return
      }
      console.log('user not exist.......', user);
      return res.json({ loginState: 0, message: 'user not exist...' })

      if (user) {
        if (user.isGoogle || user.isFacebook) {
          if (user.GoogleId === req.body.GoogleId) {
            console.log('login');
            res.json({
              loginState: 2
            })
            return
          }
          let isUser = user.isGoogle ? 'Google User' : 'Facebook User.'
          res.json({
            message: `This email is already exists as a ${isUser}`
          })
        } else {

          res.json({
            message: 'This email already exists.'
          })
        }
        return
        // throw new ErrorHandler(400, "This email already exists.");
      }

      let password
      let userObject
      if (!req.body.isGoogle && !req.body.isFacebook) {
        password = passwordEncryption(req.body.password);
        userObject = {
          fullName: req.body.fullName,
          email: req.body.email,
          password: password,
          isGoogle: req.body.isGoogle,
          isFacebook: req.body.isFacebook
        };
      } else {
        userObject = {
          fullName: req.body.fullName,
          email: req.body.email,
          isGoogle: req.body.isGoogle,
          GoogleId: req.body.GoogleId,
          isFacebook: req.body.isFacebook
        };
      }
      await createUser(userObject);
      delete userObject?.password;

      return res.status(201).json({
        status: 201,
        data: userObject,
        error: null,
      });
    } catch (error) {
      return res.json({
        error: 'Error from checking email api...'
      })
      next(error)
    }
  },
  signup: async (req, res, next) => {
    try {
      const user = await existingUserByEmail(req.body.email);
      console.log("user...", user);
      if (user) {
        if (user.isGoogle || user.isFacebook) {
          if (user.GoogleId === req.body.GoogleId && !user.isFacebook) return res.json({
            status: 302,
            loginState: 2,

            message: `This email is already exists as a ${user.isGoogle ? 'Google User' : 'Facebook User.'}`
          })
        } else {
          return res.json({
            status:302,
            loginState: 3,
            message: 'This email already exists.'
          })
        }
        // throw new ErrorHandler(400, "This email already exists.");
      }

      let password
      let userObject
      if (!req.body.isGoogle && !req.body.isFacebook) {
        password = passwordEncryption(req.body.password);
        userObject = {
          fullName: req.body.fullName,
          email: req.body.email,
          password: password,
          isGoogle: req.body.isGoogle,
          isFacebook: req.body.isFacebook,
          haveAChild: false
        };
      } else {
        userObject = {
          fullName: req.body.fullName,
          email: req.body.email,
          isGoogle: req.body.isGoogle,
          GoogleId: req.body.GoogleId,
          isFacebook: req.body.isFacebook,
          haveAChild: false
        };
      }
      await createUser(userObject);
      delete userObject?.password;
      console.log("created user...", userObject);
      return res.status(201).json({
        status: 201,
        data: userObject,
        error: null,
      });
    } catch (error) {
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await existingUserByEmail(email.toLowerCase());
      console.log("user exits.......", user);

      if (!user) {
        res.json({
          error: 'Email or password incorrect.'
        })
        // throw new ErrorHandler(401, "Email or password incorrect.");
      }
      // if (user.isDeactive == true) {
      //   throw new ErrorHandler(402, "This account is deactivated.");
      // }
      const hashedPassword = passwordEncryption(password);
      if (user.password !== hashedPassword) {
        res.json({
          error: 'Email or password incorrect.'
        })
        return
        // throw new ErrorHandler(401, "Email or password incorrect.");
      }

      const payload = {
        _id: user._id,
        email: user.email,
        // userRole: user.userRole
      };
      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      console.log("you are successfully login.");
      res.json({
        data: { "token": jwtToken },
      });
    } catch (error) {
      next(error)
    }
  }


}


module.exports = AuthController;