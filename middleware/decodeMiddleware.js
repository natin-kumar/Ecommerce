const { jwt, secret } = require("../routes/common");

function decodeData(req, res, next) {
    const token = req.cookies.userId;

    try {
        const decoded = jwt.verify(token, secret);
        req.decode = decoded.username;
        req.person=decoded.person;
        next();
    } catch (error) {
        res.redirect('/loginUser');
    }
}

module.exports = decodeData;
