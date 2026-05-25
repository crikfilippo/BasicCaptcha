class BasicCaptcha{
	
	//-----------------
	//--BASIC CAPTCHA--
	//-----------------
	//
	//@author Filippo Maria Grilli
	//@github crikfilippo
	//@version 1.0.1
	//@since 2026-01-15
	//@license MIT
	//@link https://github.com/crikfilippo/basic_captcha
	//
	//-----------------
	//---USE EXAMPLE---
	//-----------------
	//
	//let captcha = new Captcha({'wrapperQuery':'#captcha-wrapper' ,'isLogEnabled':true ,'audioPauseDurationMs':800});
	//captcha.setAudioNodes('.captcha_audio');
	//captcha.setAudioPlayer('#captcha_audio_button');
	//  

	instanceName = undefined;
	wrapper = undefined;
	isLogEnabled = undefined;
	audio = {
		nodes : []
		,buttons : { play : undefined }
		,waitMs : undefined
	};
	logger = undefined;

	//constructor
	constructor(params = {}){ 
		const fName = 'constructor';
		try{
			
			//check and default params
			this.instanceName = params.instanceName ?? 'Basic Captcha';
			this.isLogEnabled = params.isLogEnabled ?? true;
            try{ this.logger = new BasicConsoleLogger({instanceName : this.instanceName, isLogEnabled : this.isLogEnabled}); }
			catch(e){ this.logger = undefined; }
			this.log('loading...',fName);
			this.wrapper = document.querySelector(params.wrapperQuery ?? '#captcha-wrapper');
			if(this.wrapper == undefined){ this.error('wrapper node not found ('+(params.wrapperQuery ?? '#captcha-wrapper')+')',fName,true); }
			this.audio.waitMs = params.audioPauseDurationMs ?? 800;
			
			
		}catch(e){ this.error(e,fName,true); }
	}

	//fetch all the <audio> nodes to play
	setAudioNodes(audioNodeQuery = 'audio'){
		const fName = 'setAudioNodes';
		try{
			
			this.audio.nodes = document.querySelectorAll(audioNodeQuery);
			if(this.audio.nodes.length == 0){ this.warn('no audio nodes found',fName); }
			
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
				this.playAudio().then(() => {
				    this.audio.buttons.play.removeAttribute('disabled');
                });
				
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
		ms = ms == undefined ? this.audio.waitMs : ms;
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	//logging utility
	log(a,b,c,d){ if(this.logger == undefined){ console.log(a,b,c,d); }else{ this.logger.log(a,b,c,d); } }
	error(a,b,c){ if(this.logger == undefined){ console.error(a,b,c); }else{ this.logger.error(a,b,c); } }
	warn(a,b){ if(this.logger == undefined){ console.warn(a,b); }else{ this.logger.warn(a,b); } }

}
