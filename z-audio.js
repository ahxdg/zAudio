/**
 *	author:   togor
 *	time:     2016-12-21
 *	describe: zAudio plug js
 *  version:  1.0
 **/

window.onload = function(){

	var au = document.getElementsByTagName('audio'),
		auArray = [];

	/* Filter out plugins useing audio */
	for (var i = 0; i < au.length; i++) {
		if (au[i].attributes['data-audio'].value == 'z-audio') {
			auArray.push(au[i]);
		}
	}

	/* call function */
	for(var i = 0; i < auArray.length; i++){
		var src = auArray[i].attributes['src'].value;
		zAudio.call(auArray[i]);
	}

	/* define function */
	function zAudio(){
		var _this = this,
			src = _this.attributes['src'].value;	
		
		_this.appear = function(){
			/* add audio controls used to display nodes.*/
			_this.setAttribute('controls','controls');

			/* Initialization nodes */
			var audioBox = document.createElement('div');

			/* Detemine whether the node has src attributes,if not and give a response prompt. */
			if (src) { 
				/* Initialization nodes/audioStyle */
				var audioStyle = _this.attributes['data-style'] ? _this.attributes['data-style'].value : 'default';
				var button = document.createElement('span');
				var timeLine = document.createElement('div');
				var overLine = document.createElement('span');
				var point = document.createElement('i');
				var audioTime = document.createElement('span');
				var audio = _this.cloneNode(true);

				audioBox.setAttribute('class','zAudio zAudio-'+audioStyle);
				button.setAttribute('class','zAudio-button z-play disabled');
				timeLine.setAttribute('class','timeLine');
				overLine.setAttribute('class','overLine');
				audioTime.setAttribute('class','audioTime z-load');
				point.setAttribute('class','point');

				audioBox.appendChild(button);
				overLine.appendChild(point);
				timeLine.appendChild(overLine);
				audioBox.appendChild(timeLine);
				audioBox.appendChild(audioTime);
				audioBox.appendChild(audio);

				_this.parentNode.insertBefore(audioBox,_this);
				
				/* Dynamically set the width of the timeline. */
				timeLine.style.width = audioBox.offsetWidth - button.offsetWidth - audioTime.offsetWidth - 70 + 'px';
				timeLine.style.left = button.offsetWidth + 36 + 'px';

				/* set circle audio */
				if (audioStyle == 'circle') {
					button.style.lineHeight = audioBox.offsetHeight + 'px';
					button.style.fontSize = audioBox.offsetHeight/4 + 'px';
					var audioCover = audio.getAttribute('data-cover');
					if (audioCover) {
						audioBox.style.backgroundImage = 'url('+audioCover+')';
					}
				}

				/* Set timer to get audio length, */
				var duration,seter;
				var s = setInterval(function(){
					if (isNaN(audio.duration)) {
						return false;
					}else{
						clearInterval(s);
						/* Dynamically set the audioTime and set to can play state. */
						duration = audio.duration;
						audioTime.innerHTML = formatTime(duration);
						removeCla(button,'disabled');
						removeCla(audioTime,'z-load');
					}
				},200);

				/* bind event */
				bindEvent(button,'click',function(){
					if (hasCla(button,'disabled')) {
						return false;
					}else if (hasCla(button,'z-play')) {
						/* play audio */
						audio.play();
						removeCla(button,'z-play');
						addCla(button,'z-stop');
						var allAudio = document.getElementsByTagName('audio');
						for (var i = 0; i < allAudio.length; i++) {
							allAudio[i].setAttribute('data-playStatus','false');
						}
						audio.setAttribute('data-playStatus','true');
						/* Dynamic display audio remaining time. */
						seter = setInterval(function(){
							audioTime.innerHTML = formatTime(duration- audio.currentTime);
							overLine.style.width = (audio.currentTime/duration) * 100 + '%';

							/* audio play end, clear interval. */
							if (duration - audio.currentTime <= 0 || audio.getAttribute('data-playStatus') == 'false') {
								clearInterval(seter);
								removeCla(button,'z-stop');
								addCla(button,'z-play');
								audio.pause();
							}
						},100);

					}else if(hasCla(button,'z-stop')){

						/* stop play, clear interval. */
						clearInterval(seter);

						audio.pause();
						audioTime.innerHTML = formatTime(duration- audio.currentTime);
						removeCla(button,'z-stop');
						addCla(button,'z-play');
						audio.setAttribute('data-playStatus','false');
					}
				});
			}else{
				/* not find audio src,show tips. */
				var tips = document.createElement('p');
				tips.setAttribute('class','error-tips')
				tips.innerHTML = 'this audio not have src.';
				audioBox.appendChild(tips);
				_this.parentNode.insertBefore(audioBox,_this);
			}
			
			/* remove the original audio node. */
			_this.parentNode.removeChild(_this);
		};
		
		_this.appear();
	}
	
	/* audio currentTime format. */
	function formatTime(time){
		time = Math.ceil(time);
		var h = Math.floor(time/3600);
		var m = Math.floor((time%3600)/60);
		var s = (time%3600)%60;
		function addZero(obj){
			if (obj<10) {
				return '0'+obj;
			}else{
				return obj;
			}
		}
		if (h<=0) {
			time = addZero(m) + ':' + addZero(s);
		}else{
			time = addZero(h) + ':' + addZero(m) + ':' + addZero(s);
		}
		return time;
	}
	/* bind function use */
	function removeCla(obj,cla){
		var _cla = obj.getAttribute('class');
		_cla = _cla.replace(cla,'');
		_cla = _cla.replace('  ',' ');
		obj.setAttribute('class',_cla);
	}
	function hasCla(obj,cla){
		if (obj.getAttribute('class').indexOf(cla)>=0) {
			return true;
		}else{
			return false;
		}
	}
	function addCla(obj,cla){
		var _cla = obj.getAttribute('class');
		if (_cla.charAt(_cla.length-1) == ' ') {
			_cla = _cla + cla;
		}else{
			_cla = _cla + ' ' + cla;
		}
		obj.setAttribute('class',_cla);
	}
	function bindEvent(obj,type,fn){
		if(obj.attachEvent){obj.attachEvent('on'+type,fn);}
		else{obj.addEventListener(type,fn,false)}
	}
}