const CheckInfo = require('../lib/mongo').CheckInfo

module.exports = {
  // 通过客户id获取用户信息
  getCheckInfoById: function getCheckInfoById (id) {
    return CheckInfo
      .findOne({ id: id })
      .addCreatedAt()
      .exec()
  },

  // 添加一个客户
  create: function create (customer) {
    return CheckInfo.create(customer).exec()
  }
}