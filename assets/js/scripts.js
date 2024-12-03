let workoutProgress = 0;
let countdownInterval;
let activeWorkoutCard = null;

let femaleVoice;

// Initialize voices list
function initializeVoices() {
  const voices = window.speechSynthesis.getVoices();
  femaleVoice = voices.find(voice => voice.name.includes("Google UK English Female") || voice.gender === "female") || voices[0];
}

// Ensure voices are loaded (some browsers load them asynchronously)
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = initializeVoices;
} else {
  initializeVoices();
}


function startWorkout(workoutName) {
	 let audioIns ;
	 
	  switch (workoutName) {
    case "Jumping Jacks":
      audioIns = `Start with your feet together and hands at your sides. Starting ${workoutName}. Get ready and start!`;
      break;
    case "Push Ups":
      audioIns = `Engage your core for better results. Starting ${workoutName}. Get ready and start!`; 
      break;
    case "Squats":
      audioIns = `Go deep for maximum effectiveness. Starting ${workoutName}. Get ready and start!`;  
      break;
    case "Plank":
      audioIns = `Keep your core tight and hips level. Starting ${workoutName}. Get ready and start!`; 
      break;
    default:
      audioIns = `Starting ${workoutName}. Get ready and start!`;
  }
	
 //let audioIns = `Starting ${workoutName}. Get ready and start!`;
  clearPreviousWorkout();
  const audio = new SpeechSynthesisUtterance(audioIns);
  audio.voice = femaleVoice;
  //const audio = new SpeechSynthesisUtterance(`Starting ${workoutName}. Get ready and start!`);
  window.speechSynthesis.speak(audio);
  startTimer(workoutName);

  // Show the workout illustrator
  showIllustrator(workoutName);

  // Highlight active workout card
  activeWorkoutCard = document.querySelector(`[data-workout="${workoutName}"]`);
  activeWorkoutCard.classList.add("active");
}

/*function startWorkout(workoutName) {
  clearPreviousWorkout();
  const audio = new SpeechSynthesisUtterance(`Starting ${workoutName}. Get ready!`);
  window.speechSynthesis.speak(audio);
  startTimer(workoutName);
  
  // Show the workout illustrator
  showIllustrator(workoutName);

  // Highlight active workout card
  activeWorkoutCard = document.querySelector(`[data-workout="${workoutName}"]`);
  activeWorkoutCard.classList.add("active");
}
*/
function showIllustrator(workoutName) {
  const illustratorContainer = document.getElementById("workout-illustration-container");
  illustratorContainer.innerHTML = ""; // Clear previous illustrator

  let illustratorHTML = "";
  
  switch (workoutName) {
    case "Jumping Jacks":
      illustratorHTML = `<img src="assets/images/jumping-jacks.gif" alt="Jumping Jacks" class="workout-illustrator">`;
      break;
    case "Push Ups":
      illustratorHTML = `<img src="assets/images/pushup.gif" alt="Push Ups" class="workout-illustrator">`;
      break;
    case "Squats":
      illustratorHTML = `<img src="assets/images/squart.gif" alt="Squats" class="workout-illustrator">`;
      break;
    case "Plank":
      illustratorHTML = `<img src="assets/images/plank.gif" alt="Plank" class="workout-illustrator">`;
      break;
    default:
      illustratorHTML = `<p>No animation available</p>`;
  }

  illustratorContainer.innerHTML = illustratorHTML;
}



function clearAnimation(){
const illustratorContainer = document.getElementById("workout-illustration-container");
  illustratorContainer.innerHTML = ""; // Clear previous illustrator
}







function startTimer(workoutName) {
  let timeLeft = 30;
  const timer = document.getElementById("timer");
  const progressBar = document.getElementById("progress-bar");

  countdownInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      const completionAudio = new SpeechSynthesisUtterance(`${workoutName} completed! Great job!`);
	  completionAudio.voice = femaleVoice;
      window.speechSynthesis.speak(completionAudio);
      updateProgress(workoutName);
      highlightCompletedWorkout();
      clearTimerAndProgress();
    } else {
      const secondAudio = new SpeechSynthesisUtterance(timeLeft);
	  secondAudio.voice = femaleVoice;
      window.speechSynthesis.speak(secondAudio);

      timer.innerText = `00:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`;
      progressBar.value = (30 - timeLeft) * (100 / 30);

      if (timeLeft <= 10) {
        timer.style.color = "red";
      } else {
        timer.style.color = "#6d6d6d";
      }
    }
    timeLeft--;
  }, 2500);
}

function stopTimer() {
  clearInterval(countdownInterval);
  //alert("Workout stopped!");
   const stopTimeraudio = new SpeechSynthesisUtterance(`Stop count down`);
   stopTimeraudio.voice = femaleVoice;
  window.speechSynthesis.speak(stopTimeraudio);
  highlightCompletedWorkout();
  clearTimerAndProgress();
  clearAnimation();
}

function updateProgress(workoutName) {
  workoutProgress += 25;
  document.getElementById("overall-progress-bar").value = workoutProgress;
  document.getElementById("overall-progress-text").innerText = `${workoutProgress}% Completed`;
  saveWorkoutHistory(workoutName); 
  clearAnimation();
  if (workoutProgress === 100) {
    const overallCompletionAudio = new SpeechSynthesisUtterance("Congratulations! You've completed all workouts.");
	 overallCompletionAudio.voice = femaleVoice;
    window.speechSynthesis.speak(overallCompletionAudio);
    //saveWorkoutHistory(workoutName);
	
  }
}

function saveWorkoutHistory(workoutName) {
  const currentDate = new Date();
  const dateTime = currentDate.toLocaleString();
  const points = 10; // Example points value

  const workoutHistory = JSON.parse(localStorage.getItem("workoutHistory")) || [];
  workoutHistory.push({ name: workoutName, dateTime: dateTime, points: points });
  localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
}

function clearTimerAndProgress() {
  document.getElementById("timer").innerText = "00:30";
  document.getElementById("progress-bar").value = 0;
}

function highlightCompletedWorkout() {
  if (activeWorkoutCard) {
    activeWorkoutCard.classList.remove("active");
    activeWorkoutCard.classList.add("completed");
  }
}

function clearPreviousWorkout() {
  if (activeWorkoutCard) {
    activeWorkoutCard.classList.remove("active");
  }
}
