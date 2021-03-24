
const fs=require('fs');
const path=require('path');

const basePath=path.join(__dirname,'..','cron')
console.log(basePath);
const files=fs.readdirSync(basePath,{withFileTypes:true})
.filter((dirent)=>dirent.isFile())
.map(dirent=>dirent.name)


const crons=[];

files.forEach(file=>{
    const {...func}=require(path.join(basePath,file));
    for(let key in func){
        crons.push(func[key]);
    }
})

module.exports=crons;