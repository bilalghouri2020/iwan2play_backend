// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.jwtVerify = async (token) => {
  const userData = await jwt.verify(
    token,
    process.env.SECRET_KEY
  );
  return userData;
}