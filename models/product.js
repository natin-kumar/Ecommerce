const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:String,
    price:Number,
    productNumber:String,
    color:String,
    size:String,
    img:String,
    quantity:Number,
    disable:Boolean
  });
  const product = mongoose.model('product', productSchema,'product');
  module.exports=product;