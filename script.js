function showScreen(screenId) {
  // kunin LAHAT ng elements na may class na "screen"
  const allScreens = document.querySelectorAll(".screen");

  // i-loop, tanggalin ang "active" sa lahat
  allScreens.forEach(function (screen) {
    screen.classList.remove("active");
  });

  // hanapin yung specific screen gamit ang id, idagdag ang "active"
  const targetScreen = document.getElementById(screenId);
  targetScreen.classList.add("active");
}

const eggData = {
  fried: {
    label: "Fried Egg",
    image: "image/fried.png",
    time: 240 // 4 minutes sa seconds
  },
  scramble: {
    label: "Scramble Egg",
    image: "image/scramble.png",
    time: 300
  },
  omelet: {
    label: "Omelet",
    image: "image/omelet.png",
    time: 420
  },
  boiled: {
    soft: {
      label: "Soft Boiled",
      image: "image/soft.png",
      time: 360
    },
    medium: {
      label: "Medium Boiled",
      image: "image/medium.png",
      time: 540
    },
    hard: {
      label: "Hard Boiled",
      image: "image/hard.png",
      time: 720
    }
  }
};

let currentEgg = "";
let currentStyle = "";
let remainingTime = 0;
let timerInterval = null;

function selectEgg(type) {
  playBackgroundMusic();

  if (type === "boiled") {
    showScreen("screen-boiled-style");
  } else {
    currentEgg = type;
    setupTimerScreen();
    showScreen("screen-timer");
  }
}

function selectBoiledStyle(style) {
  playBackgroundMusic();
  currentEgg = "boiled";
  currentStyle = style;
  setupTimerScreen();
  showScreen("screen-timer");
}

// ===== Kinokumberti ang seconds papuntang "M:SS" text =====
function formatTime(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
}

// ===== Itigil ang sound at ibalik sa simula =====
function stopSound() {
  let sound = document.getElementById("timer-sound");
  sound.pause();
  sound.currentTime = 0;
}

function setupTimerScreen() {
  let data;
  let eggLabel;

  if (currentEgg === "boiled") {
    data = eggData.boiled[currentStyle];
    eggLabel = "Boiled Egg";
  } else {
    data = eggData[currentEgg];
    eggLabel = data.label;
  }

  let minutes = data.time / 60;
  remainingTime = data.time;

  clearInterval(timerInterval);
  stopSound();   // itigil ang dating tunog kung tumutugtog pa

  document.getElementById("egg-title").textContent = eggLabel;
  document.getElementById("egg-image").src = data.image;
  document.getElementById("timer-display").textContent = formatTime(data.time);
  document.getElementById("timer-display").style.color = "black";   // ibalik sa normal na kulay
  document.getElementById("egg-type-label").textContent = "Egg Type: " + eggLabel;
  document.getElementById("recommended-time").textContent = "Recommended Time: " + minutes + " minutes";
}

function startTimer() {
  // i-clear muna ang umiiral na interval, para hindi dumami ang tumatakbong timer
  clearInterval(timerInterval);
  stopSound();   // itigil ang dating tunog kung mag-rerestart ng bagong countdown

  timerInterval = setInterval(function () {
    remainingTime = remainingTime - 1;

    document.getElementById("timer-display").textContent = formatTime(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      document.getElementById("timer-display").textContent = "0:00";
      document.getElementById("timer-display").style.color = "red";
      document.getElementById("timer-sound").play();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function editTime() {
  document.getElementById("edit-modal").classList.add("active");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.remove("active");
  document.getElementById("edit-minutes-input").value = "";
}

function confirmEditTime() {
  let newMinutes = document.getElementById("edit-minutes-input").value;
  newMinutes = Number(newMinutes);

  if (isNaN(newMinutes) || newMinutes <= 0) {
    alert("Pakilagay ng valid na bilang ng minuto.");
    return;
  }

  clearInterval(timerInterval);
  remainingTime = newMinutes * 60;
  document.getElementById("timer-display").textContent = formatTime(remainingTime);
  document.getElementById("timer-display").style.color = "black";

  closeEditModal();
}

function goBack() {
  clearInterval(timerInterval);
  stopSound();   // itigil ang tunog pag bumalik sa Screen 1
  showScreen("screen-select");
}

function playBackgroundMusic() {
  let bgMusic = document.getElementById("bg-music");
  bgMusic.volume = 0.2;   // 20% lang ang lakas — mas mahina kaysa alarm

  // i-check muna kung naka-pause pa (para hindi mag-restart kung tumutugtog na)
  if (bgMusic.paused) {
    bgMusic.play();
  }
}