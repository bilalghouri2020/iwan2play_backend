const Joi = require("joi");
const { ErrorHandler } = require("../../helpers/errorHandler");
const authHelper = require("../../helpers/authHelper");

const {
    jwtVerify,
} = authHelper;

exports.validateToken = async (req, res, next) => {
    console.log(req.body);
    try {
        const authHeader = req.headers["authorization"];
        console.log(authHeader)
        const token = authHeader && authHeader.split(" ")[1];
        // const token = authHeader;


        if (!token) {
            res.json({
                error: 'Unauthorized To Access'
            })
            return
            // throw new ErrorHandler(401, 'Unauthorized To Access')

        }

        const decodedData = await jwtVerify(token);
        console.log(decodedData);

        req.user = decodedData;
        res.json({
            user: req.user,
            authorized: true
        })
        
    } catch (error) {
        next(error);
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
            req.json({ error })
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
        // if (error) throw new ErrorHandler(400, error.details[0].message);
        if (error) {
            res.json({
                error: error?.details[0]?.message
            })
            return 
        }
        console.log('req.body..................', req.body);
        // res.json({message: 'ok'})
        next()
    } catch (error) {
        next(error);
    }
}

exports.validateLogin = (req, res, next) => {

    req.body.email = req.body.email.toLowerCase().trim()
    console.log(req.body.email);

    try {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().min(6).max(30),
            isGoogle: Joi.boolean().required(),
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