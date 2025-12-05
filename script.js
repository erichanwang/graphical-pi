const canvas = document.getElementById("piCanvas");
const ctx = canvas.getContext("2d");

const trailCanvas = document.getElementById("trailCanvas");
const trailCtx = trailCanvas.getContext("2d");

const speedSlider = document.getElementById("speed");
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");
const toggleZoomButton = document.getElementById("toggle-zoom");

let width = canvas.width = trailCanvas.width = window.innerWidth;
let height = canvas.height = trailCanvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    width = canvas.width = trailCanvas.width = window.innerWidth;
    height = canvas.height = trailCanvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    trailCtx.fillStyle = "rgba(0, 0, 0, 1)";
    trailCtx.fillRect(0, 0, width, height);
});

let centerX = width / 2;
let centerY = height / 2;
let radius = Math.min(width, height) / 4;

let angle1 = 0;
let angle2 = 0;
let lastX2 = 0;
let lastY2 = 0;


let speed = 0.01;
let zoom = 1;
let zoomX = centerX;
let zoomY = centerY;
let follow = false;

trailCtx.fillStyle = "rgba(0, 0, 0, 1)";
trailCtx.fillRect(0, 0, width, height);

speedSlider.addEventListener("input", (event) => {
    speed = parseFloat(event.target.value);
});

zoomInButton.addEventListener("click", () => {
    zoom *= 1.1;
    zoom = Math.min(Math.max(0.1, zoom), 10);
});

zoomOutButton.addEventListener("click", () => {
    zoom *= 0.9;
    zoom = Math.min(Math.max(0.1, zoom), 10);
});

toggleZoomButton.addEventListener("click", () => {
    follow = !follow;
    if (follow) {
        zoom = 10;
    } else {
        zoom = 1;
    }
});


canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom += event.deltaY * -0.01;
    zoom = Math.min(Math.max(0.1, zoom), 10);
});

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    if (follow) {
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-zoomX, -zoomY);
    } else {
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-width / 2, -height / 2);
    }


    let x1 = centerX + radius * Math.cos(angle1);
    let y1 = centerY + radius * Math.sin(angle1);

    let x2 = x1 + radius * Math.cos(angle2);
    let y2 = y1 + radius * Math.sin(angle2);

    if (follow) {
        zoomX = x2;
        zoomY = y2;
    }


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

    if(lastX2 !== 0 && lastY2 !== 0){
        trailCtx.strokeStyle = "white";
        trailCtx.lineWidth = 0.5;
        trailCtx.beginPath();
        trailCtx.moveTo(lastX2, lastY2);
        trailCtx.lineTo(x2, y2);
        trailCtx.stroke();
    }
    
    lastX2 = x2;
    lastY2 = y2;


    angle1 += speed;
    angle2 += speed * Math.PI;

    ctx.restore();
    requestAnimationFrame(draw);
}

draw();
