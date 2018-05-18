const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin
const DateHelper = require('../middlewares/dateHelper')

module.exports = {
  // GET
  checkInPage: function (req, res) {
    // 解析url,若信息填错，可保存并自动填充已填信息
    var isBook = req.query.isBook
    var isVIP = req.query.isVIP
    var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('checkin', { customer : customer, bookinfo : bookinfo, roomnum: roomnum,
     isBook : isBook, isVIP : isVIP})
  },


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

    // 查找用户是否是会员
    var isV = 3
    CusModel.getCusById(CustomerId)
      .then(function (customer) {
        if (!customer) {
          isV = 0
        } else {
          isV = 1
        }

        BookModel.getBookInfoById(CustomerId)
        .then(function (bookInfo) {       
          if (!bookInfo) {
            var session = req.session;
            req.flash('error', '预定信息不存在！')
            url = '/checkin?idcard='+CustomerId.toString()+'&isBook=0'+'&isVIP='+isV.toString()
            return res.redirect(url)
            //return res.redirect('/checkin')
          }
          req.flash('success', '查询成功！')
          // 自动填充
          url = '/checkin?idcard='+CustomerId.toString()+'&name='+bookInfo.name+'&phone='+bookInfo.phone
          +'&roomtype='+bookInfo.type+'&startdate='+(bookInfo.startdate).toString()+'&enddate='+(bookInfo.enddate).toString()
          +'&isBook=1'+'&isVIP='+isV.toString()
          return res.redirect(url)
        })
      })
    
  },


  // post 查找用户是否是会员
  checkInsearchVIP: function(req, res, next) {
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

    CusModel.getCusById(CustomerId)
      .then(function (customer) {
        if (!customer) {
          isVIP = 0
          var session = req.session;
          req.flash('error', '非会员！')
          url = '/checkin?idcard='+CustomerId.toString()+'&isVIP=0'
          return res.redirect(url)
          //return res.redirect('/checkin')
        }
        isVIP = 1
        req.flash('success', '查询成功！')
        // 自动填充
        url = '/checkin?idcard='+CustomerId.toString()+'&name='+customer.name+'&phone='+customer.phone+'&isVIP=1'
        return res.redirect(url)
    })
  },



  // get /checkin/getRoom 添加房间
  // 选取空房中的第一个
  checkInWritePage: function(req, res) {
    //res.render('getRoom', {rooms:rooms})
    // 解析url,若信息填错，可保存并自动填充已填信息
    var isBook = req.query.isBook
    var isVIP = req.query.isVIP
    var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('checkin', { customer : customer, bookinfo : bookinfo, roomnum: roomnum,
     isBook : isBook, isVIP : isVIP})
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
    const isVIP = Number(req.fields.isVIP)
    
    // 校验参数
    // 获取当前日期时间，用于和入住日期进行比较，避免入住日期早于当前日期
    var myDate = new Date()
    var year = myDate.getFullYear().toString()    //获取完整的年份(4位)
    var month = (myDate.getMonth()+1).toString()       //获取当前月份(0-11,0代表1月)
    if (month.length == 1) month = '0'+month
    var day = myDate.getDate().toString()        //获取当前日(1-31)
    if (day.length == 1) day = '0'+day
    var today = year+month+day

    try {
      if (CustomerId.length != 18 || isNaN(Number(CustomerId))) {
        throw new Error('无效身份证号')
      }
      if (!name) {
        throw new Error('姓名不能为空')
      }
      if (phone.length != 11 || isNaN(Number(phone))) {
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
      // if (!RoomModel.getRoomByNumber(RoomNumber)) {
      //   throw new Error('无效房间号')
      // }
      // if (!RoomNumber) {
      //   throw new Error('请获取房间号')
      // }
      if (Number(startdate)-Number(enddate) > 0) {
        throw new Error('退房时间不能早于入住时间!')
      }
      if (Number(today)-Number(startdate) > 0) {
        throw new Error('入住时间不能早于今日!')
      }
      var endayoffset = Number(DateHelper.dayoffsetBetweenTwoday(new Date(), DateHelper.toDate(enddate)))
      if (endayoffset > 30) {
        throw new Error('不能登记超过30天的入住')
      } 
    } catch (e) {
      req.flash('error', e.message)
      // 若信息填错，重定向后可保存并自动填充已填信息
      url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
      +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
      +'&isBook='+isBook.toString()+'&isVIP='+isVIP.toString()
      return res.redirect(url)
      next(e)
    }
    
    RoomModel.getRoomIdByType(roomtype).then(function(rooms) {
      // 先查询是否还有空房,有空房才进行相关操作
      try {
        if (!rooms||rooms.length==0) {
          throw new Error('该房型无空房！')
        }
      } catch (e) {
        req.flash('error', e.message)
        url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
        +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
        +'&isBook='+isBook.toString()+'&isVIP='+isVIP.toString()
        return res.redirect(url)
      }
      // if (!rooms||rooms.length==0) {
      //   req.flash('error', '该房型无空房！')
      //   throw new Error('该房型无空房！')         
      // } else {

        // 获得房间号
        // 通过房间类型获得该类型的所有空房，并随机分配一间空房
        const RoomNumber = rooms[0].number
        //var roomPrice = Number(rooms[0].value)

        // 待写入数据库的入住信息       
        var offset = Number(DateHelper.dayoffsetBetweenTwoday(DateHelper.toDate(startdate), DateHelper.toDate(enddate)))

        // 计算房价 and 检查空房
        var payment = 0
        if (1) {
          for (var i = 0; i < offset; i++) {
            (function(dayoff) {
              var date = DateHelper.getDateAfterDays(DateHelper.toDate(startdate),dayoff);
              EmptyRoomModel.getEmptyRoomNumberByDays(date.year,date.month,date.day).then(function(result) {
                if ((type == '单人房' && result.singleRoom == 0) ||
                    (type == '双人房' && result.doubleRoom == 0) ||
                    (type == '大房' && result.bigRoom == 0)) {
                  throw new Error('该房型在该时间段内无空房！')
                } else {
                  if (type == '单人房') {
                    payment += result.singlePrice;
                  } else if (type == '双人房') {
                    payment += result.doublePrice;
                  } else if (type == '大房') {
                    payment += result.bigPrice;
                  }
                }
              })
            })(i)
          }
        }
        
        let checkInfo = {
          CustomerId : CustomerId,
          name: name,
          phone : phone,
          RoomNumber : RoomNumber,
          startdate : Number(startdate),
          enddate : Number(enddate),
          roomtype: roomtype,
          payment: payment,   // 顾客须支付的总房费
          isValid: 1
        }

        //第一次入住的顾客信息写入会员数据库
        if (isVIP == 0) {
          //根据房间类型设置积分
          var add_origin_score = 0
          if (roomtype == "单人房") {
            add_origin_score = 10
          } else if (roomtype == "双人房") {
            add_origin_score = 20
          } else {
            add_origin_score = 30
          }
          add_origin_score = add_origin_score*offset
          //待写入数据库的会员信息
          let customers = {
            id:CustomerId,
            name:name,
            score:add_origin_score,    // 新会员积分为房间类型所对应的积分
            phone:phone,
          }

          // 顾客信息写入会员数据库
          CusModel.create(customers)
          .then(function (result) {
            //req.flash('success', '添加会员信息成功，会员ID：'+CustomerId)
            //res.redirect('back')
          })
        } else {  // 是vip 

          //根据房间类型设置积分
          var add_score = 0
          if (roomtype == "单人房") {
            add_score = 10
          } else if (roomtype == "双人房") {
            add_score = 20
          } else {
            add_score = 30
          }
          add_score = add_score*offset
          CusModel.getCusById(CustomerId)
            .then(function(customer) {

              var origin_score = customer.score + add_score
              let customers = {
                id:CustomerId,
                score:origin_score,
              }

              //从数据库中修改对应会员的积分
              CusModel.updateCusScore(customers)
                .then(function (result) {
                  req.flash('success','修改成功, 会员积分：'+customers.score)
                  //res.redirect('back')
                })

            })

        }
                
        // 入住信息写入数据库
        CheckInfoModel.create(checkInfo)
          .then(function (result) {
            // 改变已分配房号的状态（无人入住->入住）
            RoomModel.setStatusByRoomNumer(RoomNumber, CustomerId)
            req.flash('success', '添加入住信息成功！房间号：'+RoomNumber+'。 房费共计：'+payment+'元')
            // 更新剩余空房数据库，非预定入住相应类型客房数量-1   
            if (isBook == 0) {
              EmptyRoomModel.reduceNumberBetweenDaysByType(DateHelper.toDate(startdate), DateHelper.toDate(enddate), roomtype.toString())
              req.flash('success', '非预定入住：'+roomtype+'数量-1')
            }
            // 传参
            url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
            +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
            +'&RoomNumber='+RoomNumber.toString()+'&isBook='+isBook.toString()+'&isVIP='+isVIP.toString()
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
      //}
    })

  }

}
