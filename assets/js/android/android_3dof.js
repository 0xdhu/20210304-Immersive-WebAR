
const imageURL = 'assets/images/';

const imagesPerScene = 5;
const totalImages = 14;

const initialDistance = 20;
const initialWidth = 6.4;
const initialHeight = 4;

let currentScene = 0; // first page

// video params
var ctx;

var videoCanvas;
var videoContext;

// var videoContextStack = [];

//image to video via Whammy
var recordedVideo;

// endvideo

// main load
window.onload = function () {
  
  videoCanvas = document.getElementById("videoCanvas");
  videoContext = videoCanvas.getContext("2d");

  new THREE.WebGLRenderer({
    canvas: videoCanvas,
    antialias: true,
    alpha: true
  });
  
  // add all images when load page
  addImageEntries();

  // show the first 5 images
  changeImageArray(currentScene);

  // when tap on "next" button, shows another images
	document.querySelector(".next-button").addEventListener("click", function () {

    let totalPage = Math.ceil(totalImages / imagesPerScene);
    let nextScene = currentScene = (currentScene + 1) % totalPage;

    changeImageArray(nextScene);
    // update current scene' number
    currentScene = nextScene;
  });

  document.querySelector(".capture-button").addEventListener("click", function() {
    //takePicture();
  });

  document.querySelector(".capture-button").addEventListener("touchstart", touchstart, false);
  document.querySelector(".capture-button").addEventListener("touchend", touchend, false);

  // document.querySelector("a-scene").querySelector(".nextarbutton").addEventListener("click", function () {
  //   let totalPage = Math.ceil(totalImages / imagesPerScene);
  //   let nextScene = currentScene = (currentScene + 1) % totalPage;

  //   changeImageArray(nextScene);
  //   // update current scene' number
  //   currentScene = nextScene;
  // });

  // Raycaster event on each image
  var imgElems = document.querySelectorAll(".clickable");

  imgElems.forEach((imgElem) => {

    imgElem.addEventListener('click', () => {

      // reset all images entry as none selected
      imgElems.forEach((elem) => {
        // elem.setAttribute("raycaster-live", "false");
        elem.setAttribute("gesture-handler", "enabled: false");

        // set elems as default = `1`
        elem.object3D.scale.x = 1;
        elem.object3D.scale.y = 1;
        elem.object3D.scale.z = 1;
      })

      // imgElem.setAttribute("raycaster-live", "true");
      imgElem.setAttribute("gesture-handler", "enabled: true");
    });
  });

};

var onlongtouch; 
var timer;
var updateTimer;
var touchduration = 500; //length of time we want the user to touch before we do something
var longTouched = false;

touchstart = (e) => {
    // if(videoContextStack.length > 0) return;

    e.preventDefault();
    ctx = 0;
    longTouched = false;
    timer = setTimeout(onlongtouch, touchduration); 
}

touchend = (e) => {
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

let ARvideo;
let ARscene;

onlongtouch = () => { 
    ARvideo = document.querySelector("video");
    ARscene = document.querySelector("canvas[class='a-canvas a-grab-cursor']");

    longTouched = true;
    // videoCanvas.width = 500;
    // videoCanvas.height = 300;

    recordedVideo = new Whammy.Video(20);

    console.log("Take Recording ... ");
    updateTimer = setInterval(takeRecord, 33);

    // takeRecord();
};

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

// convert radian to degree
const toDegrees = (radian) => {
  return radian * (180 / Math.PI);
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

function resizeCanvas(origCanvas, width, height)
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

    resizedContext.drawImage(origCanvas, offsetX, 0, w, h);
    return resizedCanvas.toDataURL();
}



function captureVideoFrame(video, format, width, height)
{
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

// screenshot
const takePicture = () => {
  let video = document.querySelector("video");

  video.pause();

  let aScene = document.querySelector("a-scene").components.screenshot.getCanvas("perspective");

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
  });

  video.play();
}

function resizeRecordCanvas(origCanvas, width, height)
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
// record video
const takeRecord = () => {
  if(timer) {
    let video = ARvideo;

    // video.pause();

    //let aScene = document.querySelector("a-scene").components.screenshot.getCanvas("perspective");
    let aScene = ARscene;



    let ww = aScene.width / aScene.height * screen.height;
    let offsetx = (ww - screen.width) / 2

    let vw = video.videoWidth/video.videoHeight * screen.height;
    let voffsetx = (vw - screen.width) / 2;
    // aScene = resizeRecordCanvas(aScene, screen.width, screen.height);

    // video.play();
    
    // videoCanvas.width = screen.width;
    // videoCanvas.height = screen.height;

    // videoContext.clearRect(0, 0, screen.width, screen.height);
    videoContext.globalAlpha = 1;

    // videoContext.drawImage(video, -voffsetx, 0, vw, screen.height);
    // videoContext.drawImage(aScene, -offsetx, 0, ww, screen.height);
    
    // videoContext.drawImage(aScene, 0, 0);



    recordedVideo.add(videoContext);

    ctx++;
  } else {
    console.log("Take Record Update NO");
    return;
  }
}

/* main process function */
function process(b64) {
    var dataUri = b64;
    var img = new Image();
  
    //load image and drop into canvas
    img.onload = function() {
        videoContext.clearRect(0,0,videoContext.canvas.width,videoContext.canvas.height);
        videoContext.globalAlpha = 1;
        videoContext.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);
        recordedVideo.add(videoContext);
        ctx++;
    };
    img.src = dataUri;
}

const finalizeVideo = () => {
  if(ctx == 0) return;

  var output = recordedVideo.compile();
  var url = webkitURL.createObjectURL(output);

  document.getElementById('download').href = url;
  document.getElementById('download').click();

  // videoContextStack = [];
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