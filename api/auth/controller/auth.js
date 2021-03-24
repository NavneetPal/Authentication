const jwt=require('jsonwebtoken');
const userModel=setup.models.user;
const {Op}=require('sequelize');
const bcrypt=require('bcrypt');
const ExpressError=require('../../../core/ExpressError');
// setup.functions[filename][functionName](param1,param2...paramN)
/* const ans=setup.functions["file1"]["mul"](3,4);
console.log(ans); */

module.exports={
    signup:async(req,res,next)=>{
        const {username,email,password}=req.body;
        try {
            await userModel.create({
                username:username,
                email:email,
                password:bcrypt.hashSync(password,10)
            })
        } catch (error) {
            return next(new ExpressError('Please fill out the required fields',400));
        }
    },
    signin:(req,res)=>{
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
                        notBefore:10,
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
    },
    signout:(req,res)=>{
        res.clearCookie("token");
        res.json({
            message: "User signout successfully"
          });
    },
    protected:(req,res)=>{
        res.json({
            message:`welcome to admin page ${req.user.username}`,
            data:"This page is only accessible to admin only"
        })
    }
}