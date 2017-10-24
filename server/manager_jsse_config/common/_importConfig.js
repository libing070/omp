require("ymt.jsse.ConfigEnabler");
var YBHConfig = ymt.jsse.ConfigEnabler.readPropertyConfig("YBHConfig.properties");
//报表访问根路径
var reportUrlPre = YBHConfig.getProperty("reportUrlPre");
//web_bas鉴权失败后跳转到的地址，一般为登陆地址 http://{EASPortal}/admin/portal/login.jsp
var logoutUrl = YBHConfig.getProperty("logoutUrl");
//报价单有效期天数
var quotationValidDay = YBHConfig.getProperty("quotationValidDay");