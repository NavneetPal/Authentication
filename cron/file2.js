const cron=require('node-cron');

module.exports={
    writeBook:()=>{
         console.log('I  write books');
    },
    writeBlog:()=>{
       console.log('I write Blogs')
    }
}