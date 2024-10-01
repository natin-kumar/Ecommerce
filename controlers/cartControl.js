const {cart, UserData,product } = require("../models/schema");
const { jwt, secret } = require("../routes/common");

async function checkAmt(user){
  const data= await cart.findOne({ userId: user,disable:false });
  if(data.bill>0)
  {
   return true;
  }
  else
  return false;
 }

async function getCart(username){
    try {
        data = await cart.findOne({ userId: username,disable:false }).populate('products.productId'); 
        // console.log("data in cart: ",data);
        if(data)
        return data;
        else
        return [];
    } catch (err) {
        throw err;
    }
}
async function writeData(username, newCartData) {
    try {
        let data = await cart.findOne({ userId: username,disable:false });
  
        if (data) {
            data.products=newCartData;
            await data.save();
          } else {
            data = new cart({
              userId: username,
              products:newCartData
            });
            data.disable=false;
            await data.save();
        }
    } catch (err) {
        console.error("Error writing cart data:", err);
    }
  }
  async function addCart(id, username) {
    const cartData = await getCart(username); 
    let itemFound = false;
    let flag = false;
    let message = "";
    console.log(50,cartData);
    for (let ele of cartData.products) {
        if (ele.productId._id == id) {
            flag = true;
            const productData = await product.findOne({ _id: id });
            if (productData.quantity > ele.quantity) {
                ele.quantity++;
            } else {
                itemFound = true;
                message = "No more stock available!";
            }
            break; 
        }
    }

    // console.log("msg:", message);
    if (message.length > 0) {
        return message; 
    }

    if (!flag) {
        const productData = await product.findOne({ _id: id });
        if (productData.quantity > 0) {
            cartData.products.push({ quantity: 1, productId: id });
        } else {
            message = "No more stock available!";
            return message;
        }
    }

    await writeData(username, cartData.products);

    message = "successful";
    return message;
}

async function removeCart(user, rowId) {
    try {
      const arr = await getCart(user);
      const newdata = arr.products.filter(e => e._id.toString() !== rowId);
      await writeData(user, newdata);
      return true;
    } catch (err) {
      console.error("Error updating cart data:", err);
      return false;
    }
  }
async function changeQty(id,flag,username){
    try{
        const array = await getCart(username);
        let itemfound=0;
        let index=0;
        for (let ele of array.products) {
            if (ele._id == id) {
              if (flag == 1) {
                if (ele.productId.quantity > ele.quantity) {
                  ele.quantity++;
                } else {
                  itemfound = 1;
                  const message = "No more stock available!";
                  // console.log("mesg: ",message);
                  return { message, itemfound };
                }
              } else {
                if (ele.quantity > 1) {
                  ele.quantity--;
                } else {
                  // console.log("hii");
                  // console.log("a:  ",array);
                  array.products.splice(index, 1);
                }
              }
              break; 
            }
            index++;
          }
      
        await writeData(username, array.products);
        message="Successful";
        return {message,itemfound};
    }
    catch(err){
        throw err;
    }
}
async function calculateCartTotal(username) {
  try {
      const userCart = await cart.findOne({ userId: username,disable:false }).populate('products.productId');
      let total = 0;
      console.log("cart: ",userCart);
      if (userCart && userCart.products.length > 0) {
          total = userCart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
      }
      const updatedCart = await cart.findOneAndUpdate(
        { userId: username,disable:false },
        { $set: { bill: total } },
        { new: true, runValidators: true }
    );
      return updatedCart;
  } catch (err) {
      throw err;
  }
}
async function checkOut(username){
    try{
        const user= await UserData.findOne({
            email:username
          })
          const cartdata= await cart.findOne({
            userId:username,disable:false
          })
          const obj={
            username:user.name,
            mail:user.email,
            totalAmount:cartdata.bill
          }
          return obj;
    }
    catch(err){
        throw err;
    }
}
function userdata(token) {
  
      const decoded = jwt.verify(token, secret);
      console.log(decoded,"fsf");
      return ({person:decoded.person,username:decoded.username})
 
}
module.exports={getCart,userdata,checkAmt,addCart,removeCart,changeQty,checkOut,calculateCartTotal};