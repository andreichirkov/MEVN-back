require('dotenv').config()
const jwt = require('jsonwebtoken')
const { User } = require('../model')

module.exports = {
  //req первый аргумент, из бади берем узер и пасс
  async login({ body: { email, password } }, res) {
    try {
      //хранить пароль в базе данных не верно
      const foundUser = await User.findOne({ email })
      
      if(!foundUser) {
        return res.status(403).send({
          message: 'Логин или пароль не подходит 1',
          err
        })
      }

      //расшифровываем пароль из БД, сравнивем
      const isPasswordCorrect = foundUser.password === password

      if (!isPasswordCorrect) {
        return res.status(403).send({
          message: 'Логин или пароль не подходит 2',
          err
        })
      }

      //то должны создать токен и подписать и зашифруем туда эти данные
      const accessToken = jwt.sign({
        userId: foundUser._id,
        email: foundUser.email
      }, process.env.JWT_SECRET)

      return res.status(200).send({
        accessToken,
        email: foundUser.email
      })
    } catch(err) {
      //запрещенный доступ нет авторизации
      return res.status(403).send({
        message: 'Логин или пароль не подходит 5',
        err
      })
    }
  },

  async signUp({ body: { email, password } }, res) {
    try {
      //хранить пароль в базе данных не верно
      const foundUser = await User.findOne({ email, password })
      if(foundUser) {
        return res.status(403).send({
          message: 'Данный email занят',
          err
        })
      }
      const createdUser = await new User({ email, password })
      await createdUser.save()

      return res.status(200).send({
        message: 'Пользователь создан'
      })
      //сделать email об удачной регистрации
    } catch(err) {
      //запрещенный доступ нет авторизации
      return res.status(403).send({
        message: 'Логин или пароль не подходит',
        err
      })
    }
  } 
}