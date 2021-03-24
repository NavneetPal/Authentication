const multer=require('multer')
const fs=require('fs');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let dir=path.join(__dirname,'..','uploads');
      console.log(dir);
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+ file.originalname)
    }
  })
const upload=multer({storage:storage})
setup.upload=upload

module.exports=upload