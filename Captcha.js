class BasicCaptcha{
	
	//-----------------
	//--BASIC CAPTCHA--
	//-----------------
	//
	//@author Filippo Maria Grilli
	//@github crikfilippo
	//@version 1.0.0
	//@since 2026-01-15
	//@license MIT
	//@link https://github.com/crikfilippo/basic_captcha
	//
	//-----------------
	//---USE EXAMPLE---
	//-----------------
	//
	//let captcha = new Captcha({'wrapperQuery':'#captcha-wrapper' ,'logEnabled':true ,'audioPauseDurationMs':800});
	//captcha.setAudioNodes('.captcha_audio');
	//captcha.setAudioPlayer('#captcha_audio_button');
	//  

	instanceName = undefined;
	wrapper = undefined;
	logEnabled = undefined;
	audio = {	
		nodes : []
		,buttons : { play : undefined }
		,waitMs : undefined
	};

	//constructor
	constructor(params = {}){ 
		const fName = 'constructor';
		try{
			
			//check and default params
			params.instanceName = params.instanceName ?? 'Basic Captcha';
			params.wrapperQuery = params.wrapperQuery ?? '#captcha-wrapper';
			params.logEnabled = params.logEnabled ?? true;
			params.audioPauseDurationMs = params.audioPauseDurationMs ?? 800;
			
			this.instanceName = params.instanceName;
			this.logEnabled = params.logEnabled;
			this.log('loading...',fName);
			this.wrapper = document.querySelector(params.wrapperQuery);
			if(this.wrapper == undefined){ this.error('wrapper node not found',fName,true); }
			this.audio.waitMs = params.audioPauseDurationMs;
			
		}catch(e){ this.error(e,fName,true); }
	}

	//fetch all the <audio> nodes to play
	setAudioNodes(audioNodeQuery = 'audio'){
		const fName = 'setAudioNodes';
		try{
			
			this.audio.nodes = document.querySelectorAll(audioNodeQuery);
			if(this.audio.nodes.length == 0){ this.warning('no audio nodes found',fName); }
			
		}catch(e){ this.error(e,fName,true); }
	}
	
	//set the player controls
	setAudioPlayer(playButtonQuery = 'button'){
		const fName = 'setAudioPlayer';
		try{
		
			this.audio.buttons.play = document.querySelector(playButtonQuery);
			if(this.audio.buttons.play == undefined){ this.error('play button not found',fName,true);  }

			this.audio.buttons.play.addEventListener('click', async () => {
				this.audio.buttons.play.setAttribute('disabled',true);
				this.playAudio();
				this.audio.buttons.play.removeAttribute('disabled',true);
				
			});
			
		}catch(e){ this.error(e,fName,true); }
	}

	//play all the audio files
	async playAudio(){
		const fName = 'playAudio';
		try{
			for(const audioNode of this.audio.nodes){
				audioNode.play(); 
				await this.waitForAudioToEnd(audioNode); 
				await this.wait(this.audio.waitMs); 
			}
		}catch(e){ this.error(e,fName,true); }
	}

	//wait for the audio to end
	async waitForAudioToEnd(audioNode = undefined) {
		const fName = 'waitForAudioToEnd';
		try{
			if(audioNode == undefined){ this.error('audio node not found',fName,true);  }
			return new Promise((resolve) => {
				audioNode.addEventListener('ended', resolve, { once: true });
			});
		
		}catch(e){ this.error(e,fName,true); }
	}

	//wait utility
	async wait(ms = undefined) {
		ms = ms == undefined ? this.waitMs : ms;
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	//logging utility
	log(trunks = ['hey'],fName = '',level = 0,throwError = false){
		if( ! this.logEnabled && ! throwError ){ return; }
		trunks = Array.isArray(trunks) ? trunks : [trunks];
		fName = this.instanceName+' '+fName+' : ';
		for(var [t,trunk] of trunks.entries()){ trunks[t] = ( ['number','string'].indexOf(typeof(trunk)) > -1 ? trunk : JSON.stringify(trunk) ); } //strigify objects
		if(level == 1){ console.warn('[WARNING] '+fName,...trunks); }
		else if(level == 2){
			for(var [t,trunk] of trunks.entries()){
				if(throwError && t == (trunks.length - 1)){
					var wasCustom = false; //check if was custom thrown
					try{ wasCustom = JSON.parse(trunk); wasCustom = (trunk.isCustom ?? false); }catch(p){ wasCustom = false; }
					var e = new Error(( wasCustom ? '' : ('[ERROR] '+fName) )+trunk); //no readding headers
					e.isCustom = true; 
					throw(e); 
				}  
				else{ console.error('[ERROR] '+fName,trunk); }
			}
		}
		else{ console.log('[LOG] '+fName,...trunks); }
	}

	//logging utility
	error(trunks = ['hey'],fName = '',throwError = false){
		this.log(trunks,fName,2,throwError);
	}

	//logging utility
	warning(trunks = ['hey'],fName = ''){
		this.log(trunks,fName,1);
	}

}
