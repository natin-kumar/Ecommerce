const toggle=require('./navbar');
const authenticate=require('./authenticateFunction');
const decodeData=require('./decodeMiddleware');
const adminAuth=require('./adminAuth');
const alreadyLogin=require('./alreadyLogin');
module.exports={toggle,authenticate,adminAuth,alreadyLogin,decodeData}