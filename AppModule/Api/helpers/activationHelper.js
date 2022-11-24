const { KidInfoModel } = require("../models/kidInfo");
const multer = require("multer");
const { ActivatedUser } = require("../models/activateuser");
const { UserModel } = require("../models/users");


exports.getAllUserFromLocation = async (lat, lng) => {
  try {
    console.log(lat, lng);
    const users = await ActivatedUser.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "dist.calculated",
          maxDistance: 100000,
          query: { isActive: true },
          includeLocs: "dist.location",
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'kidsinfos',
          localField: 'userId',
          foreignField: 'userId',
          as: 'kidsInformation'
        }
      }

    ])

    // const users = await ActivatedUser.geoNear({ type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, { maxDistance: 100000, spherical: true })
    
    return users
    // let kidInfoData = await KidInfoModel.find({userId: users[0].userId})
    // console.log("infoData...", ki/dInfoData);
  } catch (error) {
    console.log("getting all user from geo location...", error);
    return null;
  }
}
exports.getAllUserFromLocationWithoutCoordinates = async () => {
  try {
    const users = await UserModel.aggregate([{
      $lookup: {
        from: 'kidsinfos',
        localField: '_id',
        foreignField: 'userId',
        as: 'kidsInformation'
      }
    }])
    // const users = await ActivatedUser.geoNear({ type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, { maxDistance: 100000, spherical: true })
    
    return users
    // let kidInfoData = await KidInfoModel.find({userId: users[0].userId})
    // console.log("infoData...", ki/dInfoData);
  } catch (error) {
    console.log("getting all user from geo location...", error);
    return null;
  }
}

exports.isExistAndUpdateActivatedUser = async (userid, isActive, lat = 0, lng = 0) => {
  try {
    const activatedUser = await ActivatedUser.findOneAndUpdate({ userId: userid }, {
      userid,
      isActive,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }, { new: true, upsert: true })
    return activatedUser
  } catch (error) {
    console.log("creating activated user record...", error);
    return null;
  }
}
exports.createActivationRecord = async (object) => {
  try {
    const activatedUser = new ActivatedUser(object)
    await activatedUser.save()
    return activatedUser
  } catch (error) {
    console.log("creating activated user record...", error);
    return null;
  }
}

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