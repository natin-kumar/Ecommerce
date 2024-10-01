const { product, cart, order, UserData } = require("../models/schema");



async function getUser(username) {
  const user = await UserData.findOne({ email: username });
  return user;
}

async function getCart(user) {
  const cartArray = await cart.findOne({ userId: user,disable:false });
  return cartArray || -1;
}

async function insufficientProduct(cartArray) {
  const insufficientProducts = [];
  for (let item of cartArray.products) {
    const productData = await product.findOne({_id:item.productId});
    if (productData.quantity < item.quantity) {
      insufficientProducts.push({ product: productData.name, available: productData.quantity, requested: item.quantity });
    }
  }

  if (insufficientProducts.length > 0) {
    await cart.findByIdAndUpdate(cartArray._id, { disable: true });
    return {
      message: "Some products have insufficient quantity",
      insufficientProducts: insufficientProducts
    };
  }
  return null; 
}

async function existingOrders(username, add, paymentMethod, cartArray) {
  let existingOrder = await order.findOne({ userId: username });
  if (!existingOrder) {
    existingOrder = new order({
      userId: username,
      cartID: [],
      details: []
    });
  }

  existingOrder.details.push({
    address: add,
    status: "Success",
    time: new Date(),
    paymentMethod: paymentMethod
  });

  existingOrder.cartID.push({ cartid: cartArray._id });

  const savedOrder = await existingOrder.save();
  console.log('Order saved successfully:', savedOrder);
}

async function removeQty(user, cartArray) {
  for (let item of cartArray.products) {
    await product.findOneAndUpdate({_id: item.productId}, {
      $inc: { quantity: -item.quantity }
    });
  }
   console.log("username: ",user);
  const oldCart = await cart.findOne({ userId: user, disable: false });
  if (oldCart) {
    await cart.findOneAndUpdate({userId:user,disable:false}, { disable: true });
    // console.log('Old cart disabled:', oldCart);
  } else {
    console.log('No existing cart found to disable.');
  }

  const newCart = new cart({
    userId: user,
    products: [],
    disable: false
  });

  const savedNewCart = await newCart.save();
  if (savedNewCart) {
    console.log('New cart created and saved:', savedNewCart);
    const userdata = await UserData.findOneAndUpdate({ email: user }, {
      cartId: savedNewCart._id
    }, { new: true });
    console.log('User cart ID updated:', userdata.cartId);
  } else {
    console.log('Failed to create and save new cart.');
  }
}


module.exports = { getUser,getCart, insufficientProduct, existingOrders, removeQty };

