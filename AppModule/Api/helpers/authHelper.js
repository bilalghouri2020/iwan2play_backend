// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.jwtVerify = async (token) => {
  try {
    const userData = await jwt.verify(
      token,
      process.env.SECRET_KEY
    );
    return userData;
  } catch (error) {
    return {
      error
    }
  }
}