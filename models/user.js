const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role:String,
    products:[
      {
        productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
        quantity:Number,
      }
    ],
    cartId: {type:mongoose.Schema.Types.ObjectID,ref:'cart'}
    
  });
  const UserData = mongoose.model('UserData', userSchema,'UserData');
  module.exports=UserData;