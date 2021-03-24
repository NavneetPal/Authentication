const fs=require('fs');
const path=require('path');

const basePath=path.join(__dirname,'../api');

const apis=fs.readdirSync(basePath,{withFileTypes:true})
.filter(dirent=>dirent.isDirectory())
.map(file=>file.name)

let services={};

apis.forEach(api=>{
    services[api]={};
    const files=fs.readdirSync(path.join(basePath,api,'services'));
    files.forEach(file=>{
        let fileName=file.split('.')[0];
        services[api][fileName]={}
        const {...func}=require(path.join(basePath,api,'services',fileName));
        for(let key in func){
            const method=require(path.join(basePath,api,'services',fileName))[key];
            services[api][fileName][key]=method;
        }
    })
})


setup.services=services;
module.exports=services;

//console.log(services["auth"]["address"]["getAddress"]());