const transporter = require('./transporter');
const {jwt, bcrypt, secret } = require("../routes/common");
const { UserData, cart, admin } = require("../models/schema");
async function getUser(mail){
    const existingUser = await UserData.findOne({ email: mail });
    if(existingUser)
    {
        return existingUser;
    }
}

async function createJWT(user,mail,pass,person){
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
    const payload = {
        username: mail,
        password: pass,
        person: person,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    return token;
    }
    return false;

}
async function updatePass(mail,pass){
    try{
    const hashedPassword = await bcrypt.hash(pass, 10);
    await UserData.updateOne(
      { email: mail },
      { $set: { password: hashedPassword } }
    );
    return { message: "Password Update Successful" };
}
    catch(err)
    {
        throw err;
    }
}
function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  
async function sendMail(mail) {
  const otp = generateOtp();
  
  const mailOptions = {
    from: 'natinkumar1161@gmail.com',
    to: mail,
    subject: 'OTP verification',
    text: `Thank you for signing up! This is your OTP: ${otp}. Please don't share it with anyone.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(otp)
    return otp;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}
async function verification(pass,user,mail,role){
    try{
    const hashedPassword = await bcrypt.hash(pass, 10);

    const cartData = new cart({
      userId: mail,
      disable:false
    });
    await cartData.save();
    const newUser = new UserData({
      name: user,
      email: mail,
      password: hashedPassword,
      role: role,
      cartId: cartData._id,
    });
    await newUser.save();
    return { message: "User registered successfully." }
}
    catch(err){
        throw err;
    }
}

module.exports={getUser,createJWT,updatePass,sendMail,verification}