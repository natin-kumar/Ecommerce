const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app=express();
const authenticateRoute=require('./routes/authenticate')
const homeroutes=require('./routes/homeRoutes');
const cartroutes=require('./routes/cartRoute');
const adminroutes=require('./routes/adminRoute');
const payment=require('./routes/payment.js');
const orderRoute=require('./routes/orderRoute')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://localhost:27017/Ecommerce')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });


app.use(express.json());

app.use(authenticateRoute);
app.use(homeroutes);
app.use(cartroutes);
app.use(adminroutes);
app.use(payment);
app.use(orderRoute)
app.get('*',(req,res)=>{
  res.redirect('/');
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
