/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.2 },
    maxScale: { default: 1 }, // 8
  },

  init: function () {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = true;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.initialDistance = 7;
    // this.el.sceneEl.addEventListener("markerFound", (e) => {
    //   this.isVisible = true;
    // });

    // this.el.sceneEl.addEventListener("markerLost", (e) => {
    //   this.isVisible = false;
    // });
  },

  update: function () {
    if (this.data.enabled) {
      // this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
    } else {
      // this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function () {
    // this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function (event) {
    if (this.isVisible) {
      this.el.object3D.rotation.y += 0;
        // event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x += 0;
        // event.detail.positionChange.y * this.data.rotationFactor;
    }
  },

  handleScale: function (event) {
    if (this.isVisible) {
      // Position management <<<<<<<<<<<<      
      this.scaleFactor *= 1 - event.detail.spreadChange / (event.detail.startSpread * 4);

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      let diagonaLength = this.el.object3D.position.x * this.el.object3D.position.x + this.el.object3D.position.z * this.el.object3D.position.z;
      this.el.object3D.position.x = this.initialDistance * this.el.object3D.position.x / diagonaLength * this.scaleFactor;
      //this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.position.z = this.initialDistance * this.el.object3D.position.z / diagonaLength * this.scaleFactor;
      
      // Scale management <<<<<<<<<<<<<<<
      // this.scaleFactor *=
      //   1 + event.detail.spreadChange / event.detail.startSpread;


      // this.scaleFactor = Math.min(
      //   Math.max(this.scaleFactor, this.data.minScale),
      //   this.data.maxScale
      // );

      // this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      // this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      // this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },
});
