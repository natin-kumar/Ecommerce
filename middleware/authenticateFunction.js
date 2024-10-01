function authenticate(req, res, next) {
    try {
      if (!req.cookies.userId) {
        res.redirect("/loginUser");
        console.log("cookie: ", req.cookies.userId);
      } else {
        next();
      }
    } catch (err) {
      console.log("Error in Authentication: ", err);
      res.status(500).send("Internal Server Error");
    }
  }
module.exports=authenticate;