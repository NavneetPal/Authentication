const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const directoryPath = path.join(__dirname, '../db/models');
var models = {};
try{
    fs.readdirSync(directoryPath).forEach(file => {
        if(file != 'index.js'){
            var tmp = file.split('.');
            tmp = tmp[0];
            models[tmp] = (require(path.join(__dirname,`../db/models/${file}`)))(setup.connection, Sequelize);
        }
      });  
}catch(err){
    throw (err);
}
setup.models = models;
module.exports = models;