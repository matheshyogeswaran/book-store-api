import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";

export const register = async (req,res)=>{
  const {username,password} = req.body;

  const hashedPassword = await bcrypt.hash(password,10);

  const user = new User({
    username,
    password: hashedPassword
  });

  await user.save();

  res.send({message:"User registered"});
};

export const login = async (req,res)=>{
  const {username,password} = req.body;

  const user = await User.findOne({username});

  if(!user){
    return res.status(404).send({message:"User not found"});
  }

  const passwordValid = await bcrypt.compare(password,user.password);

  if(!passwordValid){
    return res.status(401).send({message:"Invalid password"});
  }

  const token = jwt.sign(
    {id:user._id},
    config.secret,
    {expiresIn:"1h"}
  );

  res.send({
    username:user.username,
    accessToken:token
  });
};