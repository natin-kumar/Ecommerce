const { app,validator} = require("./common");
const {toggle,alreadyLogin}=require('../middleware/middlewares')
const {getUser,createJWT,updatePass,sendMail,verification}=require('../controlers/authenticationControl')
app.get("/resend",alreadyLogin, async (req, res) => {
  try {
    const otp = await sendMail(req.session.mail);
    req.session.otp = otp;
    res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ message: "Error resending OTP." });
  }
});
app.get("/loginUser",toggle,alreadyLogin, (req, res) => {
  let flag=req.toggleValue;
  let person="user";
  res.render("login", { flag,person });
});
app.post("/signup", async (req, res) => {
  const { user, mail, pass } = req.body;
  console.log(mail,pass)
  try {
    if (!validator.isEmail(mail)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const number = "1234567890";
    const symbol = "@#$%^&*()/>.<\\";

    const containsUpper = [...upper].some(char => pass.includes(char));
    const containsLower = [...lower].some(char => pass.includes(char));
    const containsNumber = [...number].some(char => pass.includes(char));
    const containsSymbol = [...symbol].some(char => pass.includes(char));

    if (!containsUpper || !containsLower || !containsNumber || !containsSymbol || pass.length < 6) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.' });
    }
    let exitingUser=await getUser(mail);
    console.log(exitingUser)
    if (exitingUser) {
      return res.status(200).json({ message: "Already exists." });
    }
    const otp = await sendMail(mail);
    console.log(otp);
    req.session.otp = otp;
    req.session.mail = mail;
    req.session.user = user;
    req.session.pass = pass;
    console.log(otp)
    res.status(200).json({ message: "Signup successful, please verify OTP." });
  } catch (error) {
    console.error("Error during signup process:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
app.post("/verifyOTP", async (req, res) => {
  const { otp } = req.body;
  const storedOtp = req.session.otp;
  if (parseInt(otp) != storedOtp) {
    return res.status(200).json({ message: "OTP not matched!" });
  }
  try {
    const message=await verification(req.session.pass,req.session.user,req.session.mail,"user")
    req.session.otp = null;
    req.session.user = null;
    req.session.mail = null;
    req.session.pass = null;
    req.session.destroy();
    return res.status(200).json(message)
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user." });
  }
});
app.get("/logout", (req, res) => {
  try {
    res.clearCookie("userId");
    res.redirect("/loginUser");
  } catch (err) {
    console.log("Error in logout Server: ", err);
  }
});
app.post("/loginUser", async (req, res) => {
  const { mail, pass, person } = req.body;
  try{
    const user=await getUser(mail);
    if(!user)
    {
      return res
            .status(200)
            .json({
              message: "User not found. Please sign up first.",
              url: "/signup",
            });
    }
    if ((person == "admin" && user.role == "user") ||(person == "user" && user.role == "admin")) {
          return res
            .status(404)
            .json({
              message: "Please Select correct person type",
              url: "/loginUser",
            });
        }
       const token= await createJWT(user,mail,pass,person)
       if(token==false)
       {
        return res
        .status(200)
        .json({
          message: "Invalid Password",
          url: "/signup",
        });
       }
       res.cookie("userId", token, { maxAge: 6000000, httpOnly: true });
       const redirectUrl = person == "user" ? "/profile" : "/adminProfile";
       return res.status(200).json({ redirected: true, url: redirectUrl });
  }
  catch (error) {
    console.error("Error during login process:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/admin/logout", (req, res) => {
  try {
    res.clearCookie("userId");
    res.redirect("/loginUser");
  } catch (err) {
    console.log("Error in logout Server: ", err);
  }
});
app.get("/signup",toggle,alreadyLogin, (req, res) => {
  let flag=req.toggleValue;
  let person="user";
  res.render("signup", { flag,person });
});
app.get("/verifyOTP",alreadyLogin,toggle,(req, res) => {
  let flag=req.toggleValue;
  let person="user";
  res.render("otp", { flag,person });
});
app.get("/forgetPass",alreadyLogin,toggle, (req, res) => {
  let flag=req.toggleValue;
  let person="user";

  res.render("forgetPass", { flag ,person});
});
app.post("/forgetPass", async (req, res) => {
  try {
    const userdata = await getUser(req.body.mail);
    if (!userdata) {
      return res
        .status(200)
        .json({ message: "User not found. Please sign up first." });
    }
    req.session.otp = await sendMail(req.body.mail);
    req.session.mail = req.body.mail;
    return res.status(200).json({ message: "successful" });
  } catch (err) {
    console.log("Error in post req of forget pass: ", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});
app.get("/resetPass",alreadyLogin,toggle, async (req, res) => {
  let flag=req.toggleValue;
  let person="user";

  res.render("resetPass", { flag,person });
});
app.post("/resetPass", async (req, res) => {
  try {
    const mail = req.session.mail;
    const newPass = req.body.password;
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const number = "1234567890";
    const symbol = "@#$%^&*()/>.<\\";

    const containsUpper = [...upper].some(char => newPass.includes(char));
    const containsLower = [...lower].some(char => newPass.includes(char));
    const containsNumber = [...number].some(char => newPass.includes(char));
    const containsSymbol = [...symbol].some(char => newPass.includes(char));

    if (!containsUpper || !containsLower || !containsNumber || !containsSymbol || newPass.length < 6) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.' });
    }
    const message=await updatePass(mail,newPass);
    return res.status(200).json(message);
  } catch (err) {
    console.log("Error in post req of reset pass: ", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/verifyNewPass", (req, res) => {
  try {
    const otp = req.body.otp;
    console.log("OTP in body: ", otp);
    if (otp == req.session.otp) {
      return res.status(200).json({ message: "verified" });
    }
    return res.status(200).json({ message: "Invalid OTP." });
  } catch (err) {
    console.log("Error in post req of verifyNewPass : ", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});
module.exports = app;
