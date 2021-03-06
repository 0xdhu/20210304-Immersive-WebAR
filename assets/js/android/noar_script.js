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