require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const http = require('http')
const cors = require('cors')
const { routes } = require('./src/routes')

//Насткойка подключения к БД
// mongoose.connect("mongodb://localhost:27017/mevnshop", {
mongoose.connect(process.env.DATABASE_URL , {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//Инициализация приложения
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//лайвхак как объявить все роуты
routes.forEach(item => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`))
});

//Объявление роутов
const PORT = 3000
http.createServer({}, app).listen(PORT)
console.log(`server run port ${PORT}`)
