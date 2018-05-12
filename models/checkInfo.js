const CheckInfo = require('../lib/mongo').CheckInfo
const Room = require('../lib/mongo').room
const mongodb = require('../lib/mongo')

module.exports = {
  // 通过客户id获取入住信息
  getCheckInfoById: function getCheckInfoById (id) {
    return CheckInfo
      .findOne({ CustomerId: id })
      .addCreatedAt()
      .exec()
  },

  // 通过房间号获取入住信息
  getCheckInfoByRoom: function getCheckInfoByRoom (number) {
    return CheckInfo
      .findOne({ RoomNumber: number })
      .addCreatedAt()
      .exec()
  },

  //通过开始时间和截止时间区间获取入住信息
  //getCheckInfoByTimeRange: function getCheckInfoByTimeRange(starttime, endtime) {
  //  db.cillection('CheckInfo', function(err, collection) {
  //    if(err) {
  //      mongodb.close();
  //      return callback(err);
  //    }
      //查找入住信息(starttime健)
  //    collection.findOne({
  //      starttime:starttime
  //    },function(err, starttime) {
  //      mongodb.close();
  //      if(err) {
  //        return callback(err); //失败，返回err
  //      }
  //      callback(null, user);//成功，返回查询的入住信息
  //    });
  //  });
  //  return 
      
  //}

  // 添加一个入住信息
  create: function create (checkInfo) {
    // 要计算钱
    return CheckInfo.create(checkInfo).exec()
  },

  // 通过房间号删除一个入住信息
  delCheckInByRoom: function delCheckInByRoom (id) {
    return CheckInfo.deleteOne({ CustomerId: id }).exec()
  }
}
