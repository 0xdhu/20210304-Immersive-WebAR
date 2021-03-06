

// Get domain name
const base_url = () => {
  var    a      = document.createElement('a');
         a.href = location.href;
  return "https://" + a.hostname;
}

// check if your ios mobile browser support AR
const is_ARkit_support = () => {
	alert("is ARkit support");
	const a = document.createElement("a");
	if (a.relList.supports("ar")) {
	  // AR is available.
	  return true;
	} else return false;
}

// check if your android mobile browser support AR
const is_ARcore_support = () => {
	alert("is AR core support");
	if (navigator.xr) {
	  	navigator.xr.isSessionSupported('immersive-vr')
	  	.then((isSupported) => {
		    if (isSupported) {
		    	if ("xr" in window.navigator) {
				    // WebXR can be used! 
		    		return true;
				} else {
					// WebXR cannot be available
					return false;
				}	      
		    } else return false;
	  	});
	} else return false;
}

// Sub directories, some android devices doesnot support ARcore
// In this case, we do this in another way
const android_browser = 'src/android/android.html';
const android_arnosupport_browser = 'src/android/noar_android.html';
const ios_browser = 'assets/ios/model.usdz';

// Display warning message if user doesnot use iPhone/iPad/Android
const warningText = "You need to browse this website on iPhone/iPad or Android";

// check if your mobile is android/iphone/ipad or not
const checkPlatform = () => {
    alert("check Platform");
    const toMatch = [
        /Android/i,
        /iPhone/i,
        /iPad/i,
    ];

    let baseURL = base_url() + "/20210304-Immersive-WebAR/";
    alert(baseURL);
    let isMobile = false;

    // check each platform
    toMatch.some((toMatchItem) => {

    	// check if current platform match to this param
    	if(navigator.userAgent.match(toMatchItem)) {

    		// Android Platform
    		if(String(toMatchItem) === "/Android/i") {
    			isMobile = true;
    			// Navigate to android page
    			if(is_ARcore_support()) {
	    			location.href = baseURL + android_browser;
	    		} else {
	    			location.href = baseURL + android_arnosupport_browser;
	    		}
    		} 

    		// iOS Platform
    		else if(String(toMatchItem) === "/iPhone/i" || String(toMatchItem) === "/iPad/i") {
    			isMobile = true;
    			// Navigate to iOS page
    			if(is_ARkit_support()) {
    				location.href = baseURL + ios_browser;
    			}
    		} else {
    			alert("Nothing");
    		}
    	}	
    });

    if(isMobile) document.getElementById('warning').innerHTML = warningText;
}