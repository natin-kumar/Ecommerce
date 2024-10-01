const { product } = require("../models/schema");
const {app,path}=require('../routes/common')
app.set("views", path.join(__dirname, "../views")); 
app.set("view engine", "ejs");
async function getHomepage(req, res) {
  try {
    const data = await product.find().limit(5);
    // if (data.length) {
      res.render("home", { products: data });
    // }
  } catch (err) {
    console.log("Error in fetching data: ", err);
    res.status(500).send("Internal Server Error");
  }
}
async function getMoreProducts(req, res) {
  try {
    let { counter } = req.body;
    counter = Math.floor(counter);
    const data = await product.find().skip(5 * counter).limit(5);
    const nextData = await product.find().skip(5 * (counter + 1)).limit(5);
    res.status(200).json({ data, nextData });
  } catch (err) {
    console.log("Error in fetching data for next: ", err);
    res.status(500).send("Internal Server Error");
  }
}
async function getPop(req, res) {
  try {
    const id = req.body.id;
    const data = await product.findById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.log("Error in fetching data for popup: ", err);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = { getHomepage, getMoreProducts, getPop };
