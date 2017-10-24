/**
 * @ngDoc directive
 * @name ng.directive:paging
 *
 * @description
 * A directive to aid in paging large datasets
 * while requiring a small amount of page
 * information.
 *
 * @element EA
 *
 */
app.directive('chart', ['$rootScope','clone',function ($rootScope,clone) {
  return {

    restrict: 'EA',
    replace : true,
    transclude : true,
    scope: {
      option: '=',
      small:"="
    },

    // Assign the angular directive template HTML
    template:
      '<div  class="chart" ></div>',
    link : function(scope, element, attrs) {



      function  initData(){
        var opt;
        var option;
        switch (attrs.type){
          case "line":
            option = {
              tooltip : {
                trigger: 'axis',
                axisPointer:{
                  type: 'line',
                  lineStyle: {
                    color: '#ccc',
                    width: 2,
                    type: 'solid'
                  },
                  crossStyle: {
                    color: '#rf00',
                    width: 1,
                    type: 'dashed'
                  },
                  shadowStyle: {
                    color: 'rgba(150,150,150,0.3)',
                    width: 'auto',
                    type: 'default'
                  }
                }
              },
              calculable : true,
              grid:{
                x:90,
                x2:50,
                y:50,
                y2:50,
              },
              xAxis : [
                {
                  type : 'category',
                  boundaryGap : false,
                  nameTextStyle:{

                  },
                  data : [
                    '2015-08-02', '2015-08-06','2015-08-10','2015-08-14','2015-08-18','2015-08-22','2015-08-26'],
                  axisLine:{
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                      type: 'solid'
                    }
                  },
                  axisTick:{
                    show:true,
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                    },
                    length:8

                  },
                  axisLabel:{
                    show:true,
                    margin:10,
                    clickable:false,
                    interval:"auto",
                  },
                  splitLine:{
                    show:false
                  }
                },

              ],
              yAxis : [
                {
                  type : 'value',
                  axisLabel : {
                    formatter: '{value}',
                    //margin:60
                  },
                  axisLine:{
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                      type: 'solid'
                    }
                  },
                  axisTick:{
                    show:false,
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                    }
                  },
                  splitLine:{
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 1,
                      type: 'solid'
                    }
                  }

                }
              ],
              series : [
                {
                  name:'所有供应商',
                  type:'line',
                  data:[132, 101, 125, 56, 44, 53, 109],
                  markPoint : {
                    clickable:true,
                    data : [
                      {type : 'max', name: '最大值'},
                      {type : 'min', name: '最小值'}
                    ],
                    itemStyle: {
                      normal: {
                        color:"#ff9600"

                      }
                    }
                  },
                  markLine : {
                    data : [
                      {type : 'average', name: '平均值'},
                    ],
                    itemStyle:{
                      normal:{
                        lineStyle:{
                          color:"#ff9600",
                          type:'dashed',
                          width:1
                        }
                      }
                    }
                  },
                  itemStyle:{
                    normal:{
                      lineStyle:{
                        color:"#ff9600",
                        type:'solid',
                        width:1
                      },
                      label:{
                        y:130
                      }
                    }
                  }
                },
                {
                  name:'供应商名称2',
                  type:'line',
                  data:[22, 26, 65, 33, 32, 23, 90],
                  markPoint : {
                    clickable:true,
                    data : [
                      {type : 'max', name: '最大值'},
                      {type : 'min', name: '最小值'}
                    ],
                    itemStyle: {
                      normal: {
                        color:"#c2aaaa"

                      }
                    }
                  },
                  symbol:"emptyCircle",
                  symbolSize: 4,
                  itemStyle:{
                    normal:{
                      lineStyle:{
                        color:"#c2aaaa",
                        type:'solid',
                        width:1
                      },
                      label:{
                        y:130
                      }
                    }
                  }
                },
              ]
            };

            if(scope.small){
              var small=clone.cloneObj(scope.small);

              option.xAxis[0].data=small.xData;

              if(small.title){
                option.title= {
                  text: small.title,
                  textStyle:{
                    fontSize: 13,
                    color:"#999999"
                  },
                  x:'10',
                  y:'10',
                  padding:0
                };
              }

              if(small.legend){
                option.legend={
                  padding:10
                };
                option.legend.data=small.legend.map(function(value){
                  return {
                    name:value.name,
                    textStyle:{
                      color:value.color
                    }
                  };
                });


              }
              option.series=small.yData.map(function(value){
                var tem={};
                tem.name=value.name;
                tem.type="line";
                tem.data=value.data;
                if(value.makePoint){
                  tem.makePoint=value.makePoint;
                }
                if(value.markLine){
                  tem.markLine=value.markLine;
                }
                if(small.symbol){
                  tem.symbol=small.symbol;
                }
                if(small.symbolSize){
                  tem.symbolSize=small.symbolSize;
                }
                tem.itemStyle={
                  normal:{
                    lineStyle:{
                      color:value.color,
                      type:'solid',
                      width:1
                    },
                    label:{
                      y:130
                    }
                  }
                };

                return tem;
              });
              opt=option;
            }
            else if(scope.option){
              opt=clone.copyValue(option,scope.option);
            }else {
              opt=option;
            }
            break;
          case "bar":
            option = {
              tooltip : {
                trigger: 'axis',
                axisPointer:{
                  type: 'line',
                  lineStyle: {
                    color: '#ccc',
                    width: 2,
                    type: 'solid'
                  },
                  crossStyle: {
                    color: '#rf00',
                    width: 1,
                    type: 'dashed'
                  },
                  shadowStyle: {
                    color: 'rgba(150,150,150,0.3)',
                    width: 'auto',
                    type: 'default'
                  }
                }
              },
              toolbox: {
                show : false,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              grid:{
                x:90,
                x2:80,
                y:50,
                y2:50,
              },
              xAxis : [
                {
                  type : 'category',
                  boundaryGap : true,
                  nameTextStyle:{

                  },
                  data : ['FD','RB','MA','SD'],
                  axisLine:{
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                      type: 'solid'
                    }
                  },
                  axisTick:{
                    show:true,
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                    },
                    length:8

                  },
                  axisLabel:{
                    show:true,
                    margin:10,
                    clickable:false,
                    interval:"auto"
                  },
                  splitLine:{
                    show:false
                  }
                },

              ],
              yAxis : [
                {
                  type : 'value',
                  axisLine:{
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 2,
                      type: 'solid'
                    }
                  },

                  splitLine:{
                    lineStyle:{
                      color:"#dfdfdf",
                      width: 1,
                      type: 'solid'
                    }
                  }

                }
              ],
              series : [

                {
                  name:'所有供应商',
                  type:'bar',
                  data:[7500,5300, 9800,6200],
                  barWidth:50,
                  markLine : {
                    data : [
                      {type : 'average', name: '平均值'},
                    ],
                    itemStyle:{
                      normal:{
                        lineStyle:{
                          color:"#ff9600",
                          type:'dashed',
                          width:1
                        }
                      }
                    }
                  },
                  itemStyle:{
                    normal:{
                      color:"#e0e0e0",
                      label:{
                        show: true,
                        position: 'top',
                        y:30,
                        textStyle:{
                          color:"#666",
                          fontSize:20
                        }

                      }
                    }
                  }
                }

              ]
            };

            if(scope.small){
              var small=clone.cloneObj(scope.small);
              //console.log("small____________")
              //console.log(JSON.stringify(small.yData))
              //console.log(small.yData)
              //console.log("___________small____________")
              option.xAxis[0].data=small.xData;
              if(small.bottom){
                  option.grid.y2=small.bottom
              }
              if(small.left){
                option.grid.x=small.left
              }
              if(small.top){
                option.grid.y=small.top
              }
              if(small.right){
                option.grid.x2=small.right
              }
              if(small.xAxis){
                var textStyle={};
                textStyle.fontSize=small.xAxis.fontSize||0;
                if(small.xAxis.color){
                  textStyle.color=small.xAxis.color;
                }
                option.xAxis[0].axisLabel.rotate=small.xAxis.rotate||0;
                option.xAxis[0].axisLabel.textStyle=textStyle;

              }
              if(small.yData)
              option.series=small.yData.map(function(value){
                var tem={};
                tem.type="bar";
                tem.data=value.data;

                tem.barWidth=value.barWidth||50;
                if(value.markLine){
                  tem.markLine=value.markLine;
                }
                //console.log( option.series[0].itemStyle);
                var itemStyle={
                  normal:{
                    color:value.color||"#333",
                    label:{
                      show: true,
                      position: 'top',
                      y:30,
                      textStyle:{
                        color:value.textColor||"#666",
                        fontSize:value.fontSize||18,
                      }

                    }
                  }
                }

                tem.itemStyle=itemStyle;
                return tem;
              });

              opt=option;
            }
            else if(scope.option){
              opt=clone.copyValue(option,scope.option);
            }else {
              opt=option;
            }
            //console.log(opt)
            break;
          default:
            return false;
            break;
        }
        small=null;
        return opt;
      }



      if(attrs.id){
        var  ID=attrs.id;
      }else {
        var num=parseInt(Math.random()*10)+""+parseInt(Math.random()*10)+""+parseInt(Math.random()*10);
        var ID="main"+num;
        element[0].id=ID;
      }
      //$rootScope.$on("repaintChart",function(){
      //  drawChart();
      //});
      scope.$watch("small", drawChart);
      scope.$watch("option", drawChart);

/*      require.config({
        paths: {
          echarts: 'scripts/common/'
        }
      });*/

      //// Step:4 require echarts and use it in the callback.
      //// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
      //require(
      //  [
      //    'echarts',
      //    'echarts/chart/bar',
      //    'echarts/chart/line'
      //  ],
      //  function (ec) {
      //    //--- 折柱 ---
      //    var myChart = ec.init(document.getElementById(ID));
      //
      //
      //    myChart.setOption(initData());
      //
      //  }
      //);
      //drawChart();
      function drawChart(){

        if(attrs.id){
          var  ID=attrs.id;
        }else {
          var num=parseInt(Math.random()*10)+""+parseInt(Math.random()*10)+""+parseInt(Math.random()*10);
          var ID="main"+num;
          element[0].id=ID;
        }

        require.config({
          paths: {
            echarts: 'scripts/common/'
          }
        });
        // Step:4 require echarts and use it in the callback.
        // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
        require(
          [
            'echarts',
            'echarts/chart/bar',
            'echarts/chart/line'
          ],
          function (ec) {
            //--- 折柱 ---
            var myChart = ec.init(document.getElementById(ID));
            if(!scope.small){
              myChart.clear();
              myChart.showLoading({
                text : '暂无数据',
                effect : 'bubble',
                textStyle : {
                  fontSize : 40
                }
              });
              return false;
            }
            var dataOption=initData();
            myChart.setOption(dataOption);

          }
        );
      }


    }
  };



}]);
