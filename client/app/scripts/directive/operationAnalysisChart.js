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
app.directive('usersnalysischart', [
		'$rootScope',
		function($rootScope) {
			return {

				restrict : 'EA',
				replace : true,
				transclude : true,
				scope : {
					option : '=',
					small : "="
				},

				template : '<div  class="usersnalysischart" ></div>',
				link : function(scope, element, attrs) {
					function initData(small) {
						var opt;
						var option = {};
						switch (attrs.type) {
						case 'pie':
							option = {
								title : {
									text : small.title,
									subtext : '',
									x : 'left'
								},
								tooltip : {
									trigger : 'item',
									formatter : "{a} <br/>{b} : {c} ({d}%)"
								},
								legend : {
									orient : 'vertical',
									left : 'left',
									data : []
								},
								series : [ {
									name : '',
									type : 'pie',
									radius : '65%',
									center : [ '50%', '60%' ],
									data : small.series,
									itemStyle : {
										emphasis : {
											shadowBlur : 10,
											shadowOffsetX : 0,
											shadowColor : 'rgba(0, 0, 0, 0.5)'
										}
									}
								} ]
							};

							break;
						case 'line':
							option = {
								title : {
									text : small.title,
									left : 'center'
								},
								tooltip : small.tooltip,
								legend :small.legend,
								xAxis : {
									type : 'category',
									name : '',
									splitLine : {
										show : false
									},
									data : small.xData
								},
								grid : {
									left : '3%',
									right : '4%',
									bottom : '3%',
									containLabel : true
								},
								yAxis :small.yAxis,
								series : small.series
							};

							break;
						default:
							return false;
							break;
						}
						return option;
					}

					scope.$watch("small", drawChart);
					function drawChart() {

						if (attrs.id) {
							var ID = attrs.id;
						} else {
							var num = parseInt(Math.random() * 10) + ""
									+ parseInt(Math.random() * 10) + ""
									+ parseInt(Math.random() * 10);
							var ID = "operationMain_" + num;
							element[0].id = ID;
						}

						require.config({
							paths : {
								echarts : 'scripts/common/'
							}
						});
						// Step:4 require echarts and use it in the callback.
						// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
						require([ 'echarts', 'echarts/chart/bar',
								'echarts/chart/line', 'echarts/chart/pie' ],
								function(ec) {
									//--- 折柱 ---
									var myChart = ec.init(document
											.getElementById(ID));
									if (!scope.small) {
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
									var dataOption = initData(scope.small);
									myChart.setOption(dataOption);

								});
					}

				}
			};

		} ]);
