/**
* Setting elements to constants and Decalring Variables
*/
const playButton = document.getElementById('playMetronome');
const stopButton = document.getElementById('stopMetronome');
const bpmSlider = document.getElementById('bpmSlider');
const bpmEl = document.getElementById('bpm');
const beatTxt = document.getElementById('beatsText');
const beatBTN = document.querySelectorAll('button.beatsBTN');
const audio = new AudioContext()
let audioBuffer;
let i = 1;
let beat_count = 4;
let metronome;
let bpm = 140;
let isplaying = false;
 
// Loading Metronome Audi
function load_audio(){
    return fetch('./metronome.mp3')
        .then(response => response.arrayBuffer())
        .then(buffer => audio.decodeAudioData(buffer) );
}
load_audio().then(buffer => audioBuffer = buffer )
 
/**
* Function for Playing the Metronome Click Sound
* @param int rate = to change playbackrate or the pitch
*/
function playClick(rate=1) {
    // creating the audio buffer source
    const source = audio.createBufferSource();
    // Serring audio buffer to source
    source.buffer = audioBuffer;
    // changing the pitch
    source.playbackRate.value = rate;
    // Connect source to audio destination
    source.connect(audio.destination);
    // play the audio from the start
    source.start(0);
}
 
 
/**
* Function that Loops the Metronome depending to provided tempo and beats
*/
function metronome_play(){
    // identifying that metronome is playing
    isplaying = true
    // looping the beat
    metronome = setInterval(function(){
        // setting up the pitch, high pitch the 1 beat per measure
        var PBrate = 1
        if(i == 1)
            PBrate = 2;
        playClick(PBrate)
            i = i + 1;
        if(i > beat_count){
            i = 1;
        }
    }, (60000 / bpm))
}
 
// Function that stops the metronome
function metronome_stop(){
    clearInterval(metronome)
    i = 1;
    isplaying = false
}
 
//  function that updates the beats per measure
function change_beat(type = "plus"){
    if(type == 'plus'){
        beat_count = beat_count + 1;
    }else{
        beat_count = beat_count - 1;
    }
 
    if(beat_count < 2)
        beat_count = 2;
    beatTxt.innerText = beat_count
    if(isplaying){
        metronome_stop()
        metronome_play()
    }
 
}
 
/**
* Event Listener that triggers the metronome to play
*/
playButton.addEventListener('click', function(e){
    e.preventDefault()
    if(!isplaying){
        metronome_play()
    }
    // Hide Play Button
    playButton.style.display = 'none'
    // Show Stop Button
    stopButton.style.display = 'flex'
})
 
/**
* Event Listener that triggers the metronome to stop
*/
stopButton.addEventListener('click', function(e){
    e.preventDefault()
    metronome_stop()
    // Hide Stop Button
    stopButton.style.display = 'none'
    // Show Play Button
    playButton.style.display = 'flex'
})
 
/**
* Event Listener that triggers the metronome speed up or down
*/
bpmSlider.addEventListener('input', function(e){
    e.preventDefault()
    bpmEl.innerText = `${bpmSlider.value}`
    bpm = bpmSlider.value
    if(isplaying){
        metronome_stop()
        metronome_play()
    }
   
})
 
/**
* Event Listener that triggers the metronome to change the number of beats per measure
*/
beatBTN.forEach(el=>{
    el.addEventListener('click', function(e){
        e.preventDefault()
        change_beat(el.dataset.type)
    })
})
   