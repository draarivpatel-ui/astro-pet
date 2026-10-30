const PALETTE = {
  0: null,
  1: "#181825",
  2: "#89B4FA",
  3: "#B4BEFE",
  4: "#F38BA8",
  5: "#F9E2AF",
  6: "#A6E3A1"
};

const SPRITE_IDLE = [
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,1,1,5,5,1,1,5,5,1,1,0,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,1,2,3,3,2,2,2,2,2,2,3,3,2,1,0],
  [0,1,2,1,1,1,1,1,1,1,1,1,1,2,1,0],
  [1,2,2,1,6,6,1,6,6,6,1,6,6,1,2,1],
  [1,2,2,1,6,6,1,6,6,6,1,6,6,1,2,1],
  [1,2,2,1,1,1,1,1,1,1,1,1,1,2,2,1],
  [1,2,4,4,2,2,2,1,1,2,2,2,4,4,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [0,1,2,2,5,5,5,5,5,5,5,5,2,2,1,0],
  [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,0,1,2,2,2,1,1,1,1,2,2,2,1,0,0],
  [0,0,1,2,2,1,0,0,0,0,1,2,2,1,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const canvas = document.getElementById("pet-canvas");
const ctx = canvas.getContext("2d");

const pet = {
  x: 340,
  y: 292,
  vx: 1.8,
  vy: 0,
  groundY: 292,
  state: "WANDER",
  hunger: 92,
  focus: 88,
  mood: 96,
  facing: 1,
  frame: 0,
  snacks: [{ x: 520, y: 340 }],
  speech: "Scanning active git branch... ready to pair program!"
};

document.getElementById("matrix-preview").textContent =
  SPRITE_IDLE.slice(0, 10).map(r => r.join(" ")).join("\n");

function updateHud() {
  document.getElementById("state-badge").textContent = "STATE: " + pet.state;
  document.getElementById("val-hunger").textContent = Math.round(pet.hunger) + "%";
  document.getElementById("bar-hunger").style.width = Math.round(pet.hunger) + "%";
  document.getElementById("val-focus").textContent = Math.round(pet.focus) + "%";
  document.getElementById("bar-focus").style.width = Math.round(pet.focus) + "%";
  document.getElementById("val-mood").textContent = Math.round(pet.mood) + "%";
  document.getElementById("bar-mood").style.width = Math.round(pet.mood) + "%";
  document.getElementById("speech-log").textContent = '"' + pet.speech + '"';
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const sx = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const sy = ((e.clientY - rect.top) / rect.height) * canvas.height;
  pet.snacks.push({ x: sx, y: Math.min(340, sy) });
  pet.state = "CHASE_SNACK";
  pet.speech = "Star snack detected on desktop ledge!";
  updateHud();
});

document.getElementById("btn-snack").addEventListener("click", () => {
  pet.snacks.push({ x: 140 + Math.random() * 480, y: 340 });
  pet.state = "CHASE_SNACK";
  pet.speech = "Incoming orbital star snack!";
  updateHud();
});

document.getElementById("btn-jump").addEventListener("click", () => {
  pet.vy = -8.5;
  pet.state = "ZERO_G_HOP";
  pet.mood = Math.min(100, pet.mood + 4);
  pet.speech = "Zero-G thruster hop engaged!";
  updateHud();
});

document.getElementById("btn-pomodoro").addEventListener("click", () => {
  pet.state = "POMODORO_GUARD";
  pet.focus = Math.min(100, pet.focus + 8);
  pet.speech = "25:00 Focus Sprint active — guarding your terminal!";
  updateHud();
});

document.getElementById("btn-sleep").addEventListener("click", () => {
  pet.state = pet.state === "SLEEP" ? "WANDER" : "SLEEP";
  pet.speech = pet.state === "SLEEP" ? "Zzz... recharging pixel capacitors..." : "Back online!";
  updateHud();
});

function drawPixelSprite(x, y, scale, flip) {
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      const colIdx = flip ? 15 - c : c;
      const val = SPRITE_IDLE[r][colIdx];
      if (!val) continue;
      ctx.fillStyle = PALETTE[val];
      ctx.fillRect(Math.round(x + c * scale), Math.round(y + r * scale), scale, scale);
    }
  }
}

function loop() {
  pet.frame++;
  ctx.fillStyle = "#0f141c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle desktop grid
  ctx.strokeStyle = "#18202c";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < canvas.width; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
  }
  for (let gy = 0; gy < canvas.height; gy += 40) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
  }

  // Ledge floor
  ctx.fillStyle = "#1c2433";
  ctx.fillRect(0, 368, canvas.width, 52);
  ctx.fillStyle = "#89b4fa";
  ctx.fillRect(0, 368, canvas.width, 2);

  // Physics & FSM
  if (pet.state !== "SLEEP") {
    if (pet.snacks.length > 0) {
      const target = pet.snacks[0];
      const dx = target.x - (pet.x + 40);
      if (Math.abs(dx) < 12) {
        pet.snacks.shift();
        pet.hunger = Math.min(100, pet.hunger + 6);
        pet.mood = Math.min(100, pet.mood + 3);
        pet.vy = -5.5;
        pet.state = "WANDER";
        pet.speech = "Chomp! +6% Satiety.";
        updateHud();
      } else {
        pet.vx = Math.sign(dx) * 3.0;
        pet.facing = Math.sign(dx);
        pet.x += pet.vx;
      }
    } else {
      pet.x += pet.vx;
      if (pet.x < 40) { pet.x = 40; pet.vx = Math.abs(pet.vx); pet.facing = 1; }
      if (pet.x > canvas.width - 120) { pet.x = canvas.width - 120; pet.vx = -Math.abs(pet.vx); pet.facing = -1; }
    }
  }

  pet.y += pet.vy;
  if (pet.y < pet.groundY) {
    pet.vy += 0.42;
  } else {
    pet.y = pet.groundY;
    pet.vy = 0;
  }

  // Draw snacks
  for (const s of pet.snacks) {
    ctx.fillStyle = "#f9e2af";
    ctx.fillRect(s.x - 6, s.y - 6, 12, 12);
    ctx.fillStyle = "#f38ba8";
    ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
  }

  const bob = pet.state === "SLEEP" ? 0 : Math.sin(pet.frame * 0.14) * 4;
  drawPixelSprite(pet.x, pet.y + bob, 5, pet.facing < 0);

  // Speech bubble above pet
  ctx.fillStyle = "rgba(22, 27, 34, 0.92)";
  ctx.strokeStyle = "#30363d";
  ctx.fillRect(pet.x - 30, pet.y - 36, 145, 24);
  ctx.fillStyle = "#a6e3a1";
  ctx.font = "11px ui-monospace, monospace";
  ctx.fillText(pet.state, pet.x - 20, pet.y - 20);

  requestAnimationFrame(loop);
}
updateHud();
requestAnimationFrame(loop);
