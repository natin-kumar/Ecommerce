const { product, UserData, order, cart } = require("../models/schema");

async function getData(username) {
    const orderdata = await order.findOne({ userId: username }).populate('cartID');
    // console.log("order : ", orderdata);
    const cartData = [];

    if (orderdata) {
        const populatedCart = await cart.find({ userId: username, disable: true })
                                        .populate('products.productId');
        console.log("populatedCart: ", populatedCart);
        cartData.push(...populatedCart); 
    }
    // console.log("cartData: ", cartData);
    
    const fullData = orderdata ? {
        ...orderdata._doc,
        cartID: cartData
    } : { cartID: cartData };

    // console.log("Full Data: ", fullData);
    return fullData;
}

module.exports = { getData };
