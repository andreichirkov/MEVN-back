const genericCrud = require('./generic.controller')
const { Product } = require('../model')

//все функции которые присутствуют generic.controller добавляются в этот объект
//СОЗДАЕМ НОВУЮ КОПИЮ ФУНКЦИЙ ЧТОБЫ НЕ ПИСАТЬ ЗАНОВО
//сюда можно написать свою функцию create(){} и она ПЕРЕЗАПИШЕТ основную
//сокращение кода 80lvl
module.exports = {
    ...genericCrud(Product)
}