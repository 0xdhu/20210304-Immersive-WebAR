// Base URL for image asset
const imageURL = 'assets/images/';

/************************
** Placement for images
************************/

// Count of images to show for each scene
const imagesPerScene = 5;
// Total count of images to show in app
const totalImages = 14;
// Initial distance to each images from user
const initialDistance = 20;
// Initial width of image
const initialWidth = 6.4;
// Initial height of image
const initialHeight = 4;
// Scene number
let currentScene = 0;

/************************************************
** Main video and canvas for webcam and ar camera
*************************************************/

// video tag for webcam
let ARvideo;
// canvas (scene) for ar camera
let ARscene;

/*************** 
* Record Screen 
****************/

// canvas to show recorded screen
let resultCanvas;
// context for canvas to show recorded screen
let resultContext;
// video container via Whammy
let whammyVideo;


/****************** 
** Long touch event 
******************/

// timer for setTimeOut
let timer;
// update call for record screen
let updateTimer;
// length of time we want the user to touch before we do something
let touchduration = 500; // millisecond
// check if longTouch launched
let longTouched = false;

// Main function
window.onload = function () {
  // result canvas to merge webcam and arcamera
  resultCanvas = document.getElementById("resultCanvas");
  resultContext = resultCanvas.getContext("2d");

  // add all images when load page
  addImageEntries();

  // show the first 5 images
  changeImageArray(currentScene);

  // Event handler for next button to show another images
	document.querySelector(".next-button").addEventListener("click", function () {

    let totalPage = Math.ceil(totalImages / imagesPerScene);
    let nextScene = currentScene = (currentScene + 1) % totalPage;

    // Display next images bundle
    changeImageArray(nextScene);

    // update current scene' number
    currentScene = nextScene;
  });

  // Event handler for capture button 
  document.querySelector(".capture-button").addEventListener("click", function() {
    // Take screenshot and share it
    takePicture();
  });

  // Event handler for long-touch on capture button
  // document.querySelector(".capture-button").addEventListener("touchstart", touchstart, false);
  // document.querySelector(".capture-button").addEventListener("touchend", touchend, false);

  // Grab all image entries
  var imgElems = document.querySelectorAll(".clickable");
  
  // Raycaster event on each image
  imgElems.forEach((imgElem) => {

    imgElem.addEventListener('click', () => {

      // reset all images entry as none selected
      imgElems.forEach((elem) => {
        elem.setAttribute("gesture-handler", "enabled: false");

        // set elems as default = `1`
        elem.object3D.scale.x = 1;
        elem.object3D.scale.y = 1;
        elem.object3D.scale.z = 1;
      })

      // focused on Image
      imgElem.setAttribute("gesture-handler", "enabled: true");
    });
  });

};

/********* Place and Switch images ********/

// add images into scene when app start
const addImageEntries = () => {
  var scene = document.querySelector('a-scene');

  for(var i = 0; i < totalImages; i++) {
    var elem = document.createElement('a-image');

    // entry's size
    elem.setAttribute("width", 6.4);
    elem.setAttribute("height", 4);

    var idx = i % imagesPerScene;
    var angle = 360 * idx / imagesPerScene;
    var radian = toRadians(angle);

    // initial positon for each entry
    elem.object3D.position.x = 0;
    elem.object3D.position.y = 0;
    elem.object3D.position.z = 0;

    // current entry's rotation
    elem.object3D.rotation.x = 0;
    elem.object3D.rotation.y = toRadians(-angle - 90);
    elem.object3D.rotation.z = 0;

    // current entry's ID
    elem.setAttribute("id", "image"+i);
    // current entry's rotation in radian
    elem.setAttribute("radian", radian);
    // image source path
    elem.setAttribute("src", imageURL + "Pic" + (i + 1) + ".jpg");
    // gesture handler
    elem.setAttribute("gesture-handler", "minScale: 1; maxScale: 2");
    // only if true, gesture-handler work on this object.
    // elem.setAttribute("raycaster-live", "false");
    // add class's attribute
    elem.setAttribute("class", "clickable");


    scene.appendChild(elem);
  }
}
// convert degree to radian
const toRadians = (angle) => {
  return angle * (Math.PI / 180);
}

// load another images
const changeImageArray = (sceneNumber) => {
  let startnum = sceneNumber * imagesPerScene;
  let endnum = Math.min(startnum + imagesPerScene, totalImages);

  // move all images to future so that user cannot see any images
  resetImagePosition();

  // move some images into the surround of camera so that user can see it
  for(let i = startnum; i < endnum; i++) {
    let elem = document.querySelector("#image" + i);
    let radian = elem.getAttribute("radian");


    elem.object3D.position.x = Math.cos(parseFloat(radian)) * initialDistance;
    elem.object3D.position.y = 0;
    elem.object3D.position.z = Math.sin(parseFloat(radian)) * initialDistance;

    console.log(typeof(radian) + radian + " " + elem.object3D.position.x + " " + elem.object3D.position.z);
  }
}

const resetImagePosition = () => {
  for(let i = 0; i < totalImages; i++) {
    let elem = document.querySelector("#image" + i);

    elem.object3D.position.x = 1000;
    elem.object3D.position.y = 1000;
    elem.object3D.position.z = 1000;
  }
}

/********** Take Screenshot *************/
// screenshot
const takePicture = () => {
  let video = document.querySelector("video");

  video.pause();
  document.querySelector("a-scene").components.screenshot.capture("perspective");
  /* let aScene = document.querySelector("a-scene").components.screenshot.getCanvas("perspective");

  let frame = captureVideoFrame("video", "png");

  aScene = resizeCanvas(aScene, frame.width, frame.height);
  frame = frame.dataUri;

  startTimes = Date.now();
  mergeImages([frame, aScene]).then(b64 =>
  {
    var fileName = 'webar-experience' + '-' + Date.now() + '.png';
    var linkEl = document.createElement('a');

    linkEl.href = b64;
    linkEl.setAttribute('download', fileName);
    linkEl.innerHTML = 'downloading...';
    linkEl.style.display = 'none';

    document.body.appendChild(linkEl);

    setTimeout(function () {
      linkEl.click();
      document.body.removeChild(linkEl);
    }, 1);
  }); */

  video.play();
}

const resizeCanvas = (origCanvas, width, height) => {
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    if (screen.width < screen.height)
    {
        var w = height * (height / width);
        var h = width * (height / width);
        var offsetX = -(height - width);
    }
    else
    {
        var w = width;
        var h = height;
        var offsetX = 0;
    }
    resizedCanvas.height = height;
    resizedCanvas.width = width;

    resizedContext.drawImage(origCanvas, offsetX, 0, w, h);
    return resizedCanvas.toDataURL();
}

const captureVideoFrame = (video, format, width, height) => {
    if (typeof video === 'string')
    {
        video = document.querySelector(video);
    }

    format = format || 'jpeg';

    if (!video || (format !== 'png' && format !== 'jpeg'))
    {
        return false;
    }

    var canvas = document.createElement("CANVAS");

    canvas.width = width || video.videoWidth;
    canvas.height = height || video.videoHeight;

    console.log("canvas width and height " + canvas.width + " " + canvas.height);
    
    canvas.getContext('2d').drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL('image/' + format);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5)

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++)
    {
        arr[i] = bytes.charCodeAt(i);
    }

    var blob = new Blob([ arr ], { type: mimeType });
    return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
}

/*********** Long touch Event ****************/

// touch begin on capture button
const touchstart = (e) => {
    e.preventDefault();

    longTouched = false;

    // if touch is delayed for touchduration, launch event for recording
    timer = setTimeout(onlongtouch, touchduration); 
}

// touch end on capture button
const touchend = (e) => {
    e.preventDefault();
    //stops short touches from firing the event
    if (timer)
      clearTimeout(timer); // clearTimeout, not cleartimeout..
    
    if (updateTimer)
      clearInterval(updateTimer);

    if(longTouched == false) {
      takePicture();
    } else {
      finalizeVideo();
    }

    longTouched = false;
}

// event handler for longtouch
const onlongtouch = () => { 
    ARvideo = document.querySelector("video");
    ARscene = document.querySelector("canvas[class='a-canvas a-grab-cursor']");

    longTouched = true;

    whammyVideo = new Whammy.Video(20);

    console.log("Take Recording ... ");
    updateTimer = setInterval(takeRecord, 33);

    // takeRecord();
};

/************ Record Screen *****************/
// record video
const takeRecord = () => {
  if(timer) {
    let video = ARvideo;
    let aScene = ARscene;
    //let aScene = document.querySelector("a-scene").components.screenshot.getCanvas("perspective");

    var vcontext = aScene.getContext("experimental-webgl", {preserveDrawingBuffer: true});

    let ww = aScene.width / aScene.height * screen.height;
    let offsetx = (ww - screen.width) / 2

    let vw = video.videoWidth/video.videoHeight * screen.height;
    let voffsetx = (vw - screen.width) / 2;
    // aScene = resizeRecordCanvas(aScene, screen.width, screen.height);

    resultCanvas.width = screen.width;
    resultCanvas.height = screen.height;

    resultContext.clearRect(0, 0, screen.width, screen.height);
    resultContext.globalAlpha = 1;

    // resultContext.drawImage(video, -voffsetx, 0, vw, screen.height);
    // resultContext.drawImage(aScene, -offsetx, 0, ww, screen.height);
    
    var elsm = document.createElement("a");
    elsm.href = aScene.toDataURL();
    elsm.setAttribute('download', "fileName.png");
    elsm.innerHTML = 'downloading...';
    elsm.style.display = 'none';
    elsm.click();
    
    resultContext.drawImage(vcontext, 0, 0);
    

    whammyVideo.add(resultContext);

    ctx++;
  } else {
    console.log("Take Record Update NO");
    return;
  }
}

const resizeRecordCanvas = (origCanvas, width, height) =>
{
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");


    if (screen.width < screen.height)
    {
        var w = height * (height / width);
        var h = width * (height / width);
        var offsetX = -(height - width);
    }
    else
    {
        var w = width;
        var h = height;
        var offsetX = 0;
    }
    resizedCanvas.height = height;
    resizedCanvas.width = width;

    console.log("resized canvas " + w + " ** " + h + " ** " + offsetX + " ** " + origCanvas.width + " ** " + origCanvas.height);
    resizedContext.drawImage(origCanvas, offsetX, 0, w, h);
    return resizedCanvas; //.toDataURL();
}

// finalize and download recorded video
const finalizeVideo = () => {
  var output = whammyVideo.compile();
  var url = webkitURL.createObjectURL(output);

  document.getElementById('download').href = url;
  document.getElementById('download').click();
}

// Next Button event
// AFRAME.registerComponent('arnextbutton', {
//   init: function() {
//     let elem = document.querySelector(".nextarbutton").addEventListener("mouseup", this.handleNextButton);
//     elem = document.querySelector("a-scene").querySelector(".nextarbutton").addEventListener("click", this.handleNextButton);
//     // this.el.addEventListener("mouseup", this.handleNextButton);
//     // this.el.addEventListener("click", this.handleNextButton);
//   },
//   handleNextButton: function () {
//     let totalPage = Math.ceil(totalImages / imagesPerScene);
//     let nextScene = currentScene = (currentScene + 1) % totalPage;

//     changeImageArray(nextScene);
//     // update current scene' number
//     currentScene = nextScene;
//   }

// });

// Audio Trigger inner AR
// AFRAME.registerComponent('soundhandler', {
//   init: function() {
//     this.cam = document.querySelector("[camera]");
//     this.sphere = document.querySelector(".a-custombox");
//   },
//   tick: function () {
//     var entity = document.querySelector('[sound]');

//     let camPos = this.cam.object3D.position;
//     let spherePos = this.sphere.object3D.position;
//     let distance = camPos.distanceTo(spherePos);

//     console.log(distance);
//     if (distance < 0.8) {
//       // camera closer than 5m, do something
//       entity.components.sound.playSound();
//     } else {
//       entity.components.sound.pauseSound();
//     }

//     // if (document.querySelector('a-marker').object3D.visible == true) {
//     //     entity.components.sound.playSound();
//     // } else {
//     //     entity.components.sound.pauseSound();
//     // }
//   }
// });

// function captureVideoFrame(video, format, width, height)
// {
//     if (typeof video === 'string')
//     {
//         video = document.querySelector(video);
//     }

//     format = format || 'jpeg';

//     if (!video || (format !== 'png' && format !== 'jpeg'))
//     {
//         return false;
//     }

//     var canvas = document.createElement("CANVAS");

//     canvas.width = width || video.videoWidth;
//     canvas.height = height || video.videoHeight;
//     canvas.getContext('2d').drawImage(video, 0, 0);
//     var dataUri = canvas.toDataURL('image/' + format);
//     var data = dataUri.split(',')[1];
//     var mimeType = dataUri.split(';')[0].slice(5)

//     var bytes = window.atob(data);
//     var buf = new ArrayBuffer(bytes.length);
//     var arr = new Uint8Array(buf);

//     for (var i = 0; i < bytes.length; i++)
//     {
//         arr[i] = bytes.charCodeAt(i);
//     }

//     var blob = new Blob([ arr ], { type: mimeType });
//     return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
// }

/* main process function */
// function process(b64) {
//     var dataUri = b64;
//     var img = new Image();
  
//     //load image and drop into canvas
//     img.onload = function() {
//         resultContext.clearRect(0,0,resultContext.canvas.width,resultContext.canvas.height);
//         resultContext.globalAlpha = 1;
//         resultContext.drawImage(img, 0, 0, resultCanvas.width, resultCanvas.height);
//         whammyVideo.add(resultContext);
//         ctx++;
//     };
//     img.src = dataUri;
// }
// // convert radian to degree
// const toDegrees = (radian) => {
//   return radian * (180 / Math.PI);
// }

