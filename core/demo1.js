const fs=require('fs');
const path=require('path');
const basePath=path.join(__dirname,'..','functions');


let functions={};


const makeFunctions=(basePath)=>{
    const files=fs.readdirSync(basePath);
    files.forEach(file=>{
        let fileArray=file.split('.');
        //if its is a file
        if(fileArray.length==2){
            const fileName=fileArray[0];
            const {...func}=require(path.join(basePath,fileName));
            functions[fileName]={};
            for(let key in func){
                const method=require(path.join(basePath,fileName))[key];
                functions[fileName][key]=method;
            } 
        }else{ //if it is a folder
            const newPath=path.join(basePath,`${fileArray}`);
            makeFunctions(newPath);
        }
        
    }) 

}
//The base directory path fromn where you want to make them
makeFunctions(basePath)

console.log(functions);

/* setup.functions=functions;

module.exports=functions;  */
