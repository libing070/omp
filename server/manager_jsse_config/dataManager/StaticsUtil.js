load('/common/common.js');
/**
 * 返回符合条件的数组格式数据
 */
var StaticsUtil={
	getStandardData:function(arr,period){
		var result=arr;
		//填充0的处理
		if(period=="0"){
			var basicArr=[];
			for(var i=0;i<24;i++){
				var s=this.getHourFormat(i);
				basicArr.push({
					businessTime:s,
					count:"0"
				});
			}
//			logger.debug("===00==="+JSON.stringify(basicArr))
			//将数据库中的值插入
			for(var i=0;i<result.length;i++){
				var r=result[i];
				this.findASet(basicArr, r.businessTime, r.count);
			}
//			logger.debug("===out=="+JSON.stringify(basicArr))
			return basicArr;	
		}else if(period=="1"){
			var basicArr=[];
			var curD=new Date().Format("yyyy-MM-dd");
			for(var i=-7;i<0;i++){
				var s=addmulDate2(curD, i, "yyyy-MM-dd");
				basicArr.push({
					businessTime:s,
					count:"0"
				});
			}
			//将数据库中的值插入
			for(var i=0;i<result.length;i++){
				var r=result[i];
				this.findASet(basicArr, r.businessTime, r.count);
			}
			return basicArr;
		}else if(period=="2"){
			var basicArr=[];
			var curD=new Date().Format("yyyy-MM-dd");
			for(var i=-30;i<0;i++){
				var s=addmulDate2(curD, i, "yyyy-MM-dd");
				basicArr.push({
					businessTime:s,
					count:"0"
				});
			}
			//将数据库中的值插入
			for(var i=0;i<result.length;i++){
				var r=result[i];
				this.findASet(basicArr, r.businessTime, r.count);
			}
			return basicArr;
		}else if(period=="3"){
			var basicArr=[];
			var curMon=new Date().Format("yyyy-MM");
			for(var i=-11;i<=0;i++){
				var s=this.getDifMonth(curMon, i);
				basicArr.push({
					businessTime:s,
					count:"0"
				});
			}
			//将数据库中的值插入
//			logger.debug("==="+JSON.stringify(result))
			for(var i=0;i<result.length;i++){
				var r=result[i];
				this.findASet(basicArr, r.businessTime, r.count);
			}
			return basicArr;
		};
		return result;
	},
	getHourFormat:function(h){
		return (String)(h>9?(h+":00:00"):("0"+h+":00:00"));
	},
	getDifMonth:function(t,n){
		//yyyy-MM
		var aT=t.split("-");
		var y1=parseInt(aT[0]);
		var m1=parseInt(aT[1]);
		m1+=n;
		var totalMon=y1*12+m1;
		y1=parseInt(totalMon/12);
		m1=totalMon-y1*12;
		if(m1==0){
			y1--;
			m1=12;
		}
		var sm=(String)(m1<10?("0"+m1):m1+"");
		return (String)(y1+"-"+sm);
	},
	//数组原本有序，查找数组中是否有某一个时间的值，没有则赋予默认值
	findASet:function(arr,time,value){
		for(var i=0;i<arr.length;i++){
			if(arr[i].businessTime==time) {
				arr[i].count=value;
				return;
			}
		}
	}
}