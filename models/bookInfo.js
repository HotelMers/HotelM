const BookInfo = require('../lib/mongo').BookInfo

module.exports = {
  // 通过客户id获取预定信息
  getBookInfoById: function getBookInfoById (id) {
    return BookInfo
      .find({ 'id': id })
      .exec()
  },

  // 通过客户id获取预定信息
  getBookInfoByIdAndIdx: function getBookInfoByIdAndIdx (id, idx) {
    return BookInfo
      .findOne({ 'id': id, 'idx':Number(idx) })
      .exec()
  },
  // 用于删除过期记录
  getBookinfoByEnddates: function getBookinfoByEnddates (days) {
    return BookInfo.findOne({'enddate':days }).exec()
  },
  // 添加一个预定信息
  create: function create (bi) {
    var idx;
    bookinfo = {id:bi.id, name:bi.name,phone:bi.phone,type:bi.type,startdate:bi.startdate,enddate:bi.enddate,idx:0}
    return Promise.resolve()
    .then(function(value) {
      return module.exports.getIndex(bookinfo.id)
      .then(function(idx) {
        bookinfo.idx = Number(idx);
      }).then(function() {
        // return Promise.resolve(idx)
        return BookInfo.create(bookinfo).exec()
      });
    })
  },

  // 添加一个预定信息
  // test: function test () {
  //   // id_array.push(bookinfo.id)
  //   var idx;
  //   return Promise.resolve().then(function(value) {
  //     idx = module.exports.getIndex();
  //   }).then(function() {
  //     return Promise.resolve(idx)
  //   });
  // },

  // 
  getIndex: function getIndex (cusId) {
    return BookInfo.find({}).sort({"idx" : -1})
    .then(function(bookinfos){
      if (!bookinfos || bookinfos.length == 0) {
        return Promise.resolve(1);
      } else {
        return Promise.resolve(bookinfos[0].idx+1);
      }
    })
    // return 1;

    // id_array.push(bookinfo.id)
    // return 10;
    //return BookInfo.create(bookinfo).exec()
  },



  // 删除一个预订信息 用客户id和索引
  deleteInfoByidAndIdx: function deleteInfoByid (id, idx) {
    return BookInfo.deleteOne({ 'id': id , 'idx': Number(idx)}).exec()
  },

  // 删除一个预订信息 用客户id
  deleteInfoByid: function deleteInfoByid (id) {
    return BookInfo.deleteOne({ 'id': id }).exec()
  },

  deleteAll: function deleteAll() {
    BookInfo.remove({}).exec()
  },
}
