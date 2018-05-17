const Customer = require('../lib/mongo').Customer

module.exports = {
  // 通过客户id获取用户信息
  getCusById: function getCusById (id) {
    return Customer
      .findOne({ id: id })
      .addCreatedAt()
      .exec()
  },
  
  //通过客户id修改积分
  updateCusScore: function updateCusScore (customer) {
    return Customer.updateMany({'id':customer.id},{$set:{'score':customer.score}}).exec()
  },

  // 添加一个客户
  create: function create (customer) {
    return Customer.create(customer).exec()
  }
}