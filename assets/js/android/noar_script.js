window.onload = function () {
  	document
    .querySelector(".say-hi-button")
    .addEventListener("click", function () {
      	// alert("Hi there!");
      	changeImageArray();
    });
};

const changeImageArray = () => {
	document
    .querySelector(".a-custombox")
    .setAttribute("color", "green");

	document
    .querySelector(".image")
    .setAttribute("src", "../../assets/images/one.jpg");
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