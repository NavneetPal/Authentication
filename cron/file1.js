const cron=require('node-cron');

module.exports={
    writeHappy:()=>{
        cron.schedule('*/1 * * * *',()=>{
             console.log('I am Happy');
        }); 
    },
    writeCoder:()=>{
         console.log('Nodejs Developer')
    }
}