const DateHelper={
	//获取档期的日期
	getNowDate(formate){
		var date=new Date();
		return DateHelper.formate(date);
	},
	formate(date,formate){
		var year= date.getFullYear();
		var month=parseInt((date.getMonth()+1))<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
		var day=date.getDate()<10?("0"+date.getDate()):date.getDate();
		var hour=date.getHours();
		var min=date.getMinutes();
		var sec=date.getSeconds();
		var result="";
		if(formate.indexOf("yyyy")>=0){
			result=year;
		}
		if(formate.indexOf("MM")>=0){
			result+="-"+month;
		}
		if(formate.indexOf("dd")>=0){
			result+="-"+day;
		}
		if(formate.indexOf("HH")>=0){
			result+=" "+hour;
		}

		if(formate.indexOf("mm")>=0){
			result+=":"+min;
		}
		if(formate.indexOf("ss")>=0){
			result+=":"+sec;

		}
		return result;
	},
	//是否闰年
	isLeaf(date){
		if(typeof date =="String"){
			date=new Date();
		}
		var date=new Date();
		return (0 == date.getYear() % 4 && ((date.getYear() % 100 != 0) || (date.getYear() % 400 == 0)));
	},
	//获取当前天是全年的第几天
	daysOfYear(date){
		 //获取第几个月
	    var month = date.getMonth();
	    var days = 0;
	    //获取该天是第几周
	    for (var i = 1; i <= month; i++) {
	        days += dayNumOfMonth(i);
	    }
	    return days + date.getDate();
	},
	 //通过日期来获取当期星期几
    dayOfWeek:function(date){
      var week=new Date(date).getDay();
      if(week==0){
          return 7;
      }  
      else{
          return week;
      }
    },
    //通过年月来获取月份的天数
    dayNumOfMonth:function(year,month){
        var d = new Date(year,month,0);
        return d.getDate();
    },
    //获取当前周的星期一
    weekFirstDay(){
    	var currentDay = new Date();
	    var cYear = currentDay.getFullYear();
	    var cMonth = currentDay.getMonth() + 1;
	    var day = currentDay.getDate();
	    var startDay = day - (parseInt(currentDay.getDay()==0?6:(currentDay.getDay()-1)));
	    //检查是否跨月

	    if (startDay < 1) {     //如果跨月情况
	        var month = DateHelper.dayNumOfMonth(cYear,cMonth-1);//原 var month = GetDaysByMonth(parseInt(currentDay.getMonth()))
	        var nowDay = month - Math.abs(startDay);//  原var nowDay = month - startDay
	        return cYear + "-" + (currentDay.getMonth() < 10 ? "0" + currentDay.getMonth() : currentDay.getMonth()) + "-" + nowDay;
	    }
	    return DateHelper.formate(currentDay,"yyyy-MM") + '-' + (parseInt(startDay) < 10 ? "0" + startDay : startDay);
    },
    //当前走的最后一天
    weekLastDay(){
    	var currentDay = new Date();
	    //返回的是当前月的天数
	   
	    var cYear = currentDay.getFullYear();
	    var cMonth = currentDay.getMonth() + 1;
	    var days = DateHelper.dayNumOfMonth(cYear,cMonth);
	    var day = currentDay.getDate();
	    var endDay = day + (7 - currentDay.getDay());
	    if (endDay > days) {     //如果跨月的情况
	        var newDay = (endDay - days) + 1;
	        if (newDay < 10) {
	            newDay = "0" + newDay;
	        }
	        return cYear + "-" + ((cMonth + 1) < 10 ? ("0" + (cMonth + 1)) : (cMonth + 1)) + "-" + newDay;
	    }
	    return DateHelper.formate(currentDay,"yyyy-MM") + '-' + (endDay<10?("0"+endDay):endDay);
    },
    monthFirstDay(){
    	return getNowDate("yyyy-MM")+"-01";
    },
    //获取当前月的最后一天
    monthLastDay(){
    	var date=new Date();
       	var lastDay=DateHelper.dayNumOfMonth(date.getFullYear(),(date.getMonth()+1));
		return getNowDate("yyyy-MM")+(lastDay<10?("0"+lastDay):lastDay);
    },
    //日期比较,返回差值
    dateDiff(sDate,eDate,strInterval){
    	
    	if (typeof (sDate) == 'string')//如果是字符串转换为日期型  
	    {
	        sDate = new Date(sDate);
	    }
	    if (typeof (eDate) == 'string')//如果是字符串转换为日期型  
	    {
	        eDate = new Date(eDate);
	    }
	    switch (strInterval) {
	        case 's': return parseInt((eDate - sDate) / 1000);
	        case 'n': return parseInt((eDate - sDate) / 60000);
	        case 'h': return parseInt((eDate - sDate) / 3600000);
	        case 'd': return parseInt((eDate - sDate) / 86400000);
	        case 'w': return parseInt((eDate - sDate) / (86400000 * 7));
	        case 'm': return (eDate.getMonth() + 1) + ((eDate.getFullYear() - sDate.getFullYear()) * 12) - (sDate.getMonth() + 1);
	        case 'y': return eDate.getFullYear() - sDate.getFullYear();
    	}	
    },
    //日期相加
    dateAdd(sDate,strInterval,num){
    	 var dtTmp = sDate;
	    switch (strInterval) {
	        case 's': return new Date(Date.parse(dtTmp.toDateString()) + (1000 * num));
	        case 'n': return new Date(Date.parse(dtTmp.toDateString()) + (60000 * num));
	        case 'h': return new Date(Date.parse(dtTmp.toDateString()) + (3600000 * num));
	        case 'd': return new Date(Date.parse(dtTmp.toDateString()) + (86400000 * num));
	        case 'w': return new Date(Date.parse(dtTmp.toDateString()) + ((86400000 * 7) * num));
	        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	        case 'y': return new Date((dtTmp.getFullYear() + num), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	    }
    }
}


export default DateHelper