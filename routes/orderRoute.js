const { app,router,express, jwt, secret, upload } = require("./common");
const {toggle,authenticate,decodeData}=require('../middleware/middlewares')
const {getData}=require('../controlers/orderControl')
router.get('/orders',toggle,authenticate,decodeData,async (req,res)=>{
    const data= await getData(req.decode);

    console.log("data: ",data);
    let flag=req.toggleValue;
    const person=req.person;
    res.render("order",{orders:data,flag,person})
})
module.exports=router