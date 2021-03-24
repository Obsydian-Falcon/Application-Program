//Global Variables
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const speedHoldTime = 250;

var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0; 
var guessCounter = 0;
var gamePlaying = false;
var tonePlaying = false;
var speedRacer = false;
var volume = 0.5;  //must be between 0.0 and 1.0


function startGame()
{
  //initialize game variables
 // pattern = patternSet();
  patternSet();
  progress = 0;
  gamePlaying = true;

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame()
{
  gamePlaying = false;
  speedRacer = false;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
 stopMusic();
}

//Set a random pattern
function patternSet()
{
  //var choice = Math.floor(Math.random() * 4) + 1;

  for(let i = 0; i < 8; i++)
  {
    pattern[i] = Math.floor(Math.random() * 4) + 1;    
  }
}

function playMusic()
{
  pattern = [1, 2, 3, 3 ,3, 6, 5 ,3];
  speedRacer = true;
  progress = 0;
  gamePlaying = true;
  document.getElementById("muscBtn").classList.add("hidden");
  document.getElementById("muscBtnStop").classList.remove("hidden");
  document.getElementById("button5").classList.remove("hidden");
  document.getElementById("button6").classList.remove("hidden");
  playClueSequence();
}

function stopMusic()
{
  document.getElementById("muscBtn").classList.remove("hidden");
  document.getElementById("muscBtnStop").classList.add("hidden");
  document.getElementById("button5").classList.add("hidden");
  document.getElementById("button6").classList.add("hidden");
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 440.0,
  6: 523.25
}

function playTone(btn,len)
{ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn)
{
  if(!tonePlaying)
  {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone()
{
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn)
{
  if(speedRacer)
  {
    lightButton(btn);
    playTone(btn,speedHoldTime);
    setTimeout(clearButton,speedHoldTime,btn);
  }
  if(gamePlaying && !speedRacer)
  {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence()
{
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  
  for(let i=0;i<=progress;i++)
  { // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    if(speedRacer)
      delay += speedHoldTime; 
    else
      delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}

function winGame()
{
  stopGame();
  alert("Game Over. You Win!.");
}

function winRace()
{
  stopGame();
  alert("Well Done! You've Won the Mach 5 Racecar. Make sure to pay insurance on time." +
        "It's $875/month");
}

function guess(btn)
{
  // if(btn == "stopBtn")
  // {
  //   stopGame();
  //   tonePlaying = false;
  // }
  console.log("user guessed: " + btn);
  if(!gamePlaying)
  {
    return;
  }

  if(pattern[guessCounter] == btn)
  {
    if(guessCounter == progress && progress == pattern.length - 1 && !speedRacer)
      winGame();
    else if(guessCounter == progress && progress == pattern.length - 1 && speedRacer)
      winRace();
    else if(guessCounter == progress)
    {
        progress++;
        playClueSequence();
    }  
    else
      guessCounter++; 
  }
  else
    loseGame();


}