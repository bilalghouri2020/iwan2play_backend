// const { ErrorHandler } = require("../../helpers/errorHandler");
const jwt = require("jsonwebtoken");
const { existingUserByEmail, passwordEncryption, createUser, updatePassword } = require("../../helpers/userHelper");

const { sendMail } = require("../../helpers/email.utils");
const { emailVerificationTemplate } = require("../../helpers/email_verification");
const { VerifyUserModel } = require("../../models/verificationModel");


const AuthController = {

  isexistemail: async (req, res, next) => {
    try {
      const user = await existingUserByEmail(req.body.email);
      if (user) {
        if (!user.isFacebook && !user.isGoogle) res.json({ loginState: 3, haveAChild: user?.haveAChild || false })
        if (user.isGoogle && !user.isFacebook) res.json({ loginState: 2, googleId: user?.GoogleId || null, haveAChild: user?.haveAChild || false })
        if (!user.isGoogle && user.isFacebook) res.json({ loginState: 1, haveAChild: user?.haveAChild || false })
        return
      }
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
      if (user) {
        if (user.isGoogle || user.isFacebook) {

          if (user.GoogleId === req.body.GoogleId && !user.isFacebook) {
            let payload = {
              _id: user._id,
              email: user.email,
              googleId: user.GoogleId
            }
            const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);

            return res.json({
              status: 302,
              loginState: 2,
              message: `This email is already exists as a ${user.isGoogle ? 'Google User' : 'Facebook User.'}`,
              data: user,
              token: jwtToken
            })
          }
        } else {
          return res.json({
            status: 302,
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
      let userResult = await createUser(userObject);

      let payload;
      if (!userResult.isFacebook && !userResult.isGoogle) {
        payload = {
          _id: userResult._id,
          email: userResult.email,
          // userRole: user.userRole
        };
      }
      if (userResult.isGoogle) {
        payload = {
          _id: userResult._id,
          email: userResult.email,
          googleId: userResult.GoogleId
        }
      }
      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      delete userObject?.password;
      return res.json({
        status: 201,
        data: userObject,
        token: jwtToken,
        error: null,
      });
    } catch (error) {
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password, googleId } = req.body;

      const user = await existingUserByEmail(email.toLowerCase());


      if (!user) {
        res.json({
          error: 'Email or password incorrect.'
        })
        // throw new ErrorHandler(401, "Email or password incorrect.");
      }
      // if (user.isDeactive == true) {
      //   throw new ErrorHandler(402, "This account is deactivated.");
      // }

      let payload;
      if (!user.isFacebook && !user.isGoogle) {
        const hashedPassword = passwordEncryption(password);
        if (user.password !== hashedPassword) {
          res.json({
            error: 'Email or password incorrect.'
          })
          return
          // throw new ErrorHandler(401, "Email or password incorrect.");
        }
        payload = {
          _id: user._id,
          email: user.email,
          // userRole: user.userRole
        };
      }
      if (user.isGoogle) {

        if (googleId !== user.GoogleId) {
          return res.json({
            error: 'email or google id is incorrect'
          })
        }
        payload = {
          _id: user._id,
          email: user.email,
          googleId: user.GoogleId
        }

      }

      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      console.log("you are successfully login.");
      res.json({
        data: { "token": jwtToken },
        user,
      });

    } catch (error) {
      next(error)
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body
      const user = await existingUserByEmail(email.toLowerCase())
      if (!user) {
        res.json({
          status: 401,
          error: `This email doesn't exist...`,
          message: ''
        })
        return
      }
      if (user.isGoogle !== false && user.isFacebook !== false) {
        res.json({
          status: 401,
          error: `This user as a ${user.isGoogle ? 'Google' : 'Facebook'} user...`,
          message: ''
        })
        return
      }

      let randomNumber = Math.floor(100000 + Math.random() * 900000)
      // return

      let verifyCode = await VerifyUserModel.findOneAndUpdate({ userId: user._id }, {
        userId: user._id,
        email: user.email,
        verificationCode: randomNumber,
        status: false
      }, { new: true, upsert: true })

      if (!verifyCode) {
        res.json({
          status: 401,
          error: `something went wrong in generating verification code...`,
          message: ''
        })
        return
      }
      await sendMail({
        from: process.env.EMAIL_USER,
        to: user?.email,
        subject: "Password Reset",
        html: emailVerificationTemplate(randomNumber, "Password Reset")
      })
      // .then(Response => {
      // }).catch(err => {
      //   console.log(err);
      //   res.json({
      //     status: 401,
      //     error: 'email sending error...' + err
      //   })
      // });
      res.json({
        status: 200,
        message: 'You has been successfully send email. check your email'
      })
    } catch (error) {
      console.log('error...', error);
      res.json({
        status: 401,
        message: 'email sending error...' + err,
      })
    }
  },
  verifyCode: async (req, res, next) => {
    try {
      const { email, code } = req.body
      const user = await existingUserByEmail(email.toLowerCase())
      if (!user) {
        res.json({
          status: 401,
          error: `This email doesn't exist...`,
          message: '',
          verified: false,
        })
        return
      }
      if (user.isGoogle !== false && user.isFacebook !== false) {
        res.json({
          status: 401,
          error: `This user as a ${user.isGoogle ? 'Google' : 'Facebook'} user...`,
          message: '',
          verified: false,
        })
        return
      }

      // let verify = await VerifyUserModel.findOne({verificationCode: code})
      let verify = await VerifyUserModel.findOneAndUpdate({ verificationCode: code }, {
        userId: user._id,
        email: user.email,
        verificationCode: code,
        status: true
      })
      if (verify) {
        return res.json({
          status: 200,
          message: 'your code has been verified.',
          error: null,
          verified: true,
        })
      }
      throw 'Your verification code has been deleted. Please try again.'
      // if(verify.status === false && verify.verificationCode === 000000){
      // }
    } catch (error) {
      console.log('error...', error);
      return res.json({
        status: 401,
        error: error,
        message: error,
        verified: false,
      })
    }
  },
  reCreatePassword: async (req, res, next) => {
    try {
      const { code, password: pass } = req.body
      let verify = await VerifyUserModel.findOne({ verificationCode: code })
      
      if (!verify) {
        return res.json({
          status: 401,
          error: 'verification code doesnt match.'
        })
      }

      console.log("verify,,,", verify);
      // return
      const user = await existingUserByEmail(verify.email);
      if (!user) {
        return res.json({
          status: 401,
          error: 'this is doesn\'t exist.'
        })
      }

      let encryptedPassword = passwordEncryption(pass);
      console.log("pass..", encryptedPassword);
      let updated = await updatePassword(user._id, encryptedPassword)
      console.log("updated...user...", updated);
      if (!updated) {
        return res.json({
          status: 401,
          error: 'password not updated.'
        })
      }

      let againVerify = await VerifyUserModel.findOneAndUpdate({ verificationCode: code }, {
        userId: user._id,
        email: user.email,
        verificationCode: 000000,
        status: false
      })

      return res.json({
        status: 200,
        error: null,
        message: 'your password has been successfully updated...',
        verified: true
      })
      
      // if (user) {
      //   if (user.isGoogle || user.isFacebook) {
      //     console.log('user...........', user);
      //     console.log('user...........', req.body);

      //     if (user.GoogleId === req.body.GoogleId && !user.isFacebook) {
      //       let payload = {
      //         _id: user._id,
      //         email: user.email,
      //         googleId: user.GoogleId
      //       }
      //       const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);

      //       return res.json({
      //         status: 302,
      //         loginState: 2,
      //         message: `This email is already exists as a ${user.isGoogle ? 'Google User' : 'Facebook User.'}`,
      //         data: user,
      //         token: jwtToken
      //       })
      //     }
      //   } else {
      //     return res.json({
      //       status: 302,
      //       loginState: 3,
      //       message: 'This email already exists.'
      //     })
      //   }
      //   // throw new ErrorHandler(400, "This email already exists.");
      // }

      // let password
      // let userObject
      // if (!req.body.isGoogle && !req.body.isFacebook) {
      //   password = passwordEncryption(req.body.password);
      //   userObject = {
      //     fullName: req.body.fullName,
      //     email: req.body.email,
      //     password: password,
      //     isGoogle: req.body.isGoogle,
      //     isFacebook: req.body.isFacebook,
      //     haveAChild: false
      //   };
      // } else {
      //   userObject = {
      //     fullName: req.body.fullName,
      //     email: req.body.email,
      //     isGoogle: req.body.isGoogle,
      //     GoogleId: req.body.GoogleId,
      //     isFacebook: req.body.isFacebook,
      //     haveAChild: false
      //   };
      // }
      // let userResult = await createUser(userObject);

      // let payload;
      // if (!userResult.isFacebook && !userResult.isGoogle) {
      //   payload = {
      //     _id: userResult._id,
      //     email: userResult.email,
      //     // userRole: user.userRole
      //   };
      // }
      // if (userResult.isGoogle) {
      //   payload = {
      //     _id: userResult._id,
      //     email: userResult.email,
      //     googleId: userResult.GoogleId
      //   }
      // }
      // const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      // delete userObject?.password;
      // console.log("created user...", userObject);
      // return res.json({
      //   status: 201,
      //   data: userObject,
      //   token: jwtToken,
      //   error: null,
      // });
    } catch (error) {
      next(error)
    }
  },


}


module.exports = AuthController;