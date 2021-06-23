const score = document.querySelector(".score");
const start = document.querySelector(".start");
const gameArea = document.querySelector(".gameArea");

const car = document.createElement("div");
car.classList.add("car");

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const config = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3,
};

function getQtyElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function linePattern() {
  for (let i = 0; i < getQtyElements(100); i++) {
    const rodeLine = document.createElement("div");
    rodeLine.classList.add("line");
    rodeLine.style.top = i * 100 + "px";
    rodeLine.y = i * 100;
    gameArea.appendChild(rodeLine);
  }
}

function createTraffic() {
  for (let i = 0; i < getQtyElements(100 * config.traffic); i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -100 * config.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background = 'url("./images/enemy.png") center / cover no-repeat';
    gameArea.appendChild(enemy);
  }
}

function moveRoadLine() {
  const roadLines = document.querySelectorAll(".line");
  roadLines.forEach((line) => {
    line.y += config.speed;
    line.style.top = line.y + "px";

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemys = document.querySelectorAll(".enemy");
  enemys.forEach((enemy) => {
    enemy.y += config.speed / 2;
    enemy.style.top = enemy.y + "px";

    if (enemy.y >= document.documentElement.clientHeight) {
      enemy.y = -100 * config.traffic;
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}

moveEnemy();

function startGame() {
  linePattern();
  createTraffic();
  config.start = true;
  gameArea.appendChild(car);
  config.x = car.offsetLeft;
  config.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (config.start) {
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
  e.preventDefault();
  keys[e.key] = true;
}

function stopRunning(e) {
  e.preventDefault();
  keys[e.key] = false;
}

start.addEventListener("click", startGame);
document.addEventListener("keydown", startRunning);
document.addEventListener("keyup", stopRunning);
