const { product,UserData,cart,admin} = require("../models/schema");

async function readData(user) {
  let data;
  try {
     data = await cart.findOne({ userId: user }).populate('products.productId'); 
    //  console.log("Data in read: ",data.products);
      if (!data) {
          console.log("No cart found for this user.");
          return [];
      }
      // const arr = data.products.map(ele => ({
      //     quantity: ele.quantity,
      //     product: ele.productId ,
      // }));
      console.log("data: ",data);
      return data;
  } catch (err) {
      console.error("Error reading user data", err);
      return [];
  }
}


async function writeData(user, newCartData) {
  try {
      let data = await cart.findOne({ userId: user });

      if (data) {
          data.products=newCartData;
          await data.save();
        } else {
          data = new cart({
            userId: user,
            products:newCartData,
           disable:false
          });
          await data.save();
      }
  } catch (err) {
      console.error("Error writing cart data:", err);
  }
}



async function update(user, rowId) {
  try {
    const arr = await readData(user);
    const newdata = arr.filter(e => e._id.toString() !== rowId);
    await writeData(user, newdata);
    return true;
  } catch (err) {
    console.error("Error updating cart data:", err);
    return false;
  }
}

module.exports = {
  readData,
  writeData,
  update,
};
