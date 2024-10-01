const { app,router,express, upload } = require("./common");

const {updateProduct,deleteProducts,addProduct,addProductToAdmin,getAdminData}=require('../controlers/admincontrols');

const {toggle,authenticate,adminAuth,decodeData}=require('../middleware/middlewares')


router.get("/adminProfile",authenticate,adminAuth,toggle,decodeData, async (req, res) => {
  
  const admindata=await getAdminData(req.decode);
  console.log(admindata);
  let flag=req.toggleValue;
  const person=req.person;
  res.render("adminProfile", { admin: admindata,flag,person });
});

router.get("/admin/add-product",authenticate,adminAuth,toggle,decodeData, (req, res) => {
  let flag=req.toggleValue;
  const person=req.person;
  res.render("product",{flag,person});
});

app.use(express.urlencoded({ extended: true }));

router.post("/admin/add-product", upload.single("image"),decodeData, async (req, res) => {
  const image = req.file;
  const productId = await addProduct(req.body, image.filename);
  if (productId) {
   
    addProductToAdmin(req.decode, productId);
  }
  res.status(200).json({ message: "Successful" });
});
router.delete("/admin/delete/product",decodeData,adminAuth, async (req, res) => {
  try {
    const { id } = req.body;
   
     if(await deleteProducts(id,req.decode))
     {
      res.status(200).json({ message: "successful" });
     }
  }
  catch(err){
    res.status(200).json({ meassage: err });
  }
});
router.patch("/admin/update/product",decodeData,adminAuth, async (req, res) => {
  try{
    const obj=req.body;
    if(await updateProduct(obj))
    {
      res.status(200).json({ message: "successful" });
    } 
  }
  catch(err){
    res.send(err);
  }
})
module.exports = router;
