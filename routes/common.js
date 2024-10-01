const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const multer = require("multer");
const mongoose=require('mongoose');
const validator = require('validator');
const path=require('path');
const file=require('fs');
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/'); 
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}${path.extname(file.originalname)}`; 
      cb(null, fileName);
    }
  });
  const upload = multer({ storage: storage });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_secret_key",
    resave: true,
    saveUninitialized: true,
  })
);


module.exports = {
  app,
  router,
  express,
  session,
  cookieParser,
  jwt,
  bcrypt,
  nodemailer,
  secret: "mysecret",
  upload,
  file,
  path,
  validator,
  mongoose
};
