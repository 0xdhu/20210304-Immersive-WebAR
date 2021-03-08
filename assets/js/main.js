

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


async function checkForXRSupport() {
  // Check to see if there is an XR device available that supports immersive VR
  // presentation (for example: displaying in a headset). If the device has that
  // capability the page will want to add an "Enter VR" button to the page (similar to
  // a "Fullscreen" button) that starts the display of immersive VR content.
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (supported) {
        beginXRSession();
      // var enterXrBtn = document.createElement("button");
      // // enterXrBtn.innerHTML = "Enter AR";
      // enterXrBtn.addEventListener("click", beginXRSession);
      // document.body.appendChild(enterXrBtn);
      // enterXrBtn.click();
    } else {
      console.log("Session not supported: " + reason);
    }
  });
}

function beginXRSession() {
  // requestSession must be called within a user gesture event
  // like click or touch when requesting an immersive session.
  console.log("beginXRSession");
  navigator.xr.requestSession('immersive-ar')
      .then(onSessionStarted)
      .catch(err => {
        // May fail for a variety of reasons. Probably just want to
        // render the scene normally without any tracking at this point.
        // window.requestAnimationFrame(onDrawFrame);
        alert("NO supported AR");
      });
}

let xrSession = null;
let xrReferenceSpace = null;

function onSessionStarted(session) {
  // Store the session for use later.
  xrSession = session;
  alert("arcore supported " + xrSession);
  console.log("arcore supported " + xrSession);

  xrSession.requestReferenceSpace('local')
  .then((referenceSpace) => {
    console("ARcore supported" + referenceSpace);
    xrReferenceSpace = referenceSpace;
  })
  .then(setupWebGLLayer);
}

function setupWebGLLayer() {
  alert("ARcore supported111");
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
                navigator.xr.addEventListener('devicechange', checkForXRSupport);
    			// Navigate to android page
                // is_ARcore_support(baseURL);
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