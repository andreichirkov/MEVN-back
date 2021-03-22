const {model, Schema, Schema: {Types: {ObjectId}}} = require('mongoose')

//это модель в mongoose, в genericCrud попадет например это
const schema = new Schema({
  token: {
    type: String,
    default: ''
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
})

module.exports = model('Token', schema)