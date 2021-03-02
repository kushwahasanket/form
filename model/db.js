var mongoose = require('mongoose')
  
  var Schema = mongoose.Schema;

  const form = new Schema({
      name: {
        type: String,
       
        min:3,
        max:50
      },
      img:
    {
        data: Buffer,
        contentType: String,
        url :String,
       
    },
    phone:  
    {
      type:String,
      
      min:10,
      
    },
    video:{
      type:String,

    },
    email:{
      type:String,
     
    }
      
  })
  module.exports = mongoose.model('Form', form);