const {UserData,product} = require("../models/schema");
const {jwt,secret}=require("../routes/common")
async function getmore(counter)
{
    try {
    counter = Math.floor(counter);
    const data = await product
      .find({disable:false})
      .skip(5 * counter)
      .limit(5);
    const nextdata = await product
      .find({disable:false})
      .skip(5 * (counter+1))
      .limit(5);
    return {data,nextdata}
  } catch (err) {
    throw err;
  }
}
async function initial(){
    try {
        const data = await product.find({disable:false}).limit(10);
        // console.log("data:",data);
        return data
      } catch (err) {
        console.log("Error in fetching data: ", err);
        throw err;
      }
}
async function popup(id){
    try {
        const data = await product.findById(id);
        return data;
      } catch (err) {
        throw err;
      }
}
async function profile(username,person){
    try {
        if(person=="user")
        {
            const user = await UserData.findOne({ email: username });
            return user;
        }
        else
        {
          const admindata = await UserData.findOne({ email: username })
          .populate("products.productId");
          return admindata;
        }
      } catch (err) {
        throw err;
      }
}
function userRole(req){
  const token = req.cookies.userId;

  try {
      const decoded = jwt.verify(token, secret);
      return(decoded.person);
      
  } catch (error) {
      console.log(error)
  }
}

module.exports={getmore,initial,userRole,popup,profile};