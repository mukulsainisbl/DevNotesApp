var jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");



const authMiddleware = async (req, res, next) => {


  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    var decoded = jwt.verify(token, process.env.SECRET_KEY)
    if(!decoded){
        return  res.status(401).json({ message: "Invalid token" });

    }
        const user = await UserModel.findById(decoded.id)
        req.user = user
        next()

  } catch (error) {
    res.status(401).json({Msg : "You are not valid user" , error})
  }
};

module.exports = authMiddleware
