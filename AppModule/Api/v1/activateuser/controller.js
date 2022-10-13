const { isValidObjectId } = require("mongoose");
const { createActivationRecord, isExistAndUpdateActivatedUser, getAllUserFromLocation } = require("../../helpers/activationHelper");
const { createKidInfoDetails } = require("../../helpers/kidsInfoHelper");
const { updateLoginStatus } = require("../../helpers/userHelper");
// const { createProduct, updateProductObj, getProductById, toSlug, getAllProducts } = require("../../helpers/productHelper");
const { KidInfoModel } = require("../../models/kidInfo");
// const { ProductModel } = require("../../models/products");
const { CreateProductValidator, UpdateProductValidator, UpdateProductImage } = require("./middleware");

const activationController = {


  getAllUser: async (req, res, next) => {
    console.log("req.params...", req.query.lat);
    try {
      let record = await getAllUserFromLocation(req.query.lat, req.query.lng)
      console.log("record...", record);
      return res.json({
        status: 200,
        data: record
      })
    } catch (error) {
      console.log(error);
      return res.json({
        error
      })
    }
  },









  activate: async (req, res, next) => {
    try {
      const { userId, userData: { lat, lng } } = req.body
      let record = await isExistAndUpdateActivatedUser(userId, true, lat, lng)
      console.log('activate user...', record);
      return res.json({
        status: 201,
        data: record,
        activated: true
      })
    } catch (error) {
      console.log(error);
      return res.json({
        error
      })
    }
  },









  unActivate: async (req, res) => {
    const { userId } = req.body
    try {
      let record = await isExistAndUpdateActivatedUser(userId, false)
      console.log('activate user...', record);
      return res.json({
        status: 201,
        data: record,
        activated: false
      })
    } catch (error) {
      console.log(error);
      return res.json({
        error
      })
    }
  }, 

  addKidInfo: async (req, res, next) => {
    console.log('req.body from controller...', req.body);
    const {
      childName,
      childDOB,
      childGender,
      selectedLanguages,
      aboutMeAndMyChildText,
      iLikeToPlay,
      iCanMeet,
      myFavoriteActivities,
      userId,
      uploadedImageResult: {
        url
      },
    } = req.body.kidInfoData
    try {
      let obj = {
        userId,
        childName,
        childDOB,
        childGender,
        selectedLanguages,
        aboutMeAndMyChildText,
        iLikeToPlay,
        iCanMeet,
        myFavoriteActivities,
        childImage: url
      };
      try {
        const updatedData = await createKidInfoDetails(obj)
        if (updatedData._id) {
          const updateChildState = await updateLoginStatus(updatedData.userId)
          console.log('update child Status...', updateChildState);
        }

        console.log('ok hai ');
        return res.json({ status: 201, data: updatedData, updateChildState:updateChildState })

      } catch (error) {
        console.log("addKidInfo...", error);
        return res.json({ error })
      }
    } catch (error) {
      console.log("end error ...", error);
      return res.json({ error })
    }
  },
  addProduct: async (req, res, next) => {
    try {
      let obj = {
        title: req.body.title,
        slug: toSlug(req.body.title),
        image: req.body.image,
        stock: req.body.stock,
        discount: req.body.discount,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        QRCode: req.body.QRCode,
        cost: req.body.cost,
        categoryId: req.body.categoryId,
        producerId: req.body.producerId
      };
      const updatedData = await createProduct(obj);
      return res.status(201).json({
        data: updatedData,
      });
    } catch (error) {
      next(error)
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      let obj = {};
      if (req.body.title) {
        obj.title = req.body.title;
        obj.slug = toSlug(req.body.title);
      }
      if (req.body.stock) {
        obj.stock = req.body.stock;
      }
      if (req.body.discount) {
        obj.discount = req.body.discount;
      }
      if (req.body.image) {
        obj.image = req.body.image;
      }
      if (req.body.description) {
        obj.description = req.body.description;
      }
      if (req.body.manufacturer) {
        obj.manufacturer = req.body.manufacturer;
      }
      if (req.body.QRCode) {
        obj.QRCode = req.body.QRCode;
      }
      if (req.body.cost) {
        obj.cost = req.body.cost;
      }
      if (req.body.categoryId) {
        obj.categoryId = req.body.categoryId;
      }
      if (req.body.producerId) {
        obj.producerId = req.body.producerId;
      }
      const updatedData = await updateProductObj(req.params.id, obj);
      return res.status(200).json({
        data: updatedData,
      });
    } catch (error) {
      next(error)
    }
  },

  getProductById: async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        throw new ErrorHandler(400, "Invalid Id");
      }
      let data = await getProductById(req.params.id);
      if (!data) {
        throw new ErrorHandler(404, "Category not found.");
      }
      return res.status(200).json({
        data: data,
      });
    } catch (error) {
      next(error)
    }
  },

  getAllProducts: async (req, res, next) => {

    try {
      let data = await getAllProducts();
      if (!data) {
        throw new ErrorHandler(404, "Category not found.");
      }
      return res.status(200).json({
        data: data,
      });
    } catch (error) {
      next(error)
    }
  },


  deleteProductId: async (req, res) => {
    try {
      if (!req.params.id || !(isValidObjectId(req.params.id))) return res.status(400).send({ msg: "Provide valid id" });

      let data = await ProductModel.findByIdAndDelete({ _id: req.params.id });
      console.log
      if (!data) return res.status(404).send({ msg: "category not found" });

      return res.status(200).send({ msg: "succefully deleted" });


    } catch (error) {
      next(error)
    }

  },

  createProductBeta: async (req, res) => {
    try {
      let payload = { ...req.body };

      if (!req.files) return res.status(400).send({ msg: "Please send image" })

      payload.image = req.files[0]

      let validation = CreateProductValidator(payload);
      if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

      payload.slug = toSlug(payload.title);
      payload.isDeleted = false;

      let doc = await ProductModel.findOneAndUpdate({ title: payload.title }, { $set: payload }, { upsert: true, new: true })
      // let doc = await CategoryModel.create(payload)

      return res.status(201).send({ msg: "Product Created", doc })

    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "sth went wrong" })
    }
  },


  updateProductBeta: async (req, res, next) => {
    try {
      if (!req.params.id || !(isValidObjectId(req.params.id))) return res.status(400).send({ msg: "Provide valid id" });

      let payload = { ...req.body };

      let validation = UpdateProductValidator(payload);
      if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

      let data = await ProductModel.findByIdAndUpdate({ _id: req.params.id }, { $set: payload }, { new: true });
      if (!data) return res.status(404).send({ msg: "Nothing to be updated" });

      return res.status(200).send({ msg: "Update product", data })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Something went wrong" })
    }
  },


  updateImage: async (req, res, next) => {
    try {
      if (!req.params.id || !(isValidObjectId(req.params.id))) return res.status(400).send({ msg: "Provide valid id" });
      let payload = {}
      if (req.files && req.files.length) {
        payload.image = req.files[0]
      }

      let validation = UpdateProductImage(payload);
      if (validation.errored) return res.status(400).send({ msg: "Validation error", errors: validation.errors })

      let data = await ProducerModel.findByIdAndUpdate({ _id: req.params.id }, { $set: payload }, { new: true });
      if (!data) return res.status(404).send({ msg: "Nothing to be updated" });

      return res.status(200).send({ msg: "Update product image", data })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Something went wrong" })
    }
  }
}


module.exports = activationController;