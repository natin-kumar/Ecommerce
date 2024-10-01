const mongoose = require('mongoose');
  const cartSchema=new mongoose.Schema({
    userId:String,
    products:[{
      productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
      quantity:Number,
    }],
    bill:Number,
    disable:Boolean
  })
  const cart=mongoose.model('cart',cartSchema,'cart');
module.exports=cart;