// ========================================================
// REFERENCIAS AL DOM
// ========================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Toolbar Escritorio
const dtScore = document.getElementById('dt-score');
const dtHighScore = document.getElementById('dt-high-score');
const dtLength = document.getElementById('dt-length');
const dtSoundBtn = document.getElementById('dt-sound-btn');
const dtTutorialBtn = document.getElementById('dt-tutorial-btn');
const dtStartBtn = document.getElementById('dt-start-btn');
const dtPauseBtn = document.getElementById('dt-pause-btn');
const difficultySelect = document.getElementById('difficulty-select');

// HUD Móvil
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const mbScore = document.getElementById('mb-score');
const mbHighScore = document.getElementById('mb-high-score');
const mbSoundBtn = document.getElementById('mb-sound-btn');

// Drawer Menú Móvil
const drawerMenu = document.getElementById('drawer-menu');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const drawerScore = document.getElementById('drawer-score');
const drawerHighScore = document.getElementById('drawer-high-score');
const drawerDifficulty = document.getElementById('drawer-difficulty');
const drawerDpadToggle = document.getElementById('drawer-dpad-toggle');
const drawerSoundToggle = document.getElementById('drawer-sound-toggle');
const drawerResumeBtn = document.getElementById('drawer-resume-btn');
const drawerRestartBtn = document.getElementById('drawer-restart-btn');
const drawerTutorialBtn = document.getElementById('drawer-tutorial-btn');

// Insignias y Alertas
const immunityBadge = document.getElementById('immunity-badge');
const immunityTimerSpan = document.getElementById('immunity-timer');
const threatBadge = document.getElementById('threat-badge');

// Turbo y Cruceta
const btnTurbo = document.getElementById('btn-turbo');
const turboIcon = document.getElementById('turbo-icon');
const turboLabel = document.getElementById('turbo-label');
const turboProgress = document.getElementById('turbo-cooldown-bar');
const touchControls = document.getElementById('touch-controls');
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

// Tutorial Onboarding
const tutorialModal = document.getElementById('tutorial-modal');
const tutorialStepTitle = document.getElementById('tutorial-step-title');
const tutPrevBtn = document.getElementById('tut-prev-btn');
const tutNextBtn = document.getElementById('tut-next-btn');
const tutStartBtn = document.getElementById('tut-start-btn');
const stepDots = document.querySelectorAll('.step-dots .dot');

// Game Over Modal
const gameOverlay = document.getElementById('game-overlay');
const overlayReason = document.getElementById('overlay-reason');
const finalScoreElement = document.getElementById('final-score');
const finalLengthElement = document.getElementById('final-length');
const restartOverlayBtn = document.getElementById('restart-overlay-btn');

// ========================================================
// CONFIGURACIÓN DE CUADRÍCULA Y VELOCIDADES
// ========================================================
let TILE_SIZE = window.innerWidth < 480 ? 20 : 24;
let gridCols = 30;
let gridRows = 20;

const SPEEDS = {
  easy: 195,
  medium: 145,
  hard: 105,
  extreme: 75
};

// ========================================================
// ESTADO DEL JUEGO
// ========================================================
let snake = [];
let foods = [];
let bonusFoods = [];
let shieldFoods = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = parseInt(localStorage.getItem('snakeIoHighScore') || '0', 10);
let isGameRunning = false;
let isPaused = false;
let gameInterval = null;
let isMuted = localStorage.getItem('snakeIoMuted') === 'true';

// Mecánica de Turbo con Recarga Obligatoria
let isTurbo = false;
let turboRemaining = 0;
let turboCooldown = 0;
let turboTimerInterval = null;
const TURBO_DURATION_MS = 3000;
const TURBO_COOLDOWN_MS = 5000;
const TURBO_UPDATE_INTERVAL_MS = 50;

// Inmunidad
let isImmune = false;
let immunitySeconds = 0;
let immunityCountdownInterval = null;

// Guardianes rojos
let enemyGuardians = [];
let nextEnemyId = 1;
let hasSpawnedGuardian = false;
let enemyPauseStartedAt = null;
let enemySpawnTimer = null;
let jadeSpawnTimer = null;
const GUARDIAN_TARGETS = { easy: 1, medium: 2, hard: 3, extreme: 4 };
const GUARDIAN_PALETTES = [
  { head: '#e2574c', body: '#9b2929', crest: '#ff9b83' },
  { head: '#f28c28', body: '#a64b1b', crest: '#ffc078' },
  { head: '#f2c230', body: '#a87916', crest: '#ffe27a' },
  { head: '#a65bd4', body: '#64328e', crest: '#d4a0f0' }
];
const GUARDIAN_FIRST_SPAWN_MS = { easy: 16000, medium: 14000, hard: 12000, extreme: 10000 };
const GUARDIAN_NEXT_SPAWN_MS = { easy: 20000, medium: 15000, hard: 11000, extreme: 8000 };
const GUARDIAN_LIFETIME_MS = { easy: 24000, medium: 30000, hard: 36000, extreme: 40000 };
const GUARDIAN_SPAWN_RETRY_MS = 1500;
const JADE_RESPAWN_DELAY_MS = { easy: 18000, medium: 14000, hard: 11000, extreme: 8000 };

// Efectos Visuales
let particles = [];
let floatingTexts = [];
let screenShake = 0;
let blinkCounter = 0;
let fireBreath = null;
let fireBreathFrame = null;
const FIRE_BREATH_CYCLE_MS = 900;
const FIRE_BREATH_ACTIVE_MS = 540;

// Preferencia de cruceta
let showDpad = localStorage.getItem('snakeIoShowDpad') === 'true';
drawerDpadToggle.checked = showDpad;
touchControls.classList.toggle('hidden', !showDpad);

updateScoresUI();
updateSoundUI();

// ========================================================
// ESCALADO ADAPTATIVO RETINA / HIGH-DPI Y MÓVILES
// ========================================================
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  TILE_SIZE = width < 480 ? 20 : 24;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  if (typeof ctx.setTransform === 'function') {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  } else if (typeof ctx.scale === 'function') {
    ctx.scale(dpr, dpr);
  }

  gridCols = Math.max(14, Math.floor(width / TILE_SIZE));
  gridRows = Math.max(14, Math.floor(height / TILE_SIZE));

  if (!isGameRunning) draw();
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150));
resizeCanvas();

// ========================================================
// SISTEMA DE AUDIO SUSPENSE CON PROTECCIÓN PARA MÓVIL
// ========================================================
let audioCtx = null;
let suspenseTimeout = null;
let tensionNoteIndex = 0;

function getAudioContext() {
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    // Si el navegador bloquea audio antes de interacción, se maneja pacíficamente
  }
  return audioCtx;
}

function playTone(frequency, duration, volume = 0.08, type = 'square') {
  if (isMuted || !frequency) return null;
  try {
    const actx = getAudioContext();
    if (!actx) return null;

    const osc = actx.createOscillator();
    const gain = actx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, actx.currentTime);

    gain.gain.setValueAtTime(volume, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + duration / 1000);

    osc.connect(gain);
    gain.connect(actx.destination);

    osc.start();
    osc.stop(actx.currentTime + duration / 1000);
    return osc;
  } catch (e) {
    return null;
  }
}

function playSuspensePulse() {
  if (!isGameRunning || isPaused || isMuted) return;

  const growth = Math.max(0, snake.length - 3);
  const tension = Math.min(1.0, growth / 22);

  const pitchMultiplier = isTurbo ? 1.25 : 1.0;
  const baseFreq = (65 + tension * 45) * pitchMultiplier;

  const intervals = enemyGuardians.length > 0
    ? [1.0, 1.414, 1.06, 1.5]
    : [1.0, 1.06, 1.18, 1.06];

  const currentInterval = intervals[tensionNoteIndex % intervals.length];
  tensionNoteIndex++;

  const freq = baseFreq * currentInterval;
  const pulseDuration = Math.max(65, (160 - tension * 80) * (isTurbo ? 0.7 : 1));
  const volume = 0.06 + tension * 0.04;

  playTone(freq, pulseDuration, volume, 'sawtooth');

  if (tension > 0.45 || enemyGuardians.length > 0) {
    setTimeout(() => {
      if (!isGameRunning || isPaused || isMuted) return;
      playTone(freq * 3.14, pulseDuration * 0.8, 0.025 + (enemyGuardians.length > 0 ? 0.03 : 0), 'sine');
    }, pulseDuration * 0.4);
  }

  let nextDelay = Math.max(150, 640 - tension * 420);
  if (enemyGuardians.length > 0) nextDelay *= 0.8;
  if (isTurbo) nextDelay *= 0.6;

  suspenseTimeout = setTimeout(playSuspensePulse, nextDelay);
}

function startSuspenseMusic() {
  stopSuspenseMusic();
  tensionNoteIndex = 0;
  playSuspensePulse();
}

function stopSuspenseMusic() {
  if (suspenseTimeout) {
    clearTimeout(suspenseTimeout);
    suspenseTimeout = null;
  }
}

function playEatSound(type = 'normal') {
  if (isMuted) return;
  if (type === 'shield') {
    playTone(523, 80, 0.16, 'triangle');
    setTimeout(() => playTone(659, 90, 0.18, 'triangle'), 70);
    setTimeout(() => playTone(1046, 200, 0.22, 'sine'), 150);
  } else if (type === 'bonus') {
    playTone(1046, 70, 0.15, 'sine');
    setTimeout(() => playTone(1567, 120, 0.16, 'sine'), 60);
  } else {
    playTone(740, 45, 0.11, 'square');
    setTimeout(() => playTone(1108, 60, 0.13, 'square'), 40);
  }
}

function playTurboStartSound() {
  if (isMuted) return;
  playTone(440, 60, 0.15, 'triangle');
  setTimeout(() => playTone(659, 80, 0.18, 'triangle'), 50);
  setTimeout(() => playTone(880, 120, 0.2, 'sine'), 110);
}

function playTurboReadySound() {
  if (isMuted) return;
  playTone(784, 80, 0.12, 'sine');
  setTimeout(() => playTone(1046, 120, 0.14, 'sine'), 80);
}

function playEnemyDefeatedSound() {
  if (isMuted) return;
  playTone(880, 100, 0.2, 'square');
  setTimeout(() => playTone(1174, 120, 0.2, 'square'), 90);
  setTimeout(() => playTone(1760, 260, 0.25, 'triangle'), 190);
}

function playGameOverSound() {
  if (isMuted) return;
  const sadScale = [311, 293, 261, 220, 155, 110];
  sadScale.forEach((note, i) => {
    setTimeout(() => playTone(note, 220, 0.16, 'sawtooth'), i * 120);
  });
}

function updateSoundUI() {
  const icon = isMuted ? '🔇' : '🔊';
  dtSoundBtn.textContent = icon;
  mbSoundBtn.textContent = icon;
  drawerSoundToggle.checked = !isMuted;
}

function toggleSound(forceState = null) {
  isMuted = forceState !== null ? !forceState : !isMuted;
  localStorage.setItem('snakeIoMuted', isMuted);
  updateSoundUI();

  if (!isMuted && isGameRunning && !isPaused) {
    getAudioContext();
    startSuspenseMusic();
  } else {
    stopSuspenseMusic();
  }
}

// ========================================================
// SISTEMA DE TURBO (UN TOQUE = 3s ACTIVOS + 5s RECARGA)
// ========================================================
function triggerTurboBurst() {
  // Solo se puede usar si el juego corre, no está pausado y no está en recarga
  if (isTurbo || turboCooldown > 0 || !isGameRunning || isPaused) return;

  isTurbo = true;
  turboRemaining = TURBO_DURATION_MS;
  updateTurboUI();

  playTurboStartSound();
  restartInterval();

  clearInterval(turboTimerInterval);
  turboTimerInterval = setInterval(() => {
    if (isPaused || !isGameRunning) return;

    if (isTurbo) {
      turboRemaining = Math.max(0, turboRemaining - TURBO_UPDATE_INTERVAL_MS);
      if (turboRemaining === 0) {
        // Se terminó el impulso: ENTRA EN RECARGA OBLIGATORIA
        isTurbo = false;
        turboCooldown = TURBO_COOLDOWN_MS;
        restartInterval();
      }
    } else if (turboCooldown > 0) {
      turboCooldown = Math.max(0, turboCooldown - TURBO_UPDATE_INTERVAL_MS);
      if (turboCooldown === 0) {
        // ¡Recarga completa! Listo para volver a usarse
        clearInterval(turboTimerInterval);
        playTurboReadySound();
      }
    }

    updateTurboUI();
  }, TURBO_UPDATE_INTERVAL_MS);
}

function updateTurboUI() {
  const charge = turboCooldown > 0
    ? 1 - turboCooldown / TURBO_COOLDOWN_MS
    : 1;

  btnTurbo.classList.toggle('active', isTurbo);
  btnTurbo.classList.toggle('cooldown', turboCooldown > 0);
  btnTurbo.disabled = turboCooldown > 0 || !isGameRunning || isPaused;
  btnTurbo.setAttribute(
    'aria-label',
    isTurbo ? 'Furia de Kukulcán activa' : turboCooldown > 0 ? 'Furia de Kukulcán recargándose' : 'Activar Furia de Kukulcán'
  );
  turboIcon.textContent = '🔥';
    turboLabel.textContent = turboCooldown > 0 ? 'RECARGA' : 'FURIA';
  turboProgress.style.setProperty('--turbo-charge', `${charge * 100}%`);
}

// Rastro sutil en la cola durante Turbo
function spawnTurboTrail(x, y) {
  const warmColors = ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'];
  for (let i = 0; i < 2; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.6 + 0.2;
    particles.push({
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      vx: Math.cos(angle) * speed * 0.4,
      vy: Math.sin(angle) * speed * 0.4,
      size: Math.random() * 2 + 1.2,
      color: warmColors[Math.floor(Math.random() * warmColors.length)],
      alpha: 0.6,
      decay: 0.08
    });
  }
}

// ========================================================
// TEXTOS FLOTANTES Y PARTÍCULAS
// ========================================================
function spawnFloatingText(text, x, y, color = '#69d3b4') {
  let targetY = y - 38;
  let targetX = x;

  for (let i = 0; i < floatingTexts.length; i++) {
    const existing = floatingTexts[i];
    if (Math.abs(existing.x - targetX) < 48 && Math.abs(existing.y - targetY) < 32) {
      targetY -= 22;
      targetX += (Math.random() > 0.5 ? 24 : -24);
    }
  }

  targetX = Math.max(50, Math.min(window.innerWidth - 50, targetX));
  targetY = Math.max(35, targetY);

  floatingTexts.push({
    text: text,
    x: targetX,
    y: targetY,
    vy: -1.3,
    alpha: 1,
    color: color
  });
}

function updateAndDrawParticles(updateState = true) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (updateState) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
    }

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    if (updateState) {
      ft.y += ft.vy;
      ft.alpha -= 0.032;
    }

    if (ft.alpha <= 0) {
      floatingTexts.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = ft.alpha;
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(ft.text);
    const bgWidth = metrics.width + 12;
    ctx.fillStyle = 'rgba(20, 23, 32, 0.84)';
    roundRect(ctx, ft.x - bgWidth / 2, ft.y - 10, bgWidth, 20, 6);
    ctx.fill();

    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}

// ========================================================
// SISTEMA DE INMUNIDAD POR ESCUDO
// ========================================================
function activateImmunity(seconds = 10) {
  isImmune = true;
  immunitySeconds = seconds;
  immunityTimerSpan.textContent = immunitySeconds;
  immunityBadge.classList.remove('hidden');

  clearInterval(immunityCountdownInterval);
  immunityCountdownInterval = setInterval(() => {
    if (isPaused) return;
    immunitySeconds--;
    immunityTimerSpan.textContent = immunitySeconds;

    if (immunitySeconds <= 0) {
      deactivateImmunity();
    }
  }, 1000);
}

function deactivateImmunity() {
  isImmune = false;
  clearInterval(immunityCountdownInterval);
  immunityBadge.classList.add('hidden');
  clearFireBreath();
}

function maybeSpawnShieldFood() {
  const targetCount = GUARDIAN_TARGETS[difficultySelect.value] || GUARDIAN_TARGETS.medium;
  let attempts = 0;
  while (shieldFoods.length < targetCount && attempts < gridCols * gridRows) {
    attempts++;
    const rx = Math.floor(Math.random() * gridCols);
    const ry = Math.floor(Math.random() * gridRows);
    if (!isGuardianCellOccupied(rx, ry)) {
      shieldFoods.push({ x: rx, y: ry });
    }
  }
}

// ========================================================
// SISTEMA DE GUARDIANES ROJOS (ENEMIGOS IA)
// ========================================================
function scheduleEnemySpawn(retryDelay = 0) {
  clearTimeout(enemySpawnTimer);
  const difficulty = difficultySelect.value;
  const targetCount = GUARDIAN_TARGETS[difficulty] || GUARDIAN_TARGETS.medium;
  updateGuardianBadge();
  if (!isGameRunning || isPaused || enemyGuardians.length >= targetCount) return;

  enemySpawnTimer = setTimeout(() => {
    const spawned = isGameRunning && !isPaused && spawnEnemySnake();
    scheduleEnemySpawn(spawned ? 0 : GUARDIAN_SPAWN_RETRY_MS);
  }, retryDelay || (hasSpawnedGuardian
    ? (GUARDIAN_NEXT_SPAWN_MS[difficulty] || GUARDIAN_NEXT_SPAWN_MS.medium)
    : (GUARDIAN_FIRST_SPAWN_MS[difficulty] || GUARDIAN_FIRST_SPAWN_MS.medium)));
}

function spawnEnemySnake() {
  const difficulty = difficultySelect.value;
  const targetCount = GUARDIAN_TARGETS[difficulty] || GUARDIAN_TARGETS.medium;
  if (!isGameRunning || enemyGuardians.length >= targetCount) return false;

  let segments = null;
  for (let attempt = 0; attempt < gridCols * gridRows; attempt++) {
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    const candidate = Array.from({ length: 4 }, (_, index) => ({
      x: (x - index + gridCols) % gridCols,
      y
    }));
    const dx = Math.min(Math.abs(x - snake[0].x), gridCols - Math.abs(x - snake[0].x));
    const dy = Math.min(Math.abs(y - snake[0].y), gridRows - Math.abs(y - snake[0].y));
    const safelyDistant = dx + dy >= 6;
    const overlaps = candidate.some(cell => isGuardianCellOccupied(cell.x, cell.y));
    if (safelyDistant && !overlaps) {
      segments = candidate;
      break;
    }
  }

  if (!segments) {
    return false;
  }

  const id = nextEnemyId++;
  const guardian = {
    id,
    segments,
    direction: { x: 1, y: 0 },
    tickCounter: 0,
    expiresAt: Date.now() + (GUARDIAN_LIFETIME_MS[difficulty] || GUARDIAN_LIFETIME_MS.medium),
    palette: GUARDIAN_PALETTES[(id - 1) % GUARDIAN_PALETTES.length]
  };
  enemyGuardians.push(guardian);
  hasSpawnedGuardian = true;
  updateGuardianBadge();
  return true;
}

function isGuardianCellOccupied(x, y) {
  return snake.some(segment => segment.x === x && segment.y === y) ||
    foods.some(food => food.x === x && food.y === y) ||
    bonusFoods.some(food => food.x === x && food.y === y) ||
    shieldFoods.some(food => food.x === x && food.y === y) ||
    enemyGuardians.some(guardian =>
      guardian.segments.some(segment => segment.x === x && segment.y === y)
    );
}

function updateGuardianBadge() {
  const count = enemyGuardians.length;
  threatBadge.classList.toggle('hidden', count === 0);
  threatBadge.textContent = count === 1
    ? '◆ Guardián al acecho'
    : `◆ ${count} guardianes al acecho`;
}

function reconcileGuardianCount() {
  const targetCount = GUARDIAN_TARGETS[difficultySelect.value] || GUARDIAN_TARGETS.medium;
  if (enemyGuardians.length > targetCount) {
    enemyGuardians.length = targetCount;
    updateGuardianBadge();
  }
  shieldFoods.length = Math.min(shieldFoods.length, targetCount);
  maybeSpawnShieldFood();
  scheduleEnemySpawn();
}

function destroyEnemySnake(guardianId, spawnBonus = true) {
  const guardianIndex = enemyGuardians.findIndex(guardian => guardian.id === guardianId);
  if (guardianIndex === -1) return;

  const [guardian] = enemyGuardians.splice(guardianIndex, 1);
  if (spawnBonus) {
    guardian.segments.forEach(segment => {
      bonusFoods.push({ x: segment.x, y: segment.y });
    });
  }

  updateGuardianBadge();
  scheduleEnemySpawn();
}

function updateEnemySnakeAI() {
  if (enemyGuardians.length === 0) return;
  const difficulty = difficultySelect.value;
  const moveInterval = (difficulty === 'easy' || difficulty === 'medium') ? 4 : 3;

  for (const guardian of [...enemyGuardians]) {
    if (Date.now() >= guardian.expiresAt) {
      destroyEnemySnake(guardian.id);
      continue;
    }

    guardian.tickCounter++;
    if ((guardian.tickCounter + guardian.id) % moveInterval !== 0) continue;

    const enemyHead = guardian.segments[0];
    const playerHead = snake[0];
    let dx = playerHead.x - enemyHead.x;
    let dy = playerHead.y - enemyHead.y;

    if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
    if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
    if (isImmune) {
      dx = -dx;
      dy = -dy;
    }

    const candidates = Math.abs(dx) >= Math.abs(dy)
      ? [{ x: Math.sign(dx) || 1, y: 0 }, { x: 0, y: Math.sign(dy) || 1 }]
      : [{ x: 0, y: Math.sign(dy) || 1 }, { x: Math.sign(dx) || 1, y: 0 }];
    candidates.push({ x: -candidates[0].x, y: -candidates[0].y });
    candidates.push({ x: -candidates[1].x, y: -candidates[1].y });

    const nextDirection = candidates.find(candidate =>
      !((candidate.x !== 0 && candidate.x === -guardian.direction.x) ||
        (candidate.y !== 0 && candidate.y === -guardian.direction.y))
    ) || guardian.direction;
    guardian.direction = nextDirection;

    const newEnemyHead = {
      x: (enemyHead.x + guardian.direction.x + gridCols) % gridCols,
      y: (enemyHead.y + guardian.direction.y + gridRows) % gridRows
    };

    const touchesPlayer = snake.some(segment =>
      segment.x === newEnemyHead.x && segment.y === newEnemyHead.y
    );
    if (touchesPlayer) {
      if (isImmune) {
        screenShake = 10;
        playEnemyDefeatedSound();
        score += 100;
        spawnFloatingText('+100 🛡️ ¡GUARDIÁN VENCIDO!', playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, '#facc15');
        updateScoresUI();
        destroyEnemySnake(guardian.id);
        continue;
      }
      gameOver('¡La serpiente roja te ha alcanzado y devorado!');
      return;
    }

    guardian.segments.unshift(newEnemyHead);
    guardian.segments.pop();
  }
}

// ========================================================
// LÓGICA DE PARTIDA Y ALIMENTOS
// ========================================================
function resetGame() {
  const startX = Math.floor(gridCols / 2);
  const startY = Math.floor(gridRows / 2);

  snake = [
    { x: startX, y: startY },
    { x: (startX - 1 + gridCols) % gridCols, y: startY },
    { x: (startX - 2 + gridCols) % gridCols, y: startY }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  foods = [];
  bonusFoods = [];
  shieldFoods = [];
  particles = [];
  floatingTexts = [];
  screenShake = 0;
  clearFireBreath();
  clearTimeout(enemySpawnTimer);
  clearTimeout(jadeSpawnTimer);
  jadeSpawnTimer = null;
  enemyGuardians = [];
  hasSpawnedGuardian = false;
  enemyPauseStartedAt = null;
  updateGuardianBadge();

  isTurbo = false;
  turboRemaining = 0;
  turboCooldown = 0;
  clearInterval(turboTimerInterval);
  updateTurboUI();

  updateScoresUI();
  deactivateImmunity();
  ensureFoodCount(6);
  maybeSpawnShieldFood();

  gameOverlay.classList.add('hidden');
}

function ensureFoodCount(count = 6) {
  while (foods.length < count) {
    const rx = Math.floor(Math.random() * gridCols);
    const ry = Math.floor(Math.random() * gridRows);
    const occupied = snake.some(s => s.x === rx && s.y === ry) ||
                     foods.some(f => f.x === rx && f.y === ry) ||
                     shieldFoods.some(food => food.x === rx && food.y === ry);
    if (!occupied) {
      foods.push({ x: rx, y: ry, shape: Math.floor(Math.random() * 6) });
    }
  }
}

function gameUpdate() {
  if (isPaused || !isGameRunning) return;

  direction = { ...nextDirection };

  let newX = (snake[0].x + direction.x + gridCols) % gridCols;
  let newY = (snake[0].y + direction.y + gridRows) % gridRows;
  const head = { x: newX, y: newY };

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    screenShake = 8;
    gameOver('Has chocado contra tu propio cuerpo.');
    return;
  }

  const hitGuardian = enemyGuardians.find(guardian =>
    guardian.segments.some(segment => segment.x === head.x && segment.y === head.y)
  );
  if (hitGuardian) {
      if (isImmune) {
        screenShake = 10;
        playEnemyDefeatedSound();
        score += 100;
        spawnFloatingText('+100 🛡️ ¡GUARDIÁN VENCIDO!', head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, '#facc15');
        updateScoresUI();
        destroyEnemySnake(hitGuardian.id);
      } else {
        screenShake = 8;
        gameOver('¡Has impactado contra la serpiente roja enemiga!');
        return;
      }
  }

  snake.unshift(head);

  const jadeIdx = shieldFoods.findIndex(food => food.x === head.x && food.y === head.y);
  if (jadeIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    shieldFoods.splice(jadeIdx, 1);
    score += 25;
    spawnFloatingText('🛡️ ¡Jade +25!', hx, hy, '#69d3b4');
    playEatSound('shield');
    activateImmunity(10);
    startFireBreath();
    updateScoresUI();
    clearTimeout(jadeSpawnTimer);
    jadeSpawnTimer = setTimeout(() => {
      jadeSpawnTimer = null;
      if (isGameRunning) maybeSpawnShieldFood();
    }, JADE_RESPAWN_DELAY_MS[difficultySelect.value] || JADE_RESPAWN_DELAY_MS.medium);
  } else {
    const bonusIdx = bonusFoods.findIndex(b => b.x === head.x && b.y === head.y);
    const foodIdx = foods.findIndex(f => f.x === head.x && f.y === head.y);

    if (bonusIdx !== -1) {
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      bonusFoods.splice(bonusIdx, 1);
      score += 50;
      spawnFloatingText('+50', hx, hy, '#facc15');
      playEatSound('bonus');
      updateScoresUI();
    } else if (foodIdx !== -1) {
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      foods.splice(foodIdx, 1);
      score += 10;
      spawnFloatingText('+10', hx, hy, '#d5bd70');
      playEatSound('normal');
      ensureFoodCount(6);
      updateScoresUI();
    } else {
      snake.pop();
    }
  }

  if (isTurbo && snake.length > 0) {
    const tail = snake[snake.length - 1];
    spawnTurboTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  }

  updateEnemySnakeAI();
  draw();
}

function updateScoresUI() {
  dtScore.textContent = score;
  mbScore.textContent = score;
  drawerScore.textContent = score;

  dtHighScore.textContent = highScore;
  mbHighScore.textContent = highScore;
  drawerHighScore.textContent = highScore;

  dtLength.textContent = snake.length;

  if (score > highScore) {
    highScore = score;
    dtHighScore.textContent = highScore;
    mbHighScore.textContent = highScore;
    drawerHighScore.textContent = highScore;
    localStorage.setItem('snakeIoHighScore', highScore);
  }
}

// ========================================================
// RENDERIZADO EN EL CANVAS
// ========================================================
function draw(updateEffects = true) {
  ctx.save();

  if (screenShake > 0) {
    const dx = (Math.random() - 0.5) * screenShake;
    const dy = (Math.random() - 0.5) * screenShake;
    ctx.translate(dx, dy);
    if (updateEffects) {
      screenShake *= 0.82;
      if (screenShake < 0.3) screenShake = 0;
    }
  }

  ctx.fillStyle = '#141720';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.strokeStyle = 'rgba(144, 153, 177, 0.16)';
  ctx.lineWidth = 1;
  const offsetX = (window.innerWidth % TILE_SIZE) / 2;
  const offsetY = (window.innerHeight % TILE_SIZE) / 2;

  for (let x = offsetX; x <= window.innerWidth; x += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, window.innerHeight);
    ctx.stroke();
  }
  for (let y = offsetY; y <= window.innerHeight; y += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(window.innerWidth, y);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(198, 164, 85, 0.1)';
  for (let x = offsetX + TILE_SIZE; x <= window.innerWidth; x += TILE_SIZE * 4) {
    for (let y = offsetY + TILE_SIZE; y <= window.innerHeight; y += TILE_SIZE * 4) {
      ctx.beginPath();
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x + 2, y);
      ctx.lineTo(x, y + 2);
      ctx.lineTo(x - 2, y);
      ctx.closePath();
      ctx.fill();
    }
  }

  const pulse = Math.sin(Date.now() * 0.006) * 1.5;

  foods.forEach((food, i) => {
    const cx = food.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = food.y * TILE_SIZE + TILE_SIZE / 2;
    drawFoodOffering(food, cx, cy, pulse);
  });

  bonusFoods.forEach(bf => {
    const cx = bf.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = bf.y * TILE_SIZE + TILE_SIZE / 2;

    ctx.fillStyle = '#f0cf70';
    ctx.shadowColor = '#e3ae43';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    const radius = Math.max(4, TILE_SIZE / 2 - 2 + pulse * 0.45);
    for (let point = 0; point < 16; point++) {
      const angle = -Math.PI / 2 + point * Math.PI / 8;
      const pointRadius = radius * (point % 2 === 0 ? 1 : 0.58);
      const x = cx + Math.cos(angle) * pointRadius;
      const y = cy + Math.sin(angle) * pointRadius;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.36, 0, Math.PI * 2);
    ctx.stroke();
  });

  shieldFoods.forEach(shieldFood => {
    const cx = shieldFood.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = shieldFood.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.strokeStyle = '#72dfbd';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#55c7a2';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE / 2 + 1 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#16785f';
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d5bd70';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - TILE_SIZE / 4);
    ctx.lineTo(cx + TILE_SIZE / 4, cy);
    ctx.lineTo(cx, cy + TILE_SIZE / 4);
    ctx.lineTo(cx - TILE_SIZE / 4, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  enemyGuardians.forEach(guardian => {
    guardian.segments.forEach((seg, idx) => {
      const isHead = idx === 0;
      ctx.fillStyle = isHead ? guardian.palette.head : guardian.palette.body;
      ctx.shadowColor = guardian.palette.head;
      ctx.shadowBlur = isHead ? 12 : 5;

      roundRect(
        ctx,
        seg.x * TILE_SIZE + 1,
        seg.y * TILE_SIZE + 1,
        TILE_SIZE - 2,
        TILE_SIZE - 2,
        isHead ? 8 : 4
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!isHead) {
        drawFeatherScale(seg, idx, guardian.palette.crest);
        return;
      }

      drawFeatherCrest(seg, guardian.direction, guardian.palette.crest);
      ctx.fillStyle = '#f7db92';
      const eyeOffset = 5;
      const eyeSize = 4;
      let e1x = seg.x * TILE_SIZE + eyeOffset;
      let e1y = seg.y * TILE_SIZE + eyeOffset;
      let e2x = seg.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      let e2y = e1y;

      if (guardian.direction.y !== 0) {
        e1y = seg.y * TILE_SIZE + (guardian.direction.y > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        e2y = e1y;
      } else if (guardian.direction.x !== 0) {
        e1x = seg.x * TILE_SIZE + (guardian.direction.x > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        e2x = e1x;
        e2y = seg.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      }

      ctx.fillRect(e1x, e1y, eyeSize, eyeSize);
      ctx.fillRect(e2x, e2y, eyeSize, eyeSize);
    });
  });

  if (updateEffects) blinkCounter++;
  const isBlinking = (blinkCounter % 90) > 85;

  snake.forEach((segment, index) => {
    const isHead = index === 0;

    if (isImmune) {
      ctx.fillStyle = isHead ? '#62d8bd' : '#168c75';
      ctx.shadowColor = '#62d8bd';
      ctx.shadowBlur = isHead ? 18 : 10;
    } else {
      ctx.fillStyle = isHead ? '#54c98f' : '#187a5c';
      if (isHead) {
        ctx.shadowColor = '#54c98f';
        ctx.shadowBlur = 10;
      }
    }

    roundRect(
      ctx,
      segment.x * TILE_SIZE + 1,
      segment.y * TILE_SIZE + 1,
      TILE_SIZE - 2,
      TILE_SIZE - 2,
      isHead ? 8 : 5
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    if (!isHead) {
      drawFeatherScale(segment, index, isImmune ? '#b6f2d1' : '#d5bd70');
    } else {
      drawFeatherCrest(segment, direction, isImmune ? '#e0fff2' : '#d5bd70');
    }

    if (isHead && !isBlinking) {
      ctx.fillStyle = '#141720';
      const eyeOffset = 5;
      const eyeSize = 3.5;
      let eye1X = segment.x * TILE_SIZE + eyeOffset;
      let eye1Y = segment.y * TILE_SIZE + eyeOffset;
      let eye2X = segment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      let eye2Y = eye1Y;

      if (direction.y !== 0) {
        eye1Y = segment.y * TILE_SIZE + (direction.y > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        eye2Y = eye1Y;
      } else if (direction.x !== 0) {
        eye1X = segment.x * TILE_SIZE + (direction.x > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        eye2X = eye1X;
        eye2Y = segment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      }

      ctx.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
      ctx.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
    }
  });

  drawFireBreath();
  updateAndDrawParticles(updateEffects);
  ctx.restore();
}

function drawFoodOffering(food, cx, cy, pulse) {
  const shape = food.shape ?? 0;
  const colors = [
    { fill: '#4fcea2', highlight: '#b0f4d8', shadow: '#36a881' },
    { fill: '#ee8054', highlight: '#ffd0a0', shadow: '#c7523a' },
    { fill: '#e8c768', highlight: '#fff0b0', shadow: '#bd8c39' },
    { fill: '#bc7351', highlight: '#f5c18e', shadow: '#81452f' },
    { fill: '#9b86d4', highlight: '#ddd0ff', shadow: '#6754a6' },
    { fill: '#e788a6', highlight: '#ffd6e3', shadow: '#ac5075' }
  ];
  const color = colors[shape % colors.length];
  const radius = Math.max(4, TILE_SIZE / 2 - 3 + pulse * 0.3);

  ctx.save();
  ctx.fillStyle = color.fill;
  ctx.strokeStyle = color.highlight;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = color.shadow;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  if (shape === 0) {
    ctx.arc(cx, cy, radius * 0.78, 0, Math.PI * 2);
  } else if (shape === 1) {
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx + radius * 0.88, cy + radius * 0.65);
    ctx.lineTo(cx - radius * 0.88, cy + radius * 0.65);
    ctx.closePath();
  } else if (shape === 2) {
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx + radius * 0.72, cy);
    ctx.lineTo(cx, cy + radius);
    ctx.lineTo(cx - radius * 0.72, cy);
    ctx.closePath();
  } else if (shape === 3) {
    ctx.moveTo(cx - radius * 0.8, cy + radius * 0.55);
    ctx.quadraticCurveTo(cx - radius * 0.25, cy - radius, cx + radius * 0.82, cy - radius * 0.78);
    ctx.quadraticCurveTo(cx + radius * 0.5, cy + radius * 0.45, cx - radius * 0.8, cy + radius * 0.55);
    ctx.closePath();
  } else if (shape === 4) {
    for (let point = 0; point < 6; point++) {
      const angle = -Math.PI / 2 + point * Math.PI / 3;
      const px = cx + Math.cos(angle) * radius * 0.82;
      const py = cy + Math.sin(angle) * radius * 0.82;
      if (point === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    for (let point = 0; point < 10; point++) {
      const angle = -Math.PI / 2 + point * Math.PI / 5;
      const pointRadius = radius * (point % 2 === 0 ? 1 : 0.48);
      const px = cx + Math.cos(angle) * pointRadius;
      const py = cy + Math.sin(angle) * pointRadius;
      if (point === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.78;
  ctx.strokeStyle = 'rgba(45, 39, 31, 0.8)';
  ctx.lineWidth = 1;
  ctx.beginPath();

  if (shape === 0) {
    ctx.arc(cx, cy, radius * 0.28, 0, Math.PI * 2);
  } else if (shape === 1) {
    ctx.moveTo(cx, cy - radius * 0.42);
    ctx.lineTo(cx, cy + radius * 0.28);
  } else if (shape === 2 || shape === 4) {
    ctx.moveTo(cx - radius * 0.32, cy);
    ctx.lineTo(cx + radius * 0.32, cy);
    ctx.moveTo(cx, cy - radius * 0.42);
    ctx.lineTo(cx, cy + radius * 0.42);
  } else {
    ctx.moveTo(cx - radius * 0.22, cy + radius * 0.2);
    ctx.lineTo(cx + radius * 0.22, cy - radius * 0.2);
  }

  ctx.stroke();
  ctx.restore();
}

function startFireBreath() {
  fireBreath = { startedAt: performance.now() };

  if (fireBreathFrame !== null) {
    cancelAnimationFrame(fireBreathFrame);
  }

  const animate = () => {
    if (!fireBreath || !isImmune || !isGameRunning) {
      clearFireBreath();
      draw(false);
      return;
    }

    if (!isPaused) draw(false);
    fireBreathFrame = requestAnimationFrame(animate);
  };

  fireBreathFrame = requestAnimationFrame(animate);
}

function drawFireBreath() {
  if (!fireBreath || !isImmune || snake.length === 0) return;

  const cycleProgress = (performance.now() - fireBreath.startedAt) % FIRE_BREATH_CYCLE_MS;
  if (cycleProgress >= FIRE_BREATH_ACTIVE_MS) return;

  const progress = cycleProgress / FIRE_BREATH_ACTIVE_MS;
  const fade = Math.sin(progress * Math.PI);
  const head = snake[0];
  const flameX = head.x * TILE_SIZE + TILE_SIZE / 2 + direction.x * TILE_SIZE * 0.4;
  const flameY = head.y * TILE_SIZE + TILE_SIZE / 2 + direction.y * TILE_SIZE * 0.4;
  const angle = Math.atan2(direction.y, direction.x);
  const flicker = Math.sin(performance.now() * 0.045);

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(flameX, flameY);
  ctx.rotate(angle);

  const flameLength = TILE_SIZE * (0.72 + (flicker + 1) * 0.13);
  const flameWidth = TILE_SIZE * (0.48 + (1 - Math.abs(flicker)) * 0.12);
  ctx.shadowColor = '#ff4b1f';
  ctx.shadowBlur = TILE_SIZE * 0.55;
  ctx.fillStyle = '#ef4c24';
  ctx.beginPath();
  ctx.moveTo(0, -flameWidth * 0.3);
  ctx.quadraticCurveTo(flameLength * 0.45, -flameWidth * 0.14, flameLength, -flameWidth * 0.52);
  ctx.quadraticCurveTo(flameLength * 0.88, 0, flameLength, flameWidth * 0.52);
  ctx.quadraticCurveTo(flameLength * 0.42, flameWidth * 0.16, 0, flameWidth * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = '#ffce59';
  ctx.shadowBlur = TILE_SIZE * 0.28;
  ctx.fillStyle = '#ffc04d';
  ctx.beginPath();
  ctx.moveTo(0, -flameWidth * 0.16);
  ctx.quadraticCurveTo(flameLength * 0.35, -flameWidth * 0.06, flameLength * 0.72, -flameWidth * 0.22);
  ctx.quadraticCurveTo(flameLength * 0.62, 0, flameLength * 0.72, flameWidth * 0.22);
  ctx.quadraticCurveTo(flameLength * 0.32, flameWidth * 0.08, 0, flameWidth * 0.16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function clearFireBreath() {
  fireBreath = null;
  if (fireBreathFrame !== null) {
    cancelAnimationFrame(fireBreathFrame);
    fireBreathFrame = null;
  }
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}

function drawFeatherScale(segment, index, color) {
  const x = segment.x * TILE_SIZE;
  const y = segment.y * TILE_SIZE;
  const cx = x + TILE_SIZE / 2;
  const cy = y + TILE_SIZE / 2;
  const size = TILE_SIZE < 22 ? 3 : 4;

  ctx.save();
  ctx.globalAlpha = index % 2 === 0 ? 0.75 : 0.5;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.55, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size * 0.55, cy);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFeatherCrest(segment, dir, color) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
  const perpendicular = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * 5, y: cy - dir.y * 5 };

  ctx.save();
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  for (let feather = -1; feather <= 1; feather++) {
    const root = {
      x: rear.x + perpendicular.x * feather * 2,
      y: rear.y + perpendicular.y * feather * 2
    };
    const tip = {
      x: rear.x - dir.x * 8 + perpendicular.x * feather * 5,
      y: rear.y - dir.y * 8 + perpendicular.y * feather * 5
    };
    ctx.beginPath();
    ctx.moveTo(root.x, root.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.stroke();
  }
  ctx.restore();
}

function getCurrentSpeed() {
  const sel = difficultySelect.value;
  let spd = SPEEDS[sel] || SPEEDS.medium;
  if (isTurbo) spd *= 0.58;
  return spd;
}

function restartInterval() {
  if (isGameRunning && !isPaused) {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameUpdate, getCurrentSpeed());
  }
}

// Iniciar o reiniciar juego
function startGame() {
  getAudioContext();
  resetGame();
  isGameRunning = true;
  isPaused = false;
  updateTurboUI();

  dtStartBtn.textContent = '🔄 Reiniciar';
  dtPauseBtn.textContent = '⏸ Pausa';

  tutorialModal.classList.add('hidden');
  drawerMenu.classList.add('hidden');
  gameOverlay.classList.add('hidden');

  restartInterval();
  startSuspenseMusic();
  scheduleEnemySpawn();
}

// Alternar pausa
function togglePause() {
  if (!isGameRunning) return;
  isPaused = !isPaused;
  dtPauseBtn.textContent = isPaused ? '▶ Reanudar' : '⏸ Pausa';
  updateTurboUI();

  if (isPaused) {
    enemyPauseStartedAt = Date.now();
    stopSuspenseMusic();
    drawerMenu.classList.remove('hidden');
  } else {
    if (enemyPauseStartedAt !== null) {
      const pauseDuration = Date.now() - enemyPauseStartedAt;
      enemyGuardians.forEach(guardian => {
        guardian.expiresAt += pauseDuration;
      });
      enemyPauseStartedAt = null;
    }
    drawerMenu.classList.add('hidden');
    startSuspenseMusic();
    scheduleEnemySpawn();
  }
}

function gameOver(reason = 'Has chocado con tu propio cuerpo.') {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(turboTimerInterval);
  clearFireBreath();
  isTurbo = false;
  turboRemaining = 0;
  turboCooldown = 0;
  updateTurboUI();
  clearTimeout(enemySpawnTimer);
  clearTimeout(jadeSpawnTimer);
  jadeSpawnTimer = null;
  enemyGuardians = [];
  enemyPauseStartedAt = null;
  updateGuardianBadge();
  deactivateImmunity();
  stopSuspenseMusic();
  playGameOverSound();

  overlayReason.textContent = reason;
  finalScoreElement.textContent = score;
  finalLengthElement.textContent = snake.length;
  gameOverlay.classList.remove('hidden');
  dtStartBtn.textContent = '▶ Iniciar';
}

function changeDirection(newDir) {
  if (!isGameRunning || isPaused) return;
  const isOpposite = (newDir.x !== 0 && newDir.x === -direction.x) ||
                     (newDir.y !== 0 && newDir.y === -direction.y);
  if (!isOpposite) {
    nextDirection = newDir;
  }
}

// ========================================================
// SISTEMA DE TUTORIAL PASO A PASO (ONBOARDING)
// ========================================================
let currentTutorialStep = 1;
const totalTutorialSteps = 3;
const tutorialTitles = [
  '🪶 Guía a Kukulcán',
  '🌽 Ofrendas y 🔥 Furia de Kukulcán',
  '🛡️ El guardián rojo'
];

function showTutorialStep(step) {
  currentTutorialStep = step;
  tutorialStepTitle.textContent = tutorialTitles[step - 1];

  for (let i = 1; i <= totalTutorialSteps; i++) {
    const el = document.getElementById(`step-1`) && document.getElementById(`step-${i}`);
    if (el) el.classList.toggle('active', i === step);
  }

  stepDots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === step - 1);
  });

  tutPrevBtn.classList.toggle('hidden', step === 1);
  tutNextBtn.classList.toggle('hidden', step === totalTutorialSteps);
  tutStartBtn.classList.toggle('hidden', step !== totalTutorialSteps);
}

function openTutorial() {
  if (isGameRunning && !isPaused) togglePause();
  drawerMenu.classList.add('hidden');
  tutorialModal.classList.remove('hidden');
  showTutorialStep(1);
}

tutNextBtn.addEventListener('click', () => {
  if (currentTutorialStep < totalTutorialSteps) {
    showTutorialStep(currentTutorialStep + 1);
  }
});

tutPrevBtn.addEventListener('click', () => {
  if (currentTutorialStep > 1) {
    showTutorialStep(currentTutorialStep - 1);
  }
});

tutStartBtn.addEventListener('click', () => {
  tutorialModal.classList.add('hidden');
  startGame();
});

// ========================================================
// CONTROLES TÁCTILES Y GESTOS (SWIPE Y BOTONES)
// ========================================================
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (e.target === canvas) {
    e.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchend', (e) => {
  if (e.changedTouches.length > 0) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const minDist = 22;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minDist) changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      if (Math.abs(dy) > minDist) changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  }
}, { passive: true });

// Evento Turbo táctil (un solo toque)
btnTurbo.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  triggerTurboBurst();
});

// Teclado
window.addEventListener('keydown', (e) => {
  if (e.key === 'Shift' || (e.key === ' ' && isGameRunning && !isPaused)) {
    triggerTurboBurst();
  }

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      changeDirection({ x: 0, y: -1 });
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      changeDirection({ x: 0, y: 1 });
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      changeDirection({ x: -1, y: 0 });
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      changeDirection({ x: 1, y: 0 });
      break;
    case 'Escape':
    case 'p':
    case 'P':
      togglePause();
      break;
  }
});

// Eventos de botones
dtStartBtn.addEventListener('click', startGame);
dtPauseBtn.addEventListener('click', togglePause);
dtSoundBtn.addEventListener('click', () => toggleSound());
dtTutorialBtn.addEventListener('click', openTutorial);

menuToggleBtn.addEventListener('click', () => {
  if (isGameRunning && !isPaused) {
    togglePause();
  } else {
    drawerMenu.classList.toggle('hidden');
  }
});

mbSoundBtn.addEventListener('click', () => toggleSound());
closeDrawerBtn.addEventListener('click', () => {
  drawerMenu.classList.add('hidden');
  if (isPaused) togglePause();
});

drawerResumeBtn.addEventListener('click', () => {
  drawerMenu.classList.add('hidden');
  if (isPaused) togglePause();
  else if (!isGameRunning) startGame();
});

drawerRestartBtn.addEventListener('click', startGame);
drawerTutorialBtn.addEventListener('click', openTutorial);
restartOverlayBtn.addEventListener('click', startGame);

drawerSoundToggle.addEventListener('change', (e) => toggleSound(e.target.checked));
drawerDpadToggle.addEventListener('change', (e) => {
  showDpad = e.target.checked;
  localStorage.setItem('snakeIoShowDpad', showDpad);
  touchControls.classList.toggle('hidden', !showDpad);
});

// Sincronizar selectores de dificultad
difficultySelect.addEventListener('change', () => {
  drawerDifficulty.value = difficultySelect.value;
  restartInterval();
  reconcileGuardianCount();
});
drawerDifficulty.addEventListener('change', () => {
  difficultySelect.value = drawerDifficulty.value;
  restartInterval();
  reconcileGuardianCount();
});

// Controles virtuales D-Pad
const bindDpad = (btn, dir) => {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    changeDirection(dir);
  });
};
bindDpad(btnUp, { x: 0, y: -1 });
bindDpad(btnDown, { x: 0, y: 1 });
bindDpad(btnLeft, { x: -1, y: 0 });
bindDpad(btnRight, { x: 1, y: 0 });

// Inicializar estado visual inicial
resetGame();
draw();
showTutorialStep(1); // Inicia mostrando el tutorial interactivo
