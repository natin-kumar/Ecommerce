const { product,UserData,cart } = require("../models/schema");
async function updateProduct(obj){
    try{
        const { name, price, productNumber, color, size, quantity, id } = obj;
        const data = await product.findOneAndUpdate(
            { _id: id },
            {
              name: name,
              price: parseInt(price.substring(1)),
              productNumber: productNumber,
              color: color,
              size: size,
              quantity: quantity,
            },
            {
              new: true,
              useFindAndModify: false,
            }
          );
          return true;
    }
    catch(err){
        throw err;
    }
}
async function deleteProducts(id,username){
try{
   const result= await product.findOneAndUpdate(
      { _id: id },
      {
        disable:true,
      },
      { new: true, useFindAndModify: false }
    );
    const data = await UserData.findOne({ email:username });
    const newData=[];
    data.products.forEach((ele) => {
      if (ele.productId != id) {
        newData.push(ele);
      }
    });
    const adminresult=await UserData.findOneAndUpdate(
      { email: username },
      {
        products: newData,
      },
      { new: true, useFindAndModify: false }
    );
    const cartresult=await cart.updateMany(
      {}, 
      {
        $pull: { 
          products: { productId: id } 
        }
      }
    );
   return true;
  } catch (err) {
    throw err;
  }
}
async function addProduct(obj, path) {
  const { name, price, quantity, productNumber, color, size } = obj;
  try {
    const newProduct = new product({
      name: name,
      price: price,
      productNumber: productNumber,
      color: color,
      size: size,
      img: `images/${path}`,
      quantity: quantity,
      disable:false
    });
    const savedProduct = await newProduct.save();
    // console.log("saved :",savedProduct);
    return savedProduct._id; 
  } catch (err) {
    console.error("Error adding product: ", err);
    throw err; 
  }
}
async function getAdminData(user)
{
  try{
    const admindata = await UserData
      .findOne({ email: user })
      .populate('products.productId');
    return admindata;
  }
  catch(err){
    throw err;
  }
    
}
async function addProductToAdmin(user,productId){
 try{
  const data = await UserData.findOneAndUpdate(
    { email: user },
    { $push: { products: { productId: productId } } },
    { new: true, useFindAndModify: false }
  );
  console.log("data: ",data);
  
 }
 catch(err){
  console.log("error in adding data: ",err);
 }

}

module.exports={updateProduct,deleteProducts,addProduct,addProductToAdmin,getAdminData};