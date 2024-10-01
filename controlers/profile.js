const jwt = require("jsonwebtoken");
const { UserData, admin } = require("../models/schema");
const { secret } = require("../routes/common");
async function getProfile(req, res) {
  try {
    const token = req.cookies.userId;
    const decode = jwt.verify(token, secret); 
    if (decode.person === 0) {
      const user = await UserData.findOne({ email: decode.username }); // Find user data
      res.render("profile", { user: user });
    } else if (decode.person === 1) {
      const admindata = await admin
        .findOne({ mail: decode.username })
        .populate("products.productId"); 
      res.render("adminProfile", { admin: admindata });
    }
  } catch (err) {
    console.log("Error in fetching profile data: ", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getProfile
};
