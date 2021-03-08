

// Get domain name
const base_url = () => {
  var    a      = document.createElement('a');
         a.href = location.href;
  return "https://" + a.hostname;
}

// check if your ios mobile browser support AR
const is_ARkit_support = () => {
	const a = document.createElement("a");
	if (a.relList.supports("ar")) {
	  // AR is available.
	  return true;
	} else return false;
}

// check if your android mobile browser support AR
const is_ARcore_support = (baseURL) => {
    // alert("is AR core support");
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-ar')
        .then((isSupported) => {
            if (isSupported) {
                requestARsession(baseURL);
            } else {
                location.href = baseURL + android_3dof;
                // return false;
            }
        });
    } else {
        location.href = baseURL + android_3dof;
        // return false;
    }
}


const requestARsession = async (baseURL) => {
    const xrSession = await navigator.xr.requestSession("immersive-ar");
    if(xrSession) {
        alert("YES");
        location.href = baseURL + android_arcore;
    } else {
        alert("NO");
        location.href = baseURL + android_3dof;
    }
}

// Sub directories, some android devices doesnot support ARcore
// In this case, we do this in another way
const android_arcore = 'android_arcore.html';
const android_3dof = 'android_3DOF.html';
const ios = 'ios.html';
const ios_composer = 'assets/models/ios/model.usdz';

// Display warning message if user doesnot use iPhone/iPad/Android
const warningText = "You need to browse this website on iPhone/iPad or Android";

// check if your mobile is android/iphone/ipad or not
const checkPlatform = () => {
    const toMatch = [
        /Android/i,
        /iPhone/i,
        /iPad/i,
    ];

    let baseURL = base_url() + "/20210304-Immersive-WebAR/";
    // alert(baseURL);
    let isMobile = false;

    // check each platform
    toMatch.some((toMatchItem) => {

    	// check if current platform match to this param
    	if(navigator.userAgent.match(toMatchItem)) {

    		// Android Platform
    		if(String(toMatchItem) === "/Android/i") {
    			isMobile = true;
    			// Navigate to android page
                is_ARcore_support(baseURL);
                // if(is_ARcore_support(baseURL)) {
                //     location.href = baseURL + android_arcore;
                // } else {
                //     location.href = baseURL + android_3dof;
                // }
    		} 

    		// iOS Platform
    		else if(String(toMatchItem) === "/iPhone/i" || String(toMatchItem) === "/iPad/i") {
    			isMobile = true;
    			// Navigate to iOS page
    			if(is_ARkit_support()) {
    				location.href = baseURL + ios_composer;
    			} else {
                    location.href = baseURL + ios;
                }
    		}
    	}	
    });

    if(!isMobile) document.getElementById('warning').innerHTML = warningText;
}