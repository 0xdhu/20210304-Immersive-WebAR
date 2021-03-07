
const imageURL = 'assets/images/';

const imagesPerScene = 5;
const totalImages = 14;

const initialDistance = 10;
const initialWidth = 6.4;
const initialHeight = 4;

let currentScene = 0; // first page

// main load
window.onload = function () {
  // add all images when load page
  addImageEntries();

  // show the first 5 images
  changeImageArray(currentScene);

  // when tap on "next" button, shows another images
	document
  .querySelector(".next-button")
  .addEventListener("click", function () {

    let totalPage = Math.ceil(totalImages / imagesPerScene);
    let nextScene = currentScene = (currentScene + 1) % totalPage;

    changeImageArray(nextScene);
    // update current scene' number
    currentScene = nextScene;
  });

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