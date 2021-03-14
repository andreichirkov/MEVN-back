require('dotenv').config()
const { verify } = require('jsonwebtoken')

const checkJWTSign = (req, res, next) => {
  const { headers: {authorization} } = req

  if (authorization) {
    //['Beared', 'какой то token fldnvldfnv'] (1 потому что нумерация с 0)
    const token = authorization.split(' ')[1]
    
    verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        res.sendStatus(403)
        return next()
      }
    })
    return next()
  }

  return res.sendStatus(403)
}

module.exports = {checkJWTSign}




