import express from "express";
import { Router } from "express";
import cookieParser from "cookie-parser";

const app=express();
const router=Router();

app.use(express.json());
app.use(cookieParser());

const USER={
  username:"vijay",
  password:"anits369"
}

app.post("/login",(req,res)=>{
  const {username,password} = req.body;
  if(username===USER.username && password===USER.password){
    res.cookie('auth',username,{
      maxAge:60*60*1000,
      httpOnly:true,
      secure:false
    });
    return res.json({message:"Logined Successfully "});
  }
  return res.status(401).json({message:"Invalid Credentials"});
});

const authMiddleware=(req,res,next)=>{
      const user=req.body.username;
      if(!user){
        return res.status(401).json({message:"Unauthorized"});
      }
      next();
}

app.get('/dashboard',authMiddleware,(req,res)=>{
  res.json({message:`Welcome ${req.cookies.auth}`});
})

app.get('/logout',(req,res)=>{
  res.clearCookie('auth',{
    httpOnly:true
  });
  res.json({message:"Logged Out Successfully"})
})

const PORT= process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Running on PORT ${PORT}`);
})