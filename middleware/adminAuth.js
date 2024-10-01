const { jwt, secret } = require("../routes/common");
function adminAuth(req, res, next) {
    const token = req.cookies.userId;
    try {
        const decoded = jwt.verify(token, secret);
        if(decoded.person=="admin")
        next();
        else
        res.redirect('/');
    } catch (error) {
        res.redirect('/loginUser');
    }
}

module.exports = adminAuth;
