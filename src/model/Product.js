//ObjectId помогает объявить один объект внутри другого
//model - функция mongoose
const {model, Schema, Schema: {Types: {ObjectId}}} = require('mongoose')

//данные которые наследуются от Schema от большого класса mongoose
const schema = new Schema({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: ''
  },
  amount: {
    type: Number,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  category: {
    type: ObjectId,
    ref: 'Category' //куда ссылаемся - референс
  }
})

module.exports = model('Product', schema)