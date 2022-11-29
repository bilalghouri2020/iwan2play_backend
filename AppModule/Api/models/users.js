const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    select: false
  },
  isGoogle: {
    type: Boolean,
    required: true
  },
  GoogleId: {
    type: String,
  },
  isFacebook: {
    type: Boolean,
    required: true
  },
  haveAChild: {
    type: Boolean,
    required: true
  },
  verification: {
    type: Boolean,
    required: true
  }
  // userRole: {
  //   type: String,
  //   default: "user",
  //   select: false
  // },
  // forgetPasswordToken: {
  //   type: String,
  //   select: false
  // },
  // tokenExpiryTime: {
  //   type: String,
  //   select: false
  // },
  // isDeactive: {
  //   type: Boolean,
  //   default: false
  // },
  // producer_type: {
    
  // }
},
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);

exports.UserModel = UserModel;