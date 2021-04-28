var mongoose = require('mongoose')
  
  var Schema = mongoose.Schema;

  const login = new Schema({
      email:{
          type:String, 
          
          unique:true
      },
      password:{
          type:String
      }
  })
      
  module.exports = mongoose.model('Login', login);