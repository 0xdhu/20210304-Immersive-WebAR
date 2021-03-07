const imageURL = 'assets/images/';
// total page = 3
let currentScene = 0; // first page
const imagesPerScene = 5;
const totalImages = 14;

const initialDistance = 10;

window.onload = function () {
  // add all images when load page
  addImageEntries();

  // load the first 5 images
  changeImageArray(currentScene);

	document
  .querySelector(".next-button")
  .addEventListener("click", function () {
    currentScene = (currentScene + 1) % Math.ceil(totalImages / imagesPerScene);
    alert(currentScene);

    changeImageArray(currentScene);
  });
};

const addImageEntries = () => {
  var scene = document.querySelector('a-scene');

  for(var i = 0; i < totalImages; i++) {
    var elem = document.createElement('a-image');

    elem.setAttribute("width", 6.4);
    elem.setAttribute("height", 4);

    var idx = i % imagesPerScene;
    var angle = 360 * idx / imagesPerScene;
    var radian = toRadians(angle);

    elem.object3D.position.x = 0;
    elem.object3D.position.y = 0;
    elem.object3D.position.z = 0;

    elem.object3D.rotation.x = 0;
    elem.object3D.rotation.y = toRadians(-angle - 90);
    elem.object3D.rotation.z = 0;

    elem.setAttribute("id", "image"+i);
    elem.setAttribute("radian", radian);
    elem.setAttribute("src", imageURL + "Pic" + (i + 1) + ".jpg");

    scene.appendChild(elem);
  }
}

const toDegrees = (radian) => {
  return radian * (180 / Math.PI);
}

const toRadians = (angle) => {
  return angle * (Math.PI / 180);
}

const changeImageArray = (sceneNumber) => {
  let startnum = sceneNumber * imagesPerScene;
  let endnum = Math.min(startnum + imagesPerScene, totalImages);

  resetImagePosition();

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
AFRAME.registerComponent('soundhandler', {
  init: function() {
    this.cam = document.querySelector("[camera]");
    this.sphere = document.querySelector(".a-custombox");
  },
  tick: function () {
    var entity = document.querySelector('[sound]');

    let camPos = this.cam.object3D.position;
    let spherePos = this.sphere.object3D.position;
    let distance = camPos.distanceTo(spherePos);

    console.log(distance);
    if (distance < 0.8) {
      // camera closer than 5m, do something
      entity.components.sound.playSound();
    } else {
      entity.components.sound.pauseSound();
    }

    // if (document.querySelector('a-marker').object3D.visible == true) {
    //     entity.components.sound.playSound();
    // } else {
    //     entity.components.sound.pauseSound();
    // }
  }
});