var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // secure:true for port 465, secure:false for port 587
  // transportMethod: process.env.EMAIL_TRANSPORT,
  auth: {
    user: "bilal428899@gmail.com",
    pass: "kxzziwylfoskwtcr",
  },
});

module.exports = transporter;
