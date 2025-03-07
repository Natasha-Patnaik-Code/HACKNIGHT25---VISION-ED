function textTospeech() {
    let text = document.body.innerText;
    let speech = new SpeechSynthesisUtterance();
    document.getElementById("start-speech").style.display = "none";
    document.getElementById("stop-speech").style.display = "inline";
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function stopspeech() {
    window.speechSynthesis.cancel();
    document.getElementById("start-speech").style.display = "inline";
    document.getElementById("stop-speech").style.display = "none";
}