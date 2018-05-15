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
  var year= stringDate/ 10000
  var month= (stringDate% 10000)/ 100
  var day= (stringDate% 10000)% 100
  var myDate = new Date()
  myDate.setFullYear(year)
  myDate.setMonth(month-1)
  myDate.setDate(day)
  return myDate
}

module.exports = {
  // GET
  checkInPage: function (req, res) {
    // 解析url,若信息填错，可保存并自动填充已填信息
    var isBook = req.query.isBook
    var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('checkin', { customer : customer, bookinfo : bookinfo, roomnum: roomnum, isBook : isBook})
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
          url = '/checkin?idcard='+CustomerId.toString()+'&isBook=0'
          return res.redirect(url)
          //return res.redirect('/checkin')
        }
        req.flash('success', '查询成功！')
        // 自动填充
        url = '/checkin?idcard='+CustomerId.toString()+'&name='+bookInfo.name+'&phone='+bookInfo.phone
        +'&roomtype='+bookInfo.type+'&startdate='+(bookInfo.startdate).toString()+'&enddate='+(bookInfo.enddate).toString()
        +'&isBook=1'
        return res.redirect(url)
    })
  },


  // get /checkin/getRoom 添加房间
  // 选取空房中的第一个
  checkInWritePage: function(req, res) {
    //res.render('getRoom', {rooms:rooms})
    // 解析url,若信息填错，可保存并自动填充已填信息
    var isBook = req.query.isBook
    var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('checkin', { customer : customer, bookinfo : bookinfo, roomnum: roomnum, isBook : isBook})
  },


  // post 入住写入入住信息数据库(待完成)
  checkInWrite: function(req, res, next) {
    const CustomerId = req.fields.idcard.toString()
    const name = req.fields.name.toString()
    const phone = req.fields.phone.toString()
    const startdate = req.fields.starttime.toString()
    const enddate = req.fields.endtime.toString()
    const roomtype = req.fields.roomtype.toString()
    const isBook = Number(req.fields.isBook)
    req.flash('error', isBook.toString())

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

    // 获取当前日期时间
    var myDate = new Date()
    var year = myDate.getFullYear().toString()    //获取完整的年份(4位)
    var month = (myDate.getMonth()+1).toString()       //获取当前月份(0-11,0代表1月)
    if (month.length == 1) month = '0'+month
    var day = myDate.getDate().toString()        //获取当前日(1-31)
    if (day.length == 1) day = '0'+day
    var today = year+month+day

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
      if (Number(startdate)-Number(enddate) > 0) {
        throw new Error('退房时间不能早于入住时间!')
      }
      if (Number(today)-Number(startdate) > 0) {
        throw new Error('入住时间不能早于今日!')
      }
    } catch (e) {
      req.flash('error', e.message)
      // 若信息填错，重定向后可保存并自动填充已填信息
      url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
      +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
      return res.redirect(url)
      next(e)
    }

    // 先查询是否还有空房,有空房才进行相关操作
    var offset = dayoffsetBetweenTwoday(startdate, enddate)
    for (var i = 0; i < offset; i++) {     
      if (roomtype== '单人房') {
        EmptyRoomModel.getEmptyRoomNumberByDays(i.toString().slice(0,4), 
        i.toString().slice(4,6), i.toString().slice(6,8)).then(function(result) {
          if (result.singleRoom == 0) {
              req.flash('error', '没有足够的房间')
              return res.redirect('/manage')
          }
        })
      } else if (roomtype== '大床房') {
        EmptyRoomModel.getEmptyRoomNumberByDays(i.toString().slice(0,4), 
        i.toString().slice(4,6), i.toString().slice(6,8)).then(function(result) {
          req.flash('error', result.bigRoom.toString())
          if (result.bigRoom == 0) {
              req.flash('error', '没有足够的房间')
              return res.redirect('/manage')
          }
        })
      } else if (roomtype== '双人房') {
        EmptyRoomModel.getEmptyRoomNumberByDays(i.toString().slice(0,4), 
        i.toString().slice(4,6), i.toString().slice(6,8)).then(function(result) {
          if (result.doubleRoom == 0) {
              req.flash('error', '没有足够的房间')
              return res.redirect('/manage')
          }
        })
      }        
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
    
    //待写入数据库的会员信息
    let customers = {
      id:CustomerId,
      name:name,
      score:0,
      phone:phone,
    }

    //会员信息写入数据库
    CusModel.create(customers)
      .then(function (result) {
        //req.flash('success', '添加会员信息成功，会员ID：'+CustomerId)
        //res.redirect('back')
      })
    
    // 入住信息写入数据库
    CheckInfoModel.create(checkInfo)
      .then(function (result) {
        req.flash('success', '添加入住信息成功！房间号：'+RoomNumber)
        // 更新剩余空房数据库，非预定入住相应类型客房数量-1   
        if (isBook == 0) {
          EmptyRoomModel.reduceNumberBetweenDaysByType(toDate(startdate), toDate(enddate), roomtype.toString())
          req.flash('success', '非预定入住：'+roomtype+'数量-1')
        }
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



/*test url
http://localhost:3000/checkin?idcard=111112222233333444&name=%E9%A9%AC%E7%94%BB%E8%97%A4&phone=12312312312&roomtype=11&startdate=20180515&enddate=20180519
*/





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
