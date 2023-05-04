const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.fing({ email });
    if (!user) {
      res.send("User already registered");
    } else {
      bcrypt.hash(password, 5, async (err, secured_pass) => {
        if (err) {
          res.send("Error whilehashing the password");
        } else {
          const newUser = new UserModel({
            name,
            email,
            password: secured_pass,
          });

          await newUser.save();
          res.send("User registered successfully");
        }
      });
    }
  } catch (error) {
    console.log("Error while registering the user", error);
  }

  userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.find({ email });

      if (!user) {
        res.send("user not found");
      } else {
        bcrypt.compare(password, secured_pass, async (err, result) => {
          if (result) {
            const otp = Math.round(Math.random() * 9999) + "";

            SendmailTransport({
              email: email,
              subject: "Login otp",
              body: otp,
            });

            const token = jwt.sign({ userId: user[0]._id }, "Dheeraj");
            res.send({ msg: "Login successful", token });
          } else {
            res.send("Error");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});
module.exports = {
  userRouter,
};
