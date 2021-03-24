const expressJwt=require('express-jwt');

//Testing purpose
/* const path=require('path');
require('dotenv').config({path:path.join(__dirname,'../../../.env')}) */

module.exports={
    isSignedIn:expressJwt({
        secret:process.env.SECRET,
        algorithms:["HS256"],
    }),
    isAdmin:(req,res,next)=>{
        if(req.user.role==='0'){
            return res.json({
                error:"You are not admin"
            })
        }else{
            next();
        }
    }
}