function toggle(req,res,next)
{
    // console.log("toggle1");
    try{
        if(req.cookies.userId)
            req.toggleValue=0;
        else
            req.toggleValue=1;
            // console.log("toggle2");
    
         next();

    } 
    catch(err){
        throw Error(err);
    }
    //  console.log("toggle3");

}
module.exports=toggle;