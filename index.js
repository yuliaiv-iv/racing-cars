const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');

const car = document.createElement('div');
car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const config = {
  start: false,
  score: 0,
  speed: 3,
};

function startGame() {
  config.start = true;
  gameArea.appendChild(car);
  requestAnimationFrame(playGame);
};

function playGame() {
  console.log('play')
  if (config.start) {
    requestAnimationFrame(playGame);
  }
};

function startRunning(e) {
  e.preventDefault();
  keys[e.key] = true;
};

function stopRunning(e) {
  e.preventDefault();
  keys[e.key] = false;

};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRunning);
document.addEventListener('keyup', stopRunning);

