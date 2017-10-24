/**
  UUID generator
  copy from:http://note19.com/2007/05/27/javascript-guid-generator/
  
  Usage:
    var id=uuid();==>8f9e82ca-1f11-7d37-7b83-2e6ce9142fb2
	var id2=uuidNoConnector();==>465d0c04b1789ec2ad2ba7ceb4e62dce
 */

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function uuid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() + s4();
};
function uuidNoConnector() {
	return s4() + s4() + s4() + s4() +s4() + s4() + s4() + s4();
};

function uuidTransNo(){
	return s4() + s4() + s4() + s4() +s4() + s4() + s4();
}
