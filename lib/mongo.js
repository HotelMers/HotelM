const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

exports.User = mongolass.model('User', {
    name: { type: 'string', required: true },
    password: { type: 'string', required: true }
})

exports.User.index({ name: 1 }, { unique: true }).exec()// 根据用户名找到用户，用户名全局唯一

exports.Room = mongolass.model('Room', {
  number: { type: 'string', required: true },
  type: { type: 'string', required: true },
  value: { type: 'string', required: true },
  status: { type: 'string', required: true }
})
exports.Room.index({ number: 1}, { unique: true }).exec()

exports.Customer = mongolass.model('Customer', {
  id : { type: 'string', required: true },
  name: { type: 'string', required: true },
  score : {type: 'number', required: true},
  phone: { type: 'string', required: true }
})
exports.Customer.index({ id: 1}, { unique: true }).exec()

exports.BookInfo = mongolass.model('BookInfo', {
  id : { type: 'string', required: true },
  name: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  type: { type: 'string', required: true },
  startdate: { type: 'string', required: true },
  enddate: { type: 'string', required: true },
})
exports.BookInfo.index({ id: 1}).exec()

exports.CheckInfo = mongolass.model('CheckInfo', {
  CustomerId : { type: 'string', required: true },
  name: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  RoomNumber: { type: 'string', required: true },
  startdate: { type: 'string', required: true },
  enddate: { type: 'string', required: true },
})
exports.CheckInfo.index({ CustomerId: 1}).exec()

// 一个30天内剩余房间数量的数据库
exports.EmptyRoomNumber = mongolass.model('CheckInfo', {
  days : { type: 'string', required: true },  // 相对于今天的天数，比如今天则为0，明天为1
  bigRoom : { type: 'string', required: true },
  singleRoom: { type: 'string', required: true },
  doubleRoom: { type: 'string', required: true }
})
exports.CheckInfo.index({ days: 1}).exec()
