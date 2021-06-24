const score = document.querySelector(".score");
const points = document.querySelector(".points");
const start = document.querySelector(".start");
const pause = document.querySelector(".pause");
const gameArea = document.querySelector(".gameArea");
const message = document.querySelector(".message");
const buttons = document.querySelectorAll(".btn");
const volumeControl = document.querySelector(".volume");


const car = document.createElement("div");
car.classList.add("car");

const audio = new Audio("./audio/audio.mp3");

const MAX_ENEMY = 8;
const HEIGHT_ITEM = 100;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const config = {
  start: false,
  score: 0,
  speed: 6,
  traffic: 3,
};

function getQtyElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function linePattern() {
  for (let i = 0; i < getQtyElements(HEIGHT_ITEM); i++) {
    const rodeLine = document.createElement("div");
    rodeLine.classList.add("line");
    rodeLine.style.top = i * HEIGHT_ITEM + "px";
    rodeLine.y = i * HEIGHT_ITEM;
    gameArea.appendChild(rodeLine);
  }
}

function getRendomEnemy(max) {
  return Math.floor(Math.random() * max) + 1;
}

function createTraffic() {
  for (let i = 0; i < getQtyElements(HEIGHT_ITEM * config.traffic); i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -HEIGHT_ITEM * config.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background = `
      url("./images/enemy${getRendomEnemy(MAX_ENEMY)}.png") 
      center / cover 
      no-repeat`;
    gameArea.appendChild(enemy);
  }
}

function moveRoadLine() {
  const roadLines = document.querySelectorAll(".line");
  roadLines.forEach((line) => {
    line.y += config.speed;
    line.style.top = line.y + "px";

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -HEIGHT_ITEM;
    }
  });
}

function moveEnemy() {
  let enemys = document.querySelectorAll(".enemy");
  enemys.forEach((enemy) => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      config.start = false;
      buttons.forEach((btn) => {
        btn.disabled = false;
      })
      stopAudio(audio);
      message.classList.remove("show");
    }

    enemy.y += config.speed / 2;
    enemy.style.top = enemy.y + "px";
    if (enemy.y >= document.documentElement.clientHeight) {
      enemy.y = -HEIGHT_ITEM * config.traffic;
      enemy.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}

function changeLevel(level) {
  switch (level) {
    case "1":
      config.traffic = 3;
      config.speed = 8;
      break;
    case "2":
      config.traffic = 3;
      config.speed = 10;
      break;
    case "3":
      config.traffic = 3;
      config.speed = 12;
      break;
  }
}

function startGame(e) {
  if (!e.target.classList.contains("level")) return;
  const levelGame = e.target.dataset.levelGame;
  changeLevel(levelGame);
  buttons.forEach((btn) => {
    btn.disabled = true;
  })
  audio.play();

  message.classList.add("show");
  gameArea.innerHTML = "";
  car.style.left = "125px";
  car.style.top = "auto";
  car.style.bottom = "10px";
  linePattern();
  createTraffic();
  config.score = 0;
  config.start = true;
  gameArea.appendChild(car);
  config.x = car.offsetLeft;
  config.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (config.start) {
    config.score += config.speed;
    points.textContent = config.score;
    moveRoadLine();
    moveEnemy();
    if (keys.ArrowLeft && config.x > 0) {
      config.x -= config.speed;
    }
    if (keys.ArrowRight && config.x < gameArea.offsetWidth - car.offsetWidth) {
      config.x += config.speed;
    }
    if (keys.ArrowUp && config.y > 0) {
      config.y -= config.speed;
    }
    if (keys.ArrowDown && config.y < gameArea.offsetHeight - car.offsetHeight) {
      config.y += config.speed;
    }
    car.style.left = config.x + "px";
    car.style.top = config.y + "px";
    requestAnimationFrame(playGame);
  }
}

function startRunning(e) {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
}

function stopRunning(e) {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = false;
  }
}

function togglePause() {
  if (audio.paused) {
    audio.play();
    config.start = true;
    pause.innerHTML = "Pause the Game";
    playGame();
  } else {
    audio.pause();
    config.start = false;
    pause.innerHTML = "Resume the Game";
  }
}

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function setVolume() {
  audio.volume = this.value / 100;
}

volumeControl.addEventListener("change", setVolume);
volumeControl.addEventListener("input", setVolume);

start.addEventListener("click", startGame);
pause.addEventListener("click", togglePause);
document.addEventListener("keydown", startRunning);
document.addEventListener("keyup", stopRunning);
linePattern();
