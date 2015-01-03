window.onload = function () {

(function() {
	
	function loadjscssfile(filename, filetype){
   if (filetype=="js"){ 
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
   }
   else if (filetype=="css"){ 
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
   }
   if (typeof fileref!="undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
  }

  loadjscssfile("proto.css", "css")


	var videoWrapper = document.createElement('div')
	videoWrapper.id = 'videoWrapper'
	
	var videoElement = document.createElement('video')
	videoElement.id = 'videoElement'
	videoElement.style.display = 'none'

	videoWrapper.appendChild(videoElement)
	document.body.appendChild(videoWrapper)

	var vdr = document.createElement('img')

  var LiveRailVPAID,
		vpaidFrame,
		vpaidLoader,
		adURL,
		impression,
		vdrObj = {
			slot: videoWrapper,
      videoSlot: videoElement,
      videoSlotCanAutoPlay: true
		};

	var scripts = document.getElementsByTagName("script");
	
	for (var i = 0, len = scripts.length; i < len; i++) {
		if (scripts[i].getAttribute("id") === 'vidroll') {
			var src = scripts[i].getAttribute("src").split("?")
		  //var url = src[0]
		  var args = src[1]
		  args = args.split('&')

		  for (var j = 0; j < args.length; j++) {
		  	var key = args[j].split('=')[0]
		  	var val = args[j].split('=')[1]
		  	vdrObj[key] = val
		  };
			break;
		};
	}

	vidroll.addEventListener("dispatchTrackingPixel", function(e) {
    if (e.detail.data.indexOf("http://t4.liverail.com/?metric=adslot") == 0) {
        var adslot = e.detail.data.split('adslot')
        impression = adslot[0]+'impression'+adslot[1]
        console.log('-----------------------------------> impression', impression)
        vdr.src = impression
    }
	});

	function onVPAIDLoad() {
		LiveRailVPAID.subscribe(function() {
			LiveRailVPAID.startAd()
			LiveRailVPAID.stopAd()
			adURL = document.getElementById('videoElement').getAttribute("src")
			
			adink = 'http://www.google.com';
			//console.log('adURL', adURL)

			var vrAdcontainer = document.createElement('div')
			vrAdcontainer.className = 'vr-con'
			vrAdcontainer.id = 'vr-con'
			var vrAd = document.createElement('div')
			var vrAdLink = document.createElement('a')
			vrAdLink.id = 'adLink'
			vrAdLink.href = adink
			vrAdLink.target = 'new'
			vrAd.appendChild(vrAdLink)
			var vrHolder = document.createElement('img')
			vrHolder.id = 'adHolder'
			vrAd.className = 'vr-ad'
			var adImg = new Image()
			adImg.onload = function() {
        		
				if ('naturalHeight' in this) {
					if (this.naturalHeight + this.naturalWidth === 0) {
						this.onerror();
						return;
					}
				} else if (this.width + this.height == 0) {
					this.onerror();
					return;
				}
        // At this point, there's no error.
       			 vrAdLink.appendChild(vrHolder)
				document.getElementById('adHolder').src = adImg.src;
				startInteraction();
				
		//document.getElementById('anim').src = myanim.src;
	    };
	    adImg.onerror = function() {
	        
	        document.body.appendChild(
	            document.createTextNode('\nError loading as image: ' + this.src)
	        );
	    };
	    
	    if (adURL !== null) {
	    	//console.log('---> impression', impression)
				vdr.src = impression	    	
				var encodedURL = adURL.split("/").join("%2F").split(":").join("%3A")

		    var baseURL = "http://vidroll-platform-w9iqwmtitm.elasticbeanstalk.com/ad/"//"http://vidroll-platform-w9iqwmtitm.elasticbeanstalk.com/ad/"
		   // adImg.src = baseURL + encodedURL
			adImg.src = 'https://s3.amazonaws.com/mobile-video-ads/me.mp4.gif';
		    //adImg.src = adURL//vrGif;

				
				vrAdcontainer.appendChild(vrAd)
				document.body.appendChild(vrAdcontainer)
	    }
	
			//var vrAd = '<div class="vr-con" id="vr-con"><div class="vr-ad"><img src="'+ vrGif +'"/></div></div>'
			
			//document.body.insertAdjacentHTML( 'beforeend', vrAd );
			//var vrAdcontainer = document.getElementById('vr-con'); //define ad container
			
			//vrAdcontainer.style.display='block';
			
      var vrAdwait = 0; //waiting time for Gif to load
      var vrAdlength = vrAdwait + 9000; //dynamic time lenght of GIF
     var vrDestroytime = vrAdlength + 3000; //  + 3000 (css animation duration) 
      
	  function startInteraction() {
		 setTimeout(function(){ 
			vrAdcontainer.style.display='block'; // show ad when the dom is ready
		   },vrAdwait)
				
		  // add .hideanim class to start animation 
		 setTimeout(function(){ 
			vrAdcontainer.classList.add("hideanim");
		   },vrAdlength)
			
		  // after animation done, hide then destroy the ad container
		setTimeout(function(){
		  vrAdcontainer.style.display='none';
		  vrAdcontainer.parentNode.removeChild(vrAdcontainer);
		  },vrDestroytime)
	  
	  }

    }, 'AdLoaded')
		LiveRailVPAID.initAd(videoElement.offsetWidth, videoElement.offsetHeight, 'normal', 600, {}, vdrObj)
	};

	vpaidFrame = document.createElement('iframe')
	vpaidFrame.style.display = 'none'
	vpaidFrame.onload = function() {
    vpaidLoader = vpaidFrame.contentWindow.document.createElement('script')
    vpaidLoader.src = 'http://vidroll-platform-w9iqwmtitm.elasticbeanstalk.com/LiveRail.AdManager-1.0.js'
    vpaidLoader.onload = function() {
        LiveRailVPAID = vpaidFrame.contentWindow.getVPAIDAd()
        LiveRailVPAID.handshakeVersion('2.0')
        onVPAIDLoad()
    };
    vpaidFrame.contentWindow.document.body.appendChild(vpaidLoader)
	};
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		}
	};
	if (isMobile.Android() || isMobile.iOS() ) {
		document.body.appendChild(vpaidFrame)	
	} 
}());

}