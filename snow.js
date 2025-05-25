function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

const nav = document.querySelector('nav');
const hero = document.querySelector('.hero');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const desiredWidth = document.body.clientWidth;
  // desired height = nav height + hero height
  const desiredHeight = nav.offsetHeight + hero.offsetHeight;

  canvas.width = desiredWidth;
  canvas.height = desiredHeight;

  // console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
}

resizeCanvas(); // initial resize
window.addEventListener('resize', resizeCanvas); // resize on window resize

const PI = Math.PI;
const SNOWFLAKE_SIDE_LENGTH = 7.5;
class Snowflake {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.speedX = randomNumber(-10, 10);
    this.speedY = randomNumber(20, 50);

    this.angularSpeed = randomNumber(-PI / 2, PI / 2);
    this.angle = Math.random() * 2 * Math.PI; // random angle between 0 and 2*PI
  }

  update(deltaTime) {
    this.x += this.speedX * deltaTime;
    this.y += this.speedY * deltaTime;

    // update angle
    this.angle += this.angularSpeed * deltaTime;

    // reset position if snowflake goes out of bounds
    if (
      this.x < -SNOWFLAKE_SIDE_LENGTH || 
      this.x > canvas.width + SNOWFLAKE_SIDE_LENGTH || 
      this.y > canvas.height + SNOWFLAKE_SIDE_LENGTH
    ) {
      // console.log(`Snowflake out of bounds, resetting position (${this.x}, ${this.y})`);
      this.x = Math.random() * canvas.width;
      this.y = -SNOWFLAKE_SIDE_LENGTH; // reset to top
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // draw a simple square as a snowflake
    ctx.fillStyle = '#ffffff80'; // semi-transparent white
    ctx.fillRect(-SNOWFLAKE_SIDE_LENGTH / 2, -SNOWFLAKE_SIDE_LENGTH / 2, SNOWFLAKE_SIDE_LENGTH, SNOWFLAKE_SIDE_LENGTH);

    ctx.restore();
  }
}

const snowflakes = [];
// create 100 snowflakes
for (let i = 0; i < 100; i++) {
  snowflakes.push(new Snowflake());
}

function update(deltaTime) {
  resizeCanvas(); // resize canvas to fit the viewport

  // console.log(`Updating snowflakes with deltaTime: ${deltaTime}`);
  if (deltaTime > 0.5) return; // skip if deltaTime is too large (e.g., if the tab was inactive)
  // draw orang color
  ctx.fillStyle = '#eb5e28';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw snowflakes
  for (const snowflake of snowflakes) {
    snowflake.update(deltaTime);
    snowflake.draw();
  }
}

let prev;
// call update every frame
function loop(now) { // default to 60 FPS
  let millis = prev ? now - prev : 0;
  update(millis / 1000);

  prev = now;
  requestAnimationFrame(loop);
}

loop(); // start the loop