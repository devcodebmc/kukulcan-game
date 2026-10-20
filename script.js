// ========================================================
// LA TRAVESÍA DE KUKULCÁN — script.js (v16 FINAL)
// ========================================================
// CAMBIOS v16:
// - Diluvio rediseñado: charcos circulares aleatorios que se retiran solos
// - Desafío Diario con 9 reglas rotativas + recompensa
// - Todos los dibujos originales intactos (Cipactli, Tezcatlipoca, maíz, jade...)
// - playAchievementSound incluido
// - Contadores de campaña en tiempo real
// - Correcciones de bugs previas
// ========================================================

// ========================================================
// 1. REFERENCIAS AL DOM
// ========================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

const dtScore = document.getElementById('dt-score');
const dtHighScore = document.getElementById('dt-high-score');
const dtLength = document.getElementById('dt-length');
const dtCoins = document.getElementById('dt-coins');
const dtSoundBtn = document.getElementById('dt-sound-btn');
const dtTutorialBtn = document.getElementById('dt-tutorial-btn');
const dtStartBtn = document.getElementById('dt-start-btn');
const dtSettingsBtn = document.getElementById('dt-settings-btn');
const dtCustomizeBtn = document.getElementById('dt-customize-btn');

const dtPauseBtn = document.getElementById('dt-pause-btn');
const mbPauseBtn = document.getElementById('mb-pause-btn');
const pauseOverlay = document.getElementById('pause-overlay');
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const pauseRestartBtn = document.getElementById('pause-restart-btn');
const pauseQuitBtn = document.getElementById('pause-quit-btn');
const xibalbaInstruction = document.getElementById('xibalba-instruction');
const xibalbaInstructionMobile = document.getElementById('xibalba-instruction-mobile');

const welcomeScreen = document.getElementById('welcome-screen');
const welcomeStartBtn = document.getElementById('welcome-start-btn');
const welcomeInfoBtn = document.getElementById('welcome-info-btn');
const welcomeLoreBtn = document.getElementById('welcome-lore-btn');
const welcomeCustomizeBtn = document.getElementById('welcome-customize-btn');
const welcomeDemo = document.getElementById('welcome-demo');
const welcomeDemoCallout = document.getElementById('welcome-demo-callout');
const welcomeDemoContext = welcomeDemo.getContext('2d', { alpha: false, desynchronized: true });
const welcomeGameMode = document.getElementById('welcome-game-mode');
const welcomeDifficulty = document.getElementById('welcome-difficulty');
const welcomeDifficultyBox = document.getElementById('welcome-difficulty-box');

const menuToggleBtn = document.getElementById('menu-toggle-btn');
const mbScore = document.getElementById('mb-score');
const mbHighScore = document.getElementById('mb-high-score');
const mbSoundBtn = document.getElementById('mb-sound-btn');
const mbSettingsBtn = document.getElementById('mb-settings-btn');

const livesFixedContainer = document.getElementById('lives-fixed-container');
const livesFixedPips = document.getElementById('lives-fixed-pips');
const livesFixedPipEls = livesFixedPips ? livesFixedPips.querySelectorAll('.life-pip') : [];
const livesMobilePips = document.getElementById('lives-mobile-pips');
const livesMobilePipEls = livesMobilePips ? livesMobilePips.querySelectorAll('.life-pip') : [];

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
const cipactliVulnerableBadge = document.getElementById('cipactli-vulnerable-badge');
const cipactliVulnerableTimerSpan = document.getElementById('cipactli-vulnerable-timer');

const furiaBadge = document.getElementById('furia-badge');
const furiaTimerSpan = document.getElementById('furia-timer');
const airBadge = document.getElementById('air-badge');
const airTimerSpan = document.getElementById('air-timer');

const timerBadge = document.getElementById('timer-badge');
const timerValueSpan = document.getElementById('timer-value');
const eclipseBadge = document.getElementById('eclipse-badge');
const eclipseTimerSpan = document.getElementById('eclipse-timer');
const xibalbaBadge = document.getElementById('xibalba-badge');
const xibalbaTimerSpan = document.getElementById('xibalba-timer');
const darknessBadge = document.getElementById('darkness-badge');

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

const loreModal = document.getElementById('lore-modal');
const closeLoreBtn = document.getElementById('close-lore-btn');
const loreStartBtn = document.getElementById('lore-start-btn');
const loreChapters = document.getElementById('lore-chapters');

const objectivesModal = document.getElementById('objectives-modal');
const closeObjectivesBtn = document.getElementById('close-objectives-btn');
const objectivesList = document.getElementById('objectives-list');
const objectivesCount = document.getElementById('objectives-count');
const objectivesFill = document.getElementById('objectives-fill');
const objectivesNext = document.getElementById('objectives-next');
const dtObjectivesBtn = document.getElementById('dt-objectives-btn');
const mbObjectivesBtn = document.getElementById('mb-objectives-btn');
const settingsObjectivesBtn = document.getElementById('settings-objectives-btn');
const objectivesTabs = document.querySelectorAll('.objectives-tab');

const customizeModal = document.getElementById('customize-modal');
const closeCustomizeBtn = document.getElementById('close-customize-btn');
const skinsGrid = document.getElementById('skins-grid');
const themesGrid = document.getElementById('themes-grid');
const customizeCoinsValue = document.getElementById('customize-coins-value');
const customizeTabs = document.querySelectorAll('.customize-tab');
const customizeSkinsPanel = document.getElementById('customize-skins-panel');
const customizeThemesPanel = document.getElementById('customize-themes-panel');
const customizeApplyBtn = document.getElementById('customize-apply-btn');
const customizeCancelBtn = document.getElementById('customize-cancel-btn');
const themePreviewCanvas = document.getElementById('theme-preview-canvas');
const themePreviewLabel = document.getElementById('theme-preview-label');

const gameOverlay = document.getElementById('game-overlay');
const overlayReason = document.getElementById('overlay-reason');
const finalScoreElement = document.getElementById('final-score');
const finalLengthElement = document.getElementById('final-length');
const finalCoinsElement = document.getElementById('final-coins');
const finalTimeElement = document.getElementById('final-time');
const finalCauseLine = document.getElementById('final-cause-line');
const recordBadge = document.getElementById('record-badge');
const restartOverlayBtn = document.getElementById('restart-overlay-btn');
const campaignNextBtn = document.getElementById('campaign-next-btn');
const statisticsModal = document.getElementById('statistics-modal');
const closeStatisticsBtn = document.getElementById('close-statistics-btn');
const statisticsStorageStatus = document.getElementById('statistics-storage-status');
const statisticsTabs = document.querySelectorAll('.statistics-tab');
const statisticsDifficultyView = document.getElementById('statistics-difficulty-view');
const statisticsModeView = document.getElementById('statistics-mode-view');
const statisticsModeTbody = document.getElementById('statistics-mode-tbody');
const countdownOverlay = document.getElementById('countdown-overlay');

const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const settingsGameMode = document.getElementById('settings-game-mode');
const settingsDifficulty = document.getElementById('settings-difficulty');
const settingsDifficultyGroup = document.getElementById('settings-difficulty-group');
const gameModeSelect = settingsGameMode;
const difficultySelect = settingsDifficulty;
const settingsSoundToggle = document.getElementById('settings-sound-toggle');
const settingsDpadToggle = document.getElementById('settings-dpad-toggle');
const settingsReduceMotionToggle = document.getElementById('settings-reduce-motion-toggle');
const settingsHighContrastToggle = document.getElementById('settings-high-contrast-toggle');
const settingsCustomizeBtn = document.getElementById('settings-customize-btn');
const settingsStatsBtn = document.getElementById('settings-stats-btn');
const settingsTutorialBtn = document.getElementById('settings-tutorial-btn');
const settingsRestartBtn = document.getElementById('settings-restart-btn');
const settingsApplyBtn = document.getElementById('settings-apply-btn');

const floodBadge = document.getElementById('flood-badge');
const floodTimerSpan = document.getElementById('flood-timer');
const campaignBadge = document.getElementById('campaign-badge');
const campaignInstruction = document.getElementById('campaign-instruction');
const campaignInstructionMobile = document.getElementById('campaign-instruction-mobile');
const campaignProgressSpan = document.getElementById('campaign-progress');
const dailyBadge = document.getElementById('daily-badge');
const dailyInstruction = document.getElementById('daily-instruction');
const dailyInstructionMobile = document.getElementById('daily-instruction-mobile');

const campaignModal = document.getElementById('campaign-modal');
const closeCampaignBtn = document.getElementById('close-campaign-btn');
const campaignLevels = document.getElementById('campaign-levels');
const campaignDetail = document.getElementById('campaign-detail');
const campaignPlayBtn = document.getElementById('campaign-play-btn');

const screenReaderAnnouncer = document.getElementById('screen-reader-announcer');

// ========================================================
// HELPERS
// ========================================================
function isAnyModalOpen() {
  return (
    (settingsModal && !settingsModal.classList.contains('hidden')) ||
    (tutorialModal && !tutorialModal.classList.contains('hidden')) ||
    (introTutorialModal && !introTutorialModal.classList.contains('hidden')) ||
    (loreModal && !loreModal.classList.contains('hidden')) ||
    (objectivesModal && !objectivesModal.classList.contains('hidden')) ||
    (customizeModal && !customizeModal.classList.contains('hidden')) ||
    (statisticsModal && !statisticsModal.classList.contains('hidden')) ||
    (gameOverlay && !gameOverlay.classList.contains('hidden')) ||
    (pauseOverlay && !pauseOverlay.classList.contains('hidden')) ||
    (campaignModal && !campaignModal.classList.contains('hidden'))
  );
}

function announce(text) {
  if (!screenReaderAnnouncer) return;
  screenReaderAnnouncer.textContent = '';
  setTimeout(() => { screenReaderAnnouncer.textContent = text; }, 30);
}

// ========================================================
// 2. CONFIGURACIÓN GENERAL
// ========================================================
let TILE_SIZE = window.innerWidth < 480 ? 20 : 24;
let gridCols = 30;
let gridRows = 20;

let isMobileDevice = window.innerWidth <= 768;
let isSlowDevice = false;
let frameTimeEMA = 16.7;
const EMA_ALPHA = 0.08;

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
    guardianTargets: 1, guardianFirstSpawnMs: 18000, guardianNextSpawnMs: 22000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 20000, freezeRespawnMs: 24000,
    freezeDurationMs: 4000, jadeImmunityMs: 12000, guardianMoveInterval: 5,
    guardianLead: 1, flankerOrbitSpeed: 16, cosmicFirstMs: 40000, cosmicIntervalMs: 55000,
    sacrificeFirstMs: 28000, skullFirstMs: 26000, rainFirstMs: 28000, rainIntervalMs: 50000,
    chaacUnlockMs: 999999, chaacCooldownMs: 999999, chaacLifetimeMs: 999999,
    chaacTeleportMs: 4000, guardianReward: 80, bossReward: 200,
    turboDurationMs: 3500, turboCooldownMs: 4500
  },
  medium: {
    guardianTargets: 2, guardianFirstSpawnMs: 14000, guardianNextSpawnMs: 16000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 14000, freezeRespawnMs: 22000,
    freezeDurationMs: 3000, jadeImmunityMs: 10000, guardianMoveInterval: 4,
    guardianLead: 3, flankerOrbitSpeed: 12, cosmicFirstMs: 30000, cosmicIntervalMs: 45000,
    sacrificeFirstMs: 30000, skullFirstMs: 20000, rainFirstMs: 22000, rainIntervalMs: 42000,
    chaacUnlockMs: 999999, chaacCooldownMs: 999999, chaacLifetimeMs: 999999,
    chaacTeleportMs: 3200, guardianReward: 100, bossReward: 250,
    turboDurationMs: 3000, turboCooldownMs: 5000
  },
  hard: {
    guardianTargets: 3, guardianFirstSpawnMs: 11000, guardianNextSpawnMs: 11000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 11000, freezeRespawnMs: 20000,
    freezeDurationMs: 2500, jadeImmunityMs: 8000, guardianMoveInterval: 3,
    guardianLead: 4, flankerOrbitSpeed: 9, cosmicFirstMs: 25000, cosmicIntervalMs: 38000,
    sacrificeFirstMs: 32000, skullFirstMs: 18000, rainFirstMs: 18000, rainIntervalMs: 38000,
    chaacUnlockMs: 45000, chaacCooldownMs: 60000, chaacLifetimeMs: 999999,
    chaacTeleportMs: 3000, guardianReward: 120, bossReward: 350,
    turboDurationMs: 2800, turboCooldownMs: 5200
  },
  extreme: {
    guardianTargets: 4, guardianFirstSpawnMs: 9000, guardianNextSpawnMs: 8000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 8000, freezeRespawnMs: 18000,
    freezeDurationMs: 2000, jadeImmunityMs: 6000, guardianMoveInterval: 2,
    guardianLead: 5, flankerOrbitSpeed: 7, cosmicFirstMs: 20000, cosmicIntervalMs: 32000,
    sacrificeFirstMs: 36000, skullFirstMs: 15000, rainFirstMs: 15000, rainIntervalMs: 32000,
    chaacUnlockMs: 35000, chaacCooldownMs: 45000, chaacLifetimeMs: 999999,
    chaacTeleportMs: 2600, guardianReward: 150, bossReward: 500,
    turboDurationMs: 2500, turboCooldownMs: 5500
  }
};

const GAME_MODES = {
  classic: {
    name: 'Clásico', icon: '⚔️', subtitle: 'El Viaje de Kukulcán',
    guardianSpawnRate: 1.0, guardianRewardMultiplier: 1.0,
    itemsEnabled: true, livesEnabled: true, hasEclipse: true,
    hasDarkness: false, hasHuntTrail: false, hasTimer: false, profileOverrides: null,
  },
  hunt: {
    name: 'Cacería', icon: '🎯', subtitle: 'La Noche de Tezcatlipoca',
    guardianSpawnRate: 0.6, guardianRewardMultiplier: 1.5,
    itemsEnabled: true, livesEnabled: true, hasEclipse: false,
    hasDarkness: false, hasHuntTrail: true, hasTimer: false,
    profileOverrides: {
      guardianTargets: 3, guardianFirstSpawnMs: 9000, guardianNextSpawnMs: 8000,
      guardianMoveInterval: 3, guardianLead: 4, guardianReward: 150, bossReward: 300,
      turboDurationMs: 2800, turboCooldownMs: 5200
    }
  },
  survival: {
    name: 'Supervivencia', icon: '🛡️', subtitle: 'El Descenso a Xibalbá',
    guardianSpawnRate: 1.2, guardianRewardMultiplier: 1.0,
    itemsEnabled: false, livesEnabled: false, hasEclipse: false,
    hasDarkness: true, hasHuntTrail: false, hasTimer: false,
    profileOverrides: {
      guardianTargets: 2, guardianFirstSpawnMs: 12000, guardianNextSpawnMs: 14000,
      guardianMoveInterval: 4, guardianLead: 3, guardianReward: 100, bossReward: 0,
      turboDurationMs: 3000, turboCooldownMs: 5000,
      rainFirstMs: 999999, rainIntervalMs: 999999,
      cosmicFirstMs: 999999, cosmicIntervalMs: 999999,
      sacrificeFirstMs: 999999, skullFirstMs: 999999,
      freezeRespawnMs: 999999, jadeRespawnMs: 999999,
    }
  },
  zen: {
    name: 'Zen', icon: '🧘', subtitle: 'Meditación en el Templo',
    guardianSpawnRate: Infinity, guardianRewardMultiplier: 1.0,
    itemsEnabled: true, livesEnabled: true, hasEclipse: false,
    hasDarkness: false, hasHuntTrail: false, hasTimer: false,
    hasZenGoal: true, zenMaizeGoal: 25,
    profileOverrides: {
      guardianTargets: 0, guardianFirstSpawnMs: 999999999, guardianNextSpawnMs: 999999999,
      rainFirstMs: 60000, rainIntervalMs: 60000,
      cosmicFirstMs: 999999999, cosmicIntervalMs: 999999999,
      sacrificeFirstMs: 999999999, skullFirstMs: 999999999,
      freezeRespawnMs: 999999999, jadeRespawnMs: 999999999,
      guardianReward: 0, bossReward: 0, turboDurationMs: 4000, turboCooldownMs: 3000,
    }
  },
  timed: {
    name: 'Contrarreloj', icon: '⏱️', subtitle: 'La Cuenta Regresiva del Sol',
    guardianSpawnRate: 1.0, guardianRewardMultiplier: 1.0,
    itemsEnabled: true, livesEnabled: true, hasEclipse: false,
    hasDarkness: false, hasHuntTrail: false, hasTimer: true,
    profileOverrides: {
      guardianTargets: 2, guardianFirstSpawnMs: 15000, guardianNextSpawnMs: 18000,
      guardianMoveInterval: 4, guardianLead: 3, guardianReward: 100, bossReward: 250,
      turboDurationMs: 3000, turboCooldownMs: 5000,
    }
  },
  flood: {
    name: 'Diluvio', icon: '🌊', subtitle: 'Cipactli Devora la Tierra',
    guardianSpawnRate: 1.2, guardianRewardMultiplier: 1.25,
    itemsEnabled: true, livesEnabled: true, hasEclipse: false,
    hasDarkness: false, hasHuntTrail: false, hasTimer: false,
    hasFloodWaves: true, onlyCipactliBoss: true, floodScoreMultiplier: 1.25,
    floodKillGoal: 3,
    profileOverrides: {
      guardianTargets: 1, guardianFirstSpawnMs: 8000, guardianNextSpawnMs: 12000,
      guardianMoveInterval: 5, guardianLead: 2, guardianReward: 100, bossReward: 0,
      turboDurationMs: 3200, turboCooldownMs: 3500,
      rainFirstMs: 14000, rainIntervalMs: 28000,
      cosmicFirstMs: 999999, cosmicIntervalMs: 999999,
      sacrificeFirstMs: 25000, skullFirstMs: 22000,
      freezeRespawnMs: 18000, jadeRespawnMs: 12000,
    }
  },
  campaign: {
    name: 'Travesía', icon: '📖', subtitle: 'La Campaña de Kukulcán',
    guardianSpawnRate: 1.0, guardianRewardMultiplier: 1.0,
    itemsEnabled: true, livesEnabled: true, hasEclipse: false,
    hasDarkness: false, hasHuntTrail: false, hasTimer: false,
    isCampaign: true,
    profileOverrides: {
      guardianTargets: 2, guardianFirstSpawnMs: 12000, guardianNextSpawnMs: 14000,
      guardianMoveInterval: 4, guardianLead: 3, guardianReward: 100, bossReward: 250,
      turboDurationMs: 3000, turboCooldownMs: 5000,
    }
  },
  daily: {
    name: 'Desafío Diario', icon: '📅', subtitle: 'Misma semilla para todos',
    guardianSpawnRate: 1.0, guardianRewardMultiplier: 1.2,
    itemsEnabled: true, livesEnabled: true, hasEclipse: false,
    hasDarkness: false, hasHuntTrail: false, hasTimer: false,
    isDaily: true,
    profileOverrides: {
      guardianTargets: 2, guardianFirstSpawnMs: 12000, guardianNextSpawnMs: 14000,
      guardianMoveInterval: 4, guardianLead: 3, guardianReward: 120, bossReward: 300,
      turboDurationMs: 3000, turboCooldownMs: 5000,
    }
  },
};

const ECLIPSE_FIRST_MS = 60000;
const ECLIPSE_INTERVAL_MS = 75000;
const ECLIPSE_DURATION_MS = 5000;
const ECLIPSE_WARNING_MS = 3000;
const DARKNESS_START_MS = 15000;
const DARKNESS_MAX_RADIUS = 8;
const DARKNESS_MIN_RADIUS = 2.5;
const DARKNESS_FULL_MS = 180000;
const HUNT_TRAIL_LIFETIME_MS = 4000;
const HUNT_TRAIL_SLOW_FACTOR = 1.35;
const TIMED_INITIAL_MS = 60000;
const TIMED_MAIZE_BONUS_MS = 2000;
const TIMED_BONUS_BONUS_MS = 5000;
const TIMED_WARNING_MS = 10000;
const XIBALBA_FIRST_MS = 30000;
const XIBALBA_INTERVAL_MS = 45000;
const XIBALBA_DURATION_MS = 10000;

// ===== DILUVIO v16: charcos aleatorios que se retiran =====
const FLOOD_WAVE_FIRST_MS = 10000;
const FLOOD_WAVE_INTERVAL_MS = 12000;
const FLOOD_SLOW_FACTOR = 1.15;
const FLOOD_MAIZE_BONUS_SPAWN_MS = 2500;
const CIPACTLI_FLOOD_FIRST_SPAWN_MS = 15000;
const CIPACTLI_FLOOD_RESPAWN_MS = 18000;
const CIPACTLI_FLOOD_VULNERABLE_MS = 4000;
const FLOOD_MAIZE_DELAY_MS = 2000;
const FLOOD_MAX_WATER_RATIO = 0.55;
const FLOOD_CELLS_PER_WAVE = 8;
const FLOOD_CELL_LIFETIME_MS = 8000;
const FLOOD_JADE_CLEAR_CELLS = 5;
const FLOOD_KILL_CLEAR_CELLS = 3;
const FLOOD_CELL_WARNING_MS = 2000;

const TEZCATLIPOCA_CONFIG = {
  easy:    { unlockMs: 90000,  cooldownMs: 120000, teleportMs: 4500, vulnerableMs: 3000, reward: 300 },
  medium:  { unlockMs: 60000,  cooldownMs: 90000,  teleportMs: 4000, vulnerableMs: 2500, reward: 400 },
  hard:    { unlockMs: 45000,  cooldownMs: 75000,  teleportMs: 3000, vulnerableMs: 2200, reward: 550 },
  extreme: { unlockMs: 35000,  cooldownMs: 60000,  teleportMs: 2600, vulnerableMs: 2000, reward: 700 }
};

const CIPACTLI_CONFIG = {
  easy:    { unlockMs: 75000, cooldownMs: 120000, chargeSpeed: 1, telegraphMs: 1600, vulnerableMs: 0, reward: 200, portalTeleportMs: 10000 },
  medium:  { unlockMs: 50000, cooldownMs: 100000, chargeSpeed: 1, telegraphMs: 1400, vulnerableMs: 0, reward: 250, portalTeleportMs: 8000 },
  hard:    { unlockMs: 40000, cooldownMs: 85000,  chargeSpeed: 1, telegraphMs: 1200, vulnerableMs: 0, reward: 300, portalTeleportMs: 6500 },
  extreme: { unlockMs: 30000, cooldownMs: 70000,  chargeSpeed: 2, telegraphMs: 1000, vulnerableMs: 0, reward: 350, portalTeleportMs: 5000 }
};

const CIPACTLI_PORTAL_FADE_MS = 400;

const BOARD_THEMES = {
  classic: { bg: '#141720', gridLine: 'rgba(144, 153, 177, 0.13)', patternColor: 'rgba(198, 164, 85, 0.07)', patternType: 'diamond', vignetteColor: 'rgba(0,0,0,0.42)', cost: 0 },
  hunt:    { bg: '#0a1a12', gridLine: 'rgba(78, 201, 160, 0.15)', patternColor: 'rgba(217, 142, 43, 0.08)', patternType: 'diamond', vignetteColor: 'rgba(0, 10, 5, 0.55)', cost: 0 },
  survival:{ bg: '#0a0809', gridLine: 'rgba(239, 82, 97, 0.08)', patternColor: 'rgba(239, 82, 97, 0.04)', patternType: 'crack', vignetteColor: 'rgba(0,0,0,0.7)', cost: 0 },
  obsidian:{ bg: '#0a0a0d', gridLine: 'rgba(120, 120, 120, 0.12)', patternColor: 'rgba(80, 80, 80, 0.08)', patternType: 'diamond', vignetteColor: 'rgba(0,0,0,0.7)', cost: 200 },
  jade:    { bg: '#0d1a14', gridLine: 'rgba(78, 201, 160, 0.14)', patternColor: 'rgba(125, 232, 196, 0.06)', patternType: 'diamond', vignetteColor: 'rgba(0, 20, 10, 0.6)', cost: 300 },
  cipactli:{ bg: '#0b1614', gridLine: 'rgba(80, 200, 150, 0.13)', patternColor: 'rgba(120, 240, 180, 0.06)', patternType: 'diamond', vignetteColor: 'rgba(0, 15, 10, 0.65)', cost: 400 },
  xibalba: { bg: '#12080a', gridLine: 'rgba(200, 60, 80, 0.10)', patternColor: 'rgba(200, 80, 60, 0.05)', patternType: 'crack', vignetteColor: 'rgba(10, 0, 0, 0.75)', cost: 500 },
  cenote:  { bg: '#051428', gridLine: 'rgba(92, 200, 255, 0.14)', patternColor: 'rgba(120, 220, 255, 0.07)', patternType: 'diamond', vignetteColor: 'rgba(0, 10, 25, 0.6)', cost: 600 }
};

let _cachedProfileKey = '';
let _cachedProfile = null;
let _cachedEffectiveDifficulty = null;
let _cachedEffectiveDifficultyKey = '';

function getEffectiveDifficulty() {
  const mode = gameModeSelect ? gameModeSelect.value : 'classic';
  const diff = difficultySelect ? difficultySelect.value : 'medium';
  const key = mode + '|' + diff + '|' + (campaignLevel || '') + '|' + (dailyChallenge ? dailyChallenge.difficulty : '');
  if (_cachedEffectiveDifficultyKey === key && _cachedEffectiveDifficulty) return _cachedEffectiveDifficulty;
  let result = 'medium';
  if (mode === 'classic') result = diff;
  else if (mode === 'campaign' && campaignLevel) {
    const lvl = CAMPAIGN_LEVELS.find(l => l.id === campaignLevel);
    result = lvl ? lvl.difficulty : 'medium';
  }
  else if (mode === 'daily' && dailyChallenge) result = dailyChallenge.difficulty;
  _cachedEffectiveDifficulty = result;
  _cachedEffectiveDifficultyKey = key;
  return result;
}

function getDifficultyProfile() {
  const modeKey = gameModeSelect ? gameModeSelect.value : 'classic';
  const effDiff = getEffectiveDifficulty();
  const key = modeKey + '|' + effDiff;
  if (_cachedProfileKey === key && _cachedProfile) return _cachedProfile;
  const mode = GAME_MODES[modeKey] || GAME_MODES.classic;
  const baseProfile = DIFFICULTY_PROFILES[effDiff] || DIFFICULTY_PROFILES.medium;
  const profile = { ...baseProfile };
  if (mode.profileOverrides) Object.assign(profile, mode.profileOverrides);
  profile.guardianFirstSpawnMs *= mode.guardianSpawnRate;
  profile.guardianNextSpawnMs *= mode.guardianSpawnRate;
  profile.guardianReward *= mode.guardianRewardMultiplier;
  profile.bossReward *= mode.guardianRewardMultiplier;
  _cachedProfile = profile;
  _cachedProfileKey = key;
  return profile;
}

function invalidateProfileCache() {
  _cachedProfile = null;
  _cachedProfileKey = '';
  _cachedEffectiveDifficulty = null;
  _cachedEffectiveDifficultyKey = '';
}

const FREEZE_FIRST_SPAWN_MS = 16000;
const FREEZE_RESPAWN_DELAY_MS = 22000;
const CHAAC_RETRY_MS = 3000;

const GUARDIAN_DEFS = [
  { behavior: 'hunter', name: 'Ahalpuh', title: 'El Putrefactor', icon: '⚔️',
    lore: 'Demonio que causa la putrefacción.',
    palette: { head: '#e2574c', body: '#9b2929', crest: '#ff9b83', eye: '#fff0c6' },
    traits: { fangs: true, crestCount: 1, eyeMark: false },
    ambientParticles: { color: '#ff6b4c', rate: 0.35, size: 1.5 } },
  { behavior: 'interceptor', name: 'Ixtab', title: 'La Vidente', icon: '👁️',
    lore: 'Diosa de la adivinación.',
    palette: { head: '#a65bd4', body: '#64328e', crest: '#d4a0f0', eye: '#f0e0ff' },
    traits: { fangs: false, crestCount: 1, eyeMark: true },
    ambientParticles: { color: '#c89bf0', rate: 0.4, size: 1.8 } },
  { behavior: 'flanker', name: 'Camazotz', title: 'El Murciélago de la Muerte', icon: '🦇',
    lore: 'Señor de los murciélagos.',
    palette: { head: '#f28c28', body: '#a64b1b', crest: '#ffc078', eye: '#fff0c6' },
    traits: { fangs: true, crestCount: 2, eyeMark: false },
    ambientParticles: { color: '#ff9b3c', rate: 0.45, size: 1.6 } },
  { behavior: 'cipactli', name: 'Cipactli', title: 'El Cocodrilo Primordial', icon: '🐊',
    lore: 'Monstruo marino que devoró a los dioses.',
    palette: { head: '#4ec98a', body: '#1f6b4a', crest: '#a8ffd0', eye: '#ffb347', belly: '#c9e8a0', jaw: '#0e3324' },
    traits: { isBoss: true, isCipactli: true, fangs: true, crestCount: 6, eyeMark: false, scales: true },
    ambientParticles: { color: '#4ec98a', rate: 0.55, size: 2 } },
  { behavior: 'ambusher', name: 'Tezcatlipoca', title: 'El Jaguar de Obsidiana', icon: '🐆',
    lore: 'Dios de la noche y los espejos.',
    palette: { head: '#d98e2b', body: '#a8561b', crest: '#14110f', eye: '#f2e2b8', jade: '#4ec9a0', obsidian: '#14110f', ember: '#f2e2b8' },
    traits: { fangs: true, crestCount: 4, eyeMark: false, isBoss: true, isTezcatlipoca: true },
    ambientParticles: { color: '#d98e2b', rate: 0.6, size: 2 } }
];

const GUARDIAN_QUOTES = {
  hunter: 'Ahalpuh: "Tu carne se pudrirá..."',
  interceptor: 'Ixtab: "Veo tu futuro... y es oscuro."',
  flanker: 'Camazotz: "Te rodearemos desde las sombras."',
  cipactli: 'Cipactli: "Las aguas te reclaman."',
  ambusher: 'Tezcatlipoca: "El espejo no miente."'
};

let usedGuardianPalettes = [];

function getUniqueGuardianDef() {
  const normalDefs = GUARDIAN_DEFS.filter(d => !d.traits.isBoss);
  const available = normalDefs.filter(d => !usedGuardianPalettes.includes(d.name));
  if (available.length === 0) {
    usedGuardianPalettes = [];
    return normalDefs[Math.floor(Math.random() * normalDefs.length)];
  }
  const def = available[Math.floor(Math.random() * available.length)];
  usedGuardianPalettes.push(def.name);
  return def;
}

const SACRED_RAIN_DURATION_MS = 8000;
const MAIZE_RAIN_BONUS = 10;
const SACRED_RAIN_MAIZE_COUNT = 3;
const MAIZE_FALL_DURATION_MS = 700;
const SACRIFICE_RESPAWN_DELAY_MS = 12000;
const SACRIFICE_REPEAT_DELAY_MS = 30000;
const SKULL_RESPAWN_DELAY_MS = 38000;
const SKULL_MOVE_INTERVAL_MS = 8000;
const SKULL_REAPPEAR_DELAY_MS = 300;
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
const PROGRESSION_STORAGE_KEY = 'kukulcanProgression';
const DIFFICULTY_NAMES = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil', extreme: 'Pesadilla' };
const MODE_NAMES = {
  classic: '⚔️ Clásico', hunt: '🎯 Cacería', survival: '🛡️ Supervivencia',
  zen: '🧘 Zen', timed: '⏱️ Contrarreloj', flood: '🌊 Diluvio',
  campaign: '📖 Travesía', daily: '📅 Diario'
};

const CAMPAIGN_LEVELS = [
  { id: 1, title: 'El Hambre del Pueblo', desc: 'Come 20 maíces en el templo',
    goal: { type: 'eatMaize', target: 20 }, difficulty: 'easy', mode: 'classic' },
  { id: 2, title: 'Los Señores de Xibalbá', desc: 'Derrota 3 guardianes',
    goal: { type: 'killGuardians', target: 3 }, difficulty: 'medium', mode: 'classic' },
  { id: 3, title: 'El Descenso', desc: 'Sobrevive 2 minutos sin perder vida',
    goal: { type: 'surviveNoDamage', target: 120000 }, difficulty: 'hard', mode: 'classic' },
  { id: 4, title: 'Las Aguas Primordiales', desc: 'Derrota a Cipactli',
    goal: { type: 'killCipactli', target: 1 }, difficulty: 'hard', mode: 'flood' },
  { id: 5, title: 'El Espejo Final', desc: 'Derrota a Tezcatlipoca',
    goal: { type: 'killTezcatlipoca', target: 1 }, difficulty: 'extreme', mode: 'classic' }
];

// ===== DESAFÍO DIARIO v16: reglas especiales =====
const DAILY_RULES = [
  { id: 'slow_safe', name: 'Lento pero seguro', icon: '🐌', description: 'Velocidad -20%, sin Furia',
    apply() { dailyState.speedMultiplier = 0.8; dailyState.furiaDisabled = true; },
    remove() { dailyState.speedMultiplier = 1.0; dailyState.furiaDisabled = false; } },
  { id: 'furia_infinita', name: 'Furia infinita', icon: '🔥', description: 'Furia sin cooldown, guardianes +50% velocidad',
    apply() { dailyState.furiaNoCooldown = true; dailyState.guardianSpeedMultiplier = 1.5; },
    remove() { dailyState.furiaNoCooldown = false; dailyState.guardianSpeedMultiplier = 1.0; } },
  { id: 'dieta_maiz', name: 'Dieta de maíz', icon: '🌽', description: 'Solo maíz, +10 pts por maíz',
    apply() { dailyState.onlyMaize = true; dailyState.maizeBonusPoints = 10; },
    remove() { dailyState.onlyMaize = false; dailyState.maizeBonusPoints = 0; } },
  { id: 'jade_abundante', name: 'Jade abundante', icon: '💎', description: '3 jades a la vez, sin escudo de respawn',
    apply() { dailyState.jadeTarget = 3; dailyState.noRespawnShield = true; },
    remove() { dailyState.jadeTarget = 0; dailyState.noRespawnShield = false; } },
  { id: 'sin_piedad', name: 'Sin piedad', icon: '👁️', description: 'Guardianes desde el segundo 5, 5 vidas',
    apply() { dailyState.guardianFirstSpawnMs = 5000; dailyState.extraLives = 2; },
    remove() { dailyState.guardianFirstSpawnMs = 0; dailyState.extraLives = 0; } },
  { id: 'invierno', name: 'Invierno eterno', icon: '❄️', description: 'Guardianes congelados, sin cacao',
    apply() { dailyState.guardiansAlwaysFrozen = true; dailyState.noCacao = true; },
    remove() { dailyState.guardiansAlwaysFrozen = false; dailyState.noCacao = false; } },
  { id: 'cosecha_doble', name: 'Cosecha doble', icon: '🌾', description: 'Maíz vale doble, guardianes valen doble',
    apply() { dailyState.maizeMultiplier = 2; dailyState.guardianMultiplier = 2; },
    remove() { dailyState.maizeMultiplier = 1; dailyState.guardianMultiplier = 1; } },
  { id: 'sin_jade', name: 'Sin jade', icon: '🚫', description: 'No hay jades, +1 vida',
    apply() { dailyState.noJade = true; dailyState.extraLives = 1; },
    remove() { dailyState.noJade = false; dailyState.extraLives = 0; } },
  { id: 'rapido_furioso', name: 'Rápido y furioso', icon: '⚡', description: 'Velocidad +30%, cooldown Furia -50%',
    apply() { dailyState.speedMultiplier = 1.3; dailyState.furiaCooldownMultiplier = 0.5; },
    remove() { dailyState.speedMultiplier = 1.0; dailyState.furiaCooldownMultiplier = 1.0; } }
];

let dailyState = {
  speedMultiplier: 1.0, furiaDisabled: false, furiaNoCooldown: false,
  guardianSpeedMultiplier: 1.0, onlyMaize: false, maizeBonusPoints: 0,
  jadeTarget: 0, noRespawnShield: false, guardianFirstSpawnMs: 0,
  extraLives: 0, guardiansAlwaysFrozen: false, noCacao: false,
  maizeMultiplier: 1, guardianMultiplier: 1, noJade: false,
  furiaCooldownMultiplier: 1.0, activeRule: null
};

function resetDailyState() {
  dailyState = {
    speedMultiplier: 1.0, furiaDisabled: false, furiaNoCooldown: false,
    guardianSpeedMultiplier: 1.0, onlyMaize: false, maizeBonusPoints: 0,
    jadeTarget: 0, noRespawnShield: false, guardianFirstSpawnMs: 0,
    extraLives: 0, guardiansAlwaysFrozen: false, noCacao: false,
    maizeMultiplier: 1, guardianMultiplier: 1, noJade: false,
    furiaCooldownMultiplier: 1.0, activeRule: null
  };
}

function getDailyChallenge() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const pseudo = (n) => { let x = Math.sin(seed * n) * 10000; return x - Math.floor(x); };
  const modes = ['classic', 'hunt', 'survival', 'timed', 'flood'];
  const mode = modes[Math.floor(pseudo(1) * modes.length)];
  const diffs = ['easy', 'medium', 'hard', 'extreme'];
  const difficulty = diffs[Math.floor(pseudo(2) * diffs.length)];
  const ruleIndex = Math.floor(pseudo(3) * DAILY_RULES.length);
  const rule = DAILY_RULES[ruleIndex];
  return { seed, mode, difficulty, rule, dateStr: today.toISOString().slice(0, 10) };
}

function getUnlockedChapters() {
  const chapters = [];
  chapters.push({ id: 1, title: 'El Descenso', unlocked: true });
  chapters.push({ id: 2, title: 'Las Aguas Primordiales', unlocked: (progression.totalCipactliDefeated || 0) >= 1 });
  chapters.push({ id: 3, title: 'El Espejo Humeante', unlocked: (progression.totalTezcatlipocaDefeated || 0) >= 1 });
  chapters.push({ id: 4, title: 'El Regreso al Mundo', unlocked: Object.keys(progression.achievements).length >= 10 });
  return chapters;
}

// ========================================================
// 3. STORAGE
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
// 4. PROGRESIÓN
// ========================================================
let progression = {
  totalMaize: 0, totalCacao: 0, totalGuardiansDefeated: 0,
  totalTezcatlipocaDefeated: 0, totalCipactliDefeated: 0,
  bothBossesInOneRun: 0, bestScoreSingleRun: 0,
  bestFloodSurvivalMs: 0, maxFloodWavesInRun: 0, totalFloodWaves: 0,
  totalGamesPlayed: 0, totalSurvivalMs: 0,
  bestTimedScore: 0, achievements: {},
  bestScoreByMode: { classic: 0, hunt: 0, survival: 0, zen: 0, timed: 0, flood: 0, campaign: 0, daily: 0 },
  gamesPlayedByMode: { classic: 0, hunt: 0, survival: 0, zen: 0, timed: 0, flood: 0, campaign: 0, daily: 0 },
  bestZenTimeMs: 999999999, campaignProgress: 0, campaignCompleted: [],
  dailyCompletedOnce: false, dailyScores: {},
  unlockedSkins: ['default'],
  unlockedThemes: ['classic', 'hunt', 'survival'],
  selectedSkin: 'default', selectedTheme: 'classic', maizeCoins: 0
};

function loadProgression() {
  const saved = safeGetItem(PROGRESSION_STORAGE_KEY, null);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object') {
      progression = { ...progression, ...parsed };
      if (!Array.isArray(progression.unlockedSkins)) progression.unlockedSkins = ['default'];
      if (!Array.isArray(progression.unlockedThemes)) progression.unlockedThemes = ['classic', 'hunt', 'survival'];
      if (!Array.isArray(progression.campaignCompleted)) progression.campaignCompleted = [];
      if (!progression.achievements || typeof progression.achievements !== 'object') progression.achievements = {};
      if (!progression.dailyScores || typeof progression.dailyScores !== 'object') progression.dailyScores = {};
      if (!progression.bestScoreByMode) progression.bestScoreByMode = { classic: 0, hunt: 0, survival: 0, zen: 0, timed: 0, flood: 0, campaign: 0, daily: 0 };
      if (!progression.gamesPlayedByMode) progression.gamesPlayedByMode = { classic: 0, hunt: 0, survival: 0, zen: 0, timed: 0, flood: 0, campaign: 0, daily: 0 };
      ['totalCipactliDefeated','bothBossesInOneRun','bestScoreSingleRun','bestFloodSurvivalMs','maxFloodWavesInRun','totalFloodWaves','campaignProgress'].forEach(k => {
        if (typeof progression[k] !== 'number') progression[k] = 0;
      });
      if (typeof progression.bestZenTimeMs !== 'number') progression.bestZenTimeMs = 999999999;
    }
  } catch (e) { console.warn('No se pudo cargar la progresión:', e); }
}
function saveProgression() { safeSetItem(PROGRESSION_STORAGE_KEY, JSON.stringify(progression)); }
loadProgression();

// ========================================================
// 5. SKINS Y TEMAS
// ========================================================
const KUKULKAN_SKINS = {
  default: { name: 'Jade Clásico', description: 'El aspecto tradicional de Kukulcán.', head: '#4ec9a0', body: '#1a7a5e', border: 'rgba(213, 189, 112, 0.55)', inner: 'rgba(182, 242, 209, 0.28)', plate: null, cost: 0 },
  golden:  { name: 'Oro de Itzamná', description: 'Un tributo al dios creador.', head: '#d4b45c', body: '#a8924a', border: '#f5e9b8', inner: 'rgba(245, 235, 190, 0.4)', plate: '#c2b06a', cost: 100 },
  obsidian:{ name: 'Obsidiana Negra', description: 'Forjado en las profundidades de Xibalbá.', head: '#3a3a3a', body: '#1a1a1a', border: 'rgba(120, 120, 120, 0.6)', inner: 'rgba(80, 80, 80, 0.3)', plate: '#2a2a2a', cost: 250 },
  blood:   { name: 'Sangre de Sacrificio', description: 'Para los que ofrecen todo a los dioses.', head: '#ef5261', body: '#9b2929', border: 'rgba(255, 200, 200, 0.5)', inner: 'rgba(255, 150, 150, 0.25)', plate: '#c23434', cost: 500 },
  cipactli:{ name: 'Piel de Cipactli', description: 'Escamas del cocodrilo primordial.', head: '#4ec98a', body: '#1f6b4a', border: 'rgba(168, 255, 208, 0.6)', inner: 'rgba(200, 255, 220, 0.3)', plate: '#2f8a5e', cost: 600 },
  xibalba: { name: 'Señor de Xibalbá', description: 'Brillo púrpura de los señores de la muerte.', head: '#a65bd4', body: '#3a1a5e', border: 'rgba(200, 150, 255, 0.6)', inner: 'rgba(180, 120, 240, 0.3)', plate: '#6b2a9e', cost: 800 },
  cenote:  { name: 'Cenote Sagrado', description: 'Aguas turquesa de los cenotes mayas.', head: '#5cc8ff', body: '#1a4a7a', border: 'rgba(179, 229, 255, 0.65)', inner: 'rgba(200, 240, 255, 0.3)', plate: '#2a6a9e', cost: 1000 }
};

function isSkinUnlocked(skinId) {
  return progression.unlockedSkins.includes(skinId) || (KUKULKAN_SKINS[skinId] && KUKULKAN_SKINS[skinId].cost === 0);
}
function isThemeUnlocked(themeId) {
  return progression.unlockedThemes.includes(themeId) || !(BOARD_THEMES[themeId] && BOARD_THEMES[themeId].cost);
}
function getActiveSkin() {
  return KUKULKAN_SKINS[progression.selectedSkin] || KUKULKAN_SKINS.default;
}

let pendingSkin = null;
let pendingTheme = null;
let pendingUnlockedSkins = null;
let pendingUnlockedThemes = null;
let pendingCoins = 0;

function beginCustomizeSession() {
  pendingSkin = progression.selectedSkin;
  pendingTheme = progression.selectedTheme;
  pendingUnlockedSkins = [...progression.unlockedSkins];
  pendingUnlockedThemes = [...progression.unlockedThemes];
  pendingCoins = progression.maizeCoins;
}
function cancelCustomizeSession() {
  pendingSkin = null; pendingTheme = null;
  pendingUnlockedSkins = null; pendingUnlockedThemes = null;
  pendingCoins = 0;
}
function commitCustomizeSession() {
  if (pendingSkin === null) return;
  progression.selectedSkin = pendingSkin;
  progression.selectedTheme = pendingTheme;
  progression.unlockedSkins = [...pendingUnlockedSkins];
  progression.unlockedThemes = [...pendingUnlockedThemes];
  progression.maizeCoins = pendingCoins;
  saveProgression();
  updateScoresUI();
  updateThemeColors();
  cancelCustomizeSession();
}
function isSkinUnlockedPending(skinId) {
  if (!pendingUnlockedSkins) return isSkinUnlocked(skinId);
  return pendingUnlockedSkins.includes(skinId) || (KUKULKAN_SKINS[skinId] && KUKULKAN_SKINS[skinId].cost === 0);
}
function isThemeUnlockedPending(themeId) {
  if (!pendingUnlockedThemes) return isThemeUnlocked(themeId);
  return pendingUnlockedThemes.includes(themeId) || !(BOARD_THEMES[themeId] && BOARD_THEMES[themeId].cost);
}

function renderCustomizeUI() {
  if (!skinsGrid || !themesGrid) return;
  if (!pendingUnlockedSkins) beginCustomizeSession();
  if (customizeCoinsValue) customizeCoinsValue.textContent = pendingCoins;

  skinsGrid.innerHTML = '';
  Object.entries(KUKULKAN_SKINS).forEach(([id, skin]) => {
    const unlocked = isSkinUnlockedPending(id);
    const selected = pendingSkin === id;
    const item = document.createElement('div');
    item.className = `skin-item ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}`;
    const gradient = `radial-gradient(circle at 35% 35%, ${skin.head}, ${skin.body} 80%)`;
    item.innerHTML = `
      <div class="skin-preview" style="background: ${gradient};"></div>
      <div class="skin-name">${skin.name}</div>
      <div class="skin-desc">${skin.description}</div>
      ${!unlocked ? `<div class="skin-cost">${skin.cost}</div>` : ''}
      ${unlocked && !selected ? `<div class="skin-cost" style="background: transparent; border-color: rgba(78,201,160,0.4); color: #7de8c4;">✓ Usar</div>` : ''}
    `;
    item.addEventListener('click', () => {
      if (!unlocked) {
        if (pendingCoins >= skin.cost) {
          pendingCoins -= skin.cost;
          pendingUnlockedSkins.push(id);
          pendingSkin = id;
          renderCustomizeUI();
          playAchievementSound();
        } else {
          vibrate([30, 40, 30]);
        }
      } else {
        pendingSkin = id;
        renderCustomizeUI();
      }
    });
    skinsGrid.appendChild(item);
  });

  themesGrid.innerHTML = '';
  Object.entries(BOARD_THEMES).forEach(([id, theme]) => {
    const unlocked = isThemeUnlockedPending(id);
    const selected = pendingTheme === id;
    const item = document.createElement('div');
    item.className = `theme-item ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}`;
    item.innerHTML = `
      <div class="theme-preview" style="background: ${theme.bg};">
        <div class="theme-preview-grid"></div>
      </div>
      <div class="theme-name">${id.charAt(0).toUpperCase() + id.slice(1)}</div>
      <div class="theme-desc">${theme.cost > 0 ? 'Desbloqueable' : 'Disponible'}</div>
      ${!unlocked ? `<div class="theme-cost">${theme.cost}</div>` : ''}
      ${unlocked && !selected ? `<div class="theme-cost" style="background: transparent; border-color: rgba(78,201,160,0.4); color: #7de8c4;">✓ Usar</div>` : ''}
    `;
    item.addEventListener('mouseenter', () => { drawThemeLivePreview(id); });
    item.addEventListener('click', () => {
      if (!unlocked) {
        if (pendingCoins >= theme.cost) {
          pendingCoins -= theme.cost;
          pendingUnlockedThemes.push(id);
          pendingTheme = id;
          renderCustomizeUI();
          playAchievementSound();
        } else {
          vibrate([30, 40, 30]);
        }
      } else {
        pendingTheme = id;
        renderCustomizeUI();
      }
    });
    themesGrid.appendChild(item);
  });
}

function drawThemeLivePreview(themeId) {
  if (!themePreviewCanvas) return;
  const theme = BOARD_THEMES[themeId];
  if (!theme) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = themePreviewCanvas.clientWidth || 280;
  const h = themePreviewCanvas.clientHeight || 90;
  themePreviewCanvas.width = Math.floor(w * dpr);
  themePreviewCanvas.height = Math.floor(h * dpr);
  const c = themePreviewCanvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = theme.bg;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = theme.gridLine;
  c.lineWidth = 1;
  const step = 14;
  for (let x = 0; x <= w; x += step) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
  }
  c.fillStyle = theme.patternColor;
  for (let x = step * 2; x < w; x += step * 4) {
    for (let y = step * 2; y < h; y += step * 4) {
      if (theme.patternType === 'diamond') {
        c.beginPath();
        c.moveTo(x, y - 2); c.lineTo(x + 2, y);
        c.lineTo(x, y + 2); c.lineTo(x - 2, y);
        c.closePath(); c.fill();
      } else if (theme.patternType === 'crack') {
        c.strokeStyle = theme.patternColor;
        c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + 5, y + 3); c.lineTo(x + 8, y + 1); c.stroke();
      }
    }
  }
  c.fillStyle = '#4ec9a0';
  c.beginPath(); c.arc(w * 0.3, h * 0.5, 4, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d5bd70';
  c.beginPath(); c.arc(w * 0.6, h * 0.5, 4, 0, Math.PI * 2); c.fill();
  if (themePreviewLabel) {
    themePreviewLabel.textContent = themeId.charAt(0).toUpperCase() + themeId.slice(1);
  }
}

// ========================================================
// 6. ESTADO DEL JUEGO
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
let reduceMotion = safeGetItem('snakeIoReduceMotion', 'false') === 'true';
let highContrast = safeGetItem('snakeIoHighContrast', 'false') === 'true';
let runStartedAt = null;
let runDifficulty = null;
let runMode = 'classic';
let runGuardiansDefeated = 0;
let runCipactliDefeated = 0;
let runTezcatlipocaDefeated = 0;
let runMaizeEaten = 0;
let runLivesLost = 0;
let runStartForCampaign = 0;

let campaignLevel = null;
let campaignInProgress = false;
let campaignWon = false;
let dailyChallenge = null;

let lastEatPitch = 0;

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
let nextCipactliSpawnAt = null;
let isOnFire = false;

let isFuria = false;
let furiaReadyAt = 0;
let furiaCooldownUntil = 0;
let furiaCooldownUntilReal = 0;
let furiaAuraStart = 0;
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
let damageRings = [];
let screenShake = 0;
let blinkCounter = 0;
let fireBreath = null;
const FIRE_BREATH_CYCLE_MS = 900;
const FIRE_BREATH_ACTIVE_MS = 540;

let jadeTrailAccumulator = 0;

let eclipseActive = false;
let eclipseUntil = 0;
let nextEclipseAt = null;
let eclipseWarningShown = false;

// ===== DILUVIO v16: charcos =====
let floodNextWaveAt = null;
let floodWaterCells = [];       // { x, y, expiresAt, bornAt }
let floodWaterWaves = 0;
let floodKills = 0;
let floodVictoryShown = false;
let floodMaizeSpawnAt = null;
let runFloodWaves = 0;
let floodSlowUntil = 0;

let darknessRadius = DARKNESS_MAX_RADIUS;
let darknessStartTime = null;

let huntTrail = [];

let timedRemainingMs = TIMED_INITIAL_MS;
let timedWarningShown = false;

let zenMaizeEaten = 0;

let activeXibalbaTrial = null;
let nextXibalbaTrialAt = null;
let xibalbaMaizeBlocked = false;

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
  '¡Cipactli y Tezcatlipoca acechan en las sombras!',
  '¡Usa la FURIA DE XIUHCÓATL para incinerar enemigos!'
];
let welcomeDemoCalloutIndex = 0;
let welcomeDemoCalloutTimer = 0;
let welcomeDemoMode = 'classic';

let currentTutorialStep = 1;
const totalTutorialSteps = 5;
const tutorialTitles = [
  'La Travesía de Kukulcán',
  'Las ofrendas sagradas',
  'Los guardianes',
  'Poderes y sacrificios',
  'Modalidades de Juego'
];
let tutorialOpenedFromWelcome = false;

let showDpad = safeGetItem('snakeIoShowDpad', 'false') === 'true';
let gameMode = safeGetItem('snakeIoGameMode', 'classic');

let _cachedSpeed = 150;
let _cachedSpeedTick = -1;
let _spawnScheduled = false;
let _spawnTimeoutId = null;

// ========================================================
// 7. OBJETIVOS
// ========================================================
let objectivesFilter = 'all';

const OBJECTIVES = [
  { id: 'first_maize',    name: 'Primera Ofrenda',       description: 'Recoge tu primer maíz.',           icon: '🌽', onboarding: true, check: (p) => p.totalMaize >= 1 },
  { id: 'first_guardian', name: 'Primer Guardián',       description: 'Derrota tu primer guardián.',      icon: '⚔️', onboarding: true, check: (p) => p.totalGuardiansDefeated >= 1 },
  { id: 'first_500',      name: 'Primeros 500',          description: 'Consigue 500 puntos.',             icon: '🔥', onboarding: true, check: (p) => p.bestScoreSingleRun >= 500 },
  { id: 'maize_100',      name: 'Agricultor Sagrado',    description: 'Recoge 100 maíces en total.',      icon: '🌽', check: (p) => p.totalMaize >= 100 },
  { id: 'maize_1000',     name: 'Señor del Maíz',        description: 'Recoge 1000 maíces en total.',     icon: '🌽', check: (p) => p.totalMaize >= 1000 },
  { id: 'cacao_50',       name: 'Mercader de Cacao',     description: 'Recoge 50 ofrendas de cacao.',     icon: '🍫', check: (p) => p.totalCacao >= 50 },
  { id: 'guardian_10',    name: 'Cazador de Demonios',   description: 'Derrota 10 guardianes.',           icon: '⚔️', check: (p) => p.totalGuardiansDefeated >= 10 },
  { id: 'guardian_100',   name: 'Guerrero Jaguar',       description: 'Derrota 100 guardianes.',          icon: '🐆', check: (p) => p.totalGuardiansDefeated >= 100 },
  { id: 'tezcat_1',       name: 'El Primer Espejo',      description: 'Derrota a Tezcatlipoca por primera vez.', icon: '👁️', check: (p) => p.totalTezcatlipocaDefeated >= 1 },
  { id: 'tezcat_10',      name: 'Rompe-Espejos',         description: 'Derrota a Tezcatlipoca 10 veces.', icon: '👁️', check: (p) => p.totalTezcatlipocaDefeated >= 10 },
  { id: 'cipactli_1',     name: 'El Primer Cocodrilo',   description: 'Derrota a Cipactli por primera vez.', icon: '🐊', check: (p) => p.totalCipactliDefeated >= 1 },
  { id: 'cipactli_5',     name: 'Matador de Cipactli',   description: 'Derrota a Cipactli 5 veces.',       icon: '🐊', check: (p) => p.totalCipactliDefeated >= 5 },
  { id: 'both_bosses',    name: 'Doble Presa',           description: 'Derrota a Cipactli y Tezcatlipoca en la misma partida.', icon: '⚔️', check: (p) => p.bothBossesInOneRun >= 1 },
  { id: 'combo_500',      name: 'Furia Imparable',       description: 'Consigue 500 puntos en una sola partida.', icon: '🔥', check: (p) => p.bestScoreSingleRun >= 500 },
  { id: 'diluvio_1',      name: 'Hijo del Diluvio',      description: 'Sobrevive 60 segundos en modo Diluvio.', icon: '🌊', check: (p) => (p.bestFloodSurvivalMs || 0) >= 60000 },
  { id: 'diluvio_wave',   name: 'Nadador Sagrado',       description: 'Sobrevive 5 oleadas en una sola partida del Diluvio.', icon: '🌊', check: (p) => (p.maxFloodWavesInRun || 0) >= 5 },
  { id: 'campaign_1',     name: 'El Hambre del Pueblo',  description: 'Completa el capítulo 1 de la Travesía.', icon: '📖', check: (p) => p.campaignCompleted.includes(1) },
  { id: 'campaign_5',     name: 'El Espejo Final',       description: 'Completa todos los capítulos de la Travesía.', icon: '📖', check: (p) => p.campaignCompleted.includes(5) },
  { id: 'daily_1',        name: 'Primer Desafío',        description: 'Completa un desafío diario.',       icon: '📅', check: (p) => p.dailyCompletedOnce === true },
  { id: 'survive_5min',   name: 'Viajero del Inframundo',description: 'Sobrevive 5 minutos acumulados.',  icon: '⏳', check: (p) => p.totalSurvivalMs >= 300000 },
  { id: 'games_50',       name: 'Devoto de Kukulcán',    description: 'Juega 50 partidas.',               icon: '🐍', check: (p) => p.totalGamesPlayed >= 50 },
  { id: 'timed_500',      name: 'Contra el Sol',         description: 'Consigue 500 puntos en Contrarreloj.', icon: '⏱️', check: (p) => p.bestTimedScore >= 500 },
  { id: 'zen_60',         name: 'Meditación Perfecta',   description: 'Completa el modo Zen en menos de 60s.', icon: '🧘', check: (p) => (p.bestZenTimeMs || 999999999) < 60000 }
];

let achievementToastQueue = [];
let achievementToastActive = false;

function checkAchievements() {
  if (typeof OBJECTIVES === 'undefined' || !Array.isArray(OBJECTIVES)) return [];
  const newlyUnlocked = [];
  OBJECTIVES.forEach(ach => {
    if (progression.achievements[ach.id]) return;
    try {
      if (ach.check(progression)) {
        progression.achievements[ach.id] = Date.now();
        newlyUnlocked.push({ ...ach, _justUnlocked: true });
      }
    } catch (e) { console.warn('[Kukulcán] Error en objetivo', ach.id, e); }
  });
  if (newlyUnlocked.length > 0) {
    saveProgression();
    newlyUnlocked.forEach(ach => achievementToastQueue.push(ach));
    processAchievementToastQueue();
    if (objectivesModal && !objectivesModal.classList.contains('hidden')) renderObjectivesUI();
    updateOnboardingVisibility();
  }
  return newlyUnlocked;
}

function processAchievementToastQueue() {
  if (achievementToastActive) return;
  if (achievementToastQueue.length === 0) return;
  const seen = new Set();
  achievementToastQueue = achievementToastQueue.filter(ach => {
    if (!ach || !ach.id) return false;
    if (progression.achievements[ach.id] && ach._justUnlocked !== true) return false;
    if (seen.has(ach.id)) return false;
    seen.add(ach.id);
    return true;
  });
  if (achievementToastQueue.length === 0) return;
  const isMobile = window.innerWidth <= 768;
  if (isMobile && achievementToastQueue.length > 1) {
    achievementToastQueue = achievementToastQueue.slice(0, 1);
  }
  achievementToastActive = true;
  const ach = achievementToastQueue.shift();
  showAchievementToast(ach, () => {
    achievementToastActive = false;
    setTimeout(processAchievementToastQueue, 350);
  });
}

function showAchievementToast(achievement, onDone) {
  if (!achievement) { if (onDone) onDone(); return; }
  if (progression.achievements[achievement.id] && achievement._justUnlocked !== true) {
    if (onDone) onDone();
    return;
  }
  const container = document.getElementById('achievement-toast-container');
  if (!container) { if (onDone) onDone(); return; }
  const isMobile = window.innerWidth <= 768;
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="achievement-toast-icon">${achievement.icon}</div>
    <div class="achievement-toast-content">
      <div class="achievement-toast-title">¡Objetivo!</div>
      <div class="achievement-toast-name">${achievement.name}</div>
      <div class="achievement-toast-desc">${achievement.description}</div>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  try { playAchievementSound(); } catch (e) { console.warn('[Kukulcán] Audio objetivo falló:', e); }
  vibrate([15, 30, 15]);
  announce(`Objetivo cumplido: ${achievement.name}`);
  const duration = isMobile ? 2000 : 2800;
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => { toast.remove(); if (onDone) onDone(); }, 400);
  }, duration);
}

function showGuardianQuoteToast(icon, name, description) {
  const container = document.getElementById('achievement-toast-container');
  if (!container) return;
  const isMobile = window.innerWidth <= 768;
  const existing = container.querySelectorAll('.guardian-quote-toast');
  if (isMobile && existing.length >= 1) {
    existing[0].remove();
  }
  const toast = document.createElement('div');
  toast.className = 'achievement-toast guardian-quote-toast';
  toast.style.cssText = `
    background: linear-gradient(135deg, rgba(60, 15, 20, 0.97), rgba(40, 10, 15, 0.97));
    border-color: rgba(239, 82, 97, 0.6);
  `;
  toast.innerHTML = `
    <div class="achievement-toast-icon">${icon}</div>
    <div class="achievement-toast-content">
      <div class="achievement-toast-title" style="color:#ff9b9b;">Guardián</div>
      <div class="achievement-toast-name" style="color:#ffb8bd;">${name}</div>
      <div class="achievement-toast-desc">${description}</div>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  const duration = isMobile ? 2200 : 3000;
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

function getObjectiveProgress(ach) {
  const p = progression;
  switch (ach.id) {
    case 'first_maize':  return { current: Math.min(p.totalMaize, 1), target: 1, unit: 'maíz' };
    case 'first_guardian': return { current: Math.min(p.totalGuardiansDefeated, 1), target: 1, unit: 'guardián' };
    case 'first_500':    return { current: Math.min(p.bestScoreSingleRun || 0, 500), target: 500, unit: 'puntos' };
    case 'maize_100':    return { current: Math.min(p.totalMaize, 100), target: 100, unit: 'maíces' };
    case 'maize_1000':   return { current: Math.min(p.totalMaize, 1000), target: 1000, unit: 'maíces' };
    case 'cacao_50':     return { current: Math.min(p.totalCacao, 50), target: 50, unit: 'cacao' };
    case 'guardian_10':  return { current: Math.min(p.totalGuardiansDefeated, 10), target: 10, unit: 'guardianes' };
    case 'guardian_100': return { current: Math.min(p.totalGuardiansDefeated, 100), target: 100, unit: 'guardianes' };
    case 'tezcat_1':     return { current: Math.min(p.totalTezcatlipocaDefeated, 1), target: 1, unit: 'Tezcatlipoca' };
    case 'tezcat_10':    return { current: Math.min(p.totalTezcatlipocaDefeated, 10), target: 10, unit: 'Tezcatlipoca' };
    case 'cipactli_1':   return { current: Math.min(p.totalCipactliDefeated || 0, 1), target: 1, unit: 'Cipactli' };
    case 'cipactli_5':   return { current: Math.min(p.totalCipactliDefeated || 0, 5), target: 5, unit: 'Cipactli' };
    case 'both_bosses':  return { current: Math.min(p.bothBossesInOneRun || 0, 1), target: 1, unit: 'partida' };
    case 'combo_500':    return { current: Math.min(p.bestScoreSingleRun || 0, 500), target: 500, unit: 'puntos' };
    case 'diluvio_1':    return { current: Math.min(Math.floor((p.bestFloodSurvivalMs || 0) / 1000), 60), target: 60, unit: 'seg' };
    case 'diluvio_wave': return { current: Math.min(p.maxFloodWavesInRun || 0, 5), target: 5, unit: 'oleadas' };
    case 'campaign_1':   return { current: p.campaignCompleted.includes(1) ? 1 : 0, target: 1, unit: 'capítulo' };
    case 'campaign_5':   return { current: p.campaignCompleted.includes(5) ? 1 : 0, target: 1, unit: 'capítulo' };
    case 'daily_1':      return { current: p.dailyCompletedOnce ? 1 : 0, target: 1, unit: 'desafío' };
    case 'survive_5min': return { current: Math.min(Math.floor(p.totalSurvivalMs / 60000), 5), target: 5, unit: 'minutos' };
    case 'games_50':     return { current: Math.min(p.totalGamesPlayed, 50), target: 50, unit: 'partidas' };
    case 'timed_500':    return { current: Math.min(p.bestTimedScore, 500), target: 500, unit: 'puntos' };
    case 'zen_60':       return { current: (p.bestZenTimeMs || 999999999) < 60000 ? 1 : 0, target: 1, unit: 'récord' };
    default: return null;
  }
}

function getNextObjective() {
  const pending = OBJECTIVES
    .filter(a => !progression.achievements[a.id])
    .map(a => ({ ach: a, prog: getObjectiveProgress(a) }))
    .filter(x => x.prog);
  if (pending.length === 0) return null;
  pending.sort((a, b) => {
    const ratioA = a.prog.current / a.prog.target;
    const ratioB = b.prog.current / b.prog.target;
    return ratioB - ratioA;
  });
  return pending[0];
}

function updateOnboardingVisibility() {
  if (!objectivesList) return;
  const onboardingDone = progression.achievements['first_maize'] && progression.achievements['first_guardian'] && progression.achievements['first_500'];
  window.__onboardingVisible = !onboardingDone;
  if (!objectivesModal || objectivesModal.classList.contains('hidden')) return;
  renderObjectivesUI();
}

function renderObjectivesUI() {
  if (!objectivesList) return;
  const total = OBJECTIVES.length;
  const done = OBJECTIVES.filter(a => progression.achievements[a.id]).length;
  const pct = Math.round((done / total) * 100);
  if (objectivesCount) objectivesCount.textContent = `${done} / ${total}`;
  if (objectivesFill) objectivesFill.style.width = `${pct}%`;
  if (objectivesNext) {
    const next = getNextObjective();
    if (next) {
      const p = next.prog;
      const pctNext = Math.round((p.current / p.target) * 100);
      objectivesNext.innerHTML = `Próximo objetivo: <strong>${next.ach.name}</strong> — ${p.current} / ${p.target} ${p.unit} (${pctNext}%)`;
    } else {
      objectivesNext.innerHTML = `🎉 ¡Has completado todos los objetivos!`;
    }
  }
  const onboardingDone = progression.achievements['first_maize'] && progression.achievements['first_guardian'] && progression.achievements['first_500'];
  const visible = OBJECTIVES.filter(a => {
    const completed = !!progression.achievements[a.id];
    if (!onboardingDone && !a.onboarding) return false;
    if (objectivesFilter === 'pending') return !completed;
    if (objectivesFilter === 'done') return completed;
    if (objectivesFilter === 'near') {
      const prog = getObjectiveProgress(a);
      return prog && (prog.current / prog.target) >= 0.5 && !completed;
    }
    return true;
  }).sort((a, b) => {
    const pa = getObjectiveProgress(a);
    const pb = getObjectiveProgress(b);
    if (!pa) return 1;
    if (!pb) return -1;
    return (pb.current / pb.target) - (pa.current / pa.target);
  });

  const nextObj = getNextObjective();
  objectivesList.innerHTML = '';
  if (visible.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'objectives-empty';
    empty.textContent = objectivesFilter === 'pending' ? '¡No queda ningún objetivo pendiente!' : 'Aún no has completado ningún objetivo.';
    objectivesList.appendChild(empty);
    return;
  }
  const R = 40;
  const CIRC = 2 * Math.PI * R;
  visible.forEach(ach => {
    const completed = !!progression.achievements[ach.id];
    const prog = getObjectiveProgress(ach);
    const ratio = prog ? Math.min(1, prog.current / prog.target) : (completed ? 1 : 0);
    const dashOffset = CIRC * (1 - ratio);
    const isNext = nextObj && nextObj.ach.id === ach.id;
    const item = document.createElement('div');
    item.className = `objective-item ${completed ? 'completed' : 'pending'}${isNext ? ' is-next' : ''}`;
    const progressText = prog ? `${prog.current} / ${prog.target} ${prog.unit}` : (completed ? '✓ Completado' : '');
    item.innerHTML = `
      <div class="objective-medallion">
        <svg class="objective-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="objective-ring-bg" cx="50" cy="50" r="${R}" />
          <circle class="objective-ring-fill" cx="50" cy="50" r="${R}" stroke-dasharray="${CIRC.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}" />
        </svg>
        <div class="objective-disc">
          <div class="objective-icon">${ach.icon}</div>
          <div class="objective-status" aria-hidden="true">✓</div>
        </div>
      </div>
      <div class="objective-content">
        <div class="objective-name">${ach.name}</div>
        ${progressText ? `<div class="objective-progress-text">${progressText}</div>` : ''}
        <div class="objective-desc">${ach.description}</div>
      </div>
    `;
    objectivesList.appendChild(item);
  });
}

function openObjectives() {
  if (!objectivesModal || !objectivesModal.classList.contains('hidden')) return;
  const wasRunning = isGameRunning;
  if (wasRunning && !isPaused) pauseForModal();
  if (settingsModal) settingsModal.classList.add('hidden');
  renderObjectivesUI();
  objectivesModal.dataset.wasRunning = wasRunning ? '1' : '0';
  objectivesModal.classList.remove('hidden');
}

function closeObjectives() {
  if (!objectivesModal || objectivesModal.classList.contains('hidden')) return;
  objectivesModal.classList.add('hidden');
  const wasRunning = objectivesModal.dataset.wasRunning === '1';
  delete objectivesModal.dataset.wasRunning;
  resumeIfWasRunning(wasRunning);
  updateGuardianBadge();
  if (!welcomeScreen.classList.contains('hidden') && welcomeStartBtn) {
    welcomeStartBtn.classList.remove('hidden');
  }
}

// ========================================================
// 8. BADGE MANAGER
// ========================================================
const BadgeManager = (() => {
  const isMobile = () => window.innerWidth <= 768;
  const MAX_MEDIUM_MOBILE = 1;
  const MAX_HIGH_MOBILE = 2;
  const MAX_SPECIAL_MOBILE = 1;
  const mediumOrder = ['flood', 'cipactli', 'cosmicOrder', 'rain', 'sacrificeOffering', 'cosmicOrderFood', 'skullFood', 'threat'];
  const highOrder = ['furia', 'air', 'immunity', 'freeze', 'respawn'];
  const specialOrder = ['campaign', 'daily', 'timer', 'eclipse', 'xibalba', 'darkness'];
  const refs = {
    immunity: document.getElementById('immunity-badge'),
    furia: furiaBadge, air: airBadge, respawn: respawnBadge, freeze: freezeBadge,
    rain: rainBadge, cosmicOrder: cosmicOrderBadge, cosmicOrderFood: cosmicOrderFoodBadge,
    sacrificeOffering: sacrificeOfferingBadge, skullFood: skullFoodBadge, threat: threatBadge,
    timer: timerBadge, eclipse: eclipseBadge, xibalba: xibalbaBadge, darkness: darknessBadge,
    flood: floodBadge,
    campaign: campaignBadge,
    daily: dailyBadge
  };
  const logical = {
    immunity: false, furia: false, air: false, respawn: false, freeze: false, rain: false,
    cosmicOrder: false, cosmicOrderFood: false, sacrificeOffering: false,
    skullFood: false, threat: false, timer: false, eclipse: false, xibalba: false, darkness: false,
    flood: false, campaign: false, daily: false
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
      highOrder.forEach(k => { const el = refs[k]; if (el) el.classList.toggle('hidden', !visibleHigh.has(k)); });
    } else {
      highOrder.forEach(k => { const el = refs[k]; if (el) el.classList.toggle('hidden', !logical[k]); });
    }
    if (mobile) {
      const active = mediumOrder.filter(k => logical[k]);
      const visible = new Set(active.slice(0, MAX_MEDIUM_MOBILE));
      mediumOrder.forEach(k => {
        const el = refs[k]; if (!el) return;
        el.classList.toggle('is-visible', visible.has(k));
        el.classList.toggle('hidden', !logical[k]);
      });
    } else {
      mediumOrder.forEach(k => {
        const el = refs[k]; if (!el) return;
        el.classList.toggle('hidden', !logical[k]);
        el.classList.remove('is-visible');
      });
    }
    if (mobile) {
      const active = specialOrder.filter(k => logical[k]);
      const visible = new Set(active.slice(0, MAX_SPECIAL_MOBILE));
      specialOrder.forEach(k => {
        const el = refs[k]; if (!el) return;
        el.classList.toggle('is-visible', visible.has(k));
        el.classList.toggle('hidden', !logical[k]);
      });
    } else {
      specialOrder.forEach(k => {
        const el = refs[k]; if (!el) return;
        el.classList.toggle('hidden', !logical[k]);
        el.classList.remove('is-visible');
      });
    }
  }
  function resetAll() {
    Object.keys(logical).forEach(k => logical[k] = false);
    apply();
  }
  return { setVisible, refresh: apply, isMobile, resetAll };
})();
window.addEventListener('resize', () => BadgeManager.refresh());

// ========================================================
// 9. ESTADÍSTICAS
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
    if (statisticsStorageStatus) statisticsStorageStatus.textContent = 'Este navegador no permite guardar estadísticas.';
    return createEmptyStats();
  }
  if (!saved) return createEmptyStats();
  try {
    const parsed = JSON.parse(saved);
    if (isValidStats(parsed)) return parsed;
    throw new Error('Formato inválido');
  } catch (e) {
    console.error('No se pudieron cargar las estadísticas.', e);
    if (statisticsStorageStatus) statisticsStorageStatus.textContent = 'No se pudieron leer las estadísticas guardadas.';
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
  if (statisticsModeTbody) {
    statisticsModeTbody.innerHTML = '';
    Object.keys(MODE_NAMES).forEach(modeKey => {
      const tr = document.createElement('tr');
      const best = progression.bestScoreByMode[modeKey] || 0;
      const games = progression.gamesPlayedByMode[modeKey] || 0;
      tr.innerHTML = `<th scope="row">${MODE_NAMES[modeKey]}</th><td>${games}</td><td>${best}</td>`;
      statisticsModeTbody.appendChild(tr);
    });
  }
}
function saveStats() {
  updateStatisticsUI();
  if (!safeSetItem(STATISTICS_STORAGE_KEY, JSON.stringify(gameStatistics))) {
    if (statisticsStorageStatus) statisticsStorageStatus.textContent = 'No se pudieron guardar las estadísticas.';
  } else if (statisticsStorageStatus) {
    statisticsStorageStatus.textContent = '';
  }
}
function finishRunStatistics() {
  if (runStartedAt === null || runDifficulty === null) return;
  const survivalMs = gameTime - runStartedAt;
  try {
    const r = gameStatistics[runDifficulty];
    if (r) {
      r.gamesPlayed++;
      r.bestScore = Math.max(r.bestScore, score);
      r.bestSurvivalMs = Math.max(r.bestSurvivalMs, survivalMs);
      r.guardiansDefeated += runGuardiansDefeated;
      saveStats();
    }
  } catch (e) { console.warn('[Kukulcán] Error guardando stats:', e); }
  try {
    progression.totalGamesPlayed++;
    progression.totalSurvivalMs += survivalMs;
    progression.totalGuardiansDefeated += runGuardiansDefeated;
    progression.maizeCoins += Math.floor(score / 10);
    progression.bestScoreSingleRun = Math.max(progression.bestScoreSingleRun || 0, score);
    if (runCipactliDefeated > 0 && runTezcatlipocaDefeated > 0) progression.bothBossesInOneRun = (progression.bothBossesInOneRun || 0) + 1;
    const modeKey = runMode || 'classic';
    if (progression.bestScoreByMode[modeKey] !== undefined) {
      progression.bestScoreByMode[modeKey] = Math.max(progression.bestScoreByMode[modeKey], score);
      progression.gamesPlayedByMode[modeKey] = (progression.gamesPlayedByMode[modeKey] || 0) + 1;
    }
    if (modeKey === 'timed') progression.bestTimedScore = Math.max(progression.bestTimedScore, score);
    if (modeKey === 'flood') {
      progression.bestFloodSurvivalMs = Math.max(progression.bestFloodSurvivalMs || 0, survivalMs);
      progression.maxFloodWavesInRun = Math.max(progression.maxFloodWavesInRun || 0, runFloodWaves);
      progression.totalFloodWaves = (progression.totalFloodWaves || 0) + runFloodWaves;
    }
    if (modeKey === 'zen' && campaignWon) {
      progression.bestZenTimeMs = Math.min(progression.bestZenTimeMs || 999999999, survivalMs);
    }
    if (modeKey === 'daily' && dailyChallenge) {
      const dateStr = dailyChallenge.dateStr;
      const prev = progression.dailyScores[dateStr];
      if (!prev || score > prev.score) {
        progression.dailyScores[dateStr] = { score, completedAt: Date.now(), rule: dailyChallenge.rule ? dailyChallenge.rule.id : null };
      }
      progression.dailyCompletedOnce = true;
      progression.maizeCoins += 50;
    }
    saveProgression();
  } catch (e) { console.warn('[Kukulcán] Error guardando progresión:', e); }
  try { checkAchievements(); } catch (e) { console.warn('[Kukulcán] Error en checkAchievements:', e); }
  if (customizeCoinsValue) customizeCoinsValue.textContent = progression.maizeCoins;
  if (dtCoins) dtCoins.textContent = progression.maizeCoins;
  runStartedAt = null;
  runDifficulty = null;
  runGuardiansDefeated = 0;
  runCipactliDefeated = 0;
  runTezcatlipocaDefeated = 0;
  runFloodWaves = 0;
}

// ========================================================
// 10. ESCALADO / CANVAS
// ========================================================
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  TILE_SIZE = width < 480 ? 20 : 24;
  const newW = Math.floor(width * dpr);
  const newH = Math.floor(height * dpr);
  if (canvas.width !== newW || canvas.height !== newH) {
    canvas.width = newW;
    canvas.height = newH;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gridCols = Math.max(14, Math.floor(width / TILE_SIZE));
  gridRows = Math.max(14, Math.floor(height / TILE_SIZE));
  isMobileDevice = width <= 768;
  rebuildBoardCanvas(width, height, dpr, false);
  if (!isGameRunning) draw(1, false);
}

function rebuildBoardCanvas(width, height, dpr, force = false) {
  const themeId = progression.selectedTheme || 'classic';
  const needsRebuild = force || !boardCanvas || boardWidth !== width || boardHeight !== height || boardTheme !== themeId;
  if (!needsRebuild) return;
  if (!boardCanvas) {
    boardCanvas = document.createElement('canvas');
    boardContext = boardCanvas.getContext('2d', { alpha: false });
  }
  boardCanvas.width = Math.max(1, Math.floor(width * dpr));
  boardCanvas.height = Math.max(1, Math.floor(height * dpr));
  boardWidth = width; boardHeight = height; boardTheme = themeId;
  boardContext.setTransform(1, 0, 0, 1, 0, 0);
  boardContext.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
  boardContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  const theme = BOARD_THEMES[themeId] || BOARD_THEMES.classic;
  boardContext.fillStyle = theme.bg;
  boardContext.fillRect(0, 0, width, height);
  boardContext.strokeStyle = theme.gridLine;
  boardContext.lineWidth = 1;
  const offsetX = (width % TILE_SIZE) / 2;
  const offsetY = (height % TILE_SIZE) / 2;
  for (let x = offsetX; x <= width; x += TILE_SIZE) {
    boardContext.beginPath(); boardContext.moveTo(x, 0); boardContext.lineTo(x, height); boardContext.stroke();
  }
  for (let y = offsetY; y <= height; y += TILE_SIZE) {
    boardContext.beginPath(); boardContext.moveTo(0, y); boardContext.lineTo(width, y); boardContext.stroke();
  }
  boardContext.fillStyle = theme.patternColor;
  if (theme.patternType === 'diamond') {
    for (let x = offsetX + TILE_SIZE * 2; x <= width; x += TILE_SIZE * 4) {
      for (let y = offsetY + TILE_SIZE * 2; y <= height; y += TILE_SIZE * 4) {
        boardContext.beginPath();
        boardContext.moveTo(x, y - 3); boardContext.lineTo(x + 3, y);
        boardContext.lineTo(x, y + 3); boardContext.lineTo(x - 3, y);
        boardContext.closePath(); boardContext.fill();
      }
    }
  } else if (theme.patternType === 'crack') {
    boardContext.strokeStyle = theme.patternColor;
    boardContext.lineWidth = 1.5;
    let s = 12345;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 12; i++) {
      const cx = rand() * width;
      const cy = rand() * height;
      boardContext.beginPath(); boardContext.moveTo(cx, cy);
      let lx = cx, ly = cy;
      for (let k = 0; k < 4; k++) {
        lx += (rand() - 0.5) * TILE_SIZE * 3;
        ly += (rand() - 0.5) * TILE_SIZE * 3;
        boardContext.lineTo(lx, ly);
      }
      boardContext.stroke();
    }
  }
  const centerGlow = boardContext.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height) * 0.55);
  centerGlow.addColorStop(0, 'rgba(255, 200, 100, 0.06)');
  centerGlow.addColorStop(0.5, 'rgba(255, 150, 50, 0.02)');
  centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  boardContext.fillStyle = centerGlow;
  boardContext.fillRect(0, 0, width, height);
  const centerX = width / 2, centerY = height / 2;
  boardContext.strokeStyle = theme.patternColor;
  boardContext.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const size = TILE_SIZE * (6 + i * 2);
    boardContext.beginPath();
    boardContext.rect(centerX - size/2, centerY - size/2, size, size);
    boardContext.stroke();
  }
}

function updateThemeColors() {
  const themeId = progression.selectedTheme || 'classic';
  const theme = BOARD_THEMES[themeId] || BOARD_THEMES.classic;
  document.documentElement.style.setProperty('--bg-1', theme.bg);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme.bg);
  rebuildBoardCanvas(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2), true);
  if (!isGameRunning) draw(1, false);
}

let resizeTimeout = null;
function debouncedResizeCanvas() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => { resizeCanvas(); resizeWelcomeDemo(); }, 200);
}
window.addEventListener('resize', debouncedResizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(debouncedResizeCanvas, 200));

// ========================================================
// 11. AUDIO
// ========================================================
let audioCtx = null;
let musicTimer = null;
let musicLayer = 0;
let musicTick = 0;
let _audioCtxCreatedAt = 0;

function getAudioContext() {
  try {
    const now = performance.now();
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        _audioCtxCreatedAt = now;
      }
    }
    if (audioCtx && audioCtx.state === 'suspended' && now - _audioCtxCreatedAt > 100) {
      audioCtx.resume().catch(() => {});
    }
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
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur / 1000);
    o.onended = () => { try { o.disconnect(); g.disconnect(); } catch (e) {} };
    return o;
  } catch (e) { return null; }
}

const MUSIC_LAYERS = {
  1: { notes: [130.81, 155.56, 174.61, 196.00], interval: 950, type: 'sine', vol: 0.045, drumEvery: 4 },
  2: { notes: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63], interval: 640, type: 'triangle', vol: 0.055, drumEvery: 3 },
  3: { notes: [174.61, 196.00, 233.08, 261.63, 311.13, 349.23, 392.00], interval: 440, type: 'sawtooth', vol: 0.05, drumEvery: 2 },
  4: { notes: [233.08, 261.63, 311.13, 349.23, 392.00, 466.16, 523.25], interval: 290, type: 'square', vol: 0.045, drumEvery: 1 }
};

function getDesiredMusicLayer() {
  if (!isGameRunning || isPaused) return 0;
  if (isFuria) return 4;
  const guardianCount = enemyGuardians.length;
  const snakeLength = snake.length;
  const hasBoss = enemyGuardians.some(g => g.traits.isBoss);
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
    if (layer.drumEvery && musicTick % layer.drumEvery === 0) {
      playTone(55, 180, 0.09, 'sine');
      setTimeout(() => playTone(60, 120, 0.06, 'sine'), 50);
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

function startMusic() { stopMusic(); musicTick = 0; musicLayer = 1; playMusicTick(); }
function stopMusic() { if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; } }
function updateMusicLayer() {
  const desired = getDesiredMusicLayer();
  if (desired !== musicLayer) { musicLayer = desired; musicTick = 0; }
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
    const now = performance.now();
    const delta = now - lastEatPitch;
    const pitch = delta < 300 ? 1.4 : delta < 600 ? 1.2 : 1.0;
    playTone(740 * pitch, 45, 0.11, 'square');
    setTimeout(() => playTone(1108 * pitch, 60, 0.13, 'square'), 40);
    lastEatPitch = now;
  }
}

function playFuriaStartSound() {
  if (isMuted) return;
  try {
    const a = getAudioContext(); if (!a) return;
    const now = a.currentTime;
    const o1 = a.createOscillator(); const g1 = a.createGain();
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
    const a = getAudioContext(); if (!a) return;
    const now = a.currentTime;
    const o1 = a.createOscillator(); const g1 = a.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(440, now);
    o1.frequency.exponentialRampToValueAtTime(1320, now + 0.45);
    o1.frequency.exponentialRampToValueAtTime(660, now + 0.7);
    g1.gain.setValueAtTime(0.0001, now);
    g1.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    o1.connect(g1); g1.connect(a.destination);
    o1.start(now); o1.stop(now + 0.75);
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
    const a = getAudioContext(); if (!a) return;
    const now = a.currentTime;
    const layers = [
      { f: 82, ef: 34, d: 0.72, v: 0.3, t: 'sawtooth' },
      { f: 196, ef: 49, d: 0.58, v: 0.22, t: 'triangle' },
      { f: 523, ef: 131, d: 0.34, v: 0.13, t: 'square' }
    ];
    layers.forEach(l => {
      const o = a.createOscillator(); const g = a.createGain();
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
function playEclipseSound() {
  if (isMuted) return;
  try {
    const a = getAudioContext(); if (!a) return;
    const now = a.currentTime;
    const o = a.createOscillator(); const g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(220, now);
    o.frequency.linearRampToValueAtTime(55, now + 1.2);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.22, now + 0.05);
    g.gain.linearRampToValueAtTime(0.0001, now + 1.3);
    o.connect(g); g.connect(a.destination);
    o.start(now); o.stop(now + 1.35);
  } catch (e) {}
}
function playXibalbaSound() {
  if (isMuted) return;
  playTone(155, 300, 0.2, 'sawtooth');
  setTimeout(() => playTone(130, 350, 0.18, 'sawtooth'), 200);
}
function playTimerWarningSound() {
  if (isMuted) return;
  playTone(660, 100, 0.18, 'square');
  setTimeout(() => playTone(880, 100, 0.18, 'square'), 120);
  setTimeout(() => playTone(660, 100, 0.18, 'square'), 240);
}
function playGameOverSound() {
  if (isMuted) return;
  const notes = [311, 293, 261, 220, 155, 110];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 220, 0.16, 'sawtooth'), i * 120));
}
function playCipactliRoar() {
  if (isMuted) return;
  try {
    const a = getAudioContext(); if (!a) return;
    const now = a.currentTime;
    const o1 = a.createOscillator(); const g1 = a.createGain();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(90, now);
    o1.frequency.exponentialRampToValueAtTime(45, now + 0.9);
    g1.gain.setValueAtTime(0.0001, now);
    g1.gain.linearRampToValueAtTime(0.35, now + 0.08);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    o1.connect(g1); g1.connect(a.destination);
    o1.start(now); o1.stop(now + 1.05);
    setTimeout(() => playTone(180, 150, 0.2, 'square'), 120);
    setTimeout(() => playTone(140, 200, 0.18, 'sawtooth'), 240);
  } catch (e) {}
}
function playDamageSound() {
  if (isMuted) return;
  playTone(220, 100, 0.18, 'sawtooth');
  setTimeout(() => playTone(165, 150, 0.2, 'sawtooth'), 80);
}
function playZenCompleteSound() {
  if (isMuted) return;
  const notes = [523, 659, 784, 1046, 1318];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 200, 0.2, 'sine'), i * 120));
}
function playChapterCompleteSound() {
  if (isMuted) return;
  const notes = [392, 523, 659, 784, 1046];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 250, 0.22, 'triangle'), i * 150));
}
function playAchievementSound() {
  if (isMuted) return;
  try {
    playTone(1046, 90, 0.16, 'sine');
    setTimeout(() => { if (!isMuted) playTone(1318, 90, 0.17, 'sine'); }, 80);
    setTimeout(() => { if (!isMuted) playTone(1567, 160, 0.18, 'sine'); }, 160);
  } catch (e) {}
}
function vibrate(pattern) {
  if (navigator.vibrate && !isMuted) { try { navigator.vibrate(pattern); } catch (e) {} }
}
function updateSoundUI() {
  const icon = isMuted ? '🔇' : '🔊';
  if (dtSoundBtn) dtSoundBtn.textContent = icon;
  if (mbSoundBtn) mbSoundBtn.textContent = icon;
  if (settingsSoundToggle) settingsSoundToggle.checked = !isMuted;
}
function toggleSound(forceState = null) {
  isMuted = forceState !== null ? !forceState : !isMuted;
  safeSetItem('snakeIoMuted', isMuted);
  updateSoundUI();
  if (!isMuted && isGameRunning && !isPaused) { getAudioContext(); startMusic(); }
  else stopMusic();
}

// ========================================================
// 12. FURIA
// ========================================================
function triggerFuria() {
  if (dailyState.furiaDisabled) return;
  if (isFuria || getFuriaCooldownRemaining() > 0 || !isGameRunning || isPaused || countdownEndsAt !== null) return;
  const now = performance.now();
  isFuria = true;
  furiaReadyAt = gameTime + FURIA_DURATION_MS;
  furiaCooldownUntil = furiaReadyAt + FURIA_COOLDOWN_MS;
  furiaCooldownUntilReal = now + FURIA_DURATION_MS + FURIA_COOLDOWN_MS * dailyState.furiaCooldownMultiplier;
  furiaAuraStart = gameTime;
  isOnFire = false;
  updateFuriaUI();
  playFuriaStartSound();
  vibrate([30, 20, 30]);
  const head = snake[0];
  if (head) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    const burst = isSlowDevice ? 12 : 24;
    for (let i = 0; i < burst; i++) {
      const a = (Math.PI * 2 * i) / burst + Math.random() * 0.3;
      const sp = 2 + Math.random() * 3;
      particles.push({
        x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 2.5 + Math.random() * 3,
        color: ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'][i % 4],
        alpha: 1, decay: 0.022
      });
    }
    spawnFloatingText('🔥 ¡FURIA DE XIUHCÓATL!', hx, hy - TILE_SIZE, '#ff6b2c');
    triggerHeadPulse('#ff6b2c');
    screenShake = 10;
  }
  BadgeManager.setVisible('furia', true);
  if (furiaTimerSpan) furiaTimerSpan.textContent = Math.ceil(FURIA_DURATION_MS / 1000);
  updateMusicLayer();
  announce('Furia de Xiuhcóatl activada');
}

function getFuriaCooldownRemaining() {
  if (dailyState.furiaNoCooldown) return 0;
  const byGame = Math.max(0, furiaCooldownUntil - gameTime);
  const byReal = Math.max(0, furiaCooldownUntilReal - performance.now());
  return Math.max(byGame, byReal);
}

function updateFuriaUI() {
  if (!btnTurbo) return;
  const cooldownRemaining = getFuriaCooldownRemaining();
  const charge = isFuria ? 1 : cooldownRemaining > 0 ? 1 - cooldownRemaining / FURIA_COOLDOWN_MS : 1;
  btnTurbo.classList.toggle('active', isFuria);
  btnTurbo.classList.toggle('cooldown', cooldownRemaining > 0 && !isFuria);
  btnTurbo.disabled = (cooldownRemaining > 0 && !isFuria) || !isGameRunning || isPaused || countdownEndsAt !== null || dailyState.furiaDisabled;
  turboIcon.textContent = dailyState.furiaDisabled ? '🚫' : '🔥';
  turboLabel.textContent = dailyState.furiaDisabled ? 'BLOQ' : isFuria ? 'FURIA' : cooldownRemaining > 0 ? 'RECARGA' : 'FURIA';
  btnTurbo.setAttribute('aria-label', isFuria ? 'Furia de Xiuhcóatl activa' : 'Activar Furia de Xiuhcóatl');
  if (turboProgress) turboProgress.style.setProperty('--turbo-charge', `${Math.round(charge * 100)}%`);
}

// ========================================================
// 13. EFECTOS VISUALES
// ========================================================
function triggerHeadPulse(color = '#d5bd70') { headPulse = 1; headPulseColor = color; }

function spawnFloatingText(text, x, y, color = '#4ec9a0') {
  const max = window.innerWidth <= 768 ? 3 : 8;
  if (!isGameRunning && !welcomeScreen.classList.contains('hidden')) return;
  if (floatingTexts.length >= max) floatingTexts.splice(0, floatingTexts.length - max + 1);
  let ty = y - 38; let tx = x;
  for (const ft of floatingTexts) {
    if (Math.abs(ft.x - tx) < 48 && Math.abs(ft.y - ty) < 32) { ty -= 22; tx += (Math.random() > 0.5 ? 24 : -24); }
  }
  tx = Math.max(50, Math.min(window.innerWidth - 50, tx));
  ty = Math.max(35, ty);
  floatingTexts.push({ text, x: tx, y: ty, vy: -1.3, alpha: 1, color, scale: 0.6, life: 0, pop: 0 });
}

function spawnDamageRing(x, y, color = '#ef5261') {
  damageRings.push({
    x, y, radius: TILE_SIZE * 0.4, maxRadius: TILE_SIZE * 2.5,
    color, alpha: 0.9, decay: 0.025
  });
}

function spawnWorldCrossingEffect(x, y) {
  triggerHeadPulse('#8be7ff');
  const colors = ['#8be7ff', '#4ec9a0', '#d5bd70'];
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5;
    const s = 0.7 + (i % 2) * 0.35;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: 2.2, color: colors[i % colors.length], alpha: 0.8, decay: 0.09 });
  }
}
function spawnFuriaTrail(x, y) {
  if (reduceMotion) return;
  const colors = ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'];
  const back = Math.atan2(-direction.y, -direction.x);
  const count = isSlowDevice ? 1 : 3;
  for (let i = 0; i < count; i++) {
    const a = back + (Math.random() - 0.5) * 0.8;
    const s = Math.random() * 1.5 + 0.8;
    particles.push({
      x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 6,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      size: Math.random() * 1.8 + 1.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.9, decay: 0.045
    });
  }
}
function spawnAirTrail(x, y) {
  if (reduceMotion) return;
  const colors = ['#b3e5ff', '#d9f0ff', '#ffffff'];
  const count = isSlowDevice ? 1 : 3;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 12, y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 1.8 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.7, decay: 0.05
    });
  }
}
function spawnJadeTrail(x, y) {
  if (reduceMotion) return;
  const colors = ['#7de8c4', '#4ec9a0', '#fff0b0'];
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 - 0.2,
      size: Math.random() * 1.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.85, decay: 0.035
    });
  }
}
function spawnEatBurst(x, y, color = '#d5bd70', count = 6) {
  if (reduceMotion) count = Math.max(2, Math.floor(count / 2));
  if (window.innerWidth <= 768) count = Math.min(count, 4);
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const sp = 1 + Math.random() * 1.8;
    particles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      size: 1.8 + Math.random() * 1.8,
      color: Math.random() > 0.5 ? color : '#fff8dc',
      alpha: 1, decay: 0.035
    });
  }
}

function updateAndDrawParticles(updateState = true) {
  const MAX_PARTICLES = window.innerWidth <= 768 ? 40 : (isSlowDevice ? 60 : 90);
  const screenW = window.innerWidth, screenH = window.innerHeight;
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (updateState) { p.x += p.vx; p.y += p.vy; p.alpha -= p.decay; }
    const isOffScreen = p.x < -50 || p.x > screenW + 50 || p.y < -50 || p.y > screenH + 50;
    if (p.alpha <= 0 || isOffScreen) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (let i = damageRings.length - 1; i >= 0; i--) {
    const ring = damageRings[i];
    if (updateState) { ring.radius += 3; ring.alpha -= ring.decay; }
    if (ring.alpha <= 0 || ring.radius > ring.maxRadius) { damageRings.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, ring.alpha));
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    if (updateState) {
      ft.y += ft.vy; ft.alpha -= 0.028; ft.life += 1;
      ft.pop = Math.min(1, ft.pop + 0.25);
      ft.scale = ft.pop < 0.6 ? 0.6 + ft.pop * 0.9 : Math.max(1, ft.scale);
    }
    if (ft.alpha <= 0) { floatingTexts.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, Math.min(1, ft.alpha));
    const fontSize = Math.round(14 * ft.scale);
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const m = ctx.measureText(ft.text);
    const w = m.width + 14;
    ctx.fillStyle = 'rgba(20, 23, 32, 0.85)';
    roundRect(ctx, ft.x - w / 2, ft.y - 11, w, 22, 7); ctx.fill();
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.globalAlpha = 1;
}

// ========================================================
// 14. INMUNIDAD / FREEZE / AIRE
// ========================================================
function activateImmunity(seconds = 10) {
  isImmune = true;
  immunityExpiresAt = gameTime + seconds * 1000;
  if (immunityTimerSpan) immunityTimerSpan.textContent = seconds;
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
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 1.8 + Math.random() * 1.5, color: ['#7de8c4', '#4ec9a0', '#fff0b0'][i % 3], alpha: 1, decay: 0.03 });
    }
  }
  updateMusicLayer();
}
function deactivateImmunity() {
  isImmune = false;
  immunityExpiresAt = 0;
  BadgeManager.setVisible('immunity', false);
  clearFireBreath();
}
function hasGuardianProtection() { return isImmune || gameTime < respawnProtectedUntil; }

function activateGuardianFreeze() {
  const profile = getDifficultyProfile();
  guardiansFrozenUntil = gameTime + profile.freezeDurationMs;
  enemyGuardians.forEach(g => { if (g.frozenAt === null) g.frozenAt = gameTime; });
  if (freezeTimerSpan) freezeTimerSpan.textContent = String(Math.ceil(profile.freezeDurationMs / 1000));
  BadgeManager.setVisible('freeze', true);
  vibrate(25);
  const head = snake[0];
  if (head) {
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 18; i++) {
      const a = (Math.PI * 2 * i) / 18;
      const sp = 2 + Math.random() * 2;
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 1.5 + Math.random() * 1.5, color: ['#8be7ff', '#d7f6ff', '#4fc3f7'][i % 3], alpha: 1, decay: 0.03 });
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
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2 + Math.random() * 2, color: ['#b3e5ff', '#d9f0ff', '#ffffff'][i % 3], alpha: 0.9, decay: 0.035 });
    }
  }
}
function deactivateAirBoost() { airBoostUntil = 0; BadgeManager.setVisible('air', false); }

// ========================================================
// 15. LOOP
// ========================================================
function getCurrentSpeed() {
  if (_cachedSpeedTick === gameTime) return _cachedSpeed;
  const sel = difficultySelect.value;
  const base = SPEEDS[sel] || SPEEDS.medium;
  const lengthPenalty = Math.max(0, snake.length - 3) * 1.2;
  let adaptive = Math.max(base * 0.78, base - lengthPenalty);
  adaptive *= dailyState.speedMultiplier;
  if (isFuria) adaptive *= 0.55;
  else if (airBoostUntil > gameTime) adaptive *= AIR_BOOST_MULTIPLIER;
  if (GAME_MODES[gameModeSelect.value]?.hasHuntTrail && snake.length > 0) {
    const head = snake[0];
    if (huntTrail.some(t => t.x === head.x && t.y === head.y)) adaptive *= HUNT_TRAIL_SLOW_FACTOR;
  }
  if (floodSlowUntil > gameTime) adaptive *= FLOOD_SLOW_FACTOR;
  const result = Math.max(16, adaptive);
  _cachedSpeed = result;
  _cachedSpeedTick = gameTime;
  return result;
}
function snapshotRenderPositions() {
  previousSnakePositions = snake.map(s => ({ ...s }));
  previousGuardianPositions = new Map(
    enemyGuardians.map(g => [g.id, g.segments.map(s => ({ ...s }))])
  );
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
  if (!isGameRunning || isPaused) { lastFrameTimestamp = null; return; }
  let elapsedMs = lastFrameTimestamp === null ? 0 : timestamp - lastFrameTimestamp;
  if (elapsedMs > 500) {
    isPaused = true;
    lastFrameTimestamp = null;
    stopMusic(); stopGameLoop(); updateFuriaUI(); updatePauseButtonUI();
    if (!isAnyModalOpen() && pauseOverlay) pauseOverlay.classList.remove('hidden');
    draw(renderInterpolation, false);
    return;
  }
  elapsedMs = Math.max(0, Math.min(100, elapsedMs));
  if (elapsedMs > 0) {
    frameTimeEMA = frameTimeEMA * (1 - EMA_ALPHA) + elapsedMs * EMA_ALPHA;
    const wasSlow = isSlowDevice;
    isSlowDevice = frameTimeEMA > 22;
    if (isSlowDevice && !wasSlow) console.info('[Kukulcán] Modo rendimiento activado');
  }
  lastFrameTimestamp = timestamp;
  let updateEffects = false;
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
      renderInterpolation = 0;
      scheduleEnemySpawn();
    }
  } else {
    updateEffects = true;
    updateGameTimers(elapsedMs);
    if (!isGameRunning) { lastFrameTimestamp = null; return; }
    const speedThisFrame = getCurrentSpeed();
    simulationAccumulator = Math.min(simulationAccumulator + elapsedMs, speedThisFrame * 3);
    let ticks = 0;
    let maxTicks = 3;
    if (isMobileDevice) maxTicks = 2;
    if (isSlowDevice) maxTicks = 1;
    while (isGameRunning && !isPaused && countdownEndsAt === null && ticks < maxTicks && simulationAccumulator >= speedThisFrame) {
      snapshotRenderPositions();
      gameUpdate();
      simulationAccumulator -= speedThisFrame;
      ticks++;
    }
    if (simulationAccumulator < 0) simulationAccumulator = 0;
    renderInterpolation = Math.min(1, simulationAccumulator / speedThisFrame);
  }
  draw(renderInterpolation, updateEffects);
  if (isGameRunning && !isPaused) animationFrameId = requestAnimationFrame(gameLoopFrame);
}

function startGameLoop() {
  if (animationFrameId !== null) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
  lastFrameTimestamp = null;
  animationFrameId = requestAnimationFrame(gameLoopFrame);
}
function stopGameLoop() {
  if (animationFrameId !== null) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
  lastFrameTimestamp = null;
}

// ========================================================
// 16. GUARDIANES — SPAWN
// ========================================================
function scheduleEnemySpawn(retryDelay = null) {
  if (_spawnScheduled) return;
  const profile = getDifficultyProfile();
  const target = profile.guardianTargets;
  const normalGuardians = enemyGuardians.filter(g => !g.traits.isBoss).length;
  updateGuardianBadge();
  if (!isGameRunning || normalGuardians >= target || cosmicOrderResolveAt !== null) {
    enemySpawnAt = null;
    return;
  }
  if (isPaused || countdownEndsAt !== null) return;
  let delay = retryDelay ?? (hasSpawnedGuardian ? profile.guardianNextSpawnMs : profile.guardianFirstSpawnMs);
  if (dailyState.guardianFirstSpawnMs > 0 && !hasSpawnedGuardian) {
    delay = dailyState.guardianFirstSpawnMs;
  }
  enemySpawnAt = gameTime + delay;
  _spawnScheduled = true;
  _spawnTimeoutId = setTimeout(() => {
    _spawnScheduled = false;
    _spawnTimeoutId = null;
  }, delay);
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
  const normalCount = enemyGuardians.filter(g => !g.traits.isBoss).length;
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
    const candidate = Array.from({ length: 4 }, (_, i) => ({ x: (x - i + gridCols) % gridCols, y }));
    const dx = Math.min(Math.abs(x - snake[0].x), gridCols - Math.abs(x - snake[0].x));
    const dy = Math.min(Math.abs(y - snake[0].y), gridRows - Math.abs(y - snake[0].y));
    if (dx + dy < 8) continue;
    if (candidate.some(c => !isCellFreeForNewGuardian(c.x, c.y))) continue;
    if (enemyGuardians.some(g => g.segments.some(s => Math.abs(s.x - x) + Math.abs(s.y - y) < 5))) continue;
    const id = nextEnemyId++;
    const def = getUniqueGuardianDef();
    const guardian = {
      id, segments: candidate, direction: { x: 1, y: 0 }, tickCounter: 0,
      expiresAt: gameTime + profile.guardianLifetimeMs,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette, behavior: { id: def.behavior, name: def.name },
      traits: def.traits, ambientParticles: def.ambientParticles,
      lastMoveTick: -1, targetIndicator: null, recentCells: [], icon: def.icon,
      personality: { aggression: 0.7 + Math.random() * 0.6, caution: Math.random() * 0.4, preferredDistance: 3 + Math.floor(Math.random() * 4) }
    };
    enemyGuardians.push(guardian);
    hasSpawnedGuardian = true;
    updateGuardianBadge();
    const hx = x * TILE_SIZE + TILE_SIZE / 2;
    const hy = y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10;
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, size: 2, color: def.palette.head, alpha: 1, decay: 0.03 });
    }
    spawnFloatingText('⚠️ ' + def.name, hx, hy - TILE_SIZE, def.palette.head);
    if (!window.__guardianQuotesShown) window.__guardianQuotesShown = {};
    if (!window.__guardianQuotesShown[def.behavior]) {
      window.__guardianQuotesShown[def.behavior] = true;
      const quote = GUARDIAN_QUOTES[def.behavior];
      if (quote) {
        setTimeout(() => { showGuardianQuoteToast(def.icon || '💀', def.name, quote); }, 800);
      }
    }
    announce(`Guardián apareció: ${def.name}`);
    updateMusicLayer();
    return true;
  }
  return false;
}

function spawnCipactli() {
  const difficulty = getEffectiveDifficulty();
  const config = CIPACTLI_CONFIG[difficulty] || CIPACTLI_CONFIG.medium;
  if (enemyGuardians.some(g => g.traits.isCipactli)) return false;
  if (enemyGuardians.some(g => g.traits.isTezcatlipoca)) return false;
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
    if (dx + dy < 10) continue;
    if (isGuardianCellOccupied(x, y)) continue;
    const id = nextEnemyId++;
    const def = GUARDIAN_DEFS.find(d => d.behavior === 'cipactli');
    const segments = [
      { x, y },
      { x: (x - 1 + gridCols) % gridCols, y },
      { x: (x - 2 + gridCols) % gridCols, y }
    ];
    const guardian = {
      id, segments, direction: { x: 1, y: 0 }, tickCounter: 0,
      expiresAt: gameTime + 999999,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette, behavior: { id: def.behavior, name: def.name },
      traits: def.traits, ambientParticles: def.ambientParticles,
      lastMoveTick: -1, targetIndicator: null, recentCells: [], icon: def.icon,
      config,
      chargeState: 'idle',
      chargeStateUntil: 0,
      chargeDir: { x: 1, y: 0 },
      hasRoared: false,
      nextPortalAt: gameTime + config.portalTeleportMs,
      portalPhase: 'idle',
      portalPhaseUntil: 0,
      portalEntryPos: null,
      portalExitPos: null,
      portalAlpha: 0,
      vulnerableUntil: 0
    };
    enemyGuardians.push(guardian);
    nextCipactliSpawnAt = gameTime + config.cooldownMs;
    updateGuardianBadge();
    const hx = x * TILE_SIZE + TILE_SIZE / 2;
    const hy = y * TILE_SIZE + TILE_SIZE / 2;
    spawnCipactliPortalParticles(hx, hy, true);
    spawnFloatingText('🐊 ¡CIPACTLI EMERGE!', hx, hy - TILE_SIZE, '#4ec98a');
    playCipactliRoar();
    screenShake = 12;
    announce('¡Cipactli ha aparecido!');
    if (!window.__guardianQuotesShown) window.__guardianQuotesShown = {};
    if (!window.__guardianQuotesShown['cipactli']) {
      window.__guardianQuotesShown['cipactli'] = true;
      setTimeout(() => { showGuardianQuoteToast('🐊', 'Cipactli', GUARDIAN_QUOTES.cipactli); }, 800);
    }
    updateMusicLayer();
    return true;
  }
  return false;
}

function spawnCipactliPortalParticles(x, y, isOpening) {
  const count = isOpening ? (isSlowDevice ? 12 : 24) : 16;
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const sp = 1.5 + Math.random() * 3;
    particles.push({
      x: x + (Math.random() - 0.5) * TILE_SIZE * 0.5,
      y: y + (Math.random() - 0.5) * TILE_SIZE * 0.5,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (isOpening ? 1.5 : 0.5),
      size: 2 + Math.random() * 2.5,
      color: ['#3aa8d4', '#6ecbff', '#b3e5ff', '#1a5e8a'][i % 4],
      alpha: 1,
      decay: 0.025
    });
  }
}

function spawnChaac() {
  if (GAME_MODES[gameModeSelect.value]?.onlyCipactliBoss) return false;
  const difficulty = getEffectiveDifficulty();
  const config = TEZCATLIPOCA_CONFIG[difficulty] || TEZCATLIPOCA_CONFIG.medium;
  if (enemyGuardians.some(g => g.traits.isTezcatlipoca)) return false;
  if (runCipactliDefeated === 0 && getEffectiveDifficulty() !== 'easy') return false;
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
    const segments = [
      { x, y },
      { x: (x - 1 + gridCols) % gridCols, y }
    ];
    const guardian = {
      id, segments, direction: { x: 1, y: 0 }, tickCounter: 0,
      expiresAt: gameTime + 999999,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette, behavior: { id: def.behavior, name: def.name },
      traits: def.traits, ambientParticles: def.ambientParticles,
      nextTeleportAt: gameTime + config.teleportMs, teleportFlash: 0, teleportDest: null,
      smokeParticles: [], lastMoveTick: -1, targetIndicator: null, recentCells: [], icon: def.icon,
      vulnerableUntil: 0, config: config
    };
    enemyGuardians.push(guardian);
    nextChaacSpawnAt = gameTime + config.cooldownMs;
    updateGuardianBadge();
    const hx = x * TILE_SIZE + TILE_SIZE / 2;
    const hy = y * TILE_SIZE + TILE_SIZE / 2;
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 3;
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, size: 2 + Math.random() * 2, color: ['#d98e2b', '#f2e2b8', '#14110f'][i % 3], alpha: 1, decay: 0.022 });
    }
    spawnFloatingText('👁️ ¡TEZCATLIPOCA DESCIENDE!', hx, hy - TILE_SIZE, '#d98e2b');
    screenShake = 8;
    announce('¡Tezcatlipoca ha descendido!');
    if (!window.__guardianQuotesShown) window.__guardianQuotesShown = {};
    if (!window.__guardianQuotesShown['ambusher']) {
      window.__guardianQuotesShown['ambusher'] = true;
      setTimeout(() => { showGuardianQuoteToast('🐆', 'Tezcatlipoca', GUARDIAN_QUOTES.ambusher); }, 800);
    }
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
  if (!threatBadge) return;
  const count = enemyGuardians.length;
  if (count === 0) { BadgeManager.setVisible('threat', false); return; }
  const hasTezcatlipoca = enemyGuardians.some(g => g.traits.isTezcatlipoca);
  const hasCipactli = enemyGuardians.some(g => g.traits.isCipactli);
  const names = [...new Set(enemyGuardians.map(g => g.behavior.name))];
  let desktopText, mobileText;
  if (hasTezcatlipoca) { desktopText = '👁️ ¡TEZCATLIPOCA al acecho!'; mobileText = '¡Tezcatlipoca!'; }
  else if (hasCipactli) { desktopText = '🐊 ¡CIPACTLI devora las aguas!'; mobileText = '¡Cipactli!'; }
  else if (count === 1) { desktopText = `${names[0]} al acecho`; mobileText = names[0]; }
  else { desktopText = `${count} guardianes: ${names.join(' · ')}`; mobileText = `${count} guardianes`; }
  const desktopSpan = threatBadge.querySelector('.badge-text-desktop');
  const mobileSpan = threatBadge.querySelector('.badge-text-mobile');
  if (desktopSpan) desktopSpan.textContent = desktopText;
  if (mobileSpan) mobileSpan.textContent = mobileText;
  const dot = document.getElementById('threat-dot');
  if (dot) {
    const first = enemyGuardians[0];
    const color = hasTezcatlipoca ? '#d98e2b' : hasCipactli ? '#4ec98a' : first.palette.head;
    dot.style.background = color;
    dot.style.boxShadow = `0 0 8px ${color}`;
    dot.style.color = color;
  }
  const firstPalette = enemyGuardians[0].palette;
  threatBadge.style.background = `linear-gradient(135deg, ${firstPalette.body}cc, ${firstPalette.head}aa)`;
  threatBadge.style.borderColor = firstPalette.head;
  BadgeManager.setVisible('threat', true);
}

function updateGuardianAmbientParticles() {
  if (isPaused || cosmicOrderResolveAt !== null) return;
  if (reduceMotion) return;
  if (isSlowDevice) return;
  enemyGuardians.forEach(guardian => {
    if (!guardian.ambientParticles) return;
    if (guardiansFrozenUntil > gameTime) return;
    const { color, rate, size } = guardian.ambientParticles;
    if (Math.random() > rate * 0.1) return;
    const head = guardian.segments[0];
    const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
    const a = Math.random() * Math.PI * 2;
    const dist = TILE_SIZE * (0.3 + Math.random() * 0.5);
    particles.push({ x: hx + Math.cos(a) * dist, y: hy + Math.sin(a) * dist, vx: Math.cos(a) * 0.3, vy: Math.sin(a) * 0.3 - 0.4, size: size * (0.7 + Math.random() * 0.6), color: color, alpha: 0.7, decay: 0.025 });
  });
}

function getGuardianTarget(g, playerHead, difficulty) {
  const profile = getDifficultyProfile();
  if (g.behavior.id === 'interceptor') {
    const lead = profile.guardianLead;
    return { x: (playerHead.x + direction.x * lead + gridCols) % gridCols, y: (playerHead.y + direction.y * lead + gridRows) % gridRows };
  }
  if (g.behavior.id === 'flanker') {
    const orbit = Math.floor(g.tickCounter / profile.flankerOrbitSpeed + g.id) % 4;
    const offsets = [{ x: 0, y: -5 }, { x: 5, y: 0 }, { x: 0, y: 5 }, { x: -5, y: 0 }];
    const o = offsets[orbit];
    return { x: (playerHead.x + o.x + gridCols) % gridCols, y: (playerHead.y + o.y + gridRows) % gridRows };
  }
  return playerHead;
}

function reconcileGuardianCount() {
  const profile = getDifficultyProfile();
  const target = profile.guardianTargets;
  let normalCount = enemyGuardians.filter(g => !g.traits.isBoss).length;
  if (normalCount > target) {
    for (let i = enemyGuardians.length - 1; i >= 0 && normalCount > target; i--) {
      if (enemyGuardians[i] && !enemyGuardians[i].traits.isBoss) { enemyGuardians.splice(i, 1); normalCount--; }
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
  previousGuardianPositions.delete(id);

  if (!g.traits.isBoss) {
    const i = usedGuardianPalettes.indexOf(g.behavior.name);
    if (i !== -1) usedGuardianPalettes.splice(i, 1);
  }

  if (g.smokeParticles) g.smokeParticles = [];
  if (spawnBonus) {
    g.segments.forEach(s => { bonusFoods.push({ x: s.x, y: s.y, expiresAt: gameTime + 12000 }); });
    if (g.traits.isTezcatlipoca) {
      const head = g.segments[0];
      bonusFoods.push({ x: head.x, y: head.y, expiresAt: gameTime + 15000, isBossDrop: true });
      progression.totalTezcatlipocaDefeated++;
      runTezcatlipocaDefeated++;
      saveProgression();
      checkAchievements();
      for (let p = 0; p < 8; p++) {
        const a = (Math.PI * 2 * p) / 8;
        const sp = 1.5 + Math.random() * 2;
        particles.push({ x: head.x * TILE_SIZE + TILE_SIZE / 2, y: head.y * TILE_SIZE + TILE_SIZE / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2 + Math.random() * 1.5, color: ['#d98e2b', '#f2e2b8', '#14110f'][p % 3], alpha: 1, decay: 0.06 });
      }
      const diff = getEffectiveDifficulty();
      const config = TEZCATLIPOCA_CONFIG[diff] || TEZCATLIPOCA_CONFIG.medium;
      nextChaacSpawnAt = gameTime + config.cooldownMs;
    } else if (g.traits.isCipactli) {
      const head = g.segments[0];
      bonusFoods.push({ x: head.x, y: head.y, expiresAt: gameTime + 15000, isBossDrop: true });
      progression.totalCipactliDefeated = (progression.totalCipactliDefeated || 0) + 1;
      runCipactliDefeated++;
      saveProgression();
      checkAchievements();
      for (let p = 0; p < 12; p++) {
        const a = (Math.PI * 2 * p) / 12;
        const sp = 1.5 + Math.random() * 2.5;
        particles.push({ x: head.x * TILE_SIZE + TILE_SIZE / 2, y: head.y * TILE_SIZE + TILE_SIZE / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2 + Math.random() * 2, color: ['#4ec98a', '#a8ffd0', '#0e3324'][p % 3], alpha: 1, decay: 0.05 });
      }
      const config = CIPACTLI_CONFIG[getEffectiveDifficulty()] || CIPACTLI_CONFIG.medium;
      nextCipactliSpawnAt = gameTime + config.cooldownMs;

      if (runMode === 'flood') {
        floodKills++;
        const removed = clearFloodCells(FLOOD_KILL_CLEAR_CELLS);
        if (removed > 0) {
          const headForText = g.segments[0] || { x: 0, y: 0 };
          spawnFloatingText(`💧 -${removed} charcos`, headForText.x * TILE_SIZE + TILE_SIZE / 2, headForText.y * TILE_SIZE - 20, '#7de8c4');
        }
        const headForText = g.segments[0] || { x: 0, y: 0 };
        spawnFloatingText(`¡Cipactli ${floodKills}/${GAME_MODES.flood.floodKillGoal} vencido!`, headForText.x * TILE_SIZE + TILE_SIZE / 2, headForText.y * TILE_SIZE, '#4ec98a');
        announce(`Cipactli vencido ${floodKills} de 3`);

        if (floodKills >= (GAME_MODES.flood.floodKillGoal || 3) && !floodVictoryShown) {
          floodVictoryShown = true;
          score += 500;
          updateScoresUI();
          isGameRunning = false;
          stopGameLoop();
          setTimeout(() => {
            gameOver(`🌊 ¡Victoria! Has vencido a Cipactli ${floodKills} veces y salvado la tierra del diluvio.`, '🏆');
          }, 1500);
        }
      }
    }
  }
  updateGuardianBadge();
  scheduleEnemySpawn();
}

let _floodFillVisited = null;
let _floodFillQueueX = null;
let _floodFillQueueY = null;
let _floodFillStride = 0;
function floodFillCount(startX, startY, maxCells, occupiedByGuardians) {
  const total = gridCols * gridRows;
  if (!_floodFillVisited || _floodFillStride !== gridCols) {
    _floodFillVisited = new Uint8Array(gridCols * gridRows);
    _floodFillQueueX = new Int16Array(total);
    _floodFillQueueY = new Int16Array(total);
    _floodFillStride = gridCols;
  } else {
    _floodFillVisited.fill(0);
  }
  const visited = _floodFillVisited;
  const qx = _floodFillQueueX;
  const qy = _floodFillQueueY;
  let head = 0;
  let tail = 0;
  qx[tail] = startX; qy[tail] = startY; tail++;
  visited[startY * gridCols + startX] = 1;
  let count = 0;
  while (head < tail && count < maxCells) {
    const x = qx[head], y = qy[head];
    head++;
    count++;
    const neighbors = [
      [(x + 1) % gridCols, y],
      [(x - 1 + gridCols) % gridCols, y],
      [x, (y + 1) % gridRows],
      [x, (y - 1 + gridRows) % gridRows]
    ];
    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0], ny = neighbors[i][1];
      const key = ny * gridCols + nx;
      if (visited[key]) continue;
      if (occupiedByGuardians[`${nx},${ny}`]) continue;
      let inSnake = false;
      for (let s = 0; s < snake.length; s++) {
        if (snake[s].x === nx && snake[s].y === ny) { inSnake = true; break; }
      }
      if (inSnake) continue;
      visited[key] = 1;
      qx[tail] = nx; qy[tail] = ny; tail++;
    }
  }
  return count;
}

function updateCipactliAI(g, playerHead) {
  const config = g.config;
  const isFleeing = hasGuardianProtection() || isFuria;
  // Si está vulnerable, no perseguir (queda quieto esperando)
  if (GAME_MODES[gameModeSelect.value]?.hasFloodWaves && g.vulnerableUntil && gameTime < g.vulnerableUntil) {
    g.chargeState = 'idle';
    g.chargeStateUntil = 0;
    return;
  }

  if (g.portalPhase !== 'idle') {
    if (gameTime < g.portalPhaseUntil) {
      if (g.portalPhase === 'opening') {
        const t = 1 - (g.portalPhaseUntil - gameTime) / CIPACTLI_PORTAL_FADE_MS;
        g.portalAlpha = t * 0.6;
      } else if (g.portalPhase === 'entering') {
        const t = 1 - (g.portalPhaseUntil - gameTime) / CIPACTLI_PORTAL_FADE_MS;
        g.portalAlpha = 0.6 + t * 0.4;
      } else if (g.portalPhase === 'exiting') {
        const t = 1 - (g.portalPhaseUntil - gameTime) / CIPACTLI_PORTAL_FADE_MS;
        g.portalAlpha = 1 - t;
      } else if (g.portalPhase === 'closing') {
        const t = 1 - (g.portalPhaseUntil - gameTime) / CIPACTLI_PORTAL_FADE_MS;
        g.portalAlpha = 0.6 * (1 - t);
      }
      return;
    }
    if (g.portalPhase === 'opening') {
      g.portalPhase = 'entering';
      g.portalPhaseUntil = gameTime + CIPACTLI_PORTAL_FADE_MS;
      return;
    }
    if (g.portalPhase === 'entering') {
      g.portalAlpha = 1;
      const exit = g.portalExitPos;
      if (exit) {
        const len = g.segments.length;
        g.segments = Array.from({ length: len }, (_, i) => ({
          x: (exit.x - i + gridCols) % gridCols,
          y: exit.y
        }));
        const ex = exit.x * TILE_SIZE + TILE_SIZE / 2;
        const ey = exit.y * TILE_SIZE + TILE_SIZE / 2;
        spawnCipactliPortalParticles(ex, ey, true);
        screenShake = reduceMotion ? 0 : 8;
      }
      g.portalPhase = 'exiting';
      g.portalPhaseUntil = gameTime + CIPACTLI_PORTAL_FADE_MS;
      return;
    }
    if (g.portalPhase === 'exiting') {
      g.portalAlpha = 0;
      g.portalPhase = 'closing';
      g.portalPhaseUntil = gameTime + CIPACTLI_PORTAL_FADE_MS * 0.6;
      return;
    }
    if (g.portalPhase === 'closing') {
      g.portalPhase = 'idle';
      g.portalAlpha = 0;
      g.portalPhaseUntil = 0;
      g.portalEntryPos = null;
      g.portalExitPos = null;
      g.nextPortalAt = gameTime + config.portalTeleportMs;
      return;
    }
    return;
  }

  if (gameTime >= g.nextPortalAt && g.chargeState === 'idle') {
    const exit = findCipactliExitPosition();
    if (exit) {
      g.portalPhase = 'opening';
      g.portalPhaseUntil = gameTime + CIPACTLI_PORTAL_FADE_MS;
      g.portalEntryPos = { x: g.segments[0].x, y: g.segments[0].y };
      g.portalExitPos = exit;
      const ex = g.segments[0].x * TILE_SIZE + TILE_SIZE / 2;
      const ey = g.segments[0].y * TILE_SIZE + TILE_SIZE / 2;
      spawnCipactliPortalParticles(ex, ey, true);
      playCosmicOrderSound();
      screenShake = reduceMotion ? 0 : 5;
      spawnFloatingText('🌀 Portal de agua', ex, ey - TILE_SIZE, '#6ecbff');
    } else {
      g.nextPortalAt = gameTime + 3000;
    }
    return;
  }

  if (g.chargeState === 'charging') {
    if (gameTime >= g.chargeStateUntil) {
      g.chargeState = 'idle';
      g.chargeStateUntil = 0;
      if (GAME_MODES[gameModeSelect.value]?.hasFloodWaves && !g.traits.isTezcatlipoca) {
        g.vulnerableUntil = gameTime + CIPACTLI_FLOOD_VULNERABLE_MS;
        BadgeManager.setVisible('cipactliVulnerable', true);
        if (cipactliVulnerableTimerSpan) {
          cipactliVulnerableTimerSpan.textContent = Math.ceil(CIPACTLI_FLOOD_VULNERABLE_MS / 1000);
        }
        spawnFloatingText('🐊 ¡Cipactli vulnerable!', g.segments[0].x * TILE_SIZE + TILE_SIZE / 2, g.segments[0].y * TILE_SIZE - 20, '#ffb347');
        playCipactliRoar();
      }
    } else {
      const head = g.segments[0];
      const nx = (head.x + g.chargeDir.x + gridCols) % gridCols;
      const ny = (head.y + g.chargeDir.y + gridRows) % gridRows;
      const occupied = enemyGuardians.some(other => other.id !== g.id && other.segments.some(s => s.x === nx && s.y === ny));
      if (!occupied) {
        g.segments.unshift({ x: nx, y: ny });
        if (g.segments.length > 3) g.segments.pop();
      }
      if (g.segments.some(s => s.x === snake[0].x && s.y === snake[0].y)) {
        if (GAME_MODES[gameModeSelect.value]?.hasFloodWaves) {
          const vulnerable = g.vulnerableUntil && gameTime < g.vulnerableUntil;
          if (!vulnerable) {
            if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isFuria) {
              // ignorar
            } else {
              screenShake = reduceMotion ? 0 : 12;
              loseLife('¡Cipactli te devoró con sus fauces primordiales!', g.segments[0].x, g.segments[0].y);
              return;
            }
          }
        }
        if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isFuria) {
          const furia = isFuria, shield = isImmune, frozen = guardiansFrozenUntil > gameTime;
          const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec98a';
          const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🐊';
          screenShake = reduceMotion ? 0 : 12;
          playEnemyDefeatedSound();
          vibrate([40, 30, 40, 30, 60]);
          runGuardiansDefeated++;
          score += config.reward;
          spawnFloatingText(`+${config.reward} ${symbol} ¡CIPACTLI VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
          updateScoresUI();
          destroyEnemySnake(g.id);
        } else {
          screenShake = reduceMotion ? 0 : 12;
          loseLife('¡Cipactli te devoró con sus fauces primordiales!', g.segments[0].x, g.segments[0].y);
        }
        return 'removed';
      }
    }
    return;
  }

  if (g.chargeState === 'telegraph') {
    if (gameTime >= g.chargeStateUntil) {
      g.chargeState = 'charging';
      g.chargeStateUntil = gameTime + 320;
    }
    return;
  }

  if (g.chargeState === 'idle') {
    const head = g.segments[0];
    let dx = playerHead.x - head.x;
    let dy = playerHead.y - head.y;
    if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
    if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
    const dist = Math.abs(dx) + Math.abs(dy);
    if (isFleeing) {
      const nd = Math.abs(dx) >= Math.abs(dy) ? { x: -Math.sign(dx), y: 0 } : { x: 0, y: -Math.sign(dy) };
      g.direction = nd;
    } else {
      const nd = Math.abs(dx) >= Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
      g.direction = nd;
      if (dist <= 6 && (Math.abs(dx) <= 1 || Math.abs(dy) <= 1) && Math.random() < 0.4) {
        g.chargeState = 'telegraph';
        g.chargeStateUntil = gameTime + config.telegraphMs;
        g.chargeDir = nd;
        playCipactliRoar();
        spawnFloatingText('🐊 ¡MORDIDA!', head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE - 4, '#ffb347');
        return;
      }
    }
    if (g.tickCounter % 3 === 0) {
      const nx = (head.x + g.direction.x + gridCols) % gridCols;
      const ny = (head.y + g.direction.y + gridRows) % gridRows;
      const occupied = enemyGuardians.some(other => other.id !== g.id && other.segments.some(s => s.x === nx && s.y === ny));
      if (!occupied) {
        g.segments.unshift({ x: nx, y: ny });
        g.segments.pop();
      }
      if (g.segments.some(s => s.x === snake[0].x && s.y === snake[0].y)) {
        if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isFuria) {
          const color = isFuria ? '#ff6b2c' : isImmune ? '#facc15' : '#4ec98a';
          const symbol = isFuria ? '🔥' : isImmune ? '💎' : '🐊';
          screenShake = reduceMotion ? 0 : 12;
          playEnemyDefeatedSound();
          runGuardiansDefeated++;
          score += config.reward;
          spawnFloatingText(`+${config.reward} ${symbol} ¡CIPACTLI VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
          updateScoresUI();
          destroyEnemySnake(g.id);
        } else {
          screenShake = reduceMotion ? 0 : 12;
          loseLife('¡Cipactli te devoró con sus fauces primordiales!', g.segments[0].x, g.segments[0].y);
        }
      }
    }
  }
}

function findCipactliExitPosition() {
  const safeMarginX = Math.max(4, Math.ceil(56 / TILE_SIZE));
  const safeMarginY = Math.max(4, Math.ceil(88 / TILE_SIZE));
  const minX = safeMarginX + 3;
  const maxX = gridCols - safeMarginX - 1;
  const minY = safeMarginY;
  const maxY = gridRows - safeMarginY - 1;
  const head = snake[0];
  for (let attempt = 0; attempt < 60; attempt++) {
    if (minX > maxX || minY > maxY) return null;
    const x = minX + Math.floor(Math.random() * (maxX - minX + 1));
    const y = minY + Math.floor(Math.random() * (maxY - minY + 1));
    const dx = Math.min(Math.abs(x - head.x), gridCols - Math.abs(x - head.x));
    const dy = Math.min(Math.abs(y - head.y), gridRows - Math.abs(y - head.y));
    if (dx + dy < 8) continue;
    if (dx + dy > 14) continue;
    if (isGuardianCellOccupied(x, y)) continue;
    return { x, y };
  }
  return null;
}

function updateEnemySnakeAI() {
  if (enemyGuardians.length === 0 || guardiansFrozenUntil > gameTime || cosmicOrderResolveAt !== null) return;
  const profile = getDifficultyProfile();
  const moveInterval = profile.guardianMoveInterval;
  const playerHead = snake[0];
  const isFleeing = hasGuardianProtection() || isFuria;
  const occupiedByGuardians = {};
  enemyGuardians.forEach(g => { g.segments.forEach(s => { occupiedByGuardians[`${s.x},${s.y}`] = true; }); });
  
  const snapshot = enemyGuardians.slice();
  for (let gi = 0; gi < snapshot.length; gi++) {
    const g = snapshot[gi];
    if (!g || g.destroyed) continue;
    if (!enemyGuardians.includes(g)) continue;
    g.tickCounter++;
    if (g.traits.isCipactli) {
      const res = updateCipactliAI(g, playerHead);
      if (res === 'removed' || !enemyGuardians.find(x => x.id === g.id)) continue;
      continue;
    }
    if (g.behavior.id === 'ambusher') {
      const isVulnerable = gameTime < g.vulnerableUntil;
      const config = g.config || TEZCATLIPOCA_CONFIG.medium;
      if (!isVulnerable && gameTime >= g.nextTeleportAt) {
        const total = gridCols * gridRows;
        const start = Math.floor(Math.random() * total);
        for (let o = 0; o < total; o++) {
          const c = (start + o) % total;
          const tx = c % gridCols;
          const ty = Math.floor(c / gridCols);
          const dx = Math.min(Math.abs(tx - playerHead.x), gridCols - Math.abs(tx - playerHead.x));
          const dy = Math.min(Math.abs(ty - playerHead.y), gridRows - Math.abs(ty - playerHead.y));
          const dist = dx + dy;
          if (dist >= 4 && dist <= 7 && !isGuardianCellOccupied(tx, ty)) {
            const oldHead = g.segments[0];
            g.smokeParticles.push({ x: oldHead.x, y: oldHead.y, bornAt: gameTime });
            g.segments[0] = { x: tx, y: ty };
            g.teleportFlash = 1;
            g.teleportDest = { x: tx, y: ty };
            g.vulnerableUntil = gameTime + config.vulnerableMs;
            g.nextTeleportAt = gameTime + config.teleportMs;
            for (let p = 0; p < 12; p++) {
              const a = Math.random() * Math.PI * 2;
              particles.push({ x: tx * TILE_SIZE + TILE_SIZE / 2, y: ty * TILE_SIZE + TILE_SIZE / 2, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, size: 2 + Math.random() * 2, color: '#14110f', alpha: 0.9, decay: 0.04 });
            }
            break;
          }
        }
      }
      if (g.teleportFlash > 0) g.teleportFlash = Math.max(0, g.teleportFlash - 0.05);
      if (g.smokeParticles) g.smokeParticles = g.smokeParticles.filter(sp => gameTime - sp.bornAt < 800);

      const playerHasPower = hasGuardianProtection() || isFuria || guardiansFrozenUntil > gameTime;
      const headA = g.segments[0];
      const touchesNow = snake.some(s => Math.abs(s.x - headA.x) <= 1 && Math.abs(s.y - headA.y) <= 1);

      if (touchesNow) {
        if (playerHasPower) {
          const frozen = guardiansFrozenUntil > gameTime;
          const shield = isImmune;
          const furia = isFuria;
          const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
          const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
          const reward = furia ? FURIA_GUARDIAN_REWARD : (profile.bossReward || config.reward);
          screenShake = reduceMotion ? 0 : 12;
          playEnemyDefeatedSound();
          vibrate([40, 30, 40, 30, 60]);
          runGuardiansDefeated++;
          score += reward * dailyState.guardianMultiplier;
          spawnFloatingText(`+${reward * dailyState.guardianMultiplier} ${symbol} ¡TEZCATLIPOCA VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
          updateScoresUI();
          destroyEnemySnake(g.id);
          continue;
        } else if (isVulnerable) {
          screenShake = reduceMotion ? 0 : 12;
          loseLife('¡Tezcatlipoca, el jaguar de obsidiana, te devoró!', headA.x, headA.y);
          return;
        }
      }
      if (isVulnerable) continue;
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
      const dir = cands.find(c => !((c.x !== 0 && c.x === -g.direction.x) || (c.y !== 0 && c.y === -g.direction.y))) || g.direction;
      g.direction = dir;
      const newHead = { x: (enemyHead.x + dir.x + gridCols) % gridCols, y: (enemyHead.y + dir.y + gridRows) % gridRows };
      const touches = snake.some(s => Math.abs(s.x - newHead.x) <= 1 && Math.abs(s.y - newHead.y) <= 1);
      if (touches) {
        if (hasGuardianProtection() || isFuria || guardiansFrozenUntil > gameTime) {
          const frozen = guardiansFrozenUntil > gameTime;
          const shield = isImmune;
          const furia = isFuria;
          const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
          const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
          const reward = furia ? FURIA_GUARDIAN_REWARD : (profile.bossReward || config.reward);
          screenShake = reduceMotion ? 0 : 12;
          playEnemyDefeatedSound();
          vibrate([40, 30, 40, 30, 60]);
          runGuardiansDefeated++;
          score += reward * dailyState.guardianMultiplier;
          spawnFloatingText(`+${reward * dailyState.guardianMultiplier} ${symbol} ¡TEZCATLIPOCA VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
          updateScoresUI();
          destroyEnemySnake(g.id);
          continue;
        } else {
          screenShake = reduceMotion ? 0 : 12;
          loseLife('¡Tezcatlipoca, el jaguar de obsidiana, te devoró!', newHead.x, newHead.y);
          return;
        }
      }
      g.segments.unshift(newHead);
      g.segments.pop();
      continue;
    }
    let interval = moveInterval + (g.behavior.id === 'interceptor' ? 1 : 0);
    interval = Math.max(1, Math.round(interval / dailyState.guardianSpeedMultiplier));
    if ((g.tickCounter + g.id) % interval !== 0) continue;
    g.lastMoveTick = g.tickCounter;
    const enemyHead = g.segments[0];
    const possibleDirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
    let bestDir = null;
    let bestScore = -Infinity;
    const candidates = [];
    for (const dir of possibleDirs) {
      if ((dir.x !== 0 && dir.x === -g.direction.x) || (dir.y !== 0 && dir.y === -g.direction.y)) continue;
      const newX = (enemyHead.x + dir.x + gridCols) % gridCols;
      const newY = (enemyHead.y + dir.y + gridRows) % gridRows;
      const key = `${newX},${newY}`;
      if (occupiedByGuardians[key]) {
        const isSelf = g.segments.some(s => s.x === newX && s.y === newY);
        if (!isSelf) continue;
      }
      candidates.push({ dir, newX, newY, key });
    }
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
    for (const cand of candidates) {
      const { dir, newX, newY } = cand;
      let sc = 0;
      const target = getGuardianTarget(g, playerHead, null);
      let dx = target.x - newX;
      let dy = target.y - newY;
      if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
      if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
      const dist = Math.abs(dx) + Math.abs(dy);
      sc -= dist * 10;
      const freeSpace = isSlowDevice ? 4 : floodFillCount(newX, newY, 8, occupiedByGuardians);
      sc += freeSpace * 1.5;
      if (g.recentCells.includes(cand.key)) sc -= 50;
      const difficulty = getEffectiveDifficulty();
      let errorChance = 0;
      if (difficulty === 'easy') errorChance = 0.35;
      else if (difficulty === 'medium') errorChance = 0.2;
      else if (difficulty === 'hard') errorChance = 0.1;
      else if (difficulty === 'extreme') errorChance = 0.05;
      if (Math.random() < errorChance) sc += (Math.random() - 0.5) * 200;
      if (sc > bestScore) { bestScore = sc; bestDir = dir; }
    }
    if (!bestDir) bestDir = g.direction;
    g.direction = bestDir;
    const newHead = { x: (enemyHead.x + bestDir.x + gridCols) % gridCols, y: (enemyHead.y + bestDir.y + gridRows) % gridRows };
    g.recentCells.push(`${newHead.x},${newHead.y}`);
    if (g.recentCells.length > 5) g.recentCells.shift();
    delete occupiedByGuardians[`${enemyHead.x},${enemyHead.y}`];
    occupiedByGuardians[`${newHead.x},${newHead.y}`] = true;
    const headDist = Math.min(Math.abs(newHead.x - playerHead.x), gridCols - Math.abs(newHead.x - playerHead.x)) +
                     Math.min(Math.abs(newHead.y - playerHead.y), gridRows - Math.abs(newHead.y - playerHead.y));
    g.targetIndicator = (headDist < 8 && headDist > 2) ? { x: playerHead.x, y: playerHead.y } : null;
    if (GAME_MODES[gameModeSelect.value]?.hasHuntTrail) {
      huntTrail.push({ x: enemyHead.x, y: enemyHead.y, expiresAt: gameTime + HUNT_TRAIL_LIFETIME_MS, ownerId: g.id });
    }
    const touches = snake.some(s => s.x === newHead.x && s.y === newHead.y);
    if (touches) {
      if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isOnFire) {
        const shield = isImmune;
        const frozen = guardiansFrozenUntil > gameTime;
        const furia = isFuria;
        const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
        const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
        const reward = furia ? FURIA_GUARDIAN_REWARD : profile.guardianReward;
        screenShake = reduceMotion ? 0 : 10;
        playEnemyDefeatedSound();
        vibrate(35);
        runGuardiansDefeated++;
        score += reward * dailyState.guardianMultiplier;
        spawnFloatingText(`+${reward * dailyState.guardianMultiplier} ${symbol} ¡GUARDIÁN VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
        updateScoresUI();
        destroyEnemySnake(g.id);
        continue;
      }
      loseLife(`¡El ${g.behavior.name} te alcanzó!`, newHead.x, newHead.y);
      return;
    }
    g.segments.unshift(newHead);
    g.segments.pop();
  }
}

// ========================================================
// 17. SPAWN HELPERS
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
  for (let y = 0; y < gridRows; y++) for (let x = 0; x < gridCols; x++) if (!isGuardianCellOccupied(x, y)) available.push({ x, y });
  const different = available.filter(p => !lastSkullPosition || p.x !== lastSkullPosition.x || p.y !== lastSkullPosition.y);
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
  if (dailyState.noJade) return;
  const profile = getDifficultyProfile();
  let target = profile.guardianTargets;
  if (dailyState.jadeTarget > 0) target = dailyState.jadeTarget;
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
    if (dx + dy <= 8 && !isGuardianCellOccupied(x, y)) { freezeFoods.push({ x, y }); return true; }
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
function maybeSpawnAirFood() {
  if (!GAME_MODES[gameModeSelect.value].itemsEnabled) return false;
  if (airFoods.length > 0) return true;
  const head = snake[0];
  for (let i = 0; i < 160; i++) {
    const x = (head.x + Math.floor(Math.random() * 17) - 8 + gridCols) % gridCols;
    const y = (head.y + Math.floor(Math.random() * 17) - 8 + gridRows) % gridRows;
    const dx = Math.min(Math.abs(x - head.x), gridCols - Math.abs(x - head.x));
    const dy = Math.min(Math.abs(y - head.y), gridRows - Math.abs(y - head.y));
    if (dx + dy <= 8 && !isGuardianCellOccupied(x, y)) { airFoods.push({ x, y }); return true; }
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
  if (cleared === 0) { enemySpawnAt = null; scheduleEnemySpawn(); return; }
  cosmicOrderFlashStartedAt = gameTime;
  const defeated = enemyGuardians.slice();
  runGuardiansDefeated += cleared;
  defeated.forEach(g => {
    g.segments.forEach(s => {
      const x = s.x * TILE_SIZE + TILE_SIZE / 2;
      const y = s.y * TILE_SIZE + TILE_SIZE / 2;
      for (let p = 0; p < 5; p++) {
        const a = (Math.PI * 2 * p) / 5 + Math.random() * 0.3;
        const sp = 1.8 + Math.random() * 2.2;
        particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2.5 + Math.random() * 2, color: Math.random() > 0.5 ? '#d5bd70' : '#8be7ff', alpha: 1, decay: 0.025 + Math.random() * 0.015 });
      }
    });
  });
  enemyGuardians.length = 0;
  previousGuardianPositions.clear();
  particles = particles.filter(p => p.decay > 0.03 || p.alpha > 0.5);
  updateGuardianBadge();
  screenShake = reduceMotion ? 0 : 10;
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
  announce(`Orden cósmico, más ${reward} puntos`);
}

// ========================================================
// 18. TIMERS
// ========================================================
function updateGameTimers(elapsedMs) {
  gameTime += elapsedMs;
  if (headPulse > 0) headPulse = Math.max(0, headPulse - elapsedMs / 240);
  updateMusicLayer();
  if (BadgeManager && cipactliVulnerableBadge) {
    const anyVulnerable = enemyGuardians.some(g => g.vulnerableUntil && gameTime < g.vulnerableUntil);
    if (!anyVulnerable && !cipactliVulnerableBadge.classList.contains('hidden')) {
      BadgeManager.setVisible('cipactliVulnerable', false);
    } else if (anyVulnerable && cipactliVulnerableTimerSpan) {
      const maxVuln = Math.max(...enemyGuardians.filter(g => g.vulnerableUntil && gameTime < g.vulnerableUntil).map(g => g.vulnerableUntil - gameTime));
      cipactliVulnerableTimerSpan.textContent = Math.ceil(maxVuln / 1000);
    }
  }
  if (guardiansFrozenUntil > 0) {
    if (gameTime >= guardiansFrozenUntil) {
      enemyGuardians.forEach(g => { g.frozenAt = null; });
      guardiansFrozenUntil = 0;
      BadgeManager.setVisible('freeze', false);
    } else if (freezeTimerSpan) {
      freezeTimerSpan.textContent = String(Math.ceil((guardiansFrozenUntil - gameTime) / 1000));
    }
  }
  if (isImmune) {
    const sec = Math.max(0, Math.ceil((immunityExpiresAt - gameTime) / 1000));
    if (immunityTimerSpan) immunityTimerSpan.textContent = sec;
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
  if (!isFuria && furiaCooldownUntil > 0 && gameTime >= furiaCooldownUntil && getFuriaCooldownRemaining() <= 0) {
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
    } else if (respawnTimerSpan) {
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
  const cipConfig = CIPACTLI_CONFIG[effectiveDiff] || CIPACTLI_CONFIG.medium;
  const tezConfig = TEZCATLIPOCA_CONFIG[effectiveDiff] || TEZCATLIPOCA_CONFIG.medium;
  const isFloodMode = GAME_MODES[gameModeSelect.value]?.hasFloodWaves === true;
  if (!isFloodMode) {
    const canSpawnCipactli = getEffectiveDifficulty() !== 'easy';
    const cipactliAlive = enemyGuardians.some(g => g.traits.isCipactli);
    const tezcatAlive = enemyGuardians.some(g => g.traits.isTezcatlipoca);
    if (canSpawnCipactli && !cipactliAlive && !tezcatAlive && gameTime >= cipConfig.unlockMs) {
      if (!nextCipactliSpawnAt || gameTime >= nextCipactliSpawnAt) {
        const ok = spawnCipactli();
        if (!ok) nextCipactliSpawnAt = gameTime + CHAAC_RETRY_MS;
      }
    }
    if (!GAME_MODES[gameModeSelect.value]?.onlyCipactliBoss) {
      const cipactliAlive2 = enemyGuardians.some(g => g.traits.isCipactli);
      const tezcatAlive2 = enemyGuardians.some(g => g.traits.isTezcatlipoca);
      if (runCipactliDefeated > 0 && !cipactliAlive2 && !tezcatAlive2 && gameTime >= tezConfig.unlockMs) {
        if (!nextChaacSpawnAt || gameTime >= nextChaacSpawnAt) {
          const ok = spawnChaac();
          if (!ok) nextChaacSpawnAt = gameTime + CHAAC_RETRY_MS;
        }
      }
    }
  }
  const bossActive = enemyGuardians.find(g => g.traits.isBoss);
  if (bossActive && Math.random() < 0.35 && !reduceMotion && !isSlowDevice) {
    const head = bossActive.segments[0];
    particles.push({
      x: head.x * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      y: head.y * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      vx: (Math.random() - 0.5) * 0.4, vy: -0.5 - Math.random() * 0.5,
      size: 1.5 + Math.random() * 1.5,
      color: bossActive.traits.isCipactli ? (Math.random() > 0.5 ? '#4ec98a' : '#0e3324') : (Math.random() > 0.5 ? '#d98e2b' : '#14110f'),
      alpha: 0.8, decay: 0.03
    });
  }
  updateGuardianAmbientParticles();
  if (jadeSpawnAt !== null && gameTime >= jadeSpawnAt) { jadeSpawnAt = null; maybeSpawnShieldFood(); }
  if (freezeSpawnAt !== null && gameTime >= freezeSpawnAt) {
    freezeSpawnAt = null;
    if (enemyGuardians.length === 0 || !maybeSpawnFreezeFood()) freezeSpawnAt = gameTime + 1500;
  }
  if (nextSacredRainAt !== null && gameTime >= nextSacredRainAt) {
    sacredRainUntil = gameTime + SACRED_RAIN_DURATION_MS;
    nextSacredRainAt = gameTime + profile.rainIntervalMs;
    if (!ensureMaizeOffering()) maizeSpawnRetryAt = gameTime + 500;
    if (rainTimerSpan) rainTimerSpan.textContent = String(Math.ceil(SACRED_RAIN_DURATION_MS / 1000));
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
    } else if (rainTimerSpan) {
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
    if (spawnSkullFood()) { nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS; nextSkullMoveAt = gameTime + SKULL_MOVE_INTERVAL_MS; }
    else nextSkullSpawnAt = gameTime + 1000;
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
    else if (cosmicOrderTimerSpan) cosmicOrderTimerSpan.textContent = String(Math.ceil((cosmicOrderResolveAt - gameTime) / 1000));
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
  const normalCount = enemyGuardians.filter(g => !g.traits.isBoss).length;
  if (isGameRunning && !isPaused && countdownEndsAt === null &&
      cosmicOrderResolveAt === null && normalCount < target && enemySpawnAt === null) {
    scheduleEnemySpawn();
  }
  if (cosmicOrderFlashStartedAt !== null && gameTime - cosmicOrderFlashStartedAt >= COSMIC_ORDER_FLASH_DURATION_MS) {
    cosmicOrderFlashStartedAt = null;
  }
  if (bonusFoods.length > 0) bonusFoods = bonusFoods.filter(f => !f.expiresAt || f.expiresAt > gameTime);
  if (huntTrail.length > 0) huntTrail = huntTrail.filter(t => t.expiresAt > gameTime);
  if (isImmune && snake.length > 0) {
    jadeTrailAccumulator += elapsedMs;
    if (jadeTrailAccumulator > 55 && particles.length < 100) {
      jadeTrailAccumulator = 0;
      const tail = snake[snake.length - 1];
      spawnJadeTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
    }
  }
  updateModeMechanics(elapsedMs);
}

// ========================================================
// 19. DILUVIO — CHARCOs
// ========================================================
function isFloodCell(x, y) {
  return floodWaterCells.some(c => c.x === x && c.y === y);
}

function removeFloodCellAt(x, y) {
  const idx = floodWaterCells.findIndex(c => c.x === x && c.y === y);
  if (idx === -1) return false;
  floodWaterCells.splice(idx, 1);
  return true;
}

function spawnFloodWave() {
  const head = snake[0];
  const candidates = [];
  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      if (isFloodCell(x, y)) continue;
      if (head && x === head.x && y === head.y) continue;
      if (enemyGuardians.some(g => g.segments.some(s => s.x === x && s.y === y))) continue;
      candidates.push({ x, y });
    }
  }
  if (candidates.length === 0) return 0;
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const count = Math.min(FLOOD_CELLS_PER_WAVE, candidates.length);
  for (let i = 0; i < count; i++) {
    const c = candidates[i];
    floodWaterCells.push({
      x: c.x, y: c.y,
      expiresAt: gameTime + FLOOD_CELL_LIFETIME_MS,
      bornAt: gameTime
    });
    const px = c.x * TILE_SIZE + TILE_SIZE / 2;
    const py = c.y * TILE_SIZE + TILE_SIZE / 2;
    for (let p = 0; p < 4; p++) {
      const a = (Math.PI * 2 * p) / 4 + Math.random() * 0.4;
      particles.push({
        x: px, y: py,
        vx: Math.cos(a) * 1.5, vy: Math.sin(a) * 1.5 - 1,
        size: 1.5 + Math.random() * 1.5,
        color: ['#3aa8d4', '#6ecbff', '#b3e5ff'][p % 3],
        alpha: 0.9, decay: 0.03
      });
    }
  }
  return count;
}

function clearFloodCells(count) {
  const sorted = floodWaterCells.slice().sort((a, b) => a.bornAt - b.bornAt);
  const toRemove = sorted.slice(0, count);
  toRemove.forEach(c => {
    const idx = floodWaterCells.indexOf(c);
    if (idx !== -1) floodWaterCells.splice(idx, 1);
    const px = c.x * TILE_SIZE + TILE_SIZE / 2;
    const py = c.y * TILE_SIZE + TILE_SIZE / 2;
    for (let p = 0; p < 3; p++) {
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x: px, y: py,
        vx: Math.cos(a) * 0.8, vy: Math.sin(a) * 0.8 - 0.5,
        size: 1.2 + Math.random() * 1.2,
        color: ['#7de8c4', '#b3e5ff', '#ffffff'][p % 3],
        alpha: 0.7, decay: 0.04
      });
    }
  });
  return toRemove.length;
}

function updateFloodMode(elapsedMs) {
  const mode = GAME_MODES[gameModeSelect.value];
  if (!mode || !mode.hasFloodWaves) return;

  // Retirar charcos expirados
  for (let i = floodWaterCells.length - 1; i >= 0; i--) {
    const c = floodWaterCells[i];
    if (gameTime >= c.expiresAt) {
      floodWaterCells.splice(i, 1);
      const px = c.x * TILE_SIZE + TILE_SIZE / 2;
      const py = c.y * TILE_SIZE + TILE_SIZE / 2;
      for (let p = 0; p < 3; p++) {
        const a = Math.random() * Math.PI * 2;
        particles.push({
          x: px, y: py,
          vx: Math.cos(a) * 0.8, vy: Math.sin(a) * 0.8 - 0.5,
          size: 1.2 + Math.random() * 1.2,
          color: ['#7de8c4', '#b3e5ff', '#ffffff'][p % 3],
          alpha: 0.7, decay: 0.04
        });
      }
    }
  }

  // Nueva oleada
  if (floodNextWaveAt !== null && gameTime >= floodNextWaveAt && !floodVictoryShown) {
    const added = spawnFloodWave();
    if (added > 0) {
      floodWaterWaves++;
      runFloodWaves = floodWaterWaves;
      floodNextWaveAt = gameTime + FLOOD_WAVE_INTERVAL_MS;
      spawnFloatingText(`🌊 ¡Oleada ${floodWaterWaves}! +${added} charcos`, window.innerWidth / 2, 100, '#6ecbff');
      playCosmicOrderSound();
      vibrate([25, 35, 25]);
      screenShake = reduceMotion ? 0 : 5;
      announce(`Oleada ${floodWaterWaves}: el agua sube`);
    } else {
      floodNextWaveAt = gameTime + 2000;
    }
  }

  // Daño por agua
  const head = snake[0];
  if (head && isFloodCell(head.x, head.y)) {
    if (floodSlowUntil < gameTime) {
      floodSlowUntil = gameTime + 1000;
      spawnFloatingText('🌊 ¡Ralentizado!', head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, '#6ecbff');
    }
    if (!window.__floodDamageCooldown) window.__floodDamageCooldown = 0;
    if (gameTime - window.__floodDamageCooldown > 3500) {
      window.__floodDamageCooldown = gameTime;
      loseLife('🌊 El agua sagrada te arrastra', head.x, head.y);
      return;
    }
  }

  // Derrota por saturación
  const totalCells = gridCols * gridRows;
  const waterRatio = floodWaterCells.length / totalCells;
  if (waterRatio >= FLOOD_MAX_WATER_RATIO && !floodVictoryShown) {
    gameOver('🌊 ¡Las aguas han cubierto la tierra! Cipactli devora el mundo.', '🌊');
    return;
  }

  // Badge
  BadgeManager.setVisible('flood', true);
  const maxSimul = Math.floor(totalCells * FLOOD_MAX_WATER_RATIO);
  const nextWaveIn = floodNextWaveAt !== null ? Math.max(0, Math.ceil((floodNextWaveAt - gameTime) / 1000)) : 0;
  if (floodTimerSpan) floodTimerSpan.textContent = `${floodKills}/${mode.floodKillGoal || 3}`;
  const floodBadgeEl = document.getElementById('flood-badge');
  if (floodBadgeEl) {
    const desktop = floodBadgeEl.querySelector('.badge-text-desktop');
    const mobile = floodBadgeEl.querySelector('.badge-text-mobile');
    if (desktop) {
      desktop.textContent = `🌊 Charcos ${floodWaterCells.length}/${maxSimul} · Cipactlis ${floodKills}/${mode.floodKillGoal || 3} · Oleada ${nextWaveIn}s`;
    }
    if (mobile) mobile.textContent = `${floodKills}/${mode.floodKillGoal || 3}`;
  }

  // Spawn Cipactli
  const cipAlive = enemyGuardians.some(g => g.traits.isCipactli);
  if (!cipAlive && !floodVictoryShown && gameTime >= CIPACTLI_FLOOD_FIRST_SPAWN_MS) {
    if (!nextCipactliSpawnAt || gameTime >= nextCipactliSpawnAt) {
      const ok = spawnCipactli();
      if (!ok) nextCipactliSpawnAt = gameTime + 3000;
      else nextCipactliSpawnAt = gameTime + CIPACTLI_FLOOD_RESPAWN_MS;
    }
  }

  // Spawn maíz
  if (floodMaizeSpawnAt !== null && gameTime >= floodMaizeSpawnAt) {
    floodMaizeSpawnAt = gameTime + FLOOD_MAIZE_BONUS_SPAWN_MS;
    const total = gridCols * gridRows;
    const start = Math.floor(Math.random() * total);
    for (let o = 0; o < total; o++) {
      const c = (start + o) % total;
      const x = c % gridCols;
      const y = Math.floor(c / gridCols);
      if (isGuardianCellOccupied(x, y)) continue;
      if (isFloodCell(x, y)) continue;
      foods.push({
        x, y, shape: 2, offering: 'maize',
        landingAt: gameTime + MAIZE_FALL_DURATION_MS,
        meteorOffsetX: (Math.random() - 0.5) * TILE_SIZE * 6
      });
      break;
    }
  }
}

// ========================================================
// 20. CAMPANA
// ========================================================
function updateCampaignProgressBadge() {
  if (!campaignLevel) return;
  const lvl = CAMPAIGN_LEVELS.find(l => l.id === campaignLevel);
  if (!lvl || campaignWon) return;

  let current = 0;
  const target = lvl.goal.target;
  if (lvl.goal.type === 'eatMaize') current = runMaizeEaten;
  else if (lvl.goal.type === 'killGuardians') current = runGuardiansDefeated;
  else if (lvl.goal.type === 'surviveNoDamage') {
    current = runLivesLost === 0 ? Math.floor(gameTime - runStartForCampaign) : 0;
  }
  else if (lvl.goal.type === 'killCipactli') current = runCipactliDefeated;
  else if (lvl.goal.type === 'killTezcatlipoca') current = runTezcatlipocaDefeated;

  current = Math.min(current, target);

  BadgeManager.setVisible('campaign', true);
  if (campaignInstruction) campaignInstruction.textContent = `📖 Cap. ${campaignLevel}: ${lvl.desc}`;
  if (campaignInstructionMobile) campaignInstructionMobile.textContent = `Cap. ${campaignLevel}`;
  if (campaignProgressSpan) {
    campaignProgressSpan.textContent = lvl.goal.type === 'surviveNoDamage'
      ? `${Math.floor(current / 1000)}s/${Math.floor(target / 1000)}s`
      : `${current}/${target}`;
  }

  if (current >= target && !campaignWon) {
    campaignWon = true;
    if (!progression.campaignCompleted.includes(campaignLevel)) {
      progression.campaignCompleted.push(campaignLevel);
      progression.campaignProgress = Math.max(progression.campaignProgress || 0, campaignLevel);
      saveProgression();
      checkAchievements();
    }
    playChapterCompleteSound();
    setTimeout(() => {
      if (isGameRunning) gameOver(`📖 ¡Capítulo ${campaignLevel} completado!`);
    }, 350);
  }
}

// ========================================================
// 21. MODOS
// ========================================================
function updateModeMechanics(elapsedMs) {
  const mode = GAME_MODES[gameModeSelect.value];
  if (!mode) return;
  if (mode.hasEclipse && nextEclipseAt !== null && !eclipseActive) {
    if (gameTime >= nextEclipseAt - ECLIPSE_WARNING_MS && !eclipseWarningShown) {
      eclipseWarningShown = true;
      spawnFloatingText('🌑 ¡Eclipse inminente!', window.innerWidth / 2, 100, '#c89bf0');
    }
    if (gameTime >= nextEclipseAt) {
      if (!isGameRunning || isPaused || countdownEndsAt !== null) return;
      eclipseActive = true;
      eclipseUntil = gameTime + ECLIPSE_DURATION_MS;
      eclipseWarningShown = false;
      playEclipseSound();
      vibrate([40, 60, 40]);
      BadgeManager.setVisible('eclipse', true);
      if (eclipseTimerSpan) eclipseTimerSpan.textContent = Math.ceil(ECLIPSE_DURATION_MS / 1000);
      spawnFloatingText('🌑 ¡ECLIPSE! Controles invertidos', window.innerWidth / 2, 100, '#c89bf0');
      directionQueue = [];
    }
  }
  if (eclipseActive) {
    const sec = Math.max(0, Math.ceil((eclipseUntil - gameTime) / 1000));
    if (eclipseTimerSpan) eclipseTimerSpan.textContent = sec;
    if (gameTime >= eclipseUntil) {
      eclipseActive = false;
      BadgeManager.setVisible('eclipse', false);
      nextEclipseAt = gameTime + ECLIPSE_INTERVAL_MS;
      spawnFloatingText('🌑 Eclipse terminado', window.innerWidth / 2, 100, '#7de8c4');
    }
  }
  if (mode.hasDarkness) {
    if (darknessStartTime === null) darknessStartTime = gameTime;
    const elapsedSinceDark = gameTime - darknessStartTime;
    if (elapsedSinceDark > DARKNESS_START_MS) {
      const t = Math.min(1, (elapsedSinceDark - DARKNESS_START_MS) / (DARKNESS_FULL_MS - DARKNESS_START_MS));
      darknessRadius = DARKNESS_MAX_RADIUS - t * (DARKNESS_MAX_RADIUS - DARKNESS_MIN_RADIUS);
      BadgeManager.setVisible('darkness', true);
    } else {
      darknessRadius = DARKNESS_MAX_RADIUS;
      BadgeManager.setVisible('darkness', false);
    }
  }
  if (mode.hasTimer) {
    timedRemainingMs -= elapsedMs;
    BadgeManager.setVisible('timer', true);
    if (timerValueSpan) timerValueSpan.textContent = Math.ceil(Math.max(0, timedRemainingMs) / 1000);
    if (timerBadge) timerBadge.classList.toggle('critical', timedRemainingMs < TIMED_WARNING_MS);
    if (timedRemainingMs < TIMED_WARNING_MS && !timedWarningShown) {
      timedWarningShown = true;
      playTimerWarningSound();
    }
    if (timedRemainingMs <= 0) {
      timedRemainingMs = 0;
      gameOver('⏱️ ¡El sol se ha puesto! Se acabó el tiempo.');
      return;
    }
  }
  if (mode.name === 'Supervivencia') {
    if (nextXibalbaTrialAt !== null && gameTime >= nextXibalbaTrialAt && !activeXibalbaTrial) {
      const trials = [
        { type: 'no_maize', description: '💀 Prueba de Xibalbá: NO recojas maíz durante 10 segundos', shortDescription: 'No recojas maíz', durationMs: XIBALBA_DURATION_MS },
        { type: 'center_cross', description: '💀 Prueba de Xibalbá: cruza el centro del tablero', shortDescription: 'Cruza el centro', durationMs: XIBALBA_DURATION_MS },
      ];
      const trial = trials[Math.floor(Math.random() * trials.length)];
      activeXibalbaTrial = { ...trial, startedAt: gameTime };
      xibalbaMaizeBlocked = trial.type === 'no_maize';
      playXibalbaSound();
      vibrate([60, 40, 60]);
      BadgeManager.setVisible('xibalba', true);
      if (xibalbaInstruction) xibalbaInstruction.textContent = trial.description;
      if (xibalbaInstructionMobile) xibalbaInstructionMobile.textContent = trial.shortDescription;
      if (xibalbaTimerSpan) xibalbaTimerSpan.textContent = Math.ceil(trial.durationMs / 1000);
      spawnFloatingText(trial.description, window.innerWidth / 2, 120, '#ff8fa3');
    }
    if (activeXibalbaTrial) {
      const elapsed = gameTime - activeXibalbaTrial.startedAt;
      const remaining = activeXibalbaTrial.durationMs - elapsed;
      if (xibalbaTimerSpan) xibalbaTimerSpan.textContent = Math.ceil(Math.max(0, remaining) / 1000);
      if (remaining <= 0) {
        activeXibalbaTrial = null;
        xibalbaMaizeBlocked = false;
        BadgeManager.setVisible('xibalba', false);
        nextXibalbaTrialAt = gameTime + XIBALBA_INTERVAL_MS;
        score += 100;
        progression.maizeCoins += 5;
        updateScoresUI();
        spawnFloatingText('✅ ¡Prueba superada! +100', window.innerWidth / 2, 100, '#7de8c4');
        playAchievementSound();
      }
    }
  }
  if (mode.hasZenGoal) {
    const goal = mode.zenMaizeGoal || 25;
    BadgeManager.setVisible('campaign', true);
    if (campaignInstruction) campaignInstruction.textContent = `🧘 Meditación: ${zenMaizeEaten}/${goal} maíces`;
    if (campaignInstructionMobile) campaignInstructionMobile.textContent = `${zenMaizeEaten}/${goal}`;
    if (campaignProgressSpan) campaignProgressSpan.textContent = `${zenMaizeEaten}/${goal}`;
    if (zenMaizeEaten >= goal && !campaignWon) {
      campaignWon = true;
      playZenCompleteSound();
      const elapsed = gameTime - runStartedAt;
      if (progression.bestZenTimeMs === undefined || elapsed < progression.bestZenTimeMs) {
        progression.bestZenTimeMs = elapsed;
        saveProgression();
      }
      gameOver(`🧘 ¡Meditación completa! ${zenMaizeEaten} maíces en ${formatDuration(elapsed)}`);
    }
  }
  if (mode.isCampaign && campaignLevel) {
    updateCampaignProgressBadge();
  }
  if (mode.isDaily && dailyChallenge && !campaignWon) {
    BadgeManager.setVisible('daily', true);
    const rule = dailyChallenge.rule;
    if (dailyInstruction) dailyInstruction.textContent = `${rule.icon} ${rule.name}: ${rule.description}`;
    if (dailyInstructionMobile) dailyInstructionMobile.textContent = `${rule.icon}`;
  }
  updateFloodMode(elapsedMs);
}

// ========================================================
// 22. RESET / GAME OVER
// ========================================================
function ensureFoodCount(count = 6) {
  let attempts = 0;
  const onlyMaize = dailyState.onlyMaize;
  const noCacao = dailyState.noCacao;
  while (foods.length < count && attempts < gridCols * gridRows) {
    attempts++;
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    if (isGuardianCellOccupied(x, y)) continue;
    let offering;
    if (onlyMaize) offering = 'maize';
    else if (noCacao) offering = 'common';
    else offering = Math.random() < 0.35 ? 'cacao' : 'common';
    foods.push({ x, y, shape: Math.floor(Math.random() * 6), offering });
  }
  if (sacredRainUntil > gameTime) ensureMaizeOffering();
}
function ensureMaizeOffering() {
  let count = foods.filter(f => f.offering === 'maize').length;
  if (count >= SACRED_RAIN_MAIZE_COUNT) { maizeSpawnRetryAt = null; return true; }
  while (count < SACRED_RAIN_MAIZE_COUNT) {
    const total = gridCols * gridRows;
    const start = Math.floor(Math.random() * total);
    let spawned = false;
    for (let o = 0; o < total; o++) {
      const c = (start + o) % total;
      const x = c % gridCols;
      const y = Math.floor(c / gridCols);
      if (isGuardianCellOccupied(x, y)) continue;
      foods.push({ x, y, shape: 2, offering: 'maize', landingAt: gameTime + MAIZE_FALL_DURATION_MS, meteorOffsetX: (Math.random() - 0.5) * TILE_SIZE * 4 });
      count++;
      spawned = true;
      break;
    }
    if (!spawned) { maizeSpawnRetryAt = gameTime + 500; return false; }
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
  foods = []; bonusFoods = []; shieldFoods = []; freezeFoods = []; cosmicOrderFoods = []; sacrificeFoods = []; skullFoods = [];
  damageRings = [];
  lastSkullPosition = null; nextSkullMoveAt = null;
  isOnFire = false;
  BadgeManager.setVisible('sacrificeOffering', false);
  BadgeManager.setVisible('skullFood', false);
  BadgeManager.setVisible('cosmicOrder', false);
  BadgeManager.setVisible('cosmicOrderFood', false);
  BadgeManager.setVisible('rain', false);
  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0; furiaCooldownUntilReal = 0; furiaAuraStart = 0;
  BadgeManager.setVisible('furia', false);
  airFoods = []; airSpawnAt = AIR_FIRST_SPAWN_MS; airBoostUntil = 0;
  BadgeManager.setVisible('air', false);
  const profile = getDifficultyProfile();
  sacredRainUntil = 0; nextSacredRainAt = profile.rainFirstMs; maizeSpawnRetryAt = null;
  nextCosmicOrderSpawnAt = profile.cosmicFirstMs; cosmicOrderResolveAt = null; cosmicOrderFlashStartedAt = null;
  nextSacrificeSpawnAt = profile.sacrificeFirstMs; nextSkullSpawnAt = profile.skullFirstMs;
  particles = []; floatingTexts = []; screenShake = 0; headPulse = 0; headPulseColor = '#d5bd70';
  clearFireBreath(); jadeTrailAccumulator = 0;
  enemySpawnAt = null; jadeSpawnAt = null; freezeSpawnAt = FREEZE_FIRST_SPAWN_MS;
  guardiansFrozenUntil = 0; nextChaacSpawnAt = null;
  nextCipactliSpawnAt = null;
  if (_spawnTimeoutId) { clearTimeout(_spawnTimeoutId); _spawnTimeoutId = null; }
  _spawnScheduled = false;
  BadgeManager.setVisible('freeze', false);
  enemyGuardians = []; hasSpawnedGuardian = false; usedGuardianPalettes = [];
  window.__guardianQuotesShown = {};
  updateGuardianBadge();
  updateFuriaUI();
  updateScoresUI(); updateLivesUI();
  deactivateImmunity();
  ensureFoodCount(6);
  maybeSpawnShieldFood();
  if (gameOverlay) gameOverlay.classList.add('hidden');
  eclipseActive = false;
  eclipseUntil = 0;
  eclipseWarningShown = false;
  const mode = GAME_MODES[gameModeSelect.value];
  nextEclipseAt = mode.hasEclipse ? ECLIPSE_FIRST_MS + gameTime : null;
  darknessRadius = DARKNESS_MAX_RADIUS;
  darknessStartTime = null;
  huntTrail = [];
  timedRemainingMs = TIMED_INITIAL_MS; timedWarningShown = false;
  zenMaizeEaten = 0;
  activeXibalbaTrial = null;
  nextXibalbaTrialAt = mode.name === 'Supervivencia' ? XIBALBA_FIRST_MS : null;
  xibalbaMaizeBlocked = false;
  const isFloodMode = GAME_MODES[gameModeSelect.value]?.hasFloodWaves === true;
  floodNextWaveAt = isFloodMode ? gameTime + FLOOD_WAVE_FIRST_MS : null;
  floodWaterCells = [];
  floodWaterWaves = 0;
  floodKills = 0;
  floodVictoryShown = false;
  window.__floodDamageCooldown = 0;
  floodMaizeSpawnAt = isFloodMode ? gameTime + FLOOD_MAIZE_BONUS_SPAWN_MS : null;
  floodSlowUntil = 0;
  runFloodWaves = 0;
  BadgeManager.setVisible('flood', false);
  runCipactliDefeated = 0;
  runTezcatlipocaDefeated = 0;
  runMaizeEaten = 0;
  runLivesLost = 0;
  campaignWon = false;
  runStartForCampaign = 0;
  BadgeManager.setVisible('timer', false);
  BadgeManager.setVisible('eclipse', false);
  BadgeManager.setVisible('xibalba', false);
  BadgeManager.setVisible('darkness', false);
  BadgeManager.setVisible('campaign', false);
  BadgeManager.setVisible('daily', false);
  if (timerBadge) timerBadge.classList.remove('critical');
  invalidateProfileCache();
  if (gameModeSelect.value === 'campaign') {
    if (!campaignLevel) campaignLevel = 1;
    const lvl = CAMPAIGN_LEVELS.find(l => l.id === campaignLevel);
    if (lvl && difficultySelect.value !== lvl.difficulty) {
      difficultySelect.value = lvl.difficulty;
      invalidateProfileCache();
    }
    updateCampaignProgressBadge();
  }
  updateMusicLayer();
}

function findRespawnPosition() {
  const cx = Math.floor(gridCols / 2);
  const cy = Math.floor(gridRows / 2);
  for (let o = 0; o < gridCols * gridRows; o++) {
    const x = (cx + o % gridCols) % gridCols;
    const y = (cy + Math.floor(o / gridCols)) % gridRows;
    const segs = [0, 1, 2].map(d => ({ x: (x - d + gridCols) % gridCols, y }));
    const overlap = segs.some(p => enemyGuardians.some(g => g.segments.some(s => s.x === p.x && s.y === p.y)));
    if (!overlap) return { x, y };
  }
  return null;
}

function loseLife(reason, damageX, damageY) {
  if (!GAME_MODES[gameModeSelect.value].livesEnabled) { gameOver(reason); return; }
  lives = Math.max(0, lives - 1);
  runLivesLost++;
  updateLivesUI();
  if (GAME_MODES[gameModeSelect.value]?.isCampaign && campaignLevel === 3) {
    screenShake = reduceMotion ? 0 : 8;
    vibrate([40, 30, 40]);
    playDamageSound();
    setTimeout(() => gameOver('📖 Fallaste: perdiste una vida en el Descenso.'), 300);
    return;
  }
  screenShake = reduceMotion ? 0 : 8;
  vibrate([40, 30, 40]);
  playDamageSound();
  if (damageX !== undefined && damageY !== undefined) {
    spawnDamageRing(damageX * TILE_SIZE + TILE_SIZE / 2, damageY * TILE_SIZE + TILE_SIZE / 2);
  }
  const prevHead = snake[0];
  if (prevHead) {
    const hx = prevHead.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = prevHead.y * TILE_SIZE + TILE_SIZE / 2;
    const count = reduceMotion ? 6 : 14;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count;
      const sp = 1.5 + Math.random() * 2;
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2 + Math.random() * 2, color: ['#ef5261', '#9b2929', '#f5efdc'][i % 3], alpha: 1, decay: 0.03 });
    }
  }
  if (lives === 0) { gameOver(`${reason} Se agotaron los tres sacrificios.`, reason); return; }
  const spawn = findRespawnPosition();
  if (!spawn) { gameOver('Los guardianes han cerrado todos los caminos.'); return; }
  snake = [
    { x: spawn.x, y: spawn.y },
    { x: (spawn.x - 1 + gridCols) % gridCols, y: spawn.y },
    { x: (spawn.x - 2 + gridCols) % gridCols, y: spawn.y }
  ];
  direction = { x: 1, y: 0 };
  directionQueue = [];
  previousSnakePositions = snake.map(s => ({ ...s }));
  deactivateImmunity();
  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0; furiaCooldownUntilReal = 0;
  BadgeManager.setVisible('furia', false);
  isOnFire = false;
  airBoostUntil = 0;
  BadgeManager.setVisible('air', false);
  updateFuriaUI();
  if (!dailyState.noRespawnShield) {
    respawnProtectedUntil = gameTime + RESPAWN_PROTECTION_MS;
    if (respawnTimerSpan) respawnTimerSpan.textContent = String(Math.ceil(RESPAWN_PROTECTION_MS / 1000));
    BadgeManager.setVisible('respawn', true);
  }
  triggerHeadPulse('#4ec9a0');
  if (prevHead) spawnFloatingText('🫀 Sacrificio perdido', prevHead.x * TILE_SIZE + TILE_SIZE / 2, prevHead.y * TILE_SIZE, '#ef5261');
  updateScoresUI();
  if (sacrificeFoods.length === 0) nextSacrificeSpawnAt = gameTime + SACRIFICE_RESPAWN_DELAY_MS;
  updateMusicLayer();
}

// ========================================================
// 23. UPDATE POR TICK
// ========================================================
function gameUpdate() {
  if (isPaused || !isGameRunning || countdownEndsAt !== null) return;
  if (directionQueue.length > 0) direction = directionQueue.shift();
  const moveDir = { ...direction };
  const crossed =
    (moveDir.x > 0 && snake[0].x === gridCols - 1) ||
    (moveDir.x < 0 && snake[0].x === 0) ||
    (moveDir.y > 0 && snake[0].y === gridRows - 1) ||
    (moveDir.y < 0 && snake[0].y === 0);
  const newX = (snake[0].x + moveDir.x + gridCols) % gridCols;
  const newY = (snake[0].y + moveDir.y + gridRows) % gridRows;
  const head = { x: newX, y: newY };
  const canEatMaize = !xibalbaMaizeBlocked;
  const willGrow =
    (canEatMaize && foods.some(f => f.x === head.x && f.y === head.y && (f.landingAt === undefined || gameTime >= f.landingAt))) ||
    bonusFoods.some(f => f.x === head.x && f.y === head.y) ||
    shieldFoods.some(f => f.x === head.x && f.y === head.y) ||
    freezeFoods.some(f => f.x === head.x && f.y === head.y) ||
    airFoods.some(f => f.x === head.x && f.y === head.y) ||
    cosmicOrderFoods.some(f => f.x === head.x && f.y === head.y) ||
    sacrificeFoods.some(f => f.x === head.x && f.y === head.y);
  const bodyCheck = willGrow ? snake : snake.slice(0, -1);
  if (bodyCheck.some(s => s.x === head.x && s.y === head.y)) { loseLife('Kukulcán se enredó con su propio cuerpo.'); return; }
  const skullIdx = skullFoods.findIndex(f => f.x === head.x && f.y === head.y);
  if (skullIdx !== -1) {
    skullFoods.splice(skullIdx, 1);
    nextSkullMoveAt = null;
    BadgeManager.setVisible('skullFood', false);
    nextSkullSpawnAt = gameTime + SKULL_RESPAWN_DELAY_MS;
    loseLife('¡La Calavera maldita te arrebató un sacrificio!', head.x, head.y);
    return;
  }
  const hitG = enemyGuardians.find(g => {
    if (g.destroyed) return false;
    if (g.traits.isCipactli && g.portalPhase !== 'idle') return false;
    if (g.traits.isCipactli) {
      if (GAME_MODES[gameModeSelect.value]?.hasFloodWaves) {
        const vulnerable = g.vulnerableUntil && gameTime < g.vulnerableUntil;
        if (!vulnerable) return false;
      }
      return g.segments.some(s => s.x === head.x && s.y === head.y);
    }
    if (g.behavior.id === 'ambusher') return g.segments.some(s => Math.abs(s.x - head.x) <= 1 && Math.abs(s.y - head.y) <= 1);
    return g.segments.some(s => s.x === head.x && s.y === head.y);
  });
  if (hitG && !hitG.destroyed) {
    const isBoss = hitG.traits.isBoss;
    const profile = getDifficultyProfile();
    if (hasGuardianProtection() || guardiansFrozenUntil > gameTime || isFuria) {
      const furia = isFuria;
      const shield = isImmune;
      const frozen = guardiansFrozenUntil > gameTime;
      const color = furia ? '#ff6b2c' : shield ? '#facc15' : frozen ? '#8be7ff' : '#4ec9a0';
      const symbol = furia ? '🔥' : shield ? '💎' : frozen ? '❄️' : '🪶';
      let reward;
      if (hitG.traits.isCipactli) reward = (CIPACTLI_CONFIG[getEffectiveDifficulty()] || CIPACTLI_CONFIG.medium).reward;
      else if (hitG.traits.isTezcatlipoca) reward = furia ? FURIA_GUARDIAN_REWARD : (TEZCATLIPOCA_CONFIG[getEffectiveDifficulty()]?.reward || 400);
      else reward = furia ? FURIA_GUARDIAN_REWARD : (isBoss ? profile.bossReward : profile.guardianReward);
      reward *= dailyState.guardianMultiplier;
      screenShake = reduceMotion ? 0 : (isBoss ? 12 : 10);
      triggerHeadPulse(color);
      playEnemyDefeatedSound();
      vibrate(isBoss ? [40, 30, 40, 30, 60] : 35);
      runGuardiansDefeated++;
      score += reward;
      let label = '¡GUARDIÁN VENCIDO!';
      if (hitG.traits.isCipactli) label = '¡CIPACTLI VENCIDO!';
      else if (hitG.traits.isTezcatlipoca) label = '¡TEZCATLIPOCA VENCIDO!';
      spawnFloatingText(`+${reward} ${symbol} ${label}`, head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, color);
      updateScoresUI();
      if (GAME_MODES[gameModeSelect.value]?.isCampaign && campaignLevel) {
        updateCampaignProgressBadge();
      }
      destroyEnemySnake(hitG.id);
    } else {
      screenShake = reduceMotion ? 0 : (isBoss ? 12 : 8);
      let reason = `¡El ${hitG.behavior.name} te alcanzó!`;
      if (hitG.traits.isCipactli) reason = '¡Cipactli te devoró con sus fauces primordiales!';
      else if (hitG.traits.isTezcatlipoca) reason = '¡Tezcatlipoca, el jaguar de obsidiana, te devoró!';
      loseLife(reason, head.x, head.y);
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
    if (GAME_MODES[gameModeSelect.value]?.hasFloodWaves && floodWaterCells.length > 0) {
      const removed = clearFloodCells(FLOOD_JADE_CLEAR_CELLS);
      if (removed > 0) {
        spawnFloatingText(`💎 ¡Dique! -${removed} charcos`, hx, hy - 22, '#7de8c4');
        announce('Dique de jade: el agua retrocede');
      }
    }
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
      if (cosmicOrderTimerSpan) cosmicOrderTimerSpan.textContent = String(COSMIC_ORDER_WARNING_MS / 1000);
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
      let bonusPts = 50;
      if (GAME_MODES[gameModeSelect.value]?.floodScoreMultiplier) bonusPts = Math.round(bonusPts * GAME_MODES[gameModeSelect.value].floodScoreMultiplier);
      score += bonusPts;
      progression.maizeCoins += 2;
      triggerHeadPulse('#facc15');
      spawnFloatingText(`+${bonusPts}`, hx, hy, '#facc15');
      playEatSound('bonus');
      updateScoresUI();
      spawnEatBurst(hx, hy, '#facc15', 10);
      if (GAME_MODES[gameModeSelect.value]?.hasTimer) {
        timedRemainingMs += TIMED_BONUS_BONUS_MS;
        spawnFloatingText(`+${TIMED_BONUS_BONUS_MS/1000}s ⏱️`, hx, hy - 22, '#5cc8ff');
      }
      ateItem = true;
    }
  }
  if (!ateItem) {
    const foodIdx = foods.findIndex(f => f.x === head.x && f.y === head.y && (f.landingAt === undefined || gameTime >= f.landingAt));
    if (foodIdx !== -1 && !xibalbaMaizeBlocked) {
      const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
      const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
      const [food] = foods.splice(foodIdx, 1);
      const maizeBonus = food.offering === 'maize' && sacredRainUntil > gameTime ? MAIZE_RAIN_BONUS : 0;
      let foodScore = 10 + maizeBonus;
      if (food.offering === 'maize') foodScore += dailyState.maizeBonusPoints;
      foodScore *= dailyState.maizeMultiplier;
      if (GAME_MODES[gameModeSelect.value]?.floodScoreMultiplier) foodScore = Math.round(foodScore * GAME_MODES[gameModeSelect.value].floodScoreMultiplier);
      score += foodScore;
      runMaizeEaten++;
      if (GAME_MODES[gameModeSelect.value]?.hasZenGoal) zenMaizeEaten++;
      if (food.offering === 'maize') progression.totalMaize++;
      else if (food.offering === 'cacao') progression.totalCacao++;
      progression.maizeCoins += 1;
      triggerHeadPulse(maizeBonus ? '#facc15' : '#d5bd70');
      spawnFloatingText(maizeBonus ? `+${foodScore} 🌽🌧️` : `+${foodScore}`, hx, hy, maizeBonus ? '#facc15' : '#d5bd70');
      if (GAME_MODES[gameModeSelect.value]?.hasTimer) {
        timedRemainingMs += TIMED_MAIZE_BONUS_MS;
        spawnFloatingText(`+${TIMED_MAIZE_BONUS_MS/1000}s ⏱️`, hx, hy - 22, '#5cc8ff');
      }
      playEatSound('normal');
      spawnEatBurst(hx, hy, maizeBonus ? '#facc15' : '#d5bd70', maizeBonus ? 10 : 6);
      ensureFoodCount(6);
      updateScoresUI();
      saveProgression();
      if (GAME_MODES[gameModeSelect.value]?.isCampaign && campaignLevel) {
        updateCampaignProgressBadge();
      }
      if (GAME_MODES[gameModeSelect.value]?.hasFloodWaves && floodNextWaveAt !== null) {
        floodNextWaveAt += FLOOD_MAIZE_DELAY_MS;
        spawnFloatingText(`+${FLOOD_MAIZE_DELAY_MS/1000}s 🌽`, hx, hy - 22, '#facc15');
      }
      ateItem = true;
    }
  }
  if (!ateItem) snake.pop();
  if (crossed) spawnWorldCrossingEffect(head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE + TILE_SIZE / 2);
  if (isFuria && snake.length > 0) {
    const tail = snake[snake.length - 1];
    if (particles.length < 120) spawnFuriaTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  } else if (airBoostUntil > gameTime && snake.length > 0) {
    const tail = snake[snake.length - 1];
    if (particles.length < 100) spawnAirTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
  }
  updateEnemySnakeAI();
  updateMusicLayer();
}

// ========================================================
// 24. UI / SCORES
// ========================================================
function updateScoresUI() {
  if (dtScore) dtScore.textContent = score;
  if (mbScore) mbScore.textContent = score;
  if (dtHighScore) dtHighScore.textContent = highScore;
  if (mbHighScore) mbHighScore.textContent = highScore;
  if (dtLength) dtLength.textContent = snake.length;
  if (dtCoins) dtCoins.textContent = progression.maizeCoins;
  if (score > highScore) {
    highScore = score;
    if (dtHighScore) dtHighScore.textContent = highScore;
    if (mbHighScore) mbHighScore.textContent = highScore;
    safeSetItem('snakeIoHighScore', highScore);
  }
}

function updateLivesUI() {
  if (livesFixedPipEls && livesFixedPipEls.length > 0) {
    livesFixedPipEls.forEach((pip, i) => {
      if (i >= maxLives) pip.style.display = 'none';
      else { pip.style.display = ''; pip.classList.toggle('spent', i >= lives); }
    });
  }
  if (livesFixedContainer) {
    livesFixedContainer.classList.toggle('critical', lives === 1 && maxLives > 1);
    livesFixedContainer.setAttribute('aria-label', `Sacrificios restantes: ${lives} de ${maxLives}`);
  }
  if (livesMobilePipEls && livesMobilePipEls.length > 0) {
    livesMobilePipEls.forEach((pip, i) => {
      if (i >= maxLives) pip.style.display = 'none';
      else { pip.style.display = ''; pip.classList.toggle('spent', i >= lives); }
    });
  }
}

// ========================================================
// 25. HELPERS DE DIBUJO
// ========================================================
function interpolateGridPosition(current, previous, progress) {
  if (!previous || progress >= 1) return current;
  let dx = current.x - previous.x;
  let dy = current.y - previous.y;
  if (dx > gridCols / 2) dx -= gridCols;
  else if (dx < -gridCols / 2) dx += gridCols;
  if (dy > gridRows / 2) dy -= gridRows;
  else if (dy < -gridRows / 2) dy += gridRows;
  if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) return current;
  const rawX = previous.x + dx * progress;
  const rawY = previous.y + dy * progress;
  return {
    x: Math.max(0, Math.min(gridCols - 1, (rawX + gridCols) % gridCols)),
    y: Math.max(0, Math.min(gridRows - 1, (rawY + gridRows) % gridRows))
  };
}
function roundRect(c, x, y, w, h, r) {
  const maxR = Math.min(w, h) / 2;
  if (r > maxR) r = maxR;
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
  const w = window.innerWidth, h = window.innerHeight;
  const theme = BOARD_THEMES[progression.selectedTheme || 'classic'] || BOARD_THEMES.classic;
  const gradient = ctx.createRadialGradient(w/2, h/2, Math.min(w, h) * 0.35, w/2, h/2, Math.max(w, h) * 0.75);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, theme.vignetteColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}
function drawDarkness() {
  const mode = GAME_MODES[gameModeSelect.value];
  if (!mode || !mode.hasDarkness) return;
  if (darknessRadius >= DARKNESS_MAX_RADIUS) return;
  if (snake.length === 0) return;
  const head = snake[0];
  const hx = head.x * TILE_SIZE + TILE_SIZE / 2;
  const hy = head.y * TILE_SIZE + TILE_SIZE / 2;
  const radiusPx = darknessRadius * TILE_SIZE;
  const gradient = ctx.createRadialGradient(hx, hy, radiusPx * 0.2, hx, hy, radiusPx * 1.2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}
function drawEclipseTint() {
  if (!eclipseActive) return;
  const remaining = Math.max(0, eclipseUntil - gameTime);
  const total = ECLIPSE_DURATION_MS;
  const intensity = Math.min(1, remaining / total) * 0.35;
  ctx.save();
  ctx.fillStyle = `rgba(60, 40, 100, ${intensity})`;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.restore();
}
function drawHuntTrail() {
  if (huntTrail.length === 0) return;
  ctx.save();
  if (isSlowDevice) {
    huntTrail.forEach(t => {
      const age = (gameTime - (t.expiresAt - HUNT_TRAIL_LIFETIME_MS)) / HUNT_TRAIL_LIFETIME_MS;
      if (age < 0 || age > 1) return;
      ctx.globalAlpha = (1 - age) * 0.35;
      ctx.fillStyle = 'rgba(120, 120, 140, 0.6)';
      ctx.fillRect(t.x * TILE_SIZE + 2, t.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    });
  } else {
    huntTrail.forEach(t => {
      const age = (gameTime - (t.expiresAt - HUNT_TRAIL_LIFETIME_MS)) / HUNT_TRAIL_LIFETIME_MS;
      if (age < 0 || age > 1) return;
      const alpha = (1 - age) * 0.4;
      const cx = t.x * TILE_SIZE + TILE_SIZE / 2;
      const cy = t.y * TILE_SIZE + TILE_SIZE / 2;
      const r = TILE_SIZE * (0.35 + age * 0.4);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(120, 120, 140, ${alpha})`);
      grad.addColorStop(1, `rgba(80, 80, 100, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    });
  }
  ctx.restore();
}

function drawFeatherScale(segment, index, guardian) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
  const size = TILE_SIZE < 22 ? 3 : 4;
  const type = guardian.behavior.id;
  const pal = guardian.palette;
  if (type === 'hunter') {
    if (index % 2 === 0) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.75, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = pal.head;
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.55, 0, Math.PI * 2); ctx.fill();
    }
  } else if (type === 'interceptor') {
    ctx.globalAlpha = index % 2 === 0 ? 0.7 : 0.45;
    ctx.fillStyle = pal.crest;
    const s = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s * 0.6, cy); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s * 0.6, cy);
    ctx.closePath(); ctx.fill();
    if (index % 2 === 0) { ctx.fillStyle = '#1a0830'; ctx.beginPath(); ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2); ctx.fill(); }
  } else if (type === 'flanker') {
    ctx.globalAlpha = index % 2 === 0 ? 0.65 : 0.4;
    ctx.strokeStyle = pal.crest;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    const backDir = index % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.7 * backDir, cy + size * 0.7);
    ctx.lineTo(cx + size * 0.7 * backDir, cy - size * 0.7);
    ctx.stroke();
  } else if (type === 'cipactli') {
    ctx.globalAlpha = index % 2 === 0 ? 0.75 : 0.55;
    ctx.fillStyle = pal.crest;
    const s = size * 0.55;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s * 0.8, cy - s * 0.2); ctx.lineTo(cx + s * 0.5, cy + s * 0.6); ctx.lineTo(cx - s * 0.5, cy + s * 0.6); ctx.lineTo(cx - s * 0.8, cy - s * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = pal.belly;
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.globalAlpha = index % 2 === 0 ? 0.75 : 0.5;
    ctx.fillStyle = pal.crest;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size); ctx.lineTo(cx + size * 0.55, cy); ctx.lineTo(cx, cy + size); ctx.lineTo(cx - size * 0.55, cy);
    ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 1;
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
  ctx.globalAlpha = isEven ? 0.9 : 0.6;
  ctx.fillStyle = diamondColor;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size); ctx.lineTo(cx + size * 0.7, cy); ctx.lineTo(cx, cy + size); ctx.lineTo(cx - size * 0.7, cy);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = isEven ? 0.8 : 0.55;
  ctx.strokeStyle = diamondStroke;
  ctx.lineWidth = isGolden ? 0.9 : 0.7;
  ctx.stroke();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = diamondCenter;
  ctx.beginPath(); ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2); ctx.fill();
  if (isEven) {
    ctx.globalAlpha = isGolden ? 0.7 : 0.5;
    ctx.fillStyle = wingColor;
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(cx + side * size * 0.5, cy);
      ctx.quadraticCurveTo(cx + side * size * 1.25, cy - size * 0.55, cx + side * size * 1.15, cy + size * 0.4);
      ctx.quadraticCurveTo(cx + side * size * 0.8, cy + size * 0.15, cx + side * size * 0.5, cy);
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function startFireBreath() { fireBreath = { startedAt: gameTime }; }
function clearFireBreath() { fireBreath = null; }
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
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffc04d';
  ctx.beginPath();
  ctx.moveTo(0, -w * 0.16);
  ctx.quadraticCurveTo(len * 0.35, -w * 0.06, len * 0.72, -w * 0.22);
  ctx.quadraticCurveTo(len * 0.62, 0, len * 0.72, w * 0.22);
  ctx.quadraticCurveTo(len * 0.32, w * 0.08, 0, w * 0.16);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawFuriaAura(cx, cy) {
  if (!isFuria) return;
  const age = (gameTime - furiaAuraStart) / 1000;
  if (age > 2) return;
  const fade = 1 - age / 2;
  ctx.save();
  ctx.globalAlpha = fade * 0.7;
  const angle = gameTime * 0.008;
  const radius = TILE_SIZE * (1.2 + Math.sin(gameTime * 0.012) * 0.3);
  ctx.strokeStyle = '#ff6b2c';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    const baseAngle = angle + i * Math.PI;
    ctx.beginPath();
    for (let t = 0; t < 24; t++) {
      const tt = t / 23;
      const a = baseAngle + tt * Math.PI * 1.4;
      const r = radius * (0.7 + tt * 0.6);
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255, 220, 120, 0.85)';
  if (!isSlowDevice) {
    ctx.shadowColor = '#ff6b2c';
    ctx.shadowBlur = 8;
  }
  for (let i = 0; i < 6; i++) {
    const a = gameTime * 0.006 + (i / 6) * Math.PI * 2;
    const r = radius * 1.1;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawKukulkanHead(rs, dir, protectedFlag, isBlinking) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const perp = { x: -dir.y, y: dir.x };
  const skin = getActiveSkin();
  const isGolden = isImmune || isFuria || guardiansFrozenUntil > gameTime;
  const GOLD_MAIN = isGolden ? '#d4b45c' : '#d5bd70';
  const GOLD_DEEP = isGolden ? '#a8924a' : '#a8843a';
  const GOLD_PALE = isGolden ? '#f5e9b8' : '#fff2c2';
  const JADE_EYE = '#4ec9a0';
  const HEAD_FILL = isGolden ? '#c2a95e' : skin.head;
  const useShadow = !isSlowDevice;

  ctx.fillStyle = HEAD_FILL;
  roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
  ctx.fill();
  ctx.strokeStyle = skin.border || GOLD_PALE;
  ctx.lineWidth = isGolden ? 1.8 : 1.4;
  roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
  ctx.stroke();

  ctx.lineCap = 'round';
  const helmCenterX = cx - dir.x * TILE_SIZE * 0.02;
  const helmCenterY = cy - dir.y * TILE_SIZE * 0.02;
  const helmW = TILE_SIZE * 0.7;
  const helmH = TILE_SIZE * 0.22;
  ctx.save();
  ctx.translate(helmCenterX, helmCenterY);
  ctx.rotate(Math.atan2(dir.y, dir.x));
  ctx.fillStyle = GOLD_MAIN;
  ctx.strokeStyle = GOLD_DEEP;
  ctx.lineWidth = 0.9;
  roundRect(ctx, -helmW / 2, -helmH / 2 - TILE_SIZE * 0.15, helmW, helmH, 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = GOLD_PALE;
  ctx.globalAlpha = 0.7;
  roundRect(ctx, -helmW / 2 + 1, -helmH / 2 - TILE_SIZE * 0.15 + 1, helmW - 2, helmH * 0.4, 1);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = JADE_EYE;
  if (useShadow) {
    ctx.shadowColor = JADE_EYE;
    ctx.shadowBlur = isGolden ? 7 : 4;
  }
  ctx.beginPath();
  ctx.moveTo(0, -helmH / 2 - TILE_SIZE * 0.15 - 2);
  ctx.lineTo(2.5, -helmH / 2 - TILE_SIZE * 0.15 + 1.5);
  ctx.lineTo(0, -helmH / 2 - TILE_SIZE * 0.15 + 5);
  ctx.lineTo(-2.5, -helmH / 2 - TILE_SIZE * 0.15 + 1.5);
  ctx.closePath(); ctx.fill();
  if (useShadow) ctx.shadowBlur = 0;
  ctx.strokeStyle = GOLD_PALE;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  if (!isBlinking) {
    const eyeW = 5.5, eyeH = 3.2, eo = 5;
    let e1x = rs.x * TILE_SIZE + eo, e1y = rs.y * TILE_SIZE + eo;
    let e2x = rs.x * TILE_SIZE + TILE_SIZE - eo - eyeW, e2y = e1y;
    if (dir.y !== 0) { e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eo - eyeH : eo); e2y = e1y; }
    else if (dir.x !== 0) {
      e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eo - eyeW : eo);
      e2x = e1x;
      e2y = rs.y * TILE_SIZE + TILE_SIZE - eo - eyeH;
    }
    const drawGemEye = (gx, gy) => {
      const gcx = gx + eyeW / 2, gcy = gy + eyeH / 2;
      ctx.fillStyle = '#0e1a14';
      ctx.beginPath(); ctx.ellipse(gcx, gcy, eyeW / 2 + 0.6, eyeH / 2 + 0.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = JADE_EYE;
      if (useShadow) { ctx.shadowColor = JADE_EYE; ctx.shadowBlur = 5; }
      ctx.beginPath(); ctx.ellipse(gcx, gcy, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2); ctx.fill();
      if (useShadow) ctx.shadowBlur = 0;
      ctx.fillStyle = '#0e1a14';
      ctx.beginPath(); ctx.ellipse(gcx, gcy, eyeW * 0.1, eyeH * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath(); ctx.ellipse(gcx - 0.8, gcy - 1, eyeW * 0.22, eyeH * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    };
    drawGemEye(e1x, e1y); drawGemEye(e2x, e2y);
    ctx.strokeStyle = GOLD_DEEP; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(e1x - 1, e1y - 1.4); ctx.lineTo(e1x + eyeW + 1, e1y - 1.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(e2x - 1, e2y - 1.4); ctx.lineTo(e2x + eyeW + 1, e2y - 1.4); ctx.stroke();
  } else {
    const eo = 5, eyeW = 5.5;
    let e1x = rs.x * TILE_SIZE + eo, e1y = rs.y * TILE_SIZE + eo + 1.5;
    let e2x = rs.x * TILE_SIZE + TILE_SIZE - eo - eyeW, e2y = e1y;
    if (dir.y !== 0) { e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eo - 2 : eo + 1.5); e2y = e1y; }
    else if (dir.x !== 0) { e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eo - eyeW : eo); e2x = e1x; e2y = rs.y * TILE_SIZE + TILE_SIZE - eo - 2; }
    ctx.strokeStyle = GOLD_MAIN; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(e1x - 1, e1y); ctx.lineTo(e1x + eyeW + 1, e1y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(e2x - 1, e2y); ctx.lineTo(e2x + eyeW + 1, e2y); ctx.stroke();
  }
  ctx.lineCap = 'round';
  ctx.strokeStyle = GOLD_MAIN;
  ctx.lineWidth = 1.8;
  for (let side = -1; side <= 1; side += 2) {
    for (let f = 0; f < 3; f++) {
      const baseX = cx + perp.x * side * TILE_SIZE * 0.38 - dir.x * (f * 2.5 - 2);
      const baseY = cy + perp.y * side * TILE_SIZE * 0.38 - dir.y * (f * 2.5 - 2);
      const tipX = baseX + perp.x * side * (4 + f * 0.5) - dir.x * 1.5;
      const tipY = baseY + perp.y * side * (4 + f * 0.5) - dir.y * 1.5;
      ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
    }
  }
  const showTongue = protectedFlag || headPulse > 0.6 || isGolden;
  if (showTongue) {
    ctx.strokeStyle = isGolden ? '#d4703a' : '#ef5261';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.6;
    const tongueWave = Math.sin(gameTime * 0.012) * 1.4;
    const tb = { x: cx + dir.x * TILE_SIZE * 0.42, y: cy + dir.y * TILE_SIZE * 0.42 };
    const tm = { x: cx + dir.x * TILE_SIZE * 0.68 + perp.x * tongueWave, y: cy + dir.y * TILE_SIZE * 0.68 + perp.y * tongueWave };
    ctx.beginPath(); ctx.moveTo(tb.x, tb.y); ctx.lineTo(tm.x, tm.y); ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tm.x, tm.y); ctx.lineTo(tm.x + perp.x * 2.6 + dir.x * 2.6, tm.y + perp.y * 2.6 + dir.y * 2.6);
    ctx.moveTo(tm.x, tm.y); ctx.lineTo(tm.x - perp.x * 2.6 + dir.x * 2.6, tm.y - perp.y * 2.6 + dir.y * 2.6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

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
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = GOLD_DEEP;
  for (let f = -2; f <= 2; f++) {
    const spread = f * 3.2;
    const baseX = rear.x + perp.x * spread;
    const baseY = rear.y + perp.y * spread;
    const len = 16 - Math.abs(f) * 2.2;
    const tipX = rear.x - dir.x * len + perp.x * (f * 6);
    const tipY = rear.y - dir.y * len + perp.y * (f * 6);
    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = GOLD_MAIN;
    ctx.beginPath(); ctx.arc(tipX, tipY, 2, 0, Math.PI * 2); ctx.fill();
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
    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.fillStyle = GOLD_PALE;
    ctx.beginPath(); ctx.arc(tipX, tipY, 1.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.lineWidth = 3.4;
  ctx.strokeStyle = GOLD_PALE;
  const tipCX = rear.x - dir.x * 22;
  const tipCY = rear.y - dir.y * 22;
  ctx.beginPath(); ctx.moveTo(rear.x, rear.y); ctx.lineTo(tipCX, tipCY); ctx.stroke();
  ctx.fillStyle = protectedFlag || isGolden ? JADE_EYE : '#ef5261';
  ctx.strokeStyle = GOLD_PALE;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(tipCX, tipCY - 3.2); ctx.lineTo(tipCX + 2.8, tipCY); ctx.lineTo(tipCX, tipCY + 3.2); ctx.lineTo(tipCX - 2.8, tipCY);
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

// ========================================================
// 26. DIBUJO DE GUARDIANES — Cipactli completo (diseño original)
// ========================================================
function drawCipactliHead(rs, guardian, cx, cy, dir, perp, rear) {
  const pal = guardian.palette;
  const angle = Math.atan2(dir.y, dir.x);
  const isTelegraph = guardian.chargeState === 'telegraph';
  const isCharging = guardian.chargeState === 'charging';
  const time = gameTime * 0.005;
  const portalAlpha = guardian.portalAlpha || 0;
  const inPortal = portalAlpha > 0.05;

  ctx.save();

  if (inPortal && guardian.portalEntryPos) {
    const ex = guardian.portalEntryPos.x * TILE_SIZE + TILE_SIZE / 2;
    const ey = guardian.portalEntryPos.y * TILE_SIZE + TILE_SIZE / 2;
    const pRadius = TILE_SIZE * 1.6 * Math.min(1, portalAlpha * 1.5);
    drawCipactliPortal(ex, ey, pRadius, portalAlpha, guardian.portalPhase === 'opening');
  }
  if (inPortal && guardian.portalExitPos && guardian.portalPhase === 'entering') {
    const ex = guardian.portalExitPos.x * TILE_SIZE + TILE_SIZE / 2;
    const ey = guardian.portalExitPos.y * TILE_SIZE + TILE_SIZE / 2;
    const pRadius = TILE_SIZE * 1.6 * Math.min(1, portalAlpha * 0.8);
    drawCipactliPortal(ex, ey, pRadius, portalAlpha * 0.7, true);
  }

  const bodyAlpha = 1 - portalAlpha;
  if (bodyAlpha > 0.05) {
    ctx.globalAlpha = bodyAlpha;
    const bossPulse = Math.sin(gameTime * 0.004) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(78, 201, 138, ${0.14 + bossPulse * 0.1})`;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE * 1.7, 0, Math.PI * 2);
    ctx.fill();
    if (isTelegraph || isCharging) {
      const pulse = Math.sin(gameTime * 0.03) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 60, 30, ${0.28 + pulse * 0.25})`;
      ctx.beginPath();
      ctx.arc(cx, cy, TILE_SIZE * 1.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const bodyW = TILE_SIZE * 1.7;
    const bodyH = TILE_SIZE * 1.35;
    const tailLen = TILE_SIZE * 2.2;

    // Cola
    const tailWave = Math.sin(time * 2.5) * 2.5;
    ctx.fillStyle = pal.body;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-bodyW * 0.5, -bodyH * 0.35);
    ctx.lineTo(-bodyW * 0.5 - tailLen * 0.4, -bodyH * 0.25 + tailWave * 0.6);
    ctx.lineTo(-bodyW * 0.5 - tailLen * 0.75, -bodyH * 0.12 + tailWave);
    ctx.lineTo(-bodyW * 0.5 - tailLen, -bodyH * 0.06 + tailWave * 1.3);
    ctx.lineTo(-bodyW * 0.5 - tailLen * 0.75, bodyH * 0.1 + tailWave);
    ctx.lineTo(-bodyW * 0.5 - tailLen * 0.4, bodyH * 0.22 + tailWave * 0.6);
    ctx.lineTo(-bodyW * 0.5, bodyH * 0.35);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Escamas de la cola
    ctx.fillStyle = pal.crest;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 0.9;
    for (let i = 0; i < 8; i++) {
      const t = (i + 1) / 9;
      const sx = -bodyW * 0.5 - tailLen * t;
      const sy = tailWave * t * 1.2;
      ctx.beginPath();
      ctx.moveTo(sx - 3.5, sy - 2);
      ctx.lineTo(sx, sy - 9);
      ctx.lineTo(sx + 3.5, sy - 2);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx - 3.5, sy + 2);
      ctx.lineTo(sx, sy + 9);
      ctx.lineTo(sx + 3.5, sy + 2);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Punta de cola
    const tipX = -bodyW * 0.5 - tailLen;
    const tipY = tailWave * 1.3;
    ctx.fillStyle = pal.crest;
    ctx.beginPath();
    ctx.moveTo(tipX + 6, tipY - 6);
    ctx.lineTo(tipX - 9, tipY);
    ctx.lineTo(tipX + 6, tipY + 6);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Patas
    ctx.fillStyle = pal.body;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 1.4;
    const pawPositions = [
      { x: -bodyW * 0.34, y: -bodyH * 0.98, dir: 1 },
      { x: -bodyW * 0.34, y: bodyH * 0.42, dir: -1 },
      { x: bodyW * 0.02, y: -bodyH * 0.98, dir: 1 },
      { x: bodyW * 0.02, y: bodyH * 0.42, dir: -1 }
    ];
    pawPositions.forEach(p => {
      roundRect(ctx, p.x, p.y, TILE_SIZE * 0.38, TILE_SIZE * 0.58, 4);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff8e0';
      const baseX = p.x + TILE_SIZE * 0.19;
      const baseY = p.y + (p.dir > 0 ? TILE_SIZE * 0.58 : 0);
      for (let c = -1; c <= 1; c++) {
        ctx.beginPath();
        ctx.moveTo(baseX + c * 3, baseY);
        ctx.lineTo(baseX + c * 3 - 1.4, baseY + p.dir * 4.5);
        ctx.lineTo(baseX + c * 3 + 1.4, baseY + p.dir * 4.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = pal.body;
    });

    // Cuerpo principal
    ctx.fillStyle = pal.body;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(bodyW * 0.5, -bodyH * 0.6);
    ctx.lineTo(-bodyW * 0.5, -bodyH * 0.5);
    ctx.lineTo(-bodyW * 0.6, 0);
    ctx.lineTo(-bodyW * 0.5, bodyH * 0.5);
    ctx.lineTo(bodyW * 0.5, bodyH * 0.6);
    ctx.lineTo(bodyW * 0.6, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Vientre
    ctx.fillStyle = pal.belly;
    ctx.globalAlpha = 0.55 * bodyAlpha;
    ctx.beginPath();
    ctx.ellipse(0, bodyH * 0.15, bodyW * 0.44, bodyH * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = bodyAlpha;

    // Escamas del cuerpo
    ctx.fillStyle = pal.crest;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 0.8;
    const bodyScales = [
      { x: -bodyW * 0.35, y: -bodyH * 0.3, s: 5 },
      { x: -bodyW * 0.13, y: -bodyH * 0.35, s: 5.5 },
      { x: bodyW * 0.12, y: -bodyH * 0.3, s: 5 },
      { x: bodyW * 0.35, y: -bodyH * 0.2, s: 4.5 },
      { x: -bodyW * 0.32, y: bodyH * 0.17, s: 4.5 },
      { x: -bodyW * 0.05, y: bodyH * 0.24, s: 5 },
      { x: bodyW * 0.22, y: bodyH * 0.17, s: 4.5 },
      { x: -bodyW * 0.2, y: 0, s: 5.5 },
      { x: bodyW * 0.1, y: 0.05, s: 5 },
      { x: bodyW * 0.44, y: 0, s: 4 }
    ];
    bodyScales.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.s * 1.4);
      ctx.lineTo(s.x + s.s * 0.8, s.y);
      ctx.lineTo(s.x, s.y + s.s * 1.4);
      ctx.lineTo(s.x - s.s * 0.8, s.y);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    });

    // Cresta dorsal
    ctx.fillStyle = pal.crest;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 1.1;
    for (let i = 0; i < 8; i++) {
      const sx = -bodyW * 0.35 + i * bodyW * 0.1;
      const scale = 1 - Math.abs(i - 4) * 0.09;
      ctx.beginPath();
      ctx.moveTo(sx - 4.5, -bodyH * 0.48);
      ctx.lineTo(sx, -bodyH * 1.1 * scale);
      ctx.lineTo(sx + 4.5, -bodyH * 0.48);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }

  if (bodyAlpha > 0.5) {
    ctx.globalAlpha = bodyAlpha;
    const headOffset = TILE_SIZE * 1.1;
    const headX = cx + dir.x * headOffset;
    const headY = cy + dir.y * headOffset;
    drawSingleCrocodileHead(headX, headY, angle, pal, isTelegraph, isCharging, time);
    ctx.globalAlpha = 1;
  }

  if (isTelegraph && bodyAlpha > 0.5) {
    ctx.fillStyle = `rgba(255, 90, 60, ${0.95 * bodyAlpha})`;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('¡MORDIDA!', cx, cy - TILE_SIZE * 1.8);
  }

  ctx.restore();
}

function drawSingleCrocodileHead(hx, hy, rotation, pal, isTelegraph, isCharging, time) {
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(rotation);

  const headW = TILE_SIZE * 1.5;
  const headH = TILE_SIZE * 1.0;
  const jawOpen = isTelegraph ? 0.75 + Math.sin(gameTime * 0.04) * 0.25 : isCharging ? 1 : 0.15;

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(headW * 0.12, headH * 0.15, headW * 0.62, headH * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = pal.head;
  ctx.strokeStyle = pal.jaw;
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.ellipse(-headW * 0.1, 0, headW * 0.44, headH * 0.6, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = pal.head;
  ctx.beginPath();
  ctx.moveTo(-headW * 0.05, -headH * 0.45);
  ctx.lineTo(headW * 0.72, -headH * 0.3 - jawOpen * TILE_SIZE * 0.13);
  ctx.lineTo(headW * 0.75, -headH * 0.05);
  ctx.lineTo(-headW * 0.05, -headH * 0.05);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-headW * 0.05, headH * 0.45);
  ctx.lineTo(headW * 0.72, headH * 0.3 + jawOpen * TILE_SIZE * 0.26);
  ctx.lineTo(headW * 0.75, headH * 0.05 + jawOpen * TILE_SIZE * 0.13);
  ctx.lineTo(-headW * 0.05, headH * 0.05);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  if (jawOpen > 0.25) {
    ctx.fillStyle = '#3a0a0a';
    ctx.beginPath();
    ctx.moveTo(headW * 0.02, -headH * 0.08);
    ctx.lineTo(headW * 0.68, -headH * 0.04 - jawOpen * TILE_SIZE * 0.06);
    ctx.lineTo(headW * 0.68, headH * 0.04 + jawOpen * TILE_SIZE * 0.1);
    ctx.lineTo(headW * 0.02, headH * 0.08);
    ctx.closePath();
    ctx.fill();
    if (jawOpen > 0.5) {
      ctx.fillStyle = '#c92222';
      ctx.beginPath();
      ctx.ellipse(headW * 0.4, headH * 0.02, headW * 0.22, headH * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = '#fffbe8';
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.5;
  for (let t = 0; t < 7; t++) {
    const tx = headW * (0.06 + t * 0.09);
    ctx.beginPath();
    ctx.moveTo(tx, -headH * 0.42);
    ctx.lineTo(tx + 1.7, -headH * 0.24);
    ctx.lineTo(tx - 1.7, -headH * 0.24);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    if (jawOpen > 0.2) {
      ctx.beginPath();
      ctx.moveTo(tx, headH * 0.42);
      ctx.lineTo(tx + 1.7, headH * 0.24);
      ctx.lineTo(tx - 1.7, headH * 0.24);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
  }

  ctx.fillStyle = pal.crest;
  ctx.strokeStyle = pal.jaw;
  ctx.lineWidth = 1;
  for (let c = 0; c < 6; c++) {
    const cxp = -headW * 0.2 + c * headW * 0.09;
    const h = TILE_SIZE * (0.28 - Math.abs(c - 2.5) * 0.04);
    ctx.beginPath();
    ctx.moveTo(cxp - 2.5, -headH * 0.5);
    ctx.lineTo(cxp, -headH * 0.5 - h);
    ctx.lineTo(cxp + 2.5, -headH * 0.5);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  for (let side = -1; side <= 1; side += 2) {
    const eyeX = -headW * 0.05;
    const eyeY = side * headH * 0.28;
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = pal.jaw;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, headW * 0.15, headH * 0.15, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = pal.crest;
    ctx.beginPath();
    ctx.moveTo(eyeX - headW * 0.1, eyeY - side * headH * 0.1);
    ctx.lineTo(eyeX, eyeY - side * headH * 0.24);
    ctx.lineTo(eyeX + headW * 0.1, eyeY - side * headH * 0.1);
    ctx.closePath();
    ctx.fill();
    if (!isSlowDevice) { ctx.shadowColor = pal.eye; ctx.shadowBlur = 7; }
    ctx.fillStyle = pal.eye;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, headW * 0.075, headH * 0.085, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isSlowDevice) ctx.shadowBlur = 0;
    ctx.fillStyle = '#0a0505';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, headW * 0.02, headH * 0.065, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = pal.jaw;
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(headW * 0.62, side * headH * 0.09, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawTezcatlipocaHead(rs, guardian, cx, cy, dir, perp, rear) {
  const angle = Math.atan2(dir.y, dir.x);
  const isVulnerable = guardian.vulnerableUntil && gameTime < guardian.vulnerableUntil;
  const time = gameTime * 0.006;

  const FUR = '#d98e2b';
  const FUR_DK = '#a85e14';
  const BELLY = '#f5d09a';
  const SPOT = '#1a0e05';
  const OUTLINE = '#2a1508';
  const EYE_G = '#ffcc33';

  ctx.save();

  const bossPulse = Math.sin(gameTime * 0.005) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(217, 142, 43, ${0.12 + bossPulse * 0.08})`;
  ctx.beginPath();
  ctx.arc(cx, cy, TILE_SIZE * 1.4, 0, Math.PI * 2);
  ctx.fill();

  if (isVulnerable) {
    const pulse = Math.sin(gameTime * 0.012) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 220, 120, ${0.22 + pulse * 0.18})`;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE * 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const L = TILE_SIZE * 2.1;
  const H = TILE_SIZE * 0.6;
  const HEAD_W = TILE_SIZE * 0.85;
  const HEAD_H = TILE_SIZE * 0.72;
  const LEG_W = TILE_SIZE * 0.26;
  const LEG_H = TILE_SIZE * 0.5;

  // Patas
  ctx.fillStyle = FUR_DK;
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.1;
  roundRect(ctx, -L * 0.6, -H * 0.5 - LEG_H * 0.4, LEG_W, LEG_H, 2);
  ctx.fill(); ctx.stroke();
  roundRect(ctx, -L * 0.6, H * 0.5 - LEG_H * 0.6, LEG_W, LEG_H, 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7a4210';
  roundRect(ctx, -L * 0.78, -H * 0.2 - LEG_H * 0.3, LEG_W * 0.85, LEG_H, 2);
  ctx.fill();

  ctx.fillStyle = FUR_DK;
  roundRect(ctx, L * 0.18, -H * 0.5 - LEG_H * 0.4, LEG_W, LEG_H, 2);
  ctx.fill(); ctx.stroke();
  roundRect(ctx, L * 0.18, H * 0.5 - LEG_H * 0.6, LEG_W, LEG_H, 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7a4210';
  roundRect(ctx, L * 0.35, -H * 0.2 - LEG_H * 0.3, LEG_W * 0.85, LEG_H, 2);
  ctx.fill();

  // Cola
  const tailBaseX = -L * 0.5;
  const tailWave = Math.sin(time * 2) * 2.5;
  ctx.strokeStyle = FUR;
  ctx.lineWidth = TILE_SIZE * 0.18;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(tailBaseX, 0);
  ctx.lineTo(tailBaseX - L * 0.2, tailWave * 0.4);
  ctx.lineTo(tailBaseX - L * 0.35, tailWave * -0.5);
  ctx.lineTo(tailBaseX - L * 0.5, tailWave * 1.3);
  ctx.stroke();
  ctx.strokeStyle = SPOT;
  ctx.lineWidth = TILE_SIZE * 0.16;
  ctx.beginPath();
  ctx.moveTo(tailBaseX - L * 0.42, tailWave * 0.7);
  ctx.lineTo(tailBaseX - L * 0.5, tailWave * 1.3);
  ctx.stroke();

  // Cuerpo
  ctx.fillStyle = FUR;
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(L * 0.15, -H * 0.5);
  ctx.lineTo(-L * 0.42, -H * 0.44);
  ctx.lineTo(-L * 0.58, -H * 0.12);
  ctx.lineTo(-L * 0.58, H * 0.12);
  ctx.lineTo(-L * 0.42, H * 0.44);
  ctx.lineTo(L * 0.15, H * 0.5);
  ctx.lineTo(L * 0.3, H * 0.25);
  ctx.lineTo(L * 0.3, -H * 0.25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Vientre
  ctx.fillStyle = BELLY;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(L * 0.08, H * 0.18);
  ctx.lineTo(-L * 0.48, H * 0.18);
  ctx.lineTo(-L * 0.52, H * 0.38);
  ctx.lineTo(L * 0.12, H * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Manchas
  ctx.fillStyle = SPOT;
  const spots = [
    { x: L * 0.02, y: -H * 0.18, s: 3.5 },
    { x: -L * 0.14, y: H * 0.22, s: 3 },
    { x: -L * 0.32, y: -H * 0.24, s: 3.2 },
    { x: -L * 0.46, y: H * 0.1, s: 2.8 },
    { x: L * 0.12, y: H * 0.15, s: 2.5 }
  ];
  spots.forEach(s => {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - s.s);
    ctx.lineTo(s.x + s.s, s.y);
    ctx.lineTo(s.x, s.y + s.s);
    ctx.lineTo(s.x - s.s, s.y);
    ctx.closePath();
    ctx.fill();
  });

  // Orejas
  ctx.fillStyle = FUR;
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.3;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(HEAD_W * 0.18, side * HEAD_H * 0.3);
    ctx.lineTo(HEAD_W * 0.08, side * HEAD_H * 1.15);
    ctx.lineTo(HEAD_W * 0.55, side * HEAD_H * 0.35);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7a2f1a';
    ctx.beginPath();
    ctx.moveTo(HEAD_W * 0.22, side * HEAD_H * 0.4);
    ctx.lineTo(HEAD_W * 0.16, side * HEAD_H * 0.95);
    ctx.lineTo(HEAD_W * 0.48, side * HEAD_H * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = FUR;
  }

  // Cabeza
  ctx.fillStyle = FUR;
  ctx.strokeStyle = OUTLINE;
  ctx.beginPath();
  ctx.moveTo(HEAD_W * 0.18, -HEAD_H * 0.55);
  ctx.lineTo(HEAD_W * 0.82, -HEAD_H * 0.35);
  ctx.lineTo(HEAD_W * 1.05, -HEAD_H * 0.08);
  ctx.lineTo(HEAD_W * 1.05, HEAD_H * 0.08);
  ctx.lineTo(HEAD_W * 0.82, HEAD_H * 0.35);
  ctx.lineTo(HEAD_W * 0.18, HEAD_H * 0.55);
  ctx.lineTo(HEAD_W * 0.05, HEAD_H * 0.25);
  ctx.lineTo(HEAD_W * 0.05, -HEAD_H * 0.25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = BELLY;
  ctx.beginPath();
  ctx.moveTo(HEAD_W * 0.78, -HEAD_H * 0.2);
  ctx.lineTo(HEAD_W * 1.05, 0);
  ctx.lineTo(HEAD_W * 0.78, HEAD_H * 0.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = SPOT;
  ctx.beginPath();
  ctx.moveTo(HEAD_W * 1.0, 0);
  ctx.lineTo(HEAD_W * 0.92, -HEAD_H * 0.1);
  ctx.lineTo(HEAD_W * 0.84, 0);
  ctx.lineTo(HEAD_W * 0.92, HEAD_H * 0.1);
  ctx.closePath();
  ctx.fill();

  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(HEAD_W * 0.3, side * HEAD_H * 0.28);
    ctx.lineTo(HEAD_W * 0.37, side * HEAD_H * 0.16);
    ctx.lineTo(HEAD_W * 0.3, side * HEAD_H * 0.04);
    ctx.lineTo(HEAD_W * 0.23, side * HEAD_H * 0.16);
    ctx.closePath();
    ctx.fill();
  }

  for (const side of [-1, 1]) {
    const ex = HEAD_W * 0.46;
    const ey = side * HEAD_H * 0.2;
    ctx.fillStyle = '#fff4d0';
    ctx.beginPath();
    ctx.moveTo(ex + 5, ey);
    ctx.lineTo(ex, ey - 4);
    ctx.lineTo(ex - 5, ey);
    ctx.lineTo(ex, ey + 4);
    ctx.closePath();
    ctx.fill();
    if (isVulnerable && !isSlowDevice) { ctx.shadowColor = EYE_G; ctx.shadowBlur = 6; }
    ctx.fillStyle = EYE_G;
    ctx.beginPath();
    ctx.moveTo(ex + 3, ey);
    ctx.lineTo(ex, ey - 3);
    ctx.lineTo(ex - 3, ey);
    ctx.lineTo(ex, ey + 3);
    ctx.closePath();
    ctx.fill();
    if (!isSlowDevice) ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(ex - 0.6, ey - 2.5, 1.2, 5);
  }

  ctx.strokeStyle = 'rgba(20, 14, 5, 0.85)';
  ctx.lineWidth = 0.7;
  for (const side of [-1, 1]) {
    for (let w = 0; w < 3; w++) {
      ctx.beginPath();
      ctx.moveTo(HEAD_W * 0.88, side * HEAD_H * 0.08 + w * 1.3);
      ctx.lineTo(HEAD_W * 1.15, side * HEAD_H * 0.18 + w * 2.2);
      ctx.stroke();
    }
  }

  ctx.fillStyle = '#fffbe8';
  ctx.beginPath();
  ctx.moveTo(HEAD_W * 0.85, HEAD_H * 0.1);
  ctx.lineTo(HEAD_W * 0.92, HEAD_H * 0.24);
  ctx.lineTo(HEAD_W * 0.78, HEAD_H * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(HEAD_W * 0.85, -HEAD_H * 0.1);
  ctx.lineTo(HEAD_W * 0.92, -HEAD_H * 0.24);
  ctx.lineTo(HEAD_W * 0.78, -HEAD_H * 0.18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

function drawGuardianHead(rs, guardian) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const dir = guardian.direction || { x: 1, y: 0 };
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.35, y: cy - dir.y * TILE_SIZE * 0.35 };

  if (guardian.traits.isTezcatlipoca) { drawTezcatlipocaHead(rs, guardian, cx, cy, dir, perp, rear); return; }
  if (guardian.traits.isCipactli) { drawCipactliHead(rs, guardian, cx, cy, dir, perp, rear); return; }

  const pal = guardian.palette;
  const type = guardian.behavior.id;
  const angle = Math.atan2(dir.y, dir.x);
  const headSize = TILE_SIZE * 0.82;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  if (!isSlowDevice) {
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
  }

  if (type === 'hunter') {
    ctx.fillStyle = pal.head;
    ctx.beginPath();
    ctx.ellipse(0, 0, headSize * 0.48, headSize * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isSlowDevice) ctx.shadowBlur = 0;
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.ellipse(0, -headSize * 0.05, headSize * 0.42, headSize * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.crest;
    ctx.beginPath();
    ctx.moveTo(-headSize * 0.14, -headSize * 0.48);
    ctx.lineTo(0, -headSize * 0.88);
    ctx.lineTo(headSize * 0.14, -headSize * 0.48);
    ctx.closePath();
    ctx.fill();
    for (let side = -1; side <= 1; side += 2) {
      ctx.fillStyle = pal.crest;
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.38, -headSize * 0.22);
      ctx.quadraticCurveTo(side * headSize * 0.75, -headSize * 0.6, side * headSize * 0.62, -headSize * 0.78);
      ctx.quadraticCurveTo(side * headSize * 0.58, -headSize * 0.42, side * headSize * 0.48, -headSize * 0.12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#2a0505';
    ctx.beginPath();
    ctx.ellipse(headSize * 0.12, headSize * 0.3, headSize * 0.26, headSize * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff8dc';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(headSize * (0.08 + i * 0.12), headSize * 0.2);
      ctx.lineTo(headSize * (0.12 + i * 0.12), headSize * 0.34);
      ctx.lineTo(headSize * (0.04 + i * 0.12), headSize * 0.34);
      ctx.closePath();
      ctx.fill();
    }
    for (let side = -1; side <= 1; side += 2) {
      ctx.fillStyle = '#0a0303';
      ctx.beginPath();
      ctx.ellipse(side * headSize * 0.2, -headSize * 0.04, headSize * 0.12, headSize * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      if (!isSlowDevice) { ctx.shadowColor = pal.eye; ctx.shadowBlur = 8; }
      ctx.fillStyle = pal.eye;
      ctx.beginPath();
      ctx.arc(side * headSize * 0.2, -headSize * 0.02, headSize * 0.05, 0, Math.PI * 2);
      ctx.fill();
      if (!isSlowDevice) ctx.shadowBlur = 0;
    }
  } else if (type === 'interceptor') {
    ctx.fillStyle = pal.head;
    ctx.beginPath();
    ctx.ellipse(0, 0, headSize * 0.4, headSize * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isSlowDevice) ctx.shadowBlur = 0;
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.ellipse(0, -headSize * 0.42, headSize * 0.48, headSize * 0.24, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#0a0420';
    ctx.beginPath();
    ctx.ellipse(0, -headSize * 0.12, headSize * 0.1, headSize * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isSlowDevice) { ctx.shadowColor = '#f0e0ff'; ctx.shadowBlur = 10; }
    ctx.fillStyle = '#f0e0ff';
    ctx.beginPath();
    ctx.arc(0, -headSize * 0.12, headSize * 0.055, 0, Math.PI * 2);
    ctx.fill();
    if (!isSlowDevice) ctx.shadowBlur = 0;
    for (let side = -1; side <= 1; side += 2) {
      ctx.fillStyle = '#0a0420';
      ctx.beginPath();
      ctx.ellipse(side * headSize * 0.2, headSize * 0.12, headSize * 0.08, headSize * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.eye;
      ctx.beginPath();
      ctx.arc(side * headSize * 0.2, headSize * 0.14, headSize * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = pal.crest;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * headSize * 0.12, headSize * 0.42);
      ctx.lineTo(i * headSize * 0.15, headSize * 0.68);
      ctx.lineTo(i * headSize * 0.09, headSize * 0.58);
      ctx.closePath();
      ctx.fill();
    }
  } else if (type === 'flanker') {
    ctx.fillStyle = pal.head;
    ctx.beginPath();
    ctx.ellipse(0, 0, headSize * 0.48, headSize * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!isSlowDevice) ctx.shadowBlur = 0;
    for (let side = -1; side <= 1; side += 2) {
      ctx.fillStyle = pal.head;
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.24, -headSize * 0.28);
      ctx.lineTo(side * headSize * 0.54, -headSize * 0.95);
      ctx.lineTo(side * headSize * 0.42, -headSize * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = pal.body;
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.3, -headSize * 0.3);
      ctx.lineTo(side * headSize * 0.44, -headSize * 0.72);
      ctx.lineTo(side * headSize * 0.4, -headSize * 0.3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.ellipse(0, headSize * 0.2, headSize * 0.26, headSize * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff8dc';
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.12, headSize * 0.28);
      ctx.lineTo(side * headSize * 0.08, headSize * 0.48);
      ctx.lineTo(side * headSize * 0.16, headSize * 0.4);
      ctx.closePath();
      ctx.fill();
    }
    for (let side = -1; side <= 1; side += 2) {
      ctx.fillStyle = '#2a0505';
      ctx.beginPath();
      ctx.arc(side * headSize * 0.2, -headSize * 0.05, headSize * 0.08, 0, Math.PI * 2);
      ctx.fill();
      if (!isSlowDevice) { ctx.shadowColor = pal.eye; ctx.shadowBlur = 6; }
      ctx.fillStyle = pal.eye;
      ctx.beginPath();
      ctx.arc(side * headSize * 0.2, -headSize * 0.05, headSize * 0.04, 0, Math.PI * 2);
      ctx.fill();
      if (!isSlowDevice) ctx.shadowBlur = 0;
    }
  }

  ctx.restore();
}

// ========================================================
// 27. DIBUJO DE COMIDA — maíz detallado (diseño original)
// ========================================================
function drawFoodOffering(food, cx, cy, pulse) {
  const isMaize = food.offering === 'maize';
  const isCacao = food.offering === 'cacao';
  const r = Math.max(5, TILE_SIZE / 2 - 3 + pulse * 0.3);
  ctx.save();
  if (isMaize) {
    const MZ_DARK   = '#e0b400';
    const MZ_MID    = '#ffe44a';
    const MZ_LIGHT  = '#fff070';
    const MZ_HI     = '#fffbc8';
    const LF_DARK   = '#1e6b28';
    const LF_MID    = '#4fbf4f';
    const LF_LIGHT  = '#8ce870';

    const cobW = r * 1.2;
    const cobH = r * 2.1;
    const topY = cy - r * 1.0;
    const botY = cy + r * 1.05;

    if (sacredRainUntil > gameTime) {
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4);
      glowGrad.addColorStop(0, 'rgba(255, 240, 120, 0.12)');
      glowGrad.addColorStop(1, 'rgba(255, 240, 120, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = LF_MID;
    ctx.strokeStyle = LF_DARK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.18, botY - r * 0.05);
    ctx.quadraticCurveTo(cx - r * 1.25, botY - r * 0.2, cx - r * 1.1, botY - r * 0.85);
    ctx.quadraticCurveTo(cx - r * 0.8, botY - r * 0.6, cx - r * 0.18, botY - r * 0.05);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.18, botY - r * 0.05);
    ctx.quadraticCurveTo(cx + r * 1.25, botY - r * 0.2, cx + r * 1.1, botY - r * 0.85);
    ctx.quadraticCurveTo(cx + r * 0.8, botY - r * 0.6, cx + r * 0.18, botY - r * 0.05);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = 'rgba(60, 30, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx + 0.8, cy + r * 0.06, cobW * 0.5, cobH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const cobGrad = ctx.createLinearGradient(cx - cobW * 0.5, cy, cx + cobW * 0.5, cy);
    cobGrad.addColorStop(0,   MZ_DARK);
    cobGrad.addColorStop(0.2, MZ_MID);
    cobGrad.addColorStop(0.55, MZ_LIGHT);
    cobGrad.addColorStop(0.85, MZ_MID);
    cobGrad.addColorStop(1,   MZ_DARK);
    ctx.fillStyle = cobGrad;
    ctx.strokeStyle = MZ_DARK;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cobW * 0.5, cobH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, cobW * 0.5 - 1, cobH * 0.5 - 1, 0, 0, Math.PI * 2);
    ctx.clip();
    const gW = r * 0.28;
    const gH = r * 0.30;
    const cols = 4;
    const rows = 8;
    const startX = cx - ((cols - 1) * gW) / 2;
    const startY = cy - (rows * gH) / 2 + r * 0.08;
    for (let row = 0; row < rows; row++) {
      const offsetX = (row % 2) * gW * 0.5;
      for (let col = 0; col < cols; col++) {
        const gx = startX + col * gW + offsetX;
        const gy = startY + row * gH;
        ctx.fillStyle = MZ_DARK;
        ctx.beginPath();
        ctx.ellipse(gx, gy + 0.5, gW * 0.42, gH * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        const grainGrad = ctx.createRadialGradient(gx - gW * 0.1, gy - gH * 0.15, gW * 0.03, gx, gy, gW * 0.45);
        grainGrad.addColorStop(0, MZ_HI);
        grainGrad.addColorStop(0.5, MZ_LIGHT);
        grainGrad.addColorStop(1, MZ_MID);
        ctx.fillStyle = grainGrad;
        ctx.beginPath();
        ctx.ellipse(gx, gy, gW * 0.42, gH * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(90, 55, 10, 0.55)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    ctx.restore();

    ctx.fillStyle = LF_LIGHT;
    ctx.strokeStyle = LF_DARK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.48, botY - r * 0.45);
    ctx.quadraticCurveTo(cx - r * 0.6, botY + r * 0.18, cx, botY + r * 0.32);
    ctx.quadraticCurveTo(cx + r * 0.6, botY + r * 0.18, cx + r * 0.48, botY - r * 0.45);
    ctx.quadraticCurveTo(cx + r * 0.22, botY - r * 0.18, cx, botY - r * 0.12);
    ctx.quadraticCurveTo(cx - r * 0.22, botY - r * 0.18, cx - r * 0.48, botY - r * 0.45);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = LF_DARK;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.48, botY - r * 0.45);
    ctx.quadraticCurveTo(cx, botY - r * 0.05, cx + r * 0.48, botY - r * 0.45);
    ctx.stroke();

    ctx.strokeStyle = '#c89830';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * r * 0.12, topY + r * 0.05);
      ctx.quadraticCurveTo(cx + i * r * 0.22, topY - r * 0.18, cx + i * r * 0.3, topY - r * 0.32);
      ctx.stroke();
    }
  } else if (isCacao) {
    ctx.fillStyle = '#8b5a2b';
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.55, r * 0.9, 0.3, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#5a3a1b';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.4, cy + i * r * 0.28);
      ctx.lineTo(cx + r * 0.4, cy + i * r * 0.28);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#4fcea2';
    ctx.strokeStyle = '#b0f4d8';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d5bd70';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawCipactliPortal(cx, cy, radius, alpha, isOpening) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  bgGrad.addColorStop(0, 'rgba(20, 60, 90, 0.95)');
  bgGrad.addColorStop(0.6, 'rgba(58, 168, 212, 0.85)');
  bgGrad.addColorStop(1, 'rgba(26, 94, 138, 0)');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  const waves = 3;
  for (let w = 0; w < waves; w++) {
    const t = ((gameTime * 0.001 + w / waves) % 1);
    const waveR = radius * (0.3 + t * 0.7);
    const waveAlpha = (1 - t) * alpha * 0.7;
    ctx.strokeStyle = `rgba(179, 229, 255, ${waveAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(110, 203, 255, ${alpha * 0.9})`;
  ctx.lineWidth = 2.5;
  if (!isSlowDevice) {
    ctx.shadowColor = '#6ecbff';
    ctx.shadowBlur = 12;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.stroke();
  if (!isSlowDevice) ctx.shadowBlur = 0;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(gameTime * (isOpening ? 0.004 : 0.002));
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  for (let arm = 0; arm < 2; arm++) {
    ctx.beginPath();
    for (let t = 0; t < 12; t++) {
      const tt = t / 11;
      const angle = arm * Math.PI + tt * Math.PI * 1.3;
      const r = radius * (0.1 + tt * 0.55);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

// ========================================================
// 28. DRAW PRINCIPAL (con visual de agua nuevo y dibujos originales)
// ========================================================
function draw(interpolation = 1, updateEffects = false) {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (boardCanvas && boardCanvas.width > 0) {
    ctx.drawImage(boardCanvas, 0, 0, screenW, screenH);
  } else {
    const theme = BOARD_THEMES[progression.selectedTheme || 'classic'] || BOARD_THEMES.classic;
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, screenW, screenH);
  }
  ctx.save();
  if (screenShake > 0.3 && !reduceMotion) {
    const dx = (Math.random() - 0.5) * screenShake;
    const dy = (Math.random() - 0.5) * screenShake;
    ctx.translate(dx, dy);
  }
  ctx.beginPath();
  ctx.rect(-10, -10, screenW + 20, screenH + 20);
  ctx.clip();
  const pulse = Math.sin(gameTime * 0.006) * 1.5;

  // ===== NUEVO VISUAL DEL AGUA: CHARCOS CIRCULARES =====
  if (floodWaterCells.length > 0) {
    ctx.save();
    floodWaterCells.forEach(cell => {
      const x = cell.x * TILE_SIZE;
      const y = cell.y * TILE_SIZE;
      const age = gameTime - cell.bornAt;
      const remaining = cell.expiresAt - gameTime;
      const warning = remaining < FLOOD_CELL_WARNING_MS;
      let alpha = 0.85;
      if (age < 400) alpha = 0.85 * (age / 400);
      else if (warning) alpha = 0.85 * (remaining / FLOOD_CELL_WARNING_MS);
      alpha = Math.max(0.2, Math.min(0.9, alpha));
      const cx = x + TILE_SIZE / 2;
      const cy = y + TILE_SIZE / 2;
      const r = TILE_SIZE * 0.62;
      const grad = ctx.createRadialGradient(cx, cy, TILE_SIZE * 0.15, cx, cy, r);
      grad.addColorStop(0, `rgba(110, 203, 255, ${alpha})`);
      grad.addColorStop(0.6, `rgba(58, 168, 212, ${alpha * 0.9})`);
      grad.addColorStop(1, `rgba(20, 60, 90, ${alpha * 0.85})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      const waveR = r * (0.7 + Math.sin(gameTime * 0.006 + cell.x + cell.y) * 0.08);
      ctx.strokeStyle = `rgba(179, 229, 255, ${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
      ctx.stroke();
      if (warning) {
        ctx.strokeStyle = `rgba(255, 220, 120, ${alpha * 0.9})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  drawHuntTrail();
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
    }
    drawFoodOffering(food, cx, cy, pulse);
  });
  bonusFoods.forEach(bf => {
    const cx = bf.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = bf.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.fillStyle = bf.isBossDrop ? '#ffb347' : '#f0cf70';
    ctx.beginPath();
    const radius = Math.max(4, TILE_SIZE / 2 - 2 + pulse * 0.45);
    for (let p = 0; p < 16; p++) {
      const a = -Math.PI / 2 + p * Math.PI / 8;
      const r = radius * (p % 2 === 0 ? 1 : 0.58);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (p === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
  });
  shieldFoods.forEach(sf => {
    const cx = sf.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = sf.y * TILE_SIZE + TILE_SIZE / 2;
    const t = TILE_SIZE / 2;
    const JD_DARK   = '#0d4a38';
    const JD_MID    = '#1a7a5e';
    const JD_LIGHT  = '#4ec9a0';
    const JD_HI     = '#8ae0c0';
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(1.2, -t * 0.85);
    ctx.lineTo(t * 0.72 + 1.2, 1.2);
    ctx.lineTo(1.2, t * 0.85);
    ctx.lineTo(-t * 0.72 + 1.2, 1.2);
    ctx.closePath();
    ctx.fill();
    const outerSize = t * 0.95;
    ctx.fillStyle = JD_MID;
    ctx.strokeStyle = JD_DARK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -outerSize);
    ctx.lineTo(outerSize * 0.72, 0);
    ctx.lineTo(0, outerSize);
    ctx.lineTo(-outerSize * 0.72, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = JD_HI;
    ctx.beginPath();
    ctx.moveTo(0, -outerSize);
    ctx.lineTo(outerSize * 0.72, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = JD_MID;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-outerSize * 0.72, 0);
    ctx.lineTo(0, outerSize);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = JD_DARK;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(outerSize * 0.72, 0);
    ctx.lineTo(0, outerSize);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = JD_LIGHT;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -outerSize);
    ctx.lineTo(outerSize * 0.72, 0);
    ctx.lineTo(0, outerSize);
    ctx.lineTo(-outerSize * 0.72, 0);
    ctx.closePath();
    ctx.stroke();
    const innerSize = outerSize * 0.32;
    ctx.fillStyle = '#f0fff8';
    ctx.beginPath();
    ctx.moveTo(0, -innerSize);
    ctx.lineTo(innerSize * 0.7, 0);
    ctx.lineTo(0, innerSize);
    ctx.lineTo(-innerSize * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  airFoods.forEach(af => {
    const cx = af.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = af.y * TILE_SIZE + TILE_SIZE / 2;
    const r = Math.max(6, TILE_SIZE / 2);
    const AR_MID   = '#3a8ac0';
    const AR_HI    = '#ffffff';
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(30, 60, 90, 0.5)';
    ctx.strokeStyle = AR_MID;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const wave = Math.sin(gameTime * 0.005) * r * 0.1;
    ctx.strokeStyle = AR_HI;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < 3; i++) {
      const offsetY = (i - 1) * r * 0.38 + wave * (i - 1);
      const len = r * (0.7 - Math.abs(i - 1) * 0.15);
      ctx.globalAlpha = 1 - Math.abs(i - 1) * 0.15;
      ctx.beginPath();
      ctx.moveTo(-len, offsetY);
      ctx.bezierCurveTo(-len * 0.3, offsetY - r * 0.15, len * 0.3, offsetY + r * 0.15, len, offsetY);
      ctx.stroke();
      const tipX = len + 1;
      const tipY = offsetY;
      ctx.beginPath();
      ctx.moveTo(tipX - r * 0.22, tipY - r * 0.18);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(tipX - r * 0.22, tipY + r * 0.18);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  });
  sacrificeFoods.forEach(o => {
    const cx = o.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = o.y * TILE_SIZE + TILE_SIZE / 2;
    const beat = Math.sin(gameTime * 0.01) * 0.5 + 0.5;
    const ringR = TILE_SIZE * 0.52 + beat * 1.5;
    ctx.save();
    ctx.strokeStyle = '#8b1e1e'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2); ctx.stroke();
    ctx.font = `${TILE_SIZE * 0.78}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🫀', cx, cy + 1);
    ctx.restore();
  });
  skullFoods.forEach(s => {
    const cx = s.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = s.y * TILE_SIZE + TILE_SIZE / 2;
    const r = TILE_SIZE * 0.44 + Math.sin(gameTime * 0.008) * 1.2;
    ctx.save();
    ctx.fillStyle = 'rgba(48, 19, 29, 0.94)';
    ctx.strokeStyle = '#ef5261';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.font = `${TILE_SIZE * 0.8}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('☠️', cx, cy + 1);
    ctx.restore();
  });
  cosmicOrderFoods.forEach(co => {
    const cx = co.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = co.y * TILE_SIZE + TILE_SIZE / 2;
    const r = Math.max(7, TILE_SIZE / 2);
    const SL_DARK  = '#0a1a1f';
    const SL_MID   = '#1e4a55';
    const SL_GOLD  = '#d5bd70';
    const SL_LIGHT = '#fff0b0';
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath(); ctx.arc(1, 1.2, r * 0.92, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = SL_MID;
    ctx.strokeStyle = SL_DARK;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = SL_GOLD;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2); ctx.stroke();
    ctx.save();
    ctx.rotate(gameTime * 0.001);
    ctx.strokeStyle = SL_LIGHT;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    for (let arm = 0; arm < 2; arm++) {
      const baseAngle = arm * Math.PI;
      ctx.beginPath();
      for (let t = 0; t < 16; t++) {
        const tt = t / 15;
        const angle = baseAngle + tt * Math.PI * 1.15;
        const radius = r * (0.18 + tt * 0.5);
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = SL_GOLD;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = SL_DARK;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = SL_LIGHT;
    ctx.beginPath(); ctx.arc(-r * 0.05, -r * 0.05, r * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });

  enemyGuardians.forEach(guardian => {
    const hitAt = guardian.cosmicOrderHitAt;

    guardian.segments.forEach((seg, idx) => {
      if (idx === 0) return;
      const previousSegments = previousGuardianPositions.get(guardian.id);
      let progress = guardian.lastMoveTick === guardian.tickCounter ? interpolation : 1;
      const renderSegment = interpolateGridPosition(seg, previousSegments?.[idx] || previousSegments?.[previousSegments.length - 1], progress);
      const fillColor = hitAt !== undefined && Math.floor((gameTime - hitAt) / 100) % 2 === 0
        ? '#f5e5ad'
        : guardian.palette.body;
      const tailFactor = 1 - (idx / guardian.segments.length) * 0.5;
      const segSize = TILE_SIZE * tailFactor;
      ctx.fillStyle = fillColor;
      roundRect(ctx, renderSegment.x * TILE_SIZE + (TILE_SIZE - segSize) / 2, renderSegment.y * TILE_SIZE + (TILE_SIZE - segSize) / 2, segSize, segSize, 4);
      ctx.fill();
      if (!isSlowDevice || idx % 2 === 0) drawFeatherScale(renderSegment, idx, guardian);
    });

    const headSeg = guardian.segments[0];
    const prevHead = previousGuardianPositions.get(guardian.id)?.[0] || headSeg;
    const renderHead = interpolateGridPosition(headSeg, prevHead, interpolation);
    const headFillColor = hitAt !== undefined && Math.floor((gameTime - hitAt) / 100) % 2 === 0
      ? '#f5e5ad'
      : guardian.palette.head;
    ctx.fillStyle = headFillColor;
    roundRect(ctx, renderHead.x * TILE_SIZE + 1, renderHead.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill();
    drawGuardianHead(renderHead, guardian);

    if (guardiansFrozenUntil > gameTime) {
      ctx.save();
      guardian.segments.forEach(segment => {
        ctx.fillStyle = 'rgba(117, 218, 255, 0.22)';
        ctx.strokeStyle = 'rgba(225, 249, 255, 0.65)';
        ctx.lineWidth = 1;
        roundRect(ctx, segment.x * TILE_SIZE + 2, segment.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4, 5);
        ctx.fill(); ctx.stroke();
      });
      ctx.restore();
    }
  });

  if (updateEffects) blinkCounter++;
  const isBlinking = (blinkCounter % 90) > 85;
  const playerProtected = hasGuardianProtection();
  const isGolden = isImmune || isFuria || guardiansFrozenUntil > gameTime;
  if (playerProtected && snake.length > 0) {
    const headRS = interpolateGridPosition(snake[0], previousSnakePositions[0], interpolation);
    const hx = headRS.x * TILE_SIZE + TILE_SIZE / 2;
    const hy = headRS.y * TILE_SIZE + TILE_SIZE / 2;
    const auraR = TILE_SIZE * 1.0;
    const aura = ctx.createRadialGradient(hx, hy, TILE_SIZE * 0.4, hx, hy, auraR);
    aura.addColorStop(0, 'rgba(125, 232, 196, 0.22)');
    aura.addColorStop(1, 'rgba(125, 232, 196, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.arc(hx, hy, auraR, 0, Math.PI * 2); ctx.fill();
  }
  if (isFuria && snake.length > 0) {
    const headRS = interpolateGridPosition(snake[0], previousSnakePositions[0], interpolation);
    drawFuriaAura(headRS.x * TILE_SIZE + TILE_SIZE / 2, headRS.y * TILE_SIZE + TILE_SIZE / 2);
  }
  const skin = getActiveSkin();
  const KUKULKAN_BODY = isGolden ? '#9c8a4a' : skin.body;
  const KUKULKAN_BORDER = isGolden ? '#d4c488' : skin.border;
  snake.forEach((seg, idx) => {
    const isHead = idx === 0;
    const rs = interpolateGridPosition(seg, previousSnakePositions[idx] || previousSnakePositions[previousSnakePositions.length - 1], interpolation);
    if (!isHead) {
      ctx.fillStyle = KUKULKAN_BODY;
      roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 5);
      ctx.fill();
      ctx.strokeStyle = KUKULKAN_BORDER;
      ctx.lineWidth = isGolden ? 1.2 : 1;
      roundRect(ctx, rs.x * TILE_SIZE + 1.5, rs.y * TILE_SIZE + 1.5, TILE_SIZE - 3, TILE_SIZE - 3, 5);
      ctx.stroke();
      drawBodyDiamond(rs, idx, isGolden);
    } else {
      drawKukulkanHead(rs, direction, playerProtected, isBlinking);
    }
  });
  if (snake.length > 0) {
    const headRS = interpolateGridPosition(snake[0], previousSnakePositions[0], interpolation);
    drawKukulkanPlume(headRS, direction, playerProtected);
  }
  drawFireBreath();
  updateAndDrawParticles(updateEffects);
  if (isGameRunning) drawVignette();
  drawDarkness();
  drawEclipseTint();
  ctx.restore();
  if (updateEffects && screenShake > 0.3) {
    screenShake *= 0.82;
    if (screenShake < 0.3) screenShake = 0;
  }
}

// ========================================================
// 29. START / PAUSE / GAME OVER
// ========================================================
function startGame() {
  getAudioContext();
  stopGameLoop();
  cancelCountdown();
  stopMusic();
  if (runStartedAt !== null) {
    try { finishRunStatistics(); } catch (e) { console.warn('[Kukulcán] finishRunStatistics:', e); }
  }
  isPaused = false;
  isGameRunning = false;
  simulationAccumulator = 0;
  renderInterpolation = 1;
  lastFrameTimestamp = null;
  frameTimeEMA = 16.7;
  isSlowDevice = false;
  resetDailyState();
  if (gameModeSelect.value === 'daily' && dailyChallenge && dailyChallenge.rule) {
    dailyChallenge.rule.apply();
    dailyState.activeRule = dailyChallenge.rule;
  }
  resetGame();
  gameTime = 0;
  applyGameModeRules();
  if (dailyState.extraLives > 0) {
    maxLives += dailyState.extraLives;
    lives = maxLives;
    updateLivesUI();
  }
  isGameRunning = true;
  isPaused = false;
  runStartedAt = gameTime;
  runDifficulty = getEffectiveDifficulty();
  runMode = gameModeSelect.value;
  runGuardiansDefeated = 0;
  runCipactliDefeated = 0;
  runTezcatlipocaDefeated = 0;
  runMaizeEaten = 0;
  runLivesLost = 0;
  runStartForCampaign = gameTime;
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  startCountdown();
  updateFuriaUI();
  updatePauseButtonUI();
  if (dtStartBtn) dtStartBtn.textContent = '🔄 Reiniciar';
  [tutorialModal, introTutorialModal, settingsModal, gameOverlay, loreModal, customizeModal, statisticsModal, objectivesModal, campaignModal].forEach(m => { if (m) m.classList.add('hidden'); });
  stopWelcomeDemo();
  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  document.body.classList.remove('welcome-open', 'tutorial-open', 'gameover-open');
  updateLivesUI();
  startMusic();
  startGameLoop();
}

function pauseForModal() {
  if (!isGameRunning || isPaused) return;
  isPaused = true;
  stopMusic();
  stopGameLoop();
  stopWelcomeDemo();
  updateFuriaUI();
  updatePauseButtonUI();
  draw(renderInterpolation, false);
}

function togglePause() {
  if (!isGameRunning) return;
  if (!isPaused) {
    isPaused = true;
    stopMusic();
    stopGameLoop();
    updateFuriaUI();
    if (pauseOverlay) pauseOverlay.classList.remove('hidden');
    draw(renderInterpolation, false);
  } else {
    isPaused = false;
    lastFrameTimestamp = null;
    simulationAccumulator = 0;
    if (pauseOverlay) pauseOverlay.classList.add('hidden');
    startMusic();
    startGameLoop();
    updateFuriaUI();
  }
  updatePauseButtonUI();
}

function updatePauseButtonUI() {
  const icon = isPaused ? '▶️' : '⏸️';
  const label = isPaused ? 'Reanudar' : 'Pausar';
  if (dtPauseBtn) {
    dtPauseBtn.textContent = icon;
    dtPauseBtn.setAttribute('aria-label', label);
    dtPauseBtn.classList.toggle('paused-active', isPaused);
  }
  if (mbPauseBtn) {
    mbPauseBtn.textContent = icon;
    mbPauseBtn.setAttribute('aria-label', label);
    mbPauseBtn.classList.toggle('paused-active', isPaused);
  }
}

function exitToMenu() {
  if (runStartedAt !== null) {
    try { finishRunStatistics(); } catch (e) { console.warn('[Kukulcán] finishRunStatistics:', e); }
  }
  isGameRunning = false;
  isPaused = false;
  stopGameLoop();
  stopMusic();
  cancelCountdown();
  resetDailyState();
  [pauseOverlay, gameOverlay, settingsModal, tutorialModal, objectivesModal, statisticsModal, customizeModal, loreModal, introTutorialModal, campaignModal].forEach(m => { if (m) m.classList.add('hidden'); });
  if (welcomeScreen) welcomeScreen.classList.remove('hidden');
  document.body.classList.add('welcome-open');
  document.body.classList.remove('gameover-open', 'tutorial-open');
  if (dtStartBtn) dtStartBtn.textContent = '▶ Iniciar';
  if (welcomeStartBtn) welcomeStartBtn.classList.remove('hidden');
  resetGame();
  gameTime = 0;
  applyGameModeRules();
  updatePauseButtonUI();
  updateScoresUI();
  updateLivesUI();
  draw(1, false);
  resetWelcomeDemo();
  startWelcomeDemo();
}

function gameOver(reason = 'Has chocado con tu propio cuerpo.', causeEmoji) {
  if (!isGameRunning && gameOverlay && !gameOverlay.classList.contains('hidden')) return;
  const runModeSnapshot = runMode;
  finishRunStatistics();
  const coinsEarned = Math.floor(score / 10);
  isGameRunning = false;
  isPaused = false;
  stopGameLoop();
  cancelCountdown();
  clearFireBreath();
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0; furiaCooldownUntilReal = 0;
  BadgeManager.resetAll();
  airBoostUntil = 0;
  updateFuriaUI();
  updatePauseButtonUI();
  enemySpawnAt = null; jadeSpawnAt = null; freezeSpawnAt = null;
  guardiansFrozenUntil = 0; freezeFoods = []; airFoods = [];
  sacredRainUntil = 0; nextSacredRainAt = null;
  nextCosmicOrderSpawnAt = null; cosmicOrderResolveAt = null; cosmicOrderFlashStartedAt = null;
  cosmicOrderFoods = []; sacrificeFoods = []; skullFoods = [];
  nextSkullMoveAt = null; nextSacrificeSpawnAt = null; nextSkullSpawnAt = null;
  respawnProtectedUntil = 0;
  enemyGuardians = []; particles = []; damageRings = [];
  nextCipactliSpawnAt = null;
  deactivateImmunity();
  isOnFire = false;
  eclipseActive = false;
  huntTrail = [];
  stopMusic();
  playGameOverSound();
  vibrate([80, 50, 80, 50, 150]);
  const survivalMs = runStartedAt !== null ? (gameTime - runStartedAt) : 0;
  if (overlayReason) overlayReason.textContent = reason;
  if (finalScoreElement) finalScoreElement.textContent = score;
  if (finalLengthElement) finalLengthElement.textContent = snake.length;
  if (finalCoinsElement) finalCoinsElement.textContent = coinsEarned;
  if (finalTimeElement) finalTimeElement.textContent = formatDuration(survivalMs);
  if (finalCauseLine) {
    if (causeEmoji) {
      finalCauseLine.textContent = causeEmoji;
      finalCauseLine.classList.remove('hidden');
    } else {
      finalCauseLine.textContent = '';
    }
  }
  const prevBest = progression.bestScoreByMode[runModeSnapshot] || 0;
  if (recordBadge) {
    if (score > prevBest && score > 0) {
      recordBadge.classList.remove('hidden');
    } else {
      recordBadge.classList.add('hidden');
    }
  }
  
  const isCampaignMode = (gameModeSelect.value === 'campaign');
  const overlayTitle = document.getElementById('overlay-title');
  
  if (isCampaignMode && campaignWon) {
    const hasNextLevel = campaignLevel < CAMPAIGN_LEVELS.length;
    if (overlayTitle) {
      overlayTitle.textContent = hasNextLevel ? '📖 ¡Capítulo completado!' : '🏆 ¡Travesía completada!';
    }
    if (campaignNextBtn) {
      if (hasNextLevel) {
        campaignNextBtn.classList.remove('hidden');
        campaignNextBtn.onclick = () => {
          const nextLevel = campaignLevel + 1;
          const nextLvl = CAMPAIGN_LEVELS.find(l => l.id === nextLevel);
          const unlocked = nextLvl && (
            progression.campaignCompleted.includes(campaignLevel) ||
            progression.campaignCompleted.some(id => id > nextLevel)
          );
          if (!unlocked) {
            gameOverlay.classList.add('hidden');
            document.body.classList.remove('gameover-open');
            exitToMenu();
            return;
          }
          campaignLevel = nextLevel;
          gameOverlay.classList.add('hidden');
          document.body.classList.remove('gameover-open');
          startGame();
        };
      } else {
        campaignNextBtn.classList.add('hidden');
      }
    }
    if (restartOverlayBtn) {
      restartOverlayBtn.textContent = hasNextLevel ? '🔄 Repetir capítulo' : '🏠 Volver al menú';
      if (!hasNextLevel) {
        restartOverlayBtn.onclick = (e) => {
          e.preventDefault(); e.stopPropagation();
          exitToMenu();
        };
      } else {
        restartOverlayBtn.onclick = (e) => {
          e.preventDefault(); e.stopPropagation();
          setTimeout(() => startGame(), 0);
        };
      }
    }
  } else {
    if (overlayTitle) overlayTitle.textContent = 'La travesía termina';
    if (campaignNextBtn) campaignNextBtn.classList.add('hidden');
    if (restartOverlayBtn) {
      restartOverlayBtn.textContent = '🔄 Jugar de nuevo';
      restartOverlayBtn.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        setTimeout(() => startGame(), 0);
      };
    }
  }
  
  if (gameOverlay) gameOverlay.classList.remove('hidden');
  document.body.classList.add('gameover-open');
  if (dtStartBtn) dtStartBtn.textContent = '▶ Iniciar';
}

function changeDirection(newDir) {
  if (!isGameRunning || isPaused) return;
  if (directionQueue.length >= 2) return;
  let effectiveDir = { ...newDir };
  if (eclipseActive) {
    effectiveDir.x = -newDir.x;
    effectiveDir.y = -newDir.y;
  }
  const cur = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : direction;
  const isOpposite = (effectiveDir.x !== 0 && effectiveDir.x === -cur.x) || (effectiveDir.y !== 0 && effectiveDir.y === -cur.y);
  if (isOpposite) return;
  if (effectiveDir.x === cur.x && effectiveDir.y === cur.y) return;
  directionQueue.push({ ...effectiveDir });
}

// ========================================================
// 30. MODALES
// ========================================================
function showTutorialStep(step) {
  currentTutorialStep = step;
  if (tutorialStepTitle) tutorialStepTitle.textContent = tutorialTitles[step - 1];
  for (let i = 1; i <= totalTutorialSteps; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.classList.toggle('active', i === step);
  }
  stepDots.forEach((dot, idx) => dot.classList.toggle('active', idx === step - 1));
  if (tutPrevBtn) tutPrevBtn.classList.toggle('hidden', step === 1);
  if (tutNextBtn) tutNextBtn.classList.toggle('hidden', step === totalTutorialSteps);
  if (tutStartBtn) tutStartBtn.classList.toggle('hidden', step !== totalTutorialSteps);
}

function resumeIfWasRunning(wasRunning) {
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  if (!welcomeScreen.classList.contains('hidden')) startWelcomeDemo();
  if (!wasRunning) { updatePauseButtonUI(); return; }
  if (!isPaused) {
    if (animationFrameId === null && isGameRunning) startGameLoop();
    updatePauseButtonUI();
    return;
  }
  isPaused = false;
  lastFrameTimestamp = null;
  simulationAccumulator = 0;
  startMusic();
  startGameLoop();
  updateFuriaUI();
  updatePauseButtonUI();
}

function openTutorial() {
  if (!tutorialModal.classList.contains('hidden')) return;
  const wasRunning = isGameRunning;
  tutorialOpenedFromWelcome = !welcomeScreen.classList.contains('hidden');
  if (wasRunning && !isPaused) pauseForModal();
  if (!tutorialOpenedFromWelcome && tutorialModal.parentElement !== document.body) document.body.appendChild(tutorialModal);
  welcomeStartBtn.classList.add('hidden');
  settingsModal.classList.add('hidden');
  tutorialModal.classList.remove('hidden');
  document.body.classList.add('tutorial-open');
  tutorialModal.dataset.wasRunning = wasRunning ? '1' : '0';
  showTutorialStep(1);
}

function closeTutorial() {
  if (tutorialModal.classList.contains('hidden')) return;
  tutorialModal.classList.add('hidden');
  document.body.classList.remove('tutorial-open');
  const card = welcomeScreen.querySelector('.welcome-card');
  if (card && tutorialModal.parentElement !== card) card.appendChild(tutorialModal);
  if (tutorialOpenedFromWelcome) { welcomeScreen.classList.remove('hidden'); startWelcomeDemo(); }
  if (!welcomeScreen.classList.contains('hidden') && welcomeStartBtn) {
    welcomeStartBtn.classList.remove('hidden');
  }
  tutorialOpenedFromWelcome = false;
  const wasRunning = tutorialModal.dataset.wasRunning === '1';
  delete tutorialModal.dataset.wasRunning;
  resumeIfWasRunning(wasRunning);
}

function openIntroTutorial() { introTutorialModal.classList.remove('hidden'); }
function closeIntroTutorial() {
  introTutorialModal.classList.add('hidden');
  if (!welcomeScreen.classList.contains('hidden') && welcomeStartBtn) {
    welcomeStartBtn.classList.remove('hidden');
  }
}

function renderLoreChapters() {
  if (!loreChapters) return;
  const chapters = getUnlockedChapters();
  loreChapters.innerHTML = '';
  chapters.forEach(ch => {
    const chip = document.createElement('div');
    chip.className = `lore-chapter-chip ${ch.unlocked ? 'unlocked' : 'locked'}`;
    chip.textContent = ch.unlocked ? `📖 ${ch.title}` : `🔒 ${ch.title}`;
    loreChapters.appendChild(chip);
  });
}

function openLore() {
  if (loreModal.classList.contains('hidden')) {
    const wasRunning = isGameRunning;
    if (wasRunning && !isPaused) pauseForModal();
    loreModal.dataset.wasRunning = wasRunning ? '1' : '0';
    loreModal.classList.remove('hidden');
    playCosmicOrderSound();
    renderLoreChapters();
  }
}
function closeLore() {
  if (loreModal.classList.contains('hidden')) return;
  loreModal.classList.add('hidden');
  const wasRunning = loreModal.dataset.wasRunning === '1';
  delete loreModal.dataset.wasRunning;
  resumeIfWasRunning(wasRunning);
  if (!welcomeScreen.classList.contains('hidden') && welcomeStartBtn) {
    welcomeStartBtn.classList.remove('hidden');
  }
}

function openStatistics() {
  if (!statisticsModal.classList.contains('hidden')) return;
  const wasRunning = isGameRunning;
  if (wasRunning && !isPaused) pauseForModal();
  settingsModal.classList.add('hidden');
  updateStatisticsUI();
  statisticsModal.dataset.wasRunning = wasRunning ? '1' : '0';
  statisticsModal.classList.remove('hidden');
}
function closeStatistics() {
  if (statisticsModal.classList.contains('hidden')) return;
  statisticsModal.classList.add('hidden');
  const wasRunning = statisticsModal.dataset.wasRunning === '1';
  delete statisticsModal.dataset.wasRunning;
  resumeIfWasRunning(wasRunning);
}

function openCustomize() {
  if (!customizeModal.classList.contains('hidden')) return;
  if (isGameRunning && !isPaused) pauseForModal();
  settingsModal.classList.add('hidden');
  beginCustomizeSession();
  renderCustomizeUI();
  customizeModal.dataset.wasRunning = isGameRunning ? '1' : '0';
  customizeModal.classList.remove('hidden');
}
function closeCustomize(applyChanges) {
  if (customizeModal.classList.contains('hidden')) return;
  customizeModal.classList.add('hidden');
  const wasRunning = customizeModal.dataset.wasRunning === '1';
  delete customizeModal.dataset.wasRunning;
  if (applyChanges) {
    commitCustomizeSession();
    if (wasRunning) { startGame(); return; }
    cancelCustomizeSession();
    return;
  }
  cancelCustomizeSession();
  resumeIfWasRunning(wasRunning);
  if (!welcomeScreen.classList.contains('hidden') && welcomeStartBtn) {
    welcomeStartBtn.classList.remove('hidden');
  }
}

function openSettings() {
  if (!settingsModal.classList.contains('hidden')) return;
  if (isGameRunning && !isPaused) pauseForModal();
  settingsGameMode.value = gameModeSelect.value;
  settingsDifficulty.value = difficultySelect.value;
  settingsSoundToggle.checked = !isMuted;
  settingsDpadToggle.checked = showDpad;
  settingsReduceMotionToggle.checked = reduceMotion;
  settingsHighContrastToggle.checked = highContrast;
  updateSettingsDifficultyVisibility();
  settingsModal.dataset.wasRunning = isGameRunning ? '1' : '0';
  settingsModal.classList.remove('hidden');
}
function closeSettings(applyChanges) {
  if (settingsModal.classList.contains('hidden')) return;
  settingsModal.classList.add('hidden');
  const wasRunning = settingsModal.dataset.wasRunning === '1';
  delete settingsModal.dataset.wasRunning;
  let needRestart = false;
  if (applyChanges) {
    const newMode = settingsGameMode.value;
    const newDiff = settingsDifficulty.value;
    if (newMode !== gameModeSelect.value) {
      gameModeSelect.value = newMode;
      gameMode = newMode;
      safeSetItem('snakeIoGameMode', gameMode);
      welcomeGameMode.value = newMode;
      updateWelcomeModeUI();
      updateModeUI();
      needRestart = true;
    }
    if (newDiff !== difficultySelect.value) {
      difficultySelect.value = newDiff;
      welcomeDifficulty.value = newDiff;
      needRestart = true;
    }
    invalidateProfileCache();
    toggleSound(settingsSoundToggle.checked);
    showDpad = settingsDpadToggle.checked;
    safeSetItem('snakeIoShowDpad', showDpad);
    touchControls.classList.toggle('hidden', !showDpad);
    reduceMotion = settingsReduceMotionToggle.checked;
    safeSetItem('snakeIoReduceMotion', reduceMotion);
    document.body.classList.toggle('reduce-motion', reduceMotion);
    highContrast = settingsHighContrastToggle.checked;
    safeSetItem('snakeIoHighContrast', highContrast);
    document.body.classList.toggle('high-contrast', highContrast);
  }
  if (wasRunning) {
    if (needRestart) { startGame(); return; }
    resumeIfWasRunning(true);
  } else {
    applyGameModeRules();
  }
}
function updateSettingsDifficultyVisibility() {
  const isClassic = settingsGameMode.value === 'classic';
  settingsDifficultyGroup.style.display = isClassic ? 'flex' : 'none';
}

function openCampaign() {
  if (!campaignModal.classList.contains('hidden')) return;
  renderCampaignUI();
  campaignModal.classList.remove('hidden');
}
function closeCampaign() {
  if (campaignModal.classList.contains('hidden')) return;
  campaignModal.classList.add('hidden');
}
function renderCampaignUI() {
  if (!campaignLevels) return;
  campaignLevels.innerHTML = '';
  CAMPAIGN_LEVELS.forEach(lvl => {
    const unlocked = lvl.id === 1
      || progression.campaignCompleted.includes(lvl.id - 1)
      || progression.campaignCompleted.some(id => id > lvl.id);
    const completed = progression.campaignCompleted.includes(lvl.id);
    const div = document.createElement('div');
    div.className = `campaign-level ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''}`;
    div.innerHTML = `
      <div class="campaign-level-num">${completed ? '✓' : lvl.id}</div>
      <div class="campaign-level-info">
        <div class="campaign-level-title">${lvl.title}</div>
        <div class="campaign-level-desc">${lvl.desc}</div>
      </div>
      <div class="campaign-level-status">${completed ? '✓' : unlocked ? '▶' : '🔒'}</div>
    `;
    div.addEventListener('click', () => {
      if (!unlocked) { vibrate([30, 40, 30]); return; }
      campaignLevel = lvl.id;
      if (campaignDetail) {
        campaignDetail.classList.remove('hidden');
        campaignDetail.innerHTML = `<strong>${lvl.title}</strong><br>${lvl.desc}<br><em>Dificultad: ${DIFFICULTY_NAMES[lvl.difficulty]}</em>`;
      }
    });
    campaignLevels.appendChild(div);
  });
}

// ========================================================
// 31. CONTROLES
// ========================================================
let touchStartX = 0;
let touchStartY = 0;
window.addEventListener('touchstart', e => {
  if (e.touches.length > 0) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }
}, { passive: true });
window.addEventListener('touchmove', e => { if (e.target === canvas) e.preventDefault(); }, { passive: false });
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
if (btnTurbo) btnTurbo.addEventListener('pointerdown', e => { e.preventDefault(); triggerFuria(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !settingsModal.classList.contains('hidden')) { closeSettings(false); return; }
  if (e.key === 'Escape' && !tutorialModal.classList.contains('hidden')) { closeTutorial(); return; }
  if (e.key === 'Escape' && !introTutorialModal.classList.contains('hidden')) { closeIntroTutorial(); return; }
  if (e.key === 'Escape' && !statisticsModal.classList.contains('hidden')) { closeStatistics(); return; }
  if (e.key === 'Escape' && !loreModal.classList.contains('hidden')) { closeLore(); return; }
  if (e.key === 'Escape' && objectivesModal && !objectivesModal.classList.contains('hidden')) { closeObjectives(); return; }
  if (e.key === 'Escape' && !customizeModal.classList.contains('hidden')) { closeCustomize(false); return; }
  if (e.key === 'Escape' && !campaignModal.classList.contains('hidden')) { closeCampaign(); return; }
  if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
  const isText = e.target instanceof Element && e.target.matches('select, input');
  const isMove = e.key.startsWith('Arrow') || ['w','W','a','A','s','S','d','D'].includes(e.key);
  if (isText && isMove) return;
  if (!isText && (e.key === 'Shift' || (e.key === ' ' && isGameRunning && !isPaused))) triggerFuria();
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': changeDirection({ x: 0, y: -1 }); break;
    case 'ArrowDown': case 's': case 'S': changeDirection({ x: 0, y: 1 }); break;
    case 'ArrowLeft': case 'a': case 'A': changeDirection({ x: -1, y: 0 }); break;
    case 'ArrowRight': case 'd': case 'D': changeDirection({ x: 1, y: 0 }); break;
    case 'Escape': case 'p': case 'P': togglePause(); break;
  }
});
const bindDpad = (btn, dir) => { if (btn) btn.addEventListener('pointerdown', e => { e.preventDefault(); changeDirection(dir); }); };
bindDpad(btnUp, { x: 0, y: -1 });
bindDpad(btnDown, { x: 0, y: 1 });
bindDpad(btnLeft, { x: -1, y: 0 });
bindDpad(btnRight, { x: 1, y: 0 });

// ========================================================
// 32. EVENTOS UI
// ========================================================
if (welcomeStartBtn) welcomeStartBtn.addEventListener('click', () => {
  if (gameModeSelect.value === 'campaign') { openCampaign(); return; }
  if (gameModeSelect.value === 'daily') {
    dailyChallenge = getDailyChallenge();
    if (dailyChallenge && dailyChallenge.rule) {
      dailyChallenge.rule.apply();
      dailyState.activeRule = dailyChallenge.rule;
    }
  }
  startGame();
});
if (welcomeInfoBtn) welcomeInfoBtn.addEventListener('click', openIntroTutorial);
if (welcomeLoreBtn) welcomeLoreBtn.addEventListener('click', openLore);
if (welcomeCustomizeBtn) welcomeCustomizeBtn.addEventListener('click', openCustomize);
if (closeIntroTutorialBtn) closeIntroTutorialBtn.addEventListener('click', closeIntroTutorial);
if (introTutStartBtn) introTutStartBtn.addEventListener('click', () => { closeIntroTutorial(); startGame(); });
if (introTutorialModal) introTutorialModal.addEventListener('click', e => { if (e.target === introTutorialModal) closeIntroTutorial(); });
if (closeLoreBtn) closeLoreBtn.addEventListener('click', closeLore);
if (loreStartBtn) loreStartBtn.addEventListener('click', () => { closeLore(); startGame(); });
if (loreModal) loreModal.addEventListener('click', e => { if (e.target === loreModal) closeLore(); });
if (restartOverlayBtn) restartOverlayBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); setTimeout(() => startGame(), 0); });
if (dtStartBtn) dtStartBtn.addEventListener('click', () => { startGame(); });
if (dtSettingsBtn) dtSettingsBtn.addEventListener('click', openSettings);
if (dtSoundBtn) dtSoundBtn.addEventListener('click', () => toggleSound());
if (dtTutorialBtn) dtTutorialBtn.addEventListener('click', openTutorial);
if (dtCustomizeBtn) dtCustomizeBtn.addEventListener('click', openCustomize);
if (closeStatisticsBtn) closeStatisticsBtn.addEventListener('click', closeStatistics);
if (statisticsModal) statisticsModal.addEventListener('click', e => { if (e.target === statisticsModal) closeStatistics(); });
statisticsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    statisticsTabs.forEach(t => t.classList.toggle('active', t === tab));
    const mode = tab.dataset.modeStats;
    if (mode === 'difficulty') {
      statisticsDifficultyView.classList.remove('hidden');
      statisticsModeView.classList.add('hidden');
    } else {
      statisticsDifficultyView.classList.add('hidden');
      statisticsModeView.classList.remove('hidden');
    }
  });
});
if (dtObjectivesBtn) dtObjectivesBtn.addEventListener('click', openObjectives);
if (mbObjectivesBtn) mbObjectivesBtn.addEventListener('click', openObjectives);
if (settingsObjectivesBtn) settingsObjectivesBtn.addEventListener('click', () => { closeSettings(false); openObjectives(); });
if (closeObjectivesBtn) closeObjectivesBtn.addEventListener('click', closeObjectives);
if (objectivesModal) objectivesModal.addEventListener('click', e => { if (e.target === objectivesModal) closeObjectives(); });
objectivesTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    objectivesTabs.forEach(t => t.classList.toggle('active', t === tab));
    objectivesFilter = tab.dataset.filter || 'all';
    renderObjectivesUI();
  });
});
if (closeCustomizeBtn) closeCustomizeBtn.addEventListener('click', () => closeCustomize(false));
if (customizeCancelBtn) customizeCancelBtn.addEventListener('click', () => closeCustomize(false));
if (customizeApplyBtn) customizeApplyBtn.addEventListener('click', () => closeCustomize(true));
if (customizeModal) customizeModal.addEventListener('click', e => { if (e.target === customizeModal) closeCustomize(false); });
customizeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    customizeTabs.forEach(t => t.classList.toggle('active', t === tab));
    if (customizeSkinsPanel) customizeSkinsPanel.classList.toggle('active', target === 'skins');
    if (customizeThemesPanel) customizeThemesPanel.classList.toggle('active', target === 'themes');
  });
});
if (menuToggleBtn) menuToggleBtn.addEventListener('click', () => { openSettings(); });
if (mbSoundBtn) mbSoundBtn.addEventListener('click', () => toggleSound());
if (mbSettingsBtn) mbSettingsBtn.addEventListener('click', () => { openSettings(); });
if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => closeSettings(false));
if (settingsApplyBtn) settingsApplyBtn.addEventListener('click', () => closeSettings(true));
if (settingsModal) settingsModal.addEventListener('click', e => { if (e.target === settingsModal) closeSettings(false); });
if (settingsGameMode) settingsGameMode.addEventListener('change', updateSettingsDifficultyVisibility);
if (settingsCustomizeBtn) settingsCustomizeBtn.addEventListener('click', () => { closeSettings(false); openCustomize(); });
if (settingsStatsBtn) settingsStatsBtn.addEventListener('click', () => { closeSettings(false); openStatistics(); });
if (settingsTutorialBtn) settingsTutorialBtn.addEventListener('click', () => { closeSettings(false); openTutorial(); });
if (settingsRestartBtn) settingsRestartBtn.addEventListener('click', () => { closeSettings(false); startGame(); });
if (tutPrevBtn) tutPrevBtn.addEventListener('click', () => { if (currentTutorialStep > 1) showTutorialStep(currentTutorialStep - 1); });
if (tutNextBtn) tutNextBtn.addEventListener('click', () => { if (currentTutorialStep < totalTutorialSteps) showTutorialStep(currentTutorialStep + 1); });
if (tutStartBtn) tutStartBtn.addEventListener('click', () => { closeTutorial(); startGame(); });
if (closeTutorialBtn) closeTutorialBtn.addEventListener('click', closeTutorial);
if (tutorialModal) tutorialModal.addEventListener('click', e => { if (e.target === tutorialModal) closeTutorial(); });
if (dtPauseBtn) dtPauseBtn.addEventListener('click', togglePause);
if (mbPauseBtn) mbPauseBtn.addEventListener('click', togglePause);
if (pauseResumeBtn) pauseResumeBtn.addEventListener('click', togglePause);
if (pauseRestartBtn) pauseRestartBtn.addEventListener('click', () => { if (pauseOverlay) pauseOverlay.classList.add('hidden'); startGame(); });
if (pauseQuitBtn) pauseQuitBtn.addEventListener('click', exitToMenu);
if (closeCampaignBtn) closeCampaignBtn.addEventListener('click', closeCampaign);
if (campaignModal) campaignModal.addEventListener('click', e => { if (e.target === campaignModal) closeCampaign(); });
if (campaignPlayBtn) campaignPlayBtn.addEventListener('click', () => {
  if (!campaignLevel) campaignLevel = 1;
  const lvl = CAMPAIGN_LEVELS.find(l => l.id === campaignLevel);
  if (!lvl) return;
  campaignInProgress = true;
  gameModeSelect.value = 'campaign';
  gameMode = 'campaign';
  closeCampaign();
  startGame();
});

// ========================================================
// 33. DIFICULTAD Y MODO
// ========================================================
function updateModeUI() {
  const isClassic = gameModeSelect.value === 'classic';
  if (settingsDifficultyGroup) settingsDifficultyGroup.style.display = isClassic ? 'flex' : 'none';
  updateThemeColors();
  rebuildBoardCanvas(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2), true);
  welcomeDemoMode = gameModeSelect.value;
  if (!welcomeScreen.classList.contains('hidden')) {
    resetWelcomeDemo();
  }
}
function updateWelcomeModeUI() {
  const isClassic = welcomeGameMode.value === 'classic';
  welcomeDifficultyBox.style.display = isClassic ? 'flex' : 'none';
}
if (welcomeGameMode) welcomeGameMode.addEventListener('change', () => {
  gameMode = welcomeGameMode.value;
  safeSetItem('snakeIoGameMode', gameMode);
  gameModeSelect.value = gameMode;
  invalidateProfileCache();
  updateWelcomeModeUI();
  updateModeUI();
  if (isGameRunning) startGame();
  else applyGameModeRules();
});
if (welcomeDifficulty) welcomeDifficulty.addEventListener('change', () => {
  difficultySelect.value = welcomeDifficulty.value;
  invalidateProfileCache();
  reconcileGuardianCount();
});
function applyGameModeRules() {
  const mode = GAME_MODES[gameModeSelect.value] || GAME_MODES.classic;
  maxLives = mode.livesEnabled ? MAX_LIVES : 1;
  lives = maxLives;
  updateLivesUI();
  if (mode.itemsEnabled) {
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
if (difficultySelect) difficultySelect.addEventListener('change', () => {
  welcomeDifficulty.value = difficultySelect.value;
  invalidateProfileCache();
  reconcileGuardianCount();
});
if (gameModeSelect) gameModeSelect.addEventListener('change', () => {
  gameMode = gameModeSelect.value;
  safeSetItem('snakeIoGameMode', gameMode);
  welcomeGameMode.value = gameMode;
  invalidateProfileCache();
  updateWelcomeModeUI();
  updateModeUI();
  if (isGameRunning) startGame();
  else applyGameModeRules();
});

// ========================================================
// 34. VISIBILITY + BLUR
// ========================================================
let _lastBlurPause = 0;
window.addEventListener('blur', () => {
  const now = performance.now();
  if (now - _lastBlurPause < 300) return;
  _lastBlurPause = now;
  if (isGameRunning && !isPaused) {
    if (pauseOverlay) pauseOverlay.classList.remove('hidden');
    isPaused = true;
    stopMusic();
    stopGameLoop();
    updateFuriaUI();
    updatePauseButtonUI();
    draw(renderInterpolation, false);
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (isGameRunning && !isPaused) {
      isPaused = true;
      stopMusic();
      stopGameLoop();
      updateFuriaUI();
      updatePauseButtonUI();
      draw(renderInterpolation, false);
    }
    stopWelcomeDemo();
  } else {
    if (isGameRunning && isPaused) draw(renderInterpolation, false);
    if (!welcomeScreen.classList.contains('hidden')) startWelcomeDemo();
  }
});

window.addEventListener('pagehide', () => {
  if (isGameRunning && !isPaused) { isPaused = true; stopMusic(); stopGameLoop(); }
});

// ========================================================
// 35. WELCOME DEMO
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
    { direction: { x: 1, y: 0 }, steps: xTurn - sx },
    { direction: { x: 0, y: 1 }, steps: yBot - yTop },
    { direction: { x: 1, y: 0 }, steps: 2 },
    { direction: { x: 0, y: -1 }, steps: yBot - yG },
    { direction: { x: 1, y: 0 }, steps: last }
  ];
}
function welcomeGuardianStart() {
  const { yG } = welcomeScenario;
  return [0, 1, 2, 3].map(i => ({ x: welcomeDemoCols - 4 + i, y: yG }));
}
function resetWelcomeDemo() {
  if (!welcomeScenario) buildWelcomeScenario(welcomeDemoCols, welcomeDemoRows);
  const s = welcomeScenario;
  welcomeDemoSnake = [{ x: s.sx, y: s.yTop }, { x: s.sx - 1, y: s.yTop }, { x: s.sx - 2, y: s.yTop }];
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
  if (welcomeDemoCallout) welcomeDemoCallout.textContent = welcomeDemoCalloutMessages[0];
}
function updateWelcomeLayout(width, height) {
  const PAD = 8, HUD_H = 36;
  const availW = Math.max(100, width - PAD * 2);
  const availH = Math.max(60, height - HUD_H - PAD);
  const target = Math.max(18, Math.min(28, width / 15));
  const cols = Math.max(14, Math.min(30, Math.floor(availW / target)));
  const rows = Math.max(7, Math.min(22, Math.floor(availH / target)));
  const cell = Math.max(8, Math.min(availW / Math.max(1, cols), availH / Math.max(1, rows)));
  welcomeLayout = {
    cell,
    bx: Math.max(0, (width - cell * cols) / 2),
    by: HUD_H + Math.max(0, (availH - cell * rows) / 2)
  };
  const changed = cols !== welcomeDemoCols || rows !== welcomeDemoRows;
  if (changed) {
    welcomeDemoCols = cols; welcomeDemoRows = rows;
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
  if (sizeChanged) { welcomeDemo.width = pw; welcomeDemo.height = ph; }
  welcomeDemoContext.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawWelcomeDemo(1);
}
function drawWelcomeCell(segment, index, options = {}) {
  const { x, y, size } = segment;
  const inset = Math.max(1, size * 0.07);
  const isHead = index === 0;
  let direction = options.direction;
  if (!direction || (direction.x === 0 && direction.y === 0)) {
    direction = { x: 1, y: 0 };
  }
  const colors = options.guardian ? ['#e2574c', '#9b2929'] : options.immune ? ['#7de8c4', '#1a7a5e'] : ['#4ec9a0', '#1a7a5e'];
  welcomeDemoContext.fillStyle = isHead ? colors[0] : colors[1];
  roundRect(welcomeDemoContext, x + inset, y + inset, size - inset * 2, size - inset * 2, isHead ? size * 0.32 : size * 0.2);
  welcomeDemoContext.fill();
  if (!isHead) {
    const cx = x + size / 2, cy = y + size / 2;
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
}
function drawWelcomeOffering(point, x, y, size, jade = false) {
  const cx = x + size / 2, cy = y + size / 2;
  const r = size * (jade ? 0.36 : 0.29);
  welcomeDemoContext.save();
  if (jade) {
    welcomeDemoContext.fillStyle = '#1a7a5e';
    welcomeDemoContext.strokeStyle = '#7de8c4';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.1);
    welcomeDemoContext.beginPath(); welcomeDemoContext.arc(cx, cy, r, 0, Math.PI * 2); welcomeDemoContext.fill(); welcomeDemoContext.stroke();
  } else {
    welcomeDemoContext.fillStyle = '#f2c230';
    welcomeDemoContext.strokeStyle = '#fff0b0';
    welcomeDemoContext.lineWidth = Math.max(1, size * 0.1);
    welcomeDemoContext.beginPath(); welcomeDemoContext.ellipse(cx, cy, r * 0.55, r, 0, 0, Math.PI * 2); welcomeDemoContext.fill(); welcomeDemoContext.stroke();
  }
  welcomeDemoContext.restore();
}
function moveWelcomeDemoGuardian() {
  if (welcomeDemoImmuneUntil <= welcomeDemoTick) return;
  if (welcomeDemoGuardianDefeatedUntil > welcomeDemoTick) return;
  const eHead = welcomeDemoGuardian[0];
  const pHead = welcomeDemoSnake[0];
  const dx = pHead.x - eHead.x;
  const dy = pHead.y - eHead.y;
  const cands = Math.abs(dx) >= Math.abs(dy)
    ? [{ x: Math.sign(dx), y: 0 }, { x: 0, y: Math.sign(dy) }]
    : [{ x: 0, y: Math.sign(dy) }, { x: Math.sign(dx), y: 0 }];
  const nd = cands.find(c => {
    if (!c.x && !c.y) return false;
    const x = eHead.x + c.x; const y = eHead.y + c.y;
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
    } else {
      welcomeDemoGuardian = [];
      welcomeDemoGameOverUntil = welcomeDemoTick + 7;
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
  const nh = { x: welcomeDemoSnake[0].x + route.direction.x, y: welcomeDemoSnake[0].y + route.direction.y };
  const coll = welcomeDemoGuardian.some(s => s.x === nh.x && s.y === nh.y);
  if (coll) {
    if (welcomeDemoImmuneUntil > welcomeDemoTick) {
      welcomeDemoGuardian = [];
      welcomeDemoGuardianDefeatedUntil = welcomeDemoTick + 7;
    } else {
      welcomeDemoGuardian = [];
      welcomeDemoGameOverUntil = welcomeDemoTick + 7;
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
  } else if (welcomeDemoJade && nh.x === welcomeDemoJade.x && nh.y === welcomeDemoJade.y) {
    welcomeDemoJade = null;
    welcomeDemoImmuneUntil = welcomeDemoTick + 12;
    grows = true;
  }
  if (!grows) welcomeDemoSnake.pop();
  welcomeDemoTick++;
  welcomeDemoRouteSteps++;
  if (welcomeDemoRouteSteps >= route.steps) { welcomeDemoRouteIndex++; welcomeDemoRouteSteps = 0; }
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
  c.strokeStyle = 'rgba(144, 153, 177, 0.17)';
  c.lineWidth = 1;
  for (let col = 0; col <= welcomeDemoCols; col++) {
    const x = bx + col * cellSize;
    c.beginPath(); c.moveTo(x, by); c.lineTo(x, by + bh); c.stroke();
  }
  for (let row = 0; row <= welcomeDemoRows; row++) {
    const y = by + row * cellSize;
    c.beginPath(); c.moveTo(bx, y); c.lineTo(bx + bw, y); c.stroke();
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
    drawSegments(welcomeDemoGuardian, welcomeDemoPreviousGuardian, { guardian: true, direction: { x: gh.x - gn.x, y: gh.y - gn.y } });
  }
  const isImmune = welcomeDemoImmuneUntil > welcomeDemoTick;
  drawSegments(welcomeDemoSnake, welcomeDemoPreviousSnake, { immune: isImmune, direction: welcomeDemoDirection });
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
  if (welcomeScreen.classList.contains('hidden')) { welcomeDemoLastFrame = null; return; }
  if (document.hidden) {
    welcomeDemoLastFrame = timestamp;
  } else {
    let elapsed = welcomeDemoLastFrame === null ? 0 : timestamp - welcomeDemoLastFrame;
    if (elapsed > 500) { welcomeDemoAccumulator = 0; elapsed = 0; }
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
  if (welcomeDemoFrameId !== null) { cancelAnimationFrame(welcomeDemoFrameId); welcomeDemoFrameId = null; }
  welcomeDemoLastFrame = null;
}

// ========================================================
// 36. INICIALIZACIÓN
// ========================================================
function init() {
  updateSoundUI();
  if (settingsDpadToggle) settingsDpadToggle.checked = showDpad;
  if (touchControls) touchControls.classList.toggle('hidden', !showDpad);
  if (settingsReduceMotionToggle) settingsReduceMotionToggle.checked = reduceMotion;
  if (settingsHighContrastToggle) settingsHighContrastToggle.checked = highContrast;
  document.body.classList.toggle('reduce-motion', reduceMotion);
  document.body.classList.toggle('high-contrast', highContrast);
  updateScoresUI();
  updateStatisticsUI();
  showTutorialStep(1);
  lives = MAX_LIVES;
  updateLivesUI();
  updatePauseButtonUI();
  document.body.classList.add('welcome-open');
  resetWelcomeDemo();
  startWelcomeDemo();
  resetGame();
  updateLivesUI();
  resizeCanvas();
  draw();
  if (gameModeSelect) gameModeSelect.value = gameMode;
  if (welcomeGameMode) welcomeGameMode.value = gameMode;
  if (welcomeDifficulty) welcomeDifficulty.value = difficultySelect.value;
  updateWelcomeModeUI();
  updateModeUI();
  gameTime = 0;
  applyGameModeRules();
  invalidateProfileCache();
  if (storageUnavailable) {
    setTimeout(() => {
      showAchievementToast({
        icon: '⚠️',
        name: 'Progreso no guardado',
        description: 'Tu navegador bloquea el almacenamiento local. El progreso se perderá al cerrar.'
      }, null);
    }, 1500);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}