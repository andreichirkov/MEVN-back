const {model, Schema, Schema: {Types: {ObjectId}}} = require('mongoose')

//это модель в mongoose, в genericCrud попадет например это
const schema = new Schema({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  products: [
    {
      type: ObjectId,
      ref: 'Product' //куда ссылаемся - референс
    }
  ]
})

module.exports = model('Category', schema)