const Joi = require("joi");
// const { ErrorHandler } = require("../../helpers/errorHandler");
const { isValidObjectId } = require("mongoose");
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')
const { Worker } = require('worker_threads')

const cloudinary = require('cloudinary')
dotenv.config()
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.validateKidsInfo = (req, res, next) => {
  const {kidInfoData} = req.body
  // console.log(req.body);
  // return
  try {
    const schema = Joi.object({
      childName: Joi.string().required(),
      childDOB: Joi.string().required(),
      childGender: Joi.string().valid('female', 'male').required(),
      selectedLanguages: Joi.array().items(Joi.string()).required(),
      aboutMeAndMyChildText: Joi.string().min(20).max(200),
      iLikeToPlay: Joi.string().required(),
      iCanMeet: Joi.string().required(),
      myFavoriteActivities: Joi.array().items(Joi.string()).required(),
      uploadedImageResult: Joi.object().required()
    });
    const cloudinaryResult = schema.validate(kidInfoData);
    const {error} = cloudinaryResult
    if (error) throw { errorCode: 400, error: error.details[0].message }
    next()
    return 
  } catch (error) {
    // next(error);
    console.log('error from joi validation middleware...', error);
    res.json({
      ...error
    })
    return
  }
}


exports.uploadingImage = async (req, res, next) => {
  // console.log(req.files);
  let dataURI = req.files[0].buffer.toString('base64')
  // console.log(dataURI);
  // return 
  let uploadStr = `data:image/jpeg;base64,${dataURI}`
  const { kidInfoData: { childName } } = req.body
  console.log(childName);
  
  cloudinary.v2.uploader.upload(uploadStr, {
    overwrite: true,
    public_id: `${childName}-${uuidv4()}`,
    invalidate: true,
    width: 810,
    height: 810,
    // crop: "imagga_crop"
    crop: "fill"

  }, (error, result) => {
    console.log("cloudinary error...", error);
    if (error) return res.json({ error: 'cloudinary error' + error })
    console.log("result.....", result);
    if (result.type === 'upload') {
      // console.log('checked');
      req.body.kidInfoData.uploadedImageResult = result
      // console.log("uploaded...", req.body);
      // res.json({
      //   message: 'image uploaded...'
      // })
      next()
      return
    }
    res.json({
      message: 'getting problem in upload image on cloudinary...',
      result
    })
    return 
  })
  return 
}

exports.validateAddProduct = (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      stock: Joi.number().required(),
      discount: Joi.string(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      manufacturer: Joi.string(),
      QRCode: Joi.string(),
      cost: Joi.number().required(),
      categoryId: Joi.string().required(),
      producerId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw new ErrorHandler(400, error.details[0].message);
    next()
  } catch (error) {
    next(error);
  }
}


exports.validateUpdateProduct = (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new ErrorHandler(400, "Invalid productId");
    }
    const schema = Joi.object({
      title: Joi.string(),
      stock: Joi.number(),
      discount: Joi.string(),
      image: Joi.string(),
      description: Joi.string(),
      manufacturer: Joi.string(),
      QRCode: Joi.string(),
      cost: Joi.number(),
      categoryId: Joi.string(),
      producerId: Joi.string(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  } catch (error) {
    next(error);
  }
}



exports.CreateProductValidator = (data) => {
  let schema = Joi.object({
    title: Joi.string().required(),
    stock: Joi.number().required(),
    discount: Joi.string(),
    image: Joi.object().required(),
    description: Joi.string().required(),
    manufacturer: Joi.string(),
    QRCode: Joi.string(),
    cost: Joi.number().required(),
    categoryId: Joi.string().required(),
    producerId: Joi.string().required(),
  });
  let result = schema.validate(data, { abortEarly: false });
  if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
  else return { errored: false, errors: null, value: result.value }
}

exports.UpdateProductValidator = (data) => {
  let schema = Joi.object({
    title: Joi.string(),
    stock: Joi.number(),
    discount: Joi.string(),
    description: Joi.string(),
    manufacturer: Joi.string(),
    QRCode: Joi.string(),
    cost: Joi.number(),
    categoryId: Joi.string(),
    producerId: Joi.string(),
  });
  let result = schema.validate(data, { abortEarly: false });
  if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
  else return { errored: false, errors: null, value: result.value }
}

exports.UpdateProductImage = (data) => {
  let schema = Joi.object({
    image: Joi.any().required(),
  }); 3
  let result = schema.validate(data, { abortEarly: false });
  if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
  else return { errored: false, errors: null, value: result.value }
}


