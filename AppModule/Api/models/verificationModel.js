const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  email: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  
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

const VerifyUserModel = mongoose.model("verifyuser", userSchema);

exports.VerifyUserModel = VerifyUserModel;