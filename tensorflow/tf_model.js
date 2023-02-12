let imageSelector = document.getElementById('image-selector');

let selectedImage = document.getElementById('selected-image');

let predictionsList =document.getElementById('prediction-list')

let imageLoaded = false;
let modelLoaded = false;
let net;

$('.loadModel').hide();

async function loading() {
    imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		selectedImage.src= dataURL ;
		predictionsList.innerHTML = '';
		imageLoaded = true;
	}
	let file = imageSelector.files[0];
    console.log(imageSelector.files[0])
	reader.readAsDataURL(file);

    console.log('Loading mobilenet..');
    modelLoaded = false;
    $('.loadModel').show();
    net = await mobilenet.load();
    $('.loadModel').hide();
    modelLoaded = true;
    console.log('Successfully loaded model');
}

imageSelector.addEventListener('change', () => loading());
$('.loadPred').hide()

async function app() {
  if (!modelLoaded) { alert("The model must be loaded first"); return; }
  if (!imageLoaded) { alert("Please select an image first"); return; }
  predictionsList.innerHTML = '';
  $('.loadPred').show()
  const result = await net.classify(selectedImage);
  $('.loadPred').hide()
  result.forEach(function (p) {
    predictionsList.innerHTML += '<li>'+p.className+':'+p.probability.toFixed(3)+'</li>';
    });



}
