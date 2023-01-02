const jwt = require("jsonwebtoken");
const JWT_SECRET = "Harryisagoodb$oy";

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to the req object
    const token = req.header('auth-token');//send req with same auth-token
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);//verify token and get id from token using SECRET, using which we assigned token to user
        req.user = data.user
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }

}

module.exports = fetchuser;