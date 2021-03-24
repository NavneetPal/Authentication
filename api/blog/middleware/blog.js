module.exports={
    isNehaAdmin:(req,res,next)=>{
        if(req.user.email==="neha@gmail.com"){
            next();
        }else{
            return res.json({
                error:"This page is only for Neha admin Not for others"
            });
        }
    }
}