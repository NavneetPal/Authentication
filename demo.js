require('dotenv').config();
global.setup={};
const umzug=require('./core/migration');
require('./core/models');
require('./core/function');
require('./core/services');
const express=require('express');
const app=express();
const chalk=require('chalk');
const Confirm=require('prompt-confirm');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const authRoutes=require('./routes/auth');
const routes=require('./core/routes');
const fp=require('find-free-port');
const ExpressError = require('./core/ExpressError');

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());

function wrapAsync(fn){
    return function(req,res,next){
        console.log(req);
        fn(req,res,next).catch(e=>next(new ExpressError(err.message,err.status,req.path)))
    }
}
//Routes
for(let route of routes){
    app[route.method](route.path,route.middlewares,wrapAsync(route.action));
}

//migration
umzug.pending()
.then(migrations=>{
    if(migrations.length!=0){
        console.log(`All pending migrations are`);
        for(let migration of migrations){
            console.log(chalk.yellow(migration.file));
        }
        new Confirm('Do you want to migrate all the pending migrations (yes)?')
        .run()
        .then(answer=>{
            if(answer){
                umzug.up()
                .then(()=>{
                    console.log(chalk.green('Migration completed!'));
                    listenServer()
                })
            }
        })
    }else{
        console.log(chalk.green('No pending migrations'));
            listenServer();
    }
})



//Express Error Handling Middleware
app.use((err,req,res,next)=>{
    console.log(err);
    const {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).json({
        error:message,
        path:err.path
    })
})

//my server
let PORT=parseInt(process.env.PORT);
process.on('uncaughtException', (error) => {
    if (error.code === 'EADDRINUSE') {
        fp(PORT).then(([freep]) => {
            new Confirm(`Port no ${PORT} is busy.Do you want to run it on the avalibale port (${freep})?`)
            .run()
            .then(answer=>{
                if(answer){
                    PORT=parseInt(freep);
                    listenServer(); 
                }
            })
        })
        /* console.log(`${PORT} already in use want to use ${freeport}`)
        PORT=parseInt(freeport); */
       // listenServer(); 
    }
})  
function listenServer(){
   app.listen(PORT,()=>{
        console.log(chalk.green(`server is listenining on port ${PORT}`));
    })     
}



