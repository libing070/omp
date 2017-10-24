/**
 * Created by lujun on 12/21/2015.
 */
"use strict";
app
  .factory("clone",function(){
    var clone={};
    function  _clone(obj){
      switch( typeof (obj)){
        case "string":
        case "number":
        case  "boolean":
          return obj;
          break;
        case  "undefined":
          return false;
          break;
        case "object":
          var tem;
          if(obj==null){
            tem= null;
          }else {
            if(obj instanceof Array){
              tem=[];
              for(var i=0;i<obj.length;i++){
                tem.push(_clone(obj[i]));
              }

            }else {
              tem={};
              for(var k in  obj){
                tem[k] = _clone(obj[k]);
              }
            }
          }
          return tem;
      }

    }
    clone.cloneObj=function(obj){
          return _clone(obj);
    };
    clone.copyValue=function(obj,values){
      for(var i in values){
        obj[i]=values[i];

      }
      return obj;
    };

    return clone;
  });

