const Joi = require("joi");
// const { ErrorHandler } = require("../../helpers/errorHandler");
const authHelper = require("../../helpers/authHelper");
const { existingUserByEmail } = require("../../helpers/userHelper");

const {
    jwtVerify,
} = authHelper;

exports.validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        // const token = authHeader;
        if (!token) {
            return res.json({
                error: 'Unauthorized To Access'
            })
        }

        const decodedData = await jwtVerify(token);
        if (decodedData.error) return res.json({ error: 'invalid JWT token' })

        const user = await existingUserByEmail(decodedData.email);
        if (!user) {
            return res.json({
                error: 'tokan valid but user does\'t exist.'
            })
        }
        if (decodedData?.googleId) {
            if (user.GoogleId !== decodedData?.googleId) {
                return res.json({
                    error: 'tokan is valid but google account does\'t exist or google ID does\'t match.'
                })
            }
        }
        delete user.password
        res.json({
            user,
            authorized: true
        })

    } catch (error) {
        console.log("catch error from token verify middleware...", error);
        return res.json({
            error: 'catch error from token verify middleware...'
        })
    }
    // res.json({
    //     messagE: 'token ok'
    // })
}

exports.validateEmail = (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            isGoogle: Joi.boolean().required(),
            isFacebook: Joi.boolean().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('error....', error);
            res.json({ error: error.details[0].message })
            return
        }
        // if (error) throw new ErrorHandler(400, error.details[0].message);
        console.log('req data...........', req.body);


        next()
    } catch (error) {
        next(error);
    }
}
exports.validateSignUp = (req, res, next) => {
    req.body.email = req.body.email.toLowerCase().trim()

    try {
        const schema = Joi.object({
            fullName: Joi.string().required().min(3).max(50),
            //   lastName: Joi.string().required().min(3).max(30),
            email: Joi.string().required().email(),
            password: !req.body.isGoogle && !req.body.isFacebook ? Joi.string().required().min(6).max(30) : Joi.string().min(6).max(30),
            isGoogle: Joi.boolean().required(),
            GoogleId: req.body.isGoogle ? Joi.string().required() : Joi.string(),
            isFacebook: Joi.boolean().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log("Joi schema error...", error);
            res.json({
                error: error?.details[0]?.message
            })
            return
        }
        console.log('sign up validation has been approved...');
        next()
    } catch (error) {
        console.log('catch..');
        next(error);
    }
}

exports.validateLogin = (req, res, next) => {

    req.body.email = req.body.email.toLowerCase().trim()
    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().min(6).max(30),
            isGoogle: Joi.boolean().required(),
            googleId: Joi.string(),
            isFacebook: Joi.boolean().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            // throw new ErrorHandler(400, error.details[0].message);
            res.json({
                error: error?.details[0]?.message
            })
            return
        }
        next()
    } catch (error) {
        next(error);
    }
}



exports.forgotPassword = (req, res, next) => {
    req.body.email = req.body.email.toLowerCase().trim()
    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
        });
        
        const { error } = schema.validate(req.body);
        if (error) {
            // throw new ErrorHandler(400, error.details[0].message);
            res.json({
                error: error?.details[0]?.message
            })
            return
        }
        console.log('check');
        next()
    } catch (error) {
        console.log('error from forgot password', error);
        next(error);
    }
}
exports.verifyCode = (req, res, next) => {
    
    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            code: Joi.number().required(),
        });
        
        const { error } = schema.validate(req.body);
        if (error) {
            // throw new ErrorHandler(400, error.details[0].message);
            res.json({
                error: error?.details[0]?.message
            })
            return
        }
        console.log('check');
        next()
    } catch (error) {
        console.log('error from forgot password', error);
        next(error);
    }
}
exports.newPassword = (req, res, next) => {

    // req.body.email = req.body.email.toLowerCase().trim()
    
    try {
        const schema = Joi.object({
            code: Joi.number().required(),
            password: Joi.string().required(),
        });


        const { error } = schema.validate(req.body);
        if (error) {
            // throw new ErrorHandler(400, error.details[0].message);
            res.json({
                error: error?.details[0]?.message
            })
            return
        }
        next()
    } catch (error) {
        console.log('error from forgot password', error);
        next(error);
    }
}