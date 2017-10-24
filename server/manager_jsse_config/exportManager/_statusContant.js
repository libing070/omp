//商品订单状态
var goodsOrderStatusMap = {
	'1': '待支付',
	'2': '已支付',
	'3': '超时取消',
	'4': '已确定分期',
	'5': '确认中',
	'6': '保险公司拒保',
	'7': '完成出单',
	'8': '已退费',
	'9': '已取消',
	'10': '欠款',
	'11': '已退保'
};

//电子保单状态
var policyStatusMap = {
	'1': '未激活',
	'2': '系统投保',
	'3': '系统转投保单失败',
	'4': '系统转投保单成功',
	'5': '核保通过',
	'6': '核保不通过',
	'7': '公司已支付',
	'8': '系统转保单失败',
	'9': '系统转保单成功',
	'10': '已退费',
	'11': '已退保',
	'12': '欠款',
	'14': '已取消'
};

//用户状态
var userStatusMap = {
	'1': '正常用户',
	'2': '测试用户',
	'3': '黑名单'
};

//科目
var subjectMap = {
	'1': '保费',
	'2': '批改缴费',
	'3': '批改退费',
	'4': '核保失败退费',
	'5': '投保失败退费',
	'6': '退保',
	'7': '车船税'
};
//报检单表的quotationStatus，报价单状态
var quotationQSMap={
		'1':'未报价',
		'2':'已报价',
		'3':'报价失败' 
};
//报检单表的lockStatus，报价单锁定状态
var quotationLSMap={
		'1':'未锁定',
		'2':'已锁定'
};