const path=require('path');
const {Sequelize}=require('sequelize');
const chalk=require('chalk');
const fs=require('fs');
const config=require('../config/database')[process.env.NODE_ENV];
const {databaselogs,consolelogs}=require('../config/config.json');
const {username,password,database,host,dialect}=config;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();
today = dd+ '-' + mm + '-' + yyyy;
const logStream = fs.createWriteStream(path.join(__dirname,'..','dblogs',`${today}.txt`), {'flags': 'a'});

const sequelizeConfig={
    host:host,
    dialect:dialect,
}
if(databaselogs || consolelogs){
    sequelizeConfig['logging']=msg =>{
        if(databaselogs){
            logStream.write(msg+'\n')
        }
         if(consolelogs){
            console.log(msg);
        }
        if(databaselogs && consolelogs){
            console.log(msg);
            logStream.write(msg+'\n')
        }
    } 
}else{
    sequelizeConfig['logging']=false;
}
const sequelize=new Sequelize(database,username,password,sequelizeConfig)


sequelize.authenticate()
.then(()=>{
    console.log(chalk.green('Database connected properly'));
})
.catch(err=>{
    console.log(`Database not connected properly bcz ${err.message}`)
})

sequelize.sync();

setup={connection:sequelize};

module.exports=sequelize;

