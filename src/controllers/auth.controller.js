require('dotenv').config()
const jwt = require('jsonwebtoken')
//импортируем схемы
const { User, Token } = require('../model')

const ACCESS_TOKEN_LIFE = '60m'

module.exports = {
  //логаут нужно делать, чтобы если кто то украл один токен,
  //не смог им воспользоваться, нужно 2 (делается по userId)
  async logout({ body: {refreshToken} }, res) {
    //удаляем этот рефрешТокен (из базы)
    const foundToken = await Token.findOne({ token: refreshToken })

    if (!foundToken) {
      return res.status(403).send({
        message: 'Пользователь не авторизован'
      })
    }

    await Token.findByIdAndDelete(foundToken._id)
    
    return res.status(200).send({
      message: 'Вы разлогинены'
    })
  },


  //сначала достаем из body рефрешТокен
  async refreshToken({ body: {refreshToken} }, res) {
    if (!refreshToken) {
      return res.status(403).send({
        message: 'Действие запрещено 1'
      })
    }

    //при логине создается рефрешТокен и сохраняется в базу
    //проверка есть ли он, и сможет ли он обновить аксессТокен
    const currentToken = await Token.findOne({ token: refreshToken })
    
    //если есть то продолжаем или если нету
    if (!currentToken) {
      return res.status(403).send({
        message: 'Действие запрещено 2'
      })
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
      if (err) {
        return res.status(403).send({ 
          message: 'Действие запрещено 3'
        })
      }
      console.log(user, 'user');
    
      //если ок то в user вернется то что мы как раз шифровали
      const accessToken = jwt.sign({
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFE
      })

      return res.status(200).send({
        accessToken,
        email: user.email
      })
    })
  },

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
      },
      process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFE
      })

      //рефреш токен
      const refreshToken = jwt.sign({
        userId: foundUser._id,
        email: foundUser.email
      }, 
      process.env.JWT_SECRET_REFRESH)

      //если пользователь уже существует
      const foundToken = await Token.findOne({
        user: foundUser._id
      })
      //то обновляем текущий токен не создавая новый
      if (foundToken) {
        await Token.findByIdAndUpdate(foundToken._id, { token: refreshToken })
        //возвращаем токены на фронтенд
        return res.status(200).send({
          accessToken,
          refreshToken,
          email: foundUser.email
        })
      }

      //в схеме указано ref: 'User' и item тут token: бла и _id: бла
      //то есть ссылаемся на ObjectId юзера
      const item = new Token({
        token: refreshToken,
        user: foundUser._id
      })
      // сохраняем токен и юзера в базу
      await item.save()

      //возвращаем токены на фронтенд
      return res.status(200).send({
        accessToken,
        refreshToken,
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