const { KidInfoModel } = require("../models/kidInfo");
const multer = require("multer");


exports.createKidInfoDetails = async (object) => {
  try {
    const kidInfo = new KidInfoModel(object);
    await kidInfo.save();
    return kidInfo;
  } catch (error) {
    return null;
  }
}

exports.getProductById = async (id) => {
  try {
    const product = await ProductModel.findById(id).lean().exec();
    return product;
  } catch (error) {
    return null;
  }
}

exports.getAllProducts = async (id) => {
  try {
    const products = await ProductModel.find().lean().exec();

    return products;
  } catch (error) {
    return null;
  }
}

exports.updateProductObj = async (_id, obj) => {
  try {
    const product = await ProductModel.findOneAndUpdate({ _id }, { $set: obj }, { new: true }).lean().exec();
    return product;
  } catch (error) {
    return null;
  }
}

exports.toSlug = (text) => {
  return text.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}