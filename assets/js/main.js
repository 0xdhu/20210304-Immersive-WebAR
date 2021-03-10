
// Sub directories, some android devices doesnot support ARcore
// In this case, we do this in another way
const android_arcore = 'android_arcore.html';
const android_3dof = 'android_3DOF.html';
const ios = 'ios.html';
const ios_composer = 'assets/models/ios/model.usdz';
let baseURL = "";
let xrSession = null;

// Redirect
const redirect_android_3dof = () => {
    location.href = baseURL + android_3dof;
}

const redirect_android_arcore = () => {
    location.href = baseURL + android_arcore;
}

const redirect_ios_arkit = () => {
    location.href = baseURL + ios_composer;
}
const redirect_ios_3dof = () => {
    location.href = baseURL + ios;
}


// Display warning message if user doesnot use iPhone/iPad/Android
const warningText = "You need to browse this website on iPhone/iPad or Android";

// check if your mobile is android/iphone/ipad or not
const checkPlatform = () => {
    const toMatch = [
        /Android/i,
        /iPhone/i,
        /iPad/i,
    ];

    baseURL = base_url() + "/20210304-Immersive-WebAR/";
    // alert(baseURL);
    let isMobile = false;

    // check each platform
    toMatch.some((toMatchItem) => {

    	// check if current platform match to this param
    	if(navigator.userAgent.match(toMatchItem)) {

    		// Android Platform
    		if(String(toMatchItem) === "/Android/i") {
    			isMobile = true;

                if(isBrowser_Support()) {
                    // now we need to check XRsession and ARcore
                    navigator.xr.addEventListener('devicechange', checkForXRSupport);    
                } else {
                    // this browser doesnot support xr
                    redirect_android_3dof();
                }
    		} 

    		// iOS Platform
    		else if(String(toMatchItem) === "/iPhone/i" || String(toMatchItem) === "/iPad/i") {
    			isMobile = true;
    			// Navigate to iOS page
    			if(is_ARkit_support()) {
                    redirect_ios_arkit();
    			} else {
                    redirect_ios_3dof();
                }
    		}
    	}	
    });

    if(!isMobile) document.getElementById('warning').innerHTML = warningText;
}


// Get domain name
const base_url = () => {
  var    a      = document.createElement('a');
         a.href = location.href;
  return "https://" + a.hostname;
}

/********************   Android *******************/

// check if your browser support XR
const isBrowser_Support = () => {
    // xr doesnot support Firefox
    // xr doesnot support below Chrome 81
    // xr support Edge
    if ("xr" in window.navigator) {
        /* WebXR can be used! */
        return true;
    } else {
        /* WebXR isn't available */
        return false;
    }
}

// check xrsession capability in browser
const checkForXRSupport = () => {
    // Check to see if there is an XR device available that supports immersive VR
    // presentation (for example: displaying in a headset). If the device has that
    // capability the page will want to add an "Enter VR" button to the page (similar to
    // a "Fullscreen" button) that starts the display of immersive VR content.
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
            console.log("Session supported");

            var enterXrBtn = document.createElement("button");
            enterXrBtn.innerHTML = "Tap on this button to enter AR experience";
            enterXrBtn.addEventListener("click", beginXRSession);
            document.body.appendChild(enterXrBtn);
            // enterXrBtn.click();
        } else {
            // alert("Session not supported");
            console.log("Session not supported:");

            redirect_android_3dof();
        }
    });
}

const beginXRSession = () => {
    if(!xrSession) {
        // requestSession must be called within a user gesture event
        // like click or touch when requesting an immersive session.
        // console.log("beginXRSession");
        navigator.xr.requestSession('immersive-vr')
            .then((session) => {
                xrSession = session;
                onSessionStarted(xrSession);
            })
            .catch(err => {
                // May fail for a variety of reasons. Probably just want to
                // render the scene normally without any tracking at this point.
                // window.requestAnimationFrame(onDrawFrame);
                console.log("Session cannot start reason: " + err);
                // redirect_android_3dof();
            });
    }
}

const onSessionStarted = (session) => {
    //Store the session for use later.
    console.log("arcore supported " + xrSession);

    redirect_android_arcore();
}

// check if your android mobile browser support AR
// const is_ARcore_support = (baseURL) => {
//     // alert("is AR core support");
//     if (navigator.xr) {
//         navigator.xr.isSessionSupported('immersive-ar')
//         .then((isSupported) => {
//             if (isSupported) {
//                 requestARsession(baseURL);
//             } else {
//                 location.href = baseURL + android_3dof;
//                 // return false;
//             }
//         });
//     } else {
//         location.href = baseURL + android_3dof;
//         // return false;
//     }
// }

// check if your ios mobile browser support AR
const is_ARkit_support = () => {
    const a = document.createElement("a");
    if (a.relList.supports("ar")) {
      // AR is available.
      return true;
    } else return false;
}