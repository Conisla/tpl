
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/9DOxzlLVe/";

let model, webcam, labelContainer, maxPredictions;
$('.loadPred').hide()
// Load the image model and setup the webcam 
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();


    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    
    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    // afficher l'image envoyé dans la requête POST
    
    //afficher le taux de confiance pour chaque labels 
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}
//loop webcam
async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}
// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

let imageSelector = document.getElementById('image-selector');

let selectedImage = document.getElementById('selected-image');

let predictionsList =document.getElementById('prediction-list');

let imageLoaded = false;
let modelLoaded = false
let mod;

document.addEventListener('DOMContentLoaded', async function(){
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    console.log('Chargement du modèle...');
    mod = await tmImage.load(modelURL, metadataURL);
    $('.progress-bar').hide();
    modelLoaded = true
    console.log('Modèle chargé')
    maxPredictions = mod.getTotalClasses();
})

function loadingImg(){
    imageLoaded = false;
    let reader = new FileReader();
    reader.onload = function(){
        let dataURL = reader.result;
        selectedImage.src = dataURL;
        predictionsList.innerHTML = '';
        imageLoaded = true;
    }
    let file = imageSelector.files[0];
    reader.readAsDataURL(file);
}

imageSelector.addEventListener('change', () => loadingImg());

async function imgPredict()
{
    $('.loadPred').show()
    if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
    const img = selectedImage;

    const pred = await mod.predict(selectedImage);
    $('.loadPred').hide()
    pred.forEach(function(p){
        predictionsList.innerHTML += '<li>'+p.className+':'+p.probability.toFixed(3)+'</li>';
    })
}

