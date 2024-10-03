const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);

userRouter.post("/register", async (req, res) => {
  let { username, email, password, age, gender } = req.body;
  try {
    let checkUser = await userModel.findOne({ email });
    if (checkUser){
        return res.status(400).json({ message: "Email already exists" });
    }

    var hash = bcrypt.hashSync(password, salt);
    const user = new userModel({
      username,
      email,
      password: hash,
      gender,
      age,
    });

    await user.save();
    res.status(201).json({ msg: `${username} is register succesfully`, user });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});



userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email is not registered. Please try another email." });
    }

    // Use bcrypt.compare for async comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT token if password is valid
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    return res.status(200).json({ msg: "User logged in successfully", token });
    
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error });
  }
});


module.exports = userRouter;
