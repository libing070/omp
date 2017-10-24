/**
 * 精友库车型领域对象
 */
var JYKCarfileDomain = {
	/**
	 * 描述：查询精友库DB文件列表
	 * @param
	 * @return 
	 */
	listjykCar : function(sqlExecute, status){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.name,a.fileResourceID,a.status,b.httpUrl,"
				  +"date_format(a.createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from jykcarfile a,fileresources b where a.fileResourceID=b.id "
				  + (status ? "and a.status=@status " : "")
				  +"order by a.lastUpdate DESC",
			param : {
				status : status
			},
			recordType:"object",
			resultType:"string"
		});
		var jykCarList = JSON.parse(retStr);
		return jykCarList;
	},
	
	/**
	 * 描述：查询精友库DB文件
	 * @param
	 * @return 
	 */
	findjykCarByID : function(sqlExecute, id){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.name,a.fileResourceID,a.status,b.httpUrl,"
				  +"date_format(a.createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from jykcarfile a,fileresources b where a.fileResourceID=b.id and a.id=@id",
			param : {
				id : id
			},
			recordType:"object",
			resultType:"string"
		});
		var jykCar = JSON.parse(retStr)[0];
		return jykCar;
	},
	
	/**
	 * 描述：查询精友库DB文件
	 * @param
	 * @return 
	 */
	findjykCarByName : function(sqlExecute, name){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.name,a.fileResourceID,a.status,"
				  +"date_format(a.createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from jykcarfile a where a.name=@name",
			param : {
				name : name
			},
			recordType:"object",
			resultType:"string"
		});
		var jykCar = JSON.parse(retStr)[0];
		return jykCar;
	},
	
	/**
	 * 描述：删除精友库DB文件
	 * @param
	 * @return 
	 */
	deletejykCarByID : function(sqlExecute, id){
		var retStr = sqlExecute.execute({
			sql:"delete from jykcarfile where id = @id",
			param : {
				id : id
			},
			returnRowId:"false"
		});
	},
	
	/**
	 * 描述：删除精友库文件资源
	 * @param
	 * @return 
	 */
	deleteFileResourcesByID : function(sqlExecute, fileResourceID){
		var retStr = sqlExecute.execute({
			sql:"delete from fileresources where id = @fileResourceID",
			param : {
				fileResourceID : fileResourceID
			},
			returnRowId:"false"
		});
	},
	
	
	/**
	 * 描述：新增精友库DB文件
	 * @param
	 * @return 
	 */
	addjykCar : function(sqlExecute, name, fileResourceID, status){
		var jykCarID = JSON.parse(sqlExecute.execute({
			sql:"insert into jykcarfile(name,fileResourceID,status,createTime,lastUpdate) "
				+"values(@name,@fileResourceID,@status,now(),now())",
			param : {
				name : name,
				fileResourceID : fileResourceID,
				status : status
			},
			returnRowId:"true"
		}));
		return jykCarID;
	},
	
	/**
	 * 描述：编辑精友库DB文件
	 * @param
	 * @return 
	 */
	editjykCar : function(sqlExecute, id, name, fileResourceID){
		var retStr = sqlExecute.execute({
			sql:"update jykcarfile set name=@name,fileResourceID=@fileResourceID,lastUpdate=now() where id=@id",
			param : {
				id : id,
				name : name,
				fileResourceID : fileResourceID
			},
			returnRowId:"false"
		});
	},
	
	/**
	 * 描述：新增精友库文件资源
	 * @param
	 * @return 
	 */
	addFileResources : function(sqlExecute, httpUrl, groupName, remoteFileName){
		var fileResourceID = JSON.parse(sqlExecute.execute({
			sql:"insert into fileresources(httpUrl,groupName,remoteFileName,createTime,lastUpdate) "
				+"values(@httpUrl,@groupName,@remoteFileName,now(),now())",
			param : {
				httpUrl : httpUrl,
				groupName : groupName,
				remoteFileName : remoteFileName
			},
			returnRowId:"true"
		}));
		return fileResourceID;
	},
	
	/**
	 * 描述：删除精友库文件资源
	 * @param
	 * @return 
	 */
	deleteFileResources : function(sqlExecute, fileResourceID){
		var retStr = sqlExecute.execute({
			sql:"delete from fileresources where id = @fileResourceID",
			param : {
				fileResourceID : fileResourceID
			},
			returnRowId:"false"
		});
	},
	
	
	/**
	 * 描述：删除精友库文件资源
	 * @param
	 * @return 
	 */
	updatejykcarFileStatus : function(sqlExecute, id, status){
		var retStr = sqlExecute.execute({
			sql:"update jykcarfile set status = @status"
				+ (id ? ",lastUpdate=now() where id = @id " : ""),
			param : {
				id : id,
				status : status
			},
			returnRowId:"false"
		});
	}
};