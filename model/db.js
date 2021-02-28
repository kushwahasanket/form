var mongoose = require('mongoose')
  
  var Schema = mongoose.Schema;

  const form = new Schema({
      name: String,
      img:
    {
        data: Buffer,
        contentType: String,
        url :String
    }
      
  })
  module.exports = mongoose.model('Form', form);