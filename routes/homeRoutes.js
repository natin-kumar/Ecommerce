const {router} = require('./common');
const {toggle,authenticate,decodeData}=require('../middleware/middlewares')
const {getmore,initial,userRole,popup,profile}=require('../controlers/homeProducts');
// app.use(decodeData);
router.post("/getmore", async (req, res) => {
  const {counter}=req.body;
  try{
    const {data,nextdata}= await getmore(counter);
    // console.log("data: ",data);
    res.status(200).json({data,nextdata});
  }
  catch(err)
  {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/",toggle, async (req, res) => {
  // console.log("hiii 23");
  try{
    let flag=req.toggleValue;
    const data= await initial();
    let person;
    if(req.cookies.userId)
    {  
      person=userRole(req);
    }
    res.render("home", { products: data ,flag,person});
  }
  catch(err){
    res.status(500).send("Internal Server Error");
  }
});
router.get('/about',(req,res)=>{
  try{
    let flag=req.toggleValue;
    let person;
    if(req.cookies.userId)
    {  
      person=userRole(req);
    }
    res.render("about", { flag,person});
  }
  catch(err){
    res.status(500).send("Internal Server Error");
  }
})
router.post("/popup", async (req, res) => {
  try{
    const id = req.body.id;
    const data= await popup(id);
    res.status(200).json(data);
  }
  catch(err){
    res.send(err);
  }
});
router.get("/profile",toggle, authenticate,decodeData, async (req, res) => {
  try{
    let flag=req.toggleValue;
    const data= await profile(req.decode,req.person);
    person=req.person;
    if(req.person=="user")
    {
      res.render("profile", { user: data,flag,person });
    }
    else
    {
      // res.render("adminProfile",{admin:data,flag})
      res.redirect('/adminProfile')
    }
  }
  catch(err)
  {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
