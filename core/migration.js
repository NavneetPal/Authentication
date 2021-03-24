const Umzug=require('umzug');
const sequelize = require('./connection');
const path=require('path');


const umzug=new Umzug({
    storage:'sequelize',
    storageOptions:{
        sequelize:sequelize
    },
    migrations:{
        path:path.join(__dirname,'..','db','migrations'),
        params: [sequelize.getQueryInterface(),sequelize.constructor],
    }
});


module.exports=umzug;