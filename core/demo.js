const { setupMaster } = require('cluster');
const fs=require('fs');
const path=require('path');
const basePath=path.join(__dirname,'..','functions');


let functions={};


const makeFunctions=(basePath,name)=>{
    const files=fs.readdirSync(basePath);
    files.forEach(file=>{
        let fileArray=file.split('.');
        //if its is a file
        if(fileArray.length==2){
            const fileName=fileArray[0];
            if(name){
                const {...func}=require(path.join(basePath,fileName));
                name[fileName]={}
                for(let key in func){
                    const method=require(path.join(basePath,fileName))[key];
                    name[fileName][key]=method;
                }  
            }else{
                const {...func}=require(path.join(basePath,fileName));
                functions[fileName]={};
                for(let key in func){
                    const method=require(path.join(basePath,fileName))[key];
                    functions[fileName][key]=method;
                }
            }
        }else{ //if it is a folder
            const newPath=path.join(basePath,`${fileArray}`);
            if(name){
                name[fileArray]={};
                makeFunctions(newPath,name[`${fileArray}`]);
            }else{
                functions[fileArray]={};
                makeFunctions(newPath,functions[`${fileArray}`]);
            }
        } 
    }) 
}
//The base directory path fromn where you want to make them
makeFunctions(basePath,"")

console.log(functions);

console.log(functions.folder.folder1.file4.getName('nakul'));
console.log(functions.folder.folder1.folder2.file6.getCollege('Government Engineering College Modasa'));


/* setup.functions=functions;

module.exports=functions;  */

/* const files=fs.readdirSync(basePath,{withFileTypes:true}).filter(dirent=>dirent.isFile()).map(file=>file.name)

console.log(files); */