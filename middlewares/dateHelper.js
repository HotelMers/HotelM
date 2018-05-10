module.exports = {
  // 辅助函数

  // 返回两个日期之间daysoffset  beginDay和endDay的数据类型为Date
  // 可以用于预定或登记入住时计算返回两个日期之间daysoffset,
  // 并且在得到dayoffset后要判断如果dayoffset<0,说明输入的日期比当前日期早，要求重新输入;如果dayoffset>=30,提示酒店不提供30天后的预定服务,要求重新输入
  dayoffsetBetweenTwoday: function dayoffsetBetweenTwoday(beginDay,endDay) {
    // 将字符串转为Date对象，并获取毫秒数；
    var startTime = new Date(Date.parse(beginDay)).getTime();
    var endTime = new Date(Date.parse(endDay)).getTime();
    // 计算毫秒数的差，并换算成天数；
    var diff = Math.abs(startTime - endTime);
    var dayoffset = parseInt(diff / (1000 * 60 * 60 * 24), 10);
    return dayoffset;
  },

  // 返回某个月份的日期数
  DaysInMonth: function DaysInMonth(month, year) {  // month [1,12]
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
      return 31;
    else if ( month == 4 || month == 6|| month == 9|| month == 11)
      return 30;
    else if ( month == 2)
      if (year % 4 == 0 && year % 100 != 0)
        return 29;
      else
        return 28;
    else
      return 0;
  },

  // 返回当天过后dayoffset天的日期
  getDateAfterDays: function getDateAfterDays (beginDay,dayoffset) {
    var day = beginDay.getDate()+dayoffset;
    var month = beginDay.getMonth(); // month [0,11]
    var year = beginDay.getFullYear();
    if (day > module.exports.DaysInMonth(month+1,year)) {
      day = day-module.exports.DaysInMonth(month+1,year);
      month++;
      if (month > 11) {
        year++;
        month = 0;
      }
    }
    var date = {year:year,month:month+1,day:day};
    return date;
  },
}