// const { ErrorHandler } = require("../../helpers/errorHandler");
const jwt = require("jsonwebtoken");
const { existingUserByEmail, passwordEncryption, createUser } = require("../../helpers/userHelper");

const AuthController = {

  isexistemail: async (req, res, next) => {
    try {
      const user = await existingUserByEmail(req.body.email);

      if (user) {
        if (!user.isFacebook && !user.isGoogle) res.json({ loginState: 3 })
        if (user.isGoogle && !user.isFacebook) res.json({ loginState: 2 })
        if (!user.isGoogle && user.isFacebook) res.json({ loginState: 1 })
        return 
      }

      console.log('user not exist.......', user);
      res.json({loginState: 0})
      return
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
      next(error)
    }
  },
  signup: async (req, res, next) => {
    try {
      const user = await existingUserByEmail(req.body.email);

      if (user) {
        console.log('check');
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
            error: `This email is already exists as a ${isUser}`
          })
        } else {
          res.json({
            error: 'This email already exists.'
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