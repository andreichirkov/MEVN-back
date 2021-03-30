const genericCrud = require('./generic.controller')
const { Category } = require('../model')

//ключ для populate (в модели в категории есть ключ продуктс), 
//для разворачивания (теперь в ответе будет пустой массив продуктс)
const relations = {
  getAll: 'products',
  get: 'products'
}

module.exports = {  
  ...genericCrud(Category, relations)
}