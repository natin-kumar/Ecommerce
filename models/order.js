const mongoose = require('mongoose');
const orderSchema=new mongoose.Schema({
    userId:String,
    cartID:[{
        cartid:{type:mongoose.Schema.Types.ObjectId,ref:'cart'}
    }],
    details:[{
        address:String,
        status:String,
        time:Date,
        paymentMethod:String
    }]
});
const order=mongoose.model('order',orderSchema,'order');
module.exports=order;