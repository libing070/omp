/**
 * 描述：数据库连接辅助类库
 */


// 统一库数据库连接获取
var sqlAdpterHandler = {
	sqlAdapter_nonTransaction : null,			// 统一庄1�7 sqlAdapter（不弄1�7启事务）
	sqlAdapter_transaction : null,				// 统一库sqlAdapter(弄1�7启事劄1�7)

	buildSqlAdapter : function(autoCommit){
		autoCommit = typeof autoCommit == 'boolean' ? autoCommit : false;
		require("ymt.jsse.sqlnew");
		var sqlAdapter = ymt.jsse.sqlnew.open("localDB", 'localDB', autoCommit);
        //var sqlAdapter = ymt.jsse.sqlnew.open("fscxdb", 'fscxdb_slave', autoCommit);
		return sqlAdapter;
	},
	
	getInstance : function(transaction){
		if(transaction){	//弄1�7启事劄1�7
			if(!this.sqlAdapter_transaction){
				this.sqlAdapter_transaction = this.buildSqlAdapter(true);
			}
			return this.sqlAdapter_transaction;
		}else{	//不开启事劄1�7
			if(!this.sqlAdapter_nonTransaction){
				this.sqlAdapter_nonTransaction = this.buildSqlAdapter(false);
			}
			return this.sqlAdapter_nonTransaction;
		}
	},
	
	commitAndClose : function(){
		if(this.sqlAdapter_transaction){
			this.sqlAdapter_transaction.commitAndClose();
			this.sqlAdapter_transaction = null;
		}else{
			logger.error("["+this.sqlAdapter_transaction+"]对象为空,无法手动提交事务!");
		}
	},

	rollbackAndClose : function(){
		if(this.sqlAdapter_transaction){
			this.sqlAdapter_transaction.rollbackAndClose();
			this.sqlAdapter_transaction = null;
		}else{
			logger.error("["+this.sqlAdapter_transaction+"]对象为空，无法回滚事劄1�7!");
		}
	}
};