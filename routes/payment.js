const { router} = require('./common');
const {toggle,authenticate,decodeData}=require('../middleware/middlewares')
const  { getUser, getCart, insufficientProduct, existingOrders, removeQty }= require('../controlers/payment.js')
router.post('/proceedPayment', authenticate,decodeData, async (req, res) => {
  try {
   
    
    const { add, paymentMethod } = req.body;


    const user = await getUser(req.decode);
    if (!user || !user.cartId) {
      return res.status(400).json({ message: "User or cart not found" });
    }

    const cartArray = await getCart(req.decode);
    if (cartArray === -1) {
      return res.status(400).json({ message: "Cart not found" });
    }

    const insufficientProducts = await insufficientProduct(cartArray);
    if (insufficientProducts) {
      return res.status(400).json(insufficientProducts);
    }

    await existingOrders(req.decode, add, paymentMethod, cartArray);
    await removeQty(req.decode, cartArray);

    res.status(200).json({ message: "Order processed successfully",redirected:true ,url:"/orders"});
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: "Error processing payment", error: error.message });
  }
});


module.exports = router;
