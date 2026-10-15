// ========================================================
// LA TRAVESÍA DE KUKULCÁN — script.js (v8 fixed)
// ========================================================

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
const settingsStatsBtn = document.getElementById('settings-stats-btn');
const settingsTutorialBtn = document.getElementById('settings-tutorial-btn');
const settingsRestartBtn = document.getElementById('settings-restart-btn');
const settingsApplyBtn = document.getElementById('settings-apply-btn');

// ========================================================
// HELPERS DE MODALES
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
    (pauseOverlay && !pauseOverlay.classList.contains('hidden'))
  );
}

// ========================================================
// 5.1. OBJETIVOS.
// ========================================================
let objectivesFilter = 'all';

const OBJECTIVES = [
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

let achievementToastQueue = [];
let achievementToastActive = false;

function checkAchievements() {
  if (typeof OBJECTIVES === 'undefined' || !Array.isArray(OBJECTIVES)) {
    console.warn('[Kukulcán] OBJECTIVES no disponible aún');
    return [];
  }
  const newlyUnlocked = [];
  OBJECTIVES.forEach(ach => {
    if (progression.achievements[ach.id]) return;
    try {
      if (ach.check(progression)) {
        progression.achievements[ach.id] = Date.now();
        newlyUnlocked.push(ach);
      }
    } catch (e) {
      console.warn('[Kukulcán] Error en objetivo', ach.id, e);
    }
  });
  if (newlyUnlocked.length > 0) {
    saveProgression();
    newlyUnlocked.forEach(ach => achievementToastQueue.push(ach));
    processAchievementToastQueue();
    // ✅ refrescar objetivos si el modal está abierto
    if (objectivesModal && !objectivesModal.classList.contains('hidden')) {
      renderObjectivesUI();
    }
  }
  return newlyUnlocked;
}

function processAchievementToastQueue() {
  if (achievementToastActive) return;
  if (achievementToastQueue.length === 0) return;
  achievementToastActive = true;
  const ach = achievementToastQueue.shift();
  showAchievementToast(ach, () => {
    achievementToastActive = false;
    setTimeout(processAchievementToastQueue, 400);
  });
}

function showAchievementToast(achievement, onDone) {
  const container = document.getElementById('achievement-toast-container');
  if (!container) { if (onDone) onDone(); return; }

  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="achievement-toast-icon">${achievement.icon}</div>
    <div class="achievement-toast-content">
      <div class="achievement-toast-title">¡Objetivo cumplido!</div>
      <div class="achievement-toast-name">${achievement.name}</div>
      <div class="achievement-toast-desc">${achievement.description}</div>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  playAchievementSound();
  vibrate([20, 40, 20]);
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.remove();
      if (onDone) onDone();
    }, 500);
  }, 3200);
}

function playAchievementSound() {
  if (isMuted) return;
  if (!getAudioContext()) return;
  try {
    playTone(523, 100, 0.15, 'triangle');
    setTimeout(() => { if (isMuted) return; playTone(659, 100, 0.15, 'triangle'); }, 80);
    setTimeout(() => { if (isMuted) return; playTone(784, 150, 0.18, 'triangle'); }, 160);
    setTimeout(() => { if (isMuted) return; playTone(1046, 250, 0.2, 'sine'); }, 240);
  } catch (e) {}
}

// ========================================================
// PROGRESO DETALLADO DE OBJETIVOS
// ========================================================
function getObjectiveProgress(ach) {
  const p = progression;
  switch (ach.id) {
    case 'first_maize':  return { current: Math.min(p.totalMaize, 1), target: 1, unit: 'maíz' };
    case 'maize_100':    return { current: Math.min(p.totalMaize, 100), target: 100, unit: 'maíces' };
    case 'maize_1000':   return { current: Math.min(p.totalMaize, 1000), target: 1000, unit: 'maíces' };
    case 'cacao_50':     return { current: Math.min(p.totalCacao, 50), target: 50, unit: 'cacao' };
    case 'guardian_10':  return { current: Math.min(p.totalGuardiansDefeated, 10), target: 10, unit: 'guardianes' };
    case 'guardian_100': return { current: Math.min(p.totalGuardiansDefeated, 100), target: 100, unit: 'guardianes' };
    case 'tezcat_1':     return { current: Math.min(p.totalTezcatlipocaDefeated, 1), target: 1, unit: 'Tezcatlipoca' };
    case 'tezcat_10':    return { current: Math.min(p.totalTezcatlipocaDefeated, 10), target: 10, unit: 'Tezcatlipoca' };
    case 'survive_5min': return {
      current: Math.min(Math.floor(p.totalSurvivalMs / 60000), 5),
      target: 5,
      unit: 'minutos'
    };
    case 'games_50':     return { current: Math.min(p.totalGamesPlayed, 50), target: 50, unit: 'partidas' };
    case 'timed_500':    return { current: Math.min(p.bestTimedScore, 500), target: 500, unit: 'puntos' };
    default: return null;
  }
}

function getNextObjective() {
  const pending = OBJECTIVES
    .filter(a => !progression.achievements[a.id])
    .map(a => ({ ach: a, prog: getObjectiveProgress(a) }))
    .filter(x => x.prog);

  if (pending.length === 0) return null;

  // Elegir el más cercano a completarse (mayor ratio)
  pending.sort((a, b) => {
    const ratioA = a.prog.current / a.prog.target;
    const ratioB = b.prog.current / b.prog.target;
    return ratioB - ratioA;
  });
  return pending[0];
}

// ========================================================
// OBJETIVOS — RENDER
// ========================================================

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
      objectivesNext.innerHTML =
        `Próximo objetivo: <strong>${next.ach.name}</strong> — ` +
        `${p.current} / ${p.target} ${p.unit} (${pctNext}%)`;
    } else {
      objectivesNext.innerHTML = `🎉 ¡Has completado todos los objetivos!`;
    }
  }

  const visible = OBJECTIVES.filter(a => {
    const completed = !!progression.achievements[a.id];
    if (objectivesFilter === 'pending') return !completed;
    if (objectivesFilter === 'done')    return completed;
    return true;
  });

  objectivesList.innerHTML = '';
  if (visible.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'objectives-empty';
    empty.textContent = objectivesFilter === 'pending'
      ? '¡No queda ningún objetivo pendiente!'
      : 'Aún no has completado ningún objetivo.';
    objectivesList.appendChild(empty);
    return;
  }

  // Config del anillo SVG
  const R = 40;                    // radio
  const CIRC = 2 * Math.PI * R;    // circunferencia

  visible.forEach(ach => {
    const completed = !!progression.achievements[ach.id];
    const prog = getObjectiveProgress(ach);
    const ratio = prog ? Math.min(1, prog.current / prog.target) : (completed ? 1 : 0);
    const dashOffset = CIRC * (1 - ratio);

    const item = document.createElement('div');
    item.className = `objective-item ${completed ? 'completed' : 'pending'}`;

    const progressText = prog
      ? `${prog.current} / ${prog.target} ${prog.unit}`
      : (completed ? '✓ Completado' : '');

    item.innerHTML = `
      <div class="objective-medallion">
        <svg class="objective-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="objective-ring-bg" cx="50" cy="50" r="${R}" />
          <circle class="objective-ring-fill" cx="50" cy="50" r="${R}"
                  stroke-dasharray="${CIRC.toFixed(2)}"
                  stroke-dashoffset="${dashOffset.toFixed(2)}" />
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
  // ✅ refrescar badge de guardianes por si cambió algo
  updateGuardianBadge();
}

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

    if (gameModeSelect.value === 'timed') {
      progression.bestTimedScore = Math.max(progression.bestTimedScore, score);
    }
    saveProgression();
  } catch (e) { console.warn('[Kukulcán] Error guardando progresión:', e); }

  try { checkAchievements(); } catch (e) { console.warn('[Kukulcán] Error en checkAchievements:', e); }

  runStartedAt = null;
  runDifficulty = null;
  runGuardiansDefeated = 0;
}

// ========================================================
// 8. ESCALADO / CANVAS  ✅ FIX
// ========================================================
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  TILE_SIZE = width < 480 ? 20 : 24;

  const newW = Math.floor(width * dpr);
  const newH = Math.floor(height * dpr);

  // ✅ FIX: solo reasignar width/height si cambió (evita glitches)
  if (canvas.width !== newW || canvas.height !== newH) {
    canvas.width = newW;
    canvas.height = newH;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gridCols = Math.max(14, Math.floor(width / TILE_SIZE));
  gridRows = Math.max(14, Math.floor(height / TILE_SIZE));
  rebuildBoardCanvas(width, height, dpr, false);
  if (!isGameRunning) draw(1, false);
}

function rebuildBoardCanvas(width, height, dpr, force = false) {
  const themeId = progression.selectedTheme || 'classic';
  const needsRebuild =
    force ||
    !boardCanvas ||
    boardWidth !== width ||
    boardHeight !== height ||
    boardTheme !== themeId;

  if (!needsRebuild) return;

  // ✅ FIX: reutilizar canvas existente en vez de crear uno nuevo
  if (!boardCanvas) {
    boardCanvas = document.createElement('canvas');
    boardContext = boardCanvas.getContext('2d', { alpha: false });
  }
  boardCanvas.width = Math.max(1, Math.floor(width * dpr));
  boardCanvas.height = Math.max(1, Math.floor(height * dpr));
  boardWidth = width; boardHeight = height; boardTheme = themeId;

  // ✅ FIX: limpieza explícita antes de redibujar
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
    // ✅ FIX: seed determinista — los cracks no cambian entre rebuilds
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
  if (!isGameRunning && !welcomeScreen.classList.contains('hidden')) return;
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

// ✅ FIX: límite duro + clamp de alpha
function updateAndDrawParticles(updateState = true) {
  const MAX_PARTICLES = window.innerWidth <= 768 ? 60 : 150;
  const screenW = window.innerWidth, screenH = window.innerHeight;

  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }

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

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    if (updateState) { ft.y += ft.vy; ft.alpha -= 0.028; ft.life += 1; ft.scale = Math.min(1, ft.scale + 0.15); }
    if (ft.alpha <= 0) { floatingTexts.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, Math.min(1, ft.alpha));
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

// ========================================================
// 12.5 LOOP ROBUSTO ✅ FIX
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

// ✅ FIX: interpolación fluida sin microsaltos
function gameLoopFrame(timestamp) {
  animationFrameId = null;

  if (!isGameRunning || isPaused) {
    lastFrameTimestamp = null;
    return;
  }

  let elapsedMs = lastFrameTimestamp === null ? 0 : timestamp - lastFrameTimestamp;
  if (elapsedMs > 500) {
    isPaused = true;
    lastFrameTimestamp = null;
    stopMusic();
    stopGameLoop();
    updateFuriaUI();
    updatePauseButtonUI();
    if (!isAnyModalOpen() && pauseOverlay) pauseOverlay.classList.remove('hidden');
    draw(renderInterpolation, false);
    return;
  }
  elapsedMs = Math.max(0, Math.min(100, elapsedMs));
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
    if (!isGameRunning) {
      lastFrameTimestamp = null;
      return;
    }

    // ✅ FIX: capturar la velocidad UNA sola vez por frame
    const speedThisFrame = getCurrentSpeed();
    simulationAccumulator = Math.min(simulationAccumulator + elapsedMs, speedThisFrame * 3);

    let ticks = 0;
    while (
      isGameRunning &&
      !isPaused &&
      countdownEndsAt === null &&
      ticks < 3 &&
      simulationAccumulator >= speedThisFrame
    ) {
      snapshotRenderPositions();
      gameUpdate();
      simulationAccumulator -= speedThisFrame;
      ticks++;
    }

    // ✅ FIX: si el acumulador quedó negativo (tick ligeramente antes de tiempo),
    // lo clampeamos a 0 para evitar interpolaciones negativas que dan tirones.
    if (simulationAccumulator < 0) simulationAccumulator = 0;

    renderInterpolation = Math.min(1, simulationAccumulator / speedThisFrame);
  }

  draw(renderInterpolation, updateEffects);

  if (isGameRunning && !isPaused) {
    animationFrameId = requestAnimationFrame(gameLoopFrame);
  }
}

function startGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  lastFrameTimestamp = null;
  animationFrameId = requestAnimationFrame(gameLoopFrame);
}

function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  lastFrameTimestamp = null;
}

// ========================================================
// 13. GUARDIANES
// ========================================================
function scheduleEnemySpawn(retryDelay = null) {
  const profile = getDifficultyProfile();
  const target = profile.guardianTargets;
  const normalGuardians = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  updateGuardianBadge();
  if (!isGameRunning || normalGuardians >= target || cosmicOrderResolveAt !== null) { enemySpawnAt = null; return; }
  if (isPaused || countdownEndsAt !== null) return;
  const delay = retryDelay ?? (hasSpawnedGuardian ? profile.guardianNextSpawnMs : profile.guardianFirstSpawnMs);
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
      lastMoveTick: -1, targetIndicator: null, recentCells: [],
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
    updateMusicLayer();
    return true;
  }
  return false;
}

function spawnChaac() {
  const difficulty = getEffectiveDifficulty();
  const config = TEZCATLIPOCA_CONFIG[difficulty] || TEZCATLIPOCA_CONFIG.medium;
  const profile = getDifficultyProfile();
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
      id, segments: [{ x, y }], direction: { x: 1, y: 0 }, tickCounter: 0,
      expiresAt: gameTime + profile.chaacLifetimeMs,
      frozenAt: guardiansFrozenUntil > gameTime ? gameTime : null,
      palette: def.palette, behavior: { id: def.behavior, name: def.name },
      traits: def.traits, ambientParticles: def.ambientParticles,
      nextTeleportAt: gameTime + config.teleportMs, teleportFlash: 0, teleportDest: null,
      smokeParticles: [], lastMoveTick: -1, targetIndicator: null, recentCells: [],
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
  const hasTezcatlipoca = enemyGuardians.some(g => g.behavior.id === 'ambusher');
  const names = [...new Set(enemyGuardians.map(g => g.behavior.name))];
  const desktopText = hasTezcatlipoca ? `👁️ ¡TEZCATLIPOCA al acecho!` : (count === 1 ? `${names[0]} al acecho` : `${count} guardianes: ${names.join(' · ')}`);
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

function updateGuardianAmbientParticles() {
  if (isPaused || cosmicOrderResolveAt !== null) return;
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
  let normalCount = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  if (normalCount > target) {
    for (let i = enemyGuardians.length - 1; i >= 0 && normalCount > target; i--) {
      if (enemyGuardians[i] && enemyGuardians[i].behavior.id !== 'ambusher') { enemyGuardians.splice(i, 1); normalCount--; }
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
  if (g.smokeParticles) g.smokeParticles = [];
  if (spawnBonus) {
    g.segments.forEach(s => { bonusFoods.push({ x: s.x, y: s.y, expiresAt: gameTime + 12000 }); });
    if (g.behavior.id === 'ambusher') {
      const head = g.segments[0];
      bonusFoods.push({ x: head.x, y: head.y, expiresAt: gameTime + 15000, isBossDrop: true });
      progression.totalTezcatlipocaDefeated++;
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
    }
  }
  updateGuardianBadge();
  scheduleEnemySpawn();
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
      { x: (x + 1) % gridCols, y }, { x: (x - 1 + gridCols) % gridCols, y },
      { x, y: (y + 1) % gridRows }, { x, y: (y - 1 + gridRows) % gridRows }
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
  enemyGuardians.forEach(g => { g.segments.forEach(s => { occupiedByGuardians[`${s.x},${s.y}`] = true; }); });

  for (const g of [...enemyGuardians]) {
    if (g.destroyed) continue;
    g.tickCounter++;

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

      if (isVulnerable) {
        const head = g.segments[0];
        const touches = snake.some(s => Math.abs(s.x - head.x) <= 1 && Math.abs(s.y - head.y) <= 1);
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
            spawnFloatingText(`+${reward} ${symbol} ¡TEZCATLIPOCA VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
            updateScoresUI();
            destroyEnemySnake(g.id);
            continue;
          } else {
            screenShake = 12;
            loseLife('¡Tezcatlipoca, el jaguar de obsidiana, te devoró!');
            return;
          }
        }
        continue;
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
          const reward = furia ? FURIA_GUARDIAN_REWARD : profile.bossReward;
          screenShake = 12;
          playEnemyDefeatedSound();
          vibrate([40, 30, 40, 30, 60]);
          runGuardiansDefeated++;
          score += reward;
          spawnFloatingText(`+${reward} ${symbol} ¡TEZCATLIPOCA VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
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

    const interval = moveInterval + (g.behavior.id === 'interceptor' ? 1 : 0);
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
      let score = 0;
      const target = getGuardianTarget(g, playerHead, null);
      let dx = target.x - newX;
      let dy = target.y - newY;
      if (Math.abs(dx) > gridCols / 2) dx = -Math.sign(dx) * (gridCols - Math.abs(dx));
      if (Math.abs(dy) > gridRows / 2) dy = -Math.sign(dy) * (gridRows - Math.abs(dy));
      const dist = Math.abs(dx) + Math.abs(dy);
      if (isFleeing) score -= dist * 10;
      else score -= dist * 10;
      const freeSpace = floodFillCount(newX, newY, 12, occupiedByGuardians);
      score += freeSpace * 1.5;
      if (g.recentCells.includes(cand.key)) score -= 50;
      const difficulty = getEffectiveDifficulty();
      let errorChance = 0;
      if (difficulty === 'easy') errorChance = 0.35;
      else if (difficulty === 'medium') errorChance = 0.2;
      else if (difficulty === 'hard') errorChance = 0.1;
      else if (difficulty === 'extreme') errorChance = 0.05;
      if (Math.random() < errorChance) score += (Math.random() - 0.5) * 200;
      if (score > bestScore) { bestScore = score; bestDir = dir; }
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
        screenShake = 10;
        playEnemyDefeatedSound();
        vibrate(35);
        runGuardiansDefeated++;
        score += reward;
        spawnFloatingText(`+${reward} ${symbol} ¡GUARDIÁN VENCIDO!`, playerHead.x * TILE_SIZE + TILE_SIZE / 2, playerHead.y * TILE_SIZE, color);
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
// 14. SPAWN HELPERS
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
  const defeated = enemyGuardians;
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
  enemyGuardians = [];
  previousGuardianPositions.clear();
  particles = particles.filter(p => p.decay > 0.03 || p.alpha > 0.5);
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
// 15. TIMERS
// ========================================================
function updateGameTimers(elapsedMs) {
  gameTime += elapsedMs;
  if (headPulse > 0) headPulse = Math.max(0, headPulse - elapsedMs / 240);
  updateMusicLayer();

  if (guardiansFrozenUntil > 0) {
    if (gameTime >= guardiansFrozenUntil) {
      enemyGuardians.forEach(g => { g.frozenAt = null; });
      guardiansFrozenUntil = 0;
      BadgeManager.setVisible('freeze', false);
    } else {
      if (freezeTimerSpan) freezeTimerSpan.textContent = String(Math.ceil((guardiansFrozenUntil - gameTime) / 1000));
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
      if (respawnTimerSpan) respawnTimerSpan.textContent = String(Math.ceil((respawnProtectedUntil - gameTime) / 1000));
    }
  }

  if (enemySpawnAt !== null && gameTime >= enemySpawnAt) {
    enemySpawnAt = null;
    const ok = spawnEnemySnake();
    scheduleEnemySpawn(ok ? null : 1500);
  }

  const profile = getDifficultyProfile();
  const effectiveDiff = getEffectiveDifficulty();
  const tezConfig = TEZCATLIPOCA_CONFIG[effectiveDiff] || TEZCATLIPOCA_CONFIG.medium;

  if (gameTime >= tezConfig.unlockMs &&
      enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length >= 2 &&
      !enemyGuardians.some(g => g.behavior.id === 'ambusher')) {
    if (!nextChaacSpawnAt || gameTime >= nextChaacSpawnAt) {
      const spawned = spawnChaac();
      if (!spawned) nextChaacSpawnAt = gameTime + CHAAC_RETRY_MS;
    }
  }

  const bossActive = enemyGuardians.find(g => g.behavior.id === 'ambusher');
  if (bossActive && Math.random() < 0.35) {
    const head = bossActive.segments[0];
    particles.push({
      x: head.x * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      y: head.y * TILE_SIZE + TILE_SIZE / 2 + (Math.random() - 0.5) * TILE_SIZE * 1.4,
      vx: (Math.random() - 0.5) * 0.4, vy: -0.5 - Math.random() * 0.5,
      size: 1.5 + Math.random() * 1.5,
      color: Math.random() > 0.5 ? '#d98e2b' : '#14110f',
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
    } else {
      if (rainTimerSpan) rainTimerSpan.textContent = String(Math.ceil((sacredRainUntil - gameTime) / 1000));
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
  const normalCount = enemyGuardians.filter(g => g.behavior.id !== 'ambusher').length;
  if (isGameRunning && !isPaused && countdownEndsAt === null &&
      cosmicOrderResolveAt === null && normalCount < target && enemySpawnAt === null) {
    scheduleEnemySpawn();
  }

  if (cosmicOrderFlashStartedAt !== null && gameTime - cosmicOrderFlashStartedAt >= COSMIC_ORDER_FLASH_DURATION_MS) {
    cosmicOrderFlashStartedAt = null;
  }
  if (bonusFoods.length > 0) bonusFoods = bonusFoods.filter(f => !f.expiresAt || f.expiresAt > gameTime);
  if (huntTrail.length > 0) huntTrail = huntTrail.filter(t => t.expiresAt > gameTime);

  // ✅ FIX: límite de partículas antes de spawnear trail
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
// 16. MECÁNICAS POR MODO
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
        {
          type: 'no_maize',
          description: '💀 Prueba de Xibalbá: NO recojas maíz durante 10 segundos',
          shortDescription: 'No recojas maíz',
          durationMs: XIBALBA_DURATION_MS
        },
        {
          type: 'center_cross',
          description: '💀 Prueba de Xibalbá: cruza el centro del tablero',
          shortDescription: 'Cruza el centro',
          durationMs: XIBALBA_DURATION_MS
        },
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
}

// ========================================================
// 17. RESET / GAME OVER
// ========================================================
function ensureFoodCount(count = 6) {
  let attempts = 0;
  while (foods.length < count && attempts < gridCols * gridRows) {
    attempts++;
    const x = Math.floor(Math.random() * gridCols);
    const y = Math.floor(Math.random() * gridRows);
    if (isGuardianCellOccupied(x, y)) continue;
    foods.push({ x, y, shape: Math.floor(Math.random() * 6), offering: Math.random() < 0.35 ? 'cacao' : 'common' });
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
  lastSkullPosition = null; nextSkullMoveAt = null;
  isOnFire = false; fireExpiresAt = 0;
  BadgeManager.setVisible('sacrificeOffering', false);
  BadgeManager.setVisible('skullFood', false);
  BadgeManager.setVisible('cosmicOrder', false);
  BadgeManager.setVisible('cosmicOrderFood', false);
  BadgeManager.setVisible('rain', false);

  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0;
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
  BadgeManager.setVisible('freeze', false);
  enemyGuardians = []; hasSpawnedGuardian = false; usedGuardianPalettes = [];
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
  activeXibalbaTrial = null;
  nextXibalbaTrialAt = mode.name === 'Supervivencia' ? XIBALBA_FIRST_MS : null;
  xibalbaMaizeBlocked = false;

  BadgeManager.setVisible('timer', false);
  BadgeManager.setVisible('eclipse', false);
  BadgeManager.setVisible('xibalba', false);
  BadgeManager.setVisible('darkness', false);
  if (timerBadge) timerBadge.classList.remove('critical');

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

function loseLife(reason) {
  if (!GAME_MODES[gameModeSelect.value].livesEnabled) { gameOver(reason); return; }
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
      particles.push({ x: hx, y: hy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 2 + Math.random() * 2, color: ['#ef5261', '#9b2929', '#f5efdc'][i % 3], alpha: 1, decay: 0.03 });
    }
  }

  if (lives === 0) { gameOver(`${reason} Se agotaron los tres sacrificios.`); return; }
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
  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0;
  BadgeManager.setVisible('furia', false);
  isOnFire = false; fireExpiresAt = 0;
  airBoostUntil = 0;
  BadgeManager.setVisible('air', false);
  updateFuriaUI();
  respawnProtectedUntil = gameTime + RESPAWN_PROTECTION_MS;
  if (respawnTimerSpan) respawnTimerSpan.textContent = String(Math.ceil(RESPAWN_PROTECTION_MS / 1000));
  BadgeManager.setVisible('respawn', true);
  triggerHeadPulse('#4ec9a0');
  if (prevHead) spawnFloatingText('🫀 Sacrificio perdido', prevHead.x * TILE_SIZE + TILE_SIZE / 2, prevHead.y * TILE_SIZE, '#ef5261');
  updateScoresUI();
  if (sacrificeFoods.length === 0) nextSacrificeSpawnAt = gameTime + SACRIFICE_RESPAWN_DELAY_MS;
  updateMusicLayer();
}

// ========================================================
// 18. UPDATE POR TICK
// ========================================================
function gameUpdate() {
  if (isPaused || !isGameRunning || countdownEndsAt !== null) return;
  if (directionQueue.length > 0) direction = directionQueue.shift();

  const moveDir = direction;

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
    loseLife('¡La Calavera maldita te arrebató un sacrificio!');
    return;
  }

  const hitG = enemyGuardians.find(g => {
    if (g.destroyed) return false;
    if (g.behavior.id === 'ambusher') return g.segments.some(s => Math.abs(s.x - head.x) <= 1 && Math.abs(s.y - head.y) <= 1);
    return g.segments.some(s => s.x === head.x && s.y === head.y);
  });
  if (hitG && !hitG.destroyed) {
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
      spawnFloatingText(`+${reward} ${symbol} ${isBoss ? '¡TEZCATLIPOCA VENCIDO!' : '¡GUARDIÁN VENCIDO!'}`, head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE, color);
      updateScoresUI();
      destroyEnemySnake(hitG.id);
    } else {
      screenShake = isBoss ? 12 : 8;
      loseLife(isBoss ? '¡Tezcatlipoca, el jaguar de obsidiana, te devoró!' : `¡El ${hitG.behavior.name} te alcanzó!`);
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
      score += 50;
      progression.maizeCoins += 2;
      triggerHeadPulse('#facc15');
      spawnFloatingText('+50', hx, hy, '#facc15');
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
      const foodScore = 10 + maizeBonus;
      score += foodScore;
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
      ateItem = true;
    }
  }

  if (!ateItem) snake.pop();

  if (crossed) spawnWorldCrossingEffect(head.x * TILE_SIZE + TILE_SIZE / 2, head.y * TILE_SIZE + TILE_SIZE / 2);

  // ✅ FIX: límite de partículas antes de spawnear trail
  if (isFuria && snake.length > 0) {
    const tail = snake[snake.length - 1];
    if (particles.length < 120) {
      spawnFuriaTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
    }
  } else if (airBoostUntil > gameTime && snake.length > 0) {
    const tail = snake[snake.length - 1];
    if (particles.length < 100) {
      spawnAirTrail(tail.x * TILE_SIZE + TILE_SIZE / 2, tail.y * TILE_SIZE + TILE_SIZE / 2);
    }
  }

  updateEnemySnakeAI();
  updateMusicLayer();
}

// ========================================================
// 19. UI
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
// 20. HELPERS DE DIBUJO
// ========================================================
function interpolateGridPosition(current, previous, progress) {
  if (!previous || progress >= 1) return { ...current };

  let dx = current.x - previous.x;
  let dy = current.y - previous.y;

  // Wrap horizontal
  if (dx > gridCols / 2) dx -= gridCols;
  else if (dx < -gridCols / 2) dx += gridCols;

  // Wrap vertical
  if (dy > gridRows / 2) dy -= gridRows;
  else if (dy < -gridRows / 2) dy += gridRows;

  // ✅ FIX: si el salto es demasiado grande (la serpiente creció y cambió el índice),
  // no interpolar — devolver la posición actual directa para evitar el tirón.
  if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) {
    return { ...current };
  }

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
  ctx.restore();
}

function drawFeatherScale(segment, index, guardian) {
  const cx = segment.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = segment.y * TILE_SIZE + TILE_SIZE / 2;
  const size = TILE_SIZE < 22 ? 3 : 4;
  const type = guardian.behavior.id;
  const pal = guardian.palette;
  ctx.save();
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
  } else {
    ctx.globalAlpha = index % 2 === 0 ? 0.75 : 0.5;
    ctx.fillStyle = pal.crest;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size); ctx.lineTo(cx + size * 0.55, cy); ctx.lineTo(cx, cy + size); ctx.lineTo(cx - size * 0.55, cy);
    ctx.closePath(); ctx.fill();
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
  ctx.restore();
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

  ctx.save();
  ctx.fillStyle = HEAD_FILL;
  roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
  ctx.fill();
  ctx.strokeStyle = skin.border || GOLD_PALE;
  ctx.lineWidth = isGolden ? 1.8 : 1.4;
  roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineCap = 'round';

  ctx.save();
  const helmCenterX = cx - dir.x * TILE_SIZE * 0.02;
  const helmCenterY = cy - dir.y * TILE_SIZE * 0.02;
  const helmW = TILE_SIZE * 0.7;
  const helmH = TILE_SIZE * 0.22;
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
  ctx.shadowColor = JADE_EYE;
  ctx.shadowBlur = isGolden ? 7 : 4;
  ctx.beginPath();
  ctx.moveTo(0, -helmH / 2 - TILE_SIZE * 0.15 - 2);
  ctx.lineTo(2.5, -helmH / 2 - TILE_SIZE * 0.15 + 1.5);
  ctx.lineTo(0, -helmH / 2 - TILE_SIZE * 0.15 + 5);
  ctx.lineTo(-2.5, -helmH / 2 - TILE_SIZE * 0.15 + 1.5);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = GOLD_PALE;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.fillStyle = GOLD_DEEP;
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(side * helmW * 0.35, -helmH / 2 - TILE_SIZE * 0.15 + helmH / 2, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
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
      ctx.shadowColor = JADE_EYE; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.ellipse(gcx, gcy, eyeW / 2, eyeH / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0e1a14';
      ctx.beginPath(); ctx.ellipse(gcx, gcy, eyeW * 0.1, eyeH * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath(); ctx.ellipse(gcx - 0.8, gcy - 1, eyeW * 0.22, eyeH * 0.22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = GOLD_MAIN; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(gcx, gcy, eyeW / 2 + 0.6, eyeH / 2 + 0.6, 0, 0, Math.PI * 2); ctx.stroke();
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

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = GOLD_MAIN;
  const frx = cx - dir.x * TILE_SIZE * 0.05;
  const fry = cy - dir.y * TILE_SIZE * 0.05;
  ctx.beginPath();
  ctx.moveTo(frx, fry - 2); ctx.lineTo(frx + 1.6, fry); ctx.lineTo(frx, fry + 2); ctx.lineTo(frx - 1.6, fry);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(frx, fry, 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = GOLD_MAIN;
  const lx1 = cx + perp.x * TILE_SIZE * 0.28 - dir.x * 2;
  const ly1 = cy + perp.y * TILE_SIZE * 0.28 - dir.y * 2;
  ctx.beginPath();
  ctx.moveTo(lx1, ly1 - 1.4); ctx.lineTo(lx1 + 1.1, ly1); ctx.lineTo(lx1, ly1 + 1.4); ctx.lineTo(lx1 - 1.1, ly1);
  ctx.closePath(); ctx.fill();
  const lx2 = cx - perp.x * TILE_SIZE * 0.28 - dir.x * 2;
  const ly2 = cy - perp.y * TILE_SIZE * 0.28 - dir.y * 2;
  ctx.beginPath();
  ctx.moveTo(lx2, ly2 - 1.4); ctx.lineTo(lx2 + 1.1, ly2); ctx.lineTo(lx2, ly2 + 1.4); ctx.lineTo(lx2 - 1.1, ly2);
  ctx.closePath(); ctx.fill();
  ctx.restore();

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
      ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
    }
  }
  ctx.restore();

  const showTongue = protectedFlag || headPulse > 0.6 || isGolden;
  if (showTongue) {
    ctx.save();
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
    ctx.restore();
  }
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
  ctx.save();
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
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(tipCX - 0.6, tipCY - 0.6, 0.9, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawGuardianHead(rs, guardian) {
  const cx = rs.x * TILE_SIZE + TILE_SIZE / 2;
  const cy = rs.y * TILE_SIZE + TILE_SIZE / 2;
  const dir = guardian.direction || { x: 1, y: 0 };
  const perp = { x: -dir.y, y: dir.x };
  const rear = { x: cx - dir.x * TILE_SIZE * 0.35, y: cy - dir.y * TILE_SIZE * 0.35 };
  if (guardian.behavior.id === 'ambusher') { drawTezcatlipoca(rs, guardian, cx, cy, dir, perp, rear); return; }
  const pal = guardian.palette;
  const type = guardian.behavior.id;
  const eo = 5, es = 4;
  let e1x = rs.x * TILE_SIZE + eo, e1y = rs.y * TILE_SIZE + eo;
  let e2x = rs.x * TILE_SIZE + TILE_SIZE - eo - es, e2y = e1y;
  if (dir.y !== 0) { e1y = rs.y * TILE_SIZE + (dir.y > 0 ? TILE_SIZE - eo - es : eo); e2y = e1y; }
  else if (dir.x !== 0) { e1x = rs.x * TILE_SIZE + (dir.x > 0 ? TILE_SIZE - eo - es : eo); e2x = e1x; e2y = rs.y * TILE_SIZE + TILE_SIZE - eo - es; }

  if (type === 'hunter') {
    ctx.save();
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill(); ctx.stroke();
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
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = pal.crest;
      ctx.beginPath();
      ctx.moveTo(earX, earY);
      ctx.lineTo(earX - dir.x * TILE_SIZE * 0.07 + perp.x * side * TILE_SIZE * 0.09, earY - dir.y * TILE_SIZE * 0.07 + perp.y * side * TILE_SIZE * 0.09);
      ctx.lineTo(earX - dir.x * TILE_SIZE * 0.16 - perp.x * side * TILE_SIZE * 0.03, earY - dir.y * TILE_SIZE * 0.16 - perp.y * side * TILE_SIZE * 0.03);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = pal.head;
    }
    for (let side = -1; side <= 1; side += 2) {
      const rx = cx + dir.x * TILE_SIZE * 0.1 + perp.x * side * TILE_SIZE * 0.22;
      const ry = cy + dir.y * TILE_SIZE * 0.1 + perp.y * side * TILE_SIZE * 0.22;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.arc(rx, ry, TILE_SIZE * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = pal.head;
      ctx.beginPath(); ctx.arc(rx, ry, TILE_SIZE * 0.05, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = pal.crest;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.8;
    roundRect(ctx, cx + dir.x * TILE_SIZE * 0.18 - TILE_SIZE * 0.12, cy + dir.y * TILE_SIZE * 0.18 - TILE_SIZE * 0.1, TILE_SIZE * 0.24, TILE_SIZE * 0.2, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1a1008';
    ctx.beginPath();
    ctx.moveTo(cx + dir.x * TILE_SIZE * 0.35, cy + dir.y * TILE_SIZE * 0.35);
    ctx.lineTo(cx + dir.x * TILE_SIZE * 0.22 + perp.x * 2, cy + dir.y * TILE_SIZE * 0.22 + perp.y * 2);
    ctx.lineTo(cx + dir.x * TILE_SIZE * 0.22 - perp.x * 2, cy + dir.y * TILE_SIZE * 0.22 - perp.y * 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff8dc';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.6;
    for (let side = -1; side <= 1; side += 2) {
      const fx = cx + dir.x * TILE_SIZE * 0.28 + perp.x * side * 4;
      const fy = cy + dir.y * TILE_SIZE * 0.28 + perp.y * side * 4;
      ctx.beginPath();
      ctx.moveTo(fx, fy); ctx.lineTo(fx + dir.x * 4, fy + dir.y * 4); ctx.lineTo(fx + perp.x * side * 1.5, fy + perp.y * side * 1.5);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = pal.eye;
    ctx.fillRect(e1x, e1y, es, es);
    ctx.fillRect(e2x, e2y, es, es);
    ctx.fillStyle = '#1a1008';
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) ctx.fillRect(eye.x + 1.5, eye.y + 0.5, 1, 3);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(e1x, e1y, es, es);
    ctx.strokeRect(e2x, e2y, es, es);
  }

  else if (type === 'interceptor') {
    ctx.save();
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill(); ctx.stroke();
    const thirdEyeX = cx + dir.x * TILE_SIZE * 0.12;
    const thirdEyeY = cy + dir.y * TILE_SIZE * 0.12;
    ctx.fillStyle = '#1a0830';
    ctx.beginPath();
    ctx.moveTo(thirdEyeX, thirdEyeY - 3.5); ctx.lineTo(thirdEyeX + 3, thirdEyeY); ctx.lineTo(thirdEyeX, thirdEyeY + 3.5); ctx.lineTo(thirdEyeX - 3, thirdEyeY);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = pal.crest; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.fillStyle = '#f0e0ff';
    ctx.beginPath(); ctx.arc(thirdEyeX, thirdEyeY, 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = pal.crest; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let f = -1; f <= 1; f++) {
      const baseX = rear.x + perp.x * f * 3.5;
      const baseY = rear.y + perp.y * f * 3.5;
      const len = 20 - Math.abs(f) * 3;
      const tipX = rear.x - dir.x * len + perp.x * (f * 5);
      const tipY = rear.y - dir.y * len + perp.y * (f * 5);
      ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
      ctx.fillStyle = pal.crest;
      ctx.beginPath(); ctx.arc(tipX, tipY, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    for (let side = -1; side <= 1; side += 2) {
      const orX = cx + perp.x * side * TILE_SIZE * 0.32 - dir.x * TILE_SIZE * 0.05;
      const orY = cy + perp.y * side * TILE_SIZE * 0.32 - dir.y * TILE_SIZE * 0.05;
      ctx.fillStyle = '#1a0830';
      ctx.strokeStyle = pal.crest;
      ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.arc(orX, orY, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4ec9a0';
      ctx.beginPath(); ctx.arc(orX, orY, 1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = pal.eye;
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) {
      const ecx = eye.x + 2, ecy = eye.y + 2;
      ctx.beginPath();
      ctx.moveTo(ecx, ecy - 3); ctx.lineTo(ecx + 3, ecy); ctx.lineTo(ecx, ecy + 3); ctx.lineTo(ecx - 3, ecy);
      ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) {
      const ecx = eye.x + 2, ecy = eye.y + 2;
      ctx.beginPath();
      ctx.moveTo(ecx, ecy - 3); ctx.lineTo(ecx + 3, ecy); ctx.lineTo(ecx, ecy + 3); ctx.lineTo(ecx - 3, ecy);
      ctx.closePath(); ctx.stroke();
    }
  }

  else if (type === 'flanker') {
    ctx.save();
    ctx.fillStyle = pal.head;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = pal.body;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.9;
    const noseTipX = cx + dir.x * TILE_SIZE * 0.48;
    const noseTipY = cy + dir.y * TILE_SIZE * 0.48;
    const noseBaseX = cx + dir.x * TILE_SIZE * 0.25;
    const noseBaseY = cy + dir.y * TILE_SIZE * 0.25;
    ctx.beginPath();
    ctx.moveTo(noseBaseX + perp.x * 2.5, noseBaseY + perp.y * 2.5);
    ctx.lineTo(noseTipX, noseTipY);
    ctx.lineTo(noseBaseX - perp.x * 2.5, noseBaseY - perp.y * 2.5);
    ctx.lineTo(noseBaseX - perp.x * 1, noseBaseY - perp.y * 1);
    ctx.lineTo(noseBaseX + perp.x * 1, noseBaseY + perp.y * 1);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1a0806';
    ctx.beginPath(); ctx.arc(noseTipX - dir.x * 2, noseTipY - dir.y * 2, 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff8dc';
    for (let i = 0; i < 3; i++) {
      const dx = cx + dir.x * TILE_SIZE * (0.08 + i * 0.07);
      const dy = cy + dir.y * TILE_SIZE * (0.08 + i * 0.07);
      ctx.beginPath();
      ctx.moveTo(dx, dy); ctx.lineTo(dx + dir.x * 2 + perp.x * 1, dy + dir.y * 2 + perp.y * 1); ctx.lineTo(dx + perp.x * 2, dy + perp.y * 2);
      ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = pal.crest; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    for (let side = -1; side <= 1; side += 2) {
      for (let f = -1; f <= 1; f++) {
        const baseX = cx - dir.x * TILE_SIZE * 0.15 + perp.x * side * TILE_SIZE * 0.32;
        const baseY = cy - dir.y * TILE_SIZE * 0.15 + perp.y * side * TILE_SIZE * 0.32;
        const len = 14 - Math.abs(f) * 2;
        const tipX = baseX - dir.x * len + perp.x * side * (6 + f * 1.5);
        const tipY = baseY - dir.y * len + perp.y * side * (6 + f * 1.5);
        ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
        ctx.fillStyle = pal.crest;
        ctx.beginPath(); ctx.arc(tipX, tipY, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (let side = -1; side <= 1; side += 2) {
      const orX = cx + perp.x * side * TILE_SIZE * 0.34 - dir.x * TILE_SIZE * 0.08;
      const orY = cy + perp.y * side * TILE_SIZE * 0.34 - dir.y * TILE_SIZE * 0.08;
      ctx.fillStyle = '#4ec9a0';
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(orX, orY, 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff0b0';
      ctx.beginPath(); ctx.arc(orX, orY, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = pal.eye;
    ctx.fillRect(e1x, e1y, es, es);
    ctx.fillRect(e2x, e2y, es, es);
    ctx.fillStyle = '#1a0806';
    for (const eye of [{x: e1x, y: e1y}, {x: e2x, y: e2y}]) ctx.fillRect(eye.x + 1.5, eye.y + 0.5, 1, 3);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(e1x, e1y, es, es);
    ctx.strokeRect(e2x, e2y, es, es);
  }
}

function drawTezcatlipoca(rs, guardian, cx, cy, dir, perp, rear) {
  const pal = guardian.palette;
  const time = gameTime;
  const pulse = Math.sin(time * 0.004) * 0.5 + 0.5;
  const angle = Math.atan2(dir.y, dir.x);
  ctx.save();
  const isVulnerable = guardian.vulnerableUntil && gameTime < guardian.vulnerableUntil;
  const auraR = TILE_SIZE * 1.9;
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR);
  if (isVulnerable) {
    const vulnPulse = Math.sin(gameTime * 0.015) * 0.5 + 0.5;
    aura.addColorStop(0, `rgba(255, 220, 120, ${0.45 + vulnPulse * 0.25})`);
    aura.addColorStop(0.5, `rgba(217, 142, 43, ${0.25 + vulnPulse * 0.15})`);
    aura.addColorStop(1, 'rgba(255, 220, 120, 0)');
  } else {
    aura.addColorStop(0, `rgba(217, 142, 43, ${0.28 + pulse * 0.12})`);
    aura.addColorStop(0.5, 'rgba(168, 86, 27, 0.18)');
    aura.addColorStop(1, 'rgba(20, 17, 15, 0)');
  }
  ctx.fillStyle = aura;
  ctx.beginPath(); ctx.arc(cx, cy, auraR, 0, Math.PI * 2); ctx.fill();
  if (isVulnerable) {
    ctx.save();
    const ringPulse = Math.sin(gameTime * 0.02) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(255, 220, 120, ${0.6 + ringPulse * 0.4})`;
    ctx.lineWidth = 2 + ringPulse * 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(cx, cy, TILE_SIZE * 0.9, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
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
    ctx.fillStyle = i % 2 === 0 ? pal.head : pal.body;
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 1.4;
    roundRect(ctx, -segW / 2, -segH / 2, segW, segH, 3);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = pal.obsidian;
    ctx.beginPath();
    const rs2 = segH * 0.22;
    ctx.moveTo(0, -rs2); ctx.lineTo(rs2 * 0.8, 0); ctx.lineTo(0, rs2); ctx.lineTo(-rs2 * 0.8, 0);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  for (let side = -1; side <= 1; side += 2) {
    for (let p = 0; p < 2; p++) {
      const offset = (p === 0 ? 0.5 : 1.5);
      const pawX = cx - dir.x * TILE_SIZE * offset + perp.x * side * TILE_SIZE * 0.55;
      const pawY = cy - dir.y * TILE_SIZE * offset + perp.y * side * TILE_SIZE * 0.55;
      ctx.save();
      ctx.translate(pawX, pawY);
      ctx.rotate(angle);
      ctx.fillStyle = pal.body;
      ctx.strokeStyle = pal.obsidian;
      ctx.lineWidth = 1.1;
      roundRect(ctx, -TILE_SIZE * 0.12, -TILE_SIZE * 0.18, TILE_SIZE * 0.3, TILE_SIZE * 0.36, 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = pal.head;
      ctx.beginPath();
      ctx.moveTo(TILE_SIZE * 0.18, -TILE_SIZE * 0.14); ctx.lineTo(TILE_SIZE * 0.28, 0); ctx.lineTo(TILE_SIZE * 0.18, TILE_SIZE * 0.14);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
  const tailBaseX = cx - dir.x * TILE_SIZE * 2.4;
  const tailBaseY = cy - dir.y * TILE_SIZE * 2.4;
  const tailWave = Math.sin(time * 0.008) * 2.5;
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
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  const tipTailX = tailBaseX - dir.x * TILE_SIZE * 1.75 + perp.x * tailWave;
  const tipTailY = tailBaseY - dir.y * TILE_SIZE * 1.75 + perp.y * tailWave;
  ctx.save();
  ctx.translate(tipTailX, tipTailY);
  ctx.rotate(angle);
  ctx.fillStyle = pal.obsidian;
  ctx.strokeStyle = pal.head;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(TILE_SIZE * 0.25, 0); ctx.lineTo(0, -TILE_SIZE * 0.22); ctx.lineTo(-TILE_SIZE * 0.35, 0); ctx.lineTo(0, TILE_SIZE * 0.22);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.save();
  const crownCenterX = cx - dir.x * TILE_SIZE * 0.05;
  const crownCenterY = cy - dir.y * TILE_SIZE * 0.05;
  const plumeCount = 9;
  for (let p = 0; p < plumeCount; p++) {
    const tt = (p / (plumeCount - 1)) - 0.5;
    const plumeAngle = angle + tt * Math.PI * 0.9;
    const plumeLen = TILE_SIZE * (0.9 - Math.abs(tt) * 0.35);
    const baseX = crownCenterX + Math.cos(plumeAngle) * TILE_SIZE * 0.35;
    const baseY = crownCenterY + Math.sin(plumeAngle) * TILE_SIZE * 0.35;
    const tipX = crownCenterX + Math.cos(plumeAngle) * (TILE_SIZE * 0.35 + plumeLen);
    const tipY = crownCenterY + Math.sin(plumeAngle) * (TILE_SIZE * 0.35 + plumeLen);
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
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(tipX, tipY); ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const headSize = TILE_SIZE * 0.82;
  ctx.fillStyle = pal.head;
  ctx.strokeStyle = pal.obsidian;
  ctx.lineWidth = 1.6;
  roundRect(ctx, -headSize / 2, -headSize / 2, headSize, headSize, 4);
  ctx.fill(); ctx.stroke();
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
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = pal.body;
    ctx.beginPath();
    ctx.moveTo(earX - TILE_SIZE * 0.05, earY + TILE_SIZE * 0.02);
    ctx.lineTo(earX, earY - TILE_SIZE * 0.12);
    ctx.lineTo(earX + TILE_SIZE * 0.05, earY + TILE_SIZE * 0.02);
    ctx.closePath(); ctx.fill();
  }
  for (let side = -1; side <= 1; side += 2) {
    ctx.fillStyle = pal.obsidian;
    ctx.beginPath(); ctx.arc(side * headSize * 0.26, 0, headSize * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal.head;
    ctx.beginPath(); ctx.arc(side * headSize * 0.26, 0, headSize * 0.08, 0, Math.PI * 2); ctx.fill();
  }
  for (let side = -1; side <= 1; side += 2) {
    const eyeX = side * headSize * 0.24;
    const eyeY = 0;
    ctx.fillStyle = '#4ec9a0';
    ctx.shadowColor = '#4ec9a0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY - headSize * 0.09); ctx.lineTo(eyeX + headSize * 0.08, eyeY); ctx.lineTo(eyeX, eyeY + headSize * 0.09); ctx.lineTo(eyeX - headSize * 0.08, eyeY);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = pal.obsidian;
    ctx.beginPath(); ctx.ellipse(eyeX, eyeY, headSize * 0.018, headSize * 0.05, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = pal.obsidian;
  ctx.beginPath();
  ctx.moveTo(0, headSize * 0.05); ctx.lineTo(headSize * 0.07, headSize * 0.18); ctx.lineTo(-headSize * 0.07, headSize * 0.18);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = pal.ember;
  ctx.strokeStyle = pal.obsidian;
  ctx.lineWidth = 0.8;
  roundRect(ctx, -headSize * 0.18, headSize * 0.18, headSize * 0.36, headSize * 0.16, 2);
  ctx.fill(); ctx.stroke();
  for (let side = -1; side <= 1; side += 2) {
    ctx.fillStyle = '#f5efdc';
    ctx.strokeStyle = pal.obsidian;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(side * headSize * 0.12, headSize * 0.34); ctx.lineTo(side * headSize * 0.18, headSize * 0.5); ctx.lineTo(side * headSize * 0.06, headSize * 0.42);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
  if (guardian.smokeParticles) {
    guardian.smokeParticles.forEach(sp => {
      const age = (gameTime - sp.bornAt) / 800;
      if (age > 1) return;
      ctx.fillStyle = `rgba(20, 17, 15, ${0.5 * (1 - age)})`;
      ctx.beginPath();
      ctx.arc(sp.x * TILE_SIZE + TILE_SIZE / 2, sp.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE * 0.4 * (1 + age), 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawFoodOffering(food, cx, cy, pulse) {
  const isMaize = food.offering === 'maize';
  const isCacao = food.offering === 'cacao';
  const radius = Math.max(4, TILE_SIZE / 2 - 3 + pulse * 0.3);
  ctx.save();
  if (isMaize) {
    ctx.fillStyle = '#f2c230';
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(cx, cy, radius * 0.55, radius * 0.95, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4fcea2';
    ctx.strokeStyle = '#b0f4d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.15, cy + radius * 0.5);
    ctx.quadraticCurveTo(cx - radius * 0.95, cy, cx - radius * 0.5, cy - radius * 0.85);
    ctx.quadraticCurveTo(cx - radius * 0.25, cy - radius * 0.2, cx - radius * 0.15, cy + radius * 0.5);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + radius * 0.15, cy + radius * 0.5);
    ctx.quadraticCurveTo(cx + radius * 0.95, cy, cx + radius * 0.5, cy - radius * 0.85);
    ctx.quadraticCurveTo(cx + radius * 0.25, cy - radius * 0.2, cx + radius * 0.15, cy + radius * 0.5);
    ctx.fill(); ctx.stroke();
  } else if (isCacao) {
    ctx.fillStyle = '#8b5a2b';
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(cx, cy, radius * 0.55, radius * 0.9, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#5a3a1b';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(cx - radius * 0.4, cy + i * radius * 0.28); ctx.lineTo(cx + radius * 0.4, cy + i * radius * 0.28); ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#4fcea2';
    ctx.strokeStyle = '#b0f4d8';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.78, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d5bd70';
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.22, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ========================================================
// 22. DRAW PRINCIPAL  ✅ FIX COMPLETO
// ========================================================
function draw(interpolation = 1, updateEffects = false) {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ✅ FIX: reset total del estado del contexto antes de dibujar
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Fondo
  if (boardCanvas && boardCanvas.width > 0) {
    ctx.drawImage(boardCanvas, 0, 0, screenW, screenH);
  } else {
    const theme = BOARD_THEMES[progression.selectedTheme || 'classic'] || BOARD_THEMES.classic;
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, screenW, screenH);
  }

  // ✅ FIX: shake con save/restore balanceado (1 save, 1 restore)
  ctx.save();
  if (screenShake > 0.3) {
    const dx = (Math.random() - 0.5) * screenShake;
    const dy = (Math.random() - 0.5) * screenShake;
    ctx.translate(dx, dy);
  }

  // ✅ FIX: clip con su propio save/restore anidado
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, screenW, screenH);
  ctx.clip();

  const pulse = Math.sin(gameTime * 0.006) * 1.5;
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
    const timeLeft = bf.expiresAt ? bf.expiresAt - gameTime : 999999;
    const isExpiring = timeLeft < 3000;
    const blinkAlpha = isExpiring ? (Math.sin(gameTime * 0.02) > 0 ? 1 : 0.3) : 1;
    ctx.save();
    ctx.globalAlpha = blinkAlpha;
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
    ctx.strokeStyle = '#fff0b0'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.36, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
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
    ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7de8c4'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, cy, TILE_SIZE / 2 + pulse, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#1a7a5e';
    ctx.beginPath(); ctx.arc(cx, cy, TILE_SIZE / 2 - 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff0b0'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - TILE_SIZE / 4); ctx.lineTo(cx + TILE_SIZE / 4, cy); ctx.lineTo(cx, cy + TILE_SIZE / 4); ctx.lineTo(cx - TILE_SIZE / 4, cy);
    ctx.closePath(); ctx.stroke();
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
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#effbff'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.42, cy); ctx.lineTo(cx + r * 0.42, cy);
    ctx.moveTo(cx, cy - r * 0.42); ctx.lineTo(cx, cy + r * 0.42);
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
    ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2); ctx.fill();
    ctx.translate(cx, cy);
    ctx.rotate(gameTime * 0.003);
    ctx.strokeStyle = '#d9f0ff'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
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
    ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b3e5ff';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2); ctx.fill();
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
    ctx.fillStyle = 'rgba(48, 20, 24, 0.85)';
    ctx.beginPath(); ctx.arc(cx, cy, ringR - 3.5, 0, Math.PI * 2); ctx.fill();
    const heartSize = TILE_SIZE * 0.78 * (1 + beat * 0.1);
    ctx.font = `${heartSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
    ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2); ctx.fill();
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
    const r = Math.max(6, TILE_SIZE / 2 - 2 + pulse * 0.2);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(gameTime * 0.0007);
    ctx.fillStyle = 'rgba(22, 42, 48, 0.96)';
    ctx.strokeStyle = '#fff0b0';
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d5bd70';
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 8;
      const pr = r * (i % 2 === 0 ? 1.28 : 1.04);
      const x = Math.cos(a) * pr;
      const y = Math.sin(a) * pr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#16343b';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8be7ff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.62, -Math.PI * 0.8, Math.PI * 0.8); ctx.stroke();
    ctx.fillStyle = '#fff0b0';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.58); ctx.lineTo(r * 0.2, 0); ctx.lineTo(0, r * 0.58); ctx.lineTo(-r * 0.2, 0);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  });

  enemyGuardians.forEach(guardian => {
    const hitAt = guardian.cosmicOrderHitAt;
    guardian.segments.forEach((seg, idx) => {
      const isHead = idx === 0;
      const wobbleX = hitAt === undefined ? 0 : Math.sin((gameTime - hitAt) * 0.065 + idx * 1.2) * 2.5;
      const wobbleY = hitAt === undefined ? 0 : Math.cos((gameTime - hitAt) * 0.065 + idx * 1.2) * 1.5;
      const previousSegments = previousGuardianPositions.get(guardian.id);
      let progress = interpolation;
      if (guardian.lastMoveTick === guardian.tickCounter) progress = interpolation;
      else progress = 1;
      const renderSegment = interpolateGridPosition(seg, previousSegments?.[idx] || previousSegments?.[previousSegments.length - 1], progress);
      renderSegment.x += wobbleX / TILE_SIZE;
      renderSegment.y += wobbleY / TILE_SIZE;
      const fillColor = hitAt !== undefined && Math.floor((gameTime - hitAt) / 100) % 2 === 0
        ? '#f5e5ad'
        : isHead ? guardian.palette.head : guardian.palette.body;
      const tailFactor = 1 - (idx / guardian.segments.length) * 0.5;
      const segSize = TILE_SIZE * tailFactor;
      ctx.fillStyle = fillColor;
      if (isHead) {
        roundRect(ctx, renderSegment.x * TILE_SIZE + (TILE_SIZE - segSize) / 2, renderSegment.y * TILE_SIZE + (TILE_SIZE - segSize) / 2, segSize, segSize, 8);
      } else {
        roundRect(ctx, renderSegment.x * TILE_SIZE + (TILE_SIZE - segSize) / 2, renderSegment.y * TILE_SIZE + (TILE_SIZE - segSize) / 2, segSize, segSize, 4);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      if (!isHead) drawFeatherScale(renderSegment, idx, guardian);
      else drawGuardianHead(renderSegment, guardian);
    });
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

  const skin = getActiveSkin();
  const KUKULKAN_BODY = isGolden ? '#9c8a4a' : skin.body;
  const KUKULKAN_BORDER = isGolden ? '#d4c488' : skin.border;
  const KUKULKAN_PLATE = isGolden ? '#c2b06a' : skin.plate;

  snake.forEach((seg, idx) => {
    const isHead = idx === 0;
    const rs = interpolateGridPosition(seg, previousSnakePositions[idx] || previousSnakePositions[previousSnakePositions.length - 1], interpolation);
    if (!isHead) {
      ctx.fillStyle = KUKULKAN_BODY;
      roundRect(ctx, rs.x * TILE_SIZE + 1, rs.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2, 5);
      ctx.fill();
      if (isGolden || KUKULKAN_PLATE) {
        ctx.fillStyle = KUKULKAN_PLATE;
        roundRect(ctx, rs.x * TILE_SIZE + 2.5, rs.y * TILE_SIZE + 2, TILE_SIZE - 5, TILE_SIZE * 0.4, 3);
        ctx.fill();
      }
      ctx.strokeStyle = KUKULKAN_BORDER;
      ctx.lineWidth = isGolden ? 1.2 : 1;
      roundRect(ctx, rs.x * TILE_SIZE + 1.5, rs.y * TILE_SIZE + 1.5, TILE_SIZE - 3, TILE_SIZE - 3, 5);
      ctx.stroke();
      drawBodyDiamond(rs, idx, isGolden);
    } else {
      drawKukulkanHead(rs, direction, playerProtected, isBlinking);
    }
    if (isHead && headPulse > 0) {
      const pR = TILE_SIZE * 0.5 + 3 + (1 - headPulse) * 8;
      ctx.save();
      ctx.strokeStyle = headPulseColor;
      ctx.lineWidth = 1.8 * headPulse;
      ctx.globalAlpha = headPulse * 0.7;
      ctx.beginPath();
      ctx.arc(rs.x * TILE_SIZE + TILE_SIZE / 2, rs.y * TILE_SIZE + TILE_SIZE / 2, pR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
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

  if (cosmicOrderFlashStartedAt !== null) {
    const elapsed = gameTime - cosmicOrderFlashStartedAt;
    if (elapsed >= 0 && elapsed < COSMIC_ORDER_FLASH_DURATION_MS) {
      const progress = elapsed / COSMIC_ORDER_FLASH_DURATION_MS;
      const flash = Math.max(0, Math.sin(progress * Math.PI * 3));
      ctx.globalAlpha = flash * (1 - progress * 0.35) * 0.38;
      ctx.fillStyle = Math.floor(progress * 3) % 2 === 0 ? '#fff0b0' : '#8be7ff';
      ctx.fillRect(0, 0, screenW, screenH);
      ctx.globalAlpha = 1;
    }
  }

  // ✅ FIX: cerrar clip y shake en el orden inverso al que se abrieron
  ctx.restore(); // clip
  ctx.restore(); // shake

  // ✅ FIX: decrementar shake UNA vez por frame, fuera del save/restore
  if (updateEffects && screenShake > 0.3) {
    screenShake *= 0.82;
    if (screenShake < 0.3) screenShake = 0;
  }
}

// ========================================================
// 23. START / PAUSE / GAME OVER
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
  window.__autoPausedByVisibility = false;

  resetGame();
  gameTime = 0;
  applyGameModeRules();

  isGameRunning = true;
  isPaused = false;
  runStartedAt = gameTime;
  runDifficulty = getEffectiveDifficulty();
  runGuardiansDefeated = 0;

  if (pauseOverlay) pauseOverlay.classList.add('hidden');

  startCountdown();
  updateFuriaUI();
  updatePauseButtonUI();
  if (dtStartBtn) dtStartBtn.textContent = '🔄 Reiniciar';

  if (tutorialModal) tutorialModal.classList.add('hidden');
  if (introTutorialModal) introTutorialModal.classList.add('hidden');
  if (settingsModal) settingsModal.classList.add('hidden');
  if (gameOverlay) gameOverlay.classList.add('hidden');
  if (loreModal) loreModal.classList.add('hidden');
  if (customizeModal) customizeModal.classList.add('hidden');
  if (statisticsModal) statisticsModal.classList.add('hidden');
  if (objectivesModal) objectivesModal.classList.add('hidden');

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
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  if (gameOverlay) gameOverlay.classList.add('hidden');
  if (settingsModal) settingsModal.classList.add('hidden');
  if (tutorialModal) tutorialModal.classList.add('hidden');
  if (objectivesModal) objectivesModal.classList.add('hidden');
  if (statisticsModal) statisticsModal.classList.add('hidden');
  if (customizeModal) customizeModal.classList.add('hidden');
  if (loreModal) loreModal.classList.add('hidden');
  if (introTutorialModal) introTutorialModal.classList.add('hidden');
  if (welcomeScreen) welcomeScreen.classList.remove('hidden');
  document.body.classList.add('welcome-open');
  document.body.classList.remove('gameover-open', 'tutorial-open');
  if (dtStartBtn) dtStartBtn.textContent = '▶ Iniciar';

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

function gameOver(reason = 'Has chocado con tu propio cuerpo.') {
  finishRunStatistics();
  const coinsEarned = Math.floor(score / 10);
  isGameRunning = false;
  isPaused = false;

  stopGameLoop();
  cancelCountdown();
  clearFireBreath();
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  isFuria = false; furiaReadyAt = 0; furiaCooldownUntil = 0;
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
  enemyGuardians = []; particles = [];
  deactivateImmunity();
  isOnFire = false; fireExpiresAt = 0;
  eclipseActive = false;
  huntTrail = [];

  stopMusic();
  playGameOverSound();
  vibrate([80, 50, 80, 50, 150]);

  if (overlayReason) overlayReason.textContent = reason;
  if (finalScoreElement) finalScoreElement.textContent = score;
  if (finalLengthElement) finalLengthElement.textContent = snake.length;
  if (finalCoinsElement) finalCoinsElement.textContent = coinsEarned;
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
  const isOpposite = (effectiveDir.x !== 0 && effectiveDir.x === -cur.x) ||
                     (effectiveDir.y !== 0 && effectiveDir.y === -cur.y);
  if (isOpposite) return;
  if (effectiveDir.x === cur.x && effectiveDir.y === cur.y) return;
  directionQueue.push({ ...effectiveDir });
}

// ========================================================
// 24. TUTORIAL Y MODALES
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
  if (!wasRunning) {
    updatePauseButtonUI();
    return;
  }
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

function openIntroTutorial() { introTutorialModal.classList.remove('hidden'); }
function closeIntroTutorial() { introTutorialModal.classList.add('hidden'); }

function openLore() {
  const wasRunning = isGameRunning;
  if (wasRunning && !isPaused) pauseForModal();
  loreModal.dataset.wasRunning = wasRunning ? '1' : '0';
  loreModal.classList.remove('hidden');
  playCosmicOrderSound();
}
function closeLore() {
  if (loreModal.classList.contains('hidden')) return;
  loreModal.classList.add('hidden');
  const wasRunning = loreModal.dataset.wasRunning === '1';
  delete loreModal.dataset.wasRunning;
  resumeIfWasRunning(wasRunning);
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
    if (wasRunning) {
      startGame();
      return;
    }
    cancelCustomizeSession();
    return;
  }

  cancelCustomizeSession();
  resumeIfWasRunning(wasRunning);
}

function openSettings() {
  if (isGameRunning && !isPaused) pauseForModal();
  settingsGameMode.value = gameModeSelect.value;
  settingsDifficulty.value = difficultySelect.value;
  settingsSoundToggle.checked = !isMuted;
  settingsDpadToggle.checked = showDpad;
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
    toggleSound(settingsSoundToggle.checked);
    showDpad = settingsDpadToggle.checked;
    safeSetItem('snakeIoShowDpad', showDpad);
    touchControls.classList.toggle('hidden', !showDpad);
  }

  if (wasRunning) {
    if (needRestart) {
      startGame();
      return;
    }
    resumeIfWasRunning(true);
  } else {
    applyGameModeRules();
  }
}
function updateSettingsDifficultyVisibility() {
  const isClassic = settingsGameMode.value === 'classic';
  settingsDifficultyGroup.style.display = isClassic ? 'flex' : 'none';
}

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
  if (e.key === 'Escape' && objectivesModal && !objectivesModal.classList.contains('hidden')) { closeObjectives(); return; }
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
// 26. EVENTOS UI
// ========================================================
if (welcomeStartBtn) welcomeStartBtn.addEventListener('click', startGame);
if (welcomeInfoBtn) welcomeInfoBtn.addEventListener('click', openIntroTutorial);
if (welcomeLoreBtn) welcomeLoreBtn.addEventListener('click', openLore);
if (welcomeCustomizeBtn) welcomeCustomizeBtn.addEventListener('click', openCustomize);
if (closeIntroTutorialBtn) closeIntroTutorialBtn.addEventListener('click', closeIntroTutorial);
if (introTutStartBtn) introTutStartBtn.addEventListener('click', () => { closeIntroTutorial(); startGame(); });
if (introTutorialModal) introTutorialModal.addEventListener('click', e => { if (e.target === introTutorialModal) closeIntroTutorial(); });

if (closeLoreBtn) closeLoreBtn.addEventListener('click', closeLore);
if (loreStartBtn) loreStartBtn.addEventListener('click', () => { closeLore(); startGame(); });
if (loreModal) loreModal.addEventListener('click', e => { if (e.target === loreModal) closeLore(); });

if (restartOverlayBtn) restartOverlayBtn.addEventListener('click', (e) => {
  e.preventDefault(); e.stopPropagation();
  setTimeout(() => startGame(), 0);
});

if (dtStartBtn) dtStartBtn.addEventListener('click', () => { startGame(); });
if (dtSettingsBtn) dtSettingsBtn.addEventListener('click', openSettings);
if (dtSoundBtn) dtSoundBtn.addEventListener('click', () => toggleSound());
if (dtTutorialBtn) dtTutorialBtn.addEventListener('click', openTutorial);
if (dtCustomizeBtn) dtCustomizeBtn.addEventListener('click', openCustomize);

if (closeStatisticsBtn) closeStatisticsBtn.addEventListener('click', closeStatistics);
if (statisticsModal) statisticsModal.addEventListener('click', e => { if (e.target === statisticsModal) closeStatistics(); });

if (dtObjectivesBtn) dtObjectivesBtn.addEventListener('click', openObjectives);
if (mbObjectivesBtn) mbObjectivesBtn.addEventListener('click', openObjectives);
if (settingsObjectivesBtn) settingsObjectivesBtn.addEventListener('click', () => {
  closeSettings(false);
  openObjectives();
});
if (closeObjectivesBtn) closeObjectivesBtn.addEventListener('click', closeObjectives);
if (objectivesModal) objectivesModal.addEventListener('click', e => {
  if (e.target === objectivesModal) closeObjectives();
});

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

if (menuToggleBtn) menuToggleBtn.addEventListener('click', () => {
  if (isGameRunning && !isPaused) togglePause();
  openSettings();
});
if (mbSoundBtn) mbSoundBtn.addEventListener('click', () => toggleSound());
if (mbSettingsBtn) mbSettingsBtn.addEventListener('click', () => {
  if (isGameRunning && !isPaused) togglePause();
  openSettings();
});

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
if (pauseRestartBtn) pauseRestartBtn.addEventListener('click', () => {
  if (pauseOverlay) pauseOverlay.classList.add('hidden');
  startGame();
});
if (pauseQuitBtn) pauseQuitBtn.addEventListener('click', exitToMenu);

// ========================================================
// 28. DIFICULTAD Y MODO
// ========================================================
function updateModeUI() {
  const isClassic = gameModeSelect.value === 'classic';
  if (settingsDifficultyGroup) settingsDifficultyGroup.style.display = isClassic ? 'flex' : 'none';
  updateThemeColors();
  rebuildBoardCanvas(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2), true);
}
function updateWelcomeModeUI() {
  const isClassic = welcomeGameMode.value === 'classic';
  welcomeDifficultyBox.style.display = isClassic ? 'flex' : 'none';
}

if (welcomeGameMode) welcomeGameMode.addEventListener('change', () => {
  gameMode = welcomeGameMode.value;
  safeSetItem('snakeIoGameMode', gameMode);
  gameModeSelect.value = gameMode;
  updateWelcomeModeUI();
  updateModeUI();
  if (isGameRunning) startGame();
  else applyGameModeRules();
});

if (welcomeDifficulty) welcomeDifficulty.addEventListener('change', () => {
  difficultySelect.value = welcomeDifficulty.value;
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
  reconcileGuardianCount();
});

if (gameModeSelect) gameModeSelect.addEventListener('change', () => {
  gameMode = gameModeSelect.value;
  safeSetItem('snakeIoGameMode', gameMode);
  welcomeGameMode.value = gameMode;
  updateWelcomeModeUI();
  updateModeUI();
  if (isGameRunning) startGame();
  else applyGameModeRules();
});

// ========================================================
// 29. VISIBILITY — Pausa robusta
// ========================================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (isGameRunning && !isPaused) {
      if (pauseOverlay) pauseOverlay.classList.remove('hidden');
      isPaused = true;
      stopMusic();
      stopGameLoop();
      updateFuriaUI();
      updatePauseButtonUI();
      draw(renderInterpolation, false);
    }
    stopWelcomeDemo();
  } else {
    if (isGameRunning && isPaused) {
      draw(renderInterpolation, false);
    }
    if (!welcomeScreen.classList.contains('hidden')) {
      startWelcomeDemo();
    }
  }
});

window.addEventListener('blur', () => {
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

window.addEventListener('pagehide', () => {
  if (isGameRunning && !isPaused) {
    isPaused = true;
    stopMusic();
    stopGameLoop();
  }
});

// ========================================================
// 30. WELCOME DEMO
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
  const cell = Math.max(8, Math.min(availW / cols, availH / rows));
  welcomeLayout = { cell, bx: (width - cell * cols) / 2, by: HUD_H + (availH - cell * rows) / 2 };
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
  const direction = options.direction || { x: 1, y: 0 };
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
  const nh = { x: welcomeDemoSnake[0].x + route.direction.x, y: welcomeDemoSnake[0].y + route.direction.y };
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
  if (welcomeDemoRouteSteps >= route.steps) { welcomeDemoRouteIndex++; welcomeDemoRouteSteps = 0; }
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
  if (isImmune && welcomeDemoSnake.length) {
    const head = welcomeDemoSnake[0];
    const cx = bx + (head.x + 0.5) * cellSize;
    const cy = by + (head.y + 0.5) * cellSize;
    c.strokeStyle = 'rgba(78, 201, 160, 0.88)';
    c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, cellSize * 0.77, 0, Math.PI * 2); c.stroke();
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
    let elapsed = welcomeDemoLastFrame === null ? 0 : timestamp - welcomeDemoLastFrame;
    if (elapsed > 500) {
      welcomeDemoAccumulator = 0;
      elapsed = 0;
    }
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}