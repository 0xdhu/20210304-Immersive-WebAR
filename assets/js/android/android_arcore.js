let scene = document.querySelector('a-scene');
let walker;
let fox;
let idleAnimation;
let sitting = false;

function activateFox() {
    walker = document.querySelector('#walker');
    fox = document.querySelector('#fox');
    idleAnimation = 'Fox_Idle';
    walkAnimation = 'Fox_Run';
}

function activateDino() {
    walker = document.querySelector('#walker2');
    fox = document.querySelector('#dino');
    idleAnimation = 'Idle';
    walkAnimation = 'Walk';
}

function playAnimation(animation) {
    if (fox === document.querySelector('#dino')) {
        sitting = animation.startsWith('Sit') && animation !== 'Sit_Up';
        fox.setAttribute('animation-mixer', { clip: animation });
        const listener = () => {
            fox.setAttribute('animation-mixer', { clip: sitting ? 'Sit_Idle' : idleAnimation });
            fox.removeEventListener('animation-loop', listener);
        };
        fox.addEventListener('animation-loop', listener);
    }
}

const imagesPerScene = 5;
const totalImages = 14;

const initialDistance = 0.5;
const initialWidth = 0.8;
const initialHeight = 0.5;

// add images into scene when app start
const placeImages = () => {
  	for(var i = 0; i < totalImages; i++) {
  		let elem = document.querySelector("#image" + i);

	    elem.setAttribute("width", initialWidth);
	    elem.setAttribute("height", initialHeight);

	    var idx = i % imagesPerScene;
	    var angle = 360 * idx / imagesPerScene;
	    var radian = toRadians(angle);

		elem.object3D.position.x = Math.cos(parseFloat(radian)) * initialDistance;
		elem.object3D.position.y = 0.5;
		elem.object3D.position.z = Math.sin(parseFloat(radian)) * initialDistance;

	    // current entry's rotation
	    elem.object3D.rotation.x = 0;
	    elem.object3D.rotation.y = toRadians(-angle - 90);
	    elem.object3D.rotation.z = 0;
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
	hideAllImages();

	// move some images into the surround of camera so that user can see it
	for(let i = startnum; i < endnum; i++) {
		let elem = document.querySelector("#image" + i);
		elem.object3D.visible = true;
	}
}

// Hide all images
const hideAllImages = () => {
	for(let i = 0; i < totalImages; i++) {
		let elem = document.querySelector("#image" + i);

		elem.object3D.visible = false;
	}
}


function onceSceneLoaded() {
    let raycaster = document.querySelector('[ar-raycaster]');
    let marker = document.querySelector('#intersection');

    activateDino();

    raycaster.addEventListener('raycaster-intersection', function (event) {
        const intersection = event.detail.intersections[0]; //.find(i => i.object.type === 'Scene');
        if (intersection) {
            marker.setAttribute('position', intersection.point);
            marker.setAttribute('visible', true);
            marker.setAttribute('color', 'green');
        }
    });

    raycaster.addEventListener('raycaster-intersection-cleared', function (event) {
        marker.setAttribute('color', 'red');
    });

    const { stringify } = AFRAME.utils.coordinates;

    placeImages();

	// when tap on "next" button, shows another images
	// document.querySelector(".next-button")
	//   .addEventListener("click", function () {

	//     let totalPage = Math.ceil(totalImages / imagesPerScene);
	//     let nextScene = currentScene = (currentScene + 1) % totalPage;

	//     changeImageArray(nextScene);
	//     // update current scene' number
	//     currentScene = nextScene;
	//   });

    let lastEvent = null;
    let alreadyPlaced = false;
    raycaster.addEventListener('click', function () {

    	if(alreadyPlaced) return;

        const currentEvent = new Date().getTime();
        if (lastEvent && (currentEvent - lastEvent < 1000)) {
            return;
        }
        lastEvent = currentEvent;

        alreadyPlaced = true;

        const targetPosition = raycaster.components.cursor
            // this is broken in current A-Frame 1.0.x --> .intersection.point;
            .intersectedEventDetail.intersection.point;
        if (!walker.getAttribute('visible')) {
            walker.setAttribute('visible', true);
            walker.setAttribute('position', stringify(targetPosition));
        } else {
            const currentPosition = walker.object3D.position;
            const distance = currentPosition.distanceTo(targetPosition);
            // face the right way
            walker.object3D.lookAt(targetPosition);
            // make it look like it's walking
            fox.setAttribute('animation-mixer', { clip: walkAnimation });
            // only add completion listener once
            if (!walker.getAttribute('animation')) {
                // once it's there,
                walker.addEventListener('animationcomplete', () => {
                    // make it look like it's idle                    
                    fox.setAttribute('animation-mixer', { clip: idleAnimation });
                });
            }
            // set the animation in new A-Frame 1.0.x style
            walker.setAttribute('animation', {
                property: 'position',
                to: stringify(targetPosition), // just targetPosition doesn't work!?
                dur: distance * 3000,
                easing: 'linear'
            });
            // toggle marker color to show we're doing it 
            marker.setAttribute('color', 'blue');
            setTimeout(() => marker.setAttribute('color', 'green'), 350);
        }
    });
}

// Next Button event
AFRAME.registerComponent('arnextbutton', {
  init: function() {
    this.el.sceneEl.addEventListener("mouseup", this.handleNextButton);
    this.el.sceneEl.addEventListener("click", this.handleNextButton);
  },
  handleNextButton: function () {
    let totalPage = Math.ceil(totalImages / imagesPerScene);
    let nextScene = currentScene = (currentScene + 1) % totalPage;

    changeImageArray(nextScene);
    // update current scene' number
    currentScene = nextScene;
  }

});

scene.addEventListener('loaded', onceSceneLoaded);