const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function(results) {
        results.forEach(function(item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne: function(result) {
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

exports.User.index({ name: 1 }, { unique: true }).exec() // 根据用户名找到用户，用户名全局唯一

exports.Room = mongolass.model('Room', {
    number: { type: 'number', required: true },
    type: { type: 'string', required: true }, 
    status: { type: 'string', required: true }  // status若住人设为对应顾客id，不住为0，方便查询
})
exports.Room.index({ number: 1 }, { unique: true }).exec()

exports.Customer = mongolass.model('Customer', {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    score: { type: 'number', required: true },
    phone: { type: 'string', required: true }
})
exports.Customer.index({ id: 1 }, { unique: true }).exec()

exports.BookInfo = mongolass.model('BookInfo', {
    id: { type: 'string', required: true },  // 客户id
    name: { type: 'string', required: true },
    phone: { type: 'string', required: true },
    type: { type: 'string', required: true },
    startdate: { type: 'number', required: true },
    enddate: { type: 'number', required: true },
    idx: { type: 'number', required: true },  // 索引
})
exports.BookInfo.index({ id: 1, idx: 1}, { unique: true }).exec()

exports.CheckInfo = mongolass.model('CheckInfo', {
    CustomerId: { type: 'string', required: true },
    name: { type: 'string', required: true },
    phone: { type: 'string', required: true },
    RoomNumber: { type: 'number', required: true },
    startdate: { type: 'number', required: true },
    enddate: { type: 'number', required: true },
    roomtype: { type: 'string', required: true },
    payment: { type: 'number', required: true },       // 顾客须支付的总房费
    isValid: {type: 'number', required: true}   // 0 or 1
})
// checkin主键：顾客id+入住时间+退房时间（以解决同一个顾客多次入住的冲突）
exports.CheckInfo.index({ CustomerId: 1, startdate: 1, enddate: 1 }).exec()

// 一个30天内剩余房间数量的数据库
exports.EmptyRoomNumber = mongolass.model('EmptyRoomNumber', {
  year : { type: 'number', required: true },  // 月
  month : { type: 'number', required: true },  // 月
  day : { type: 'number', required: true },  // 日
  bigRoom : { type: 'number', required: true },  // 可用大房数量
  singleRoom: { type: 'number', required: true },  // 可用单人房数量
  doubleRoom: { type: 'number', required: true },  // 可用双人房数量
  bigPrice : { type: 'number', required: true },  // 当天大房价格
  singlePrice: { type: 'number', required: true },  // 当天单人房价格
  doublePrice: { type: 'number', required: true },  // 当天双人房价格
})
exports.EmptyRoomNumber.index({ year:1, month: 1, day: 1,}).exec()
