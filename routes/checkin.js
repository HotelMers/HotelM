const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin
const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const DateHelper = require('../middlewares/dateHelper')

var toDate = function(stringDate) {
  var stringDate= Number(stringDate);

  // 初始化方法 new Date(yyyy,month,dd)
  // start_date
  var year= stringDate/ 10000;
  var month= (stringDate% 10000)/ 100;
  var day= (stringDate% 10000)% 100;
  return Date(year,month,day);
}

module.exports = {
  // GET
  checkInPage: function (req, res) {
    // 解析url,若信息填错，可保存并自动填充已填信息
    var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('checkin', { customer : customer, bookinfo : bookinfo, roomnum: roomnum})
  },


  // // post 查找用户是否是会员
  // // checkin的ejs页面暂时没有用到“查找用户是否是会员”
  // checkInVIPSubmit: function(req, res, next) {
  //   return res.redirect('/searchcus')
  // },

// post 通过身份证号查询预定情况
//预定用户自动填充入住信息
  checkInSearchBookInfo: function(req, res, next) {
    const CustomerId = req.fields.idcard.toString()

   //校验参数
    try {
      if (CustomerId.length != 18) {
        throw new Error('无效身份证号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/checkin')
    }

    BookModel.getBookInfoById(CustomerId)
      .then(function (bookInfo) {
        if (!bookInfo) {
          var session = req.session;
          req.flash('error', '预定信息不存在！')
          url = '/checkin?idcard='+CustomerId.toString()
          return res.redirect(url)
          //return res.redirect('/checkin')
        }
        req.flash('success', '查询成功！')
        // 自动填充
        url = '/checkin?idcard='+CustomerId.toString()+'&name='+bookInfo.name+'&phone='+bookInfo.phone
        +'&roomtype='+bookInfo.type+'&startdate='+(bookInfo.startdate).toString()+'&enddate='+(bookInfo.enddate).toString()
        return res.redirect(url)
    })
  },


  // get /checkin/getRoom 添加房间
  // 选取空房中的第一个
  checkInWritePage: function(req, res) {
    res.render('getRoom', {rooms:rooms})
  },


  // post 入住写入入住信息数据库(待完成)
  checkInWrite: function(req, res, next) {
    const CustomerId = req.fields.idcard.toString()
    const name = req.fields.name.toString()
    const phone = req.fields.phone.toString()
    const startdate = req.fields.starttime.toString()
    const enddate = req.fields.endtime.toString()
    const roomtype = req.fields.roomtype.toString()

// 获得房间号（暂时只能手动赋值）
    const RoomNumber = '222'
    // RoomModel.getRoomIdByType(roomtype)
    // .then(function (rooms) {
    //   if (!rooms) {
    //     throw new Error('该房型无空房！')
    //     req.flash('error', '该房型无空房！')
    //   }
    //   res.render('getRoom', {rooms:rooms})
    // })

    // 非预定用户填写入住信息
    // 校验参数
    try {
      if (CustomerId.length != 18) {
        throw new Error('无效身份证号')
      }
      if (!name) {s
        throw new Error('姓名不能为空')
      }
      if (phone.length != 11) {
        throw new Error('无效手机号')
      }
      if (roomtype!= "单人房"&&roomtype!= "双人房"&&roomtype!= "大房") {
        throw new Error('房间类型填写有误！正确格式为：单人房/双人房/大房') 
      }
      if (startdate.length != 8) {
        throw new Error('入住时间格式错误！正确格式为：（8位阿拉伯数字表示）YYYYMMDD')
      }
      if (enddate.length != 8) {
        throw new Error('退房时间格式错误！正确格式为：（8位阿拉伯数字表示）YYYYMMDD')
      }
      if (!RoomModel.getRoomByNumber(RoomNumber)) {
        throw new Error('无效房间号')
      }
      if (!RoomNumber) {
        throw new Error('请获取房间号')
      }
    } catch (e) {
      req.flash('error', e.message)
      // 若信息填错，重定向后可保存并自动填充已填信息
      url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
      +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
      return res.redirect(url)
      next(e)
    }

    // 待写入数据库的入住信息
    let checkInfo = {
      CustomerId : CustomerId,
      name: name,
      phone : phone,
      RoomNumber : RoomNumber,
      startdate : Number(startdate),
      enddate : Number(enddate)
    }

    // 入住信息写入数据库
    CheckInfoModel.create(checkInfo)
      .then(function (result) {
        req.flash('success', '添加入住信息成功！房间号：'+RoomNumber)
        // 更新剩余空房数据库，相应类型客房数量-1   
        EmptyRoomModel.reduceNumberBetweenDaysByType(toDate(startdate), toDate(enddate), roomtype.toString())
        req.flash('success', roomtype+'数量-1')
        // 传参
        url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
        +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
        +'&RoomNumber='+RoomNumber.toString()
        return res.redirect(url)
      })
      .catch(function (e) {
        // 入住信息已存在，跳回checkIn
        // ？？？不会处理一个人预定多条
        if (e.message.match('duplicate key')) {
          req.flash('error', '入住信息已存在')
          return res.redirect('/checkin')
        }
        next(e)
    }) 


  }

}



// test url
// http://localhost:3000/checkin?idcard=111112222233333444&name=%E9%A9%AC%E7%94%BB%E8%97%A4&phone=12312312312&roomtype=11&startdate=20180515&enddate=20180519






// // 通过身份证号查询预定情况
// function checkInBookSearch(req, res, next) {
//   const CustomerId = req.fields.idcard

//   // 校验参数
//   try {
//     if (CustomerId.length != 18) {
//       throw new Error('无效身份证号')
//     }
//   } catch (e) {
//     req.flash('error', e.message)
//     return res.render('/checkin')
//   }


//   BookModel.getBookInfoById(CustomerId)
//     .then(function (bookInfo) {
//       if (!bookInfo) {
//         var session = req.session;
//         req.flash('error', '预定信息不存在')
//         url = '/checkin?idcard='+id.toString()
//         return res.render(url)
//       }
//       req.flash('success', '查询成功')
//       res.set({
//         'id': bookinfo.id,
//         'name': bookinfo.name,
//       })
//       var customer = {id:CustomerId, name:bookInfo.name,score:"", phone:bookInfo.phone}
//       var bookinfo = { id:bookInfo.id, name:bookInfo.name, phone:bookInfo.phone, 
//       type:bookInfo.roomtype, startdate:bookInfo.startdate, enddate:bookInfo.enddate}
//       res.render(url,{customer:customer,bookinfo:bookinfo})
//     })
// }