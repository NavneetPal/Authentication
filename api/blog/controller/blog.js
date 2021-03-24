const multer = require("multer");

module.exports={
    showBlogs:(req,res)=>{
        res.send('All blogs will be here soon..wait for it');
    },
    showAll:(req,res,next)=>{
            res.send('Your all blogs are here friends');
    },
    createBlog:(req,res)=>{
       const upload=setup.upload.fields([{name:'image',maxCount:1},{name:'resume',maxCount:1}]);
       upload(req, res, function (err) {
            if(err instanceof multer.MulterError){
                res.json({
                    message:"error"
                })
            }
            else if (err) {
                res.json({
                    message:'Error Occured',
                    error:err
                })
            }
            res.json({
                message:"Information is submitted",
                body:req.body,
                files:req.files
            });
        })
      
    }
}


