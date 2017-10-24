/**
 * 鎻忚堪锛氭暟鎹簱杩炴帴杈呭姪绫诲簱
 */


// 缁熶竴搴撴暟鎹簱杩炴帴鑾峰彇
var sqlAdpterHandler = {
	sqlAdapter_nonTransaction : null,			// 缁熶竴搴� sqlAdapter锛堜笉寮�鍚簨鍔★級
	sqlAdapter_transaction : null,				// 缁熶竴搴搒qlAdapter(寮�鍚簨鍔�)

	buildSqlAdapter : function(autoCommit){
		autoCommit = typeof autoCommit == 'boolean' ? autoCommit : false;
		require("ymt.jsse.sqlnew");
		var sqlAdapter = ymt.jsse.sqlnew.open("localDB", 'localDB', autoCommit);
        //var sqlAdapter = ymt.jsse.sqlnew.open("fscxdb", 'fscxdb_slave', autoCommit);
		return sqlAdapter;
	},
	
	getInstance : function(transaction){
		if(transaction){	//寮�鍚簨鍔�
			if(!this.sqlAdapter_transaction){
				this.sqlAdapter_transaction = this.buildSqlAdapter(true);
			}
			return this.sqlAdapter_transaction;
		}else{	//涓嶅紑鍚簨鍔�
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
			logger.error("["+this.sqlAdapter_transaction+"]瀵硅薄涓虹┖,鏃犳硶鎵嬪姩鎻愪氦浜嬪姟!");
		}
	},

	rollbackAndClose : function(){
		if(this.sqlAdapter_transaction){
			this.sqlAdapter_transaction.rollbackAndClose();
			this.sqlAdapter_transaction = null;
		}else{
			logger.error("["+this.sqlAdapter_transaction+"]瀵硅薄涓虹┖锛屾棤娉曞洖婊氫簨鍔�!");
		}
	}
};