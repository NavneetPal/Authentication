const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const userModel=require('../db/models').User;
const {Op}=require('sequelize');
const expressJwt=require('express-jwt');
const bcrypt=require('bcrypt');



router.get('/validate',(req,res)=>{
    const token=req.cookies.token;
    if(token){
        jwt.verify(token,process.env.SECRET,(err,data)=>{
            if(data){
                req.student=data;
                res.json({
                    message:data
                })
              }else{
                return res.json({
                    data:err,
                    message:"Token is not valid"
                })
            }
        })
    }else{
        res.json({
            err:"User is not signed In"
        })
    }
})

router.post('/signup',async(req,res)=>{
    const {username,email,password}=req.body;
    try {
        await userModel.create({
            username:username,
            email:email,
            password:bcrypt.hashSync(password,10)
        })
    } catch (error) {
        res.json({
            err:error.message
        })
    }
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
   userModel.findOne({
        where:{
            email:{
                [Op.eq]:email
            }
        }
    }).then(user=>{
        if(user){
            if(bcrypt.compareSync(password,user.password)){
                //create token
                const token=jwt.sign({
                    username:user.username,
                    email:user.email,
                    role:user.role,
                    id:user.id
                },process.env.SECRET,{
                    expiresIn:"2 days",
                    notBefore:30,
                    algorithm:"HS256"
                });
                //put them in cookie
                res.cookie("token",token);
    
                res.json({
                    token:token,
                    username:user.username
                })
            }else{
                res.json({
                    message:"Incorrect Password"
                })
            }
        }else{
            res.json({
                message:"User with the email doesn't exist"
            });
        }
    })
    .catch(err=>{
        res.json({
            error:err
        })
    })
})

router.get('/signout',(req,res)=>{
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
      });
})

router.get('/add',(req,res)=>{
    res.send('hello');
})


router.get('/posts',
expressJwt({
    secret:process.env.SECRET,
    algorithms:["HS256"],
}),
(req,res)=>{
    res.json(req.user);
})





module.exports=router;