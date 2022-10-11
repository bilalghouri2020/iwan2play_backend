const { UserModel } = require("../models/users");
const crypto = require("crypto");

exports.createUser = async (object) => {
  try {
    const user = await new UserModel(object);
    await user.save();
    return user;
  } catch (error) {
    return null;
  }
}

exports.existingUserByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({ email: email }).lean().select("+password").exec();
    return user;
  } catch (error) {
    return null;
  }
}

exports.getUserById = async (id) => {
  try {
    const user = await UserModel.findById(id).lean().exec();
    return user;
  } catch (error) {
    return null;
  }
}

exports.updateLoginStatus = async (id) => {
  try {
    console.log("id...", id);
    const user = await UserModel.findOneAndUpdate({_id: id}, { haveAChild: true });
    console.log("update login status...", user);
    
    return user;
  } catch (error) {
    return null;
  }
}

exports.updateUserObj = async (_id, userObj) => {
  try {
    const user = await UserModel.findOneAndUpdate({ _id }, { $set: userObj }, { new: true }).lean().exec();
    return user;
  } catch (error) {
    return null;
  }
}

exports.passwordEncryption = (password) => {
  try {
    const algorithm = process.env.ENCRYPTION_ALGORITHM;
    const cipher = crypto.createHash(algorithm);
    const encrypted = cipher.update(password).digest("hex");
    return encrypted;
  } catch (error) {
    return error;
  }
}