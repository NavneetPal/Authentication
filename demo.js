/* const path=require('path')
const routes=require(path.join(__dirname,'api','blog','routes.json'))
console.log(routes);
routes.push({ path: '/new',
method: 'post',
action: 'blog.newBlog',
pathFromRoot: true });
console.log(routes); */

const path=require('path');
const fs=require('fs');
const controllerData=require(path.join(__dirname,'api','user','controller','user'));
const fileData=fs.readFileSync(path.join(__dirname,'api','user','controller','user.js'));

const signup=()=>{
    console.log('sigup sucessfully')
}
console.log(fileData.toString());
controllerData['signup']=signup
console.log(controllerData);
console.log(`Hello:${JSON.stringify(controllerData)}`);
console.log(`Hello:${controllerData}`);

/* const user={
    'name':'nakul'
}

console.log(`hii ${JSON.stringify(user)}`) */