
let imageSelector = document.getElementById('image-selector');

let selectedImage = document.getElementById('selected-image');

let predictionsList =document.getElementById('prediction-list')

let imageLoaded = false;
let modelLoaded = false;
let mod;

document.addEventListener('DOMContentLoaded', async function(){
    $('.loadPred').hide()
    console.log('Chargement du modèle...');
    modelLoaded = false;
    mod = await tf.loadGraphModel('model/model.json')
    $('.loadModel').hide();
    modelLoaded = true
    console.log('Modèle chargé')
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

async function predict(){
    if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
    $('.loadPred').show()
    const img = selectedImage;
    let tensor = tf.browser.fromPixels(img,3)
        .resizeNearestNeighbor([224, 224]) // change the image size
        .expandDims()
        .toFloat()
        .reverse(-1); // RGB -> BGR
    let predictions = await mod.predict(tensor).data();
    $('.loadPred').hide()
    console.log(predictions);

    let top5 = Array.from(predictions)
    .map(function (p, i) { // this is Array.map
        return {
            probability: p,
            className: TARGET_CLASSES[i] // we are selecting the value from the obj
        };
    }).sort(function (a, b) {
        return b.probability - a.probability;
    }).slice(0, 3);

    top5.forEach(function (p) {
        console.log(p);
        predictionsList.innerHTML += '<li>'+p.className+':'+p.probability.toFixed(3)+'</li>';
        });
}