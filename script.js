// ========================================================
// LA TRAVESÍA DE KUKULCÁN — script.js
// ========================================================

// ========================================================
// 0. PWA — REGISTRO DEL SERVICE WORKER
// ========================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('SW registrado:', reg.scope);
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('Nueva versión disponible. Recargando...');
                  window.location.reload();
                }
              }
            };
          }
        };
      })
      .catch(err => console.warn('SW no registrado:', err));
  });
}

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
const gameModeSelect = document.getElementById('game-mode-select');
const difficultySelectorBox = document.getElementById('difficulty-selector-box');

const welcomeScreen = document.getElementById('welcome-screen');
const welcomeStartBtn = document.getElementById('welcome-start-btn');
const welcomeInfoBtn = document.getElementById('welcome-info-btn');
const welcomeDemo = document.getElementById('welcome-demo');
const welcomeDemoCallout = document.getElementById('welcome-demo-callout');
const welcomeDemoContext = welcomeDemo.getContext('2d', { alpha: false });

const menuToggleBtn = document.getElementById('menu-toggle-btn');
const mbScore = document.getElementById('mb-score');
const mbHighScore = document.getElementById('mb-high-score');
const mbSoundBtn = document.getElementById('mb-sound-btn');
const mbPauseBtn = document.getElementById('mb-pause-btn');
const mbTutorialBtn = document.getElementById('mb-tutorial-btn');

// === Indicador de vidas ===
const livesFixedContainer = document.getElementById('lives-fixed-container');
const livesFixedPips = document.getElementById('lives-fixed-pips');
const livesFixedPipEls = livesFixedPips ? livesFixedPips.querySelectorAll('.life-pip') : [];
const livesMobilePips = document.getElementById('lives-mobile-pips');
const livesMobilePipEls = livesMobilePips ? livesMobilePips.querySelectorAll('.life-pip') : [];

const drawerMenu = document.getElementById('drawer-menu');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const drawerScore = document.getElementById('drawer-score');
const drawerHighScore = document.getElementById('drawer-high-score');
const drawerDifficulty = document.getElementById('drawer-difficulty');
const drawerGameMode = document.getElementById('drawer-game-mode');
const drawerDpadToggle = document.getElementById('drawer-dpad-toggle');
const drawerSoundToggle = document.getElementById('drawer-sound-toggle');
const drawerResumeBtn = document.getElementById('drawer-resume-btn');
const drawerRestartBtn = document.getElementById('drawer-restart-btn');
const drawerTutorialBtn = document.getElementById('drawer-tutorial-btn');
const drawerStatsBtn = document.getElementById('drawer-stats-btn');

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

// === NUEVO: badges de FURIA y AIRE ===
const furiaBadge = document.getElementById('furia-badge');
const furiaTimerSpan = document.getElementById('furia-timer');
const airBadge = document.getElementById('air-badge');
const airTimerSpan = document.getElementById('air-timer');

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

const introTutorialModal = document.getElementById('intro-tutorial-modal');
const closeIntroTutorialBtn = document.getElementById('close-intro-tutorial-btn');
const introTutStartBtn = document.getElementById('intro-tut-start-btn');

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
  const highOrder = ['furia', 'air', 'immunity', 'freeze', 'respawn'];

  const refs = {
    immunity: document.getElementById('immunity-badge'),
    furia: furiaBadge,
    air: airBadge,
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
    immunity: false, furia: false, air: false,
    respawn: false, freeze: false, rain: false,
    cosmicOrder: false, cosmicOrderFood: false, sacrificeOffering: false,
    skullFood: false, threat: false
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

const FURIA_DURATION_MS = 3000;
const FURIA_COOLDOWN_MS = 8500;
const FURIA_GUARDIAN_REWARD = 200;

const AIR_FIRST_SPAWN_MS = 20000;
const AIR_RESPAWN_DELAY_MS = 28000;
const AIR_BOOST_DURATION_MS = 3000;
const AIR_BOOST_MULTIPLIER = 0.68;
const AIR_SCORE = 15;
const AIR_FURIA_RECHARGE_BONUS_MS = 2000;

const DIFFICULTY_PROFILES = {
  easy: {
    guardianTargets: 1,
    guardianFirstSpawnMs: 18000,
    guardianNextSpawnMs: 22000,
    guardianLifetimeMs: 999999,
    jadeRespawnMs: 20000,
    freezeRespawnMs: 24000,
    freezeDurationMs: 4000,
    jadeImmunityMs: 12000,
    guardianMoveInterval: 5,
    guardianLead: 1,
    flankerOrbitSpeed: 16,
    cosmicFirstMs: 40000,
    cosmicIntervalMs: 55000,
    sacrificeFirstMs: 28000,
    skullFirstMs: 26000,
    rainFirstMs: 28000,
    rainIntervalMs: 50000,
    chaacUnlockMs: 999999,
    chaacCooldownMs: 999999,
    chaacLifetimeMs: 999999,
    chaacTeleportMs: 4000,
    guardianReward: 80,
    bossReward: 0,
    turboDurationMs: 3500,
    turboCooldownMs: 4500
  },
  medium: {
    guardianTargets: 2,
    guardianFirstSpawnMs: 14000,
    guardianNextSpawnMs: 16000,
    guardianLifetimeMs: 999999,
    jadeRespawnMs: 14000,
    freezeRespawnMs: 22000,
    freezeDurationMs: 3000,
    jadeImmunityMs: 10000,
    guardianMoveInterval: 4,
    guardianLead: 3,
    flankerOrbitSpeed: 12,
    cosmicFirstMs: 30000,
    cosmicIntervalMs: 45000,
    sacrificeFirstMs: 30000,
    skullFirstMs: 20000,
    rainFirstMs: 22000,
    rainIntervalMs: 42000,
    chaacUnlockMs: 999999,
    chaacCooldownMs: 999999,
    chaacLifetimeMs: 999999,
    chaacTeleportMs: 3200,
    guardianReward: 100,
    bossReward: 0,
    turboDurationMs: 3000,
    turboCooldownMs: 5000
  },
  hard: {
    guardianTargets: 3,
    guardianFirstSpawnMs: 11000,
    guardianNextSpawnMs: 11000,
    guardianLifetimeMs: 999999,
    jadeRespawnMs: 11000,
    freezeRespawnMs: 20000,
    freezeDurationMs: 2500,
    jadeImmunityMs: 8000,
    guardianMoveInterval: 3,
    guardianLead: 4,
    flankerOrbitSpeed: 9,
    cosmicFirstMs: 25000,
    cosmicIntervalMs: 38000,
    sacrificeFirstMs: 32000,
    skullFirstMs: 18000,
    rainFirstMs: 18000,
    rainIntervalMs: 38000,
    chaacUnlockMs: 45000,
    chaacCooldownMs: 60000,
    chaacLifetimeMs: 999999,
    chaacTeleportMs: 3000,
    guardianReward: 120,
    bossReward: 250,
    turboDurationMs: 2800,
    turboCooldownMs: 5200
  },
  extreme: {
    guardianTargets: 4,
    guardianFirstSpawnMs: 9000,
    guardianNextSpawnMs: 8000,
    guardianLifetimeMs: 999999,
    jadeRespawnMs: 8000,
    freezeRespawnMs: 18000,
    freezeDurationMs: 2000,
    jadeImmunityMs: 6000,
    guardianMoveInterval: 2,
    guardianLead: 5,
    flankerOrbitSpeed: 7,
    cosmicFirstMs: 20000,
    cosmicIntervalMs: 32000,
    sacrificeFirstMs: 36000,
    skullFirstMs: 15000,
    rainFirstMs: 15000,
    rainIntervalMs: 32000,
    chaacUnlockMs: 35000,
    chaacCooldownMs: 45000,
    chaacLifetimeMs: 999999,
    chaacTeleportMs: 2600,
    guardianReward: 150,
    bossReward: 350,
    turboDurationMs: 2500,
    turboCooldownMs: 5500
  }
};

// === MODOS DE JUEGO ===
const GAME_MODES = {
  classic: {
    name: 'Clásico',
    icon: '⚔️',
    guardianSpawnRate: 1.0,
    guardianRewardMultiplier: 1.0,
    itemsEnabled: true,
    livesEnabled: true,
    profileOverrides: null,
  },
  hunt: {
    name: 'Cacería',
    icon: '🎯',
    guardianSpawnRate: 0.6,
    guardianRewardMultiplier: 1.5,
    itemsEnabled: true,
    livesEnabled: true,
    profileOverrides: {
      guardianTargets: 3,
      guardianFirstSpawnMs: 9000,
      guardianNextSpawnMs: 8000,
      guardianMoveInterval: 3,
      guardianLead: 4,
      guardianReward: 150,
      bossReward: 300,
      turboDurationMs: 2800,
      turboCooldownMs: 5200
    }
  },
  survival: {
    name: 'Supervivencia',
    icon: '🛡️',
    guardianSpawnRate: 1.2,
    guardianRewardMultiplier: 1.0,
    itemsEnabled: false,
    livesEnabled: false,
    profileOverrides: {
      guardianTargets: 2,
      guardianFirstSpawnMs: 12000,
      guardianNextSpawnMs: 14000,
      guardianMoveInterval: 4,
      guardianLead: 3,
      guardianReward: 100,
      bossReward: 0,
      turboDurationMs: 3000,
      turboCooldownMs: 5000,
      rainFirstMs: 999999,
      rainIntervalMs: 999999,
      cosmicFirstMs: 999999,
      cosmicIntervalMs: 999999,
      sacrificeFirstMs: 999999,
      skullFirstMs: 999999,
      freezeRespawnMs: 999999,
      jadeRespawnMs: 999999,
    }
  }
};

const BOARD_THEMES = {
  classic: {
    bg: '#141720',
    gridLine: 'rgba(144, 153, 177, 0.13)',
    patternColor: 'rgba(198, 164, 85, 0.07)',
    patternType: 'diamond',
    vignetteColor: 'rgba(0,0,0,0.42)'
  },
  hunt: {
    bg: '#0a1a12',
    gridLine: 'rgba(78, 201, 160, 0.15)',
    patternColor: 'rgba(217, 142, 43, 0.08)',
    patternType: 'diamond',
    vignetteColor: 'rgba(0, 10, 5, 0.55)'
  },
  survival: {
    bg: '#0a0809',
    gridLine: 'rgba(239, 82, 97, 0.08)',
    patternColor: 'rgba(239, 82, 97, 0.04)',
    patternType: 'crack',
    vignetteColor: 'rgba(0,0,0,0.7)'
  }
};

function getEffectiveDifficulty() {
  const mode = gameModeSelect.value;
  if (mode === 'classic') {
    return difficultySelect.value;
  }
  return 'medium';
}

function getDifficultyProfile() {
  const mode = GAME_MODES[gameModeSelect.value] || GAME_MODES.classic;
  const baseProfile = DIFFICULTY_PROFILES[getEffectiveDifficulty()] || DIFFICULTY_PROFILES.medium;

  const profile = { ...baseProfile };

  if (mode.profileOverrides) {
    Object.assign(profile, mode.profileOverrides);
  }

  // Aplicar multiplicadores del modo sobre los valores ya definidos
  profile.guardianFirstSpawnMs *= mode.guardianSpawnRate;
  profile.guardianNextSpawnMs *= mode.guardianSpawnRate;
  profile.guardianReward *= mode.guardianRewardMultiplier;
  profile.bossReward *= mode.guardianRewardMultiplier;

  return profile;
}

const GUARDIAN_TARGETS = Object.fromEntries(
  Object.entries(DIFFICULTY_PROFILES).map(([k, v]) => [k, v.guardianTargets])
);
const GUARDIAN_FIRST_SPAWN_MS = Object.fromEntries(
  Object.entries(DIFFICULTY_PROFILES).map(([k, v]) => [k, v.guardianFirstSpawnMs])
);
const GUARDIAN_NEXT_SPAWN_MS = Object.fromEntries(
  Object.entries(DIFFICULTY_PROFILES).map(([k, v]) => [k, v.guardianNextSpawnMs])
);
const GUARDIAN_LIFETIME_MS = Object.fromEntries(
  Object.entries(DIFFICULTY_PROFILES).map(([k, v]) => [k, v.guardianLifetimeMs])
);
const JADE_RESPAWN_DELAY_MS = Object.fromEntries(
  Object.entries(DIFFICULTY_PROFILES).map(([k, v]) => [k, v.jadeRespawnMs])
);
const FREEZE_FIRST_SPAWN_MS = 16000;
const FREEZE_RESPAWN_DELAY_MS = 22000;

const GUARDIAN_FREEZE_DURATION_MS = 3000;

const CHAAC_UNLOCK_MS = 45000;
const CHAAC_COOLDOWN_MS = 60000;
const CHAAC_LIFETIME_MS = 999999;
const CHAAC_TELEPORT_MS = 3200;
const CHAAC_RETRY_MS = 3000;

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
    name: 'Tezcatlipoca',
    palette: {
      head: '#d98e2b',
      body: '#a8561b',
      crest: '#14110f',
      eye: '#f2e2b8',
      jade: '#4ec9a0',
      obsidian: '#14110f',
      ember: '#f2e2b8'
    },
    traits: { fangs: true, crestCount: 4, eyeMark: false, isBoss: true, isTezcatlipoca: true }
  }
];

// === CONTROL DE COLORES ÚNICOS POR PARTIDA ===
let usedGuardianPalettes = [];

function getUniqueGuardianDef() {
  const normalDefs = GUARDIAN_DEFS.filter(d => d.behavior !== 'ambusher');
  const available = normalDefs.filter(d => !usedGuardianPalettes.includes(d.name));
  if (available.length === 0) {
    // Si ya se usaron todos, reiniciar (o devolver el que menos se usó)
    usedGuardianPalettes = [];
    return normalDefs[Math.floor(Math.random() * normalDefs.length)];
  }
  const def = available[Math.floor(Math.random() * available.length)];
  usedGuardianPalettes.push(def.name);
  return def;
}

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

let welcomeDemoCols = 22;
let welcomeDemoRows = 8;
let welcomeDemoRoute = [];
let welcomeScenario = null;
let welcomeLayout = null;

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
let maxLives = MAX_LIVES;
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
let boardTheme = 'classic';

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
let nextChaacSpawnAt = null;
let isOnFire = false;
let fireExpiresAt = 0;

let isFuria = false;
let furiaReadyAt = 0;
let furiaCooldownUntil = 0;
let airFoods = [];
let airSpawnAt = null;
let airBoostUntil = 0;

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
let welcomeDemoCalloutMessages = [
  'Muévete por la cuadrícula y busca ofrendas',
  '¡Recoge el maíz para crecer y ganar puntos!',
  '¡El jade te protege de los guardianes!',
  '¡Cuidado! Los guardianes te persiguen.',
  '¡Usa la FURIA para incinerar enemigos!'
];
let welcomeDemoCalloutIndex = 0;
let welcomeDemoCalloutTimer = 0;

let currentTutorialStep = 1;
const totalTutorialSteps = 5;
const tutorialTitles = [
  'La Travesía de Kukulcán',
  'Las ofrendas sagradas',
  'Los guardianes',
  'Poderes y sacrificios',
  'Modalidades de Juego'
];
let tutorialWasRunning = false;
let tutorialWasPaused = false;
let tutorialDrawerWasVisible = false;
let tutorialOpenedFromWelcome = false;

let statisticsWasRunning = false;
let statisticsWasPaused = false;
let statisticsDrawerWasVisible = false;

let showDpad = safeGetItem('snakeIoShowDpad', 'false') === 'true';
let gameMode = safeGetItem('snakeIoGameMode', 'classic');

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
  rebuildBoardCanvas(width, height, dpr, true);
  if (!isGameRunning) draw(1, false);
}

function rebuildBoardCanvas(width, height, dpr, force = false) {
  if (!force && boardCanvas && boardWidth === width && boardHeight === height && boardTheme === gameMode) return;
  boardCanvas = document.createElement('canvas');
  boardCanvas.width = Math.max(1, Math.floor(width * dpr));
  boardCanvas.height = Math.max(1, Math.floor(height * dpr));
  boardWidth = width;
  boardHeight = height;
  boardTheme = gameMode;
  boardContext = boardCanvas.getContext('2d', { alpha: false });
  boardContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  const theme = BOARD_THEMES[boardTheme] || BOARD_THEMES.classic;

  boardContext.fillStyle = theme.bg;
  boardContext.fillRect(0, 0, width, height);
  boardContext.strokeStyle = theme.gridLine;
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

  boardContext.fillStyle = theme.patternColor;
  if (theme.patternType === 'diamond') {
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
  } else if (theme.patternType === 'crack') {
    boardContext.strokeStyle = theme.patternColor;
    boardContext.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      boardContext.beginPath();
      boardContext.moveTo(cx, cy);
      let lx = cx, ly = cy;
      for (let s = 0; s < 4; s++) {
        lx += (Math.random() - 0.5) * TILE_SIZE * 3;
        ly += (Math.random() - 0.5) * TILE_SIZE * 3;
        boardContext.lineTo(lx, ly);
      }
      boardContext.stroke();
    }
  }

  const centerX = width / 2;
  const centerY = height / 2;
  boardContext.strokeStyle = theme.patternColor;
  boardContext.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const size = TILE_SIZE * (6 + i * 2);
    boardContext.beginPath();
    boardContext.rect(centerX - size / 2, centerY - size / 2, size, size);
    boardContext.stroke();
  }
}

function updateThemeColors() {
  const theme = BOARD_THEMES[gameMode] || BOARD_THEMES.classic;
  document.documentElement.style.setProperty('--bg-1', theme.bg);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme.bg);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150));

// ========================================================
// 8. AUDIO
// ========================================================
let audioCtx = null;
let musicTimer = null;
let musicLayer = 0;
let musicTick = 0;

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

const MUSIC_LAYERS = {
  1: { notes: [55, 65.4, 73.4], interval: 900, type: 'sine', vol: 0.05 },
  2: { notes: [55, 65.4, 73.4, 87.3, 98], interval: 620, type: 'triangle', vol: 0.06 },
  3: { notes: [82.4, 98, 110, 130.8, 146.8, 164.8], interval: 420, type: 'sawtooth', vol: 0.055 },
  4: { notes: [110, 130.8, 146.8, 174.6, 196, 233, 261.6], interval: 280, type: 'square', vol: 0.05 }
};

function getDesiredMusicLayer() {
  if (!isGameRunning || isPaused) return 0;
  if (isFuria) return 4;
  const guardianCount = enemyGuardians.length;
  const snakeLength = snake.length;
  const hasBoss = enemyGuardians.some(g => g.behavior.id === 'ambusher');
  if (hasBoss || guardianCount >= 3 || snakeLength >= 25) return 3;
  if (guardianCount >= 1 || snakeLength >= 15) return 2;
  return 1;
}

function playMusicTick() {
  if (!isGameRunning || isPaused || isMuted) {
    musicTimer = setTimeout(playMusicTick, 500);
    return;
  }
  const layer = MUSIC_LAYERS[musicLayer];
  if (layer) {
    const noteIndex = musicTick % layer.notes.length;
    const freq = layer.notes[noteIndex];
    playTone(freq, layer.interval * 0.85, layer.vol, layer.type);
    if (musicLayer >= 2) {
      setTimeout(() => {
        if (!isGameRunning || isPaused || isMuted) return;
        playTone(freq * 1.5, layer.interval * 0.5, layer.vol * 0.4, 'sine');
      }, layer.interval * 0.3);
    }
    if (musicLayer >= 4) {
      setTimeout(() => {
        if (!isGameRunning || isPaused || isMuted) return;
        playTone(freq * 1.06, layer.interval * 0.4, layer.vol * 0.3, 'sawtooth');
      }, layer.interval * 0.5);
    }
  }
  musicTick++;
  const interval = layer ? layer.interval : 800;
  musicTimer = setTimeout(playMusicTick, interval);
}

function startMusic() {
  stopMusic();
  musicTick = 0;
  musicLayer = 1;
  playMusicTick();
}
function stopMusic() {
  if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
}
function updateMusicLayer() {
  const desired = getDesiredMusicLayer();
  if (desired !== musicLayer) {
    musicLayer = desired;
    musicTick = 0;
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

function playFuriaStartSound() {
  if (isMuted) return;
  try {
    const a = getAudioContext();
    if (!a) return;
    const now = a.currentTime;
    const o1 = a.createOscillator();
    const g1 = a.createGain();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(180, now);
    o1.frequency.exponentialRampToValueAtTime(60, now + 0.5);
    g1.gain.setValueAtTime(0.28, now);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    o1.connect(g1); g1.connect(a.destination);
    o1.start(now); o1.stop(now + 0.6);
    setTimeout(() => playTone(880, 60, 0.2, 'triangle'), 40);
    setTimeout(() => playTone(1174, 90, 0.22, 'triangle'), 110);
    setTimeout(() => playTone(1567, 150, 0.2, 'sine'), 200);
  } catch (e) {}
}

function playAirSound() {
  if (isMuted) return;
  try {
    const a = getAudioContext();
    if (!a) return;
    const now = a.currentTime;
    const o1 = a.createOscillator();
    const g1 = a.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(440, now);
    o1.frequency.exponentialRampToValueAtTime(1320, now + 0.45);
    o1.frequency.exponentialRampToValueAtTime(660, now + 0.7);
    g1.gain.setValueAtTime(0.0001, now);
    g1.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    o1.connect(g1); g1.connect(a.destination);
    o1.start(now); o1.stop(now + 0.75);
    const o2 = a.createOscillator();
    const g2 = a.createGain();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(880, now + 0.1);
    o2.frequency.linearRampToValueAtTime(990, now + 0.35);
    o2.frequency.linearRampToValueAtTime(770, now + 0.65);
    g2.gain.setValueAtTime(0.0001, now + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.09, now + 0.18);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    o2.connect(g2); g2.connect(a.destination);
    o2.start(now + 0.1); o2.stop(now + 0.7);
    const o3 = a.createOscillator();
    const g3 = a.createGain();
    o3.type = 'sawtooth';
    o3.frequency.setValueAtTime(110, now);
    o3.frequency.exponentialRampToValueAtTime(55, now + 0.6);
    g3.gain.setValueAtTime(0.06, now);
    g3.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    o3.connect(g3); g3.connect(a.destination);
    o3.start(now); o3.stop(now + 0.65);
  } catch (e) {}
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
      o.connect(g); g.connect(a.destination);
      o.start(now); o.stop(now + l.d);
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
    startMusic();
  } else {
    stopMusic();
  }
}

// ========================================================
// 9. FURIA (FUEGO + VELOCIDAD)
// ========================================================
function triggerFuria() {
  if (isFuria || getFuriaCooldownRemaining() > 0 || !isGameRunning || isPaused || countdownEndsAt !== null) return;
  isFuria = true;
  furiaReadyAt = gameTime + FURIA_DURATION_MS;
  furiaCooldownUntil = furiaReadyAt + FURIA_COOLDOWN_MS;
  isOnFire = false;
  fireExpiresAt = 0;
  updateFuriaUI();
  playFuriaStartSound();
  vibrate([30, 20, 30]);

  const head = snake[0];
  if (head) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 24; i++) {
      const a = (Math.PI * 2 * i) / 24 + Math.random() * 0.3;
      const sp = 2 + Math.random() * 3;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 2.5 + Math.random() * 3,
        color: ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'][i % 4],
        alpha: 1, decay: 0.022
      });
    }
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const sp = 1.5 + Math.random() * 2;
      particles.push({
        x: hx + (Math.random() - 0.5) * TILE_SIZE,
        y: hy + (Math.random() - 0.5) * TILE_SIZE,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 2 + Math.random() * 2,
        color: ['#ff6b2c', '#ffb347', '#fff0a3'][i % 3],
        alpha: 1, decay: 0.028
      });
    }
    spawnFloatingText('🔥 ¡FURIA!', hx, hy - TILE_SIZE, '#ff6b2c');
    triggerHeadPulse('#ff6b2c');
    screenShake = 10;
  }
  BadgeManager.setVisible('furia', true);
  if (furiaTimerSpan) furiaTimerSpan.textContent = Math.ceil(FURIA_DURATION_MS / 1000);
  updateMusicLayer();
}

function getFuriaCooldownRemaining() {
  return Math.max(0, furiaCooldownUntil - gameTime);
}

function updateFuriaUI() {
  const cooldownRemaining = getFuriaCooldownRemaining();
  const charge = isFuria ? 1 : cooldownRemaining > 0 ? 1 - cooldownRemaining / FURIA_COOLDOWN_MS : 1;

  btnTurbo.classList.toggle('active', isFuria);
  btnTurbo.classList.toggle('cooldown', cooldownRemaining > 0 && !isFuria);
  btnTurbo.disabled = (cooldownRemaining > 0 && !isFuria) || !isGameRunning || isPaused || countdownEndsAt !== null;
  turboIcon.textContent = '🔥';
  turboLabel.textContent = isFuria ? 'FURIA' : cooldownRemaining > 0 ? 'RECARGA' : 'FURIA';
  btnTurbo.setAttribute('aria-label', isFuria ? 'Furia de Xiuhcóatl activa' : 'Activar Furia (Fuego + Velocidad)');
  if (turboProgress) turboProgress.style.setProperty('--turbo-charge', `${Math.round(charge * 100)}%`);
}

// Alias para compatibilidad con código que aún llame "triggerTurboBurst"
function triggerTurboBurst() { triggerFuria(); }
function updateTurboUI() { updateFuriaUI(); }

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
  floatingTexts.push({ text, x: tx, y: ty, vy: -1.3, alpha: 1, color, scale: 0.6, life: 0 });
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
function spawnFuriaTrail(x, y) {
  const colors = ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'];
  const back = Math.atan2(-direction.y, -direction.x);
  for (let i = 0; i < 3; i++) {
    const a = back + (Math.random() - 0.5) * 0.8;
    const s = Math.random() * 1.5 + 0.8;
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      size: Math.random() * 1.8 + 1.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.9, decay: 0.045
    });
  }
  if (Math.random() < 0.3) {
    particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.8 - Math.random() * 0.8,
      size: 1.8 + Math.random() * 1.5,
      color: '#fff0a3',
      alpha: 0.85, decay: 0.03
    });
  }
}
function spawnAirTrail(x, y) {
  const colors = ['#b3e5ff', '#d9f0ff', '#ffffff'];
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 1.8 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.7, decay: 0.05
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
function spawnEatBurst(x, y, color = '#d5bd70', count = 6) {
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const sp = 1 + Math.random() * 1.8;
    particles.push({
      x, y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      size: 1.8 + Math.random() * 1.8,
      color: Math.random() > 0.5 ? color : '#fff8dc',
      alpha: 1, decay: 0.035
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
    if (updateState) {
      ft.y += ft.vy;
      ft.alpha -= 0.028;
      ft.life += 1;
      ft.scale = Math.min(1, ft.scale + 0.15);
    }
    if (ft.alpha <= 0) { floatingTexts.splice(i, 1); continue; }
    ctx.globalAlpha = ft.alpha;
    const fontSize = Math.round(13 * ft.scale);
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const m = ctx.measureText(ft.text);
    const w = m.width + 14;
    ctx.fillStyle = 'rgba(20, 23, 32, 0.85)';
    roundRect(ctx, ft.x - w / 2, ft.y - 11, w, 22, 7);
    ctx.fill();
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.globalAlpha = 1;
}

// ========================================================
// 11. INMUNIDAD / FREEZE / FUEGO
// ========================================================
function activateImmunity(seconds = 10) {
  isImmune = true;
  immunityExpiresAt = gameTime + seconds * 1000;
  immunityTimerSpan.textContent = seconds;
  BadgeManager.setVisible('immunity', true);
  startFireBreath();
  vibrate(30);
  const head = snake[0];
  if (head) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12;
      const sp = 1.2 + Math.random() * 1.5;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 1.8 + Math.random() * 1.5,
        color: ['#7de8c4', '#4ec9a0', '#fff0b0'][i % 3],
        alpha: 1, decay: 0.03
      });
    }
  }
  updateMusicLayer();
}

function activateFireImmunity(seconds = 8) {
  // No-op
}
function deactivateFireImmunity() {
  isOnFire = false;
  fireExpiresAt = 0;
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
  const profile = getDifficultyProfile();
  guardiansFrozenUntil = gameTime + profile.freezeDurationMs;
  enemyGuardians.forEach(g => { if (g.frozenAt === null) g.frozenAt = gameTime; });
  freezeTimerSpan.textContent = String(Math.ceil(profile.freezeDurationMs / 1000));
  BadgeManager.setVisible('freeze', true);
  vibrate(25);
  const head = snake[0];
  if (head) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 18; i++) {
      const a = (Math.PI * 2 * i) / 18;
      const sp = 2 + Math.random() * 2;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 1.5 + Math.random() * 1.5,
        color: ['#8be7ff', '#d7f6ff', '#4fc3f7'][i % 3],
        alpha: 1, decay: 0.03
      });
    }
    spawnFloatingText('❄️ ¡Congelados!', hx, hy - TILE_SIZE, '#8be7ff');
  }
}

function activateAirBoost() {
  airBoostUntil = gameTime + AIR_BOOST_DURATION_MS;
  if (airTimerSpan) airTimerSpan.textContent = Math.ceil(AIR_BOOST_DURATION_MS / 1000);
  BadgeManager.setVisible('air', true);
  vibrate(20);
  updateMusicLayer();

  const head = snake[0];
  if (head) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 16; i++) {
      const a = (Math.PI * 2 * i) / 16;
      const sp = 2 + Math.random() * 2.5;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 2 + Math.random() * 2,
        color: ['#b3e5ff', '#d9f0ff', '#ffffff'][i % 3],
        alpha: 0.9, decay: 0.035
      });
    }
  }
}
function deactivateAirBoost() {
  airBoostUntil = 0;
  BadgeManager.setVisible('air', false);
}

// ========================================================
// 12. GUARDIANES
// ========================================================
function scheduleEnemySpawn(retryDelay = null) {
  const profile = getDifficultyProfile();
  const target = profile.guardianTargets;
  const normalGuardians = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  updateGuardianBadge();
  if (!isGameRunning || normalGuardians >= target || cosmicOrderResolveAt !== null) {
    enemySpawnAt = null;
    return;
  }
  if (isPaused || countdownEndsAt !== null) return;
  const delay = retryDelay ?? (hasSpawnedGuardian
    ? profile.guardianNextSpawnMs
    : profile.guardianFirstSpawnMs);
  enemySpawnAt = gameTime + delay;
}

function isCellFreeForNewGuardian(x, y) {
  return !snake.some(s => s.x === x && s.y === y) &&
    !foods.some(f => f.x === x && f.y === y) &&
    !bonusFoods.some(f => f.x === x && f.y === y) &&
    !shieldFoods.some(f => f.x === x && f.y === y) &&
    !freezeFoods.some(f => f.x === x && f.y === y) &&
    !airFoods.some(f => f.x === x && f.y === y) &&
    !cosmicOrderFoods.some(f => f.x === x && f.y === y) &&
    !sacrificeFoods.some(f => f.x === x && f.y === y) &&
    !skullFoods.some(f => f.x === x && f.y === y);
}

function spawnEnemySnake() {
  const profile = getDifficultyProfile();
  const target = profile.guardianTargets;
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
    if (enemyGuardians.some(g => g.segments.some(s => 
      Math.abs(s.x - x) + Math.abs(s.y - y) < 5
    ))) continue;

    const id = nextEnemyId++;
    // === USAR DEF ÚNICO ===
    const def = getUniqueGuardianDef();
    const guardian = {
      id,
      segments: candidate,
      direction: { x: 1, y: 0 },
      tickCounter: 0,
      expiresAt: gameTime + profile.guardianLifetimeMs,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette,
      behavior: { id: def.behavior, name: def.name },
      traits: def.traits,
      lastMoveTick: -1,
      targetIndicator: null,
      recentCells: [],
      personality: {
        aggression: 0.7 + Math.random() * 0.6,
        caution: Math.random() * 0.4,
        preferredDistance: 3 + Math.floor(Math.random() * 4)
      }
    };
    enemyGuardians.push(guardian);
    hasSpawnedGuardian = true;
    updateGuardianBadge();
    const hx = x * TILE_SIZE + TILE_SIZE / 2;
    const hy = y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * 2, vy: Math.sin(a) * 2,
        size: 2, color: def.palette.head, alpha: 1, decay: 0.03
      });
    }
    spawnFloatingText('⚠️ ' + def.name, hx, hy - TILE_SIZE, def.palette.head);
    updateMusicLayer();
    return true;
  }
  return false;
}

function spawnChaac() {
  const difficulty = getEffectiveDifficulty();
  const profile = getDifficultyProfile();
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
      expiresAt: gameTime + profile.chaacLifetimeMs,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette,
      behavior: { id: def.behavior, name: def.name },
      traits: def.traits,
      nextTeleportAt: gameTime + profile.chaacTeleportMs,
      teleportFlash: 0,
      teleportDest: null,
      smokeParticles: [],
      lastMoveTick: -1,
      targetIndicator: null,
      recentCells: []
    };
    enemyGuardians.push(guardian);
    nextChaacSpawnAt = gameTime + profile.chaacCooldownMs;
    updateGuardianBadge();
    const hx = x * TILE_SIZE + TILE_SIZE / 2;
    const hy = y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 3;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1,
        size: 2 + Math.random() * 2,
        color: ['#d98e2b', '#f2e2b8', '#14110f'][i % 3],
        alpha: 1, decay: 0.022
      });
    }
    spawnFloatingText('👁️ ¡TEZCATLIPOCA DESCIENDE!', hx, hy - TILE_SIZE, '#d98e2b');
    screenShake = 8;
    updateMusicLayer();
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
    airFoods.some(f => f.x === x && f.y === y) ||
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

  const hasTezcatlipoca = enemyGuardians.some(g => g.behavior.id === 'ambusher');
  const names = [...new Set(enemyGuardians.map(g => g.behavior.name))];
  const desktopText = hasTezcatlipoca
    ? `👁️ ¡TEZCATLIPOCA al acecho!`
    : (count === 1
      ? `${names[0]} al acecho`
      : `${count} guardianes: ${names.join(' · ')}`);
  const mobileText = hasTezcatlipoca ? '¡Tezcatlipoca!' : (count === 1 ? names[0] : `${count} guardianes`);

  const desktopSpan = threatBadge.querySelector('.badge-text-desktop');
  const mobileSpan = threatBadge.querySelector('.badge-text-mobile');
  if (desktopSpan) desktopSpan.textContent = desktopText;
  if (mobileSpan) mobileSpan.textContent = mobileText;

  const dot = document.getElementById('threat-dot');
  if (dot) {
    const first = enemyGuardians[0];
    const color = hasTezcatlipoca ? '#d98e2b' : first.palette.head;
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
  const profile = getDifficultyProfile();
  if (g.behavior.id === 'interceptor') {
    const lead = profile.guardianLead;
    return {
      x: (playerHead.x + direction.x * lead + gridCols) % gridCols,
      y: (playerHead.y + direction.y * lead + gridRows) % gridRows
    };
  }
  if (g.behavior.id === 'flanker') {
    const orbit = Math.floor(g.tickCounter / profile.flankerOrbitSpeed + g.id) % 4;
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
  const profile = getDifficultyProfile();
  const newDifficulty = getEffectiveDifficulty();
  const target = profile.guardianTargets;

  if (newDifficulty !== 'hard' && newDifficulty !== 'extreme') {
    const boss = enemyGuardians.find(g => g.behavior.id === 'ambusher');
    if (boss) destroyEnemySnake(boss.id);
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
            color: Math.random() > 0.5 ? '#d98e2b' : '#14110f',
            alpha: 1, decay: 0.02
          });
        }
      });
      nextChaacSpawnAt = gameTime + getDifficultyProfile().chaacCooldownMs;
    }
  }
  updateGuardianBadge();
  scheduleEnemySpawn();
}

function scoreMove(guardian, dir, occupiedByGuardians, playerHead, isFleeing) {
  const enemyHead = guardian.segments[0];
  const newX = (enemyHead.x + dir.x + gridCols) % gridCols;
  const newY = (enemyHead.y + dir.y + gridRows) % gridRows;
  const key = `${newX},${newY}`;

  // Colisión con otro guardián
  if (occupiedByGuardians[key]) {
    const isSelf = guardian.segments.some(s => s.x === newX && s.y === newY);
    if (!isSelf) return -Infinity;
  }

  // Colisión con serpiente
  if (snake.some(s => s.x === newX && s.y === newY)) {
    // Si estamos huyendo o protegidos, es malo; si perseguimos, es bueno
    return isFleeing ? -Infinity : 1000;
  }

  let score = 0;

  // Distancia al objetivo (con wrap)
  const target = getGuardianTarget(guardian, playerHead, null);
  let dx = target.x - newX;
  let dy = target.y - newY;
  if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
  if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
  const dist = Math.abs(dx) + Math.abs(dy);

  if (isFleeing) {
    score -= dist * 10;
  } else {
    score -= dist * 10;
  }

  // Evitar callejones sin salida (flood fill limitado)
  const freeSpace = floodFillCount(newX, newY, 12, occupiedByGuardians);
  score += freeSpace * 1.5;

  // Evitar celdas recientes
  if (guardian.recentCells.includes(key)) {
    score -= 50;
  }

  // Aleatoriedad según dificultad
  const profile = getDifficultyProfile();
  const difficulty = getEffectiveDifficulty();
  let errorChance = 0;
  if (difficulty === 'easy') errorChance = 0.35;
  else if (difficulty === 'medium') errorChance = 0.2;
  else if (difficulty === 'hard') errorChance = 0.1;
  else if (difficulty === 'extreme') errorChance = 0.05;
  if (Math.random() < errorChance) {
    score += (Math.random() - 0.5) * 200;
  }

  return score;
}

function floodFillCount(startX, startY, maxCells, occupiedByGuardians) {
  const visited = new Set();
  const queue = [{ x: startX, y: startY }];
  visited.add(`${startX},${startY}`);
  let count = 0;

  while (queue.length > 0 && count < maxCells) {
    const { x, y } = queue.shift();
    count++;

    const neighbors = [
      { x: (x + 1) % gridCols, y },
      { x: (x - 1 + gridCols) % gridCols, y },
      { x, y: (y + 1) % gridRows },
      { x, y: (y - 1 + gridRows) % gridRows }
    ];

    for (const n of neighbors) {
      const key = `${n.x},${n.y}`;
      if (visited.has(key)) continue;
      if (occupiedByGuardians[key]) continue;
      if (snake.some(s => s.x === n.x && s.y === n.y)) continue;
      visited.add(key);
      queue.push(n);
    }
  }

  return count;
}

function updateEnemySnakeAI() {
  if (enemyGuardians.length === 0 || guardiansFrozenUntil > gameTime || cosmicOrderResolveAt !== null) return;
  const profile = getDifficultyProfile();
  const moveInterval = profile.guardianMoveInterval;
  const playerHead = snake[0];
  const isFleeing = hasGuardianProtection() || isFuria;

  const occupiedByGuardians = {};
  enemyGuardians.forEach(g => {
    g.segments.forEach(s => {
      occupiedByGuardians[`${s.x},${s.y}`] = true;
    });
  });

  for (const g of [...enemyGuardians]) {
    g.tickCounter++;

    // ==== TEZCATLIPOCA: teletransporte con humo de obsidiana ====
    if (g.behavior.id === 'ambusher') {
      if (gameTime >= g.nextTeleportAt) {
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
            const oldHead = g.segments[0];
            g.smokeParticles.push({ x: oldHead.x, y: oldHead.y, bornAt: gameTime });
            g.segments[0] = { x: tx, y: ty };
            g.teleportFlash = 1;
            g.teleportDest = { x: tx, y: ty };
            g.nextTeleportAt = gameTime + profile.chaacTeleportMs;
            for (let p = 0; p < 12; p++) {
              const a = Math.random() * Math.PI * 2;
              particles.push({
                x: tx * TILE_SIZE + TILE_SIZE / 2,
                y: ty * TILE_SIZE + TILE_SIZE / 2,
                vx: Math.cos(a) * 2,
                vy: Math.sin(a) * 2,
                size: 2 + Math.random() * 2,
                color: '#14110f',
                alpha: 0.9,
                decay: 0.04
              });
            }
            break;
          }
        }
      }
      if (g.teleportFlash > 0) g.teleportFlash = Math.max(0, g.teleportFlash - 0.05);
      if (g.smokeParticles) {
        g.smokeParticles = g.smokeParticles.filter(sp => gameTime - sp.bornAt < 800);
      }

      const enemyHead = g.segments[0];
      let dx = playerHead.x - enemyHead.x;
      let dy = playerHead.y - enemyHead.y;
      if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
      if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
      if (isFleeing) { dx = -dx; dy = -dy; }

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
        if (hasGuardianProtection() || isFuria || guardiansFrozenUntil > gameTime) {
          const frozen = guardiansFrozenUntil > gameTime;
          const shield = isImmune;
          const furia = isFuria;
          const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
          const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
          const reward = furia ? FURIA_GUARDIAN_REWARD : profile.bossReward;
          screenShake = 12;
          playEnemyDefeatedSound();
          vibrate([40, 30, 40, 30, 60]);
          runGuardiansDefeated++;
          score += reward;
          const label = furia
            ? `+${reward} ${symbol} ¡TEZCATLIPOCA INCINERADO!`
            : frozen
              ? `+${reward} ${symbol} ¡TEZCATLIPOCA CONGELADO!`
              : `+${reward} ${symbol} ¡TEZCATLIPOCA VENCIDO!`;
          spawnFloatingText(label, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
          updateScoresUI();
          destroyEnemySnake(g.id);
          continue;
        } else {
          screenShake = 12;
          loseLife('¡Tezcatlipoca, el jaguar de obsidiana, te devoró!');
          return;
        }
      }
      g.segments.unshift(newHead);
      g.segments.pop();
      continue;
    }

    // ==== IA de guardianes normales con puntuación de movimientos ====
    const interval = moveInterval + (g.behavior.id === 'interceptor' ? 1 : 0);
    if ((g.tickCounter + g.id) % interval !== 0) continue;

    g.lastMoveTick = g.tickCounter;

    const enemyHead = g.segments[0];
    const possibleDirs = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
    ];

    let bestDir = null;
    let bestScore = -Infinity;
    const candidates = [];

    for (const dir of possibleDirs) {
      // Evitar reversa directa
      if ((dir.x !== 0 && dir.x === -g.direction.x) || (dir.y !== 0 && dir.y === -g.direction.y)) continue;
      const newX = (enemyHead.x + dir.x + gridCols) % gridCols;
      const newY = (enemyHead.y + dir.y + gridRows) % gridRows;
      const key = `${newX},${newY}`;
      // Evitar colisión con otro guardián
      if (occupiedByGuardians[key]) {
        const isSelf = g.segments.some(s => s.x === newX && s.y === newY);
        if (!isSelf) continue;
      }
      candidates.push({ dir, newX, newY, key });
    }

    // Fallback si no hay candidatos
    if (candidates.length === 0) {
      const allDirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
      for (const dir of allDirs) {
        if (!(dir.x === -g.direction.x && dir.y === -g.direction.y)) {
          const newX = (enemyHead.x + dir.x + gridCols) % gridCols;
          const newY = (enemyHead.y + dir.y + gridRows) % gridRows;
          candidates.push({ dir, newX, newY, key: `${newX},${newY}` });
        }
      }
    }

    // Evaluar cada candidato
    for (const cand of candidates) {
      const { dir, newX, newY } = cand;
      let score = 0;

      // Distancia al objetivo (con wrap)
      const target = getGuardianTarget(g, playerHead, null);
      let dx = target.x - newX;
      let dy = target.y - newY;
      if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
      if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
      const dist = Math.abs(dx) + Math.abs(dy);

      if (isFleeing) {
        score -= dist * 10;
      } else {
        score -= dist * 10;
      }

      // Evitar callejones sin salida (flood fill limitado)
      const freeSpace = floodFillCount(newX, newY, 12, occupiedByGuardians);
      score += freeSpace * 1.5;

      // Evitar celdas recientes
      if (g.recentCells.includes(cand.key)) {
        score -= 50;
      }

      // Aleatoriedad según dificultad
      const difficulty = getEffectiveDifficulty();
      let errorChance = 0;
      if (difficulty === 'easy') errorChance = 0.35;
      else if (difficulty === 'medium') errorChance = 0.2;
      else if (difficulty === 'hard') errorChance = 0.1;
      else if (difficulty === 'extreme') errorChance = 0.05;
      if (Math.random() < errorChance) {
        score += (Math.random() - 0.5) * 200;
      }

      if (score > bestScore) {
        bestScore = score;
        bestDir = dir;
      }
    }

    if (!bestDir) bestDir = g.direction;
    g.direction = bestDir;

    const newHead = {
      x: (enemyHead.x + bestDir.x + gridCols) % gridCols,
      y: (enemyHead.y + bestDir.y + gridRows) % gridRows
    };

    // Actualizar recentCells
    g.recentCells.push(`${newHead.x},${newHead.y}`);
    if (g.recentCells.length > 5) g.recentCells.shift();

    // Actualizar el mapa de ocupación
    delete occupiedByGuardians[`${enemyHead.x},${enemyHead.y}`];
    occupiedByGuardians[`${newHead.x},${newHead.y}`] = true;

    // Indicador de objetivo cuando está cerca
    const headDist = Math.min(
      Math.abs(newHead.x - playerHead.x),
      gridCols - Math.abs(newHead.x - playerHead.x)
    ) + Math.min(
      Math.abs(newHead.y - playerHead.y),
      gridRows - Math.abs(newHead.y - playerHead.y)
    );
    if (headDist < 8 && headDist > 2) {
      g.targetIndicator = { x: playerHead.x, y: playerHead.y };
    } else {
      g.targetIndicator = null;
    }

    const touches = snake.some(s => s.x === newHead.x && s.y === newHead.y);
    if (touches) {
      if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isOnFire) {
        const shield = isImmune;
        const frozen = guardiansFrozenUntil > gameTime;
        const onFire = isOnFire;
        const furia = isFuria;
        const color = furia ? '#ff6b2c' : onFire ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
        const symbol = furia ? '🔥' : onFire ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
        const reward = furia ? FURIA_GUARDIAN_REWARD : profile.guardianReward;
        screenShake = 10;
        playEnemyDefeatedSound();
        vibrate(35);
        runGuardiansDefeated++;
        score += reward;
        const label = furia
          ? `+${reward} ${symbol} ¡INCINERADO POR LA FURIA!`
          : `+${reward} ${symbol} ¡GUARDIÁN VENCIDO!`;
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
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return false;
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
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return false;
  if (lives >= maxLives || sacrificeFoods.length > 0) return false;
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
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return false;
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
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return;
  const profile = getDifficultyProfile();
  const target = profile.guardianTargets;
  let attempts = 0;
  while (shieldFoods.length < target && attempts < 200) {
    attempts++;
    const rx = Math.floor(Math.random() * gridCols);
    const ry = Math.floor(Math.random() * gridRows);
    if (!isGuardianCellOccupied(rx, ry)) shieldFoods.push({ x: rx, y: ry });
  }
}
function maybeSpawnFreezeFood() {
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return false;
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
function maybeSpawnFireFood() { return true; }

function maybeSpawnAirFood() {
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return false;
  if (airFoods.length > 0) return true;
  const head = snake[0];
  for (let i = 0; i < 160; i++) {
    const x = (head.x + Math.floor(Math.random() * 17) - 8 + gridCols) % gridCols;
    const y = (head.y + Math.floor(Math.random() * 17) - 8 + gridRows) % gridRows;
    const dx = Math.min(Math.abs(x - head.x), gridCols - Math.abs(x - head.x));
    const dy = Math.min(Math.abs(y - head.y), gridRows - Math.abs(y - head.y));
    if (dx + dy <= 8 && !isGuardianCellOccupied(x, y)) {
      airFoods.push({ x, y });
      return true;
    }
  }
  for (let i = 0; i < gridCols * gridRows; i++) {
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    if (isGuardianCellOccupied(x, y)) continue;
    airFoods.push({ x, y });
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
  updateMusicLayer();
}

// ========================================================
// 14. LOOP
// ========================================================
function getCurrentSpeed() {
  const sel = difficultySelect.value;
  const base = SPEEDS[sel] || SPEEDS.medium;
  const lengthPenalty = Math.max(0, snake.length - 3) * 2.4;
  let adaptive = Math.max(base * 0.72, base - lengthPenalty);
  if (isFuria) {
    adaptive *= 0.55;
  } else if (airBoostUntil > gameTime) {
    adaptive *= AIR_BOOST_MULTIPLIER;
  }
  return adaptive;
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
  const mode = GAME_MODES[gameModeSelect.value];
  countdownOverlay.innerHTML = `<span>${countdownValue}</span><div class="mode-text">${mode.icon} ${mode.name}</div>`;
  countdownOverlay.classList.remove('hidden');
}
function cancelCountdown() {
  countdownEndsAt = null;
  countdownValue = 0;
  countdownOverlay.innerHTML = '';
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
        const mode = GAME_MODES[gameModeSelect.value];
        countdownOverlay.innerHTML = `<span>${countdownValue}</span><div class="mode-text">${mode.icon} ${mode.name}</div>`;
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

  updateMusicLayer();

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
  if (isFuria) {
    const sec = Math.max(0, Math.ceil((furiaReadyAt - gameTime) / 1000));
    if (furiaTimerSpan) furiaTimerSpan.textContent = sec;
    if (gameTime >= furiaReadyAt) {
      isFuria = false;
      BadgeManager.setVisible('furia', false);
      updateMusicLayer();
    }
  }
  if (!isFuria && furiaCooldownUntil > 0 && gameTime >= furiaCooldownUntil) {
    furiaCooldownUntil = 0;
    playTurboReadySound();
  }
  updateFuriaUI();

  if (airBoostUntil > 0) {
    const sec = Math.max(0, Math.ceil((airBoostUntil - gameTime) / 1000));
    if (airTimerSpan) airTimerSpan.textContent = sec;
    if (gameTime >= airBoostUntil) deactivateAirBoost();
  }

  if (airSpawnAt !== null && gameTime >= airSpawnAt) {
    airSpawnAt = null;
    if (!maybeSpawnAirFood()) airSpawnAt = gameTime + 2000;
  }

  if (respawnProtectedUntil > 0) {
    if (gameTime >= respawnProtectedUntil) {
      respawnProtectedUntil = 0;
      BadgeManager.setVisible('respawn', false);
    } else {
      respawnTimerSpan.textContent = String(Math.ceil((respawnProtectedUntil - gameTime) / 1000));
    }
  }

  if (enemySpawnAt !== null && gameTime >= enemySpawnAt) {
    enemySpawnAt = null;
    const ok = spawnEnemySnake();
    scheduleEnemySpawn(ok ? null : 1500);
  }

  const profile = getDifficultyProfile();
  const effectiveDiff = getEffectiveDifficulty();
  if (
    (effectiveDiff === 'hard' || effectiveDiff === 'extreme') &&
    gameTime >= profile.chaacUnlockMs &&
    enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length >= 2 &&
    !enemyGuardians.some(g => g.behavior.id === 'ambusher')
  ) {
    if (!nextChaacSpawnAt || gameTime >= nextChaacSpawnAt) {
      const spawned = spawnChaac();
      if (!spawned) {
        nextChaacSpawnAt = gameTime + CHAAC_RETRY_MS;
      }
    }
  }

  const bossActive = enemyGuardians.find(g => g.behavior.id === 'ambusher');
  if (bossActive && Math.random() < 0.35) {
    const head = bossActive.segments[0];
    particles.push({
      x: head.x * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      y: head.y * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.5 - Math.random() * 0.5,
      size: 1.5 + Math.random() * 1.5,
      color: Math.random() > 0.5 ? '#d98e2b' : '#14110f',
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
    nextSacredRainAt = gameTime + profile.rainIntervalMs;
    if (!ensureMaizeOffering()) maizeSpawnRetryAt = gameTime + 500;
    rainTimerSpan.textContent = String(Math.ceil(SACRED_RAIN_DURATION_MS / 1000));
    BadgeManager.setVisible('rain', true);
    spawnFloatingText('🌧️ ¡Lluvia sagrada!', window.innerWidth / 2, 80, '#8be7ff');
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
    if (cosmicOrderFoods.length > 0) nextCosmicOrderSpawnAt = gameTime + profile.cosmicIntervalMs;
    else if (enemyGuardians.length === 0) nextCosmicOrderSpawnAt = gameTime + COSMIC_ORDER_SPAWN_RETRY_MS;
    else if (maybeSpawnCosmicOrderFood()) nextCosmicOrderSpawnAt = gameTime + profile.cosmicIntervalMs;
    else nextCosmicOrderSpawnAt = gameTime + 1000;
  }

  const target = profile.guardianTargets;
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
  isOnFire = false;
  fireExpiresAt = 0;
  BadgeManager.setVisible('sacrificeOffering', false);
  BadgeManager.setVisible('skullFood', false);
  BadgeManager.setVisible('cosmicOrder', false);
  BadgeManager.setVisible('cosmicOrderFood', false);
  BadgeManager.setVisible('rain', false);

  isFuria = false;
  furiaReadyAt = 0;
  furiaCooldownUntil = 0;
  BadgeManager.setVisible('furia', false);
  airFoods = [];
  airSpawnAt = AIR_FIRST_SPAWN_MS;
  airBoostUntil = 0;
  BadgeManager.setVisible('air', false);

  const profile = getDifficultyProfile();
  sacredRainUntil = 0;
  nextSacredRainAt = profile.rainFirstMs;
  maizeSpawnRetryAt = null;
  nextCosmicOrderSpawnAt = profile.cosmicFirstMs;
  cosmicOrderResolveAt = null;
  cosmicOrderFlashStartedAt = null;
  nextSacrificeSpawnAt = profile.sacrificeFirstMs;
  nextSkullSpawnAt = profile.skullFirstMs;

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
  nextChaacSpawnAt = null;
  BadgeManager.setVisible('freeze', false);
  enemyGuardians = [];
  hasSpawnedGuardian = false;
  usedGuardianPalettes = [];
  updateGuardianBadge();

  updateFuriaUI();

  updateScoresUI();
  updateLivesUI();
  deactivateImmunity();
  ensureFoodCount(6);
  maybeSpawnShieldFood();
  gameOverlay.classList.add('hidden');
  updateMusicLayer();
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
  if (!GAME_MODES[gameModeSelect.value].livesEnabled) {
    gameOver(reason);
    return;
  }
  lives = Math.max(0, lives - 1);
  updateLivesUI();
  screenShake = 8;
  vibrate([40, 30, 40]);

  const prevHead = snake[0];
  if (prevHead) {
    const hx = prevHead.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = prevHead.y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 * i) / 14;
      const sp = 1.5 + Math.random() * 2;
      particles.push({
        x: hx, y: hy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 2 + Math.random() * 2,
        color: ['#ef5261', '#9b2929', '#f5efdc'][i % 3],
        alpha: 1, decay: 0.03
      });
    }
  }

  if (lives === 0) {
    gameOver(`${reason} Se agotaron los tres sacrificios.`);
    return;
  }
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
  isFuria = false;
  furiaReadyAt = 0;
  furiaCooldownUntil = 0;
  BadgeManager.setVisible('furia', false);
  isOnFire = false;
  fireExpiresAt = 0;
  airBoostUntil = 0;
  BadgeManager.setVisible('air', false);
  updateFuriaUI();
  respawnProtectedUntil = gameTime + RESPAWN_PROTECTION_MS;
  respawnTimerSpan.textContent = String(Math.ceil(RESPAWN_PROTECTION_MS / 1000));
  BadgeManager.setVisible('respawn', true);
  triggerHeadPulse('#4ec9a0');

  if (prevHead) {
    spawnFloatingText('🫀 Sacrificio perdido', prevHead.x * TILE_SIZE + TILE_SIZE / 2, prevHead.y * TILE_SIZE, '#ef5261');
  }
  updateScoresUI();
  if (sacrificeFoods.length === 0) nextSacrificeSpawnAt = gameTime + SACRIFICE_RESPAWN_DELAY_MS;
  updateMusicLayer();
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
    airFoods.some(f => f.x === head.x && f.y === head.y) ||
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
    const profile = getDifficultyProfile();
    if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isFuria) {
      const furia = isFuria;
      const shield = isImmune;
      const frozen = guardiansFrozenUntil > gameTime;
      const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
      const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
      const reward = furia ? FURIA_GUARDIAN_REWARD : (isBoss ? profile.bossReward : profile.guardianReward);
      screenShake = isBoss ? 12 : 10;
      triggerHeadPulse(color);
      playEnemyDefeatedSound();
      vibrate(isBoss ? [40, 30, 40, 30, 60] : 35);
      runGuardiansDefeated++;
      score += reward;
      const label = furia
        ? `+${reward} ${symbol} ¡INCINERADO!`
        : isBoss
          ? `+${reward} ${symbol} ¡TEZCATLIPOCA VENCIDO!`
          : `+${reward} ${symbol} ¡GUARDIÁN VENCIDO!`;
      spawnFloatingText(label, head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, color);
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      for (let i = 0; i < (isBoss ? 20 : 12); i++) {
        const a = (Math.PI * 2 * i) / (isBoss ? 20 : 12);
        const sp = 2 + Math.random() * 2.5;
        particles.push({
          x: hx, y: hy,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          size: 2.5 + Math.random() * 2,
          color: furia ? '#ff6b2c' : isBoss ? '#d98e2b' : hitG.palette.head,
          alpha: 1, decay: 0.025
        });
      }
      updateScoresUI();
      destroyEnemySnake(hitG.id);
    } else {
      screenShake = isBoss ? 12 : 8;
      loseLife(isBoss
        ? '¡Tezcatlipoca, el jaguar de obsidiana, te devoró!'
        : `¡El ${hitG.behavior.name} te alcanzó!`);
      return;
    }
  }

  snake.unshift(head);

  let ateItem = false;

  const jadeIdx = shieldFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (jadeIdx !== -1) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    shieldFoods.splice(jadeIdx, 1);
    score += 25;
    triggerHeadPulse('#4ec9a0');
    spawnFloatingText('💎 ¡Jade +25!', hx, hy, '#4ec9a0');
    playEatSound('shield');
    const profile = getDifficultyProfile();
    activateImmunity(profile.jadeImmunityMs / 1000);
    updateScoresUI();
    jadeSpawnAt = gameTime + profile.jadeRespawnMs;
    spawnEatBurst(hx, hy, '#7de8c4', 10);
    ateItem = true;
  }

  if (!ateItem) {
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
      spawnEatBurst(hx, hy, '#8be7ff', 10);
      ateItem = true;
    }
  }

  if (!ateItem) {
    const airIdx = airFoods.findIndex(f => f.x === head.x && f.y === head.y);
    if (airIdx !== -1) {
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      airFoods.splice(airIdx, 1);
      score += AIR_SCORE;
      triggerHeadPulse('#b3e5ff');
      spawnFloatingText(`💨 ¡Viento +${AIR_SCORE}!`, hx, hy, '#b3e5ff');
      playAirSound();
      activateAirBoost();
      if (furiaCooldownUntil > gameTime) {
        const remaining = furiaCooldownUntil - gameTime;
        furiaCooldownUntil = gameTime + Math.max(0, remaining - AIR_FURIA_RECHARGE_BONUS_MS);
        spawnFloatingText('⚡ Furia acelerada', hx, hy - 22, '#5cc8ff');
      }
      updateScoresUI();
      airSpawnAt = gameTime + AIR_RESPAWN_DELAY_MS;
      spawnEatBurst(hx, hy, '#b3e5ff', 10);
      ateItem = true;
    }
  }

  if (!ateItem) {
    const sacIdx = sacrificeFoods.findIndex(f => f.x === head.x && f.y === head.y);
    if (sacIdx !== -1) {
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      sacrificeFoods.splice(sacIdx, 1);
      BadgeManager.setVisible('sacrificeOffering', false);
      const prev = lives;
      lives = Math.min(maxLives, lives + 1);
      updateLivesUI();
      triggerHeadPulse('#f3d7bd');
      spawnFloatingText(`🫀 +${lives - prev} Sacrificio recuperado`, hx, hy, '#f3d7bd');
      playEatSound('sacrifice');
      vibrate(20);
      nextSacrificeSpawnAt = lives < MAX_LIVES ? gameTime + SACRIFICE_REPEAT_DELAY_MS : null;
      spawnEatBurst(hx, hy, '#ef5261', 14);
      ateItem = true;
    }
  }

  if (!ateItem) {
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
      spawnEatBurst(hx, hy, '#d5bd70', 14);
      ateItem = true;
    }
  }

  if (!ateItem) {
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
      spawnEatBurst(hx, hy, '#facc15', 10);
      ateItem = true;
    }
  }

  if (!ateItem) {
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
      spawnEatBurst(hx, hy, maizeBonus ? '#facc15' : '#d5bd70', maizeBonus ? 10 : 6);
      ensureFoodCount(6);
      updateScoresUI();
      ateItem = true;
    }
  }

  if (!ateItem) {
    snake.pop();
  }

  if (crossed) {
    spawnWorldCrossingEffect(head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE + TILE_SIZE / 2);
  }
  if (isFuria && snake.length > 0) {
    const tail = snake[snake.length - 1];
    spawnFuriaTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  } else if (airBoostUntil > gameTime && snake.length > 0) {
    const tail = snake[snake.length - 1];
    spawnAirTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  }

  updateEnemySnakeAI();
  updateMusicLayer();
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
  if (livesFixedPipEls && livesFixedPipEls.length > 0) {
    livesFixedPipEls.forEach((pip, i) => {
      if (i >= maxLives) {
        pip.style.display = 'none';
      } else {
        pip.style.display = '';
        pip.classList.toggle('spent', i >= lives);
      }
    });
  }
  if (livesFixedContainer) {
    livesFixedContainer.classList.toggle('critical', lives === 1 && maxLives > 1);
    livesFixedContainer.setAttribute('aria-label', `Sacrificios restantes: ${lives} de ${maxLives}`);
  }
  if (livesMobilePipEls && livesMobilePipEls.length > 0) {
    livesMobilePipEls.forEach((pip, i) => {
      if (i >= maxLives) {
        pip.style.display = 'none';
      } else {
        pip.style.display = '';
        pip.classList.toggle('spent', i >= lives);
      }
    });
  }
}

// ========================================================
// 19. HELPERS DE DIBUJO
// ========================================================
function interpolateGridPosition(current, previous, progress) {
  if (!previous || progress >= 1) return { ...current };
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
  const theme = BOARD_THEMES[gameMode] || BOARD_THEMES.classic;
  const gradient = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.35,
    w / 2, h / 2, Math.max(w, h) * 0.75
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, theme.vignetteColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawFeatherScale(segment, index, guardian) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
  const size = TILE_SIZE < 22 ? 3 : 4;
  const type = guardian.behavior.id;
  const pal = guardian.palette;

  ctx.save();

  if (type === 'hunter') {
    // Manchas de jaguar (rosetas: círculo oscuro con punto claro)
    if (index % 2 === 0) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.head;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'interceptor') {
    // Glifos mayas (rombos pequeños formando patrón)
    ctx.globalAlpha = index % 2 === 0 ? 0.7 : 0.45;
    ctx.fillStyle = pal.crest;
    const s = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s);
    ctx.lineTo(cx + s * 0.6, cy);
    ctx.lineTo(cx, cy + s);
    ctx.lineTo(cx - s * 0.6, cy);
    ctx.closePath();
    ctx.fill();
    if (index % 2 === 0) {
      ctx.fillStyle = '#1a0830';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'flanker') {
    // Plumas de quetzal (líneas diagonales verdes)
    ctx.globalAlpha = index % 2 === 0 ? 0.65 : 0.4;
    ctx.strokeStyle = pal.crest;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    const backDir = index % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.7 * backDir, cy + size * 0.7);
    ctx.lineTo(cx + size * 0.7 * backDir, cy - size * 0.7);
    ctx.stroke();
  } else {
    // Fallback genérico
    ctx.globalAlpha = index % 2 === 0 ? 0.75 : 0.5;
    ctx.fillStyle = pal.crest;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size * 0.55, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size * 0.55, cy);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawBodyDiamond(segment, index, isGolden = false) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
  const isEven = index % 2 === 0;
  const size = TILE_SIZE < 22 ? 3 : 3.8;

  const diamondColor = isGolden ? '#e8dca0' : '#d5bd70';
  const diamondStroke = isGolden ? '#c2b06a' : '#fff2c2';
  const diamondCenter = isGolden ? '#f5eecd' : '#fff8dc';
  const wingColor = isGolden ? '#c2b06a' : '#d5bd70';

  ctx.save();

  ctx.globalAlpha = isEven ? 0.9 : 0.6;
  ctx.fillStyle = diamondColor;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.7, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size * 0.7, cy);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = isEven ? 0.8 : 0.55;
  ctx.strokeStyle = diamondStroke;
  ctx.lineWidth = isGolden ? 0.9 : 0.7;
  ctx.stroke();

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = diamondCenter;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  if (isEven) {
    ctx.globalAlpha = isGolden ? 0.7 : 0.5;
    ctx.fillStyle = wingColor;
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

  // === DESTELLOS DE DIAMANTE (solo cuando está dorado, muy sutiles) ===
  if (isGolden) {
    const sparklePhase = (gameTime * 0.003 + index * 1.3) % (Math.PI * 2);
    const sparkleIntensity = Math.max(0, Math.sin(sparklePhase));
    if (sparkleIntensity > 0.7) {
      const sparkAlpha = (sparkleIntensity - 0.7) / 0.3;
      const sparkSize = size * (0.5 + sparkleIntensity * 0.3);
      ctx.globalAlpha = sparkAlpha * 0.6;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - sparkSize, cy); ctx.lineTo(cx + sparkSize, cy);
      ctx.moveTo(cx, cy - sparkSize); ctx.lineTo(cx, cy + sparkSize);
      ctx.stroke();

      ctx.globalAlpha = sparkAlpha * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
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

// =================== KUKULCÁN (CABEZA) ===================
function drawKukulkanHead(rs, dir, protectedFlag, isBlinking) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.34, y: cy - dir.y * TILE_SIZE * 0.34 };

  // === COLORES SEGÚN ESTADO ===
  const isGolden = isImmune || isFuria || guardiansFrozenUntil > gameTime;
  const GOLD_MAIN = isGolden ? '#d4b45c' : '#d5bd70';
  const GOLD_DEEP = isGolden ? '#a8924a' : '#a8843a';
  const GOLD_PALE = isGolden ? '#f5e9b8' : '#fff2c2';
  const JADE_EYE = '#4ec9a0';
  const HEAD_FILL = isGolden ? '#c2a95e' : '#4ec9a0';

  // === CUERPO DE LA CABEZA (bloque redondeado original) ===
  ctx.save();
  ctx.fillStyle = HEAD_FILL;
  roundRect(
    ctx,
    rs.x * TILE_SIZE + 1,
    rs.y * TILE_SIZE + 1,
    TILE_SIZE - 2,
    TILE_SIZE - 2,
    8
  );
  ctx.fill();
  ctx.strokeStyle = GOLD_PALE;
  ctx.lineWidth = isGolden ? 1.8 : 1.4;
  roundRect(
    ctx,
    rs.x * TILE_SIZE + 1,
    rs.y * TILE_SIZE + 1,
    TILE_SIZE - 2,
    TILE_SIZE - 2,
    8
  );
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineCap = 'round';

  // === CASCO DORADO DISCRETO SOBRE LOS OJOS (detalle nuevo, sutil) ===
  ctx.save();
  const helmCenterX = cx - dir.x * TILE_SIZE * 0.02;
  const helmCenterY = cy - dir.y * TILE_SIZE * 0.02;
  const helmW = TILE_SIZE * 0.7;
  const helmH = TILE_SIZE * 0.22;

  // Banda dorada que cruza la frente
  ctx.translate(helmCenterX, helmCenterY);
  ctx.rotate(Math.atan2(dir.y, dir.x));
  ctx.fillStyle = GOLD_MAIN;
  ctx.strokeStyle = GOLD_DEEP;
  ctx.lineWidth = 0.9;
  roundRect(ctx, -helmW / 2, -helmH / 2 - TILE_SIZE * 0.15, helmW, helmH, 2);
  ctx.fill();
  ctx.stroke();

  // Franja clara superior
  ctx.fillStyle = GOLD_PALE;
  ctx.globalAlpha = 0.7;
  roundRect(ctx, -helmW / 2 + 1, -helmH / 2 - TILE_SIZE * 0.15 + 1, helmW - 2, helmH * 0.4, 1);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Gema central jade sobre la banda
  ctx.fillStyle = JADE_EYE;
  ctx.shadowColor = JADE_EYE;
  ctx.shadowBlur = isGolden ? 7 : 4;
  ctx.beginPath();
  ctx.moveTo(0, -helmH / 2 - TILE_SIZE * 0.15 - 2);
  ctx.lineTo(2.5, -helmH / 2 - TILE_SIZE * 0.15 + 1.5);
  ctx.lineTo(0, -helmH / 2 - TILE_SIZE * 0.15 + 5);
  ctx.lineTo(-2.5, -helmH / 2 - TILE_SIZE * 0.15 + 1.5);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = GOLD_PALE;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Remaches laterales
  ctx.fillStyle = GOLD_DEEP;
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(side * helmW * 0.35, -helmH / 2 - TILE_SIZE * 0.15 + helmH / 2, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // === OJOS ===
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
      ctx.fillStyle = '#0e1a14';
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW / 2 + 0.6, eyeH / 2 + 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = JADE_EYE;
      ctx.shadowColor = JADE_EYE;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // Pupila vertical (serpiente)
      ctx.fillStyle = '#0e1a14';
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW * 0.1, eyeH * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      // Brillo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.ellipse(gcx - 0.8, gcy - 1, eyeW * 0.22, eyeH * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(gcx + 1, gcy + 0.8, 0.5, 0, Math.PI * 2);
      ctx.fill();
      // Borde dorado
      ctx.strokeStyle = GOLD_MAIN;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(gcx, gcy, eyeW / 2 + 0.6, eyeH / 2 + 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    drawGemEye(e1x, e1y);
    drawGemEye(e2x, e2y);

    // Cejas doradas
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

  // === ROMBOS DECORATIVOS EN LA CABEZA (con detalle extra) ===
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
  // Punto brillante central en el rombo frontal
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(frx, fry, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Rombos laterales
  ctx.fillStyle = GOLD_MAIN;
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

  // === ESCAMAS / PLUMAS LATERALES (las originales) ===
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

  // === COLMILLOS ===
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

  // === LENGUA ===
  const showTongue = protectedFlag || headPulse > 0.6 || isGolden;
  if (showTongue) {
    ctx.save();
    ctx.strokeStyle = isGolden ? '#d4703a' : '#ef5261';
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

// === PENACHO DE KUKULCÁN (se dibuja DESPUÉS del cuerpo para quedar por encima) ===
function drawKukulkanPlume(rs, dir, protectedFlag) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.34, y: cy - dir.y * TILE_SIZE * 0.34 };

  const isGolden = isImmune || isFuria || guardiansFrozenUntil > gameTime;
  const GOLD_MAIN = isGolden ? '#d4b45c' : '#d5bd70';
  const GOLD_DEEP = isGolden ? '#a8924a' : '#a8843a';
  const GOLD_PALE = isGolden ? '#f5e9b8' : '#fff2c2';
  const JADE_EYE = '#4ec9a0';

  ctx.save();
  ctx.lineCap = 'round';

  // === CRESTA / PLUMAS TRASERAS ===
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

  // === PLUMA CENTRAL ===
  ctx.lineWidth = 3.4;
  ctx.strokeStyle = GOLD_PALE;
  const centerLen = 22;
  const tipCX = rear.x - dir.x * centerLen;
  const tipCY = rear.y - dir.y * centerLen;
  ctx.beginPath();
  ctx.moveTo(rear.x, rear.y);
  ctx.lineTo(tipCX, tipCY);
  ctx.stroke();

  ctx.fillStyle = protectedFlag || isGolden ? JADE_EYE : '#ef5261';
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
}

// =================== GUARDIANES ===================
function drawGuardianHead(rs, guardian) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const dir = guardian.direction || { x: 1, y: 0 };
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.35, y: cy - dir.y * TILE_SIZE * 0.35 };

  if (guardian.behavior.id === 'ambusher') {
    drawTezcatlipoca(rs, guardian, cx, cy, dir, perp, rear);
    return;
  }

  const pal = guardian.palette;
  const type = guardian.behavior.id;

  // === OJOS COMUNES ===
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

  // ==================== CAZADOR ====================
  if (type === 'hunter') {
    ctx.save();

    // === CABEZA DE JAGUAR (bloque base redondeado) ===
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill();
    ctx.stroke();

    // Orejas triangulares (a los lados traseros)
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    for (let side = -1; side <= 1; side += 2) {
      const earX = cx - dir.x * TILE_SIZE * 0.15 + perp.x * side * TILE_SIZE * 0.35;
      const earY = cy - dir.y * TILE_SIZE * 0.15 + perp.y * side * TILE_SIZE * 0.35;
      ctx.beginPath();
      ctx.moveTo(earX, earY);
      ctx.lineTo(earX - dir.x * TILE_SIZE * 0.05 + perp.x * side * TILE_SIZE * 0.15, earY - dir.y * TILE_SIZE * 0.05 + perp.y * side * TILE_SIZE * 0.15);
      ctx.lineTo(earX - dir.x * TILE_SIZE * 0.25 - perp.x * side * TILE_SIZE * 0.05, earY - dir.y * TILE_SIZE * 0.25 - perp.y * side * TILE_SIZE * 0.05);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Interior de la oreja
      ctx.fillStyle = pal.crest;
      ctx.beginPath();
      ctx.moveTo(earX, earY);
      ctx.lineTo(earX - dir.x * TILE_SIZE * 0.07 + perp.x * side * TILE_SIZE * 0.09, earY - dir.y * TILE_SIZE * 0.07 + perp.y * side * TILE_SIZE * 0.09);
      ctx.lineTo(earX - dir.x * TILE_SIZE * 0.16 - perp.x * side * TILE_SIZE * 0.03, earY - dir.y * TILE_SIZE * 0.16 - perp.y * side * TILE_SIZE * 0.03);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = pal.head;
    }

    // Manchas de jaguar alrededor de los ojos
    for (let side = -1; side <= 1; side += 2) {
      const rx = cx + dir.x * TILE_SIZE * 0.1 + perp.x * side * TILE_SIZE * 0.22;
      const ry = cy + dir.y * TILE_SIZE * 0.1 + perp.y * side * TILE_SIZE * 0.22;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.arc(rx, ry, TILE_SIZE * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.head;
      ctx.beginPath();
      ctx.arc(rx, ry, TILE_SIZE * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hocico
    ctx.fillStyle = pal.crest;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.8;
    roundRect(
      ctx,
      cx + dir.x * TILE_SIZE * 0.18 - TILE_SIZE * 0.12,
      cy + dir.y * TILE_SIZE * 0.18 - TILE_SIZE * 0.1,
      TILE_SIZE * 0.24,
      TILE_SIZE * 0.2,
      3
    );
    ctx.fill();
    ctx.stroke();

    // Nariz triangular
    ctx.fillStyle = '#1a1008';
    ctx.beginPath();
    ctx.moveTo(cx + dir.x * TILE_SIZE * 0.35, cy + dir.y * TILE_SIZE * 0.35);
    ctx.lineTo(cx + dir.x * TILE_SIZE * 0.22 + perp.x * 2, cy + dir.y * TILE_SIZE * 0.22 + perp.y * 2);
    ctx.lineTo(cx + dir.x * TILE_SIZE * 0.22 - perp.x * 2, cy + dir.y * TILE_SIZE * 0.22 - perp.y * 2);
    ctx.closePath();
    ctx.fill();

    // Colmillos
    ctx.fillStyle = '#fff8dc';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.6;
    for (let side = -1; side <= 1; side += 2) {
      const fx = cx + dir.x * TILE_SIZE * 0.28 + perp.x * side * 4;
      const fy = cy + dir.y * TILE_SIZE * 0.28 + perp.y * side * 4;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + dir.x * 4, fy + dir.y * 4);
      ctx.lineTo(fx + perp.x * side * 1.5, fy + perp.y * side * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Bigotes
    ctx.strokeStyle = pal.crest;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.6;
    for (let side = -1; side <= 1; side += 2) {
      for (let w = 0; w < 2; w++) {
        ctx.beginPath();
        ctx.moveTo(cx + dir.x * TILE_SIZE * 0.25 + perp.x * side * 3, cy + dir.y * TILE_SIZE * 0.25 + perp.y * side * 3 + w * 1.5);
        ctx.lineTo(cx + dir.x * TILE_SIZE * 0.5 + perp.x * side * 5, cy + dir.y * TILE_SIZE * 0.5 + perp.y * side * 5 + w * 1.5);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Máscara funeraria (banda roja sobre la frente)
    ctx.strokeStyle = '#9b2929';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - dir.x * TILE_SIZE * 0.2 + perp.x * TILE_SIZE * 0.35, cy - dir.y * TILE_SIZE * 0.2 + perp.y * TILE_SIZE * 0.35);
    ctx.lineTo(cx - dir.x * TILE_SIZE * 0.2 - perp.x * TILE_SIZE * 0.35, cy - dir.y * TILE_SIZE * 0.2 - perp.y * TILE_SIZE * 0.35);
    ctx.stroke();

    // Gema central en la máscara
    ctx.fillStyle = '#fff0c6';
    ctx.beginPath();
    ctx.arc(cx - dir.x * TILE_SIZE * 0.2, cy - dir.y * TILE_SIZE * 0.2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Ojos
    ctx.fillStyle = pal.eye;
    ctx.fillRect(e1x, e1y, es, es);
    ctx.fillRect(e2x, e2y, es, es);
    ctx.fillStyle = '#1a1008';
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) {
      ctx.fillRect(eye.x + 1.5, eye.y + 0.5, 1, 3);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(e1x, e1y, es, es);
    ctx.strokeRect(e2x, e2y, es, es);
  }

  // ==================== VIDENTE ====================
  else if (type === 'interceptor') {
    ctx.save();

    // === CABEZA BASE (bloque redondeado, sin forma de cráneo) ===
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill();
    ctx.stroke();

    // Tercer ojo de obsidiana (rombo frontal)
    const thirdEyeX = cx + dir.x * TILE_SIZE * 0.12;
    const thirdEyeY = cy + dir.y * TILE_SIZE * 0.12;
    ctx.fillStyle = '#1a0830';
    ctx.beginPath();
    ctx.moveTo(thirdEyeX, thirdEyeY - 3.5);
    ctx.lineTo(thirdEyeX + 3, thirdEyeY);
    ctx.lineTo(thirdEyeX, thirdEyeY + 3.5);
    ctx.lineTo(thirdEyeX - 3, thirdEyeY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = pal.crest;
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.fillStyle = '#f0e0ff';
    ctx.beginPath();
    ctx.arc(thirdEyeX, thirdEyeY, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Tocado de plumas largas
    ctx.strokeStyle = pal.crest;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let f = -1; f <= 1; f++) {
      const baseX = rear.x + perp.x * f * 3.5;
      const baseY = rear.y + perp.y * f * 3.5;
      const len = 20 - Math.abs(f) * 3;
      const tipX = rear.x - dir.x * len + perp.x * (f * 5);
      const tipY = rear.y - dir.y * len + perp.y * (f * 5);
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      ctx.fillStyle = pal.crest;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orejeras mayas
    for (let side = -1; side <= 1; side += 2) {
      const orX = cx + perp.x * side * TILE_SIZE * 0.32 - dir.x * TILE_SIZE * 0.05;
      const orY = cy + perp.y * side * TILE_SIZE * 0.32 - dir.y * TILE_SIZE * 0.05;
      ctx.fillStyle = '#1a0830';
      ctx.strokeStyle = pal.crest;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(orX, orY, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4ec9a0';
      ctx.beginPath();
      ctx.arc(orX, orY, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Ojos en rombo
    ctx.fillStyle = pal.eye;
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) {
      const ecx = eye.x + 2;
      const ecy = eye.y + 2;
      ctx.beginPath();
      ctx.moveTo(ecx, ecy - 3);
      ctx.lineTo(ecx + 3, ecy);
      ctx.lineTo(ecx, ecy + 3);
      ctx.lineTo(ecx - 3, ecy);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) {
      const ecx = eye.x + 2;
      const ecy = eye.y + 2;
      ctx.beginPath();
      ctx.moveTo(ecx, ecy - 3);
      ctx.lineTo(ecx + 3, ecy);
      ctx.lineTo(ecx, ecy + 3);
      ctx.lineTo(ecx - 3, ecy);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // ==================== FLANQUEADOR ====================
  else if (type === 'flanker') {
    ctx.save();

    // === CABEZA BASE (bloque redondeado) ===
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill();
    ctx.stroke();

    // Nariz ganchuda prominente
    ctx.fillStyle = pal.body;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    const noseTipX = cx + dir.x * TILE_SIZE * 0.48;
    const noseTipY = cy + dir.y * TILE_SIZE * 0.48;
    const noseBaseX = cx + dir.x * TILE_SIZE * 0.25;
    const noseBaseY = cy + dir.y * TILE_SIZE * 0.25;
    ctx.moveTo(noseBaseX + perp.x * 2.5, noseBaseY + perp.y * 2.5);
    ctx.lineTo(noseTipX, noseTipY);
    ctx.lineTo(noseBaseX - perp.x * 2.5, noseBaseY - perp.y * 2.5);
    ctx.lineTo(noseBaseX - perp.x * 1, noseBaseY - perp.y * 1);
    ctx.lineTo(noseBaseX + perp.x * 1, noseBaseY + perp.y * 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Orificio de la nariz
    ctx.fillStyle = '#1a0806';
    ctx.beginPath();
    ctx.arc(noseTipX - dir.x * 2, noseTipY - dir.y * 2, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Mandíbula expuesta
    ctx.fillStyle = pal.body;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.7;
    roundRect(
      ctx,
      cx + dir.x * TILE_SIZE * 0.05 - TILE_SIZE * 0.14,
      cy + dir.y * TILE_SIZE * 0.05 - TILE_SIZE * 0.06,
      TILE_SIZE * 0.28,
      TILE_SIZE * 0.16,
      2
    );
    ctx.fill();
    ctx.stroke();

    // Dientes expuestos
    ctx.fillStyle = '#fff8dc';
    for (let i = 0; i < 3; i++) {
      const dx = cx + dir.x * TILE_SIZE * (0.08 + i * 0.07) + perp.x * 0;
      const dy = cy + dir.y * TILE_SIZE * (0.08 + i * 0.07) + perp.y * 0;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + dir.x * 2 + perp.x * 1, dy + dir.y * 2 + perp.y * 1);
      ctx.lineTo(dx + perp.x * 2, dy + perp.y * 2);
      ctx.closePath();
      ctx.fill();
    }

    // Plumas de quetzal laterales
    ctx.strokeStyle = pal.crest;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    for (let side = -1; side <= 1; side += 2) {
      for (let f = -1; f <= 1; f++) {
        const baseX = cx - dir.x * TILE_SIZE * 0.15 + perp.x * side * TILE_SIZE * 0.32;
        const baseY = cy - dir.y * TILE_SIZE * 0.15 + perp.y * side * TILE_SIZE * 0.32;
        const len = 14 - Math.abs(f) * 2;
        const tipX = baseX - dir.x * len + perp.x * side * (6 + f * 1.5);
        const tipY = baseY - dir.y * len + perp.y * side * (6 + f * 1.5);
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        ctx.fillStyle = pal.crest;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Orejeras de jade
    for (let side = -1; side <= 1; side += 2) {
      const orX = cx + perp.x * side * TILE_SIZE * 0.34 - dir.x * TILE_SIZE * 0.08;
      const orY = cy + perp.y * side * TILE_SIZE * 0.34 - dir.y * TILE_SIZE * 0.08;
      ctx.fillStyle = '#4ec9a0';
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(orX, orY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff0b0';
      ctx.beginPath();
      ctx.arc(orX, orY, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Ojos
    ctx.fillStyle = pal.eye;
    ctx.fillRect(e1x, e1y, es, es);
    ctx.fillRect(e2x, e2y, es, es);
    ctx.fillStyle = '#1a0806';
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) {
      ctx.fillRect(eye.x + 1.5, eye.y + 0.5, 1, 3);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(e1x, e1y, es, es);
    ctx.strokeRect(e2x, e2y, es, es);
  }
}

// ==== TEZCATLIPOCA — JAGUAR GEOMÉTRICO ====
function drawTezcatlipoca(rs, guardian, cx, cy, dir, perp, rear) {
  const pal = guardian.palette;
  const time = gameTime;
  const pulse = Math.sin(time * 0.004) * 0.5 + 0.5;
  const angle = Math.atan2(dir.y, dir.x);

  ctx.save();

  // === AURA DE OBSIDIANA ===
  const auraR = TILE_SIZE * 1.9;
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR);
  aura.addColorStop(0, `rgba(217, 142, 43, ${0.28 + pulse * 0.12})`);
  aura.addColorStop(0.5, 'rgba(168, 86, 27, 0.18)');
  aura.addColorStop(1, 'rgba(20, 17, 15, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
  ctx.fill();

  // === CUERPO GEOMÉTRICO (BLOQUES) ===
  // Dibujamos el cuerpo como 4 segmentos rectangulares gruesos que se estrechan
  const bodySegments = 4;
  const bodyStepX = -dir.x * TILE_SIZE * 0.55;
  const bodyStepY = -dir.y * TILE_SIZE * 0.55;
  for (let i = bodySegments; i >= 1; i--) {
    const t = i / bodySegments;
    const segX = cx + bodyStepX * i;
    const segY = cy + bodyStepY * i;
    const segW = TILE_SIZE * (0.78 - t * 0.28);
    const segH = TILE_SIZE * (0.6 - t * 0.2);

    ctx.save();
    ctx.translate(segX, segY);
    ctx.rotate(angle);

    // Bloque del cuerpo (ámbar o naranja quemado alternado)
    ctx.fillStyle = i % 2 === 0 ? pal.head : pal.body;
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 1.4;
    roundRect(ctx, -segW / 2, -segH / 2, segW, segH, 3);
    ctx.fill();
    ctx.stroke();

    // Roseta de obsidiana (rombo) en el centro del segmento
    ctx.fillStyle = pal.obsidian;
    ctx.beginPath();
    const rs2 = segH * 0.22;
    ctx.moveTo(0, -rs2);
    ctx.lineTo(rs2 * 0.8, 0);
    ctx.lineTo(0, rs2);
    ctx.lineTo(-rs2 * 0.8, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // === 4 PATAS ===
  // Patas dibujadas como pequeños bloques a los lados del cuerpo
  for (let side = -1; side <= 1; side += 2) {
    for (let p = 0; p < 2; p++) {
      const offset = (p === 0 ? 0.5 : 1.5);
      const pawX = cx - dir.x * TILE_SIZE * offset + perp.x * side * TILE_SIZE * 0.55;
      const pawY = cy - dir.y * TILE_SIZE * offset + perp.y * side * TILE_SIZE * 0.55;

      ctx.save();
      ctx.translate(pawX, pawY);
      ctx.rotate(angle);

      // Pata (bloque rectangular)
      ctx.fillStyle = pal.body;
      ctx.strokeStyle = pal.obsidian;
      ctx.lineWidth = 1.1;
      roundRect(ctx, -TILE_SIZE * 0.12, -TILE_SIZE * 0.18, TILE_SIZE * 0.3, TILE_SIZE * 0.36, 2);
      ctx.fill();
      ctx.stroke();

      // Garra (pequeño triángulo ámbar)
      ctx.fillStyle = pal.head;
      ctx.beginPath();
      ctx.moveTo(TILE_SIZE * 0.18, -TILE_SIZE * 0.14);
      ctx.lineTo(TILE_SIZE * 0.28, 0);
      ctx.lineTo(TILE_SIZE * 0.18, TILE_SIZE * 0.14);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  // === COLA DE SERPIENTE ===
  // Cola curva que sale de la parte trasera del cuerpo con segmentos pequeños
  const tailBaseX = cx - dir.x * TILE_SIZE * 2.4;
  const tailBaseY = cy - dir.y * TILE_SIZE * 2.4;
  const tailWave = Math.sin(time * 0.008) * 2.5;

  // Segmentos de la cola (5 bloquecitos que se van curvando)
  for (let i = 0; i < 5; i++) {
    const tt = i / 4;
    const wave = Math.sin(time * 0.008 + i * 0.8) * 2.5;
    const tailX = tailBaseX - dir.x * TILE_SIZE * 0.35 * i + perp.x * wave;
    const tailY = tailBaseY - dir.y * TILE_SIZE * 0.35 * i + perp.y * wave;
    const tailSize = TILE_SIZE * (0.42 - tt * 0.22);

    ctx.save();
    ctx.translate(tailX, tailY);
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 === 0 ? pal.head : pal.body;
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 1;
    roundRect(ctx, -tailSize / 2, -tailSize / 2, tailSize, tailSize, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Punta de la cola: rombo de obsidiana (como punta de flecha)
  const tipTailX = tailBaseX - dir.x * TILE_SIZE * 1.75 + perp.x * tailWave;
  const tipTailY = tailBaseY - dir.y * TILE_SIZE * 1.75 + perp.y * tailWave;
  ctx.save();
  ctx.translate(tipTailX, tipTailY);
  ctx.rotate(angle);
  ctx.fillStyle = pal.obsidian;
  ctx.strokeStyle = pal.head;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(TILE_SIZE * 0.25, 0);
  ctx.lineTo(0, -TILE_SIZE * 0.22);
  ctx.lineTo(-TILE_SIZE * 0.35, 0);
  ctx.lineTo(0, TILE_SIZE * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // === CORONA DE PLUMAS RADIANTES ===
  // Plumas dispuestas en abanico alrededor de la parte superior de la cabeza
  ctx.save();
  const crownCenterX = cx - dir.x * TILE_SIZE * 0.05;
  const crownCenterY = cy - dir.y * TILE_SIZE * 0.05;
  const plumeCount = 9;
  for (let p = 0; p < plumeCount; p++) {
    const tt = (p / (plumeCount - 1)) - 0.5; // -0.5 a 0.5
    const plumeAngle = angle + tt * Math.PI * 0.9;
    const plumeLen = TILE_SIZE * (0.9 - Math.abs(tt) * 0.35);
    const baseX = crownCenterX + Math.cos(plumeAngle) * TILE_SIZE * 0.35;
    const baseY = crownCenterY + Math.sin(plumeAngle) * TILE_SIZE * 0.35;
    const tipX = crownCenterX + Math.cos(plumeAngle) * (TILE_SIZE * 0.35 + plumeLen);
    const tipY = crownCenterY + Math.sin(plumeAngle) * (TILE_SIZE * 0.35 + plumeLen);

    // Forma de hoja/pluma (rombo alargado)
    const perpP = { x: -Math.sin(plumeAngle), y: Math.cos(plumeAngle) };
    const leafW = TILE_SIZE * 0.14;

    ctx.fillStyle = p % 2 === 0 ? pal.head : pal.body;
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX + perpP.x * leafW, tipY + perpP.y * leafW);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(tipX - perpP.x * leafW, tipY - perpP.y * leafW);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Nervadura central de la pluma
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
  }
  ctx.restore();

  // === CABEZA GEOMÉTRICA DE JAGUAR ===
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Base de la cabeza (bloque cuadrado con esquinas redondeadas)
  const headSize = TILE_SIZE * 0.82;
  ctx.fillStyle = pal.head;
  ctx.strokeStyle = pal.obsidian;
  ctx.lineWidth = 1.6;
  roundRect(ctx, -headSize / 2, -headSize / 2, headSize, headSize, 4);
  ctx.fill();
  ctx.stroke();

  // Orejas triangulares (arriba, a los lados)
  for (let side = -1; side <= 1; side += 2) {
    const earX = side * headSize * 0.34;
    const earY = -headSize * 0.5;
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(earX - TILE_SIZE * 0.12, earY + TILE_SIZE * 0.05);
    ctx.lineTo(earX, earY - TILE_SIZE * 0.22);
    ctx.lineTo(earX + TILE_SIZE * 0.12, earY + TILE_SIZE * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Interior de la oreja
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.moveTo(earX - TILE_SIZE * 0.05, earY + TILE_SIZE * 0.02);
    ctx.lineTo(earX, earY - TILE_SIZE * 0.12);
    ctx.lineTo(earX + TILE_SIZE * 0.05, earY + TILE_SIZE * 0.02);
    ctx.closePath();
    ctx.fill();
  }

  // Manchas de obsidiana alrededor de los ojos (rosetas)
  for (let side = -1; side <= 1; side += 2) {
    ctx.fillStyle = pal.obsidian;
    ctx.beginPath();
    ctx.arc(side * headSize * 0.26, 0, headSize * 0.16, 0, Math.PI * 2);
    ctx.fill();
    // Punto ámbar interior
    ctx.fillStyle = pal.head;
    ctx.beginPath();
    ctx.arc(side * headSize * 0.26, 0, headSize * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ojos (rombos verdes/ámbar brillantes)
  for (let side = -1; side <= 1; side += 2) {
    const eyeX = side * headSize * 0.24;
    const eyeY = 0;
    ctx.fillStyle = '#4ec9a0';
    ctx.shadowColor = '#4ec9a0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY - headSize * 0.09);
    ctx.lineTo(eyeX + headSize * 0.08, eyeY);
    ctx.lineTo(eyeX, eyeY + headSize * 0.09);
    ctx.lineTo(eyeX - headSize * 0.08, eyeY);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pupila vertical (obsidiana)
    ctx.fillStyle = pal.obsidian;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, headSize * 0.018, headSize * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nariz (triángulo invertido de obsidiana)
  ctx.fillStyle = pal.obsidian;
  ctx.beginPath();
  ctx.moveTo(0, headSize * 0.05);
  ctx.lineTo(headSize * 0.07, headSize * 0.18);
  ctx.lineTo(-headSize * 0.07, headSize * 0.18);
  ctx.closePath();
  ctx.fill();

  // Hocico (bloque más claro debajo de la nariz)
  ctx.fillStyle = pal.ember;
  ctx.strokeStyle = pal.obsidian;
  ctx.lineWidth = 0.8;
  roundRect(ctx, -headSize * 0.18, headSize * 0.18, headSize * 0.36, headSize * 0.16, 2);
  ctx.fill();
  ctx.stroke();

  // Colmillos triangulares
  for (let side = -1; side <= 1; side += 2) {
    ctx.fillStyle = '#f5efdc';
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(side * headSize * 0.12, headSize * 0.34);
    ctx.lineTo(side * headSize * 0.18, headSize * 0.5);
    ctx.lineTo(side * headSize * 0.06, headSize * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Bigotes (líneas de obsidiana)
  ctx.strokeStyle = pal.obsidian;
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.7;
  for (let side = -1; side <= 1; side += 2) {
    for (let w = 0; w < 2; w++) {
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.18, headSize * 0.22 + w * headSize * 0.05);
      ctx.lineTo(side * headSize * 0.5, headSize * 0.24 + w * headSize * 0.05);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  ctx.restore();

  // === HUMO DE OBSIDIANA (teletransporte) ===
  if (guardian.smokeParticles) {
    guardian.smokeParticles.forEach(sp => {
      const age = (gameTime - sp.bornAt) / 800;
      if (age > 1) return;
      ctx.fillStyle = `rgba(20, 17, 15, ${0.5 * (1 - age)})`;
      ctx.beginPath();
      ctx.arc(
        sp.x * TILE_SIZE + TILE_SIZE / 2,
        sp.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE * 0.4 * (1 + age),
        0, Math.PI * 2
      );
      ctx.fill();
    });
  }

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

  airFoods.forEach(af => {
    const cx = af.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = af.y * TILE_SIZE + TILE_SIZE / 2;
    const r = Math.max(5, TILE_SIZE / 2 - 2 + pulse * 0.3);
    ctx.save();
    const glowR = r + 7 + Math.sin(gameTime * 0.009) * 3;
    const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, glowR);
    grad.addColorStop(0, 'rgba(179, 229, 255, 0.7)');
    grad.addColorStop(0.6, 'rgba(140, 200, 240, 0.35)');
    grad.addColorStop(1, 'rgba(140, 200, 240, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(cx, cy);
    ctx.rotate(gameTime * 0.003);
    ctx.strokeStyle = '#d9f0ff';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    for (let s = 0; s < 3; s++) {
      const baseAngle = (s / 3) * Math.PI * 2;
      ctx.beginPath();
      for (let t = 0; t < 12; t++) {
        const tt = t / 11;
        const angle = baseAngle + tt * Math.PI * 1.6;
        const rad = r * (0.25 + tt * 0.85);
        const px = Math.cos(angle) * rad;
        const py = Math.sin(angle) * rad;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b3e5ff';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

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

  // Guardianes con interpolación individual
  enemyGuardians.forEach(guardian => {
    const hitAt = guardian.cosmicOrderHitAt;
    guardian.segments.forEach((seg, idx) => {
      const isHead = idx === 0;
      const wobbleX = hitAt === undefined ? 0 : Math.sin((gameTime - hitAt) * 0.065 + idx * 1.2) * 2.5;
      const wobbleY = hitAt === undefined ? 0 : Math.cos((gameTime - hitAt) * 0.065 + idx * 1.2) * 1.5;

      const previousSegments = previousGuardianPositions.get(guardian.id);
      let progress = interpolation;
      // Si el guardián se ha movido en este tick, interpolamos; si no, usamos 1
      if (guardian.lastMoveTick === guardian.tickCounter) {
        progress = interpolation;
      } else {
        progress = 1;
      }
      const renderSegment = interpolateGridPosition(
        seg,
        previousSegments?.[idx] || previousSegments?.[previousSegments.length - 1],
        progress
      );
      renderSegment.x += wobbleX / TILE_SIZE;
      renderSegment.y += wobbleY / TILE_SIZE;

      const fillColor = hitAt !== undefined && Math.floor((gameTime - hitAt) / 100) % 2 === 0
        ? '#f5e5ad'
        : isHead ? guardian.palette.head : guardian.palette.body;

      // Estrechamiento hacia la cola
      const tailFactor = 1 - (idx / guardian.segments.length) * 0.5;
      const segSize = TILE_SIZE * tailFactor;

      ctx.fillStyle = fillColor;

      // Forma de la cabeza según dirección
      if (isHead) {
        roundRect(
          ctx,
          renderSegment.x * TILE_SIZE + (TILE_SIZE - segSize) / 2,
          renderSegment.y * TILE_SIZE + (TILE_SIZE - segSize) / 2,
          segSize,
          segSize,
          8
        );
      } else {
        roundRect(
          ctx,
          renderSegment.x * TILE_SIZE + (TILE_SIZE - segSize) / 2,
          renderSegment.y * TILE_SIZE + (TILE_SIZE - segSize) / 2,
          segSize,
          segSize,
          4
        );
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      if (!isHead) {
        drawFeatherScale(renderSegment, idx, guardian);
      } else {
        drawGuardianHead(renderSegment, guardian);
      }
    });

    // Indicador de objetivo
    if (guardian.targetIndicator) {
      const ti = guardian.targetIndicator;
      const tx = ti.x * TILE_SIZE + TILE_SIZE / 2;
      const ty = ti.y * TILE_SIZE + TILE_SIZE / 2;
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = guardian.palette.head;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 5]);
      const head = guardian.segments[0];
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(tx, ty, TILE_SIZE * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

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

  // === ESTADO DORADO DE KUKULCÁN ===
  const isGolden = isImmune || isFuria || guardiansFrozenUntil > gameTime;
  const KUKULKAN_HEAD = isGolden ? '#b8a668' : '#4ec9a0';
  const KUKULKAN_BODY = isGolden ? '#9c8a4a' : '#1a7a5e';
  const KUKULKAN_BORDER = isGolden ? '#d4c488' : 'rgba(213, 189, 112, 0.55)';
  const KUKULKAN_INNER = isGolden ? 'rgba(245, 235, 190, 0.4)' : 'rgba(182, 242, 209, 0.28)';
  const KUKULKAN_PLATE = isGolden ? '#c2b06a' : null;

  // === AURA VERDE (protección de plumas / respawn) ===
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

  // === AURA DORADA MUY SUTIL (inmunidad / furia / hielo) ===
  if (isGolden && snake.length > 0) {
    const headSeg = snake[0];
    const headRS = interpolateGridPosition(headSeg, previousSnakePositions[0], interpolation);
    const hx = headRS.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = headRS.y * TILE_SIZE + TILE_SIZE / 2;
    const flick = Math.sin(gameTime * 0.015) * 0.5 + 0.5;
    const auraR = TILE_SIZE * (1.2 + flick * 0.2);
    const goldenAura = ctx.createRadialGradient(hx, hy, TILE_SIZE * 0.4, hx, hy, auraR);
    goldenAura.addColorStop(0, `rgba(200, 175, 105, ${0.12 + flick * 0.06})`);
    goldenAura.addColorStop(0.6, `rgba(160, 140, 80, ${0.05 + flick * 0.04})`);
    goldenAura.addColorStop(1, 'rgba(160, 140, 80, 0)');
    ctx.fillStyle = goldenAura;
    ctx.beginPath();
    ctx.arc(hx, hy, auraR, 0, Math.PI * 2);
    ctx.fill();

    // Partículas doradas orbitando (muy espaciadas)
    if (updateEffects && Math.random() < 0.15) {
      const a = Math.random() * Math.PI * 2;
      const r = TILE_SIZE * (0.9 + Math.random() * 0.5);
      particles.push({
        x: hx + Math.cos(a) * r,
        y: hy + Math.sin(a) * r,
        vx: Math.cos(a) * 0.25,
        vy: Math.sin(a) * 0.25 - 0.2,
        size: 1 + Math.random() * 0.8,
        color: ['#d4c488', '#b8a668', '#4ec9a0'][Math.floor(Math.random() * 3)],
        alpha: 0.6, decay: 0.03
      });
    }
  }

  // === AURA DE FURIA (roja/naranja, también suavizada) ===
  if (isFuria && snake.length > 0) {
    const headSeg = snake[0];
    const headRS = interpolateGridPosition(headSeg, previousSnakePositions[0], interpolation);
    const hx = headRS.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = headRS.y * TILE_SIZE + TILE_SIZE / 2;
    const flick = Math.sin(gameTime * 0.03) * 0.5 + 0.5;
    const auraR = TILE_SIZE * (1.2 + flick * 0.2);
    const furiaAura = ctx.createRadialGradient(hx, hy, TILE_SIZE * 0.4, hx, hy, auraR);
    furiaAura.addColorStop(0, 'rgba(255, 140, 60, 0.10)');
    furiaAura.addColorStop(1, 'rgba(255, 140, 60, 0)');
    ctx.fillStyle = furiaAura;
    ctx.beginPath();
    ctx.arc(hx, hy, auraR, 0, Math.PI * 2);
    ctx.fill();
  }

  // === DIBUJAR CADA SEGMENTO DE KUKULCÁN ===
  snake.forEach((seg, idx) => {
    const isHead = idx === 0;
    const rs = interpolateGridPosition(
      seg,
      previousSnakePositions[idx] || previousSnakePositions[previousSnakePositions.length - 1],
      interpolation
    );

    if (!isHead) {
      // === CUERPO ===
      ctx.fillStyle = KUKULKAN_BODY;
      roundRect(
        ctx,
        rs.x * TILE_SIZE + 1,
        rs.y * TILE_SIZE + 1,
        TILE_SIZE - 2,
        TILE_SIZE - 2,
        5
      );
      ctx.fill();

      ctx.save();

      // === PLACAS DE ARMADURA (cuando está dorado) ===
      if (isGolden) {
        ctx.fillStyle = KUKULKAN_PLATE;
        roundRect(
          ctx,
          rs.x * TILE_SIZE + 2.5,
          rs.y * TILE_SIZE + 2,
          TILE_SIZE - 5,
          TILE_SIZE * 0.4,
          3
        );
        ctx.fill();
        ctx.strokeStyle = KUKULKAN_BORDER;
        ctx.lineWidth = 0.7;
        roundRect(
          ctx,
          rs.x * TILE_SIZE + 2.5,
          rs.y * TILE_SIZE + 2,
          TILE_SIZE - 5,
          TILE_SIZE * 0.4,
          3
        );
        ctx.stroke();

        // Remaches más discretos
        ctx.fillStyle = '#8a7a4a';
        const rivetR = 0.7;
        const rxs = [rs.x * TILE_SIZE + 4, rs.x * TILE_SIZE + TILE_SIZE - 4];
        const rys = [rs.y * TILE_SIZE + 4, rs.y * TILE_SIZE + TILE_SIZE * 0.4 - 1];
        for (const rx of rxs) {
          for (const ry of rys) {
            ctx.beginPath();
            ctx.arc(rx, ry, rivetR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Borde del segmento
      ctx.strokeStyle = KUKULKAN_BORDER;
      ctx.lineWidth = isGolden ? 1.2 : 1;
      roundRect(
        ctx,
        rs.x * TILE_SIZE + 1.5,
        rs.y * TILE_SIZE + 1.5,
        TILE_SIZE - 3,
        TILE_SIZE - 3,
        5
      );
      ctx.stroke();

      // Brillo interior superior (más tenue)
      ctx.strokeStyle = KUKULKAN_INNER;
      ctx.lineWidth = isGolden ? 0.9 : 0.8;
      ctx.beginPath();
      ctx.moveTo(rs.x * TILE_SIZE + 3, rs.y * TILE_SIZE + 2.5);
      ctx.lineTo(rs.x * TILE_SIZE + TILE_SIZE - 3, rs.y * TILE_SIZE + 2.5);
      ctx.stroke();
      ctx.restore();

      // Rombo decorativo con destellos
      drawBodyDiamond(rs, idx, isGolden);

       } else {
      // === CABEZA (sin penacho) ===
      drawKukulkanHead(rs, direction, playerProtected, isBlinking);
    }

    // Pulso alrededor de la cabeza
    if (isHead && headPulse > 0) {
      const pR = TILE_SIZE * 0.5 + 3 + (1 - headPulse) * 8;
      ctx.save();
      ctx.strokeStyle = headPulseColor;
      ctx.lineWidth = 1.8 * headPulse;
      ctx.globalAlpha = headPulse * 0.7;
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

  // === SEGUNDA PASADA: PENACHO DE KUKULCÁN (por encima del cuerpo) ===
  if (snake.length > 0) {
    const headSeg = snake[0];
    const headRS = interpolateGridPosition(headSeg, previousSnakePositions[0], interpolation);
    drawKukulkanPlume(headRS, direction, playerProtected);
  }

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

  // ⚠️ IMPORTANTE: aplicar reglas del modo DESPUÉS de resetGame()
  // porque resetGame() ya no toca las vidas.
  gameTime = 0;
  applyGameModeRules();

  simulationAccumulator = 0;
  renderInterpolation = 1;
  isGameRunning = true;
  isPaused = false;
  runStartedAt = gameTime;
  runDifficulty = getEffectiveDifficulty();
  runGuardiansDefeated = 0;
  cancelCountdown();
  startCountdown();
  updateFuriaUI();

  dtStartBtn.textContent = '🔄 Reiniciar';
  dtPauseBtn.textContent = '⏸ Pausa';

  tutorialModal.classList.add('hidden');
  introTutorialModal.classList.add('hidden');
  drawerMenu.classList.add('hidden');
  gameOverlay.classList.add('hidden');
  stopWelcomeDemo();
  welcomeScreen.classList.add('hidden');
  document.body.classList.remove('welcome-open', 'tutorial-open', 'gameover-open');

  updateLivesUI();

  startMusic();
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
  updateFuriaUI();
  if (isPaused) {
    stopMusic();
    drawerMenu.classList.remove('hidden');
  } else {
    drawerMenu.classList.add('hidden');
    startMusic();
    startGameLoop();
  }
}

function gameOver(reason = 'Has chocado con tu propio cuerpo.') {
  finishRunStatistics();
  isGameRunning = false;
  cancelCountdown();
  clearFireBreath();
  isFuria = false;
  furiaReadyAt = 0;
  furiaCooldownUntil = 0;
  BadgeManager.setVisible('furia', false);
  airBoostUntil = 0;
  BadgeManager.setVisible('air', false);
  updateFuriaUI();
  enemySpawnAt = null;
  jadeSpawnAt = null;
  freezeSpawnAt = null;
  guardiansFrozenUntil = 0;
  freezeFoods = [];
  airFoods = [];
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
  isOnFire = false;
  fireExpiresAt = 0;
  stopMusic();
  playGameOverSound();
  vibrate([80, 50, 80, 50, 150]);

  overlayReason.textContent = reason;
  finalScoreElement.textContent = score;
  finalLengthElement.textContent = snake.length;
  gameOverlay.classList.remove('hidden');
  document.body.classList.add('gameover-open');
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
  document.body.classList.add('tutorial-open');
  showTutorialStep(1);
}
function closeTutorial() {
  if (tutorialModal.classList.contains('hidden')) return;
  tutorialModal.classList.add('hidden');
  document.body.classList.remove('tutorial-open');
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

function openIntroTutorial() {
  introTutorialModal.classList.remove('hidden');
}
function closeIntroTutorial() {
  introTutorialModal.classList.add('hidden');
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

btnTurbo.addEventListener('pointerdown', e => { e.preventDefault(); triggerFuria(); });

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
  if (e.key === 'Escape' && !introTutorialModal.classList.contains('hidden')) { closeIntroTutorial(); return; }
  if (e.key === 'Escape' && !statisticsModal.classList.contains('hidden')) { closeStatistics(); return; }
  if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
  const isText = e.target instanceof Element && e.target.matches('select, input');
  const isMove = e.key.startsWith('Arrow') || ['w','W','a','A','s','S','d','D'].includes(e.key);
  if (isText && isMove) return;
  if (!isText && (e.key === 'Shift' || (e.key === ' ' && isGameRunning && !isPaused))) {
    triggerFuria();
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
welcomeStartBtn.addEventListener('click', startGame);
welcomeInfoBtn.addEventListener('click', openIntroTutorial);
closeIntroTutorialBtn.addEventListener('click', closeIntroTutorial);
introTutStartBtn.addEventListener('click', () => { closeIntroTutorial(); startGame(); });
introTutorialModal.addEventListener('click', e => { if (e.target === introTutorialModal) closeIntroTutorial(); });

dtStartBtn.addEventListener('click', () => {
  if (!welcomeScreen.classList.contains('hidden')) startGame();
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
  document.body.classList.remove('tutorial-open');
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
// 26. DIFICULTAD Y MODO
// ========================================================
function updateModeUI() {
  const isClassic = gameModeSelect.value === 'classic';
  difficultySelectorBox.style.display = isClassic ? 'flex' : 'none';
  drawerDifficulty.parentElement.style.display = isClassic ? 'flex' : 'none';
  updateThemeColors();
  rebuildBoardCanvas(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2), true);
}

/**
 * Aplica TODAS las reglas del modo de juego actual.
 * Es la ÚNICA autoridad sobre `maxLives` y `lives`.
 * Se debe llamar: al cambiar de modo, al iniciar partida, y al cargar la página.
 */
function applyGameModeRules() {
  const mode = GAME_MODES[gameModeSelect.value] || GAME_MODES.classic;

  maxLives = mode.livesEnabled ? MAX_LIVES : 1;
  lives = maxLives;
  updateLivesUI();

  if (!mode.itemsEnabled) {
    shieldFoods = [];
    freezeFoods = [];
    airFoods = [];
    cosmicOrderFoods = [];
    sacrificeFoods = [];
    skullFoods = [];
    BadgeManager.setVisible('sacrificeOffering', false);
    BadgeManager.setVisible('skullFood', false);
    BadgeManager.setVisible('cosmicOrder', false);
    BadgeManager.setVisible('cosmicOrderFood', false);
    BadgeManager.setVisible('rain', false);
    BadgeManager.setVisible('immunity', false);
    BadgeManager.setVisible('freeze', false);
    sacredRainUntil = 0;
    cosmicOrderResolveAt = null;
    nextSacredRainAt = null;
    nextCosmicOrderSpawnAt = null;
    nextSacrificeSpawnAt = null;
    nextSkullSpawnAt = null;
    freezeSpawnAt = null;
    airSpawnAt = null;
  } else {
    // Re-activar los timers si es necesario
    const profile = getDifficultyProfile();
    if (isGameRunning) {
      nextSacredRainAt = gameTime + profile.rainFirstMs;
      nextCosmicOrderSpawnAt = gameTime + profile.cosmicFirstMs;
      nextSacrificeSpawnAt = gameTime + profile.sacrificeFirstMs;
      nextSkullSpawnAt = gameTime + profile.skullFirstMs;
      freezeSpawnAt = gameTime + FREEZE_FIRST_SPAWN_MS;
      airSpawnAt = gameTime + AIR_FIRST_SPAWN_MS;
    }
  }
}

difficultySelect.addEventListener('change', () => {
  drawerDifficulty.value = difficultySelect.value;
  reconcileGuardianCount();
});
drawerDifficulty.addEventListener('change', () => {
  difficultySelect.value = drawerDifficulty.value;
  reconcileGuardianCount();
});

gameModeSelect.addEventListener('change', () => {
  gameMode = gameModeSelect.value;
  safeSetItem('snakeIoGameMode', gameMode);
  drawerGameMode.value = gameMode;
  updateModeUI();

  if (isGameRunning) {
    startGame();
  } else {
    applyGameModeRules();
  }
});
drawerGameMode.addEventListener('change', () => {
  gameModeSelect.value = drawerGameMode.value;
  gameModeSelect.dispatchEvent(new Event('change'));
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
function buildWelcomeScenario(cols, rows) {
  const sx = 4;
  const yTop = Math.max(1, Math.round(rows * 0.22));
  let yBot = Math.min(rows - 2, rows - 1 - Math.round(rows * 0.22));
  yBot = Math.max(yBot, yTop + 2);
  const yG = Math.round((yTop + yBot) / 2);
  const jx = Math.max(sx + 5, Math.round(cols * 0.62));
  const xTurn = jx - 2;
  const mx = Math.max(sx + 2, Math.min(xTurn - 1, Math.round(cols * 0.36)));
  const last = Math.max(2, cols - 4 - jx);

  welcomeScenario = { sx, yTop, yBot, yG, jx, mx };
  welcomeDemoRoute = [
    { direction: { x: 1, y: 0 },  steps: xTurn - sx },
    { direction: { x: 0, y: 1 },  steps: yBot - yTop },
    { direction: { x: 1, y: 0 },  steps: 2 },
    { direction: { x: 0, y: -1 }, steps: yBot - yG },
    { direction: { x: 1, y: 0 },  steps: last }
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
  welcomeDemoCalloutIndex = 0;
  welcomeDemoCalloutTimer = 0;
  welcomeDemoCallout.textContent = welcomeDemoCalloutMessages[0];
}

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
  welcomeDemoCalloutTimer++;
  if (welcomeDemoCalloutTimer > 40) {
    welcomeDemoCalloutTimer = 0;
    welcomeDemoCalloutIndex = (welcomeDemoCalloutIndex + 1) % welcomeDemoCalloutMessages.length;
    welcomeDemoCallout.textContent = welcomeDemoCalloutMessages[welcomeDemoCalloutIndex];
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
updateStatisticsUI();
showTutorialStep(1);

lives = MAX_LIVES;
updateLivesUI();

// El tutorial integrado ya no se usa en la welcome-screen
// Se ha reemplazado por introTutorialModal

document.body.classList.add('welcome-open');

resetWelcomeDemo();
startWelcomeDemo();
resetGame();

updateLivesUI();

resizeCanvas();
draw();

// Establecer el modo de juego inicial
gameModeSelect.value = gameMode;
drawerGameMode.value = gameMode;
updateModeUI();
gameTime = 0;
applyGameModeRules(); 

// ========================================================
// 30. PWA — CAPTURA DEL EVENTO DE INSTALACIÓN
// ========================================================
(function initPWAInstall() {
  const btns = [
    document.getElementById('pwa-install-btn'),
    document.getElementById('pwa-install-btn-2')
  ].filter(Boolean);

  if (btns.length === 0) {
    console.log('[PWA] No hay botones de instalación en el DOM.');
    return;
  }

  let deferredInstallPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt detectado. Mostrando botones.');
    e.preventDefault();
    deferredInstallPrompt = e;
    btns.forEach(btn => btn.classList.remove('hidden'));
  });

  btns.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        console.log('[PWA] No hay prompt de instalación pendiente.');
        return;
      }
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      console.log(`[PWA] Instalación: ${outcome}`);
      deferredInstallPrompt = null;
      btns.forEach(b => b.classList.add('hidden'));
    });
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] ¡Kukulcán instalado!');
    btns.forEach(btn => btn.classList.add('hidden'));
    deferredInstallPrompt = null;
  });
})();