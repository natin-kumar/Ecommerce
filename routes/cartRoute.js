const { app,router, jwt, secret} = require('./common');
const {toggle,authenticate,decodeData}=require('../middleware/middlewares')
const {getCart,userdata,checkAmt,addCart,removeCart,changeQty,checkOut,calculateCartTotal}= require('../controlers/cartControl');
router.get("/cart", authenticate,toggle,decodeData, async (req, res) => {
    try {
      let flag=req.toggleValue;
      let person=req.person;
      if (person == "admin") {
        let data = "Cart option is not available for Admin!";
        return res.render("cart", { message: data, cartItems: [],flag,person});
      }
      const array = await getCart(req.decode);
      console.log("array: ",array);
      res.render("cart", { message: null, cartItems: array.products,flag,disable:array.disable,person});
    } catch (err) {
      console.log("Error in fetching cart data: ", err);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/Addcart", async (req, res) => {
    try {
      if(!req.cookies.userId)
      {
       return res.status(200).json({message:"login",url:"/loginUser"})
      }
      else
      {
      const { id } = req.body;
      // console.log(req.cookies.userId)
      const {person,username}= await userdata(req.cookies.userId);
      if(person=="admin")
      {
        return res.json({message:"This option is not available for admin!"});
      }
      console.log(person,username);
      const result= await addCart(id,username);
      console.log("res: ",result)
      res.status(200).json( {message:result} );
    }
    } catch (err) {
      console.log("Error in Adding cart:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  
  router.post("/removeItem", authenticate,decodeData, async (req, res) => {
    try {
      const id = req.body.id;
     
      if (await removeCart(req.decode, id)) {
        res.status(200).json({ message: "Successful" });
      } else {
        res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (err) {
      console.log("Error in removing item from cart: ", err);
      res.status(500).send("Internal Server Error");
    }
  });
  
  router.post("/changeQty", authenticate,decodeData, async (req, res) => {
    try {
      const { qty, id, flag } = req.body;
      const {message}= await changeQty(id,flag,req.decode)
      res.status(200).json({ message });
    } catch (err) {
      console.log("Error in changing quantity: ", err);
      res.status(500).send("Internal Server Error");
    }
  });
 
  router.post('/updateAmount',decodeData, async (req, res) => {
    try {
        const { id } = req.body;
       
        
        const updatedCart = await calculateCartTotal(req.decode);

        // console.log("updated: ", updatedCart);
        res.status(200).json({ message: "Update successful", cart: updatedCart });
    } catch (err) {
        console.error("Error updating cart amount:", err.message);
        res.status(500).json({ message: "An error occurred while updating the cart." });
    }
});
router.get('/checkout',authenticate,toggle,decodeData,async(req,res)=>{
    try{
      // console.log('hii')
      const result= await checkAmt(req.decode)
      if(!result)
      {
          res.redirect('/');
        }
      let flag=req.toggleValue;
      const obj= await checkOut(req.decode);
      obj.flag=flag;
      obj.person=req.person
      res.render('checkout',obj);

    }
    catch(err){
      res.status(500).json({ message: "Error processing payment", error: error.message });
    }
  })
module.exports=router;