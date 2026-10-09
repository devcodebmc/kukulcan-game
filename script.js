// ========================================================
// LA TRAVESÍA DE KUKULCÁN — script.js (corregido)
// ========================================================

// ========================================================
// 1. REFERENCIAS AL DOM
// ========================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

const dtScore = document.getElementById('dt-score');
const dtHighScore = document.getElementById('dt-high-score');
const dtLength = document.getElementById('dt-length');
const dtSoundBtn = document.getElementById('dt-sound-btn');
const dtTutorialBtn = document.getElementById('dt-tutorial-btn');
const dtStartBtn = document.getElementById('dt-start-btn');
const dtPauseBtn = document.getElementById('dt-pause-btn');
const dtStatsBtn = document.getElementById('dt-stats-btn');
const difficultySelect = document.getElementById('difficulty-select');

const welcomeScreen = document.getElementById('welcome-screen');
const welcomeStartBtn = document.getElementById('welcome-start-btn');
const welcomeDemo = document.getElementById('welcome-demo');
const welcomeDemoCallout = document.getElementById('welcome-demo-callout');
const welcomeDemoContext = welcomeDemo.getContext('2d', { alpha: false });

const menuToggleBtn = document.getElementById('menu-toggle-btn');
const mbScore = document.getElementById('mb-score');
const mbHighScore = document.getElementById('mb-high-score');
const mbSoundBtn = document.getElementById('mb-sound-btn');
const mbPauseBtn = document.getElementById('mb-pause-btn');
const mbTutorialBtn = document.getElementById('mb-tutorial-btn');
const mobileLivesIndicator = document.getElementById('mobile-lives-indicator');
const mobileLifePips = mobileLivesIndicator ? mobileLivesIndicator.querySelectorAll('.life-pip') : [];

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
const drawerStatsBtn = document.getElementById('drawer-stats-btn');

// Badges de estado (el de vidas ya no está en el DOM visible, pero lo mantenemos por si acaso)
const livesBadge = document.getElementById('lives-badge'); 
const livesIndicator = document.getElementById('lives-indicator');
const lifePips = livesIndicator ? livesIndicator.querySelectorAll('.life-pip') : [];
const livesCount = document.getElementById('lives-count');
const immunityTimerSpan = document.getElementById('immunity-timer');
const respawnBadge = document.getElementById('respawn-badge');
const respawnTimerSpan = document.getElementById('respawn-timer');
const freezeBadge = document.getElementById('freeze-badge');
const freezeTimerSpan = document.getElementById('freeze-timer');
const rainBadge = document.getElementById('rain-badge');
const rainTimerSpan = document.getElementById('rain-timer');
const cosmicOrderFoodBadge = document.getElementById('cosmic-order-food-badge');
const cosmicOrderBadge = document.getElementById('cosmic-order-badge');
const cosmicOrderTimerSpan = document.getElementById('cosmic-order-timer');
const skullFoodBadge = document.getElementById('skull-food-badge');
const sacrificeOfferingBadge = document.getElementById('sacrifice-offering-badge');
const threatBadge = document.getElementById('threat-badge');

const btnTurbo = document.getElementById('btn-turbo');
const turboIcon = document.getElementById('turbo-icon');
const turboLabel = document.getElementById('turbo-label');
const turboProgress = document.getElementById('turbo-cooldown-bar');
const touchControls = document.getElementById('touch-controls');
const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

const tutorialModal = document.getElementById('tutorial-modal');
const tutorialStepTitle = document.getElementById('tutorial-step-title');
const tutPrevBtn = document.getElementById('tut-prev-btn');
const tutNextBtn = document.getElementById('tut-next-btn');
const tutStartBtn = document.getElementById('tut-start-btn');
const closeTutorialBtn = document.getElementById('close-tutorial-btn');
const stepDots = document.querySelectorAll('.step-dots .dot');

const gameOverlay = document.getElementById('game-overlay');
const overlayReason = document.getElementById('overlay-reason');
const finalScoreElement = document.getElementById('final-score');
const finalLengthElement = document.getElementById('final-length');
const restartOverlayBtn = document.getElementById('restart-overlay-btn');
const statisticsModal = document.getElementById('statistics-modal');
const closeStatisticsBtn = document.getElementById('close-statistics-btn');
const statisticsStorageStatus = document.getElementById('statistics-storage-status');
const countdownOverlay = document.getElementById('countdown-overlay');

// ========================================================
// 2. BADGE MANAGER
// ========================================================
const BadgeManager = (() => {
  const isMobile = () => window.innerWidth <= 768;
  const MAX_MEDIUM_MOBILE = 1;
  const MAX_HIGH_MOBILE = 2;

  const mediumOrder = [
    'cosmicOrder', 'rain', 'sacrificeOffering',
    'cosmicOrderFood', 'skullFood', 'threat'
  ];
  const highOrder = ['immunity', 'freeze', 'respawn']; // 'lives' ya no está aquí

  const refs = {
    immunity: document.getElementById('immunity-badge'),
    respawn: respawnBadge,
    freeze: freezeBadge,
    rain: rainBadge,
    cosmicOrder: cosmicOrderBadge,
    cosmicOrderFood: cosmicOrderFoodBadge,
    sacrificeOffering: sacrificeOfferingBadge,
    skullFood: skullFoodBadge,
    threat: threatBadge
  };

  const logical = {
    immunity: false,
    respawn: false,
    freeze: false,
    rain: false,
    cosmicOrder: false,
    cosmicOrderFood: false,
    sacrificeOffering: false,
    skullFood: false,
    threat: false
  };

  function setVisible(key, visible) {
    if (logical[key] === visible) return;
    logical[key] = visible;
    apply();
  }

  function apply() {
    const mobile = isMobile();

    if (mobile) {
      const activeHigh = highOrder.filter(k => logical[k]);
      const visibleHigh = new Set(activeHigh.slice(0, MAX_HIGH_MOBILE));
      highOrder.forEach(k => {
        const el = refs[k];
        if (!el) return;
        el.classList.toggle('hidden', !visibleHigh.has(k));
      });
    } else {
      highOrder.forEach(k => {
        const el = refs[k];
        if (!el) return;
        el.classList.toggle('hidden', !logical[k]);
      });
    }

    if (mobile) {
      const active = mediumOrder.filter(k => logical[k]);
      const visible = new Set(active.slice(0, MAX_MEDIUM_MOBILE));
      mediumOrder.forEach(k => {
        const el = refs[k];
        if (!el) return;
        el.classList.toggle('is-visible', visible.has(k));
        el.classList.toggle('hidden', !logical[k]);
      });
    } else {
      mediumOrder.forEach(k => {
        const el = refs[k];
        if (!el) return;
        el.classList.toggle('hidden', !logical[k]);
        el.classList.remove('is-visible');
      });
    }
  }

  return { setVisible, refresh: apply, isMobile };
})();
window.addEventListener('resize', () => BadgeManager.refresh());

// ========================================================
// 3. CONFIGURACIÓN
// ========================================================
let TILE_SIZE = window.innerWidth < 480 ? 20 : 24;
let gridCols = 30;
let gridRows = 20;

const SPEEDS = { easy: 200, medium: 150, hard: 110, extreme: 80 };
const MAX_LIVES = 3;
const RESPAWN_PROTECTION_MS = 2500;

const TURBO_DURATION_MS = 3000;
const TURBO_COOLDOWN_MS = 5000;

const GUARDIAN_TARGETS = { easy: 1, medium: 2, hard: 3, extreme: 4 };
const GUARDIAN_FIRST_SPAWN_MS = { easy: 16000, medium: 14000, hard: 12000, extreme: 10000 };
const GUARDIAN_NEXT_SPAWN_MS = { easy: 20000, medium: 15000, hard: 11000, extreme: 8000 };
const GUARDIAN_LIFETIME_MS = { easy: 24000, medium: 30000, hard: 36000, extreme: 40000 };
const JADE_RESPAWN_DELAY_MS = { easy: 18000, medium: 14000, hard: 11000, extreme: 8000 };
const FREEZE_FIRST_SPAWN_MS = 16000;
const FREEZE_RESPAWN_DELAY_MS = 22000;
const GUARDIAN_FREEZE_DURATION_MS = 3000;

// Xibalbá — guardián jefe (solo Difícil/Pesadilla)
const XIBALBA_UNLOCK_MS = 45000;
const XIBALBA_COOLDOWN_MS = 60000;
const XIBALBA_LIFETIME_MS = 20000;
const XIBALBA_TELEPORT_MS = 3200;
const XIBALBA_RETRY_MS = 3000;

const GUARDIAN_DEFS = [
  {
    behavior: 'hunter',
    name: 'Cazador',
    palette: { head: '#e2574c', body: '#9b2929', crest: '#ff9b83', eye: '#fff0c6' },
    traits: { fangs: true, crestCount: 1, eyeMark: false }
  },
  {
    behavior: 'interceptor',
    name: 'Vidente',
    palette: { head: '#a65bd4', body: '#64328e', crest: '#d4a0f0', eye: '#f0e0ff' },
    traits: { fangs: false, crestCount: 1, eyeMark: true }
  },
  {
    behavior: 'flanker',
    name: 'Flanqueador',
    palette: { head: '#f28c28', body: '#a64b1b', crest: '#ffc078', eye: '#fff0c6' },
    traits: { fangs: true, crestCount: 2, eyeMark: false }
  },
  {
    behavior: 'ambusher',
    name: 'Xibalbá',
    palette: {
      head: '#0a0510',
      body: '#1a0a1a',
      crest: '#8b0000',
      eye: '#ff1a2e',
      wing: '#0a0208', // Más oscuro
      wingBone: '#4a0a15', // Rojo tinto
      glow: '#ff1a2e'
    },
    traits: { fangs: true, crestCount: 4, eyeMark: false, wings: true, isBoss: true }
  }
];

const SACRED_RAIN_FIRST_MS = 22000;
const SACRED_RAIN_INTERVAL_MS = 42000;
const SACRED_RAIN_DURATION_MS = 8000;
const MAIZE_RAIN_BONUS = 10;
const SACRED_RAIN_MAIZE_COUNT = 3;
const MAIZE_FALL_DURATION_MS = 700;

const SACRIFICE_FIRST_SPAWN_MS = 30000;
const SACRIFICE_RESPAWN_DELAY_MS = 12000;
const SACRIFICE_REPEAT_DELAY_MS = 30000;
const SKULL_FIRST_SPAWN_MS = 20000;
const SKULL_RESPAWN_DELAY_MS = 38000;
const SKULL_MOVE_INTERVAL_MS = 8000;
const SKULL_REAPPEAR_DELAY_MS = 300;

const COSMIC_ORDER_FIRST_SPAWN_MS = 30000;
const COSMIC_ORDER_SPAWN_INTERVAL_MS = 45000;
const COSMIC_ORDER_SPAWN_RETRY_MS = 5000;
const COSMIC_ORDER_WARNING_MS = 1000;
const COSMIC_ORDER_FOOD_LIFETIME_MS = 15000;
const COSMIC_ORDER_REWARD = 50;
const COSMIC_ORDER_FLASH_DURATION_MS = 720;

const WELCOME_DEMO_TICK_MS = 260;

// El tablero de la demo se calcula según el tamaño real del canvas
let welcomeDemoCols = 22;
let welcomeDemoRows = 8;
let welcomeDemoRoute = [];
let welcomeScenario = null;
let welcomeLayout = null; // { cell, bx, by }

const STATISTICS_STORAGE_KEY = 'kukulcanGameStatistics';
const DIFFICULTY_NAMES = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil', extreme: 'Pesadilla' };

// ========================================================
// 4. STORAGE SEGURO
// ========================================================
let storageUnavailable = false;
function safeGetItem(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; }
  catch (e) { storageUnavailable = true; return fallback; }
}
function safeSetItem(key, value) {
  try { localStorage.setItem(key, String(value)); return true; }
  catch (e) { storageUnavailable = true; return false; }
}

// ========================================================
// 5. ESTADO DEL JUEGO
// ========================================================
let snake = [];
let foods = [];
let bonusFoods = [];
let shieldFoods = [];
let freezeFoods = [];
let cosmicOrderFoods = [];
let sacrificeFoods = [];
let skullFoods = [];
let lastSkullPosition = null;
let direction = { x: 1, y: 0 };
let directionQueue = [];
let score = 0;
let lives = MAX_LIVES;
let highScore = Math.max(0, parseInt(safeGetItem('snakeIoHighScore', '0'), 10) || 0);
let isGameRunning = false;
let isPaused = false;
let isMuted = safeGetItem('snakeIoMuted', 'false') === 'true';
let runStartedAt = null;
let runDifficulty = null;
let runGuardiansDefeated = 0;

let gameTime = 0;
let simulationAccumulator = 0;
let lastFrameTimestamp = null;
let animationFrameId = null;
let countdownEndsAt = null;
let countdownValue = 0;
let renderInterpolation = 1;
let previousSnakePositions = [];
let previousGuardianPositions = new Map();

let boardCanvas = null;
let boardContext = null;
let boardWidth = 0;
let boardHeight = 0;

let headPulse = 0;
let headPulseColor = '#d5bd70';

let sacredRainUntil = 0;
let nextSacredRainAt = null;
let maizeSpawnRetryAt = null;
let nextSacrificeSpawnAt = null;
let nextSkullSpawnAt = null;
let nextSkullMoveAt = null;
let nextCosmicOrderSpawnAt = null;
let cosmicOrderResolveAt = null;
let cosmicOrderFlashStartedAt = null;
let enemySpawnAt = null;
let jadeSpawnAt = null;
let freezeSpawnAt = null;
let nextXibalbaSpawnAt = null;

let isTurbo = false;
let turboReadyAt = 0;
let turboCooldownUntil = 0;

let isImmune = false;
let immunityExpiresAt = 0;
let respawnProtectedUntil = 0;

let enemyGuardians = [];
let nextEnemyId = 1;
let hasSpawnedGuardian = false;
let guardiansFrozenUntil = 0;

let particles = [];
let floatingTexts = [];
let screenShake = 0;
let blinkCounter = 0;
let fireBreath = null;
const FIRE_BREATH_CYCLE_MS = 900;
const FIRE_BREATH_ACTIVE_MS = 540;

let jadeTrailAccumulator = 0;

let welcomeDemoSnake = [];
let welcomeDemoPreviousSnake = [];
let welcomeDemoGuardian = [];
let welcomeDemoPreviousGuardian = [];
let welcomeDemoDirection = { x: 1, y: 0 };
let welcomeDemoRouteIndex = 0;
let welcomeDemoRouteSteps = 0;
let welcomeDemoTick = 0;
let welcomeDemoAccumulator = 0;
let welcomeDemoLastFrame = null;
let welcomeDemoFrameId = null;
let welcomeDemoScore = 0;
let welcomeDemoMaize = null;
let welcomeDemoJade = null;
let welcomeDemoImmuneUntil = 0;
let welcomeDemoFlashUntil = 0;
let welcomeDemoGuardianDefeatedUntil = 0;
let welcomeDemoGameOverUntil = 0;

let currentTutorialStep = 1;
const totalTutorialSteps = 4;
const tutorialTitles = [
  'La Travesía de Kukulcán',
  'Las ofrendas sagradas',
  'Los guardianes',
  'Poderes y sacrificios'
];
let tutorialWasRunning = false;
let tutorialWasPaused = false;
let tutorialDrawerWasVisible = false;
let tutorialOpenedFromWelcome = false;

let statisticsWasRunning = false;
let statisticsWasPaused = false;
let statisticsDrawerWasVisible = false;

let showDpad = safeGetItem('snakeIoShowDpad', 'false') === 'true';

// ========================================================
// 6. ESTADÍSTICAS
// ========================================================
function createEmptyStats() {
  return Object.fromEntries(Object.keys(DIFFICULTY_NAMES).map(d => [
    d, { gamesPlayed: 0, bestScore: 0, bestSurvivalMs: 0, guardiansDefeated: 0 }
  ]));
}
function isValidStats(v) {
  return v && typeof v === 'object' && Object.keys(DIFFICULTY_NAMES).every(d => {
    const r = v[d];
    return r && ['gamesPlayed','bestScore','bestSurvivalMs','guardiansDefeated']
      .every(f => Number.isFinite(r[f]) && r[f] >= 0);
  });
}
function loadStats() {
  const saved = safeGetItem(STATISTICS_STORAGE_KEY, null);
  if (storageUnavailable) {
    statisticsStorageStatus.textContent = 'Este navegador no permite guardar estadísticas.';
    return createEmptyStats();
  }
  if (!saved) return createEmptyStats();
  try {
    const parsed = JSON.parse(saved);
    if (isValidStats(parsed)) return parsed;
    throw new Error('Formato inválido');
  } catch (e) {
    console.error('No se pudieron cargar las estadísticas.', e);
    statisticsStorageStatus.textContent = 'No se pudieron leer las estadísticas guardadas.';
    return createEmptyStats();
  }
}
let gameStatistics = loadStats();

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} min ${s % 60} s` : `${s} s`;
}
function updateStatisticsUI() {
  document.querySelectorAll('[data-stat][data-field]').forEach(cell => {
    const { stat, field } = cell.dataset;
    const v = gameStatistics[stat][field];
    cell.textContent = field === 'bestSurvivalMs' ? formatDuration(v) : v;
  });
}
function saveStats() {
  updateStatisticsUI();
  if (!safeSetItem(STATISTICS_STORAGE_KEY, JSON.stringify(gameStatistics))) {
    statisticsStorageStatus.textContent = 'No se pudieron guardar las estadísticas.';
  } else {
    statisticsStorageStatus.textContent = '';
  }
}
function finishRunStatistics() {
  if (runStartedAt === null || runDifficulty === null) return;
  const r = gameStatistics[runDifficulty];
  r.gamesPlayed++;
  r.bestScore = Math.max(r.bestScore, score);
  r.bestSurvivalMs = Math.max(r.bestSurvivalMs, gameTime - runStartedAt);
  r.guardiansDefeated += runGuardiansDefeated;
  saveStats();
  runStartedAt = null;
  runDifficulty = null;
  runGuardiansDefeated = 0;
}

// ========================================================
// 7. ESCALADO ADAPTATIVO
// ========================================================
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  TILE_SIZE = width < 480 ? 20 : 24;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gridCols = Math.max(14, Math.floor(width / TILE_SIZE));
  gridRows = Math.max(14, Math.floor(height / TILE_SIZE));
  rebuildBoardCanvas(width, height, dpr);
  if (!isGameRunning) draw(1, false);
}

function rebuildBoardCanvas(width, height, dpr) {
  if (boardCanvas && boardWidth === width && boardHeight === height) return;
  boardCanvas = document.createElement('canvas');
  boardCanvas.width = Math.max(1, Math.floor(width * dpr));
  boardCanvas.height = Math.max(1, Math.floor(height * dpr));
  boardWidth = width;
  boardHeight = height;
  boardContext = boardCanvas.getContext('2d', { alpha: false });
  boardContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  boardContext.fillStyle = '#141720';
  boardContext.fillRect(0, 0, width, height);
  boardContext.strokeStyle = 'rgba(144, 153, 177, 0.13)';
  boardContext.lineWidth = 1;
  const offsetX = (width % TILE_SIZE) / 2;
  const offsetY = (height % TILE_SIZE) / 2;

  for (let x = offsetX; x <= width; x += TILE_SIZE) {
    boardContext.beginPath();
    boardContext.moveTo(x, 0);
    boardContext.lineTo(x, height);
    boardContext.stroke();
  }
  for (let y = offsetY; y <= height; y += TILE_SIZE) {
    boardContext.beginPath();
    boardContext.moveTo(0, y);
    boardContext.lineTo(width, y);
    boardContext.stroke();
  }

  boardContext.fillStyle = 'rgba(198, 164, 85, 0.07)';
  for (let x = offsetX + TILE_SIZE * 2; x <= width; x += TILE_SIZE * 4) {
    for (let y = offsetY + TILE_SIZE * 2; y <= height; y += TILE_SIZE * 4) {
      boardContext.beginPath();
      boardContext.moveTo(x, y - 3);
      boardContext.lineTo(x + 3, y);
      boardContext.lineTo(x, y + 3);
      boardContext.lineTo(x - 3, y);
      boardContext.closePath();
      boardContext.fill();
    }
  }

  const centerX = width / 2;
  const centerY = height / 2;
  boardContext.strokeStyle = 'rgba(198, 164, 85, 0.06)';
  boardContext.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const size = TILE_SIZE * (6 + i * 2);
    boardContext.beginPath();
    boardContext.rect(centerX - size / 2, centerY - size / 2, size, size);
    boardContext.stroke();
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150));

// ========================================================
// 8. AUDIO
// ========================================================
let audioCtx = null;
let suspenseTimeout = null;
let tensionNoteIndex = 0;

function getAudioContext() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  } catch (e) {}
  return audioCtx;
}
function playTone(freq, dur, vol = 0.08, type = 'square') {
  if (isMuted || !freq) return null;
  try {
    const a = getAudioContext();
    if (!a) return null;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, a.currentTime);
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur / 1000);
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + dur / 1000);
    return o;
  } catch (e) { return null; }
}
function playSuspensePulse() {
  if (!isGameRunning || isPaused || isMuted) return;
  const growth = Math.max(0, snake.length - 3);
  const tension = Math.min(1, growth / 22);
  const base = (65 + tension * 45) * (isTurbo ? 1.25 : 1);
  const intervals = enemyGuardians.length > 0 ? [1, 1.414, 1.06, 1.5] : [1, 1.06, 1.18, 1.06];
  const f = base * intervals[tensionNoteIndex % intervals.length];
  tensionNoteIndex++;
  const dur = Math.max(65, (160 - tension * 80) * (isTurbo ? 0.7 : 1));
  const vol = 0.06 + tension * 0.04;
  playTone(f, dur, vol, 'sawtooth');
  if (tension > 0.45 || enemyGuardians.length > 0) {
    setTimeout(() => {
      if (!isGameRunning || isPaused || isMuted) return;
      playTone(f * 3.14, dur * 0.8, 0.025 + (enemyGuardians.length > 0 ? 0.03 : 0), 'sine');
    }, dur * 0.4);
  }
  let next = Math.max(150, 640 - tension * 420);
  if (enemyGuardians.length > 0) next *= 0.8;
  if (isTurbo) next *= 0.6;
  suspenseTimeout = setTimeout(playSuspensePulse, next);
}
function startSuspenseMusic() { stopSuspenseMusic(); tensionNoteIndex = 0; playSuspensePulse(); }
function stopSuspenseMusic() { if (suspenseTimeout) { clearTimeout(suspenseTimeout); suspenseTimeout = null; } }

function playEatSound(type = 'normal') {
  if (isMuted) return;
  if (type === 'sacrifice') {
    playTone(392, 100, 0.17, 'triangle');
    setTimeout(() => playTone(587, 130, 0.19, 'sine'), 70);
    setTimeout(() => playTone(784, 210, 0.2, 'sine'), 155);
  } else if (type === 'freeze') {
    playTone(880, 70, 0.14, 'triangle');
    setTimeout(() => playTone(660, 110, 0.16, 'sine'), 55);
    setTimeout(() => playTone(990, 150, 0.18, 'sine'), 130);
  } else if (type === 'shield') {
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
function playCosmicOrderSound() {
  if (isMuted) return;
  try {
    const a = getAudioContext();
    if (!a) return;
    const now = a.currentTime;
    const layers = [
      { f: 82, ef: 34, d: 0.72, v: 0.3, t: 'sawtooth' },
      { f: 196, ef: 49, d: 0.58, v: 0.22, t: 'triangle' },
      { f: 523, ef: 131, d: 0.34, v: 0.13, t: 'square' }
    ];
    layers.forEach(l => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = l.t;
      o.frequency.setValueAtTime(l.f, now);
      o.frequency.exponentialRampToValueAtTime(l.ef, now + l.d);
      g.gain.setValueAtTime(l.v, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + l.d);
      o.connect(g);
      g.connect(a.destination);
      o.start(now);
      o.stop(now + l.d);
    });
  } catch (e) {}
}
function playGameOverSound() {
  if (isMuted) return;
  const notes = [311, 293, 261, 220, 155, 110];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 220, 0.16, 'sawtooth'), i * 120));
}
function vibrate(pattern) {
  if (navigator.vibrate && !isMuted) {
    try { navigator.vibrate(pattern); } catch (e) {}
  }
}
function updateSoundUI() {
  const icon = isMuted ? '🔇' : '🔊';
  dtSoundBtn.textContent = icon;
  mbSoundBtn.textContent = icon;
  drawerSoundToggle.checked = !isMuted;
}
function toggleSound(forceState = null) {
  isMuted = forceState !== null ? !forceState : !isMuted;
  safeSetItem('snakeIoMuted', isMuted);
  updateSoundUI();
  if (!isMuted && isGameRunning && !isPaused) {
    getAudioContext();
    startSuspenseMusic();
  } else {
    stopSuspenseMusic();
  }
}

// ========================================================
// 9. TURBO
// ========================================================
function triggerTurboBurst() {
  if (isTurbo || getTurboCooldownRemaining() > 0 || !isGameRunning || isPaused || countdownEndsAt !== null) return;
  isTurbo = true;
  turboReadyAt = gameTime + TURBO_DURATION_MS;
  turboCooldownUntil = turboReadyAt + TURBO_COOLDOWN_MS;
  updateTurboUI();
  playTurboStartSound();
  vibrate(20);
}
function getTurboCooldownRemaining() {
  return Math.max(0, turboCooldownUntil - gameTime);
}
function updateTurboUI() {
  const cooldownRemaining = getTurboCooldownRemaining();
  const charge = isTurbo ? 1 : cooldownRemaining > 0 ? 1 - cooldownRemaining / TURBO_COOLDOWN_MS : 1;

  btnTurbo.classList.toggle('active', isTurbo);
  btnTurbo.classList.toggle('cooldown', cooldownRemaining > 0 && !isTurbo);
  btnTurbo.disabled = (cooldownRemaining > 0 && !isTurbo) || !isGameRunning || isPaused || countdownEndsAt !== null;
  btnTurbo.setAttribute(
    'aria-label',
    isTurbo ? 'Furia activa' : cooldownRemaining > 0 ? 'Furia recargándose' : 'Activar Furia'
  );
  turboIcon.textContent = '🔥';
  turboLabel.textContent = isTurbo ? 'FURIA' : cooldownRemaining > 0 ? 'RECARGA' : 'FURIA';
  turboProgress.style.setProperty('--turbo-charge', `${Math.max(0, Math.min(1, charge)) * 100}%`);
}

// ========================================================
// 10. EFECTOS VISUALES
// ========================================================
function triggerHeadPulse(color = '#d5bd70') {
  headPulse = 1;
  headPulseColor = color;
}
function spawnFloatingText(text, x, y, color = '#4ec9a0') {
  const max = window.innerWidth <= 768 ? 3 : 8;
  if (floatingTexts.length >= max) floatingTexts.splice(0, floatingTexts.length - max + 1);
  let ty = y - 38;
  let tx = x;
  for (const ft of floatingTexts) {
    if (Math.abs(ft.x - tx) < 48 && Math.abs(ft.y - ty) < 32) {
      ty -= 22;
      tx += (Math.random() > 0.5 ? 24 : -24);
    }
  }
  tx = Math.max(50, Math.min(window.innerWidth - 50, tx));
  ty = Math.max(35, ty);
  floatingTexts.push({ text, x: tx, y: ty, vy: -1.3, alpha: 1, color });
}
function spawnWorldCrossingEffect(x, y) {
  triggerHeadPulse('#8be7ff');
  const colors = ['#8be7ff', '#4ec9a0', '#d5bd70'];
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5;
    const s = 0.7 + (i % 2) * 0.35;
    particles.push({
      x, y,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      size: 2.2, color: colors[i % colors.length],
      alpha: 0.8, decay: 0.09
    });
  }
}
function spawnTurboTrail(x, y) {
  const colors = ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'];
  const back = Math.atan2(-direction.y, -direction.x);
  for (let i = 0; i < 3; i++) {
    const a = back + (Math.random() - 0.5) * Math.PI;
    const s = Math.random() * 0.8 + 0.5;
    particles.push({
      x: x + (Math.random() - 0.5) * 7,
      y: y + (Math.random() - 0.5) * 7,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      size: Math.random() * 1.8 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.9, decay: 0.045
    });
  }
}
function spawnJadeTrail(x, y) {
  const colors = ['#7de8c4', '#4ec9a0', '#fff0b0'];
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.2,
      size: Math.random() * 1.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.85, decay: 0.035
    });
  }
}
function updateAndDrawParticles(updateState = true) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (updateState) { p.x += p.vx; p.y += p.vy; p.alpha -= p.decay; }
    if (p.alpha <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    if (updateState) { ft.y += ft.vy; ft.alpha -= 0.032; }
    if (ft.alpha <= 0) { floatingTexts.splice(i, 1); continue; }
    ctx.globalAlpha = ft.alpha;
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const m = ctx.measureText(ft.text);
    const w = m.width + 12;
    ctx.fillStyle = 'rgba(20, 23, 32, 0.85)';
    roundRect(ctx, ft.x - w / 2, ft.y - 10, w, 20, 6);
    ctx.fill();
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.globalAlpha = 1;
}

// ========================================================
// 11. INMUNIDAD / FREEZE
// ========================================================
function activateImmunity(seconds = 10) {
  isImmune = true;
  immunityExpiresAt = gameTime + seconds * 1000;
  immunityTimerSpan.textContent = seconds;
  BadgeManager.setVisible('immunity', true);
  startFireBreath();
  vibrate(30);
}
function deactivateImmunity() {
  isImmune = false;
  immunityExpiresAt = 0;
  BadgeManager.setVisible('immunity', false);
  clearFireBreath();
}
function hasGuardianProtection() {
  return isImmune || gameTime < respawnProtectedUntil;
}
function activateGuardianFreeze() {
  guardiansFrozenUntil = gameTime + GUARDIAN_FREEZE_DURATION_MS;
  enemyGuardians.forEach(g => { if (g.frozenAt === null) g.frozenAt = gameTime; });
  freezeTimerSpan.textContent = String(GUARDIAN_FREEZE_DURATION_MS / 1000);
  BadgeManager.setVisible('freeze', true);
  vibrate(25);
}

// ========================================================
// 12. GUARDIANES
// ========================================================
function scheduleEnemySpawn(retryDelay = null) {
  const difficulty = difficultySelect.value;
  const target = GUARDIAN_TARGETS[difficulty] || GUARDIAN_TARGETS.medium;
  const normalGuardians = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  updateGuardianBadge();
  if (!isGameRunning || normalGuardians >= target || cosmicOrderResolveAt !== null) {
    enemySpawnAt = null;
    return;
  }
  if (isPaused || countdownEndsAt !== null) return;
  const delay = retryDelay ?? (hasSpawnedGuardian
    ? (GUARDIAN_NEXT_SPAWN_MS[difficulty] || GUARDIAN_NEXT_SPAWN_MS.medium)
    : (GUARDIAN_FIRST_SPAWN_MS[difficulty] || GUARDIAN_FIRST_SPAWN_MS.medium));
  enemySpawnAt = gameTime + delay;
}

function isCellFreeForNewGuardian(x, y) {
  return !snake.some(s => s.x === x && s.y === y) &&
    !foods.some(f => f.x === x && f.y === y) &&
    !bonusFoods.some(f => f.x === x && f.y === y) &&
    !shieldFoods.some(f => f.x === x && f.y === y) &&
    !freezeFoods.some(f => f.x === x && f.y === y) &&
    !cosmicOrderFoods.some(f => f.x === x && f.y === y) &&
    !sacrificeFoods.some(f => f.x === x && f.y === y) &&
    !skullFoods.some(f => f.x === x && f.y === y);
}

function spawnEnemySnake() {
  const difficulty = difficultySelect.value;
  const target = GUARDIAN_TARGETS[difficulty] || GUARDIAN_TARGETS.medium;
  const normalCount = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  if (!isGameRunning || normalCount >= target) return false;

  const marginX = Math.max(3, Math.ceil(56 / TILE_SIZE));
  const marginY = Math.max(3, Math.ceil(88 / TILE_SIZE));
  const minX = marginX + 3;
  const maxX = gridCols - marginX - 1;
  const minY = marginY;
  const maxY = gridRows - marginY - 1;

  for (let attempt = 0; attempt < 120; attempt++) {
    if (minX > maxX || minY > maxY) break;
    const x = minX + Math.floor(Math.random() * (maxX - minX + 1));
    const y = minY + Math.floor(Math.random() * (maxY - minY + 1));
    const candidate = Array.from({ length: 4 }, (_, i) => ({
      x: (x - i + gridCols) % gridCols,
      y
    }));
    const dx = Math.min(Math.abs(x - snake[0].x), gridCols - Math.abs(x - snake[0].x));
    const dy = Math.min(Math.abs(y - snake[0].y), gridRows - Math.abs(y - snake[0].y));
    if (dx + dy < 8) continue;
    if (candidate.some(c => !isCellFreeForNewGuardian(c.x, c.y))) continue;

    const id = nextEnemyId++;
    const normalDefs = GUARDIAN_DEFS.filter(d => d.behavior !== 'ambusher');
    const def = normalDefs[(id - 1) % normalDefs.length];
    const guardian = {
      id,
      segments: candidate,
      direction: { x: 1, y: 0 },
      tickCounter: 0,
      expiresAt: gameTime + (GUARDIAN_LIFETIME_MS[difficulty] || GUARDIAN_LIFETIME_MS.medium),
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette,
      behavior: { id: def.behavior, name: def.name },
      traits: def.traits
    };
    enemyGuardians.push(guardian);
    hasSpawnedGuardian = true;
    updateGuardianBadge();
    return true;
  }
  return false;
}

// ==== XIBALBA — JEFE DEL INFRAMUNDO ====
function spawnXibalba() {
  const difficulty = difficultySelect.value;
  if (difficulty !== 'hard' && difficulty !== 'extreme') return false;
  const normalGuardians = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  if (normalGuardians < 2) return false;
  if (enemyGuardians.some(g => g.behavior.id === 'ambusher')) return false;

  const safeMarginX = Math.max(4, Math.ceil(56 / TILE_SIZE));
  const safeMarginY = Math.max(4, Math.ceil(88 / TILE_SIZE));
  const minX = safeMarginX + 3;
  const maxX = gridCols - safeMarginX - 1;
  const minY = safeMarginY;
  const maxY = gridRows - safeMarginY - 1;

  for (let attempt = 0; attempt < 120; attempt++) {
    if (minX > maxX || minY > maxY) break;
    const x = minX + Math.floor(Math.random() * (maxX - minX + 1));
    const y = minY + Math.floor(Math.random() * (maxY - minY + 1));
    const dx = Math.min(Math.abs(x - snake[0].x), gridCols - Math.abs(x - snake[0].x));
    const dy = Math.min(Math.abs(y - snake[0].y), gridRows - Math.abs(y - snake[0].y));
    if (dx + dy < 12) continue;
    if (isGuardianCellOccupied(x, y)) continue;

    const id = nextEnemyId++;
    const def = GUARDIAN_DEFS.find(d => d.behavior === 'ambusher');
    const guardian = {
      id,
      segments: [{ x, y }],
      direction: { x: 1, y: 0 },
      tickCounter: 0,
      expiresAt: gameTime + XIBALBA_LIFETIME_MS,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette,
      behavior: { id: def.behavior, name: def.name },
      traits: def.traits,
      nextTeleportAt: gameTime + XIBALBA_TELEPORT_MS,
      teleportFlash: 0
    };
    enemyGuardians.push(guardian);
    nextXibalbaSpawnAt = gameTime + XIBALBA_COOLDOWN_MS;
    updateGuardianBadge();
    return true;
  }
  return false;
}

function isGuardianCellOccupied(x, y) {
  return snake.some(s => s.x === x && s.y === y) ||
    foods.some(f => f.x === x && f.y === y) ||
    bonusFoods.some(f => f.x === x && f.y === y) ||
    shieldFoods.some(f => f.x === x && f.y === y) ||
    freezeFoods.some(f => f.x === x && f.y === y) ||
    cosmicOrderFoods.some(f => f.x === x && f.y === y) ||
    sacrificeFoods.some(f => f.x === x && f.y === y) ||
    skullFoods.some(f => f.x === x && f.y === y) ||
    enemyGuardians.some(g => g.segments.some(s => s.x === x && s.y === y));
}

function updateGuardianBadge() {
  const count = enemyGuardians.length;
  if (count === 0) {
    BadgeManager.setVisible('threat', false);
    return;
  }

  const hasXibalba = enemyGuardians.some(g => g.behavior.id === 'ambusher');
  const names = [...new Set(enemyGuardians.map(g => g.behavior.name))];
  const desktopText = hasXibalba
    ? `🦇 ¡XIBALBÁ al acecho!`
    : (count === 1
      ? `${names[0]} al acecho`
      : `${count} guardianes: ${names.join(' · ')}`);
  const mobileText = hasXibalba ? '¡Xibalbá!' : (count === 1 ? names[0] : `${count} guardianes`);

  const desktopSpan = threatBadge.querySelector('.badge-text-desktop');
  const mobileSpan = threatBadge.querySelector('.badge-text-mobile');
  if (desktopSpan) desktopSpan.textContent = desktopText;
  if (mobileSpan) mobileSpan.textContent = mobileText;

  const dot = document.getElementById('threat-dot');
  if (dot) {
    const first = enemyGuardians[0];
    const color = hasXibalba ? '#ef3340' : first.palette.head;
    dot.style.background = color;
    dot.style.boxShadow = `0 0 8px ${color}`;
    dot.style.color = color;
  }

  const firstPalette = enemyGuardians[0].palette;
  threatBadge.style.background = `linear-gradient(135deg, ${firstPalette.body}cc, ${firstPalette.head}aa)`;
  threatBadge.style.borderColor = firstPalette.head;

  BadgeManager.setVisible('threat', true);
}

function getGuardianTarget(g, playerHead, difficulty) {
  if (g.behavior.id === 'interceptor') {
    const lead = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    return {
      x: (playerHead.x + direction.x * lead + gridCols) % gridCols,
      y: (playerHead.y + direction.y * lead + gridRows) % gridRows
    };
  }
  if (g.behavior.id === 'flanker') {
    const orbit = Math.floor(g.tickCounter / 12 + g.id) % 4;
    const offsets = [{ x: 0, y: -5 }, { x: 5, y: 0 }, { x: 0, y: 5 }, { x: -5, y: 0 }];
    const o = offsets[orbit];
    return {
      x: (playerHead.x + o.x + gridCols) % gridCols,
      y: (playerHead.y + o.y + gridRows) % gridRows
    };
  }
  return playerHead;
}

function reconcileGuardianCount() {
  const newDifficulty = difficultySelect.value;
  const target = GUARDIAN_TARGETS[newDifficulty] || GUARDIAN_TARGETS.medium;

  if (newDifficulty !== 'hard' && newDifficulty !== 'extreme') {
    const xibalba = enemyGuardians.find(g => g.behavior.id === 'ambusher');
    if (xibalba) destroyEnemySnake(xibalba.id);
  }

  let normalCount = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  if (normalCount > target) {
    for (let i = enemyGuardians.length - 1; i >= 0 && normalCount > target; i--) {
      if (enemyGuardians[i] && enemyGuardians[i].behavior.id !== 'ambusher') {
        enemyGuardians.splice(i, 1);
        normalCount--;
      }
    }
    updateGuardianBadge();
  }

  shieldFoods.length = Math.min(shieldFoods.length, target);
  maybeSpawnShieldFood();
  scheduleEnemySpawn();
}

function destroyEnemySnake(id, spawnBonus = true) {
  const idx = enemyGuardians.findIndex(g => g.id === id);
  if (idx === -1) return;
  const [g] = enemyGuardians.splice(idx, 1);
  if (spawnBonus) {
    g.segments.forEach(s => bonusFoods.push({ x: s.x, y: s.y }));
    if (g.behavior.id === 'ambusher') {
      g.segments.forEach(s => {
        bonusFoods.push({ x: s.x, y: s.y });
        for (let p = 0; p < 4; p++) {
          const a = (Math.PI * 2 * p) / 4 + Math.random() * 0.3;
          const sp = 2 + Math.random() * 2;
          particles.push({
            x: s.x * TILE_SIZE + TILE_SIZE / 2,
            y: s.y * TILE_SIZE + TILE_SIZE / 2,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            size: 3 + Math.random() * 2,
            color: Math.random() > 0.5 ? '#ef3340' : '#1a0a14',
            alpha: 1, decay: 0.02
          });
        }
      });
      nextXibalbaSpawnAt = gameTime + XIBALBA_COOLDOWN_MS;
    }
  }
  updateGuardianBadge();
  scheduleEnemySpawn();
}

function updateEnemySnakeAI() {
  if (enemyGuardians.length === 0 || guardiansFrozenUntil > gameTime || cosmicOrderResolveAt !== null) return;
  const difficulty = difficultySelect.value;
  const moveInterval = (difficulty === 'easy' || difficulty === 'medium') ? 4 : 3;

  for (const g of [...enemyGuardians]) {
    if (gameTime >= g.expiresAt) { destroyEnemySnake(g.id); continue; }
    g.tickCounter++;

    // ==== XIBALBÁ: teletransporte y comportamiento especial ====
    if (g.behavior.id === 'ambusher') {
      if (gameTime >= g.nextTeleportAt) {
        const playerHead = snake[0];
        const total = gridCols * gridRows;
        const start = Math.floor(Math.random() * total);
        for (let o = 0; o < total; o++) {
          const c = (start + o) % total;
          const tx = c % gridCols;
          const ty = Math.floor(c / gridCols);
          const dx = Math.min(Math.abs(tx - playerHead.x), gridCols - Math.abs(tx - playerHead.x));
          const dy = Math.min(Math.abs(ty - playerHead.y), gridRows - Math.abs(ty - playerHead.y));
          const dist = dx + dy;
          if (dist >= 6 && dist <= 10 && !isGuardianCellOccupied(tx, ty)) {
            g.segments[0] = { x: tx, y: ty };
            g.teleportFlash = 1;
            g.nextTeleportAt = gameTime + XIBALBA_TELEPORT_MS;
            break;
          }
        }
      }
      if (g.teleportFlash > 0) g.teleportFlash = Math.max(0, g.teleportFlash - 0.05);

      const enemyHead = g.segments[0];
      const playerHead = snake[0];
      let dx = playerHead.x - enemyHead.x;
      let dy = playerHead.y - enemyHead.y;
      if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
      if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
      if (hasGuardianProtection()) { dx = -dx; dy = -dy; }

      const cands = Math.abs(dx) >= Math.abs(dy)
        ? [{ x: Math.sign(dx) || 1, y: 0 }, { x: 0, y: Math.sign(dy) || 1 }]
        : [{ x: 0, y: Math.sign(dy) || 1 }, { x: Math.sign(dx) || 1, y: 0 }];
      cands.push({ x: -cands[0].x, y: -cands[0].y });
      const dir = cands.find(c =>
        !((c.x !== 0 && c.x === -g.direction.x) || (c.y !== 0 && c.y === -g.direction.y))
      ) || g.direction;
      g.direction = dir;

      const newHead = {
        x: (enemyHead.x + dir.x + gridCols) % gridCols,
        y: (enemyHead.y + dir.y + gridRows) % gridRows
      };
      const touches = snake.some(s => s.x === newHead.x && s.y === newHead.y);
      if (touches) {
        if (hasGuardianProtection()) {
          screenShake = 12;
          playEnemyDefeatedSound();
          vibrate([40, 30, 40, 30, 60]);
          runGuardiansDefeated++;
          score += 250;
          spawnFloatingText('+250 🦇 ¡XIBALBÁ VENCIDO!', playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, '#ef3340');
          updateScoresUI();
          destroyEnemySnake(g.id);
          continue;
        } else {
          screenShake = 12;
          loseLife('¡Xibalbá, señor del inframundo, te devoró!');
          return;
        }
      }
      g.segments.unshift(newHead);
      g.segments.pop();
      continue;
    }
    // ==== FIN XIBALBÁ ====

    const interval = moveInterval + (g.behavior.id === 'interceptor' ? 1 : 0);
    if ((g.tickCounter + g.id) % interval !== 0) continue;

    const enemyHead = g.segments[0];
    const playerHead = snake[0];
    const target = getGuardianTarget(g, playerHead, difficulty);

    let dx = target.x - enemyHead.x;
    let dy = target.y - enemyHead.y;
    if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
    if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
    if (hasGuardianProtection()) { dx = -dx; dy = -dy; }

    const candidates = Math.abs(dx) >= Math.abs(dy)
      ? [{ x: Math.sign(dx) || 1, y: 0 }, { x: 0, y: Math.sign(dy) || 1 }]
      : [{ x: 0, y: Math.sign(dy) || 1 }, { x: Math.sign(dx) || 1, y: 0 }];
    candidates.push({ x: -candidates[0].x, y: -candidates[0].y });
    candidates.push({ x: -candidates[1].x, y: -candidates[1].y });

    const dir = candidates.find(c =>
      !((c.x !== 0 && c.x === -g.direction.x) || (c.y !== 0 && c.y === -g.direction.y))
    ) || g.direction;
    g.direction = dir;

    const newHead = {
      x: (enemyHead.x + dir.x + gridCols) % gridCols,
      y: (enemyHead.y + dir.y + gridRows) % gridRows
    };

    const touches = snake.some(s => s.x === newHead.x && s.y === newHead.y);
    if (touches) {
      if (hasGuardianProtection()) {
        screenShake = 10;
        playEnemyDefeatedSound();
        vibrate(35);
        runGuardiansDefeated++;
        score += 100;
        const label = isImmune ? '+100 💎 ¡GUARDIÁN VENCIDO!' : '+100 🪶 ¡GUARDIÁN VENCIDO!';
        const color = isImmune ? '#facc15' : '#4ec9a0';
        spawnFloatingText(label, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
        updateScoresUI();
        destroyEnemySnake(g.id);
        continue;
      }
      loseLife(`¡El ${g.behavior.name} te alcanzó!`);
      return;
    }

    g.segments.unshift(newHead);
    g.segments.pop();
  }
}

// ========================================================
// 13. SPAWN HELPERS
// ========================================================
function maybeSpawnCosmicOrderFood() {
  if (cosmicOrderFoods.length > 0 || enemyGuardians.length === 0) return false;
  const total = gridCols * gridRows;
  const start = Math.floor(Math.random() * total);
  for (let o = 0; o < total; o++) {
    const c = (start + o) % total;
    const x = c % gridCols;
    const y = Math.floor(c / gridCols);
    if (isGuardianCellOccupied(x, y)) continue;
    cosmicOrderFoods.push({ x, y, expiresAt: gameTime + COSMIC_ORDER_FOOD_LIFETIME_MS });
    BadgeManager.setVisible('cosmicOrderFood', true);
    return true;
  }
  return false;
}
function spawnSacrificeOffering() {
  if (lives >= MAX_LIVES || sacrificeFoods.length > 0) return false;
  const total = gridCols * gridRows;
  const start = Math.floor(Math.random() * total);
  for (let o = 0; o < total; o++) {
    const c = (start + o) % total;
    const x = c % gridCols;
    const y = Math.floor(c / gridCols);
    if (isGuardianCellOccupied(x, y)) continue;
    sacrificeFoods.push({ x, y });
    BadgeManager.setVisible('sacrificeOffering', true);
    return true;
  }
  return false;
}
function spawnSkullFood() {
  if (skullFoods.length > 0) return false;
  const available = [];
  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      if (!isGuardianCellOccupied(x, y)) available.push({ x, y });
    }
  }
  const different = available.filter(p =>
    !lastSkullPosition || p.x !== lastSkullPosition.x || p.y !== lastSkullPosition.y
  );
  const cells = different.length > 0 ? different : available;
  if (cells.length === 0) return false;
  const pos = cells[Math.floor(Math.random() * cells.length)];
  skullFoods.push(pos);
  lastSkullPosition = { ...pos };
  BadgeManager.setVisible('skullFood', true);
  return true;
}
function maybeSpawnShieldFood() {
  const target = GUARDIAN_TARGETS[difficultySelect.value] || GUARDIAN_TARGETS.medium;
  let attempts = 0;
  while (shieldFoods.length < target && attempts < 200) {
    attempts++;
    const rx = Math.floor(Math.random() * gridCols);
    const ry = Math.floor(Math.random() * gridRows);
    if (!isGuardianCellOccupied(rx, ry)) shieldFoods.push({ x: rx, y: ry });
  }
}
function maybeSpawnFreezeFood() {
  if (freezeFoods.length > 0) return true;
  const head = snake[0];
  for (let i = 0; i < 160; i++) {
    const x = (head.x + Math.floor(Math.random() * 17) - 8 + gridCols) % gridCols;
    const y = (head.y + Math.floor(Math.random() * 17) - 8 + gridRows) % gridRows;
    const dx = Math.min(Math.abs(x - head.x), gridCols - Math.abs(x - head.x));
    const dy = Math.min(Math.abs(y - head.y), gridRows - Math.abs(y - head.y));
    if (dx + dy <= 8 && !isGuardianCellOccupied(x, y)) {
      freezeFoods.push({ x, y });
      return true;
    }
  }
  for (let i = 0; i < gridCols * gridRows; i++) {
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    if (isGuardianCellOccupied(x, y)) continue;
    freezeFoods.push({ x, y });
    return true;
  }
  return false;
}
function resolveCosmicOrder() {
  cosmicOrderResolveAt = null;
  BadgeManager.setVisible('cosmicOrder', false);

  const cleared = enemyGuardians.length;
  if (cleared === 0) {
    enemySpawnAt = null;
    scheduleEnemySpawn();
    return;
  }
  cosmicOrderFlashStartedAt = gameTime;
  const defeated = enemyGuardians;
  runGuardiansDefeated += cleared;
  defeated.forEach(g => {
    g.segments.forEach(s => {
      const x = s.x * TILE_SIZE + TILE_SIZE / 2;
      const y = s.y * TILE_SIZE + TILE_SIZE / 2;
      for (let p = 0; p < 5; p++) {
        const a = (Math.PI * 2 * p) / 5 + Math.random() * 0.3;
        const sp = 1.8 + Math.random() * 2.2;
        particles.push({
          x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          size: 2.5 + Math.random() * 2,
          color: Math.random() > 0.5 ? '#d5bd70' : '#8be7ff',
          alpha: 1, decay: 0.025 + Math.random() * 0.015
        });
      }
    });
  });
  enemyGuardians = [];
  previousGuardianPositions.clear();
  updateGuardianBadge();

  screenShake = 10;
  playCosmicOrderSound();
  vibrate([30, 50, 30]);
  const reward = cleared * COSMIC_ORDER_REWARD;
  score += reward;
  updateScoresUI();
  triggerHeadPulse('#d5bd70');
  const head = snake[0];
  spawnFloatingText(`🌀 Orden +${reward}`, head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, '#d5bd70');

  enemySpawnAt = null;
  scheduleEnemySpawn();
}

// ========================================================
// 14. LOOP
// ========================================================
function getCurrentSpeed() {
  const sel = difficultySelect.value;
  const base = SPEEDS[sel] || SPEEDS.medium;
  const lengthPenalty = Math.max(0, snake.length - 3) * 2.4;
  const adaptive = Math.max(base * 0.72, base - lengthPenalty);
  return isTurbo ? adaptive * 0.58 : adaptive;
}
function snapshotRenderPositions() {
  previousSnakePositions = snake.map(s => ({ ...s }));
  previousGuardianPositions = new Map(enemyGuardians.map(g => [
    g.id, g.segments.map(s => ({ ...s }))
  ]));
}
function startCountdown() {
  countdownEndsAt = performance.now() + 3000;
  countdownValue = 3;
  countdownOverlay.textContent = String(countdownValue);
  countdownOverlay.classList.remove('hidden');
}
function cancelCountdown() {
  countdownEndsAt = null;
  countdownValue = 0;
  countdownOverlay.textContent = '';
  countdownOverlay.classList.add('hidden');
}
function gameLoopFrame(timestamp) {
  animationFrameId = null;
  if (!isGameRunning) {
    draw(1, false);
    lastFrameTimestamp = null;
    return;
  }
  const elapsedMs = lastFrameTimestamp === null ? 0 : Math.max(0, timestamp - lastFrameTimestamp);
  lastFrameTimestamp = timestamp;
  let updateEffects = false;

  if (!isPaused) {
    if (countdownEndsAt !== null) {
      const remaining = Math.max(0, countdownEndsAt - timestamp);
      const next = Math.ceil(remaining / 1000);
      if (next > 0 && next !== countdownValue) {
        countdownValue = next;
        countdownOverlay.textContent = String(countdownValue);
      }
      if (remaining === 0) {
        cancelCountdown();
        simulationAccumulator = 0;
        snapshotRenderPositions();
        renderInterpolation = 1;
        scheduleEnemySpawn();
      }
    } else {
      updateEffects = true;
      updateGameTimers(elapsedMs);
      simulationAccumulator = Math.min(simulationAccumulator + elapsedMs, getCurrentSpeed() * 3);
      let ticks = 0;
      while (isGameRunning && !isPaused && countdownEndsAt === null && ticks < 3 && simulationAccumulator >= getCurrentSpeed()) {
        const tickDuration = getCurrentSpeed();
        snapshotRenderPositions();
        gameUpdate();
        simulationAccumulator -= tickDuration;
        ticks++;
      }
      renderInterpolation = Math.min(1, simulationAccumulator / getCurrentSpeed());
    }
  }
  draw(renderInterpolation, updateEffects);
  if (isGameRunning) animationFrameId = requestAnimationFrame(gameLoopFrame);
  else lastFrameTimestamp = null;
}
function startGameLoop() {
  if (animationFrameId === null) {
    lastFrameTimestamp = null;
    animationFrameId = requestAnimationFrame(gameLoopFrame);
  }
}

// ========================================================
// 15. TIMERS
// ========================================================
function updateGameTimers(elapsedMs) {
  gameTime += elapsedMs;
  if (headPulse > 0) headPulse = Math.max(0, headPulse - elapsedMs / 240);

  if (guardiansFrozenUntil > 0) {
    if (gameTime >= guardiansFrozenUntil) {
      enemyGuardians.forEach(g => {
        if (g.frozenAt !== null) {
          g.expiresAt += gameTime - g.frozenAt;
          g.frozenAt = null;
        }
      });
      guardiansFrozenUntil = 0;
      BadgeManager.setVisible('freeze', false);
    } else {
      freezeTimerSpan.textContent = String(Math.ceil((guardiansFrozenUntil - gameTime) / 1000));
    }
  }
  if (isImmune) {
    const sec = Math.max(0, Math.ceil((immunityExpiresAt - gameTime) / 1000));
    immunityTimerSpan.textContent = sec;
    if (gameTime >= immunityExpiresAt) deactivateImmunity();
  }
  if (respawnProtectedUntil > 0) {
    if (gameTime >= respawnProtectedUntil) {
      respawnProtectedUntil = 0;
      BadgeManager.setVisible('respawn', false);
    } else {
      respawnTimerSpan.textContent = String(Math.ceil((respawnProtectedUntil - gameTime) / 1000));
    }
  }
  if (isTurbo && gameTime >= turboReadyAt) isTurbo = false;
  if (!isTurbo && turboCooldownUntil > 0 && gameTime >= turboCooldownUntil) {
    turboCooldownUntil = 0;
    playTurboReadySound();
  }
  updateTurboUI();

  if (enemySpawnAt !== null && gameTime >= enemySpawnAt) {
    enemySpawnAt = null;
    const ok = spawnEnemySnake();
    scheduleEnemySpawn(ok ? null : 1500);
  }

  const difficultyForBoss = difficultySelect.value;
  if (
    (difficultyForBoss === 'hard' || difficultyForBoss === 'extreme') &&
    gameTime >= XIBALBA_UNLOCK_MS &&
    enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length >= 2 &&
    !enemyGuardians.some(g => g.behavior.id === 'ambusher')
  ) {
    if (!nextXibalbaSpawnAt || gameTime >= nextXibalbaSpawnAt) {
      const spawned = spawnXibalba();
      if (spawned) {
        const xibalba = enemyGuardians.find(g => g.behavior.id === 'ambusher');
        if (xibalba) {
          const head = xibalba.segments[0];
          for (let p = 0; p < 8; p++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 1 + Math.random() * 2;
            particles.push({
              x: head.x * TILE_SIZE + TILE_SIZE / 2,
              y: head.y * TILE_SIZE + TILE_SIZE / 2,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              size: 2 + Math.random() * 2,
              color: Math.random() > 0.5 ? '#ef3340' : '#8b0000',
              alpha: 1,
              decay: 0.025
            });
          }
        }
      } else {
        nextXibalbaSpawnAt = gameTime + XIBALBA_RETRY_MS;
      }
    }
  }

  const xibalbaActive = enemyGuardians.find(g => g.behavior.id === 'ambusher');
  if (xibalbaActive && Math.random() < 0.35) {
    const head = xibalbaActive.segments[0];
    particles.push({
      x: head.x * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      y: head.y * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.5 - Math.random() * 0.5,
      size: 1.5 + Math.random() * 1.5,
      color: Math.random() > 0.5 ? '#ef3340' : '#8b0000',
      alpha: 0.8,
      decay: 0.03
    });
  }

  if (jadeSpawnAt !== null && gameTime >= jadeSpawnAt) {
    jadeSpawnAt = null;
    maybeSpawnShieldFood();
  }
  if (freezeSpawnAt !== null && gameTime >= freezeSpawnAt) {
    freezeSpawnAt = null;
    if (enemyGuardians.length === 0 || !maybeSpawnFreezeFood()) {
      freezeSpawnAt = gameTime + 1500;
    }
  }

  if (nextSacredRainAt !== null && gameTime >= nextSacredRainAt) {
    sacredRainUntil = gameTime + SACRED_RAIN_DURATION_MS;
    nextSacredRainAt = gameTime + SACRED_RAIN_INTERVAL_MS;
    if (!ensureMaizeOffering()) maizeSpawnRetryAt = gameTime + 500;
    rainTimerSpan.textContent = String(Math.ceil(SACRED_RAIN_DURATION_MS / 1000));
    BadgeManager.setVisible('rain', true);
  }
  if (sacredRainUntil > gameTime && maizeSpawnRetryAt !== null && gameTime >= maizeSpawnRetryAt) {
    if (!ensureMaizeOffering()) maizeSpawnRetryAt = gameTime + 500;
  }
  if (sacredRainUntil > 0) {
    if (gameTime >= sacredRainUntil) {
      sacredRainUntil = 0;
      maizeSpawnRetryAt = null;
      BadgeManager.setVisible('rain', false);
    } else {
      rainTimerSpan.textContent = String(Math.ceil((sacredRainUntil - gameTime) / 1000));
    }
  }

  if (nextSacrificeSpawnAt !== null && gameTime >= nextSacrificeSpawnAt) {
    if (lives >= MAX_LIVES) nextSacrificeSpawnAt = null;
    else if (sacrificeFoods.length > 0) nextSacrificeSpawnAt = gameTime + SACRIFICE_REPEAT_DELAY_MS;
    else if (spawnSacrificeOffering()) nextSacrificeSpawnAt = gameTime + SACRIFICE_REPEAT_DELAY_MS;
    else nextSacrificeSpawnAt = gameTime + 1000;
  }
  if (nextSkullSpawnAt !== null && gameTime >= nextSkullSpawnAt && skullFoods.length > 0) {
    nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
  } else if (nextSkullSpawnAt !== null && gameTime >= nextSkullSpawnAt && skullFoods.length === 0 && nextSkullMoveAt === null) {
    if (spawnSkullFood()) {
      nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
      nextSkullMoveAt = gameTime + SKULL_MOVE_INTERVAL_MS;
    } else nextSkullSpawnAt = gameTime + 1000;
  }
  if (nextSkullMoveAt !== null && gameTime >= nextSkullMoveAt) {
    if (skullFoods.length > 0) {
      skullFoods = [];
      BadgeManager.setVisible('skullFood', false);
      nextSkullMoveAt = gameTime + SKULL_REAPPEAR_DELAY_MS;
    } else if (spawnSkullFood()) nextSkullMoveAt = gameTime + SKULL_MOVE_INTERVAL_MS;
    else nextSkullMoveAt = gameTime + 1000;
  }

  if (cosmicOrderResolveAt !== null) {
    if (gameTime >= cosmicOrderResolveAt) resolveCosmicOrder();
    else cosmicOrderTimerSpan.textContent = String(Math.ceil((cosmicOrderResolveAt - gameTime) / 1000));
  }
  if (cosmicOrderFoods.some(f => f.expiresAt !== undefined && gameTime >= f.expiresAt)) {
    cosmicOrderFoods = [];
    BadgeManager.setVisible('cosmicOrderFood', false);
  }
  if (nextCosmicOrderSpawnAt !== null && gameTime >= nextCosmicOrderSpawnAt) {
    if (cosmicOrderFoods.length > 0) nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_INTERVAL_MS;
    else if (enemyGuardians.length === 0) nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_RETRY_MS;
    else if (maybeSpawnCosmicOrderFood()) nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_INTERVAL_MS;
    else nextCosmicOrderSpawnAt = gameTime + 1000;
  }

  const target = GUARDIAN_TARGETS[difficultySelect.value] || GUARDIAN_TARGETS.medium;
  const normalCount = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  if (isGameRunning && !isPaused && countdownEndsAt === null &&
      cosmicOrderResolveAt === null && normalCount < target && enemySpawnAt === null) {
    scheduleEnemySpawn();
  }

  if (cosmicOrderFlashStartedAt !== null && gameTime - cosmicOrderFlashStartedAt >= COSMIC_ORDER_FLASH_DURATION_MS) {
    cosmicOrderFlashStartedAt = null;
  }

  if (isImmune && snake.length > 0) {
    jadeTrailAccumulator += elapsedMs;
    if (jadeTrailAccumulator > 55) {
      jadeTrailAccumulator = 0;
      const tail = snake[snake.length - 1];
      spawnJadeTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
    }
  }
}

// ========================================================
// 16. RESET / GAME OVER
// ========================================================
function ensureFoodCount(count = 6) {
  let attempts = 0;
  while (foods.length < count && attempts < gridCols * gridRows) {
    attempts++;
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    if (isGuardianCellOccupied(x, y)) continue;
    foods.push({
      x, y,
      shape: Math.floor(Math.random() * 6),
      offering: Math.random() < 0.35 ? 'cacao' : 'common'
    });
  }
  if (sacredRainUntil > gameTime) ensureMaizeOffering();
}

function ensureMaizeOffering() {
  let count = foods.filter(f => f.offering === 'maize').length;
  if (count >= SACRED_RAIN_MAIZE_COUNT) {
    maizeSpawnRetryAt = null;
    return true;
  }
  while (count < SACRED_RAIN_MAIZE_COUNT) {
    const total = gridCols * gridRows;
    const start = Math.floor(Math.random() * total);
    let spawned = false;
    for (let o = 0; o < total; o++) {
      const c = (start + o) % total;
      const x = c % gridCols;
      const y = Math.floor(c / gridCols);
      if (isGuardianCellOccupied(x, y)) continue;
      foods.push({
        x, y,
        shape: 2,
        offering: 'maize',
        landingAt: gameTime + MAIZE_FALL_DURATION_MS,
        meteorOffsetX: (Math.random() - 0.5) * TILE_SIZE * 4
      });
      count++;
      spawned = true;
      break;
    }
    if (!spawned) {
      maizeSpawnRetryAt = gameTime + 500;
      return false;
    }
  }
  maizeSpawnRetryAt = null;
  return true;
}

function resetGame() {
  const startX = Math.floor(gridCols / 2);
  const startY = Math.floor(gridRows / 2);
  snake = [
    { x: startX, y: startY },
    { x: (startX - 1 + gridCols) % gridCols, y: startY },
    { x: (startX - 2 + gridCols) % gridCols, y: startY }
  ];
  direction = { x: 1, y: 0 };
  directionQueue = [];
  lives = MAX_LIVES;
  respawnProtectedUntil = 0;
  BadgeManager.setVisible('respawn', false);
  previousSnakePositions = snake.map(s => ({ ...s }));
  previousGuardianPositions.clear();
  score = 0;
  foods = [];
  bonusFoods = [];
  shieldFoods = [];
  freezeFoods = [];
  cosmicOrderFoods = [];
  sacrificeFoods = [];
  skullFoods = [];
  lastSkullPosition = null;
  nextSkullMoveAt = null;
  BadgeManager.setVisible('sacrificeOffering', false);
  BadgeManager.setVisible('skullFood', false);
  BadgeManager.setVisible('cosmicOrder', false);
  BadgeManager.setVisible('cosmicOrderFood', false);
  BadgeManager.setVisible('rain', false);

  sacredRainUntil = 0;
  nextSacredRainAt = SACRED_RAIN_FIRST_MS;
  maizeSpawnRetryAt = null;
  nextCosmicOrderSpawnAt = COSMIC_ORDER_FIRST_SPAWN_MS;
  cosmicOrderResolveAt = null;
  cosmicOrderFlashStartedAt = null;
  nextSacrificeSpawnAt = SACRIFICE_FIRST_SPAWN_MS;
  nextSkullSpawnAt = SKULL_FIRST_SPAWN_MS;

  particles = [];
  floatingTexts = [];
  screenShake = 0;
  headPulse = 0;
  headPulseColor = '#d5bd70';
  clearFireBreath();
  jadeTrailAccumulator = 0;

  enemySpawnAt = null;
  jadeSpawnAt = null;
  freezeSpawnAt = FREEZE_FIRST_SPAWN_MS;
  guardiansFrozenUntil = 0;
  nextXibalbaSpawnAt = null;
  BadgeManager.setVisible('freeze', false);
  enemyGuardians = [];
  hasSpawnedGuardian = false;
  updateGuardianBadge();

  isTurbo = false;
  turboReadyAt = 0;
  turboCooldownUntil = 0;
  updateTurboUI();

  updateScoresUI();
  updateLivesUI();
  deactivateImmunity();
  ensureFoodCount(6);
  maybeSpawnShieldFood();
  gameOverlay.classList.add('hidden');
}

function findRespawnPosition() {
  const cx = Math.floor(gridCols / 2);
  const cy = Math.floor(gridRows / 2);
  for (let o = 0; o < gridCols * gridRows; o++) {
    const x = (cx + o % gridCols) % gridCols;
    const y = (cy + Math.floor(o / gridCols)) % gridRows;
    const segs = [0, 1, 2].map(d => ({
      x: (x - d + gridCols) % gridCols, y
    }));
    const overlap = segs.some(p =>
      enemyGuardians.some(g => g.segments.some(s => s.x === p.x && s.y === p.y))
    );
    if (!overlap) return { x, y };
  }
  return null;
}

function loseLife(reason) {
  lives = Math.max(0, lives - 1);
  updateLivesUI();
  screenShake = 8;
  vibrate([40, 30, 40]);

  if (lives === 0) {
    gameOver(`${reason} Se agotaron los tres sacrificios.`);
    return;
  }
  const prevHead = snake[0];
  const spawn = findRespawnPosition();
  if (!spawn) {
    gameOver('Los guardianes han cerrado todos los caminos.');
    return;
  }
  snake = [
    { x: spawn.x, y: spawn.y },
    { x: (spawn.x - 1 + gridCols) % gridCols, y: spawn.y },
    { x: (spawn.x - 2 + gridCols) % gridCols, y: spawn.y }
  ];
  direction = { x: 1, y: 0 };
  directionQueue = [];
  previousSnakePositions = snake.map(s => ({ ...s }));
  deactivateImmunity();
  isTurbo = false;
  turboReadyAt = 0;
  turboCooldownUntil = 0;
  updateTurboUI();
  respawnProtectedUntil = gameTime + RESPAWN_PROTECTION_MS;
  respawnTimerSpan.textContent = String(Math.ceil(RESPAWN_PROTECTION_MS / 1000));
  BadgeManager.setVisible('respawn', true);
  triggerHeadPulse('#4ec9a0');

  if (prevHead) {
    spawnFloatingText('🫀 Sacrificio perdido', prevHead.x * TILE_SIZE + TILE_SIZE / 2, prevHead.y * TILE_SIZE, '#ef5261');
  }
  updateScoresUI();
  if (sacrificeFoods.length === 0) nextSacrificeSpawnAt = gameTime + SACRIFICE_RESPAWN_DELAY_MS;
}

// ========================================================
// 17. UPDATE POR TICK
// ========================================================
function gameUpdate() {
  if (isPaused || !isGameRunning || countdownEndsAt !== null) return;

  if (directionQueue.length > 0) direction = directionQueue.shift();

  const crossed =
    (direction.x > 0 && snake[0].x === gridCols - 1) ||
    (direction.x < 0 && snake[0].x === 0) ||
    (direction.y > 0 && snake[0].y === gridRows - 1) ||
    (direction.y < 0 && snake[0].y === 0);

  const newX = (snake[0].x + direction.x + gridCols) % gridCols;
  const newY = (snake[0].y + direction.y + gridRows) % gridRows;
  const head = { x: newX, y: newY };

  const willGrow =
    foods.some(f => f.x === head.x && f.y === head.y && (f.landingAt === undefined || gameTime >= f.landingAt)) ||
    bonusFoods.some(f => f.x === head.x && f.y === head.y) ||
    shieldFoods.some(f => f.x === head.x && f.y === head.y) ||
    freezeFoods.some(f => f.x === head.x && f.y === head.y) ||
    cosmicOrderFoods.some(f => f.x === head.x && f.y === head.y) ||
    sacrificeFoods.some(f => f.x === head.x && f.y === head.y);

  const bodyCheck = willGrow ? snake : snake.slice(0, -1);
  if (bodyCheck.some(s => s.x === head.x && s.y === head.y)) {
    loseLife('Kukulcán se enredó con su propio cuerpo.');
    return;
  }

  const skullIdx = skullFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (skullIdx !== -1) {
    skullFoods.splice(skullIdx, 1);
    nextSkullMoveAt = null;
    BadgeManager.setVisible('skullFood', false);
    nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
    loseLife('¡La Calavera maldita te arrebató un sacrificio!');
    return;
  }

  const hitG = enemyGuardians.find(g => g.segments.some(s => s.x === head.x && s.y === head.y));
  if (hitG) {
    const isBoss = hitG.behavior.id === 'ambusher';
    if (hasGuardianProtection() || guardiansFrozenUntil > gameTime) {
      const shield = isImmune;
      const frozen = guardiansFrozenUntil > gameTime;
      const color = shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
      const symbol = shield ? '💎' : frozen ? '❄️' : '🪶';
      const reward = isBoss ? 250 : 100;
      screenShake = isBoss ? 12 : 10;
      triggerHeadPulse(color);
      playEnemyDefeatedSound();
      vibrate(isBoss ? [40, 30, 40, 30, 60] : 35);
      runGuardiansDefeated++;
      score += reward;
      const label = isBoss
        ? `+${reward} ${symbol} ¡XIBALBÁ VENCIDO!`
        : `+${reward} ${symbol} ¡GUARDIÁN VENCIDO!`;
      spawnFloatingText(label, head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, color);
      updateScoresUI();
      destroyEnemySnake(hitG.id);
    } else {
      screenShake = isBoss ? 12 : 8;
      loseLife(isBoss
        ? '¡Xibalbá, señor del inframundo, te devoró!'
        : `¡El ${hitG.behavior.name} te alcanzó!`);
      return;
    }
  }

  snake.unshift(head);

  const jadeIdx = shieldFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (jadeIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    shieldFoods.splice(jadeIdx, 1);
    score += 25;
    triggerHeadPulse('#4ec9a0');
    spawnFloatingText('💎 ¡Jade +25!', hx, hy, '#4ec9a0');
    playEatSound('shield');
    activateImmunity(10);
    updateScoresUI();
    jadeSpawnAt = gameTime + (JADE_RESPAWN_DELAY_MS[difficultySelect.value] || JADE_RESPAWN_DELAY_MS.medium);
    return;
  }
  const freezeIdx = freezeFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (freezeIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    freezeFoods.splice(freezeIdx, 1);
    score += 25;
    triggerHeadPulse('#8be7ff');
    spawnFloatingText('❄️ ¡Hielo +25!', hx, hy, '#8be7ff');
    playEatSound('freeze');
    activateGuardianFreeze();
    freezeSpawnAt = gameTime + FREEZE_RESPAWN_DELAY_MS;
    updateScoresUI();
    return;
  }
  const sacIdx = sacrificeFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (sacIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    sacrificeFoods.splice(sacIdx, 1);
    BadgeManager.setVisible('sacrificeOffering', false);
    const prev = lives;
    lives = Math.min(MAX_LIVES, lives + 1);
    updateLivesUI();
    triggerHeadPulse('#f3d7bd');
    spawnFloatingText(`🫀 +${lives - prev} Sacrificio recuperado`, hx, hy, '#f3d7bd');
    playEatSound('sacrifice');
    vibrate(20);
    nextSacrificeSpawnAt = lives < MAX_LIVES ? gameTime + SACRIFICE_REPEAT_DELAY_MS : null;
    return;
  }
  const coIdx = cosmicOrderFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (coIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    cosmicOrderFoods.splice(coIdx, 1);
    BadgeManager.setVisible('cosmicOrderFood', false);
    cosmicOrderResolveAt = gameTime + COSMIC_ORDER_WARNING_MS;
    enemyGuardians.forEach(g => { g.cosmicOrderHitAt = gameTime; });
    cosmicOrderTimerSpan.textContent = String(COSMIC_ORDER_WARNING_MS / 1000);
    BadgeManager.setVisible('cosmicOrder', true);
    enemySpawnAt = null;
    triggerHeadPulse('#d5bd70');
    spawnFloatingText('🌀 ¡Sello del orden!', hx, hy, '#d5bd70');
    playEatSound('bonus');
    return;
  }
  const bonusIdx = bonusFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (bonusIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    bonusFoods.splice(bonusIdx, 1);
    score += 50;
    triggerHeadPulse('#facc15');
    spawnFloatingText('+50', hx, hy, '#facc15');
    playEatSound('bonus');
    updateScoresUI();
    return;
  }
  const foodIdx = foods.findIndex(f =>
    f.x === head.x && f.y === head.y && (f.landingAt === undefined || gameTime >= f.landingAt)
  );
  if (foodIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    const [food] = foods.splice(foodIdx, 1);
    const maizeBonus = food.offering === 'maize' && sacredRainUntil > gameTime ? MAIZE_RAIN_BONUS : 0;
    const foodScore = 10 + maizeBonus;
    score += foodScore;
    triggerHeadPulse(maizeBonus ? '#facc15' : '#d5bd70');
    spawnFloatingText(
      maizeBonus ? `+${foodScore} 🌽🌧️` : `+${foodScore}`,
      hx, hy,
      maizeBonus ? '#facc15' : '#d5bd70'
    );
    playEatSound('normal');
    ensureFoodCount(6);
    updateScoresUI();
    return;
  }

  snake.pop();

  if (crossed) {
    spawnWorldCrossingEffect(head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE + TILE_SIZE / 2);
  }
  if (isTurbo && snake.length > 0) {
    const tail = snake[snake.length - 1];
    spawnTurboTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  }

  updateEnemySnakeAI();
}

// ========================================================
// 18. UI
// ========================================================
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
    safeSetItem('snakeIoHighScore', highScore);
  }
}
function updateLivesUI() {
  // Actualizar los corazones en el HUD móvil
  if (mobileLifePips.length > 0) {
    mobileLifePips.forEach((pip, i) => pip.classList.toggle('spent', i >= lives));
  }
  
  // Si aún existe el badge de vidas en el DOM (aunque oculto), actualizarlo también
  if (livesBadge) {
    const lifePips = livesBadge.querySelectorAll('.life-pip');
    lifePips.forEach((pip, i) => pip.classList.toggle('spent', i >= lives));
    livesBadge.setAttribute('aria-label', `Sacrificios: ${lives} de ${MAX_LIVES}`);
    livesBadge.setAttribute('data-lives-label', String(lives));
  }
  
  if (livesCount) livesCount.textContent = String(lives);
}

// ========================================================
// 19. HELPERS DE DIBUJO
// ========================================================
function interpolateGridPosition(current, previous, progress) {
  if (!previous || progress >= 1) return current;
  let dx = current.x - previous.x;
  let dy = current.y - previous.y;
  if (dx > gridCols / 2) dx -= gridCols;
  else if (dx < -gridCols / 2) dx += gridCols;
  if (dy > gridRows / 2) dy -= gridRows;
  else if (dy < -gridRows / 2) dy += gridRows;
  return {
    x: (previous.x + dx * progress + gridCols) % gridCols,
    y: (previous.y + dy * progress + gridRows) % gridRows
  };
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
function drawVignette() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const gradient = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.35,
    w / 2, h / 2, Math.max(w, h) * 0.75
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawFeatherScale(segment, index, color) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
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

// Cuerpo de Kukulcán: rombos dorados + plumas laterales alternadas
function drawBodyDiamond(segment, index) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
  const isEven = index % 2 === 0;
  const size = TILE_SIZE < 22 ? 3 : 3.8;

  ctx.save();

  ctx.globalAlpha = isEven ? 0.95 : 0.65;
  ctx.fillStyle = '#d5bd70';
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.7, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size * 0.7, cy);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = isEven ? 0.9 : 0.6;
  ctx.strokeStyle = '#fff2c2';
  ctx.lineWidth = 0.7;
  ctx.stroke();

  ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#fff8dc';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.26, 0, Math.PI * 2);
  ctx.fill();

  if (isEven) {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#d5bd70';
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(cx + side * size * 0.5, cy);
      ctx.quadraticCurveTo(
        cx + side * size * 1.25, cy - size * 0.55,
        cx + side * size * 1.15, cy + size * 0.4
      );
      ctx.quadraticCurveTo(
        cx + side * size * 0.8, cy + size * 0.15,
        cx + side * size * 0.5, cy
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

// =================== FIRE BREATH ===================
function startFireBreath() {
  fireBreath = { startedAt: gameTime };
}

function clearFireBreath() {
  fireBreath = null;
}

function drawFireBreath() {
  if (!fireBreath || !isImmune || snake.length === 0) return;
  const cycle = (gameTime - fireBreath.startedAt) % FIRE_BREATH_CYCLE_MS;
  if (cycle >= FIRE_BREATH_ACTIVE_MS) return;
  const progress = cycle / FIRE_BREATH_ACTIVE_MS;
  const fade = Math.sin(progress * Math.PI);
  const head = snake[0];
  const fx = head.x * TILE_SIZE + TILE_SIZE / 2 + direction.x * TILE_SIZE * 0.4;
  const fy = head.y * TILE_SIZE + TILE_SIZE / 2 + direction.y * TILE_SIZE * 0.4;
  const angle = Math.atan2(direction.y, direction.x);
  const flicker = Math.sin(gameTime * 0.045);

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(fx, fy);
  ctx.rotate(angle);

  const len = TILE_SIZE * (0.72 + (flicker + 1) * 0.13);
  const w = TILE_SIZE * (0.48 + (1 - Math.abs(flicker)) * 0.12);
  ctx.fillStyle = '#ef4c24';
  ctx.beginPath();
  ctx.moveTo(0, -w * 0.3);
  ctx.quadraticCurveTo(len * 0.45, -w * 0.14, len, -w * 0.52);
  ctx.quadraticCurveTo(len * 0.88, 0, len, w * 0.52);
  ctx.quadraticCurveTo(len * 0.42, w * 0.16, 0, w * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffc04d';
  ctx.beginPath();
  ctx.moveTo(0, -w * 0.16);
  ctx.quadraticCurveTo(len * 0.35, -w * 0.06, len * 0.72, -w * 0.22);
  ctx.quadraticCurveTo(len * 0.62, 0, len * 0.72, w * 0.22);
  ctx.quadraticCurveTo(len * 0.32, w * 0.08, 0, w * 0.16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// =================== KUKULCÁN ===================
function drawKukulkanHead(rs, dir, protectedFlag, isBlinking) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.34, y: cy - dir.y * TILE_SIZE * 0.34 };

  const GOLD_MAIN = '#d5bd70';
  const GOLD_DEEP = '#a8843a';
  const GOLD_PALE = '#fff2c2';
  const JADE_EYE = '#4ec9a0';

  // === 1. CRESTA GRANDE ===
  ctx.save();
  ctx.lineCap = 'round';

  // 5 plumas grandes
  ctx.lineWidth = 3;
  ctx.strokeStyle = GOLD_DEEP;
  for (let f = -2; f <= 2; f++) {
    const spread = f * 3.2;
    const baseX = rear.x + perp.x * spread;
    const baseY = rear.y + perp.y * spread;
    const len = 16 - Math.abs(f) * 2.2;
    const tipX = rear.x - dir.x * len + perp.x * (f * 6);
    const tipY = rear.y - dir.y * len + perp.y * (f * 6);
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.fillStyle = GOLD_MAIN;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3 plumas medias
  ctx.lineWidth = 2.6;
  ctx.strokeStyle = GOLD_MAIN;
  for (let f = -1; f <= 1; f++) {
    const spread = f * 3;
    const baseX = rear.x + perp.x * spread;
    const baseY = rear.y + perp.y * spread;
    const len = 12 - Math.abs(f) * 1.5;
    const tipX = rear.x - dir.x * len + perp.x * (f * 4.5);
    const tipY = rear.y - dir.y * len + perp.y * (f * 4.5);
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.fillStyle = GOLD_PALE;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pluma central
  ctx.lineWidth = 3.4;
  ctx.strokeStyle = GOLD_PALE;
  const centerLen = 20;
  const tipCX = rear.x - dir.x * centerLen;
  const tipCY = rear.y - dir.y * centerLen;
  ctx.beginPath();
  ctx.moveTo(rear.x, rear.y);
  ctx.lineTo(tipCX, tipCY);
  ctx.stroke();

  ctx.fillStyle = protectedFlag ? JADE_EYE : '#ef5261';
  ctx.strokeStyle = GOLD_PALE;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(tipCX, tipCY - 3.2);
  ctx.lineTo(tipCX + 2.8, tipCY);
  ctx.lineTo(tipCX, tipCY + 3.2);
  ctx.lineTo(tipCX - 2.8, tipCY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tipCX - 0.6, tipCY - 0.6, 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // === 2. OJOS GEMA DE JADE ===
  if (!isBlinking) {
    const eyeW = 5.5;
    const eyeH = 3.2;
    const eo = 5;
    let e1x = rs.x * TILE_SIZE + eo;
    let e1y = rs.y * TILE_SIZE + eo;
    let e2x = rs.x * TILE_SIZE + TILE_SIZE - eo - eyeW;
    let e2y = e1y;

    if (dir.y !== 0) {
      e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eo - eyeH : eo);
      e2y = e1y;
    } else if (dir.x !== 0) {
      e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eo - eyeW : eo);
      e2x = e1x;
      e2y = rs.y * TILE_SIZE + TILE_SIZE - eo - eyeH;
    }

    const drawGemEye = (gx, gy) => {
      const gcx = gx + eyeW / 2;
      const gcy = gy + eyeH / 2;
      ctx.fillStyle = '#1a2a20';
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW / 2 + 0.6, eyeH / 2 + 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = JADE_EYE;
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.ellipse(gcx - 0.8, gcy - 1, eyeW * 0.22, eyeH * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(gcx + 1, gcy + 0.8, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = GOLD_MAIN;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW / 2 + 0.6, eyeH / 2 + 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    drawGemEye(e1x, e1y);
    drawGemEye(e2x, e2y);

    ctx.strokeStyle = GOLD_DEEP;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e1x - 1, e1y - 1.4);
    ctx.lineTo(e1x + eyeW + 1, e1y - 1.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e2x - 1, e2y - 1.4);
    ctx.lineTo(e2x + eyeW + 1, e2y - 1.4);
    ctx.stroke();
  } else {
    const eo = 5;
    const eyeW = 5.5;
    let e1x = rs.x * TILE_SIZE + eo;
    let e1y = rs.y * TILE_SIZE + eo + 1.5;
    let e2x = rs.x * TILE_SIZE + TILE_SIZE - eo - eyeW;
    let e2y = e1y;
    if (dir.y !== 0) {
      e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eo - 2 : eo + 1.5);
      e2y = e1y;
    } else if (dir.x !== 0) {
      e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eo - eyeW : eo);
      e2x = e1x;
      e2y = rs.y * TILE_SIZE + TILE_SIZE - eo - 2;
    }
    ctx.strokeStyle = GOLD_MAIN;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(e1x - 1, e1y);
    ctx.lineTo(e1x + eyeW + 1, e1y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e2x - 1, e2y);
    ctx.lineTo(e2x + eyeW + 1, e2y);
    ctx.stroke();
  }

  // === 3. ESCAMAS DORADAS EN LA CARA ===
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = GOLD_MAIN;
  const frx = cx - dir.x * TILE_SIZE * 0.05;
  const fry = cy - dir.y * TILE_SIZE * 0.05;
  ctx.beginPath();
  ctx.moveTo(frx, fry - 2);
  ctx.lineTo(frx + 1.6, fry);
  ctx.lineTo(frx, fry + 2);
  ctx.lineTo(frx - 1.6, fry);
  ctx.closePath();
  ctx.fill();
  const lx1 = cx + perp.x * TILE_SIZE * 0.28 - dir.x * 2;
  const ly1 = cy + perp.y * TILE_SIZE * 0.28 - dir.y * 2;
  ctx.beginPath();
  ctx.moveTo(lx1, ly1 - 1.4);
  ctx.lineTo(lx1 + 1.1, ly1);
  ctx.lineTo(lx1, ly1 + 1.4);
  ctx.lineTo(lx1 - 1.1, ly1);
  ctx.closePath();
  ctx.fill();
  const lx2 = cx - perp.x * TILE_SIZE * 0.28 - dir.x * 2;
  const ly2 = cy - perp.y * TILE_SIZE * 0.28 - dir.y * 2;
  ctx.beginPath();
  ctx.moveTo(lx2, ly2 - 1.4);
  ctx.lineTo(lx2 + 1.1, ly2);
  ctx.lineTo(lx2, ly2 + 1.4);
  ctx.lineTo(lx2 - 1.1, ly2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // === 4. FLECOS LATERALES ===
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = GOLD_MAIN;
  ctx.lineWidth = 1.8;
  for (let side = -1; side <= 1; side += 2) {
    for (let f = 0; f < 3; f++) {
      const baseX = cx + perp.x * side * TILE_SIZE * 0.38 - dir.x * (f * 2.5 - 2);
      const baseY = cy + perp.y * side * TILE_SIZE * 0.38 - dir.y * (f * 2.5 - 2);
      const tipX = baseX + perp.x * side * (4 + f * 0.5) - dir.x * 1.5;
      const tipY = baseY + perp.y * side * (4 + f * 0.5) - dir.y * 1.5;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    }
  }
  ctx.restore();

  // === 5. DIENTES VISIBLES ===
  ctx.save();
  ctx.fillStyle = '#f5efdc';
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.6;
  const mouthX = cx + dir.x * TILE_SIZE * 0.44;
  const mouthY = cy + dir.y * TILE_SIZE * 0.44;
  for (let side = -1; side <= 1; side += 2) {
    const bx = mouthX + perp.x * side * 3;
    const by = mouthY + perp.y * side * 3;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + dir.x * 2, by + dir.y * 2);
    ctx.lineTo(bx + perp.x * side * 1.2, by + perp.y * side * 1.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // === 6. LENGUA BÍFIDA ===
  const showTongue = protectedFlag || headPulse > 0.6;
  if (showTongue) {
    ctx.save();
    ctx.strokeStyle = '#ef5261';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.6;

    const tongueWave = Math.sin(gameTime * 0.012) * 1.4;
    const tb = { x: cx + dir.x * TILE_SIZE * 0.42, y: cy + dir.y * TILE_SIZE * 0.42 };
    const tm = {
      x: cx + dir.x * TILE_SIZE * 0.68 + perp.x * tongueWave,
      y: cy + dir.y * TILE_SIZE * 0.68 + perp.y * tongueWave
    };
    ctx.beginPath();
    ctx.moveTo(tb.x, tb.y);
    ctx.lineTo(tm.x, tm.y);
    ctx.stroke();

    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tm.x, tm.y);
    ctx.lineTo(tm.x + perp.x * 2.6 + dir.x * 2.6, tm.y + perp.y * 2.6 + dir.y * 2.6);
    ctx.moveTo(tm.x, tm.y);
    ctx.lineTo(tm.x - perp.x * 2.6 + dir.x * 2.6, tm.y - perp.y * 2.6 + dir.y * 2.6);
    ctx.stroke();
    ctx.restore();
  }
}

// =================== GUARDIANES ===================
function drawGuardianHead(rs, guardian) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const dir = guardian.direction || { x: 1, y: 0 };
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.35, y: cy - dir.y * TILE_SIZE * 0.35 };

  // ==== XIBALBÁ (tiene su propio render especial) ====
  if (guardian.behavior.id === 'ambusher') {
    drawXibalba(rs, guardian, cx, cy, dir, perp, rear);
    return;
  }

  // ==== CRESTAS NORMALES ====
  ctx.save();
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  const crestColor = guardian.palette.crest;

  if (guardian.behavior.id === 'flanker') {
    for (let side = -1; side <= 1; side += 2) {
      for (let f = -1; f <= 1; f++) {
        const baseX = rear.x + perp.x * side * 4;
        const baseY = rear.y + perp.y * side * 4;
        const tipX = baseX - dir.x * 6 + perp.x * (side * 5 + f * 2);
        const tipY = baseY - dir.y * 6 + perp.y * (side * 5 + f * 2);
        ctx.strokeStyle = crestColor;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
      }
    }
  } else {
    for (let f = -1; f <= 1; f++) {
      const spread = f * 2.4;
      const baseX = rear.x + perp.x * spread;
      const baseY = rear.y + perp.y * spread;
      const len = 9 - Math.abs(f) * 1.5;
      const tipX = rear.x - dir.x * len + perp.x * (f * 4.5);
      const tipY = rear.y - dir.y * len + perp.y * (f * 4.5);
      ctx.strokeStyle = f === 0 ? '#ffffff' : crestColor;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Colmillos (cazador)
  if (guardian.behavior.id === 'hunter') {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.8;
    const mouthX = cx + dir.x * TILE_SIZE * 0.42;
    const mouthY = cy + dir.y * TILE_SIZE * 0.42;
    const fangLen = TILE_SIZE * 0.3;
    for (let side = -1; side <= 1; side += 2) {
      const fx = mouthX + perp.x * side * 3.5;
      const fy = mouthY + perp.y * side * 3.5;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + dir.x * fangLen, fy + dir.y * fangLen);
      ctx.lineTo(fx + perp.x * side * 1.5, fy + perp.y * side * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Tercer ojo (vidente)
  if (guardian.behavior.id === 'interceptor') {
    ctx.save();
    const haloR = TILE_SIZE * 0.28 + Math.sin(gameTime * 0.01) * 1.5;
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
    halo.addColorStop(0, 'rgba(240, 224, 255, 0.85)');
    halo.addColorStop(1, 'rgba(166, 91, 212, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f0e0ff';
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE * 0.16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a1a6b';
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Dientes dorados (flanqueador)
  if (guardian.behavior.id === 'flanker') {
    ctx.save();
    ctx.fillStyle = '#ffc078';
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 0.8;
    const mouthX = cx + dir.x * TILE_SIZE * 0.4;
    const mouthY = cy + dir.y * TILE_SIZE * 0.4;
    for (let side = -1; side <= 1; side += 2) {
      const fx = mouthX + perp.x * side * 4;
      const fy = mouthY + perp.y * side * 4;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + dir.x * TILE_SIZE * 0.16, fy + dir.y * TILE_SIZE * 0.16);
      ctx.lineTo(fx + perp.x * side * 2, fy + perp.y * side * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Ojos
  if (guardian.behavior.id !== 'interceptor') {
    ctx.fillStyle = guardian.palette.eye;
    const eo = 5, es = 4;
    let e1x = rs.x * TILE_SIZE + eo, e1y = rs.y * TILE_SIZE + eo;
    let e2x = rs.x * TILE_SIZE + TILE_SIZE - eo - es, e2y = e1y;
    if (dir.y !== 0) {
      e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eo - es : eo);
      e2y = e1y;
    } else if (dir.x !== 0) {
      e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eo - es : eo);
      e2x = e1x;
      e2y = rs.y * TILE_SIZE + TILE_SIZE - eo - es;
    }
    ctx.fillRect(e1x, e1y, es, es);
    ctx.fillRect(e2x, e2y, es, es);
  }
}

// ==== XIBALBÁ — Render especial (MEJORADO: más murciélago y oscuro) ====
function drawXibalba(rs, guardian, cx, cy, dir, perp, rear) {
  // Paleta más oscura y "tinta"
  const wingColor = '#0a0208'; // Casi negro con un toque rojo
  const wingBone = '#4a0a15'; // Rojo sangre oscuro
  const glowColor = '#ff1a2e'; // Rojo brillante para los detalles
  const wingSpan = TILE_SIZE * 1.35; // Alas más grandes
  const flap = Math.sin(gameTime * 0.008) * 0.25; // Aleteo más pronunciado
  const wingPhase = (Math.sin(gameTime * 0.01) + 1) * 0.5;

  ctx.save();

  // Aura infernal más intensa
  const auraR = TILE_SIZE * 1.6; // Aura más grande
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR);
  aura.addColorStop(0, 'rgba(139, 0, 0, 0.7)'); // Más opaco
  aura.addColorStop(0.6, 'rgba(90, 0, 20, 0.4)');
  aura.addColorStop(1, 'rgba(61, 13, 30, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
  ctx.fill();

  // Alas de murciélago — Más grandes y detalladas
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(cx, cy);
    const wingAngle = side * (0.45 + flap); // Ángulo más abierto
    ctx.rotate(wingAngle);

    ctx.fillStyle = wingColor;
    ctx.strokeStyle = wingBone;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Borde superior del ala
    ctx.quadraticCurveTo(
      side * wingSpan * 0.5, -wingSpan * 0.7,
      side * wingSpan * 1.1, -wingSpan * 0.45
    );
    // Puntas de los "dedos" del ala
    ctx.lineTo(side * wingSpan * 1.05, -wingSpan * 0.2);
    ctx.quadraticCurveTo(
      side * wingSpan * 0.85, -wingSpan * 0.05,
      side * wingSpan * 0.95, wingSpan * 0.15
    );
    ctx.lineTo(side * wingSpan * 0.75, wingSpan * 0.28);
    ctx.quadraticCurveTo(
      side * wingSpan * 0.55, wingSpan * 0.2,
      side * wingSpan * 0.7, wingSpan * 0.5
    );
    // Borde inferior
    ctx.quadraticCurveTo(
      side * wingSpan * 0.35, wingSpan * 0.35,
      0, 0
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Huesos del ala (más visibles)
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.7 + wingPhase * 0.3;
    for (let bone = 1; bone <= 3; bone++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        side * wingSpan * 0.4, -wingSpan * 0.2 * bone,
        side * wingSpan * (0.5 + bone * 0.18), -wingSpan * (0.08 * bone - 0.1)
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Puntas brillantes
    ctx.fillStyle = glowColor;
    for (let tip = 0; tip < 4; tip++) {
      const tipX = side * wingSpan * (0.9 - tip * 0.09);
      const tipY = -wingSpan * (0.18 - tip * 0.1);
      ctx.beginPath();
      ctx.arc(tipX, tipY, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Cresta de huesos (4 puntas)
  const crestTop = { x: cx - dir.x * TILE_SIZE * 0.3, y: cy - dir.y * TILE_SIZE * 0.3 };
  for (let c = -1.5; c <= 1.5; c += 1) {
    const spread = c * 3.2;
    const baseX = crestTop.x + perp.x * spread;
    const baseY = crestTop.y + perp.y * spread;
    const tipX = crestTop.x - dir.x * 10 + perp.x * (c * 5.5);
    const tipY = crestTop.y - dir.y * 10 + perp.y * (c * 5.5);
    ctx.strokeStyle = guardian.palette.crest;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Halo rojo alrededor de la cabeza
  const eyeGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, TILE_SIZE * 0.6);
  eyeGlow.addColorStop(0, 'rgba(255, 26, 46, 0.5)');
  eyeGlow.addColorStop(0.7, 'rgba(255, 26, 46, 0.18)');
  eyeGlow.addColorStop(1, 'rgba(255, 26, 46, 0)');
  ctx.fillStyle = eyeGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, TILE_SIZE * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Ojos diamante
  const eyeOff = 4.5;
  let e1x = rs.x * TILE_SIZE + eyeOff;
  let e1y = rs.y * TILE_SIZE + eyeOff;
  let e2x = rs.x * TILE_SIZE + TILE_SIZE - eyeOff - 3;
  let e2y = e1y;
  if (dir.y !== 0) {
    e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eyeOff - 3 : eyeOff);
    e2y = e1y;
  } else if (dir.x !== 0) {
    e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eyeOff - 3 : eyeOff);
    e2x = e1x;
    e2y = rs.y * TILE_SIZE + TILE_SIZE - eyeOff - 3;
  }
  ctx.fillStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;
  for (const eye of [{ x: e1x, y: e1y }, { x: e2x, y: e2y }]) {
    const ecx = eye.x + 1.5;
    const ecy = eye.y + 1.5;
    ctx.beginPath();
    ctx.moveTo(ecx, ecy - 2.2);
    ctx.lineTo(ecx + 1.8, ecy);
    ctx.lineTo(ecx, ecy + 2.2);
    ctx.lineTo(ecx - 1.8, ecy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  for (const eye of [{ x: e1x, y: e1y }, { x: e2x, y: e2y }]) {
    ctx.beginPath();
    ctx.arc(eye.x + 1, eye.y + 1, 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Colmillos dobles
  ctx.fillStyle = '#f5efdc';
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 0.6;
  const mouthX = cx + dir.x * TILE_SIZE * 0.42;
  const mouthY = cy + dir.y * TILE_SIZE * 0.42;
  const fangLen = TILE_SIZE * 0.4;
  for (let side = -1; side <= 1; side += 2) {
    const fx = mouthX + perp.x * side * 3.2;
    const fy = mouthY + perp.y * side * 3.2;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + dir.x * fangLen, fy + dir.y * fangLen);
    ctx.lineTo(fx + perp.x * side * 1.8, fy + perp.y * side * 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const fx2 = fx - perp.x * side * 1.5;
    const fy2 = fy - perp.y * side * 1.5;
    ctx.beginPath();
    ctx.moveTo(fx2, fy2);
    ctx.lineTo(fx2 + dir.x * fangLen * 0.7, fy2 + dir.y * fangLen * 0.7);
    ctx.lineTo(fx2 + perp.x * side * 1.2, fy2 + perp.y * side * 1.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Marca infernal (espiral)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(gameTime * 0.002);
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.7 + wingPhase * 0.3;
  ctx.beginPath();
  for (let s = 0; s < 20; s++) {
    const a = (s / 20) * Math.PI * 1.6;
    const r = 1 + s * 0.12;
    const sx = Math.cos(a) * r;
    const sy = Math.sin(a) * r;
    if (s === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
  }
  ctx.stroke();
  ctx.restore();

  // Partículas de fuego fatuo
  ctx.fillStyle = glowColor;
  for (let p = 0; p < 3; p++) {
    const angle = gameTime * 0.003 + p * (Math.PI * 2 / 3);
    const radius = TILE_SIZE * 0.55;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius - 3;
    ctx.globalAlpha = 0.4 + Math.sin(gameTime * 0.008 + p) * 0.3;
    ctx.beginPath();
    ctx.arc(px, py, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

// =================== OFRENDAS ===================
function drawFoodOffering(food, cx, cy, pulse) {
  const isMaize = food.offering === 'maize';
  const isCacao = food.offering === 'cacao';
  const radius = Math.max(4, TILE_SIZE / 2 - 3 + pulse * 0.3);

  ctx.save();

  if (isMaize) {
    ctx.fillStyle = '#f2c230';
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.55, radius * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4fcea2';
    ctx.strokeStyle = '#b0f4d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.15, cy + radius * 0.5);
    ctx.quadraticCurveTo(cx - radius * 0.95, cy, cx - radius * 0.5, cy - radius * 0.85);
    ctx.quadraticCurveTo(cx - radius * 0.25, cy - radius * 0.2, cx - radius * 0.15, cy + radius * 0.5);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + radius * 0.15, cy + radius * 0.5);
    ctx.quadraticCurveTo(cx + radius * 0.95, cy, cx + radius * 0.5, cy - radius * 0.85);
    ctx.quadraticCurveTo(cx + radius * 0.25, cy - radius * 0.2, cx + radius * 0.15, cy + radius * 0.5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#a87916';
    for (let row = -2; row <= 2; row++) {
      ctx.beginPath();
      ctx.arc(cx - radius * 0.12, cy + row * radius * 0.24, 0.8, 0, Math.PI * 2);
      ctx.arc(cx + radius * 0.12, cy + row * radius * 0.24, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (isCacao) {
    ctx.fillStyle = '#8b5a2b';
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.55, radius * 0.9, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#5a3a1b';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - radius * 0.4, cy + i * radius * 0.28);
      ctx.lineTo(cx + radius * 0.4, cy + i * radius * 0.28);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#4fcea2';
    ctx.strokeStyle = '#b0f4d8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d5bd70';
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ========================================================
// 20. DRAW PRINCIPAL
// ========================================================
function draw(interpolation = 1, updateEffects = false) {
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

  if (boardCanvas) ctx.drawImage(boardCanvas, 0, 0, window.innerWidth, window.innerHeight);
  else { ctx.fillStyle = '#141720'; ctx.fillRect(0, 0, window.innerWidth, window.innerHeight); }

  const pulse = Math.sin(gameTime * 0.006) * 1.5;

  // === COMIDA ===
  foods.forEach(food => {
    const targetX = food.x * TILE_SIZE + TILE_SIZE / 2;
    const targetY = food.y * TILE_SIZE + TILE_SIZE / 2;
    let cx = targetX, cy = targetY;
    if (food.landingAt !== undefined && gameTime < food.landingAt) {
      const progress = Math.max(0, Math.min(1, 1 - (food.landingAt - gameTime) / MAIZE_FALL_DURATION_MS));
      const eased = 1 - (1 - progress) ** 2;
      const mo = food.meteorOffsetX || 0;
      cx = targetX + mo * (1 - eased);
      cy = -TILE_SIZE + (targetY + TILE_SIZE) * eased;
      ctx.save();
      const tx = cx + Math.sign(mo || 1) * TILE_SIZE * 0.75;
      const ty = cy - TILE_SIZE * 1.35;
      const trail = ctx.createLinearGradient(tx, ty, cx, cy);
      trail.addColorStop(0, 'rgba(255, 102, 35, 0)');
      trail.addColorStop(0.65, 'rgba(255, 151, 55, 0.62)');
      trail.addColorStop(1, 'rgba(255, 240, 176, 0.96)');
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = trail;
      ctx.lineWidth = TILE_SIZE * 0.24;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#fff0b0';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2, TILE_SIZE * 0.13), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawFoodOffering(food, cx, cy, pulse);
  });

  // === BONUS ===
  bonusFoods.forEach(bf => {
    const cx = bf.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = bf.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.fillStyle = '#f0cf70';
    ctx.beginPath();
    const radius = Math.max(4, TILE_SIZE / 2 - 2 + pulse * 0.45);
    for (let p = 0; p < 16; p++) {
      const a = -Math.PI / 2 + p * Math.PI / 8;
      const r = radius * (p % 2 === 0 ? 1 : 0.58);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (p === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.36, 0, Math.PI * 2);
    ctx.stroke();
  });

  // === JADE ===
  shieldFoods.forEach(sf => {
    const cx = sf.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = sf.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.save();
    const glowR = TILE_SIZE * 0.75 + Math.sin(gameTime * 0.005) * 2;
    const grad = ctx.createRadialGradient(cx, cy, TILE_SIZE * 0.2, cx, cy, glowR);
    grad.addColorStop(0, 'rgba(125, 232, 196, 0.5)');
    grad.addColorStop(1, 'rgba(125, 232, 196, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7de8c4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE / 2 + pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#1a7a5e';
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - TILE_SIZE / 4);
    ctx.lineTo(cx + TILE_SIZE / 4, cy);
    ctx.lineTo(cx, cy + TILE_SIZE / 4);
    ctx.lineTo(cx - TILE_SIZE / 4, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });

  // === FREEZE ===
  freezeFoods.forEach(ff => {
    const cx = ff.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = ff.y * TILE_SIZE + TILE_SIZE / 2;
    const r = Math.max(4, TILE_SIZE / 2 - 3 + pulse * 0.3);
    ctx.save();
    ctx.fillStyle = '#4fc3f7';
    ctx.strokeStyle = '#d7f6ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 3;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#effbff';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.42, cy); ctx.lineTo(cx + r * 0.42, cy);
    ctx.moveTo(cx, cy - r * 0.42); ctx.lineTo(cx, cy + r * 0.42);
    ctx.moveTo(cx - r * 0.3, cy - r * 0.3); ctx.lineTo(cx + r * 0.3, cy + r * 0.3);
    ctx.moveTo(cx + r * 0.3, cy - r * 0.3); ctx.lineTo(cx - r * 0.3, cy + r * 0.3);
    ctx.stroke();
    ctx.restore();
  });

  // === SACRIFICIO ===
  sacrificeFoods.forEach(o => {
    const cx = o.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = o.y * TILE_SIZE + TILE_SIZE / 2;
    const beat = Math.sin(gameTime * 0.01) * 0.5 + 0.5;
    const ringR = TILE_SIZE * 0.52 + beat * 1.5;

    ctx.save();
    ctx.strokeStyle = '#8b1e1e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(239, 82, 97, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR - 2.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(48, 20, 24, 0.85)';
    ctx.beginPath();
    ctx.arc(cx, cy, ringR - 3.5, 0, Math.PI * 2);
    ctx.fill();

    const drops = 6;
    const dropRot = gameTime * 0.0006;
    for (let d = 0; d < drops; d++) {
      const a = dropRot + (d / drops) * Math.PI * 2;
      const dx = cx + Math.cos(a) * ringR;
      const dy = cy + Math.sin(a) * ringR;
      ctx.fillStyle = '#8b1e1e';
      ctx.beginPath();
      ctx.arc(dx, dy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    const heartSize = TILE_SIZE * 0.78 * (1 + beat * 0.1);
    ctx.font = `${heartSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🫀', cx, cy + 1);
    ctx.shadowBlur = 0;
    ctx.restore();
  });

  // === CALAVERA ===
  skullFoods.forEach(s => {
    const cx = s.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = s.y * TILE_SIZE + TILE_SIZE / 2;
    const r = TILE_SIZE * 0.44 + Math.sin(gameTime * 0.008) * 1.2;
    ctx.save();
    const glowR = r + 4 + Math.sin(gameTime * 0.005) * 2;
    const grad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, glowR);
    grad.addColorStop(0, 'rgba(239, 82, 97, 0.55)');
    grad.addColorStop(1, 'rgba(239, 82, 97, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(48, 19, 29, 0.94)';
    ctx.strokeStyle = '#ef5261';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = `${TILE_SIZE * 0.8}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☠️', cx, cy + 1);
    ctx.restore();
  });

  // === SELLO CÓSMICO ===
  cosmicOrderFoods.forEach(co => {
    const cx = co.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = co.y * TILE_SIZE + TILE_SIZE / 2;
    const r = Math.max(6, TILE_SIZE / 2 - 2 + pulse * 0.2);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(gameTime * 0.0007);
    ctx.fillStyle = 'rgba(22, 42, 48, 0.96)';
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d5bd70';
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 8;
      const pr = r * (i % 2 === 0 ? 1.28 : 1.04);
      const x = Math.cos(a) * pr;
      const y = Math.sin(a) * pr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#16343b';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8be7ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.62, -Math.PI * 0.8, Math.PI * 0.8);
    ctx.stroke();
    ctx.fillStyle = '#fff0b0';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.58);
    ctx.lineTo(r * 0.2, 0);
    ctx.lineTo(0, r * 0.58);
    ctx.lineTo(-r * 0.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(-gameTime * 0.0014);
    ctx.strokeStyle = 'rgba(255, 240, 176, 0.65)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const rad = r * 1.05 + Math.sin(a * 3) * 1.5;
      const x = Math.cos(a) * rad;
      const y = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });

  // === GUARDIANES ===
  enemyGuardians.forEach(guardian => {
    const hitAt = guardian.cosmicOrderHitAt;
    guardian.segments.forEach((seg, idx) => {
      const isHead = idx === 0;
      const wobbleX = hitAt === undefined ? 0 : Math.sin((gameTime - hitAt) * 0.065 + idx * 1.2) * 2.5;
      const wobbleY = hitAt === undefined ? 0 : Math.cos((gameTime - hitAt) * 0.065 + idx * 1.2) * 1.5;

      const previousSegments = previousGuardianPositions.get(guardian.id);
      const renderSegment = interpolateGridPosition(
        seg,
        previousSegments?.[idx] || previousSegments?.[previousSegments.length - 1],
        interpolation
      );
      renderSegment.x += wobbleX / TILE_SIZE;
      renderSegment.y += wobbleY / TILE_SIZE;

      const fillColor = hitAt !== undefined && Math.floor((gameTime - hitAt) / 100) % 2 === 0
        ? '#f5e5ad'
        : isHead ? guardian.palette.head : guardian.palette.body;
      ctx.fillStyle = fillColor;
      if (isHead && guardian.behavior.id !== 'ambusher') {
        ctx.shadowColor = guardian.palette.head;
        ctx.shadowBlur = 10;
      }
      roundRect(
        ctx,
        renderSegment.x * TILE_SIZE + 1,
        renderSegment.y * TILE_SIZE + 1,
        TILE_SIZE - 2,
        TILE_SIZE - 2,
        isHead ? 8 : 4
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!isHead) {
        drawFeatherScale(renderSegment, idx, guardian.palette.crest);
      } else {
        drawGuardianHead(renderSegment, guardian);
      }
    });

    if (guardiansFrozenUntil > gameTime) {
      ctx.save();
      guardian.segments.forEach(segment => {
        const x = segment.x * TILE_SIZE + 2;
        const y = segment.y * TILE_SIZE + 2;
        ctx.fillStyle = 'rgba(117, 218, 255, 0.22)';
        ctx.strokeStyle = 'rgba(225, 249, 255, 0.65)';
        ctx.lineWidth = 1;
        roundRect(ctx, x, y, TILE_SIZE - 4, TILE_SIZE - 4, 5);
        ctx.fill();
        ctx.stroke();
      });
      const head = guardian.segments[0];
      const cx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const cy = head.y * TILE_SIZE + TILE_SIZE / 2;
      const mark = TILE_SIZE * 0.2;
      ctx.strokeStyle = 'rgba(239, 251, 255, 0.95)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - mark, cy); ctx.lineTo(cx + mark, cy);
      ctx.moveTo(cx, cy - mark); ctx.lineTo(cx, cy + mark);
      ctx.moveTo(cx - mark * 0.7, cy - mark * 0.7); ctx.lineTo(cx + mark * 0.7, cy + mark * 0.7);
      ctx.moveTo(cx + mark * 0.7, cy - mark * 0.7); ctx.lineTo(cx - mark * 0.7, cy + mark * 0.7);
      ctx.stroke();
      ctx.restore();
    }
  });

  if (updateEffects) blinkCounter++;
  const isBlinking = (blinkCounter % 90) > 85;
  const playerProtected = hasGuardianProtection();

  // === KUKULCÁN ===
  const KUKULKAN_HEAD = '#4ec9a0';
  const KUKULKAN_BODY = '#1a7a5e';

  if (playerProtected && snake.length > 0) {
    const headSeg = snake[0];
    const headRS = interpolateGridPosition(headSeg, previousSnakePositions[0], interpolation);
    const hx = headRS.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = headRS.y * TILE_SIZE + TILE_SIZE / 2;
    const auraR = TILE_SIZE * 1.0;
    const aura = ctx.createRadialGradient(hx, hy, TILE_SIZE * 0.4, hx, hy, auraR);
    aura.addColorStop(0, 'rgba(125, 232, 196, 0.22)');
    aura.addColorStop(1, 'rgba(125, 232, 196, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(hx, hy, auraR, 0, Math.PI * 2);
    ctx.fill();
  }

  snake.forEach((seg, idx) => {
    const isHead = idx === 0;
    const rs = interpolateGridPosition(
      seg,
      previousSnakePositions[idx] || previousSnakePositions[previousSnakePositions.length - 1],
      interpolation
    );

    ctx.fillStyle = isHead ? KUKULKAN_HEAD : KUKULKAN_BODY;

    roundRect(
      ctx,
      rs.x * TILE_SIZE + 1,
      rs.y * TILE_SIZE + 1,
      TILE_SIZE - 2,
      TILE_SIZE - 2,
      isHead ? 8 : 5
    );
    ctx.fill();

    if (!isHead) {
      ctx.save();
      ctx.strokeStyle = 'rgba(213, 189, 112, 0.55)';
      ctx.lineWidth = 1;
      roundRect(
        ctx,
        rs.x * TILE_SIZE + 1.5,
        rs.y * TILE_SIZE + 1.5,
        TILE_SIZE - 3,
        TILE_SIZE - 3,
        5
      );
      ctx.stroke();

      ctx.strokeStyle = 'rgba(182, 242, 209, 0.28)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(rs.x * TILE_SIZE + 3, rs.y * TILE_SIZE + 2.5);
      ctx.lineTo(rs.x * TILE_SIZE + TILE_SIZE - 3, rs.y * TILE_SIZE + 2.5);
      ctx.stroke();
      ctx.restore();
    }

    if (!isHead) {
      drawBodyDiamond(rs, idx);
    } else {
      drawKukulkanHead(rs, direction, playerProtected, isBlinking);
    }

    if (isHead && headPulse > 0) {
      const pR = TILE_SIZE * 0.5 + 3 + (1 - headPulse) * 8;
      ctx.save();
      ctx.strokeStyle = headPulseColor;
      ctx.lineWidth = 2.5 * headPulse;
      ctx.globalAlpha = headPulse;
      ctx.beginPath();
      ctx.arc(
        rs.x * TILE_SIZE + TILE_SIZE / 2,
        rs.y * TILE_SIZE + TILE_SIZE / 2,
        pR,
        0, Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }
  });

  drawFireBreath();
  updateAndDrawParticles(updateEffects);

  if (isGameRunning) drawVignette();

  if (cosmicOrderFlashStartedAt !== null) {
    const elapsed = gameTime - cosmicOrderFlashStartedAt;
    if (elapsed >= 0 && elapsed < COSMIC_ORDER_FLASH_DURATION_MS) {
      const progress = elapsed / COSMIC_ORDER_FLASH_DURATION_MS;
      const flash = Math.max(0, Math.sin(progress * Math.PI * 3));
      ctx.globalAlpha = flash * (1 - progress * 0.35) * 0.38;
      ctx.fillStyle = Math.floor(progress * 3) % 2 === 0 ? '#fff0b0' : '#8be7ff';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

// ========================================================
// 21. START / PAUSE / GAME OVER
// ========================================================
function startGame() {
  getAudioContext();
  if (isGameRunning) finishRunStatistics();
  resetGame();
  gameTime = 0;
  simulationAccumulator = 0;
  renderInterpolation = 1;
  isGameRunning = true;
  isPaused = false;
  runStartedAt = gameTime;
  runDifficulty = difficultySelect.value;
  runGuardiansDefeated = 0;
  cancelCountdown();
  startCountdown();
  updateTurboUI();

  dtStartBtn.textContent = '🔄 Reiniciar';
  dtPauseBtn.textContent = '⏸ Pausa';

  tutorialModal.classList.add('hidden');
  drawerMenu.classList.add('hidden');
  gameOverlay.classList.add('hidden');
  stopWelcomeDemo();
  welcomeScreen.classList.add('hidden');

  startSuspenseMusic();
  startGameLoop();
}

function togglePause() {
  if (!isGameRunning) return;
  if (!isPaused) {
    cancelCountdown();
    isPaused = true;
  } else {
    isPaused = false;
    startCountdown();
  }
  dtPauseBtn.textContent = isPaused ? '▶ Reanudar' : '⏸ Pausa';
  updateTurboUI();
  if (isPaused) {
    stopSuspenseMusic();
    drawerMenu.classList.remove('hidden');
  } else {
    drawerMenu.classList.add('hidden');
    startSuspenseMusic();
    startGameLoop();
  }
}

function gameOver(reason = 'Has chocado con tu propio cuerpo.') {
  finishRunStatistics();
  isGameRunning = false;
  cancelCountdown();
  clearFireBreath();
  isTurbo = false;
  turboReadyAt = 0;
  turboCooldownUntil = 0;
  updateTurboUI();
  enemySpawnAt = null;
  jadeSpawnAt = null;
  freezeSpawnAt = null;
  guardiansFrozenUntil = 0;
  freezeFoods = [];
  BadgeManager.setVisible('freeze', false);
  sacredRainUntil = 0;
  nextSacredRainAt = null;
  BadgeManager.setVisible('rain', false);
  nextCosmicOrderSpawnAt = null;
  cosmicOrderResolveAt = null;
  cosmicOrderFlashStartedAt = null;
  cosmicOrderFoods = [];
  sacrificeFoods = [];
  skullFoods = [];
  nextSkullMoveAt = null;
  nextSacrificeSpawnAt = null;
  nextSkullSpawnAt = null;
  BadgeManager.setVisible('sacrificeOffering', false);
  BadgeManager.setVisible('skullFood', false);
  BadgeManager.setVisible('cosmicOrderFood', false);
  BadgeManager.setVisible('cosmicOrder', false);
  respawnProtectedUntil = 0;
  BadgeManager.setVisible('respawn', false);
  enemyGuardians = [];
  updateGuardianBadge();
  deactivateImmunity();
  stopSuspenseMusic();
  playGameOverSound();
  vibrate([80, 50, 80, 50, 150]);

  overlayReason.textContent = reason;
  finalScoreElement.textContent = score;
  finalLengthElement.textContent = snake.length;
  gameOverlay.classList.remove('hidden');
  dtStartBtn.textContent = '▶ Iniciar';
}

function changeDirection(newDir) {
  if (!isGameRunning || isPaused) return;
  if (directionQueue.length >= 2) return;
  const cur = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;
  const isOpposite = (newDir.x !== 0 && newDir.x === -cur.x) || (newDir.y !== 0 && newDir.y === -cur.y);
  if (isOpposite) return;
  if (newDir.x === cur.x && newDir.y === cur.y) return;
  directionQueue.push({ ...newDir });
}

// ========================================================
// 22. TUTORIAL
// ========================================================
function showTutorialStep(step) {
  currentTutorialStep = step;
  tutorialStepTitle.textContent = tutorialTitles[step - 1];
  for (let i = 1; i <= totalTutorialSteps; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.classList.toggle('active', i === step);
  }
  stepDots.forEach((dot, idx) => dot.classList.toggle('active', idx === step - 1));
  tutPrevBtn.classList.toggle('hidden', step === 1);
  tutNextBtn.classList.toggle('hidden', step === totalTutorialSteps);
  tutStartBtn.classList.toggle('hidden', step !== totalTutorialSteps);
}
function openTutorial() {
  if (!tutorialModal.classList.contains('hidden')) return;
  tutorialWasRunning = isGameRunning;
  tutorialWasPaused = isPaused;
  tutorialDrawerWasVisible = !drawerMenu.classList.contains('hidden');
  tutorialOpenedFromWelcome = !welcomeScreen.classList.contains('hidden');
  if (tutorialWasRunning && !tutorialWasPaused) togglePause();
  if (!tutorialOpenedFromWelcome) document.body.appendChild(tutorialModal);
  welcomeStartBtn.classList.add('hidden');
  drawerMenu.classList.add('hidden');
  tutorialModal.classList.remove('hidden');
  showTutorialStep(1);
}
function closeTutorial() {
  if (tutorialModal.classList.contains('hidden')) return;
  tutorialModal.classList.add('hidden');
  if (tutorialWasRunning && !tutorialWasPaused && isGameRunning && isPaused) {
    togglePause();
  } else if (tutorialWasRunning && tutorialWasPaused && isGameRunning && isPaused) {
    drawerMenu.classList.remove('hidden');
  } else if (tutorialDrawerWasVisible) {
    drawerMenu.classList.remove('hidden');
  }
  if (tutorialModal.parentElement !== welcomeScreen.querySelector('.welcome-card')) {
    const card = welcomeScreen.querySelector('.welcome-card');
    card.insertBefore(tutorialModal, welcomeStartBtn);
  }
  if (tutorialOpenedFromWelcome) {
    welcomeScreen.classList.remove('hidden');
    startWelcomeDemo();
  }
  welcomeStartBtn.classList.toggle('hidden', welcomeScreen.classList.contains('hidden') || !tutorialModal.classList.contains('hidden'));
  tutorialWasRunning = false;
  tutorialWasPaused = false;
  tutorialDrawerWasVisible = false;
  tutorialOpenedFromWelcome = false;
}

// ========================================================
// 23. CONTROLES
// ========================================================
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', e => {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener('touchmove', e => {
  if (e.target === canvas) e.preventDefault();
}, { passive: false });

window.addEventListener('touchend', e => {
  const target = e.target;
  if (target instanceof Element && target.closest('button, select, .modal-backdrop, .drawer-card')) return;
  if (e.changedTouches.length > 0) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const min = 22;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > min) changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      if (Math.abs(dy) > min) changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
    }
  }
}, { passive: true });

btnTurbo.addEventListener('pointerdown', e => { e.preventDefault(); triggerTurboBurst(); });

// NUEVOS BOTONES DEL HUD MÓVIL
mbPauseBtn.addEventListener('click', () => {
  if (isGameRunning) {
    togglePause();
  } else {
    drawerMenu.classList.toggle('hidden');
  }
});

mbTutorialBtn.addEventListener('click', () => {
  if (isGameRunning && !isPaused) {
    togglePause(); 
  }
  openTutorial();
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !tutorialModal.classList.contains('hidden')) { closeTutorial(); return; }
  if (e.key === 'Escape' && !statisticsModal.classList.contains('hidden')) { closeStatistics(); return; }
  if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
  const isText = e.target instanceof Element && e.target.matches('select, input');
  const isMove = e.key.startsWith('Arrow') || ['w','W','a','A','s','S','d','D'].includes(e.key);
  if (isText && isMove) return;
  if (!isText && (e.key === 'Shift' || (e.key === ' ' && isGameRunning && !isPaused))) {
    triggerTurboBurst();
  }
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': changeDirection({ x: 0, y: -1 }); break;
    case 'ArrowDown': case 's': case 'S': changeDirection({ x: 0, y: 1 }); break;
    case 'ArrowLeft': case 'a': case 'A': changeDirection({ x: -1, y: 0 }); break;
    case 'ArrowRight': case 'd': case 'D': changeDirection({ x: 1, y: 0 }); break;
    case 'Escape': case 'p': case 'P': togglePause(); break;
  }
});

const bindDpad = (btn, dir) => {
  btn.addEventListener('pointerdown', e => { e.preventDefault(); changeDirection(dir); });
};
bindDpad(btnUp, { x: 0, y: -1 });
bindDpad(btnDown, { x: 0, y: 1 });
bindDpad(btnLeft, { x: -1, y: 0 });
bindDpad(btnRight, { x: 1, y: 0 });

// ========================================================
// 24. EVENTOS UI
// ========================================================
welcomeStartBtn.addEventListener('click', openTutorial);
dtStartBtn.addEventListener('click', () => {
  if (!welcomeScreen.classList.contains('hidden')) openTutorial();
  else startGame();
});
dtPauseBtn.addEventListener('click', togglePause);
dtSoundBtn.addEventListener('click', () => toggleSound());
dtTutorialBtn.addEventListener('click', openTutorial);
dtStatsBtn.addEventListener('click', openStatistics);
drawerStatsBtn.addEventListener('click', openStatistics);
closeStatisticsBtn.addEventListener('click', closeStatistics);
statisticsModal.addEventListener('click', e => { if (e.target === statisticsModal) closeStatistics(); });

menuToggleBtn.addEventListener('click', () => {
  if (isGameRunning && !isPaused) togglePause();
  else drawerMenu.classList.toggle('hidden');
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
drawerSoundToggle.addEventListener('change', e => toggleSound(e.target.checked));
drawerDpadToggle.addEventListener('change', e => {
  showDpad = e.target.checked;
  safeSetItem('snakeIoShowDpad', showDpad);
  touchControls.classList.toggle('hidden', !showDpad);
});

tutNextBtn.addEventListener('click', () => { if (currentTutorialStep < totalTutorialSteps) showTutorialStep(currentTutorialStep + 1); });
tutPrevBtn.addEventListener('click', () => { if (currentTutorialStep > 1) showTutorialStep(currentTutorialStep - 1); });
tutStartBtn.addEventListener('click', () => {
  tutorialWasRunning = false; tutorialWasPaused = false;
  tutorialDrawerWasVisible = false; tutorialOpenedFromWelcome = false;
  tutorialModal.classList.add('hidden');
  startGame();
});
closeTutorialBtn.addEventListener('click', closeTutorial);
tutorialModal.addEventListener('click', e => { if (e.target === tutorialModal) closeTutorial(); });

// ========================================================
// 25. ESTADÍSTICAS
// ========================================================
function openStatistics() {
  if (!statisticsModal.classList.contains('hidden')) return;
  statisticsWasRunning = isGameRunning;
  statisticsWasPaused = isPaused;
  statisticsDrawerWasVisible = !drawerMenu.classList.contains('hidden');
  if (statisticsWasRunning && !statisticsWasPaused) togglePause();
  drawerMenu.classList.add('hidden');
  updateStatisticsUI();
  statisticsModal.classList.remove('hidden');
}
function closeStatistics() {
  if (statisticsModal.classList.contains('hidden')) return;
  statisticsModal.classList.add('hidden');
  if (statisticsWasRunning && !statisticsWasPaused && isGameRunning && isPaused) togglePause();
  else if (statisticsWasRunning && statisticsWasPaused && isGameRunning && isPaused) drawerMenu.classList.remove('hidden');
  statisticsWasRunning = false;
  statisticsWasPaused = false;
  statisticsDrawerWasVisible = false;
}

// ========================================================
// 26. DIFICULTAD
// ========================================================
difficultySelect.addEventListener('change', () => {
  drawerDifficulty.value = difficultySelect.value;
  reconcileGuardianCount();
});
drawerDifficulty.addEventListener('change', () => {
  difficultySelect.value = drawerDifficulty.value;
  reconcileGuardianCount();
});

// ========================================================
// 27. VISIBILITY
// ========================================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isGameRunning && !isPaused) togglePause();
});
window.addEventListener('blur', () => {
  if (isGameRunning && !isPaused) togglePause();
});

// ========================================================
// 28. WELCOME DEMO
// ========================================================
// Genera el escenario (posiciones y ruta) para cualquier tamaño de tablero
function buildWelcomeScenario(cols, rows) {
  const sx = 4;
  const yTop = Math.max(1, Math.round(rows * 0.22));
  let yBot = Math.min(rows - 2, rows - 1 - Math.round(rows * 0.22));
  yBot = Math.max(yBot, yTop + 2);
  const yG = Math.round((yTop + yBot) / 2);          // carril del guardián
  const jx = Math.max(sx + 5, Math.round(cols * 0.62));
  const xTurn = jx - 2;
  const mx = Math.max(sx + 2, Math.min(xTurn - 1, Math.round(cols * 0.36)));
  const last = Math.max(2, cols - 4 - jx);

  welcomeScenario = { sx, yTop, yBot, yG, jx, mx };
  welcomeDemoRoute = [
    { direction: { x: 1, y: 0 },  steps: xTurn - sx },    // arriba: come maíz
    { direction: { x: 0, y: 1 },  steps: yBot - yTop },   // baja
    { direction: { x: 1, y: 0 },  steps: 2 },             // recoge jade
    { direction: { x: 0, y: -1 }, steps: yBot - yG },     // sube al carril del guardián
    { direction: { x: 1, y: 0 },  steps: last }           // embiste
  ];
}

function welcomeGuardianStart() {
  const { yG } = welcomeScenario;
  return [0, 1, 2, 3].map(i => ({ x: welcomeDemoCols - 4 + i, y: yG }));
}

function resetWelcomeDemo() {
  if (!welcomeScenario) buildWelcomeScenario(welcomeDemoCols, welcomeDemoRows);
  const s = welcomeScenario;
  welcomeDemoSnake = [
    { x: s.sx, y: s.yTop }, { x: s.sx - 1, y: s.yTop }, { x: s.sx - 2, y: s.yTop }
  ];
  welcomeDemoPreviousSnake = welcomeDemoSnake.map(p => ({ ...p }));
  welcomeDemoGuardian = welcomeGuardianStart();
  welcomeDemoPreviousGuardian = welcomeDemoGuardian.map(p => ({ ...p }));
  welcomeDemoDirection = { x: 1, y: 0 };
  welcomeDemoRouteIndex = 0;
  welcomeDemoRouteSteps = 0;
  welcomeDemoTick = 0;
  welcomeDemoAccumulator = 0;
  welcomeDemoScore = 0;
  welcomeDemoMaize = { x: s.mx, y: s.yTop };
  welcomeDemoJade = { x: s.jx, y: s.yBot };
  welcomeDemoImmuneUntil = 0;
  welcomeDemoFlashUntil = 0;
  welcomeDemoGuardianDefeatedUntil = 0;
  welcomeDemoGameOverUntil = 0;
  welcomeDemoCallout.textContent = 'Muévete por la cuadrícula y busca ofrendas';
}

// Calcula columnas/filas para llenar TODO el canvas
function updateWelcomeLayout(width, height) {
  const PAD = 8, HUD_H = 36;
  const availW = Math.max(100, width - PAD * 2);
  const availH = Math.max(60, height - HUD_H - PAD);
  const target = Math.max(18, Math.min(28, width / 15));
  const cols = Math.max(14, Math.min(30, Math.floor(availW / target)));
  const rows = Math.max(7, Math.min(22, Math.floor(availH / target)));
  const cell = Math.max(8, Math.min(availW / cols, availH / rows));
  welcomeLayout = {
    cell,
    bx: (width - cell * cols) / 2,
    by: HUD_H + (availH - cell * rows) / 2
  };
  const changed = cols !== welcomeDemoCols || rows !== welcomeDemoRows;
  if (changed) {
    welcomeDemoCols = cols;
    welcomeDemoRows = rows;
    buildWelcomeScenario(cols, rows);
    resetWelcomeDemo();
  }
  return changed;
}

function resizeWelcomeDemo() {
  const bounds = welcomeDemo.getBoundingClientRect();
  if (bounds.width === 0 || bounds.height === 0) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pw = Math.max(1, Math.round(bounds.width * dpr));
  const ph = Math.max(1, Math.round(bounds.height * dpr));
  const sizeChanged = welcomeDemo.width !== pw || welcomeDemo.height !== ph;
  const layoutChanged = updateWelcomeLayout(bounds.width, bounds.height);
  if (!sizeChanged && !layoutChanged) return;
  if (sizeChanged) {
    welcomeDemo.width = pw;
    welcomeDemo.height = ph;
  }
  welcomeDemoContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawWelcomeDemo(1);
}
window.addEventListener('resize', resizeWelcomeDemo);

function drawWelcomeCell(segment, index, options = {}) {
  const { x, y, size } = segment;
  const inset = Math.max(1, size * 0.07);
  const isHead = index === 0;
  const direction = options.direction || { x: 1, y: 0 };
  const colors = options.guardian
    ? ['#e2574c', '#9b2929']
    : options.immune ? ['#7de8c4', '#1a7a5e'] : ['#4ec9a0', '#1a7a5e'];
  welcomeDemoContext.fillStyle = isHead ? colors[0] : colors[1];
  roundRect(welcomeDemoContext, x + inset, y + inset, size - inset * 2, size - inset * 2, isHead ? size * 0.32 : size * 0.2);
  welcomeDemoContext.fill();

  if (!isHead) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    welcomeDemoContext.strokeStyle = options.guardian ? '#ff9b83' : '#d5bd70';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.08);
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(cx - size * 0.18, cy - size * 0.16);
    welcomeDemoContext.lineTo(cx, cy + size * 0.16);
    welcomeDemoContext.lineTo(cx + size * 0.18, cy - size * 0.16);
    welcomeDemoContext.stroke();
    return;
  }
  welcomeDemoContext.fillStyle = options.guardian ? '#fff0c6' : '#141720';
  const eyeSize = Math.max(1.5, size * 0.16);
  const eyePos = direction.x > 0 ? [[0.65, 0.28], [0.65, 0.58]]
    : direction.x < 0 ? [[0.19, 0.28], [0.19, 0.58]]
    : direction.y < 0 ? [[0.28, 0.19], [0.58, 0.19]]
    : [[0.28, 0.65], [0.58, 0.65]];
  eyePos.forEach(([ex, ey]) => welcomeDemoContext.fillRect(x + size * ex, y + size * ey, eyeSize, eyeSize));

  if (!options.guardian) {
    welcomeDemoContext.strokeStyle = options.immune ? '#e0fff2' : '#d5bd70';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.08);
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(x + size * 0.28, y + size * 0.22);
    welcomeDemoContext.lineTo(x + size * 0.18, y - size * 0.08);
    welcomeDemoContext.moveTo(x + size * 0.5, y + size * 0.2);
    welcomeDemoContext.lineTo(x + size * 0.58, y - size * 0.08);
    welcomeDemoContext.stroke();
  } else {
    welcomeDemoContext.fillStyle = '#ff9b83';
    welcomeDemoContext.fillRect(x + size * 0.35, y + size * 0.68, size * 0.3, size * 0.1);
  }
}
function drawWelcomeOffering(point, x, y, size, jade = false) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * (jade ? 0.36 : 0.29);
  welcomeDemoContext.save();
  if (jade) {
    welcomeDemoContext.fillStyle = '#1a7a5e';
    welcomeDemoContext.strokeStyle = '#7de8c4';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.1);
    welcomeDemoContext.beginPath();
    welcomeDemoContext.arc(cx, cy, r, 0, Math.PI * 2);
    welcomeDemoContext.fill();
    welcomeDemoContext.stroke();
    welcomeDemoContext.strokeStyle = '#fff0b0';
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(cx, cy - r * 0.55);
    welcomeDemoContext.lineTo(cx + r * 0.55, cy);
    welcomeDemoContext.lineTo(cx, cy + r * 0.55);
    welcomeDemoContext.lineTo(cx - r * 0.55, cy);
    welcomeDemoContext.closePath();
    welcomeDemoContext.stroke();
  } else {
    welcomeDemoContext.fillStyle = '#f2c230';
    welcomeDemoContext.strokeStyle = '#fff0b0';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.1);
    welcomeDemoContext.beginPath();
    welcomeDemoContext.ellipse(cx, cy, r * 0.55, r, 0, 0, Math.PI * 2);
    welcomeDemoContext.fill();
    welcomeDemoContext.stroke();
    welcomeDemoContext.fillStyle = '#4fcea2';
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(cx - r * 0.15, cy + r * 0.5);
    welcomeDemoContext.quadraticCurveTo(cx - r, cy, cx - r * 0.5, cy - r * 0.9);
    welcomeDemoContext.quadraticCurveTo(cx - r * 0.25, cy - r * 0.2, cx - r * 0.15, cy + r * 0.5);
    welcomeDemoContext.fill();
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(cx + r * 0.15, cy + r * 0.5);
    welcomeDemoContext.quadraticCurveTo(cx + r, cy, cx + r * 0.5, cy - r * 0.9);
    welcomeDemoContext.quadraticCurveTo(cx + r * 0.25, cy - r * 0.2, cx + r * 0.15, cy + r * 0.5);
    welcomeDemoContext.fill();
  }
  welcomeDemoContext.restore();
}
function moveWelcomeDemoGuardian() {
  if (welcomeDemoImmuneUntil <= welcomeDemoTick) return;
  if (welcomeDemoGuardianDefeatedUntil > welcomeDemoTick) return;
  if (welcomeDemoGuardianDefeatedUntil) {
      welcomeDemoGuardian = welcomeGuardianStart();
  }
  const eHead = welcomeDemoGuardian[0];
  const pHead = welcomeDemoSnake[0];
  const dx = pHead.x - eHead.x;
  const dy = pHead.y - eHead.y;
  const cands = Math.abs(dx) >= Math.abs(dy)
    ? [{ x: Math.sign(dx), y: 0 }, { x: 0, y: Math.sign(dy) }]
    : [{ x: 0, y: Math.sign(dy) }, { x: Math.sign(dx), y: 0 }];
  cands.push({ x: -cands[0].x, y: -cands[0].y }, { x: -cands[1].x, y: -cands[1].y });
  const nd = cands.find(c => {
    if (!c.x && !c.y) return false;
    const x = eHead.x + c.x;
    const y = eHead.y + c.y;
    if (x < 1 || x >= welcomeDemoCols - 1 || y < 1 || y >= welcomeDemoRows - 1) return false;
    return !welcomeDemoGuardian.slice(1, -1).some(s => s.x === x && s.y === y);
  });
  if (!nd) return;
  const nh = { x: eHead.x + nd.x, y: eHead.y + nd.y };
  const touches = welcomeDemoSnake.some(s => s.x === nh.x && s.y === nh.y);
  if (touches) {
    if (welcomeDemoImmuneUntil > welcomeDemoTick) {
      welcomeDemoGuardian = [];
      welcomeDemoGuardianDefeatedUntil = welcomeDemoTick + 7;
      welcomeDemoCallout.textContent = '¡El jade repelió al guardián!';
    } else {
      welcomeDemoGuardian = [];
      welcomeDemoGameOverUntil = welcomeDemoTick + 7;
      welcomeDemoCallout.textContent = '¡El guardián te alcanzó! Sin jade, termina la partida.';
    }
    return;
  }
  welcomeDemoGuardian.unshift(nh);
  welcomeDemoGuardian.pop();
}
function advanceWelcomeDemo() {
  if (welcomeDemoGameOverUntil) {
    welcomeDemoTick++;
    if (welcomeDemoTick >= welcomeDemoGameOverUntil) resetWelcomeDemo();
    return;
  }
  if (welcomeDemoRouteIndex === welcomeDemoRoute.length) {
    welcomeDemoTick++;
    if (welcomeDemoTick >= welcomeDemoGuardianDefeatedUntil) resetWelcomeDemo();
    return;
  }
  welcomeDemoPreviousSnake = welcomeDemoSnake.map(s => ({ ...s }));
  welcomeDemoPreviousGuardian = welcomeDemoGuardian.map(s => ({ ...s }));
  const route = welcomeDemoRoute[welcomeDemoRouteIndex];
  welcomeDemoDirection = route.direction;
  const nh = {
    x: welcomeDemoSnake[0].x + route.direction.x,
    y: welcomeDemoSnake[0].y + route.direction.y
  };
  const coll = welcomeDemoGuardian.some(s => s.x === nh.x && s.y === nh.y);
  if (coll) {
    if (welcomeDemoImmuneUntil > welcomeDemoTick) {
      welcomeDemoGuardian = [];
      welcomeDemoGuardianDefeatedUntil = welcomeDemoTick + 7;
      welcomeDemoCallout.textContent = '¡Con el jade activo, embiste y vence al guardián!';
    } else {
      welcomeDemoGuardian = [];
      welcomeDemoGameOverUntil = welcomeDemoTick + 7;
      welcomeDemoCallout.textContent = '¡El guardián te alcanzó! Sin jade, termina la partida.';
      return;
    }
  }
  welcomeDemoSnake.unshift(nh);
  let grows = false;
  if (welcomeDemoMaize && nh.x === welcomeDemoMaize.x && nh.y === welcomeDemoMaize.y) {
    welcomeDemoMaize = null;
    welcomeDemoScore += 10;
    welcomeDemoFlashUntil = welcomeDemoTick + 3;
    grows = true;
    welcomeDemoCallout.textContent = '¡+10 puntos! Al comer, la serpiente crece.';
  } else if (welcomeDemoJade && nh.x === welcomeDemoJade.x && nh.y === welcomeDemoJade.y) {
    welcomeDemoJade = null;
    welcomeDemoImmuneUntil = welcomeDemoTick + 12;
    grows = true;
    welcomeDemoCallout.textContent = '¡Jade recogido! El escudo repele al guardián.';
  }
  if (!grows) welcomeDemoSnake.pop();
  welcomeDemoTick++;
  welcomeDemoRouteSteps++;
  if (welcomeDemoRouteSteps >= route.steps) {
    welcomeDemoRouteIndex++;
    welcomeDemoRouteSteps = 0;
  }
  if (welcomeDemoTick % 2 === 0) moveWelcomeDemoGuardian();
}
function drawWelcomeDemo(interpolation = 1) {
  const width = welcomeDemo.clientWidth;
  const height = welcomeDemo.clientHeight;
  if (!width || !height) return;
  if (!welcomeLayout) updateWelcomeLayout(width, height);
  const { cell: cellSize, bx, by } = welcomeLayout;
  const bw = cellSize * welcomeDemoCols;
  const bh = cellSize * welcomeDemoRows;
  const c = welcomeDemoContext;

  c.fillStyle = '#141720';
  c.fillRect(0, 0, width, height);

  // HUD con fuentes más grandes
  c.fillStyle = 'rgba(20, 23, 32, 0.9)';
  roundRect(c, 8, 6, Math.min(170, width * 0.55), 24, 9);
  c.fill();
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  c.fillStyle = '#b8c6b4';
  c.font = '700 10px sans-serif';
  c.fillText('PUNTOS', 18, 18.5);
  c.fillStyle = '#f1cb71';
  c.font = '800 13px sans-serif';
  c.fillText(String(welcomeDemoScore), 72, 18.5);
  c.fillStyle = '#9ba7a0';
  c.font = '700 10px sans-serif';
  c.fillText(`LONG. ${welcomeDemoSnake.length}`, 104, 18.5);

  c.strokeStyle = 'rgba(144, 153, 177, 0.17)';
  c.lineWidth = 1;
  for (let col = 0; col <= welcomeDemoCols; col++) {
    const x = bx + col * cellSize;
    c.beginPath();
    c.moveTo(x, by);
    c.lineTo(x, by + bh);
    c.stroke();
  }
  for (let row = 0; row <= welcomeDemoRows; row++) {
    const y = by + row * cellSize;
    c.beginPath();
    c.moveTo(bx, y);
    c.lineTo(bx + bw, y);
    c.stroke();
  }
  const drawSegments = (current, previous, options = {}) => {
    current.forEach((seg, idx) => {
      const old = previous[idx] || previous[previous.length - 1] || seg;
      const x = old.x + (seg.x - old.x) * interpolation;
      const y = old.y + (seg.y - old.y) * interpolation;
      const next = current[idx + 1] || current[idx - 1] || seg;
      const dir = idx === 0 ? options.direction : { x: seg.x - next.x, y: seg.y - next.y };
      drawWelcomeCell({ x: bx + x * cellSize, y: by + y * cellSize, size: cellSize }, idx, { ...options, direction: dir });
    });
  };
  if (welcomeDemoMaize) drawWelcomeOffering(welcomeDemoMaize, bx + welcomeDemoMaize.x * cellSize, by + welcomeDemoMaize.y * cellSize, cellSize);
  if (welcomeDemoJade) drawWelcomeOffering(welcomeDemoJade, bx + welcomeDemoJade.x * cellSize, by + welcomeDemoJade.y * cellSize, cellSize, true);
  if (welcomeDemoGuardian.length) {
    const gh = welcomeDemoGuardian[0];
    const gn = welcomeDemoGuardian[1] || gh;
    drawSegments(welcomeDemoGuardian, welcomeDemoPreviousGuardian, {
      guardian: true,
      direction: { x: gh.x - gn.x, y: gh.y - gn.y }
    });
  }
  const isImmune = welcomeDemoImmuneUntil > welcomeDemoTick;
  drawSegments(welcomeDemoSnake, welcomeDemoPreviousSnake, { immune: isImmune, direction: welcomeDemoDirection });
  if (isImmune && welcomeDemoSnake.length) {
    const head = welcomeDemoSnake[0];
    const cx = bx + (head.x + 0.5) * cellSize;
    const cy = by + (head.y + 0.5) * cellSize;
    c.strokeStyle = 'rgba(78, 201, 160, 0.88)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(cx, cy, cellSize * 0.77, 0, Math.PI * 2);
    c.stroke();
  }
  if (welcomeDemoTick < welcomeDemoFlashUntil && welcomeDemoSnake.length) {
    const head = welcomeDemoSnake[0];
    c.fillStyle = '#ffe27a';
    c.font = `800 ${Math.max(9, cellSize * 0.55)}px sans-serif`;
    c.textAlign = 'center';
    c.fillText('+10', bx + (head.x + 0.5) * cellSize, by + head.y * cellSize - 3);
  }
}
function welcomeDemoFrame(timestamp) {
  welcomeDemoFrameId = null;
  if (welcomeScreen.classList.contains('hidden')) {
    welcomeDemoLastFrame = null;
    return;
  }
  if (document.hidden) {
    welcomeDemoLastFrame = timestamp;
  } else {
    const elapsed = welcomeDemoLastFrame === null ? 0 : Math.min(100, timestamp - welcomeDemoLastFrame);
    welcomeDemoLastFrame = timestamp;
    welcomeDemoAccumulator += elapsed;
    let ticks = 0;
    while (welcomeDemoAccumulator >= WELCOME_DEMO_TICK_MS && ticks < 3) {
      welcomeDemoAccumulator -= WELCOME_DEMO_TICK_MS;
      advanceWelcomeDemo();
      ticks++;
    }
  }
  drawWelcomeDemo(welcomeDemoAccumulator / WELCOME_DEMO_TICK_MS);
  welcomeDemoFrameId = requestAnimationFrame(welcomeDemoFrame);
}
function startWelcomeDemo() {
  if (welcomeDemoFrameId !== null) return;
  resizeWelcomeDemo();
  welcomeDemoLastFrame = null;
  welcomeDemoFrameId = requestAnimationFrame(welcomeDemoFrame);
}
function stopWelcomeDemo() {
  if (welcomeDemoFrameId !== null) {
    cancelAnimationFrame(welcomeDemoFrameId);
    welcomeDemoFrameId = null;
  }
  welcomeDemoLastFrame = null;
}

// ========================================================
// 29. INICIALIZACIÓN
// ========================================================
updateSoundUI();
drawerDpadToggle.checked = showDpad;
touchControls.classList.toggle('hidden', !showDpad);
updateScoresUI();
updateLivesUI();
updateStatisticsUI();
showTutorialStep(1);

const welcomeCard = welcomeScreen.querySelector('.welcome-card');
welcomeCard.insertBefore(tutorialModal, welcomeStartBtn);
tutorialModal.classList.remove('hidden');
welcomeStartBtn.classList.add('hidden');

BadgeManager.setVisible('lives', true);

resetWelcomeDemo();
startWelcomeDemo();
resetGame();

resizeCanvas();
draw();