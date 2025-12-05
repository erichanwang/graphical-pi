const canvas = document.getElementById("piCanvas");
const ctx = canvas.getContext("2d");

const trailCanvas = document.getElementById("trailCanvas");
const trailCtx = trailCanvas.getContext("2d");

let width = canvas.width = trailCanvas.width = window.innerWidth;
let height = canvas.height = trailCanvas.height = window.innerHeight;

let centerX = width / 2;
let centerY = height / 2;
let radius = Math.min(width, height) / 4;

let angle1 = 0;
let angle2 = 0;

let speed = 0.01;
let zoom = 1;

trailCtx.fillStyle = "rgba(0, 0, 0, 1)";
trailCtx.fillRect(0, 0, width, height);

canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom += event.deltaY * -0.01;
    zoom = Math.min(Math.max(0.1, zoom), 10);
});

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);

    let x1 = centerX + radius * Math.cos(angle1);
    let y1 = centerY + radius * Math.sin(angle1);

    let x2 = x1 + radius * Math.cos(angle2);
    let y2 = y1 + radius * Math.sin(angle2);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    trailCtx.fillStyle = "white";
    trailCtx.beginPath();
    trailCtx.arc(x2, y2, 2, 0, Math.PI * 2);
    trailCtx.fill();

    angle1 += speed;
    angle2 += speed * Math.PI;

    ctx.restore();
    requestAnimationFrame(draw);
}

draw();
