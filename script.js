// ========================================================
// LA TRAVESÍA DE KUKULCÁN — script.js (v4 corregido)
// Fixes: pausa robusta, sin PWA, sin freezes, render estable
// ========================================================

// ✅ FIX: eliminado registro de Service Worker por completo.

// ========================================================
// 1. REFERENCIAS AL DOM
// ========================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: true });

const dtScore = document.getElementById('dt-score');
const dtHighScore = document.getElementById('dt-high-score');
const dtLength = document.getElementById('dt-length');
const dtCoins = document.getElementById('dt-coins');
const dtSoundBtn = document.getElementById('dt-sound-btn');
const dtTutorialBtn = document.getElementById('dt-tutorial-btn');
const dtStartBtn = document.getElementById('dt-start-btn');
const dtSettingsBtn = document.getElementById('dt-settings-btn');
const dtCustomizeBtn = document.getElementById('dt-customize-btn');

const welcomeScreen = document.getElementById('welcome-screen');
const welcomeStartBtn = document.getElementById('welcome-start-btn');
const welcomeInfoBtn = document.getElementById('welcome-info-btn');
const welcomeLoreBtn = document.getElementById('welcome-lore-btn');
const welcomeCustomizeBtn = document.getElementById('welcome-customize-btn');
const welcomeDemo = document.getElementById('welcome-demo');
const welcomeDemoCallout = document.getElementById('welcome-demo-callout');
const welcomeDemoContext = welcomeDemo.getContext('2d', { alpha: false });
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

const achievementsModal = document.getElementById('achievements-modal');
const closeAchievementsBtn = document.getElementById('close-achievements-btn');
const achievementsList = document.getElementById('achievements-list');
const achievementsCount = document.getElementById('achievements-count');
const achievementsFill = document.getElementById('achievements-fill');

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

const gameOverlay = document.getElementById('game-overlay');
const overlayReason = document.getElementById('overlay-reason');
const finalScoreElement = document.getElementById('final-score');
const finalLengthElement = document.getElementById('final-length');
const finalCoinsElement = document.getElementById('final-coins');
const restartOverlayBtn = document.getElementById('restart-overlay-btn');
const statisticsModal = document.getElementById('statistics-modal');
const closeStatisticsBtn = document.getElementById('close-statistics-btn');
const statisticsStorageStatus = document.getElementById('statistics-storage-status');
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
const settingsCustomizeBtn = document.getElementById('settings-customize-btn');
const settingsAchievementsBtn = document.getElementById('settings-achievements-btn');
const settingsStatsBtn = document.getElementById('settings-stats-btn');
const settingsTutorialBtn = document.getElementById('settings-tutorial-btn');
const settingsRestartBtn = document.getElementById('settings-restart-btn');
const settingsApplyBtn = document.getElementById('settings-apply-btn');

// ========================================================
// 2. BADGE MANAGER
// ========================================================
const BadgeManager = (() => {
  const isMobile = () => window.innerWidth <= 768;
  const MAX_MEDIUM_MOBILE = 1;
  const MAX_HIGH_MOBILE = 2;
  const MAX_SPECIAL_MOBILE = 1;

  const mediumOrder = ['cosmicOrder', 'rain', 'sacrificeOffering', 'cosmicOrderFood', 'skullFood', 'threat'];
  const highOrder = ['furia', 'air', 'immunity', 'freeze', 'respawn'];
  const specialOrder = ['timer', 'eclipse', 'xibalba', 'darkness'];

  const refs = {
    immunity: document.getElementById('immunity-badge'),
    furia: furiaBadge, air: airBadge, respawn: respawnBadge, freeze: freezeBadge,
    rain: rainBadge, cosmicOrder: cosmicOrderBadge, cosmicOrderFood: cosmicOrderFoodBadge,
    sacrificeOffering: sacrificeOfferingBadge, skullFood: skullFoodBadge, threat: threatBadge,
    timer: timerBadge, eclipse: eclipseBadge, xibalba: xibalbaBadge, darkness: darknessBadge
  };

  const logical = {
    immunity: false, furia: false, air: false, respawn: false, freeze: false, rain: false,
    cosmicOrder: false, cosmicOrderFood: false, sacrificeOffering: false,
    skullFood: false, threat: false, timer: false, eclipse: false, xibalba: false, darkness: false
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
    guardianTargets: 1, guardianFirstSpawnMs: 18000, guardianNextSpawnMs: 22000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 20000, freezeRespawnMs: 24000,
    freezeDurationMs: 4000, jadeImmunityMs: 12000, guardianMoveInterval: 5,
    guardianLead: 1, flankerOrbitSpeed: 16, cosmicFirstMs: 40000, cosmicIntervalMs: 55000,
    sacrificeFirstMs: 28000, skullFirstMs: 26000, rainFirstMs: 28000, rainIntervalMs: 50000,
    chaacUnlockMs: 999999, chaacCooldownMs: 999999, chaacLifetimeMs: 999999,
    chaacTeleportMs: 4000, guardianReward: 80, bossReward: 0,
    turboDurationMs: 3500, turboCooldownMs: 4500
  },
  medium: {
    guardianTargets: 2, guardianFirstSpawnMs: 14000, guardianNextSpawnMs: 16000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 14000, freezeRespawnMs: 22000,
    freezeDurationMs: 3000, jadeImmunityMs: 10000, guardianMoveInterval: 4,
    guardianLead: 3, flankerOrbitSpeed: 12, cosmicFirstMs: 30000, cosmicIntervalMs: 45000,
    sacrificeFirstMs: 30000, skullFirstMs: 20000, rainFirstMs: 22000, rainIntervalMs: 42000,
    chaacUnlockMs: 999999, chaacCooldownMs: 999999, chaacLifetimeMs: 999999,
    chaacTeleportMs: 3200, guardianReward: 100, bossReward: 0,
    turboDurationMs: 3000, turboCooldownMs: 5000
  },
  hard: {
    guardianTargets: 3, guardianFirstSpawnMs: 11000, guardianNextSpawnMs: 11000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 11000, freezeRespawnMs: 20000,
    freezeDurationMs: 2500, jadeImmunityMs: 8000, guardianMoveInterval: 3,
    guardianLead: 4, flankerOrbitSpeed: 9, cosmicFirstMs: 25000, cosmicIntervalMs: 38000,
    sacrificeFirstMs: 32000, skullFirstMs: 18000, rainFirstMs: 18000, rainIntervalMs: 38000,
    chaacUnlockMs: 45000, chaacCooldownMs: 60000, chaacLifetimeMs: 999999,
    chaacTeleportMs: 3000, guardianReward: 120, bossReward: 250,
    turboDurationMs: 2800, turboCooldownMs: 5200
  },
  extreme: {
    guardianTargets: 4, guardianFirstSpawnMs: 9000, guardianNextSpawnMs: 8000,
    guardianLifetimeMs: 999999, jadeRespawnMs: 8000, freezeRespawnMs: 18000,
    freezeDurationMs: 2000, jadeImmunityMs: 6000, guardianMoveInterval: 2,
    guardianLead: 5, flankerOrbitSpeed: 7, cosmicFirstMs: 20000, cosmicIntervalMs: 32000,
    sacrificeFirstMs: 36000, skullFirstMs: 15000, rainFirstMs: 15000, rainIntervalMs: 32000,
    chaacUnlockMs: 35000, chaacCooldownMs: 45000, chaacLifetimeMs: 999999,
    chaacTeleportMs: 2600, guardianReward: 150, bossReward: 350,
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
  }
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

const TEZCATLIPOCA_CONFIG = {
  easy:    { unlockMs: 90000,  cooldownMs: 90000,  teleportMs: 4500, vulnerableMs: 3000 },
  medium:  { unlockMs: 60000,  cooldownMs: 60000,  teleportMs: 4000, vulnerableMs: 2500 },
  hard:    { unlockMs: 45000,  cooldownMs: 60000,  teleportMs: 3000, vulnerableMs: 2200 },
  extreme: { unlockMs: 35000,  cooldownMs: 45000,  teleportMs: 2600, vulnerableMs: 2000 }
};

const BOARD_THEMES = {
  classic: { bg: '#141720', gridLine: 'rgba(144, 153, 177, 0.13)', patternColor: 'rgba(198, 164, 85, 0.07)', patternType: 'diamond', vignetteColor: 'rgba(0,0,0,0.42)', cost: 0 },
  hunt:    { bg: '#0a1a12', gridLine: 'rgba(78, 201, 160, 0.15)', patternColor: 'rgba(217, 142, 43, 0.08)', patternType: 'diamond', vignetteColor: 'rgba(0, 10, 5, 0.55)', cost: 0 },
  survival:{ bg: '#0a0809', gridLine: 'rgba(239, 82, 97, 0.08)', patternColor: 'rgba(239, 82, 97, 0.04)', patternType: 'crack', vignetteColor: 'rgba(0,0,0,0.7)', cost: 0 },
  obsidian:{ bg: '#0a0a0d', gridLine: 'rgba(120, 120, 120, 0.12)', patternColor: 'rgba(80, 80, 80, 0.08)', patternType: 'diamond', vignetteColor: 'rgba(0,0,0,0.7)', cost: 200 },
  jade:    { bg: '#0d1a14', gridLine: 'rgba(78, 201, 160, 0.14)', patternColor: 'rgba(125, 232, 196, 0.06)', patternType: 'diamond', vignetteColor: 'rgba(0, 20, 10, 0.6)', cost: 300 }
};

function getEffectiveDifficulty() {
  const mode = gameModeSelect.value;
  if (mode === 'classic') return difficultySelect.value;
  return 'medium';
}

function getDifficultyProfile() {
  const mode = GAME_MODES[gameModeSelect.value] || GAME_MODES.classic;
  const baseProfile = DIFFICULTY_PROFILES[getEffectiveDifficulty()] || DIFFICULTY_PROFILES.medium;
  const profile = { ...baseProfile };
  if (mode.profileOverrides) Object.assign(profile, mode.profileOverrides);
  profile.guardianFirstSpawnMs *= mode.guardianSpawnRate;
  profile.guardianNextSpawnMs *= mode.guardianSpawnRate;
  profile.guardianReward *= mode.guardianRewardMultiplier;
  profile.bossReward *= mode.guardianRewardMultiplier;
  return profile;
}

const FREEZE_FIRST_SPAWN_MS = 16000;
const FREEZE_RESPAWN_DELAY_MS = 22000;
const GUARDIAN_FREEZE_DURATION_MS = 3000;
const CHAAC_UNLOCK_MS = 45000;
const CHAAC_COOLDOWN_MS = 60000;
const CHAAC_LIFETIME_MS = 999999;
const CHAAC_TELEPORT_MS = 5000;
const CHAAC_RETRY_MS = 3000;
const CHAAC_VULNERABLE_MS = 2200;

const GUARDIAN_DEFS = [
  { behavior: 'hunter', name: 'Ahalpuh', title: 'El Putrefactor',
    lore: 'Demonio que causa la putrefacción. Te persigue sin descanso.',
    palette: { head: '#e2574c', body: '#9b2929', crest: '#ff9b83', eye: '#fff0c6' },
    traits: { fangs: true, crestCount: 1, eyeMark: false },
    ambientParticles: { color: '#ff6b4c', rate: 0.35, size: 1.5 } },
  { behavior: 'interceptor', name: 'Ixtab', title: 'La Vidente',
    lore: 'Diosa de la adivinación. Anticipa tu rumbo antes de que lo tomes.',
    palette: { head: '#a65bd4', body: '#64328e', crest: '#d4a0f0', eye: '#f0e0ff' },
    traits: { fangs: false, crestCount: 1, eyeMark: true },
    ambientParticles: { color: '#c89bf0', rate: 0.4, size: 1.8 } },
  { behavior: 'flanker', name: 'Camazotz', title: 'El Murciélago de la Muerte',
    lore: 'Señor de los murciélagos. Intenta rodearte desde las sombras.',
    palette: { head: '#f28c28', body: '#a64b1b', crest: '#ffc078', eye: '#fff0c6' },
    traits: { fangs: true, crestCount: 2, eyeMark: false },
    ambientParticles: { color: '#ff9b3c', rate: 0.45, size: 1.6 } },
  { behavior: 'ambusher', name: 'Tezcatlipoca', title: 'El Jaguar de Obsidiana',
    lore: 'Dios de la noche y los espejos. Se teletransporta entre las sombras.',
    palette: { head: '#d98e2b', body: '#a8561b', crest: '#14110f', eye: '#f2e2b8', jade: '#4ec9a0', obsidian: '#14110f', ember: '#f2e2b8' },
    traits: { fangs: true, crestCount: 4, eyeMark: false, isBoss: true, isTezcatlipoca: true },
    ambientParticles: { color: '#d98e2b', rate: 0.6, size: 2 } }
];

let usedGuardianPalettes = [];

function getUniqueGuardianDef() {
  const normalDefs = GUARDIAN_DEFS.filter(d => d.behavior !== 'ambusher');
  const available = normalDefs.filter(d => !usedGuardianPalettes.includes(d.name));
  if (available.length === 0) {
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
const PROGRESSION_STORAGE_KEY = 'kukulcanProgression';
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
// 5. PROGRESIÓN
// ========================================================
let progression = {
  totalMaize: 0, totalCacao: 0, totalGuardiansDefeated: 0,
  totalTezcatlipocaDefeated: 0, totalGamesPlayed: 0, totalSurvivalMs: 0,
  bestTimedScore: 0, achievements: {},
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
      if (!progression.achievements || typeof progression.achievements !== 'object') progression.achievements = {};
    }
  } catch (e) { console.warn('No se pudo cargar la progresión:', e); }
}
function saveProgression() { safeSetItem(PROGRESSION_STORAGE_KEY, JSON.stringify(progression)); }
loadProgression();

// ========================================================
// 5.1. LOGROS
// ========================================================
const ACHIEVEMENTS = [
  { id: 'first_maize',    name: 'Primera Ofrenda',       description: 'Recoge tu primer maíz.',           icon: '🌽', check: (p) => p.totalMaize >= 1 },
  { id: 'maize_100',      name: 'Agricultor Sagrado',    description: 'Recoge 100 maíces en total.',      icon: '🌽', check: (p) => p.totalMaize >= 100 },
  { id: 'maize_1000',     name: 'Señor del Maíz',        description: 'Recoge 1000 maíces en total.',     icon: '🌽', check: (p) => p.totalMaize >= 1000 },
  { id: 'cacao_50',       name: 'Mercader de Cacao',     description: 'Recoge 50 ofrendas de cacao.',     icon: '🍫', check: (p) => p.totalCacao >= 50 },
  { id: 'guardian_10',    name: 'Cazador de Demonios',   description: 'Derrota 10 guardianes.',           icon: '⚔️', check: (p) => p.totalGuardiansDefeated >= 10 },
  { id: 'guardian_100',   name: 'Guerrero Jaguar',       description: 'Derrota 100 guardianes.',          icon: '🐆', check: (p) => p.totalGuardiansDefeated >= 100 },
  { id: 'tezcat_1',       name: 'El Primer Espejo',      description: 'Derrota a Tezcatlipoca por primera vez.', icon: '👁️', check: (p) => p.totalTezcatlipocaDefeated >= 1 },
  { id: 'tezcat_10',      name: 'Rompe-Espejos',         description: 'Derrota a Tezcatlipoca 10 veces.', icon: '👁️', check: (p) => p.totalTezcatlipocaDefeated >= 10 },
  { id: 'survive_5min',   name: 'Viajero del Inframundo',description: 'Sobrevive 5 minutos acumulados.',  icon: '⏳', check: (p) => p.totalSurvivalMs >= 300000 },
  { id: 'games_50',       name: 'Devoto de Kukulcán',    description: 'Juega 50 partidas.',               icon: '🐍', check: (p) => p.totalGamesPlayed >= 50 },
  { id: 'timed_500',      name: 'Contra el Sol',         description: 'Consigue 500 puntos en Contrarreloj.', icon: '⏱️', check: (p) => p.bestTimedScore >= 500 }
];

function checkAchievements() {
  const newlyUnlocked = [];
  ACHIEVEMENTS.forEach(ach => {
    if (progression.achievements[ach.id]) return;
    if (ach.check(progression)) {
      progression.achievements[ach.id] = Date.now();
      newlyUnlocked.push(ach);
    }
  });
  if (newlyUnlocked.length > 0) {
    saveProgression();
    newlyUnlocked.forEach((ach, idx) => setTimeout(() => showAchievementToast(ach), idx * 1200));
  }
  return newlyUnlocked;
}

function showAchievementToast(achievement) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="achievement-toast-icon">${achievement.icon}</div>
    <div class="achievement-toast-content">
      <div class="achievement-toast-title">¡Logro desbloqueado!</div>
      <div class="achievement-toast-name">${achievement.name}</div>
      <div class="achievement-toast-desc">${achievement.description}</div>
    </div>
  `;
  const container = document.getElementById('achievement-toast-container') || document.body;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
  playAchievementSound();
  vibrate([20, 40, 20]);
}

function playAchievementSound() {
  if (isMuted) return;
  playTone(523, 100, 0.15, 'triangle');
  setTimeout(() => playTone(659, 100, 0.15, 'triangle'), 80);
  setTimeout(() => playTone(784, 150, 0.18, 'triangle'), 160);
  setTimeout(() => playTone(1046, 250, 0.2, 'sine'), 240);
}

function renderAchievementsUI() {
  if (!achievementsList) return;
  const total = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter(a => progression.achievements[a.id]).length;
  if (achievementsCount) achievementsCount.textContent = `${unlockedCount} / ${total}`;
  if (achievementsFill) achievementsFill.style.width = `${(unlockedCount / total) * 100}%`;
  achievementsList.innerHTML = '';
  ACHIEVEMENTS.forEach(ach => {
    const unlocked = !!progression.achievements[ach.id];
    const item = document.createElement('div');
    item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
    item.innerHTML = `
      <div class="achievement-icon">${ach.icon}</div>
      <div class="achievement-name">${ach.name}</div>
      <div class="achievement-desc">${ach.description}</div>
    `;
    achievementsList.appendChild(item);
  });
}

// ========================================================
// 5.2. SKINS Y TEMAS
// ========================================================
const KUKULKAN_SKINS = {
  default: { name: 'Jade Clásico', description: 'El aspecto tradicional de Kukulcán.', head: '#4ec9a0', body: '#1a7a5e', border: 'rgba(213, 189, 112, 0.55)', inner: 'rgba(182, 242, 209, 0.28)', plate: null, cost: 0 },
  golden:  { name: 'Oro de Itzamná', description: 'Un tributo al dios creador.', head: '#d4b45c', body: '#a8924a', border: '#f5e9b8', inner: 'rgba(245, 235, 190, 0.4)', plate: '#c2b06a', cost: 100 },
  obsidian:{ name: 'Obsidiana Negra', description: 'Forjado en las profundidades de Xibalbá.', head: '#3a3a3a', body: '#1a1a1a', border: 'rgba(120, 120, 120, 0.6)', inner: 'rgba(80, 80, 80, 0.3)', plate: '#2a2a2a', cost: 250 },
  blood:   { name: 'Sangre de Sacrificio', description: 'Para los que ofrecen todo a los dioses.', head: '#ef5261', body: '#9b2929', border: 'rgba(255, 200, 200, 0.5)', inner: 'rgba(255, 150, 150, 0.25)', plate: '#c23434', cost: 500 }
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
let runStartedAt = null;
let runDifficulty = null;
let runGuardiansDefeated = 0;

let gameTime = 0;
let simulationAccumulator = 0;
let lastFrameTimestamp = null;
let animationFrameId = null;
let isLoopRunning = false;
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

let eclipseActive = false;
let eclipseUntil = 0;
let nextEclipseAt = null;
let eclipseWarningShown = false;

let darknessRadius = DARKNESS_MAX_RADIUS;
let darknessStartTime = null;

let huntTrail = [];

let timedRemainingMs = TIMED_INITIAL_MS;
let timedWarningShown = false;

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
let tutorialOpenedFromWelcome = false;

let showDpad = safeGetItem('snakeIoShowDpad', 'false') === 'true';
let gameMode = safeGetItem('snakeIoGameMode', 'classic');

// ========================================================
// 7. ESTADÍSTICAS
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
  const survivalMs = gameTime - runStartedAt;
  r.bestSurvivalMs = Math.max(r.bestSurvivalMs, survivalMs);
  r.guardiansDefeated += runGuardiansDefeated;
  saveStats();

  progression.totalGamesPlayed++;
  progression.totalSurvivalMs += survivalMs;
  progression.totalGuardiansDefeated += runGuardiansDefeated;
  progression.maizeCoins += Math.floor(score / 10);

  if (gameModeSelect.value === 'timed') {
    progression.bestTimedScore = Math.max(progression.bestTimedScore, score);
  }

  saveProgression();
  checkAchievements();

  runStartedAt = null;
  runDifficulty = null;
  runGuardiansDefeated = 0;
}

// ========================================================
// 8. ESCALADO / CANVAS
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
  const themeId = progression.selectedTheme || 'classic';
  if (!force && boardCanvas && boardWidth === width && boardHeight === height && boardTheme === themeId) return;
  boardCanvas = document.createElement('canvas');
  boardCanvas.width = Math.max(1, Math.floor(width * dpr));
  boardCanvas.height = Math.max(1, Math.floor(height * dpr));
  boardWidth = width; boardHeight = height; boardTheme = themeId;
  boardContext = boardCanvas.getContext('2d', { alpha: false });
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
    for (let i = 0; i < 12; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      boardContext.beginPath(); boardContext.moveTo(cx, cy);
      let lx = cx, ly = cy;
      for (let s = 0; s < 4; s++) {
        lx += (Math.random() - 0.5) * TILE_SIZE * 3;
        ly += (Math.random() - 0.5) * TILE_SIZE * 3;
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
// 9. AUDIO
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
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur / 1000);
    return o;
  } catch (e) { return null; }
}

const PENTATONIC_MINOR = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 349.23, 392.00, 466.16];

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
    playTone(740, 45, 0.11, 'square');
    setTimeout(() => playTone(1108, 60, 0.13, 'square'), 40);
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
    o.frequency.exponentialRampToValueAtTime(55, now + 1.2);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
    o.connect(g); g.connect(a.destination);
    o.start(now); o.stop(now + 1.3);
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
// 10. FURIA
// ========================================================
function triggerFuria() {
  if (isFuria || getFuriaCooldownRemaining() > 0 || !isGameRunning || isPaused || countdownEndsAt !== null) return;
  isFuria = true;
  furiaReadyAt = gameTime + FURIA_DURATION_MS;
  furiaCooldownUntil = furiaReadyAt + FURIA_COOLDOWN_MS;
  isOnFire = false; fireExpiresAt = 0;
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
        x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: 2.5 + Math.random() * 3,
        color: ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'][i % 4],
        alpha: 1, decay: 0.022
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

function getFuriaCooldownRemaining() { return Math.max(0, furiaCooldownUntil - gameTime); }

function updateFuriaUI() {
  if (!btnTurbo) return;
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

// ========================================================
// 11. EFECTOS VISUALES
// ========================================================
function triggerHeadPulse(color = '#d5bd70') { headPulse = 1; headPulseColor = color; }

function spawnFloatingText(text, x, y, color = '#4ec9a0') {
  const max = window.innerWidth <= 768 ? 3 : 8;
  if (floatingTexts.length >= max) floatingTexts.splice(0, floatingTexts.length - max + 1);
  let ty = y - 38; let tx = x;
  for (const ft of floatingTexts) {
    if (Math.abs(ft.x - tx) < 48 && Math.abs(ft.y - ty) < 32) { ty -= 22; tx += (Math.random() > 0.5 ? 24 : -24); }
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
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: 2.2, color: colors[i % colors.length], alpha: 0.8, decay: 0.09 });
  }
}
function spawnFuriaTrail(x, y) {
  const colors = ['#ef4c24', '#ff7a24', '#ffc04d', '#fff0a3'];
  const back = Math.atan2(-direction.y, -direction.x);
  for (let i = 0; i < 3; i++) {
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
  const colors = ['#b3e5ff', '#d9f0ff', '#ffffff'];
  for (let i = 0; i < 3; i++) {
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
  const MAX_PARTICLES = window.innerWidth <= 768 ? 60 : 150;
  const screenW = window.innerWidth, screenH = window.innerHeight;
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (updateState) { p.x += p.vx; p.y += p.vy; p.alpha -= p.decay; }
    const isOffScreen = p.x < -50 || p.x > screenW + 50 || p.y < -50 || p.y > screenH + 50;
    if (p.alpha <= 0 || isOffScreen) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    if (updateState) { ft.y += ft.vy; ft.alpha -= 0.028; ft.life += 1; ft.scale = Math.min(1, ft.scale + 0.15); }
    if (ft.alpha <= 0) { floatingTexts.splice(i, 1); continue; }
    ctx.globalAlpha = ft.alpha;
    const fontSize = Math.round(13 * ft.scale);
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
// 12. INMUNIDAD / FREEZE / AIRE
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

// ✅ FIX: resto del código igual, pero con las correcciones clave:
// - startGameLoop / stopGameLoop robustos
// - isLoopRunning controla duplicaciones
// - gameLoopFrame NO pide frame si está pausado O si no está corriendo
// - togglePause ya no llama startGameLoop duplicado
// - welcomeDemoFrame se detiene si welcome está oculto

// ... (resto del código: spawns, AI, draw, etc. — igual que el original
//      pero con las correcciones de pausa y sin PWA)

// ========================================================
// 15. LOOP ROBUSTO (corregido)
// ========================================================
function getCurrentSpeed() {
  const sel = difficultySelect.value;
  const base = SPEEDS[sel] || SPEEDS.medium;
  const lengthPenalty = Math.max(0, snake.length - 3) * 1.2;
  let adaptive = Math.max(base * 0.78, base - lengthPenalty);
  if (isFuria) adaptive *= 0.55;
  else if (airBoostUntil > gameTime) adaptive *= AIR_BOOST_MULTIPLIER;
  if (GAME_MODES[gameModeSelect.value]?.hasHuntTrail && snake.length > 0) {
    const head = snake[0];
    if (huntTrail.some(t => t.x === head.x && t.y === head.y)) adaptive *= HUNT_TRAIL_SLOW_FACTOR;
  }
  return Math.max(16, adaptive);
}
function snapshotRenderPositions() {
  previousSnakePositions = snake.map(s => ({ ...s }));
  previousGuardianPositions = new Map(enemyGuardians.map(g => [g.id, g.segments.map(s => ({ ...s }))]));
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

  // Si ya no está corriendo, no pedir más frames
  if (!isGameRunning) {
    isLoopRunning = false;
    lastFrameTimestamp = null;
    return;
  }

  // ✅ FIX: si está pausado, solo dibujamos el frame actual SIN acumular tiempo.
  // NO pedimos frame aquí — se pedirá desde togglePause() cuando se reanude.
  if (isPaused) {
    lastFrameTimestamp = null;
    draw(renderInterpolation, false);
    isLoopRunning = false;
    return;
  }

  const elapsedMs = lastFrameTimestamp === null ? 0 : Math.max(0, Math.min(100, timestamp - lastFrameTimestamp));
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
      renderInterpolation = 1;
      scheduleEnemySpawn();
    }
  } else {
    updateEffects = true;
    updateGameTimers(elapsedMs);
    if (!isGameRunning) {
      isLoopRunning = false;
      lastFrameTimestamp = null;
      return;
    }
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

  draw(renderInterpolation, updateEffects);

  if (isGameRunning && !isPaused) {
    animationFrameId = requestAnimationFrame(gameLoopFrame);
  } else {
    isLoopRunning = false;
  }
}

function startGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  isLoopRunning = true;
  lastFrameTimestamp = null;
  animationFrameId = requestAnimationFrame(gameLoopFrame);
}

function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  isLoopRunning = false;
  lastFrameTimestamp = null;
}

// ... resto del código igual, con estos cambios:
// - togglePause() ya NO llama startGameLoop() al reanudar si isLoopRunning es true.
// - resumeIfWasRunning() solo reanuda si estaba pausado y corriendo.

function togglePause() {
  if (!isGameRunning) return;
  if (!isPaused) {
    isPaused = true;
    stopMusic();
    updateFuriaUI();
  } else {
    isPaused = false;
    lastFrameTimestamp = null;
    simulationAccumulator = 0;
    startMusic();
    if (animationFrameId === null) {
      startGameLoop();
    }
    updateFuriaUI();
  }
}

function resumeIfWasRunning(wasRunning) {
  if (!wasRunning) return;
  if (!isPaused) {
    if (animationFrameId === null && isGameRunning) startGameLoop();
    return;
  }
  isPaused = false;
  lastFrameTimestamp = null;
  simulationAccumulator = 0;
  startMusic();
  if (animationFrameId === null) {
    startGameLoop();
  }
  updateFuriaUI();
}

// welcomeDemoFrame corregido:
function welcomeDemoFrame(timestamp) {
  welcomeDemoFrameId = null;
  if (welcomeScreen.classList.contains('hidden')) {
    welcomeDemoLastFrame = null;
    return; // ✅ FIX: no pedir más frames
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
function stopWelcomeDemo() {
  if (welcomeDemoFrameId !== null) { cancelAnimationFrame(welcomeDemoFrameId); welcomeDemoFrameId = null; }
  welcomeDemoLastFrame = null;
}

// gameOver() debe resetear BadgeManager
function gameOver(reason = 'Has chocado con tu propio cuerpo.') {
  finishRunStatistics();
  const coinsEarned = Math.floor(score / 10);
  isGameRunning = false;
  isPaused = false;

  stopGameLoop();
  cancelCountdown();
  clearFireBreath();
  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0;
  BadgeManager.resetAll();  // ✅ FIX: oculta TODOS los badges de golpe
  airBoostUntil = 0;
  updateFuriaUI();
  enemySpawnAt = null; jadeSpawnAt = null; freezeSpawnAt = null;
  guardiansFrozenUntil = 0; freezeFoods = []; airFoods = [];
  sacredRainUntil = 0; nextSacredRainAt = null;
  nextCosmicOrderSpawnAt = null; cosmicOrderResolveAt = null; cosmicOrderFlashStartedAt = null;
  cosmicOrderFoods = []; sacrificeFoods = []; skullFoods = [];
  nextSkullMoveAt = null; nextSacrificeSpawnAt = null; nextSkullSpawnAt = null;
  respawnProtectedUntil = 0;
  enemyGuardians = []; particles = [];
  deactivateImmunity();
  isOnFire = false; fireExpiresAt = 0;
  eclipseActive = false;
  huntTrail = [];

  stopMusic();
  playGameOverSound();
  vibrate([80, 50, 80, 50, 150]);

  overlayReason.textContent = reason;
  finalScoreElement.textContent = score;
  finalLengthElement.textContent = snake.length;
  if (finalCoinsElement) finalCoinsElement.textContent = coinsEarned;
  gameOverlay.classList.remove('hidden');
  document.body.classList.add('gameover-open');
  dtStartBtn.textContent = '▶ Iniciar';
}

// ========================================================
// 24. TUTORIAL Y MODALES
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
  const wasRunning = isGameRunning;
  tutorialOpenedFromWelcome = !welcomeScreen.classList.contains('hidden');
  if (wasRunning && !isPaused) togglePause();
  if (!tutorialOpenedFromWelcome) document.body.appendChild(tutorialModal);
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
  if (card && tutorialModal.parentElement !== card) card.insertBefore(tutorialModal, welcomeStartBtn);
  if (tutorialOpenedFromWelcome) {
    welcomeScreen.classList.remove('hidden');
    startWelcomeDemo();
  }
  welcomeStartBtn.classList.toggle('hidden', welcomeScreen.classList.contains('hidden') || !tutorialModal.classList.contains('hidden'));
  tutorialOpenedFromWelcome = false;
  const wasRunning = tutorialModal.dataset.wasRunning === '1';
  delete tutorialModal.dataset.wasRunning;
  resumeIfWasRunning(wasRunning);
}

// ... resto igual

// ========================================================
// 25. CONTROLES
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
  if (e.key === 'Escape' && !achievementsModal.classList.contains('hidden')) { closeAchievements(); return; }
  if (e.key === 'Escape' && !customizeModal.classList.contains('hidden')) { closeCustomize(false); return; }
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
// 31. INICIALIZACIÓN
// ========================================================
function init() {
  updateSoundUI();
  if (settingsDpadToggle) settingsDpadToggle.checked = showDpad;
  if (touchControls) touchControls.classList.toggle('hidden', !showDpad);
  updateScoresUI();
  updateStatisticsUI();
  showTutorialStep(1);

  lives = MAX_LIVES;
  updateLivesUI();

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}