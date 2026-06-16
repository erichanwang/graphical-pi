const canvas = document.getElementById("piCanvas");
const ctx = canvas.getContext("2d");

const trailCanvas = document.getElementById("trailCanvas");
const trailCtx = trailCanvas.getContext("2d");

const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");
const toggleZoomButton = document.getElementById("toggle-zoom");
const resetButton = document.getElementById("reset-trail");

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 30;

let dpr = window.devicePixelRatio || 1;
let width = window.innerWidth;
let height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;
let radius = Math.min(width, height) / 4;

let angle1 = 0;
let angle2 = 0;
let lastX2 = 0;
let lastY2 = 0;
let hasLast = false;

let speed = Math.pow(parseFloat(speedSlider.value), 3) / 100;
let zoom = 1;
let follow = false;

function clampZoom(z) {
    return Math.min(Math.max(MIN_ZOOM, z), MAX_ZOOM);
}

function sizeCanvasToDpr(canvasEl, ctxEl, logicalW, logicalH) {
    canvasEl.width = Math.round(logicalW * dpr);
    canvasEl.height = Math.round(logicalH * dpr);
    canvasEl.style.width = logicalW + "px";
    canvasEl.style.height = logicalH + "px";
    // setTransform (not scale) so repeated resizes never compound the scale factor.
    ctxEl.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function fillBlack(ctxEl, w, h) {
    ctxEl.fillStyle = "#000";
    ctxEl.fillRect(0, 0, w, h);
}

function initCanvases() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    radius = Math.min(width, height) / 4;

    sizeCanvasToDpr(canvas, ctx, width, height);
    sizeCanvasToDpr(trailCanvas, trailCtx, width, height);
    fillBlack(trailCtx, width, height);
}

initCanvases();

function handleResize() {
    const oldWidth = width;
    const oldHeight = height;
    const oldCenterX = centerX;
    const oldCenterY = centerY;
    const oldRadius = radius;

    // Snapshot the existing trail (device pixels) before the resize clears the buffer.
    const snapshot = document.createElement("canvas");
    snapshot.width = trailCanvas.width;
    snapshot.height = trailCanvas.height;
    snapshot.getContext("2d").drawImage(trailCanvas, 0, 0);

    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    const newRadius = Math.min(width, height) / 4;
    const scaleFactor = oldRadius > 0 ? newRadius / oldRadius : 1;

    sizeCanvasToDpr(canvas, ctx, width, height);
    sizeCanvasToDpr(trailCanvas, trailCtx, width, height);
    fillBlack(trailCtx, width, height);

    trailCtx.save();
    trailCtx.translate(centerX, centerY);
    trailCtx.scale(scaleFactor, scaleFactor);
    trailCtx.translate(-oldCenterX, -oldCenterY);
    trailCtx.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, oldWidth, oldHeight);
    trailCtx.restore();

    if (hasLast) {
        lastX2 = (lastX2 - oldCenterX) * scaleFactor + centerX;
        lastY2 = (lastY2 - oldCenterY) * scaleFactor + centerY;
    }

    radius = newRadius;
}

window.addEventListener("resize", handleResize);

speedSlider.addEventListener("input", (event) => {
    let value = parseFloat(event.target.value);
    speed = Math.pow(value, 3) / 100;
    speedValue.textContent = speed.toFixed(4);
});
speedValue.textContent = speed.toFixed(4);

zoomInButton.addEventListener("click", () => {
    zoom = clampZoom(zoom * 1.1);
});

zoomOutButton.addEventListener("click", () => {
    zoom = clampZoom(zoom * 0.9);
});

toggleZoomButton.addEventListener("click", () => {
    follow = !follow;
    toggleZoomButton.setAttribute("aria-pressed", String(follow));
    zoom = follow ? 10 : 1;
});

resetButton.addEventListener("click", () => {
    fillBlack(trailCtx, width, height);
    hasLast = false;
});

canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom = clampZoom(zoom + event.deltaY * -0.01);
}, { passive: false });

// Pinch-to-zoom for touch devices.
let pinchStartDistance = null;
let pinchStartZoom = 1;

function touchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
}

canvas.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
        pinchStartDistance = touchDistance(event.touches);
        pinchStartZoom = zoom;
    }
}, { passive: true });

canvas.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2 && pinchStartDistance) {
        event.preventDefault();
        const newDistance = touchDistance(event.touches);
        zoom = clampZoom(pinchStartZoom * (newDistance / pinchStartDistance));
    }
}, { passive: false });

canvas.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) {
        pinchStartDistance = null;
    }
}, { passive: true });

let lastFrameTime = null;
let paused = false;

document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (!paused) {
        lastFrameTime = null; // avoid a large dt jump after coming back
    }
});

function draw(timestamp) {
    requestAnimationFrame(draw);
    if (paused) return;

    if (lastFrameTime === null) lastFrameTime = timestamp;
    const dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    // Normalize to a 60fps baseline so the pattern animates at the same
    // speed regardless of the display's refresh rate. Clamp to avoid huge
    // jumps after the tab was backgrounded.
    const dtFactor = Math.min(dt / (1000 / 60), 5);

    let x1 = centerX + radius * Math.cos(angle1);
    let y1 = centerY + radius * Math.sin(angle1);

    let x2 = x1 + radius * Math.cos(angle2);
    let y2 = y1 + radius * Math.sin(angle2);

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    if (follow) {
        ctx.translate(-x2, -y2);
    } else {
        ctx.translate(-width / 2, -height / 2);
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2 / zoom;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (hasLast) {
        trailCtx.strokeStyle = "white";
        trailCtx.lineWidth = 0.5;
        trailCtx.beginPath();
        trailCtx.moveTo(lastX2, lastY2);
        trailCtx.lineTo(x2, y2);
        trailCtx.stroke();
    }

    lastX2 = x2;
    lastY2 = y2;
    hasLast = true;

    angle1 += speed * dtFactor;
    angle2 += speed * Math.PI * dtFactor;

    ctx.restore();
}

requestAnimationFrame(draw);
