const path=require('path');
const {Sequelize}=require('sequelize');
const chalk=require('chalk');
const config=require('../config/database')[process.env.NODE_ENV];
const {username,password,database,host,dialect}=config;

const sequelize=new Sequelize(database,username,password,{
    host:host,
    dialect:dialect
})

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

