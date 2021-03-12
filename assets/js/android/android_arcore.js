let scene = document.querySelector('a-scene');
let walker;

const imageURL = 'assets/images/';

const imagesPerScene = 5;
const totalImages = 14;

const initialDistance = 15;
const initialWidth = 6.4;
const initialHeight = 4;

let currentScene = 0; // first page

// Activate object to place
function activateObject() {
    walker = document.querySelector('#walker');
}

// add images into walker when app start
const addImageEntries = () => {
  	// var scene = document.querySelector('a-scene');

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

		walker.appendChild(elem);
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

const resetImagePosition = () => {
	for(let i = 0; i < totalImages; i++) {
		let elem = document.querySelector("#image" + i);

		elem.object3D.position.x = 1000;
		elem.object3D.position.y = 1000;
		elem.object3D.position.z = 1000;
	}
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


function onceSceneLoaded() {
    let raycaster = document.querySelector('[ar-raycaster]');
    let marker = document.querySelector('#intersection');

    activateObject();

    // addImageEntries();

    let targetPosition = null;
  	// when tap on "next" button, shows another images
	// document
 //  	.querySelector(".next-button")
 //  	.addEventListener("click", function () {
	//     let totalPage = Math.ceil(totalImages / imagesPerScene);
	//     let nextScene = currentScene = (currentScene + 1) % totalPage;

	//     changeImageArray(nextScene, targetPosition);
	//     // update current scene' number
	//     currentScene = nextScene;
	// });

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

    let lastEvent = null;
    let alreadyPlaced = false;
    raycaster.addEventListener('click', function () {
    	if(alreadyPlaced == true) return;

        const currentEvent = new Date().getTime();
        if (lastEvent && (currentEvent - lastEvent < 1000)) {
            return;
        }

        lastEvent = currentEvent;

        targetPosition = raycaster.components.cursor
            // this is broken in current A-Frame 1.0.x --> .intersection.point;
            .intersectedEventDetail.intersection.point;

        if (!walker.getAttribute('visible')) {
            // walker.setAttribute('visible', true);
            walker.setAttribute('position', stringify(targetPosition));
            // addImageEntries();

    		// changeImageArray(currentScene);

            alreadyPlaced = true;
        } 
        // else {
        //     const currentPosition = walker.object3D.position;
        //     const distance = currentPosition.distanceTo(targetPosition);
        //     // face the right way
        //     walker.object3D.lookAt(targetPosition);
        //     // make it look like it's walking
        //     fox.setAttribute('animation-mixer', { clip: walkAnimation });
        //     // only add completion listener once
        //     if (!walker.getAttribute('animation')) {
        //         // once it's there,
        //         walker.addEventListener('animationcomplete', () => {
        //             // make it look like it's idle                    
        //             fox.setAttribute('animation-mixer', { clip: idleAnimation });
        //         });
        //     }
        //     // set the animation in new A-Frame 1.0.x style
        //     walker.setAttribute('animation', {
        //         property: 'position',
        //         to: stringify(targetPosition), // just targetPosition doesn't work!?
        //         dur: distance * 3000,
        //         easing: 'linear'
        //     });
        //     // toggle marker color to show we're doing it 
        //     marker.setAttribute('color', 'blue');
        //     setTimeout(() => marker.setAttribute('color', 'green'), 350);
        // }
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