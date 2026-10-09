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
const dtStatsBtn = document.getElementById('dt-stats-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeCard = welcomeScreen.querySelector('.welcome-card');
const welcomePreview = welcomeCard.querySelector('.welcome-preview');
const welcomeStartBtn = document.getElementById('welcome-start-btn');
const welcomeDemo = document.getElementById('welcome-demo');
const welcomeDemoCallout = document.getElementById('welcome-demo-callout');
const welcomeDemoContext = welcomeDemo.getContext('2d');

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
const drawerStatsBtn = document.getElementById('drawer-stats-btn');

// Insignias y Alertas
const immunityBadge = document.getElementById('immunity-badge');
const immunityTimerSpan = document.getElementById('immunity-timer');
const livesBadge = document.getElementById('lives-badge');
const livesIndicator = document.getElementById('lives-indicator');
const lifePips = livesIndicator.querySelectorAll('.life-pip');
const respawnBadge = document.getElementById('respawn-badge');
const respawnTimerSpan = document.getElementById('respawn-timer');
const freezeBadge = document.getElementById('freeze-badge');
const freezeTimerSpan = document.getElementById('freeze-timer');
const sacrificeOfferingBadge = document.getElementById('sacrifice-offering-badge');
const rainBadge = document.getElementById('rain-badge');
const rainTimerSpan = document.getElementById('rain-timer');
const cosmicOrderFoodBadge = document.getElementById('cosmic-order-food-badge');
const cosmicOrderBadge = document.getElementById('cosmic-order-badge');
const cosmicOrderTimerSpan = document.getElementById('cosmic-order-timer');
const skullFoodBadge = document.getElementById('skull-food-badge');
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
const closeTutorialBtn = document.getElementById('close-tutorial-btn');
const stepDots = document.querySelectorAll('.step-dots .dot');

// Game Over Modal
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
// GESTOR DE BADGES EN PANTALLA (ANTI-SATURACIÓN)
// ========================================================
const BadgeManager = (() => {
  const isMobile = () => window.innerWidth <= 768;
  const MAX_MEDIUM_VISIBLE_MOBILE = 1;

  // Registro de badges con su prioridad
  const registry = {
    lives:               { el: () => document.getElementById('lives-badge'), priority: 'high', autoHide: false },
    immunity:            { el: () => document.getElementById('immunity-badge'), priority: 'high', autoHide: false },
    respawn:             { el: () => document.getElementById('respawn-badge'), priority: 'high', autoHide: false },
    freeze:              { el: () => document.getElementById('freeze-badge'), priority: 'high', autoHide: false },
    rain:                { el: () => document.getElementById('rain-badge'), priority: 'medium', autoHide: false },
    cosmicOrderFood:     { el: () => document.getElementById('cosmic-order-food-badge'), priority: 'medium', autoHide: false },
    cosmicOrder:         { el: () => document.getElementById('cosmic-order-badge'), priority: 'medium', autoHide: false },
    sacrificeOffering:   { el: () => document.getElementById('sacrifice-offering-badge'), priority: 'medium', autoHide: false },
    skullFood:           { el: () => document.getElementById('skull-food-badge'), priority: 'medium', autoHide: false },
    threat:              { el: () => document.getElementById('threat-badge'), priority: 'medium', autoHide: false }
  };

  // Estado de visibilidad lógica (lo que el juego quiere mostrar)
  const logicalState = {};

  // Orden de prioridad (mayor índice = menos prioritario)
  const mediumPriorityOrder = [
    'cosmicOrder',       // ¡Crítico! El jugador debe reaccionar ya
    'rain',              // Oportunidad limitada
    'freeze',            // (es high, pero por si acaso)
    'sacrificeOffering', // Oportunidad
    'cosmicOrderFood',   // Pista
    'skullFood',         // Peligro estático
    'threat'             // Informativo
  ];

  function setVisible(key, visible) {
    logicalState[key] = visible;
    applyVisibility();
  }

  function applyVisibility() {
    const mobile = isMobile();

    // High priority: mostrar todos los que estén activos
    Object.entries(registry).forEach(([key, config]) => {
      if (config.priority !== 'high') return;
      const el = config.el();
      if (!el) return;
      el.classList.toggle('hidden', !logicalState[key]);
    });

    // Medium priority: en móvil solo los top N
    const activeMedium = mediumPriorityOrder.filter(key => logicalState[key]);

    if (mobile) {
      const visibleSet = new Set(activeMedium.slice(0, MAX_MEDIUM_VISIBLE_MOBILE));
      mediumPriorityOrder.forEach(key => {
        const el = registry[key]?.el();
        if (!el) return;
        const shouldShow = logicalState[key] && visibleSet.has(key);
        el.classList.toggle('is-visible', shouldShow);
        el.classList.toggle('hidden', !logicalState[key]);
      });
    } else {
      // Desktop: mostrar todos los activos
      Object.entries(registry).forEach(([key, config]) => {
        if (config.priority !== 'medium') return;
        const el = config.el();
        if (!el) return;
        el.classList.toggle('hidden', !logicalState[key]);
        el.classList.remove('is-visible');
      });
    }
  }

  // Auto-ocultado para badges informativos (threat, skull, cosmicOrderFood)
  const autoHideTimers = {};
  function scheduleAutoHide(key, delayMs = 4000) {
    if (autoHideTimers[key]) clearTimeout(autoHideTimers[key]);
    autoHideTimers[key] = setTimeout(() => {
      setVisible(key, false);
    }, delayMs);
  }

  function cancelAutoHide(key) {
    if (autoHideTimers[key]) {
      clearTimeout(autoHideTimers[key]);
      delete autoHideTimers[key];
    }
  }

  return {
    setVisible,
    scheduleAutoHide,
    cancelAutoHide,
    refresh: applyVisibility,
    isMobile
  };
})();

// Re-evaluar al cambiar tamaño
window.addEventListener('resize', () => BadgeManager.refresh());

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
const STATISTICS_STORAGE_KEY = 'kukulcanGameStatistics';
const DIFFICULTY_NAMES = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
  extreme: 'Pesadilla'
};

let storageUnavailable = false;

function safeGetItem(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    storageUnavailable = true;
    console.warn(`No se pudo leer "${key}" del almacenamiento local.`, error);
    return fallback;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch (error) {
    storageUnavailable = true;
    console.warn(`No se pudo guardar "${key}" en el almacenamiento local.`, error);
    return false;
  }
}

// ========================================================
// ESTADO DEL JUEGO
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
const MAX_LIVES = 3;
const RESPAWN_PROTECTION_MS = 2500;
let lives = MAX_LIVES;
let highScore = Math.max(0, Number.parseInt(safeGetItem('snakeIoHighScore', '0'), 10) || 0);
let isGameRunning = false;
let isPaused = false;
let isMuted = safeGetItem('snakeIoMuted', 'false') === 'true';
let runStartedAt = null;
let runDifficulty = null;
let runGuardiansDefeated = 0;
let statisticsWasRunning = false;
let statisticsWasPaused = false;
let statisticsDrawerWasVisible = false;
let tutorialWasRunning = false;
let tutorialWasPaused = false;
let tutorialDrawerWasVisible = false;
let tutorialOpenedFromWelcome = false;
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
const WELCOME_DEMO_COLS = 22;
const WELCOME_DEMO_ROWS = 8;
const WELCOME_DEMO_TICK_MS = 260;
const WELCOME_DEMO_ROUTE = [
  { direction: { x: 1, y: 0 }, steps: 8 },
  { direction: { x: 0, y: 1 }, steps: 2 },
  { direction: { x: 1, y: 0 }, steps: 2 },
  { direction: { x: 0, y: -1 }, steps: 2 },
  { direction: { x: 1, y: 0 }, steps: 4 }
];
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
let welcomeDemoMaize = { x: 8, y: 4 };
let welcomeDemoJade = { x: 14, y: 6 };
let welcomeDemoImmuneUntil = 0;
let welcomeDemoFlashUntil = 0;
let welcomeDemoGuardianDefeatedUntil = 0;
let welcomeDemoGameOverUntil = 0;
let welcomeDemoStatus = '¡Guía a Kukulcán con las flechas o WASD!';

function createEmptyGameStatistics() {
  return Object.fromEntries(Object.keys(DIFFICULTY_NAMES).map(difficulty => [
    difficulty,
    { gamesPlayed: 0, bestScore: 0, bestSurvivalMs: 0, guardiansDefeated: 0 }
  ]));
}

function isValidGameStatistics(value) {
  return value && typeof value === 'object' &&
    Object.keys(DIFFICULTY_NAMES).every(difficulty => {
      const record = value[difficulty];
      return record && ['gamesPlayed', 'bestScore', 'bestSurvivalMs', 'guardiansDefeated']
        .every(field => Number.isFinite(record[field]) && record[field] >= 0);
    });
}

function loadGameStatistics() {
  const saved = safeGetItem(STATISTICS_STORAGE_KEY, null);
  if (storageUnavailable) {
    statisticsStorageStatus.textContent = 'Este navegador no permite guardar estadísticas; podrás jugar sin que se conserve el historial.';
    return createEmptyGameStatistics();
  }
  if (!saved) return createEmptyGameStatistics();

  try {
    const parsed = JSON.parse(saved);
    if (isValidGameStatistics(parsed)) return parsed;
    throw new Error('El formato guardado no coincide con el esquema de estadísticas.');
  } catch (error) {
    console.error('No se pudieron cargar las estadísticas guardadas.', error);
    statisticsStorageStatus.textContent = 'No se pudieron leer las estadísticas guardadas en este navegador.';
    return createEmptyGameStatistics();
  }
}

let gameStatistics = loadGameStatistics();

// Mecánica de Turbo con Recarga Obligatoria
let isTurbo = false;
let turboRemaining = 0;
let turboCooldown = 0;
let turboCooldownUntil = 0;
let turboReadyAt = 0;
const TURBO_DURATION_MS = 3000;
const TURBO_COOLDOWN_MS = 5000;

// Inmunidad
let isImmune = false;
let immunitySeconds = 0;
let immunityExpiresAt = 0;
let respawnProtectedUntil = 0;

// Guardianes rojos
let enemyGuardians = [];
let nextEnemyId = 1;
let hasSpawnedGuardian = false;
let enemySpawnAt = null;
let jadeSpawnAt = null;
let freezeSpawnAt = null;
let guardiansFrozenUntil = 0;
const GUARDIAN_FREEZE_DURATION_MS = 3000;
const FREEZE_FIRST_SPAWN_MS = 16000;
const FREEZE_RESPAWN_DELAY_MS = 22000;
const GUARDIAN_TARGETS = { easy: 1, medium: 2, hard: 3, extreme: 4 };
const GUARDIAN_PALETTES = [
  { name: 'rojo', head: '#e2574c', body: '#9b2929', crest: '#ff9b83' },
  { name: 'naranja', head: '#f28c28', body: '#a64b1b', crest: '#ffc078' },
  { name: 'dorado', head: '#f2c230', body: '#a87916', crest: '#ffe27a' },
  { name: 'violeta', head: '#a65bd4', body: '#64328e', crest: '#d4a0f0' }
];
const GUARDIAN_BEHAVIORS = [
  { id: 'hunter', name: 'Cazador' },
  { id: 'interceptor', name: 'Vidente' },
  { id: 'flanker', name: 'Flanqueador' }
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
const FIRE_BREATH_CYCLE_MS = 900;
const FIRE_BREATH_ACTIVE_MS = 540;

// Preferencia de cruceta
let showDpad = safeGetItem('snakeIoShowDpad', 'false') === 'true';
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

  rebuildBoardCanvas(width, height, dpr);
  if (!isGameRunning) draw();
}

function rebuildBoardCanvas(width = window.innerWidth, height = window.innerHeight, dpr = window.devicePixelRatio || 1) {
  boardCanvas = document.createElement('canvas');
  boardCanvas.width = Math.max(1, Math.floor(width * dpr));
  boardCanvas.height = Math.max(1, Math.floor(height * dpr));
  boardContext = boardCanvas.getContext('2d');
  boardContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  boardContext.fillStyle = '#141720';
  boardContext.fillRect(0, 0, width, height);
  boardContext.strokeStyle = 'rgba(144, 153, 177, 0.16)';
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

  boardContext.fillStyle = 'rgba(198, 164, 85, 0.1)';
  for (let x = offsetX + TILE_SIZE; x <= width; x += TILE_SIZE * 4) {
    for (let y = offsetY + TILE_SIZE; y <= height; y += TILE_SIZE * 4) {
      boardContext.beginPath();
      boardContext.moveTo(x, y - 2);
      boardContext.lineTo(x + 2, y);
      boardContext.lineTo(x, y + 2);
      boardContext.lineTo(x - 2, y);
      boardContext.closePath();
      boardContext.fill();
    }
  }
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
    const actx = getAudioContext();
    if (!actx) return;
    const now = actx.currentTime;
    const layers = [
      { frequency: 82, endFrequency: 34, duration: 0.72, volume: 0.3, type: 'sawtooth' },
      { frequency: 196, endFrequency: 49, duration: 0.58, volume: 0.22, type: 'triangle' },
      { frequency: 523, endFrequency: 131, duration: 0.34, volume: 0.13, type: 'square' }
    ];

    layers.forEach(layer => {
      const oscillator = actx.createOscillator();
      const gain = actx.createGain();
      oscillator.type = layer.type;
      oscillator.frequency.setValueAtTime(layer.frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(layer.endFrequency, now + layer.duration);
      gain.gain.setValueAtTime(layer.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + layer.duration);
      oscillator.connect(gain);
      gain.connect(actx.destination);
      oscillator.start(now);
      oscillator.stop(now + layer.duration);
    });
  } catch (e) {
    return;
  }
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
// SISTEMA DE TURBO (UN TOQUE = 3s ACTIVOS + 5s RECARGA)
// ========================================================
function triggerTurboBurst() {
  // Solo se puede usar si el juego corre, no está pausado y no está en recarga
  if (isTurbo || turboCooldown > 0 || !isGameRunning || isPaused || countdownEndsAt !== null) return;

  isTurbo = true;
  turboRemaining = TURBO_DURATION_MS;
  turboReadyAt = gameTime + TURBO_DURATION_MS;
  turboCooldownUntil = turboReadyAt + TURBO_COOLDOWN_MS;
  updateTurboUI();

  playTurboStartSound();
}

function triggerHeadPulse(color = '#d5bd70') {
  headPulse = 1;
  headPulseColor = color;
}

function updateGameTimers(elapsedMs) {
  gameTime += elapsedMs;
  if (headPulse > 0) {
    headPulse = Math.max(0, headPulse - (elapsedMs / 240));
  }

  if (guardiansFrozenUntil > 0) {
    if (gameTime >= guardiansFrozenUntil) {
      enemyGuardians.forEach(guardian => {
        if (guardian.frozenAt !== null) {
          guardian.expiresAt += gameTime - guardian.frozenAt;
          guardian.frozenAt = null;
        }
      });
      guardiansFrozenUntil = 0;
      freezeBadge.classList.add('hidden');
    } else {
      freezeTimerSpan.textContent = String(Math.ceil((guardiansFrozenUntil - gameTime) / 1000));
    }
  }

  if (isImmune) {
    immunitySeconds = Math.max(0, Math.ceil((immunityExpiresAt - gameTime) / 1000));
    immunityTimerSpan.textContent = immunitySeconds;
    if (gameTime >= immunityExpiresAt) deactivateImmunity();
  }

  if (respawnProtectedUntil > 0) {
    if (gameTime >= respawnProtectedUntil) {
      respawnProtectedUntil = 0;
      respawnBadge.classList.add('hidden');
    } else {
      respawnTimerSpan.textContent = String(Math.ceil((respawnProtectedUntil - gameTime) / 1000));
    }
  }

  if (isTurbo && gameTime >= turboReadyAt) {
    isTurbo = false;
    turboRemaining = 0;
    turboCooldown = Math.max(0, turboCooldownUntil - gameTime);
  }
  if (!isTurbo && turboCooldown > 0) {
    turboCooldown = Math.max(0, turboCooldownUntil - gameTime);
    if (turboCooldown === 0) playTurboReadySound();
  } else if (isTurbo) {
    turboRemaining = Math.max(0, turboReadyAt - gameTime);
  }
  updateTurboUI();

  if (enemySpawnAt !== null && gameTime >= enemySpawnAt) {
    enemySpawnAt = null;
    const spawned = spawnEnemySnake();
    scheduleEnemySpawn(spawned ? null : GUARDIAN_SPAWN_RETRY_MS);
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
    rainBadge.classList.remove('hidden');
  }

  if (sacredRainUntil > gameTime && maizeSpawnRetryAt !== null && gameTime >= maizeSpawnRetryAt) {
    if (!ensureMaizeOffering()) maizeSpawnRetryAt = gameTime + 500;
  }

  if (sacredRainUntil > 0) {
    if (gameTime >= sacredRainUntil) {
      sacredRainUntil = 0;
      maizeSpawnRetryAt = null;
      rainBadge.classList.add('hidden');
    } else {
      rainTimerSpan.textContent = String(Math.ceil((sacredRainUntil - gameTime) / 1000));
    }
  }

  if (nextSacrificeSpawnAt !== null && gameTime >= nextSacrificeSpawnAt) {
    if (lives >= MAX_LIVES) {
      nextSacrificeSpawnAt = null;
    } else if (sacrificeFoods.length > 0) {
      nextSacrificeSpawnAt = gameTime + SACRIFICE_REPEAT_DELAY_MS;
    } else if (spawnSacrificeOffering()) {
      nextSacrificeSpawnAt = gameTime + SACRIFICE_REPEAT_DELAY_MS;
    } else {
      nextSacrificeSpawnAt = gameTime + 1000;
    }
  }

  if (
    nextSkullSpawnAt !== null &&
    gameTime >= nextSkullSpawnAt &&
    skullFoods.length > 0
  ) {
    nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
  } else if (
    nextSkullSpawnAt !== null &&
    gameTime >= nextSkullSpawnAt &&
    skullFoods.length === 0 &&
    nextSkullMoveAt === null
  ) {
    if (spawnSkullFood()) {
      nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
      nextSkullMoveAt = gameTime + SKULL_MOVE_INTERVAL_MS;
    } else {
      nextSkullSpawnAt = gameTime + 1000;
    }
  }

  if (nextSkullMoveAt !== null && gameTime >= nextSkullMoveAt) {
    if (skullFoods.length > 0) {
      skullFoods = [];
      skullFoodBadge.classList.add('hidden');
      nextSkullMoveAt = gameTime + SKULL_REAPPEAR_DELAY_MS;
    } else {
      if (spawnSkullFood()) {
        nextSkullMoveAt = gameTime + SKULL_MOVE_INTERVAL_MS;
      } else {
        nextSkullMoveAt = gameTime + 1000;
      }
    }
  }

  if (cosmicOrderResolveAt !== null) {
    if (gameTime >= cosmicOrderResolveAt) {
      resolveCosmicOrder();
    } else {
      cosmicOrderTimerSpan.textContent = String(Math.ceil((cosmicOrderResolveAt - gameTime) / 1000));
    }
  }

  if (cosmicOrderFoods.some(food =>
    food.expiresAt !== undefined && gameTime >= food.expiresAt
  )) {
    cosmicOrderFoods = [];
    cosmicOrderFoodBadge.classList.add('hidden');
  }

  if (nextCosmicOrderSpawnAt !== null && gameTime >= nextCosmicOrderSpawnAt) {
    if (cosmicOrderFoods.length > 0) {
      nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_INTERVAL_MS;
    } else if (enemyGuardians.length === 0) {
      nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_RETRY_MS;
    } else if (maybeSpawnCosmicOrderFood()) {
      nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_INTERVAL_MS;
    } else {
      nextCosmicOrderSpawnAt = gameTime + 1000;
    }
  }

  const targetCount = GUARDIAN_TARGETS[difficultySelect.value] || GUARDIAN_TARGETS.medium;
  if (
    isGameRunning &&
    !isPaused &&
    countdownEndsAt === null &&
    cosmicOrderResolveAt === null &&
    enemyGuardians.length < targetCount &&
    enemySpawnAt === null
  ) {
    scheduleEnemySpawn();
  }

  if (
    cosmicOrderFlashStartedAt !== null &&
    gameTime - cosmicOrderFlashStartedAt >= COSMIC_ORDER_FLASH_DURATION_MS
  ) {
    cosmicOrderFlashStartedAt = null;
  }
}

function maybeSpawnCosmicOrderFood() {
  if (cosmicOrderFoods.length > 0 || enemyGuardians.length === 0) return false;

  const start = Math.floor(Math.random() * gridCols * gridRows);
  const totalCells = gridCols * gridRows;
  for (let offset = 0; offset < totalCells; offset++) {
    const cell = (start + offset) % totalCells;
    const x = cell % gridCols;
    const y = Math.floor(cell / gridCols);
    if (isGuardianCellOccupied(x, y)) continue;
    cosmicOrderFoods.push({
      x,
      y,
      expiresAt: gameTime + COSMIC_ORDER_FOOD_LIFETIME_MS
    });
    cosmicOrderFoodBadge.classList.remove('hidden');
    return true;
  }
  return false;
}

function spawnSacrificeOffering() {
  if (lives >= MAX_LIVES || sacrificeFoods.length > 0) return false;

  const start = Math.floor(Math.random() * gridCols * gridRows);
  const totalCells = gridCols * gridRows;
  for (let offset = 0; offset < totalCells; offset++) {
    const cell = (start + offset) % totalCells;
    const x = cell % gridCols;
    const y = Math.floor(cell / gridCols);
    if (isGuardianCellOccupied(x, y)) continue;
    sacrificeFoods.push({ x, y });
    sacrificeOfferingBadge.classList.remove('hidden');
    return true;
  }
  return false;
}

function spawnSkullFood() {
  if (skullFoods.length > 0) return false;

  const availableCells = [];
  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      if (!isGuardianCellOccupied(x, y)) availableCells.push({ x, y });
    }
  }

  const differentCells = availableCells.filter(({ x, y }) =>
    !lastSkullPosition || x !== lastSkullPosition.x || y !== lastSkullPosition.y
  );
  const spawnCells = differentCells.length > 0 ? differentCells : availableCells;
  if (spawnCells.length === 0) return false;

  const position = spawnCells[Math.floor(Math.random() * spawnCells.length)];
  skullFoods.push(position);
  lastSkullPosition = { ...position };
  skullFoodBadge.classList.remove('hidden');
  return true;
}

function resolveCosmicOrder() {
  cosmicOrderResolveAt = null;
  cosmicOrderBadge.classList.add('hidden');

  const clearedCount = enemyGuardians.length;
  if (clearedCount === 0) {
    enemySpawnAt = null;
    scheduleEnemySpawn();
    return;
  }

  cosmicOrderFlashStartedAt = gameTime;
  const defeatedGuardians = enemyGuardians;
  runGuardiansDefeated += clearedCount;
  defeatedGuardians.forEach(guardian => {
    guardian.segments.forEach(segment => {
      const x = segment.x * TILE_SIZE + TILE_SIZE / 2;
      const y = segment.y * TILE_SIZE + TILE_SIZE / 2;
      for (let particle = 0; particle < 5; particle++) {
        const angle = (Math.PI * 2 * particle) / 5 + Math.random() * 0.3;
        const speed = 1.8 + Math.random() * 2.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 2,
          color: Math.random() > 0.5 ? '#d5bd70' : '#8be7ff',
          alpha: 1,
          decay: 0.025 + Math.random() * 0.015
        });
      }
    });
  });
  enemyGuardians = [];
  previousGuardianPositions.clear();
  updateGuardianBadge();

  screenShake = 10;
  playCosmicOrderSound();
  const reward = clearedCount * COSMIC_ORDER_REWARD;
  score += reward;
  updateScoresUI();
  triggerHeadPulse('#d5bd70');
  const playerHead = snake[0];
  spawnFloatingText(
    `🌀 Orden +${reward}`,
    playerHead.x * TILE_SIZE + TILE_SIZE / 2,
    playerHead.y * TILE_SIZE,
    '#d5bd70'
  );

  enemySpawnAt = null;
  scheduleEnemySpawn();
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

  const elapsedMs = lastFrameTimestamp === null
    ? 0
    : Math.max(0, timestamp - lastFrameTimestamp);
  lastFrameTimestamp = timestamp;
  let updateEffects = false;

  if (!isPaused) {
    if (countdownEndsAt !== null) {
      const remainingMs = Math.max(0, countdownEndsAt - timestamp);
      const nextValue = Math.ceil(remainingMs / 1000);
      if (nextValue > 0 && nextValue !== countdownValue) {
        countdownValue = nextValue;
        countdownOverlay.textContent = String(countdownValue);
      }
      if (remainingMs === 0) {
        cancelCountdown();
        simulationAccumulator = 0;
        snapshotRenderPositions();
        renderInterpolation = 1;
        scheduleEnemySpawn();
      }
    } else {
      updateEffects = true;
      updateGameTimers(elapsedMs);
      simulationAccumulator = Math.min(
        simulationAccumulator + elapsedMs,
        getCurrentSpeed() * 5
      );

      let ticks = 0;
      while (
        isGameRunning &&
        !isPaused &&
        countdownEndsAt === null &&
        ticks < 5 &&
        simulationAccumulator >= getCurrentSpeed()
      ) {
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

function updateTurboUI() {
  const charge = turboCooldown > 0
    ? 1 - turboCooldown / TURBO_COOLDOWN_MS
    : 1;

  btnTurbo.classList.toggle('active', isTurbo);
  btnTurbo.classList.toggle('cooldown', turboCooldown > 0);
  btnTurbo.disabled = turboCooldown > 0 || !isGameRunning || isPaused || countdownEndsAt !== null;
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
  const backward = Math.atan2(-direction.y, -direction.x);
  for (let i = 0; i < 3; i++) {
    const angle = backward + (Math.random() - 0.5) * Math.PI;
    const speed = Math.random() * 0.8 + 0.5;
    particles.push({
      x: x + (Math.random() - 0.5) * 7,
      y: y + (Math.random() - 0.5) * 7,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 1.8 + 2,
      color: warmColors[Math.floor(Math.random() * warmColors.length)],
      alpha: 0.9,
      decay: 0.045
    });
  }
}

// ========================================================
// TEXTOS FLOTANTES Y PARTÍCULAS
// ========================================================
function spawnFloatingText(text, x, y, color = '#69d3b4') {
  const maxFloatingTexts = window.innerWidth <= 768 ? 3 : 8;
  if (floatingTexts.length >= maxFloatingTexts) {
    floatingTexts.splice(0, floatingTexts.length - maxFloatingTexts + 1);
  }

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
  immunityExpiresAt = gameTime + seconds * 1000;
  immunitySeconds = seconds;
  immunityTimerSpan.textContent = immunitySeconds;
  BadgeManager.setVisible('immunity', true);
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

function maybeSpawnFreezeFood() {
  if (freezeFoods.length > 0) return true;

  const head = snake[0];
  for (let attempt = 0; attempt < 160; attempt++) {
    const x = (head.x + Math.floor(Math.random() * 17) - 8 + gridCols) % gridCols;
    const y = (head.y + Math.floor(Math.random() * 17) - 8 + gridRows) % gridRows;
    const dx = Math.min(Math.abs(x - head.x), gridCols - Math.abs(x - head.x));
    const dy = Math.min(Math.abs(y - head.y), gridRows - Math.abs(y - head.y));
    if (dx + dy <= 8 && !isGuardianCellOccupied(x, y)) {
      freezeFoods.push({ x, y });
      return true;
    }
  }

  for (let attempt = 0; attempt < gridCols * gridRows; attempt++) {
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    if (isGuardianCellOccupied(x, y)) continue;
    freezeFoods.push({ x, y });
    return true;
  }

  return false;
}

function activateGuardianFreeze() {
  guardiansFrozenUntil = gameTime + GUARDIAN_FREEZE_DURATION_MS;
  enemyGuardians.forEach(guardian => {
    if (guardian.frozenAt === null) guardian.frozenAt = gameTime;
  });
  freezeTimerSpan.textContent = String(GUARDIAN_FREEZE_DURATION_MS / 1000);
  freezeBadge.classList.remove('hidden');
}

// ========================================================
// SISTEMA DE GUARDIANES ROJOS (ENEMIGOS IA)
// ========================================================
function scheduleEnemySpawn(retryDelay = null) {
  const difficulty = difficultySelect.value;
  const targetCount = GUARDIAN_TARGETS[difficulty] || GUARDIAN_TARGETS.medium;
  updateGuardianBadge();
  if (!isGameRunning || enemyGuardians.length >= targetCount || cosmicOrderResolveAt !== null) {
    enemySpawnAt = null;
    return;
  }
  if (isPaused || countdownEndsAt !== null) return;

  const delay = retryDelay ?? (hasSpawnedGuardian
    ? (GUARDIAN_NEXT_SPAWN_MS[difficulty] || GUARDIAN_NEXT_SPAWN_MS.medium)
    : (GUARDIAN_FIRST_SPAWN_MS[difficulty] || GUARDIAN_FIRST_SPAWN_MS.medium));
  enemySpawnAt = gameTime + delay;
}

function spawnEnemySnake() {
  const difficulty = difficultySelect.value;
  const targetCount = GUARDIAN_TARGETS[difficulty] || GUARDIAN_TARGETS.medium;
  if (!isGameRunning || enemyGuardians.length >= targetCount) return false;

  let segments = null;
  const safeMarginX = Math.max(3, Math.ceil(56 / TILE_SIZE));
  const safeMarginY = Math.max(3, Math.ceil(88 / TILE_SIZE));
  const minSpawnX = safeMarginX + 3;
  const maxSpawnX = gridCols - safeMarginX - 1;
  const minSpawnY = safeMarginY;
  const maxSpawnY = gridRows - safeMarginY - 1;

  for (let attempt = 0; attempt < gridCols * gridRows; attempt++) {
    if (minSpawnX > maxSpawnX || minSpawnY > maxSpawnY) break;
    const x = minSpawnX + Math.floor(Math.random() * (maxSpawnX - minSpawnX + 1));
    const y = minSpawnY + Math.floor(Math.random() * (maxSpawnY - minSpawnY + 1));
    const candidate = Array.from({ length: 4 }, (_, index) => ({
      x: (x - index + gridCols) % gridCols,
      y
    }));
    const dx = Math.min(Math.abs(x - snake[0].x), gridCols - Math.abs(x - snake[0].x));
    const dy = Math.min(Math.abs(y - snake[0].y), gridRows - Math.abs(y - snake[0].y));
    const safelyDistant = dx + dy >= 8;
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
    expiresAt: gameTime + (GUARDIAN_LIFETIME_MS[difficulty] || GUARDIAN_LIFETIME_MS.medium),
    frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
    palette: GUARDIAN_PALETTES[(id - 1) % GUARDIAN_PALETTES.length],
    behavior: GUARDIAN_BEHAVIORS[(id - 1) % GUARDIAN_BEHAVIORS.length]
  };
  enemyGuardians.push(guardian);
  hasSpawnedGuardian = true;
  updateGuardianBadge();
  return true;
}

function getGuardianDeathMessage(guardian) {
  return `¡El ${guardian.behavior.name} te alcanzó!`;
}

function isGuardianCellOccupied(x, y) {
  return snake.some(segment => segment.x === x && segment.y === y) ||
    foods.some(food => food.x === x && food.y === y) ||
    bonusFoods.some(food => food.x === x && food.y === y) ||
    shieldFoods.some(food => food.x === x && food.y === y) ||
    freezeFoods.some(food => food.x === x && food.y === y) ||
    cosmicOrderFoods.some(food => food.x === x && food.y === y) ||
    sacrificeFoods.some(food => food.x === x && food.y === y) ||
    skullFoods.some(food => food.x === x && food.y === y) ||
    enemyGuardians.some(guardian =>
      guardian.segments.some(segment => segment.x === x && segment.y === y)
    );
}

function updateGuardianBadge() {
  const count = enemyGuardians.length;
  threatBadge.classList.toggle('hidden', count === 0);
  const behaviors = [...new Set(enemyGuardians.map(guardian => guardian.behavior.name))];
  threatBadge.textContent = count === 1
    ? `◆ ${behaviors[0]} al acecho`
    : `◆ ${count} guardianes: ${behaviors.join(' · ')}`;
}

function getGuardianTarget(guardian, playerHead, difficulty) {
  if (guardian.behavior.id === 'interceptor') {
    const lead = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    return {
      x: (playerHead.x + direction.x * lead + gridCols) % gridCols,
      y: (playerHead.y + direction.y * lead + gridRows) % gridRows
    };
  }

  if (guardian.behavior.id === 'flanker') {
    const moveInterval = difficulty === 'easy' || difficulty === 'medium' ? 4 : 3;
    const orbit = Math.floor(guardian.tickCounter / (moveInterval * 3) + guardian.id) % 4;
    const offsets = [
      { x: 0, y: -5 },
      { x: 5, y: 0 },
      { x: 0, y: 5 },
      { x: -5, y: 0 }
    ];
    const offset = offsets[orbit];
    return {
      x: (playerHead.x + offset.x + gridCols) % gridCols,
      y: (playerHead.y + offset.y + gridRows) % gridRows
    };
  }

  return playerHead;
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
  if (
    enemyGuardians.length === 0 ||
    guardiansFrozenUntil > gameTime ||
    cosmicOrderResolveAt !== null
  ) return;
  const difficulty = difficultySelect.value;
  const moveInterval = (difficulty === 'easy' || difficulty === 'medium') ? 4 : 3;

  for (const guardian of [...enemyGuardians]) {
    if (gameTime >= guardian.expiresAt) {
      destroyEnemySnake(guardian.id);
      continue;
    }

    guardian.tickCounter++;
    const behaviorMoveInterval = moveInterval + (guardian.behavior.id === 'interceptor' ? 1 : 0);
    if ((guardian.tickCounter + guardian.id) % behaviorMoveInterval !== 0) continue;

    const enemyHead = guardian.segments[0];
    const playerHead = snake[0];
    const target = getGuardianTarget(guardian, playerHead, difficulty);

    let dx = target.x - enemyHead.x;
    let dy = target.y - enemyHead.y;

    if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
    if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
    if (hasGuardianProtection()) {
      dx = -dx;
      dy = -dy;
    }

    const candidates = Math.abs(dx) >= Math.abs(dy)
      ? [{ x: Math.sign(dx) || 1, y: 0 }, { x: 0, y: Math.sign(dy) || 1 }]
      : [{ x: 0, y: Math.sign(dy) || 1 }, { x: Math.sign(dx) || 1, y: 0 }];
    candidates.push({ x: -candidates[0].x, y: -candidates[0].y });
    candidates.push({ x: -candidates[1].x, y: -candidates[1].y });

    const guardianDirection = candidates.find(candidate =>
      !((candidate.x !== 0 && candidate.x === -guardian.direction.x) ||
        (candidate.y !== 0 && candidate.y === -guardian.direction.y))
    ) || guardian.direction;
    guardian.direction = guardianDirection;

    const newEnemyHead = {
      x: (enemyHead.x + guardian.direction.x + gridCols) % gridCols,
      y: (enemyHead.y + guardian.direction.y + gridRows) % gridRows
    };

    const touchesPlayer = snake.some(segment =>
      segment.x === newEnemyHead.x && segment.y === newEnemyHead.y
    );
    if (touchesPlayer) {
      if (hasGuardianProtection()) {
        screenShake = 10;
        playEnemyDefeatedSound();
        runGuardiansDefeated++;
        score += 100;
        const rewardLabel = isImmune ? '+100 🛡️ ¡GUARDIÁN VENCIDO!' : '+100 🪶 ¡GUARDIÁN VENCIDO!';
        const rewardColor = isImmune ? '#facc15' : '#69d3b4';
        spawnFloatingText(rewardLabel, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, rewardColor);
        updateScoresUI();
        destroyEnemySnake(guardian.id);
        continue;
      }
      loseLife(getGuardianDeathMessage(guardian));
      return;
    }

    guardian.segments.unshift(newEnemyHead);
    guardian.segments.pop();
  }
}

// ========================================================
// LÓGICA DE PARTIDA Y ALIMENTOS
// ========================================================
function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
}

function updateStatisticsUI() {
  document.querySelectorAll('[data-stat][data-field]').forEach(cell => {
    const { stat, field } = cell.dataset;
    const value = gameStatistics[stat][field];
    cell.textContent = field === 'bestSurvivalMs' ? formatDuration(value) : value;
  });
}

function saveGameStatistics() {
  updateStatisticsUI();
  if (safeSetItem(STATISTICS_STORAGE_KEY, JSON.stringify(gameStatistics))) {
    statisticsStorageStatus.textContent = '';
  } else {
    statisticsStorageStatus.textContent = 'No se pudieron guardar las estadísticas en este navegador.';
  }
}

function finishRunStatistics() {
  if (runStartedAt === null || runDifficulty === null) return;
  const record = gameStatistics[runDifficulty];
  record.gamesPlayed++;
  record.bestScore = Math.max(record.bestScore, score);
  record.bestSurvivalMs = Math.max(record.bestSurvivalMs, gameTime - runStartedAt);
  record.guardiansDefeated += runGuardiansDefeated;
  saveGameStatistics();
  runStartedAt = null;
  runDifficulty = null;
  runGuardiansDefeated = 0;
}

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
  if (statisticsWasRunning && !statisticsWasPaused && isGameRunning && isPaused) {
    togglePause();
  } else if (statisticsWasRunning && statisticsWasPaused && isGameRunning && isPaused) {
    drawerMenu.classList.remove('hidden');
  }
  drawerMenu.classList.toggle(
    'hidden',
    !(statisticsWasRunning && statisticsWasPaused) && !statisticsDrawerWasVisible
  );
  statisticsWasRunning = false;
  statisticsWasPaused = false;
  statisticsDrawerWasVisible = false;
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
  respawnBadge.classList.add('hidden');
  previousSnakePositions = snake.map(segment => ({ ...segment }));
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
  sacrificeOfferingBadge.classList.add('hidden');
  skullFoodBadge.classList.add('hidden');
  sacredRainUntil = 0;
  nextSacredRainAt = SACRED_RAIN_FIRST_MS;
  maizeSpawnRetryAt = null;
  nextCosmicOrderSpawnAt = COSMIC_ORDER_FIRST_SPAWN_MS;
  cosmicOrderResolveAt = null;
  cosmicOrderFlashStartedAt = null;
  nextSacrificeSpawnAt = SACRIFICE_FIRST_SPAWN_MS;
  nextSkullSpawnAt = SKULL_FIRST_SPAWN_MS;
  cosmicOrderFoodBadge.classList.add('hidden');
  cosmicOrderBadge.classList.add('hidden');
  rainBadge.classList.add('hidden');
  particles = [];
  floatingTexts = [];
  screenShake = 0;
  headPulse = 0;
  headPulseColor = '#d5bd70';
  clearFireBreath();
  enemySpawnAt = null;
  jadeSpawnAt = null;
  freezeSpawnAt = FREEZE_FIRST_SPAWN_MS;
  guardiansFrozenUntil = 0;
  freezeBadge.classList.add('hidden');
  enemyGuardians = [];
  hasSpawnedGuardian = false;
  updateGuardianBadge();

  isTurbo = false;
  turboRemaining = 0;
  turboCooldown = 0;
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
  const centerX = Math.floor(gridCols / 2);
  const centerY = Math.floor(gridRows / 2);
  for (let offset = 0; offset < gridCols * gridRows; offset++) {
    const x = (centerX + offset % gridCols) % gridCols;
    const y = (centerY + Math.floor(offset / gridCols)) % gridRows;
    const segments = [0, 1, 2].map(distance => ({
      x: (x - distance + gridCols) % gridCols,
      y
    }));
    const overlapsGuardian = segments.some(position =>
      enemyGuardians.some(guardian =>
        guardian.segments.some(segment =>
          segment.x === position.x && segment.y === position.y
        )
      )
    );
    if (!overlapsGuardian) return { x, y };
  }
  return null;
}

function loseLife(reason) {
  lives = Math.max(0, lives - 1);
  updateLivesUI();

  if (lives === 0) {
    gameOver(`${reason} Se agotaron los tres sacrificios.`);
    return;
  }

  const previousHead = snake[0];
  const spawn = findRespawnPosition();
  if (!spawn) {
    gameOver('Los guardianes han cerrado todos los caminos. La travesía termina.');
    return;
  }

  snake = [
    { x: spawn.x, y: spawn.y },
    { x: (spawn.x - 1 + gridCols) % gridCols, y: spawn.y },
    { x: (spawn.x - 2 + gridCols) % gridCols, y: spawn.y }
  ];
  direction = { x: 1, y: 0 };
  directionQueue = [];
  previousSnakePositions = snake.map(segment => ({ ...segment }));
  deactivateImmunity();
  isTurbo = false;
  turboRemaining = 0;
  turboCooldown = 0;
  turboReadyAt = 0;
  turboCooldownUntil = 0;
  updateTurboUI();
  respawnProtectedUntil = gameTime + RESPAWN_PROTECTION_MS;
  respawnTimerSpan.textContent = String(Math.ceil(RESPAWN_PROTECTION_MS / 1000));
  respawnBadge.classList.remove('hidden');
  screenShake = 8;
  triggerHeadPulse('#69d3b4');
  if (previousHead) {
    spawnFloatingText(
      '🫀 Sacrificio perdido',
      previousHead.x * TILE_SIZE + TILE_SIZE / 2,
      previousHead.y * TILE_SIZE,
      '#f87171'
    );
  }
  updateScoresUI();
  if (sacrificeFoods.length === 0) {
    nextSacrificeSpawnAt = gameTime + SACRIFICE_RESPAWN_DELAY_MS;
  }
}

function ensureFoodCount(count = 6) {
  let attempts = 0;
  while (foods.length < count && attempts < gridCols * gridRows) {
    attempts++;
    const rx = Math.floor(Math.random() * gridCols);
    const ry = Math.floor(Math.random() * gridRows);
    const occupied = snake.some(s => s.x === rx && s.y === ry) ||
                     foods.some(f => f.x === rx && f.y === ry) ||
                     shieldFoods.some(food => food.x === rx && food.y === ry) ||
                     freezeFoods.some(food => food.x === rx && food.y === ry) ||
                     cosmicOrderFoods.some(food => food.x === rx && food.y === ry) ||
                     sacrificeFoods.some(food => food.x === rx && food.y === ry) ||
                                    skullFoods.some(food => food.x === rx && food.y === ry) ||
                                    bonusFoods.some(food => food.x === rx && food.y === ry) ||
                     enemyGuardians.some(guardian =>
                       guardian.segments.some(segment => segment.x === rx && segment.y === ry)
                     );
    if (!occupied) {
      foods.push({
        x: rx,
        y: ry,
        shape: Math.floor(Math.random() * 6),
        offering: 'common'
      });
    }
  }

  if (sacredRainUntil > gameTime) ensureMaizeOffering();
}

function ensureMaizeOffering() {
  let maizeCount = foods.filter(food => food.offering === 'maize').length;
  if (maizeCount >= SACRED_RAIN_MAIZE_COUNT) {
    maizeSpawnRetryAt = null;
    return true;
  }

  while (maizeCount < SACRED_RAIN_MAIZE_COUNT) {
    const start = Math.floor(Math.random() * gridCols * gridRows);
    const totalCells = gridCols * gridRows;
    let spawned = false;
    for (let offset = 0; offset < totalCells; offset++) {
      const cell = (start + offset) % totalCells;
      const x = cell % gridCols;
      const y = Math.floor(cell / gridCols);
      if (isGuardianCellOccupied(x, y)) continue;
      foods.push({
        x,
        y,
        shape: 2,
        offering: 'maize',
        landingAt: gameTime + MAIZE_FALL_DURATION_MS,
        meteorOffsetX: (Math.random() - 0.5) * TILE_SIZE * 4
      });
      maizeCount++;
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

function spawnWorldCrossingEffect(x, y) {
  triggerHeadPulse('#8be7ff');
  const colors = ['#8be7ff', '#69d3b4', '#d5bd70'];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5;
    const speed = 0.7 + (i % 2) * 0.35;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2.2,
      color: colors[i % colors.length],
      alpha: 0.8,
      decay: 0.09
    });
  }
}

function gameUpdate() {
  if (isPaused || !isGameRunning || countdownEndsAt !== null) return;

  if (directionQueue.length > 0) {
    direction = directionQueue.shift();
  }

  const crossedWorld =
    (direction.x > 0 && snake[0].x === gridCols - 1) ||
    (direction.x < 0 && snake[0].x === 0) ||
    (direction.y > 0 && snake[0].y === gridRows - 1) ||
    (direction.y < 0 && snake[0].y === 0);
  let newX = (snake[0].x + direction.x + gridCols) % gridCols;
  let newY = (snake[0].y + direction.y + gridRows) % gridRows;
  const head = { x: newX, y: newY };

  const willGrow = foods.some(food =>
    food.x === head.x && food.y === head.y &&
    (food.landingAt === undefined || gameTime >= food.landingAt)
  ) ||
    bonusFoods.some(food => food.x === head.x && food.y === head.y) ||
    shieldFoods.some(food => food.x === head.x && food.y === head.y) ||
    freezeFoods.some(food => food.x === head.x && food.y === head.y) ||
    cosmicOrderFoods.some(food => food.x === head.x && food.y === head.y) ||
    sacrificeFoods.some(food => food.x === head.x && food.y === head.y);
  const bodyToCheck = willGrow ? snake : snake.slice(0, -1);
  if (bodyToCheck.some(segment => segment.x === head.x && segment.y === head.y)) {
    loseLife('Kukulcán se enredó con su propio cuerpo.');
    return;
  }

  const skullIdx = skullFoods.findIndex(food => food.x === head.x && food.y === head.y);
  if (skullIdx !== -1) {
    skullFoods.splice(skullIdx, 1);
    nextSkullMoveAt = null;
    skullFoodBadge.classList.add('hidden');
    nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
    screenShake = 8;
    loseLife('¡La Calavera maldita te arrebató un sacrificio!');
    return;
  }

  const hitGuardian = enemyGuardians.find(guardian =>
    guardian.segments.some(segment => segment.x === head.x && segment.y === head.y)
  );
  if (hitGuardian) {
    if (hasGuardianProtection() || guardiansFrozenUntil > gameTime) {
      const shieldProtected = isImmune;
      const guardianFrozen = guardiansFrozenUntil > gameTime;
      const protectionColor = shieldProtected ? '#facc15' : guardianFrozen ? '#8be7ff' : '#69d3b4';
      const protectionSymbol = shieldProtected ? '🛡️' : guardianFrozen ? '❄️' : '🪶';
      screenShake = 10;
      triggerHeadPulse(protectionColor);
      playEnemyDefeatedSound();
      runGuardiansDefeated++;
      score += 100;
      spawnFloatingText(
        `+100 ${protectionSymbol} ¡GUARDIÁN VENCIDO!`,
        head.x * TILE_SIZE + TILE_SIZE / 2,
        head.y * TILE_SIZE,
        protectionColor
      );
      updateScoresUI();
      destroyEnemySnake(hitGuardian.id);
    } else {
      screenShake = 8;
      loseLife(getGuardianDeathMessage(hitGuardian));
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
    triggerHeadPulse('#69d3b4');
    spawnFloatingText('🛡️ ¡Jade +25!', hx, hy, '#69d3b4');
    playEatSound('shield');
    activateImmunity(10);
    startFireBreath();
    updateScoresUI();
    jadeSpawnAt = gameTime + (JADE_RESPAWN_DELAY_MS[difficultySelect.value] || JADE_RESPAWN_DELAY_MS.medium);
  } else {
    const freezeIdx = freezeFoods.findIndex(food => food.x === head.x && food.y === head.y);

    if (freezeIdx !== -1) {
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      freezeFoods.splice(freezeIdx, 1);
      score += 25;
      triggerHeadPulse('#8be7ff');
      spawnFloatingText('❄️ ¡Esencia helada +25!', hx, hy, '#8be7ff');
      playEatSound('freeze');
      activateGuardianFreeze();
      freezeSpawnAt = gameTime + FREEZE_RESPAWN_DELAY_MS;
      updateScoresUI();
    } else {
      const sacrificeIdx = sacrificeFoods.findIndex(food => food.x === head.x && food.y === head.y);
      if (sacrificeIdx !== -1) {
        const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
        const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
        sacrificeFoods.splice(sacrificeIdx, 1);
        sacrificeOfferingBadge.classList.add('hidden');
        const previousLives = lives;
        lives = Math.min(MAX_LIVES, lives + 1);
        updateLivesUI();
        triggerHeadPulse('#f3d7bd');
        spawnFloatingText(
          `🫀 +${lives - previousLives} Sacrificio`,
          hx,
          hy,
          '#f3d7bd'
        );
        playEatSound('sacrifice');
        nextSacrificeSpawnAt = lives < MAX_LIVES
          ? gameTime + SACRIFICE_REPEAT_DELAY_MS
          : null;
      } else {
        const cosmicOrderIdx = cosmicOrderFoods.findIndex(food => food.x === head.x && food.y === head.y);
        const bonusIdx = bonusFoods.findIndex(b => b.x === head.x && b.y === head.y);
        const foodIdx = foods.findIndex(f =>
          f.x === head.x && f.y === head.y &&
          (f.landingAt === undefined || gameTime >= f.landingAt)
        );

        if (cosmicOrderIdx !== -1) {
          const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
          const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
          cosmicOrderFoods.splice(cosmicOrderIdx, 1);
          cosmicOrderFoodBadge.classList.add('hidden');
          cosmicOrderResolveAt = gameTime + COSMIC_ORDER_WARNING_MS;
          enemyGuardians.forEach(guardian => {
            guardian.cosmicOrderHitAt = gameTime;
          });
          cosmicOrderTimerSpan.textContent = String(COSMIC_ORDER_WARNING_MS / 1000);
          cosmicOrderBadge.classList.remove('hidden');
          enemySpawnAt = null;
          triggerHeadPulse('#d5bd70');
          spawnFloatingText('🌀 ¡Sello del orden!', hx, hy, '#d5bd70');
          playEatSound('bonus');
        } else if (bonusIdx !== -1) {
          const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
          const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
          bonusFoods.splice(bonusIdx, 1);
          score += 50;
          triggerHeadPulse('#facc15');
          spawnFloatingText('+50', hx, hy, '#facc15');
          playEatSound('bonus');
          updateScoresUI();
        } else if (foodIdx !== -1) {
          const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
          const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
          const [food] = foods.splice(foodIdx, 1);
          const maizeBonus = food.offering === 'maize' && sacredRainUntil > gameTime
            ? MAIZE_RAIN_BONUS
            : 0;
          const foodScore = 10 + maizeBonus;
          score += foodScore;
          triggerHeadPulse(maizeBonus ? '#facc15' : '#d5bd70');
          spawnFloatingText(
            maizeBonus ? `+${foodScore} 🌽🌧️` : `+${foodScore}`,
            hx,
            hy,
            maizeBonus ? '#facc15' : '#d5bd70'
          );
          playEatSound('normal');
          ensureFoodCount(6);
          updateScoresUI();
        } else {
          snake.pop();
        }
      }
    }
  }

  if (crossedWorld) {
    const headX = head.x * TILE_SIZE + TILE_SIZE / 2;
    const headY = head.y * TILE_SIZE + TILE_SIZE / 2;
    spawnWorldCrossingEffect(headX, headY);
  }

  if (isTurbo && snake.length > 0) {
    const tail = snake[snake.length - 1];
    spawnTurboTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  }

  updateEnemySnakeAI();
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
    safeSetItem('snakeIoHighScore', highScore);
  }
}

function updateLivesUI() {
  lifePips.forEach((pip, index) => {
    pip.classList.toggle('spent', index >= lives);
  });
  livesBadge.setAttribute('aria-label', `Sacrificios: ${lives} de ${MAX_LIVES}`);
}

// ========================================================
// RENDERIZADO EN EL CANVAS
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

function snapshotRenderPositions() {
  previousSnakePositions = snake.map(segment => ({ ...segment }));
  previousGuardianPositions = new Map(enemyGuardians.map(guardian => [
    guardian.id,
    guardian.segments.map(segment => ({ ...segment }))
  ]));
}

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
  else {
    ctx.fillStyle = '#141720';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  const pulse = Math.sin(gameTime * 0.006) * 1.5;

  foods.forEach((food, i) => {
    const targetX = food.x * TILE_SIZE + TILE_SIZE / 2;
    const landingAt = food.landingAt;
    const targetY = food.y * TILE_SIZE + TILE_SIZE / 2;
    let cx = targetX;
    let cy = targetY;
    if (landingAt !== undefined && gameTime < landingAt) {
      const progress = Math.max(
        0,
        Math.min(1, 1 - (landingAt - gameTime) / MAIZE_FALL_DURATION_MS)
      );
      const easedProgress = 1 - (1 - progress) ** 2;
      const meteorOffsetX = food.meteorOffsetX || 0;
      cx = targetX + meteorOffsetX * (1 - easedProgress);
      cy = -TILE_SIZE + (targetY + TILE_SIZE) * easedProgress;

      ctx.save();
      const tailX = cx + Math.sign(meteorOffsetX || 1) * TILE_SIZE * 0.75;
      const tailY = cy - TILE_SIZE * 1.35;
      const trail = ctx.createLinearGradient(tailX, tailY, cx, cy);
      trail.addColorStop(0, 'rgba(255, 102, 35, 0)');
      trail.addColorStop(0.65, 'rgba(255, 151, 55, 0.62)');
      trail.addColorStop(1, 'rgba(255, 240, 176, 0.96)');
      ctx.globalAlpha = 0.45 + Math.sin(gameTime * 0.04 + food.x) * 0.12;
      ctx.strokeStyle = trail;
      ctx.lineWidth = TILE_SIZE * 0.24;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ff8a35';
      ctx.shadowBlur = TILE_SIZE * 0.75;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = '#fff0b0';
      ctx.shadowColor = '#ffc04d';
      ctx.shadowBlur = TILE_SIZE * 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2, TILE_SIZE * 0.13), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
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

  freezeFoods.forEach(freezeFood => {
    const cx = freezeFood.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = freezeFood.y * TILE_SIZE + TILE_SIZE / 2;
    const radius = Math.max(4, TILE_SIZE / 2 - 3 + pulse * 0.3);
    ctx.save();
    ctx.fillStyle = '#4fc3f7';
    ctx.strokeStyle = '#d7f6ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx + radius * 0.8, cy - radius * 0.45);
    ctx.lineTo(cx + radius * 0.8, cy + radius * 0.45);
    ctx.lineTo(cx, cy + radius);
    ctx.lineTo(cx - radius * 0.8, cy + radius * 0.45);
    ctx.lineTo(cx - radius * 0.8, cy - radius * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#effbff';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.42, cy);
    ctx.lineTo(cx + radius * 0.42, cy);
    ctx.moveTo(cx, cy - radius * 0.42);
    ctx.lineTo(cx, cy + radius * 0.42);
    ctx.moveTo(cx - radius * 0.3, cy - radius * 0.3);
    ctx.lineTo(cx + radius * 0.3, cy + radius * 0.3);
    ctx.moveTo(cx + radius * 0.3, cy - radius * 0.3);
    ctx.lineTo(cx - radius * 0.3, cy + radius * 0.3);
    ctx.stroke();
    ctx.restore();
  });

  sacrificeFoods.forEach(offering => {
    const cx = offering.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = offering.y * TILE_SIZE + TILE_SIZE / 2;
    const pulse = Math.sin(gameTime * 0.008) * 0.8;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.shadowColor = '#ef3340';
    ctx.shadowBlur = 18 + pulse;
    ctx.fillStyle = '#ffd0b8';
    ctx.font = `${TILE_SIZE * 1.05 + pulse}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.rotate(Math.PI * 0.75);
    ctx.fillText('🗡️', 0, 0);
    ctx.restore();
  });

  skullFoods.forEach(skull => {
    const cx = skull.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = skull.y * TILE_SIZE + TILE_SIZE / 2;
    const pulse = Math.sin(gameTime * 0.008) * 1.2;
    const radius = TILE_SIZE * 0.44 + pulse;
    ctx.save();
    ctx.fillStyle = 'rgba(48, 19, 29, 0.94)';
    ctx.strokeStyle = '#ef5261';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ef3340';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = `${TILE_SIZE * 0.82}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☠️', cx, cy + 1);
    ctx.restore();
  });

  cosmicOrderFoods.forEach(orderFood => {
    const cx = orderFood.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = orderFood.y * TILE_SIZE + TILE_SIZE / 2;
    const radius = Math.max(6, TILE_SIZE / 2 - 2 + pulse * 0.2);
    const glow = 0.75 + (Math.sin(gameTime * 0.009) + 1) * 0.25;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(gameTime * 0.0007);
    ctx.globalAlpha = glow;
    ctx.fillStyle = 'rgba(22, 42, 48, 0.96)';
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#d5bd70';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#d5bd70';
    ctx.beginPath();
    for (let point = 0; point < 16; point++) {
      const angle = -Math.PI / 2 + point * Math.PI / 8;
      const pointRadius = radius * (point % 2 === 0 ? 1.28 : 1.04);
      const x = Math.cos(angle) * pointRadius;
      const y = Math.sin(angle) * pointRadius;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#16343b';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8be7ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.62, -Math.PI * 0.8, Math.PI * 0.8);
    ctx.stroke();

    ctx.fillStyle = '#fff0b0';
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.58);
    ctx.lineTo(radius * 0.2, 0);
    ctx.lineTo(0, radius * 0.58);
    ctx.lineTo(-radius * 0.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  enemyGuardians.forEach(guardian => {
    const hitAt = guardian.cosmicOrderHitAt;
    guardian.segments.forEach((seg, idx) => {
      const isHead = idx === 0;
      const wobbleX = hitAt === undefined
        ? 0
        : Math.sin((gameTime - hitAt) * 0.065 + idx * 1.2) * 2.5;
      const wobbleY = hitAt === undefined
        ? 0
        : Math.cos((gameTime - hitAt) * 0.065 + idx * 1.2) * 1.5;
      ctx.fillStyle = hitAt !== undefined && Math.floor((gameTime - hitAt) / 100) % 2 === 0
        ? '#f5e5ad'
        : isHead ? guardian.palette.head : guardian.palette.body;
      ctx.shadowColor = isHead ? guardian.palette.head : 'transparent';
      ctx.shadowBlur = isHead ? 12 : 0;
      const previousSegments = previousGuardianPositions.get(guardian.id);
      const renderSegment = interpolateGridPosition(
        seg,
        previousSegments?.[idx] || previousSegments?.[previousSegments.length - 1],
        interpolation
      );
      renderSegment.x += wobbleX / TILE_SIZE;
      renderSegment.y += wobbleY / TILE_SIZE;

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
        return;
      }

      drawFeatherCrest(renderSegment, guardian.direction, guardian.palette.crest);
      ctx.fillStyle = '#f7db92';
      const eyeOffset = 5;
      const eyeSize = 4;
      let e1x = renderSegment.x * TILE_SIZE + eyeOffset;
      let e1y = renderSegment.y * TILE_SIZE + eyeOffset;
      let e2x = renderSegment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      let e2y = e1y;

      if (guardian.direction.y !== 0) {
        e1y = renderSegment.y * TILE_SIZE + (guardian.direction.y > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        e2y = e1y;
      } else if (guardian.direction.x !== 0) {
        e1x = renderSegment.x * TILE_SIZE + (guardian.direction.x > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        e2x = e1x;
        e2y = renderSegment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      }

      ctx.fillRect(e1x, e1y, eyeSize, eyeSize);
      ctx.fillRect(e2x, e2y, eyeSize, eyeSize);

      const markX = renderSegment.x * TILE_SIZE + TILE_SIZE / 2;
      const markY = renderSegment.y * TILE_SIZE + TILE_SIZE / 2 + TILE_SIZE * 0.22;
      const markSize = Math.max(2.5, TILE_SIZE * 0.16);
      ctx.fillStyle = guardian.palette.crest;
      ctx.strokeStyle = 'rgba(34, 24, 20, 0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (guardian.behavior.id === 'hunter') {
        ctx.rect(markX - markSize / 2, markY - markSize / 2, markSize, markSize);
      } else if (guardian.behavior.id === 'interceptor') {
        ctx.moveTo(markX, markY - markSize * 0.65);
        ctx.lineTo(markX + markSize * 0.65, markY + markSize * 0.5);
        ctx.lineTo(markX - markSize * 0.65, markY + markSize * 0.5);
        ctx.closePath();
      } else {
        ctx.moveTo(markX, markY - markSize * 0.7);
        ctx.lineTo(markX + markSize * 0.55, markY);
        ctx.lineTo(markX, markY + markSize * 0.7);
        ctx.lineTo(markX - markSize * 0.55, markY);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();
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
      ctx.moveTo(cx - mark, cy);
      ctx.lineTo(cx + mark, cy);
      ctx.moveTo(cx, cy - mark);
      ctx.lineTo(cx, cy + mark);
      ctx.moveTo(cx - mark * 0.7, cy - mark * 0.7);
      ctx.lineTo(cx + mark * 0.7, cy + mark * 0.7);
      ctx.moveTo(cx + mark * 0.7, cy - mark * 0.7);
      ctx.lineTo(cx - mark * 0.7, cy + mark * 0.7);
      ctx.stroke();
      ctx.restore();
    }
  });

  if (updateEffects) blinkCounter++;
  const isBlinking = (blinkCounter % 90) > 85;
  const isPlayerProtected = hasGuardianProtection();

  snake.forEach((segment, index) => {
    const isHead = index === 0;
    const renderSegment = interpolateGridPosition(
      segment,
      previousSnakePositions[index] || previousSnakePositions[previousSnakePositions.length - 1],
      interpolation
    );

    if (isPlayerProtected) {
      ctx.fillStyle = isHead ? '#62d8bd' : '#168c75';
      ctx.shadowColor = '#62d8bd';
      ctx.shadowBlur = isHead ? 18 : 0;
    } else {
      ctx.fillStyle = isHead ? '#54c98f' : '#187a5c';
      if (isHead) {
        ctx.shadowColor = '#54c98f';
        ctx.shadowBlur = 10;
      }
    }

    if (isHead && headPulse > 0) {
      ctx.shadowColor = headPulseColor;
      ctx.shadowBlur = 18 + headPulse * 25;
    }

    roundRect(
      ctx,
      renderSegment.x * TILE_SIZE + 1,
      renderSegment.y * TILE_SIZE + 1,
      TILE_SIZE - 2,
      TILE_SIZE - 2,
      isHead ? 8 : 5
    );
    ctx.fill();

    if (isHead && headPulse > 0) {
      ctx.beginPath();
      ctx.arc(
        renderSegment.x * TILE_SIZE + TILE_SIZE / 2,
        renderSegment.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2 + 3 + headPulse * 8,
        0,
        Math.PI * 2
      );
      ctx.lineWidth = 1.5 + headPulse * 2;
      ctx.strokeStyle = headPulseColor;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    if (!isHead) {
      drawFeatherScale(renderSegment, index, isPlayerProtected ? '#b6f2d1' : '#d5bd70');
    } else {
      drawFeatherCrest(renderSegment, direction, isPlayerProtected ? '#e0fff2' : '#d5bd70');
    }

    if (isHead && !isBlinking) {
      ctx.fillStyle = '#141720';
      const eyeOffset = 5;
      const eyeSize = 3.5;
      let eye1X = renderSegment.x * TILE_SIZE + eyeOffset;
      let eye1Y = renderSegment.y * TILE_SIZE + eyeOffset;
      let eye2X = renderSegment.x * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      let eye2Y = eye1Y;

      if (direction.y !== 0) {
        eye1Y = renderSegment.y * TILE_SIZE + (direction.y > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        eye2Y = eye1Y;
      } else if (direction.x !== 0) {
        eye1X = renderSegment.x * TILE_SIZE + (direction.x > 0 ? TILE_SIZE - eyeOffset - eyeSize : eyeOffset);
        eye2X = eye1X;
        eye2Y = renderSegment.y * TILE_SIZE + TILE_SIZE - eyeOffset - eyeSize;
      }

      ctx.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
      ctx.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
    }
  });

  drawFireBreath();
  updateAndDrawParticles(updateEffects);
  if (cosmicOrderFlashStartedAt !== null) {
    const elapsed = gameTime - cosmicOrderFlashStartedAt;
    if (elapsed >= 0 && elapsed < COSMIC_ORDER_FLASH_DURATION_MS) {
      const progress = elapsed / COSMIC_ORDER_FLASH_DURATION_MS;
      const pulseCount = 3;
      const flash = Math.max(0, Math.sin(progress * Math.PI * pulseCount));
      ctx.save();
      ctx.globalAlpha = flash * (1 - progress * 0.35) * 0.38;
      ctx.fillStyle = Math.floor(progress * pulseCount) % 2 === 0 ? '#fff0b0' : '#8be7ff';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawFoodOffering(food, cx, cy, pulse) {
  const shape = food.shape ?? 0;
  const colors = [
    { fill: '#4fcea2', highlight: '#b0f4d8' },
    { fill: '#ee8054', highlight: '#ffd0a0' },
    { fill: '#e8c768', highlight: '#fff0b0' },
    { fill: '#bc7351', highlight: '#f5c18e' },
    { fill: '#9b86d4', highlight: '#ddd0ff' },
    { fill: '#e788a6', highlight: '#ffd6e3' }
  ];
  const isMaize = food.offering === 'maize';
  const color = isMaize
    ? { fill: '#e8c768', highlight: '#fff0b0' }
    : colors[shape % colors.length];
  const radius = Math.max(4, TILE_SIZE / 2 - 3 + pulse * 0.3);

  ctx.save();
  ctx.fillStyle = color.fill;
  ctx.strokeStyle = color.highlight;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
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
  if (isMaize) {
    ctx.translate(cx, cy);
    ctx.rotate(-0.22);
    ctx.fillStyle = '#4fcea2';
    ctx.strokeStyle = '#b0f4d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.12, radius * 0.34);
    ctx.quadraticCurveTo(-radius * 0.72, -radius * 0.1, -radius * 0.38, -radius * 0.72);
    ctx.quadraticCurveTo(-radius * 0.18, -radius * 0.14, -radius * 0.12, radius * 0.34);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(radius * 0.12, radius * 0.34);
    ctx.quadraticCurveTo(radius * 0.72, -radius * 0.1, radius * 0.38, -radius * 0.72);
    ctx.quadraticCurveTo(radius * 0.18, -radius * 0.14, radius * 0.12, radius * 0.34);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f2c230';
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.34, radius * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#a87916';
    for (let row = -2; row <= 2; row++) {
      ctx.beginPath();
      ctx.arc(-radius * 0.12, row * radius * 0.24, 0.8, 0, Math.PI * 2);
      ctx.arc(radius * 0.12, row * radius * 0.24, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function startFireBreath() {
  fireBreath = { startedAt: gameTime };
}

function drawFireBreath() {
  if (!fireBreath || !isImmune || snake.length === 0) return;

  const cycleProgress = (gameTime - fireBreath.startedAt) % FIRE_BREATH_CYCLE_MS;
  if (cycleProgress >= FIRE_BREATH_ACTIVE_MS) return;

  const progress = cycleProgress / FIRE_BREATH_ACTIVE_MS;
  const fade = Math.sin(progress * Math.PI);
  const head = snake[0];
  const flameX = head.x * TILE_SIZE + TILE_SIZE / 2 + direction.x * TILE_SIZE * 0.4;
  const flameY = head.y * TILE_SIZE + TILE_SIZE / 2 + direction.y * TILE_SIZE * 0.4;
  const angle = Math.atan2(direction.y, direction.x);
  const flicker = Math.sin(gameTime * 0.045);

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
  const baseSpeed = SPEEDS[sel] || SPEEDS.medium;
  const lengthPenalty = Math.max(0, snake.length - 3) * 2.4;
  const adaptiveSpeed = Math.max(baseSpeed * 0.72, baseSpeed - lengthPenalty);
  return isTurbo ? adaptiveSpeed * 0.58 : adaptiveSpeed;
}

// Iniciar o reiniciar juego
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

// Alternar pausa
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
  turboRemaining = 0;
  turboCooldown = 0;
  turboReadyAt = 0;
  turboCooldownUntil = 0;
  updateTurboUI();
  enemySpawnAt = null;
  jadeSpawnAt = null;
  freezeSpawnAt = null;
  guardiansFrozenUntil = 0;
  freezeFoods = [];
  freezeBadge.classList.add('hidden');
  sacredRainUntil = 0;
  nextSacredRainAt = null;
  rainBadge.classList.add('hidden');
  nextCosmicOrderSpawnAt = null;
  cosmicOrderResolveAt = null;
  cosmicOrderFlashStartedAt = null;
  cosmicOrderFoods = [];
  sacrificeFoods = [];
  skullFoods = [];
  nextSkullMoveAt = null;
  nextSacrificeSpawnAt = null;
  nextSkullSpawnAt = null;
  sacrificeOfferingBadge.classList.add('hidden');
  skullFoodBadge.classList.add('hidden');
  cosmicOrderFoodBadge.classList.add('hidden');
  cosmicOrderBadge.classList.add('hidden');
  respawnProtectedUntil = 0;
  respawnBadge.classList.add('hidden');
  enemyGuardians = [];
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
  if (directionQueue.length >= 2) return;

  const currentDirection = directionQueue.length > 0
    ? directionQueue[directionQueue.length - 1]
    : direction;

  const isOpposite = (newDir.x !== 0 && newDir.x === -currentDirection.x) ||
                     (newDir.y !== 0 && newDir.y === -currentDirection.y);
  if (isOpposite) return;

  if (newDir.x === currentDirection.x && newDir.y === currentDirection.y) return;

  directionQueue.push({ ...newDir });
}

// ========================================================
// SISTEMA DE TUTORIAL PASO A PASO (ONBOARDING)
// ========================================================
let currentTutorialStep = 1;
const totalTutorialSteps = 4;
const tutorialTitles = [
  'La Travesía de Kukulcán',
  '🌽 Las ofrendas sagradas',
  '🛡️ Los guardianes',
  '🌀 Poderes y sacrificios'
];

function showTutorialStep(step) {
  currentTutorialStep = step;
  tutorialStepTitle.textContent = tutorialTitles[step - 1];

  for (let i = 1; i <= totalTutorialSteps; i++) {
    const el = document.getElementById(`step-${i}`);
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
  if (tutorialModal.parentElement !== welcomeCard) {
    welcomeCard.insertBefore(tutorialModal, welcomeStartBtn);
  }
  if (tutorialOpenedFromWelcome) {
    welcomeScreen.classList.remove('hidden');
    startWelcomeDemo();
  }
  welcomeStartBtn.classList.toggle(
    'hidden',
    welcomeScreen.classList.contains('hidden') || !tutorialModal.classList.contains('hidden')
  );
  tutorialWasRunning = false;
  tutorialWasPaused = false;
  tutorialDrawerWasVisible = false;
  tutorialOpenedFromWelcome = false;
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
  tutorialWasRunning = false;
  tutorialWasPaused = false;
  tutorialDrawerWasVisible = false;
  tutorialOpenedFromWelcome = false;
  tutorialModal.classList.add('hidden');
  startGame();
});
closeTutorialBtn.addEventListener('click', closeTutorial);
tutorialModal.addEventListener('click', (event) => {
  if (event.target === tutorialModal) closeTutorial();
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
  const target = e.target;
  if (target instanceof Element && target.closest('button, select, .modal-backdrop, .drawer-card')) return;
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
  if (e.key === 'Escape' && !tutorialModal.classList.contains('hidden')) {
    closeTutorial();
    return;
  }
  if (e.key === 'Escape' && !statisticsModal.classList.contains('hidden')) {
    closeStatistics();
    return;
  }

  if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
  const isTextControl = e.target instanceof Element && e.target.matches('select, input');
  const isMovementKey = e.key.startsWith('Arrow') || ['w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key);
  if (isTextControl && isMovementKey) return;

  if (!isTextControl && (e.key === 'Shift' || (e.key === ' ' && isGameRunning && !isPaused))) {
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
statisticsModal.addEventListener('click', (event) => {
  if (event.target === statisticsModal) closeStatistics();
});

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
  safeSetItem('snakeIoShowDpad', showDpad);
  touchControls.classList.toggle('hidden', !showDpad);
});

function resetWelcomeDemo() {
  welcomeDemoSnake = [
    { x: 4, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 4 }
  ];
  welcomeDemoPreviousSnake = welcomeDemoSnake.map(segment => ({ ...segment }));
  welcomeDemoGuardian = [
    { x: 18, y: 4 },
    { x: 19, y: 4 },
    { x: 20, y: 4 },
    { x: 21, y: 4 }
  ];
  welcomeDemoPreviousGuardian = welcomeDemoGuardian.map(segment => ({ ...segment }));
  welcomeDemoDirection = { x: 1, y: 0 };
  welcomeDemoRouteIndex = 0;
  welcomeDemoRouteSteps = 0;
  welcomeDemoTick = 0;
  welcomeDemoAccumulator = 0;
  welcomeDemoScore = 0;
  welcomeDemoMaize = { x: 8, y: 4 };
  welcomeDemoJade = { x: 14, y: 6 };
  welcomeDemoImmuneUntil = 0;
  welcomeDemoFlashUntil = 0;
  welcomeDemoGuardianDefeatedUntil = 0;
  welcomeDemoGameOverUntil = 0;
  welcomeDemoStatus = '¡Guía a Kukulcán con las flechas o WASD!';
  welcomeDemoCallout.textContent = welcomeDemoStatus;
}

function resizeWelcomeDemo() {
  const bounds = welcomeDemo.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.max(1, Math.round(bounds.width * pixelRatio));
  const pixelHeight = Math.max(1, Math.round(bounds.height * pixelRatio));
  if (welcomeDemo.width === pixelWidth && welcomeDemo.height === pixelHeight) return;
  welcomeDemo.width = pixelWidth;
  welcomeDemo.height = pixelHeight;
  welcomeDemoContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawWelcomeDemo(1);
}
window.addEventListener('resize', resizeWelcomeDemo);
new ResizeObserver(resizeWelcomeDemo).observe(welcomePreview);

function drawWelcomeCell(segment, index, options = {}) {
  const { x, y, size } = segment;
  const inset = Math.max(1, size * 0.07);
  const isHead = index === 0;
  const direction = options.direction || { x: 1, y: 0 };
  const colors = options.guardian
    ? ['#e2574c', '#9b2929']
    : options.immune ? ['#62d8bd', '#168c75'] : ['#54c98f', '#187a5c'];
  welcomeDemoContext.fillStyle = isHead ? colors[0] : colors[1];
  welcomeDemoContext.shadowColor = isHead ? colors[0] : 'transparent';
  welcomeDemoContext.shadowBlur = isHead ? size * 0.55 : 0;
  roundRect(
    welcomeDemoContext,
    x + inset,
    y + inset,
    size - inset * 2,
    size - inset * 2,
    isHead ? size * 0.32 : size * 0.2
  );
  welcomeDemoContext.fill();
  welcomeDemoContext.shadowBlur = 0;

  if (!isHead) {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    welcomeDemoContext.strokeStyle = options.guardian ? '#ff9b83' : '#d5bd70';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.08);
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(centerX - size * 0.18, centerY - size * 0.16);
    welcomeDemoContext.lineTo(centerX, centerY + size * 0.16);
    welcomeDemoContext.lineTo(centerX + size * 0.18, centerY - size * 0.16);
    welcomeDemoContext.stroke();
    return;
  }

  welcomeDemoContext.fillStyle = options.guardian ? '#fff0c6' : '#141720';
  const eyeSize = Math.max(1.5, size * 0.16);
  const eyePositions = direction.x > 0
    ? [[0.65, 0.28], [0.65, 0.58]]
    : direction.x < 0
      ? [[0.19, 0.28], [0.19, 0.58]]
      : direction.y < 0
        ? [[0.28, 0.19], [0.58, 0.19]]
        : [[0.28, 0.65], [0.58, 0.65]];
  eyePositions.forEach(([eyeX, eyeY]) => {
    welcomeDemoContext.fillRect(x + size * eyeX, y + size * eyeY, eyeSize, eyeSize);
  });
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
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * (jade ? 0.36 : 0.29);
  welcomeDemoContext.save();
  welcomeDemoContext.fillStyle = jade ? '#168c75' : '#e8c768';
  welcomeDemoContext.strokeStyle = jade ? '#72dfbd' : '#fff0b0';
  welcomeDemoContext.lineWidth = Math.max(1, size * 0.1);
  welcomeDemoContext.shadowColor = jade ? '#55c7a2' : '#e3ae43';
  welcomeDemoContext.shadowBlur = size * 0.6;
  welcomeDemoContext.beginPath();
  if (jade) {
    welcomeDemoContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
    welcomeDemoContext.fill();
    welcomeDemoContext.beginPath();
    welcomeDemoContext.arc(centerX, centerY, radius + size * 0.13, 0, Math.PI * 2);
    welcomeDemoContext.stroke();
    welcomeDemoContext.beginPath();
    welcomeDemoContext.moveTo(centerX, centerY - radius * 0.55);
    welcomeDemoContext.lineTo(centerX + radius * 0.55, centerY);
    welcomeDemoContext.lineTo(centerX, centerY + radius * 0.55);
    welcomeDemoContext.lineTo(centerX - radius * 0.55, centerY);
    welcomeDemoContext.closePath();
    welcomeDemoContext.stroke();
  } else {
    welcomeDemoContext.beginPath();
    for (let pointIndex = 0; pointIndex < 6; pointIndex++) {
      const angle = -Math.PI / 2 + pointIndex * Math.PI / 3;
      const px = centerX + Math.cos(angle) * radius;
      const py = centerY + Math.sin(angle) * radius;
      if (pointIndex === 0) welcomeDemoContext.moveTo(px, py);
      else welcomeDemoContext.lineTo(px, py);
    }
    welcomeDemoContext.closePath();
    welcomeDemoContext.fill();
    welcomeDemoContext.stroke();
  }
  welcomeDemoContext.restore();
}

function setWelcomeDemoStatus(message) {
  welcomeDemoStatus = message;
  welcomeDemoCallout.textContent = message;
}

function moveWelcomeDemoGuardian() {
  if (welcomeDemoImmuneUntil <= welcomeDemoTick) return;
  if (welcomeDemoGuardianDefeatedUntil > welcomeDemoTick) return;
  if (welcomeDemoGuardianDefeatedUntil) {
    welcomeDemoGuardian = [
      { x: 18, y: 4 },
      { x: 19, y: 4 },
      { x: 20, y: 4 },
      { x: 21, y: 4 }
    ];
    welcomeDemoPreviousGuardian = welcomeDemoGuardian.map(segment => ({ ...segment }));
    welcomeDemoGuardianDefeatedUntil = 0;
  }

  const enemyHead = welcomeDemoGuardian[0];
  const playerHead = welcomeDemoSnake[0];
  const dx = playerHead.x - enemyHead.x;
  const dy = playerHead.y - enemyHead.y;
  const candidates = Math.abs(dx) >= Math.abs(dy)
    ? [{ x: Math.sign(dx), y: 0 }, { x: 0, y: Math.sign(dy) }]
    : [{ x: 0, y: Math.sign(dy) }, { x: Math.sign(dx), y: 0 }];
  candidates.push(
    { x: -candidates[0].x, y: -candidates[0].y },
    { x: -candidates[1].x, y: -candidates[1].y }
  );

  const nextDirection = candidates.find(candidate => {
    if (!candidate.x && !candidate.y) return false;
    const x = enemyHead.x + candidate.x;
    const y = enemyHead.y + candidate.y;
    if (x < 1 || x >= WELCOME_DEMO_COLS - 1 || y < 1 || y >= WELCOME_DEMO_ROWS - 1) return false;
    return !welcomeDemoGuardian.slice(1, -1).some(segment => segment.x === x && segment.y === y);
  });
  if (!nextDirection) return;

  const newHead = { x: enemyHead.x + nextDirection.x, y: enemyHead.y + nextDirection.y };
  const touchesPlayer = welcomeDemoSnake.some(segment =>
    segment.x === newHead.x && segment.y === newHead.y
  );
  if (touchesPlayer) {
    if (welcomeDemoImmuneUntil > welcomeDemoTick) {
      welcomeDemoGuardian = [];
      welcomeDemoGuardianDefeatedUntil = welcomeDemoTick + 7;
      setWelcomeDemoStatus('¡El jade repelió al guardián!');
    } else {
      endWelcomeDemoRun();
    }
    return;
  }
  welcomeDemoGuardian.unshift(newHead);
  welcomeDemoGuardian.pop();
}

function endWelcomeDemoRun() {
  welcomeDemoGuardian = [];
  welcomeDemoGameOverUntil = welcomeDemoTick + 7;
  setWelcomeDemoStatus('¡El guardián te alcanzó! Sin jade, termina la partida.');
}

function advanceWelcomeDemo() {
  if (welcomeDemoGameOverUntil) {
    welcomeDemoTick++;
    if (welcomeDemoTick >= welcomeDemoGameOverUntil) resetWelcomeDemo();
    return;
  }

  if (welcomeDemoRouteIndex === WELCOME_DEMO_ROUTE.length) {
    welcomeDemoTick++;
    if (welcomeDemoTick >= welcomeDemoGuardianDefeatedUntil) resetWelcomeDemo();
    return;
  }

  welcomeDemoPreviousSnake = welcomeDemoSnake.map(segment => ({ ...segment }));
  welcomeDemoPreviousGuardian = welcomeDemoGuardian.map(segment => ({ ...segment }));
  const route = WELCOME_DEMO_ROUTE[welcomeDemoRouteIndex];
  welcomeDemoDirection = route.direction;
  const newHead = {
    x: welcomeDemoSnake[0].x + route.direction.x,
    y: welcomeDemoSnake[0].y + route.direction.y
  };

  const guardianCollision = welcomeDemoGuardian.some(segment =>
    segment.x === newHead.x && segment.y === newHead.y
  );
  if (guardianCollision) {
    if (welcomeDemoImmuneUntil > welcomeDemoTick) {
      welcomeDemoGuardian = [];
      welcomeDemoGuardianDefeatedUntil = welcomeDemoTick + 7;
      setWelcomeDemoStatus('¡Con el jade activo, embiste y vence al guardián!');
    } else {
      endWelcomeDemoRun();
      return;
    }
  }

  welcomeDemoSnake.unshift(newHead);

  let grows = false;
  if (welcomeDemoMaize && newHead.x === welcomeDemoMaize.x && newHead.y === welcomeDemoMaize.y) {
    welcomeDemoMaize = null;
    welcomeDemoScore += 10;
    welcomeDemoFlashUntil = welcomeDemoTick + 3;
    grows = true;
    setWelcomeDemoStatus('¡+10 puntos! Al comer, la serpiente crece.');
  } else if (welcomeDemoJade && newHead.x === welcomeDemoJade.x && newHead.y === welcomeDemoJade.y) {
    welcomeDemoJade = null;
    welcomeDemoImmuneUntil = welcomeDemoTick + 12;
    grows = true;
    setWelcomeDemoStatus('¡Jade recogido! El escudo repele al guardián.');
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

  const demoCtx = welcomeDemoContext;
  demoCtx.clearRect(0, 0, width, height);
  demoCtx.fillStyle = '#141720';
  demoCtx.fillRect(0, 0, width, height);
  const cellSize = Math.min(width / (WELCOME_DEMO_COLS + 2), (height - 32) / (WELCOME_DEMO_ROWS + 1));
  const boardWidth = cellSize * WELCOME_DEMO_COLS;
  const boardHeight = cellSize * WELCOME_DEMO_ROWS;
  const boardX = (width - boardWidth) / 2;
  const boardY = 29 + Math.max(0, (height - 32 - boardHeight) / 2);

  demoCtx.fillStyle = 'rgba(20, 23, 32, 0.9)';
  roundRect(demoCtx, 8, 6, Math.min(112, width * 0.38), 19, 8);
  demoCtx.fill();
  demoCtx.fillStyle = '#b8c6b4';
  demoCtx.font = '700 8px sans-serif';
  demoCtx.textBaseline = 'middle';
  demoCtx.fillText('PUNTOS', 16, 15.5);
  demoCtx.fillStyle = '#f1cb71';
  demoCtx.font = '800 10px sans-serif';
  demoCtx.fillText(String(welcomeDemoScore), 56, 15.5);
  demoCtx.fillStyle = '#9ba7a0';
  demoCtx.font = '700 8px sans-serif';
  demoCtx.fillText(`LONG. ${welcomeDemoSnake.length}`, 78, 15.5);

  if (welcomeDemoGuardian.length) {
    const threatWidth = Math.min(105, width * 0.34);
    demoCtx.fillStyle = 'rgba(116, 31, 36, 0.9)';
    roundRect(demoCtx, width - threatWidth - 8, 6, threatWidth, 19, 8);
    demoCtx.fill();
    demoCtx.fillStyle = '#ffe1d8';
    demoCtx.font = '700 8px sans-serif';
    demoCtx.textAlign = 'center';
    demoCtx.fillText('◆ GUARDIÁN', width - threatWidth / 2 - 8, 15.5);
    demoCtx.textAlign = 'start';
  }

  demoCtx.strokeStyle = 'rgba(144, 153, 177, 0.17)';
  demoCtx.lineWidth = 1;
  for (let col = 0; col <= WELCOME_DEMO_COLS; col++) {
    const x = boardX + col * cellSize;
    demoCtx.beginPath();
    demoCtx.moveTo(x, boardY);
    demoCtx.lineTo(x, boardY + boardHeight);
    demoCtx.stroke();
  }
  for (let row = 0; row <= WELCOME_DEMO_ROWS; row++) {
    const y = boardY + row * cellSize;
    demoCtx.beginPath();
    demoCtx.moveTo(boardX, y);
    demoCtx.lineTo(boardX + boardWidth, y);
    demoCtx.stroke();
  }

  const drawSegments = (current, previous, options = {}) => {
    current.forEach((segment, index) => {
      const oldSegment = previous[index] || previous[previous.length - 1] || segment;
      const x = oldSegment.x + (segment.x - oldSegment.x) * interpolation;
      const y = oldSegment.y + (segment.y - oldSegment.y) * interpolation;
      const nextSegment = current[index + 1] || current[index - 1] || segment;
      const direction = index === 0
        ? options.direction
        : { x: segment.x - nextSegment.x, y: segment.y - nextSegment.y };
      drawWelcomeCell({
        x: boardX + x * cellSize,
        y: boardY + y * cellSize,
        size: cellSize
      }, index, { ...options, direction });
    });
  };

  if (welcomeDemoMaize) {
    drawWelcomeOffering(welcomeDemoMaize, boardX + welcomeDemoMaize.x * cellSize, boardY + welcomeDemoMaize.y * cellSize, cellSize);
  }
  if (welcomeDemoJade) {
    drawWelcomeOffering(welcomeDemoJade, boardX + welcomeDemoJade.x * cellSize, boardY + welcomeDemoJade.y * cellSize, cellSize, true);
  }
  if (welcomeDemoGuardian.length) {
    const guardianHead = welcomeDemoGuardian[0];
    const guardianNeck = welcomeDemoGuardian[1] || guardianHead;
    drawSegments(welcomeDemoGuardian, welcomeDemoPreviousGuardian, {
      guardian: true,
      direction: { x: guardianHead.x - guardianNeck.x, y: guardianHead.y - guardianNeck.y }
    });
  }

  const isImmune = welcomeDemoImmuneUntil > welcomeDemoTick;
  drawSegments(welcomeDemoSnake, welcomeDemoPreviousSnake, {
    immune: isImmune,
    direction: welcomeDemoDirection
  });
  if (isImmune && welcomeDemoSnake.length) {
    const head = welcomeDemoSnake[0];
    const centerX = boardX + (head.x + 0.5) * cellSize;
    const centerY = boardY + (head.y + 0.5) * cellSize;
    demoCtx.strokeStyle = 'rgba(105, 211, 180, 0.88)';
    demoCtx.lineWidth = 2;
    demoCtx.shadowColor = '#55c7a2';
    demoCtx.shadowBlur = 10;
    demoCtx.beginPath();
    demoCtx.arc(centerX, centerY, cellSize * 0.77, 0, Math.PI * 2);
    demoCtx.stroke();
    demoCtx.shadowBlur = 0;
  }
  if (welcomeDemoTick < welcomeDemoFlashUntil && welcomeDemoSnake.length) {
    const head = welcomeDemoSnake[0];
    demoCtx.save();
    demoCtx.fillStyle = '#ffe27a';
    demoCtx.font = `800 ${Math.max(9, cellSize * 0.55)}px sans-serif`;
    demoCtx.textAlign = 'center';
    demoCtx.shadowColor = '#e3ae43';
    demoCtx.shadowBlur = 8;
    demoCtx.fillText('+10', boardX + (head.x + 0.5) * cellSize, boardY + head.y * cellSize - 3);
    demoCtx.restore();
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
    while (welcomeDemoAccumulator >= WELCOME_DEMO_TICK_MS) {
      welcomeDemoAccumulator -= WELCOME_DEMO_TICK_MS;
      advanceWelcomeDemo();
      ticks++;
      if (ticks >= 3) {
        welcomeDemoAccumulator = 0;
        break;
      }
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

// Sincronizar selectores de dificultad
difficultySelect.addEventListener('change', () => {
  drawerDifficulty.value = difficultySelect.value;
  reconcileGuardianCount();
});
drawerDifficulty.addEventListener('change', () => {
  difficultySelect.value = drawerDifficulty.value;
  reconcileGuardianCount();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && isGameRunning && !isPaused) togglePause();
});
window.addEventListener('blur', () => {
  if (isGameRunning && !isPaused) togglePause();
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
updateStatisticsUI();
showTutorialStep(1);
welcomeCard.insertBefore(tutorialModal, welcomeStartBtn);
tutorialModal.classList.remove('hidden');
welcomeStartBtn.classList.add('hidden');
resetWelcomeDemo();
startWelcomeDemo();
