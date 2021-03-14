const boom = require('boom')

//ВОЗВРАЩАЕТ объект
const genericCrud = (model) => ({
  async get({ params: { id } }, res) {
    try {
      const item = await model.findById(id)
      return res.status(200).send(item)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  //req - то что нам отправляет сервер, res - то чем мы должны ему ответить
  async getAll(_, res) {
    try {
      const items = await model.find()
      return res.status(200).send(items)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  //body - отправляем тело - допустим создаем title: bla
  async create({ body }, res) {
    try {
      //так как наследовались от Schema
      const item = new model(body)
      const newItem = await item.save()
      return res.status(200).send(newItem)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  //body - обновляем - допустим обновим title: blabla теперь
  async update({ params: { id }, body }, res) {
    try {
      //{ new: true } - чтобы вернулся точно новый обновленный элемент
      const item = await model.findByIdAndUpdate(id, body, { new: true })
      //ответь со статусом 200 и верни сервер items
      return res.status(200).send(item)
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  },
  async delete({ params: { id } }, res) {
    try {
      await model.findByIdAndDelete(id)
      return res.status(200).send({ status: 'OK', message: 'Продукт удален' })
    } catch (err) {
      return res.status(400).send(boom.boomify(err))
    }
  }
})

module.exports = genericCrud