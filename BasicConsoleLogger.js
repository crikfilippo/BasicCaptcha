class BasicConsoleLogger{
	
	
	//-----------------
	//--BASIC JS CONSOLE LOGGER--
	//-----------------
	//
	//@author Filippo Maria Grilli
	//@github crikfilippo
	//@version 1.0.0
	//@since 2026-05-25
	//@license MIT
	//@link https://github.com/crikfilippo/BasicConsoleLogger
	//
	//-----------------
	//---USE EXAMPLE---
	//-----------------
	//
	//let basicConsoleLogger = new BasicConsoleLogger({'instanceName':'BasicConsoleLogger' ,'logEnabled':true});
	//
	//basicConsoleLogger.log('this is a simple use case - standard log');
	//basicConsoleLogger.warn('this is a simple use case - warning log');
	//basicConsoleLogger.error('this is a simple use case - error log');
	//  
	//basicConsoleLogger.log(['this is an advanced use case - standard log','trunk 1','trunk 2'],'callerFunctionName',0);
	//basicConsoleLogger.log(['this is an advanced use case - warn log','trunk 1','trunk 2'],'callerFunctionName',1);
	//basicConsoleLogger.log(['this is an advanced use case - error log','trunk 1','trunk 2'],'callerFunctionName',2);
	//
	//try{ basicConsoleLogger.log(['this is an advanced use case - error log re-throwing the error','trunk 1','trunk 2'],'callerFunctionName',2,true); }catch(e){ console.log(e); }
	//
	
	instanceName = undefined;
	isLogEnabled = undefined;

	constructor(
		params = { 
			isLogEnabled : true,
			instanceName : "" 
		}
	 ){
		 
		this.isLogEnabled = params.isLogEnabled ?? true;
		this.instanceName = params.instanceName ?? "";		

	}
	
	//logging utility
	log(trunks = ['hey'],fName = '',level = 0,throwError = false){
		
		if( ! this.isLogEnabled && ! throwError ){ return; }
		trunks = Array.isArray(trunks) ? trunks : [trunks];
		fName = this.instanceName+(this.instanceName.length > 0 ? ' ' : '')+fName+' : ';
		var aggregatedTrunks = '';
		
		//strigify objects
		for(var [t,trunk] of trunks.entries()){
			var errMsg,errStack,wasCustom;
			try{ errMsg = trunk.message; }catch(p){ errMsg = null; }
			//try{ errStack = trunk.stack; }catch(p){ errStack = null; }
			//try{ wasCustom = trunk.isCustom; }catch(p){ wasCustom = false; }
			trunks[t] = ( this.isNumberOrString(trunk) ? trunk : (errMsg == null ? JSON.stringify(trunk) : errMsg) ); 
			aggregatedTrunks = aggregatedTrunks + trunks[t] + '; ';
		}
		
		//warning log
		if(level == 1){
			console.warn('[WARNING] '+fName,...trunks); 
		}
		
		//error log
		else if(level == 2){
			
			for(var [t,trunk] of trunks.entries()){
				
				//log each trunk
				if( ! throwError  ){	
					console.error('[ERROR] '+fName,trunk); 	
				}  
				
				//throw an error on last trunk
				else if( t == (trunks.length - 1) ) { 
				
					var errMsg,errStack,wasCustom;
					try{ errMsg = trunk.message; }catch(p){ errMsg = null; }
					//try{ errStack = trunk.stack; }catch(p){ errStack = null; }
					try{ wasCustom = trunk.isCustom; }catch(p){ wasCustom = false; }
			
					var e = new Error( wasCustom ? errMsg : ( fName+aggregatedTrunks ) ); //no readding headers
					e.isCustom = true; 
					e.stack = errStack;
					throw(e); 
					
				}
			}
		}
		
		//standard log
		else{ 
			console.log('[LOG] '+fName,...trunks); 
		}
		
	}

	//log an error
	error(trunks = ['hey'],fName = '',throwError = false){
		
		this.log(trunks,fName,2,throwError);
		
	}

	//log a warning
	warn(trunks = ['hey'],fName = ''){
		
		this.log(trunks,fName,1);
	
	}
	
	//check if a variable is a numebr o a string
	isNumberOrString(v){
		
		return ['number','string'].indexOf(typeof(v)) > -1;
		
	}

}
