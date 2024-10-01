const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'natinkumar1161@gmail.com',
    pass: 'ihjvdsrhsugfibmc',
  },
});

module.exports = transporter;
