const ROLE_INFO = {
  mafia: {
    label: "마피아",
    team: "mafia",
    reveal: "밤마다 제거할 대상을 정합니다. 낮에는 정체를 숨기고 의심을 다른 곳으로 돌리세요.",
  },
  doctor: {
    label: "의사",
    team: "town",
    reveal: "밤마다 한 명을 보호합니다. 여러 의사가 있으면 각자 한 번씩 선택합니다.",
  },
  police: {
    label: "경찰",
    team: "town",
    reveal: "밤마다 한 명을 조사해 마피아 여부를 확인합니다. 결과는 본인만 확인하세요.",
  },
  citizen: {
    label: "시민",
    team: "town",
    reveal: "특수 능력은 없지만 낮의 대화와 투표로 마피아를 찾아내야 합니다.",
  },
};

const ROLE_REVEAL_OPENERS = {
  mafia: [
    "당신은 마피아입니다. 오늘 밤부터 누군가를 어둠 속으로 끌고 가야 합니다.",
    "당신은 마피아입니다. 낮에는 태연한 얼굴로 거짓을 말해야 합니다.",
    "당신은 마피아입니다. 가장 평온한 표정 뒤에 칼끝을 숨기세요.",
    "당신은 마피아입니다. 조용히 살아남아 시민 수와 같아지면 승리합니다.",
    "당신은 마피아입니다. 밤의 선택 하나가 게임의 흐름을 바꿉니다.",
    "당신은 마피아입니다. 의심을 피하면서도 정확한 선택을 해야 합니다.",
  ],
  doctor: [
    "당신은 의사입니다. 오늘 밤 누군가의 목숨을 지킬 수 있습니다.",
    "당신은 의사입니다. 위기의 순간마다 한 사람을 살려낼 기회를 갖습니다.",
    "당신은 의사입니다. 가장 위험해 보이는 사람을 잘 지켜 보세요.",
    "당신은 의사입니다. 이 마을의 마지막 안전장치가 바로 당신일 수 있습니다.",
    "당신은 의사입니다. 한 번의 보호가 아침의 결과를 바꿀 수 있습니다.",
    "당신은 의사입니다. 침착하게 살릴 사람을 선택하세요.",
  ],
  police: [
    "당신은 경찰입니다. 오늘 밤 의심 가는 사람의 정체를 조사할 수 있습니다.",
    "당신은 경찰입니다. 겉으로 드러나지 않는 진실을 확인하는 역할입니다.",
    "당신은 경찰입니다. 조사 결과를 티 내지 않고 잘 활용해야 합니다.",
    "당신은 경찰입니다. 한 사람씩 확인하며 마피아를 좁혀 가세요.",
    "당신은 경찰입니다. 확실한 정보가 쌓일수록 낮 토론이 강해집니다.",
    "당신은 경찰입니다. 들키지 않게 단서를 모으는 것이 중요합니다.",
  ],
  citizen: [
    "당신은 시민입니다. 특별한 능력은 없지만 가장 중요한 건 당신의 추리입니다.",
    "당신은 시민입니다. 표정과 말투 속 거짓을 읽어내야 합니다.",
    "당신은 시민입니다. 이 마을을 구할 무기는 대화와 투표뿐입니다.",
    "당신은 시민입니다. 가장 평범하지만 끝까지 살아남으면 큰 힘이 됩니다.",
    "당신은 시민입니다. 작은 모순 하나가 마피아를 드러낼 수 있습니다.",
    "당신은 시민입니다. 밤에는 무력하지만 낮의 판단이 승부를 가릅니다.",
    "당신은 시민입니다. 흐름을 잘 읽고 의심을 놓지 마세요.",
    "당신은 시민입니다. 오늘의 한 표가 마을의 운명을 바꿀 수 있습니다.",
  ],
};

const NIGHT_OPENERS = [
  "안개가 골목을 덮고, 가스등은 한 뼘 앞도 비추지 못합니다. 밤의 차례입니다.",
  "자정의 종이 울렸습니다. 누군가는 칼을 쥐고, 누군가는 목숨을 지킬 준비를 합니다.",
  "비에 젖은 돌바닥 위로 발자국 소리가 흩어집니다. 아무도 진실을 말하지 않는 밤입니다.",
];

const DAWN_WITH_DEATH = [
  (label) => `새벽이 밝자 ${label}은(는) 차가운 침묵 속에 발견되었습니다. 광장은 공포로 얼어붙습니다.`,
  (label) => `${label}의 문틈으로 서늘한 바람이 새어 나옵니다. 밤은 또 한 사람을 삼켰습니다.`,
  (label) => `아침 공기를 가르며 비명이 퍼졌습니다. 쓰러진 사람은 ${label}이(가) 맞습니다.`,
];

const DAWN_WITH_SAVE = [
  "기묘한 밤이었습니다. 누군가의 그림자는 남았지만, 아침이 되자 모두 살아 있습니다.",
  "골목에는 분명 위험이 지나간 흔적이 남았지만, 오늘 아침 시체는 없습니다.",
  "밤새 무언가 일어났음은 분명합니다. 하지만 누군가의 손이 생명을 붙잡았습니다.",
];

const EXECUTION_TEXT = [
  (label, role) => `${label}은(는) 군중의 판결을 피하지 못했습니다. 마지막에 드러난 정체는 ${role}였습니다.`,
  (label, role) => `광장의 침묵 끝에 ${label}이(가) 쓰러졌고, 남겨진 진실은 ${role}라는 사실뿐이었습니다.`,
];

const TIE_TEXT = [
  "의심은 넘쳤지만 표는 갈렸습니다. 오늘은 아무도 처형되지 않습니다.",
  "서로를 겨눈 손가락이 끝내 하나로 모이지 않았습니다. 광장은 결론 없이 해산합니다.",
];

const WIN_TEXT = {
  town: "안개가 걷히고 마피아가 모두 사라졌습니다. 살아남은 사람들의 승리입니다.",
  mafia: "생존 시민 수와 마피아 수가 같아졌습니다. 이제 마을은 어둠의 손에 넘어갑니다.",
};

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 8;
const AUDIO_STORAGE_KEY = "fogbound-mafia-audio-settings-v1";
const RECORDED_AUDIO_PATHS = {
  welcome: "./assets/audio/welcome.mp3",
  "reveal-role": "./assets/audio/reveal-role.mp3",
  "reveal-pass-final": "./assets/audio/reveal-pass-final.mp3",
  "night-start": "./assets/audio/night-start.mp3",
  "night-mafia": "./assets/audio/night-mafia.mp3",
  "night-doctor": "./assets/audio/night-doctor.mp3",
  "night-police": "./assets/audio/night-police.mp3",
  "police-result": "./assets/audio/police-result.mp3",
  "dawn-open": "./assets/audio/dawn-open.mp3",
  "day-discussion": "./assets/audio/day-discussion.mp3",
  "vote-entry": "./assets/audio/vote-entry.mp3",
  "vote-choice": "./assets/audio/vote-choice.mp3",
  "vote-tie": "./assets/audio/vote-tie.mp3",
  "timer-end": "./assets/audio/timer-end.mp3",
  "win-town": "./assets/audio/win-town.mp3",
  "win-mafia": "./assets/audio/win-mafia.mp3",
};

const setupView = document.getElementById("setup-view");
const gameView = document.getElementById("game-view");
const playerCountSelect = document.getElementById("player-count");
const mafiaCountSelect = document.getElementById("mafia-count");
const doctorCountSelect = document.getElementById("doctor-count");
const policeCountSelect = document.getElementById("police-count");
const timerSecondsSelect = document.getElementById("timer-seconds");
const setupSummary = document.getElementById("setup-summary");
const mafiaLabel = document.getElementById("mafia-label");
const doctorLabel = document.getElementById("doctor-label");
const policeLabel = document.getElementById("police-label");
const setupNote = document.getElementById("setup-note");
const soundEnabledToggle = document.getElementById("sound-enabled");
const startButton = document.getElementById("start-button");

const brandTitle = document.getElementById("brand-title");
const brandTitleImage = document.getElementById("brand-title-image");
const phaseKicker = document.getElementById("phase-kicker");
const phaseTitle = document.getElementById("phase-title");
const phaseTitleImage = document.getElementById("phase-title-image");
const phaseCopy = document.getElementById("phase-copy");
const roundPill = document.getElementById("round-pill");
const alivePill = document.getElementById("alive-pill");
const configPill = document.getElementById("config-pill");
const restartGameButton = document.getElementById("restart-game-button");
const secretCard = document.getElementById("secret-card");
const secretLabel = document.getElementById("secret-label");
const secretName = document.getElementById("secret-name");
const secretNameImage = document.getElementById("secret-name-image");
const secretInstruction = document.getElementById("secret-instruction");
const primaryActionButton = document.getElementById("primary-action-button");
const choiceList = document.getElementById("choice-list");
const choiceTemplate = document.getElementById("choice-template");
const playerList = document.getElementById("player-list");
const rosterMeta = document.getElementById("roster-meta");

const timerValue = document.getElementById("timer-value");
const timerModeLabel = document.getElementById("timer-mode-label");
const timerToggleButton = document.getElementById("timer-toggle-button");
const timerResetButton = document.getElementById("timer-reset-button");

const logToggleButton = document.getElementById("log-toggle-button");
const logDrawer = document.getElementById("log-drawer");
const logBackdrop = document.getElementById("log-backdrop");
const logCloseButton = document.getElementById("log-close-button");
const logList = document.getElementById("log-list");
const restartModal = document.getElementById("restart-modal");
const restartModalBackdrop = document.getElementById("restart-modal-backdrop");
const restartCancelButton = document.getElementById("restart-cancel-button");
const restartConfirmButton = document.getElementById("restart-confirm-button");

const state = {
  config: {
    playerCount: 3,
    mafiaCount: 1,
    doctorCount: 1,
    policeCount: 0,
    timerSeconds: 600,
    soundEnabled: true,
  },
  players: [],
  phase: "setup",
  round: 1,
  revealIndex: 0,
  nightQueue: [],
  activeNightStep: null,
  nightKillTargetId: null,
  nightSaves: [],
  voteQueue: [],
  votes: [],
  timerId: null,
  timerRemaining: 600,
  logCount: 0,
  gameOverReported: false,
  awaitingNextGameApproval: false,
  revealRolePromptPlayed: false,
  voteIntroPlayed: false,
};

const revealLineMemory = {
  mafia: -1,
  doctor: -1,
  police: -1,
  citizen: -1,
};

const titleArtCache = new Map();
const audioState = {
  activeClip: null,
  pendingNarrationTimer: null,
  preferredVoice: null,
  welcomePlayed: false,
};
const STORE_CAPTURE_MODE = new URLSearchParams(window.location.search).get("storeCapture");

bootstrap();

if (STORE_CAPTURE_MODE) {
  window.addEventListener("load", () => {
    window.setTimeout(runStoreCaptureMode, 80);
  });
}

function bootstrap() {
  restoreAudioPreferences();
  localizeStaticLabels();
  applyPhaseLayout();
  setupTitleArt();
  populatePlayerCountOptions();
  refreshRoleControls();
  renderSetupSummary();
  renderSetupHints();
  updateTimerUI();
  syncAudioPreferenceControls();
  installAudioInteractions();

  playerCountSelect.addEventListener("change", handleConfigChange);
  mafiaCountSelect.addEventListener("change", handleConfigChange);
  doctorCountSelect.addEventListener("change", handleConfigChange);
  policeCountSelect.addEventListener("change", handleConfigChange);
  timerSecondsSelect.addEventListener("change", handleConfigChange);
  soundEnabledToggle?.addEventListener("change", handleAudioPreferenceChange);
  startButton.addEventListener("click", startGameFromSetup);
  primaryActionButton.addEventListener("click", handlePrimaryAction);
  restartGameButton.addEventListener("click", handleRestartRequest);
  timerToggleButton.addEventListener("click", handleTimerToggle);
  timerResetButton.addEventListener("click", handleTimerReset);
  logToggleButton.addEventListener("click", openLogDrawer);
  logBackdrop.addEventListener("click", closeLogDrawer);
  logCloseButton.addEventListener("click", closeLogDrawer);
  restartModalBackdrop.addEventListener("click", closeRestartModal);
  restartCancelButton.addEventListener("click", closeRestartModal);
  restartConfirmButton.addEventListener("click", confirmRestartGame);
  playWelcomeGreeting(320);
}

function handleRestartRequest() {
  if (state.phase === "setup") {
    return;
  }
  openRestartModal();
}

function getNativeBridge() {
  if (!window.AndroidBridge || typeof window.AndroidBridge !== "object") {
    return null;
  }
  return window.AndroidBridge;
}

function notifyNativePhaseChange() {
  const bridge = getNativeBridge();
  if (!bridge || typeof bridge.onPhaseChanged !== "function") {
    return;
  }
  bridge.onPhaseChanged(state.phase);
}

function notifyNativeGameFinished() {
  const bridge = getNativeBridge();
  if (!bridge || typeof bridge.onGameFinished !== "function") {
    return;
  }
  bridge.onGameFinished();
}

function requestNativeNextGameStart() {
  const bridge = getNativeBridge();
  if (!bridge || typeof bridge.requestNextGameStart !== "function") {
    resetToSetup();
    return;
  }

  if (state.awaitingNextGameApproval) {
    return;
  }

  state.awaitingNextGameApproval = true;
  primaryActionButton.disabled = true;
  bridge.requestNextGameStart();
}

window.handleNativeNextGameApproval = function handleNativeNextGameApproval() {
  state.awaitingNextGameApproval = false;
  primaryActionButton.disabled = false;
  resetToSetup();
};

function setupTitleArt() {
  const targets = [
    { source: brandTitle, image: brandTitleImage, variant: "brand" },
    { source: phaseTitle, image: phaseTitleImage, variant: "phase" },
    { source: secretName, image: secretNameImage, variant: "secret" },
  ];

  targets.forEach((target) => {
    if (!target.source || !target.image) {
      return;
    }

    const render = () => renderTitleArt(target.source, target.image, target.variant);
    render();

    const observer = new MutationObserver(render);
    observer.observe(target.source, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });
}

function renderTitleArt(source, image, variant) {
  const text = source.textContent.trim();
  if (!text) {
    image.classList.add("hidden");
    source.classList.remove("is-rendered");
    return;
  }

  const cacheKey = `${variant}:${text}`;
  let dataUrl = titleArtCache.get(cacheKey);

  if (!dataUrl) {
    dataUrl = createTitleArtDataUrl(text, variant);
    titleArtCache.set(cacheKey, dataUrl);
  }

  if (!dataUrl) {
    image.classList.add("hidden");
    source.classList.remove("is-rendered");
    return;
  }

  image.src = dataUrl;
  image.classList.remove("hidden");
  source.classList.add("is-rendered");
}

function createTitleArtDataUrl(text, variant) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  const config = getTitleArtConfig(variant);
  let fontSize = config.baseSize;
  let textWidth = 0;

  while (fontSize >= config.minSize) {
    context.font = buildTitleFont(fontSize);
    textWidth = context.measureText(text).width;
    if (textWidth <= config.maxWidth || fontSize === config.minSize) {
      break;
    }
    fontSize -= 2;
  }

  const width = Math.ceil(textWidth + config.paddingX * 2);
  const height = Math.ceil(fontSize * config.heightScale + config.paddingY * 2);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, width, height);
  context.font = buildTitleFont(fontSize);
  context.textBaseline = "top";
  context.lineJoin = "round";
  context.miterLimit = 2;

  const textX = config.paddingX;
  const textY = config.paddingY;

  context.save();
  context.shadowColor = config.glowColor;
  context.shadowBlur = config.glowBlur;
  context.shadowOffsetY = config.shadowOffsetY;
  context.lineWidth = config.strokeWidth;
  context.strokeStyle = config.strokeColor;
  context.strokeText(text, textX, textY);
  context.restore();

  context.lineWidth = Math.max(2, config.strokeWidth * 0.34);
  context.strokeStyle = config.innerStrokeColor;
  context.strokeText(text, textX, textY);

  const fill = context.createLinearGradient(0, textY, 0, textY + fontSize);
  fill.addColorStop(0, config.fillTop);
  fill.addColorStop(0.52, config.fillMid);
  fill.addColorStop(1, config.fillBottom);
  context.fillStyle = fill;
  context.fillText(text, textX, textY);

  const highlight = context.createLinearGradient(0, textY, 0, textY + fontSize * 0.8);
  highlight.addColorStop(0, "rgba(255, 248, 233, 0.5)");
  highlight.addColorStop(1, "rgba(255, 248, 233, 0)");
  context.fillStyle = highlight;
  context.fillText(text, textX, textY);

  context.save();
  context.globalCompositeOperation = "source-atop";
  for (let index = 0; index < Math.max(12, Math.floor(width / 18)); index += 1) {
    const noiseX = Math.random() * width;
    const noiseY = Math.random() * height;
    const noiseW = 2 + Math.random() * 9;
    const noiseH = 1 + Math.random() * 5;
    const alpha = 0.06 + Math.random() * 0.12;
    context.fillStyle = Math.random() > 0.5
      ? `rgba(42, 19, 14, ${alpha})`
      : `rgba(255, 240, 220, ${alpha * 0.7})`;
    context.fillRect(noiseX, noiseY, noiseW, noiseH);
  }
  context.restore();

  context.save();
  context.strokeStyle = config.accentLineColor;
  context.globalAlpha = 0.34;
  context.lineWidth = Math.max(2, config.strokeWidth * 0.12);
  context.beginPath();
  context.moveTo(textX, height - config.paddingY * 0.55);
  context.lineTo(width - config.paddingX, height - config.paddingY * 0.55);
  context.stroke();
  context.restore();

  return canvas.toDataURL("image/png");
}

function buildTitleFont(fontSize) {
  return `900 ${fontSize}px "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
}

function getTitleArtConfig(variant) {
  const configs = {
    brand: {
      baseSize: 58,
      minSize: 34,
      maxWidth: 540,
      paddingX: 22,
      paddingY: 16,
      heightScale: 1.24,
      strokeWidth: 10,
      glowBlur: 16,
      shadowOffsetY: 8,
      strokeColor: "#391813",
      innerStrokeColor: "rgba(111, 57, 38, 0.82)",
      fillTop: "#fff4df",
      fillMid: "#f2dfbd",
      fillBottom: "#c7a783",
      glowColor: "rgba(117, 19, 17, 0.28)",
      accentLineColor: "rgba(164, 43, 38, 0.72)",
    },
    phase: {
      baseSize: 42,
      minSize: 24,
      maxWidth: 420,
      paddingX: 16,
      paddingY: 12,
      heightScale: 1.2,
      strokeWidth: 8,
      glowBlur: 12,
      shadowOffsetY: 6,
      strokeColor: "#341510",
      innerStrokeColor: "rgba(98, 48, 34, 0.8)",
      fillTop: "#fff1d8",
      fillMid: "#ead5b0",
      fillBottom: "#ba9470",
      glowColor: "rgba(125, 22, 18, 0.22)",
      accentLineColor: "rgba(168, 50, 44, 0.6)",
    },
    secret: {
      baseSize: 50,
      minSize: 24,
      maxWidth: 640,
      paddingX: 18,
      paddingY: 14,
      heightScale: 1.24,
      strokeWidth: 9,
      glowBlur: 14,
      shadowOffsetY: 7,
      strokeColor: "#321511",
      innerStrokeColor: "rgba(99, 49, 35, 0.84)",
      fillTop: "#fff3dd",
      fillMid: "#efdcb9",
      fillBottom: "#c3a07c",
      glowColor: "rgba(130, 18, 17, 0.24)",
      accentLineColor: "rgba(166, 54, 47, 0.64)",
    },
  };

  return configs[variant] ?? configs.phase;
}

function localizeStaticLabels() {
  document.querySelector(".roster-card .side-kicker")?.replaceChildren(document.createTextNode("플레이어 현황"));
  document.querySelector(".timer-card .side-kicker")?.replaceChildren(document.createTextNode("토론 타이머"));
  rosterMeta.classList.add("hidden");
}

function restoreAudioPreferences() {
  try {
    const saved = window.localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!saved) {
      return;
    }

    const parsed = JSON.parse(saved);
    if (typeof parsed.soundEnabled === "boolean") {
      state.config.soundEnabled = parsed.soundEnabled;
      return;
    }

    if (typeof parsed.voiceEnabled === "boolean") {
      state.config.soundEnabled = parsed.voiceEnabled;
    }
  } catch (error) {
    console.warn("오디오 설정을 불러오지 못했습니다.", error);
  }
}

function saveAudioPreferences() {
  try {
    window.localStorage.setItem(
      AUDIO_STORAGE_KEY,
      JSON.stringify({
        soundEnabled: state.config.soundEnabled,
      }),
    );
  } catch (error) {
    console.warn("오디오 설정을 저장하지 못했습니다.", error);
  }
}

function syncAudioPreferenceControls() {
  if (soundEnabledToggle) {
    soundEnabledToggle.checked = state.config.soundEnabled;
  }
}

function handleAudioPreferenceChange() {
  primeAudioFromGesture();

  state.config.soundEnabled = soundEnabledToggle?.checked ?? true;
  saveAudioPreferences();

  if (!state.config.soundEnabled) {
    stopNarration();
    return;
  }

  if (state.phase === "setup") {
    playWelcomeGreeting(140);
  }
}

function installAudioInteractions() {
  const unlockAudio = () => {
    primeAudioFromGesture();
    playWelcomeGreeting(120);
  };

  window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
  window.addEventListener("keydown", unlockAudio, { once: true });

  if (!("speechSynthesis" in window)) {
    return;
  }

  cachePreferredVoice();

  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", cachePreferredVoice);
  }
}

function cachePreferredVoice() {
  if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function") {
    audioState.preferredVoice = null;
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  audioState.preferredVoice =
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("ko")) ??
    voices.find((voice) => voice.default) ??
    voices[0] ??
    null;

  return audioState.preferredVoice;
}

function primeAudioFromGesture() {
  return null;
}

function stopNarration() {
  if (audioState.pendingNarrationTimer) {
    window.clearTimeout(audioState.pendingNarrationTimer);
    audioState.pendingNarrationTimer = null;
  }

  if (audioState.activeClip) {
    audioState.activeClip.pause();
    audioState.activeClip.currentTime = 0;
    audioState.activeClip = null;
  }

  const bridge = getNativeBridge();
  if (bridge && typeof bridge.stopNarration === "function") {
    bridge.stopNarration();
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function playWelcomeGreeting(delayMs = 180) {
  if (!state.config.soundEnabled || audioState.welcomePlayed) {
    return;
  }

  if (audioState.pendingNarrationTimer) {
    window.clearTimeout(audioState.pendingNarrationTimer);
    audioState.pendingNarrationTimer = null;
  }

  audioState.pendingNarrationTimer = window.setTimeout(() => {
    audioState.pendingNarrationTimer = null;
    const markWelcomePlayed = () => {
      audioState.welcomePlayed = true;
    };
    const playedRecordedClip = playRecordedClip("welcome", { onStart: markWelcomePlayed });
    if (!playedRecordedClip) {
      speakNarration("마피아 게임에 오신 걸 환영합니다.", {
        onStart: markWelcomePlayed,
      });
    }
  }, delayMs);
}

function announceScene(effectName, voiceText = "", options = {}) {
  if (!state.config.soundEnabled) {
    return;
  }

  if (options.interrupt !== false) {
    stopNarration();
  }

  const delayMs = options.delayMs ?? 0;
  const speechOptions = options.speech ?? {};

  audioState.pendingNarrationTimer = window.setTimeout(() => {
    audioState.pendingNarrationTimer = null;
    const playedRecordedClip = playRecordedClip(effectName, { onStart: options.onStart });
    if (!playedRecordedClip && options.allowSceneVoice && voiceText) {
      speakNarration(voiceText, speechOptions);
    }
  }, delayMs);
}

function playRecordedClip(sceneKey, options = {}) {
  const source = RECORDED_AUDIO_PATHS[sceneKey];
  if (!source) {
    return false;
  }

  const clip = new Audio(source);
  clip.preload = "auto";
  clip.volume = options.volume ?? 1;
  audioState.activeClip = clip;

  const releaseClip = () => {
    if (audioState.activeClip === clip) {
      audioState.activeClip = null;
    }
  };

  clip.addEventListener("ended", releaseClip, { once: true });
  clip.addEventListener("error", releaseClip, { once: true });

  const playPromise = clip.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        if (typeof options.onStart === "function") {
          options.onStart();
        }
      })
      .catch(() => {
        releaseClip();
      });
  } else if (typeof options.onStart === "function") {
    options.onStart();
  }

  return true;
}

function speakNarration(text, options = {}) {
  if (!state.config.soundEnabled) {
    return;
  }

  const message = text.replace(/\s+/g, " ").trim();
  if (!message) {
    return;
  }

  const bridge = getNativeBridge();
  if (bridge && typeof bridge.speakText === "function") {
    if (typeof options.onStart === "function") {
      options.onStart();
    }
    bridge.speakText(message, options.rate ?? 0.96, options.pitch ?? 1);
    return;
  }

  if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
    return;
  }

  const utterance = new window.SpeechSynthesisUtterance(message);
  utterance.lang = "ko-KR";
  utterance.rate = options.rate ?? 0.96;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 0.92;

  const preferredVoice = audioState.preferredVoice ?? cachePreferredVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (typeof options.onStart === "function") {
    utterance.onstart = options.onStart;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function playEffect(effectName) {
  return effectName;
}

function scheduleTone(context, start, frequency, duration, options = {}) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = options.type ?? "sine";
  oscillator.frequency.setValueAtTime(frequency, start);

  if (options.endFrequency && options.endFrequency !== frequency) {
    oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, start + duration);
  }

  const attack = options.attack ?? 0.01;
  const release = options.release ?? 0.12;
  const peakGain = options.gain ?? 0.03;

  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(peakGain, start + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration + release);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + release + 0.04);
}

function scheduleNoise(context, start, duration, options = {}) {
  const release = options.release ?? 0.08;
  const frameCount = Math.ceil(context.sampleRate * (duration + release + 0.05));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    const decay = 1 - index / channel.length;
    channel[index] = (Math.random() * 2 - 1) * decay;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;

  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(options.frequency ?? 1200, start);
  filter.Q.value = options.q ?? 0.9;

  const gainNode = context.createGain();
  const attack = options.attack ?? 0.004;
  const peakGain = options.gain ?? 0.006;

  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(peakGain, start + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration + release);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  source.start(start);
  source.stop(start + duration + release + 0.05);
}

function populatePlayerCountOptions() {
  for (let count = MIN_PLAYERS; count <= MAX_PLAYERS; count += 1) {
    playerCountSelect.appendChild(createOption(count, `${count}명`));
  }
  playerCountSelect.value = String(state.config.playerCount);
}

function handleConfigChange() {
  state.config.playerCount = Number(playerCountSelect.value);
  state.config.mafiaCount = Number(mafiaCountSelect.value);
  state.config.doctorCount = Number(doctorCountSelect.value);
  state.config.policeCount = Number(policeCountSelect.value);
  state.config.timerSeconds = Number(timerSecondsSelect.value);

  refreshRoleControls();
  renderSetupSummary();
  renderSetupHints();
}

function getRoleCaps(playerCount) {
  const roleCaps = {
    3: { mafiaMax: 1, doctorMax: 1, policeMax: 0 },
    4: { mafiaMax: 1, doctorMax: 1, policeMax: 0 },
    5: { mafiaMax: 1, doctorMax: 1, policeMax: 1 },
    6: { mafiaMax: 2, doctorMax: 1, policeMax: 1 },
    7: { mafiaMax: 2, doctorMax: 2, policeMax: 1 },
    8: { mafiaMax: 2, doctorMax: 2, policeMax: 2 },
  };
  return roleCaps[playerCount] ?? roleCaps[MIN_PLAYERS];
}

function refreshRoleControls() {
  const playerCount = Number(playerCountSelect.value);
  const caps = getRoleCaps(playerCount);
  const selectedMafiaCount = Number(mafiaCountSelect.value || state.config.mafiaCount);
  const selectedDoctorCount = Number(doctorCountSelect.value || state.config.doctorCount);
  const selectedPoliceCount = Number(policeCountSelect.value || state.config.policeCount);

  syncSelectOptions(mafiaCountSelect, 1, caps.mafiaMax, selectedMafiaCount);
  syncSelectOptions(doctorCountSelect, 0, caps.doctorMax, selectedDoctorCount);
  syncSelectOptions(policeCountSelect, 0, caps.policeMax, selectedPoliceCount);

  state.config.playerCount = playerCount;
  state.config.mafiaCount = Number(mafiaCountSelect.value);
  state.config.doctorCount = Number(doctorCountSelect.value);
  state.config.policeCount = Number(policeCountSelect.value);
}

function syncSelectOptions(select, min, max, currentValue) {
  const nextValue = Math.min(Math.max(Number(currentValue), min), max);
  select.innerHTML = "";

  for (let value = min; value <= max; value += 1) {
    select.appendChild(createOption(value, `${value}명`));
  }

  select.value = String(nextValue);
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = String(value);
  option.textContent = label;
  return option;
}

function renderSetupSummary() {
  const caps = getRoleCaps(state.config.playerCount);
  const citizenCount = getCitizenCount();
  setupSummary.textContent =
    `${state.config.playerCount}명 게임 · 최대 마피아 ${caps.mafiaMax}명 · 최대 의사 ${caps.doctorMax}명 · 최대 경찰 ${caps.policeMax}명 · 현재 시민 ${citizenCount}명`;
}

function renderSetupHints() {
  const caps = getRoleCaps(state.config.playerCount);
  mafiaLabel.textContent = `마피아 (최대 ${caps.mafiaMax})`;
  doctorLabel.textContent = `의사 (최대 ${caps.doctorMax})`;
  policeLabel.textContent = `경찰 (최대 ${caps.policeMax})`;
  setupNote.textContent =
    `${state.config.playerCount}명 기준으로 선택 가능한 직업 수를 다시 계산했습니다. 인원 수를 바꾸면 마피아, 의사, 경찰 최대치도 함께 조정됩니다.`;
}

function getCitizenCount() {
  return (
    state.config.playerCount -
    state.config.mafiaCount -
    state.config.doctorCount -
    state.config.policeCount
  );
}

function startGameFromSetup() {
  primeAudioFromGesture();

  if (getCitizenCount() < 1) {
    window.alert("시민이 최소 1명은 있어야 합니다.");
    return;
  }

  clearTimer();
  closeLogDrawer();

  state.players = assignRoles();
  state.phase = "reveal-entry";
  state.round = 1;
  state.revealIndex = 0;
  state.nightQueue = [];
  state.activeNightStep = null;
  state.nightKillTargetId = null;
  state.nightSaves = [];
  state.voteQueue = [];
  state.votes = [];
  state.logCount = 0;
  state.gameOverReported = false;
  state.awaitingNextGameApproval = false;
  state.revealRolePromptPlayed = false;
  state.voteIntroPlayed = false;
  logList.innerHTML = "";
  primaryActionButton.disabled = false;

  setupView.classList.add("hidden");
  gameView.classList.remove("hidden");
  logToggleButton.classList.remove("hidden");
  logToggleButton.textContent = "사건 기록";

  addLog("게임 시작", "번호가 매겨진 플레이어들이 자리에 앉았습니다. 진행자는 역할 카드를 섞습니다.");
  updatePlayerList();
  renderRevealEntry();
}

function assignRoles() {
  const roles = [];
  pushRole(roles, "mafia", state.config.mafiaCount);
  pushRole(roles, "doctor", state.config.doctorCount);
  pushRole(roles, "police", state.config.policeCount);
  pushRole(roles, "citizen", getCitizenCount());

  const shuffledRoles = shuffle(roles);

  return Array.from({ length: state.config.playerCount }, (_, index) => ({
    id: createId(),
    slot: index + 1,
    label: `플레이어 ${index + 1}`,
    role: shuffledRoles[index],
    alive: true,
  }));
}

function pushRole(bucket, role, count) {
  for (let index = 0; index < count; index += 1) {
    bucket.push(role);
  }
}

function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function handlePrimaryAction() {
  primeAudioFromGesture();

  switch (state.phase) {
    case "reveal-entry":
      renderRevealRole();
      return;
    case "reveal-role":
      renderRevealPass();
      return;
    case "reveal-pass":
      proceedReveal();
      return;
    case "night-start":
      beginNextNightStep();
      return;
    case "night-step-intro":
      renderNightChoices();
      return;
    case "night-police-result":
      finishNightStep();
      return;
    case "night-summary":
      startDayDiscussion();
      return;
    case "day-discussion":
      startVoting();
      return;
    case "vote-entry":
      renderVoteChoices();
      return;
    case "vote-summary":
      state.round += 1;
      startNight();
      return;
    case "game-over":
      requestNativeNextGameStart();
      return;
    default:
  }
}

function isRevealPhase() {
  return (
    state.phase === "reveal-entry" ||
    state.phase === "reveal-role" ||
    state.phase === "reveal-pass"
  );
}

function isGameOverPhase() {
  return state.phase === "game-over";
}

function isLiveGamePhase() {
  return state.phase !== "setup" && !isRevealPhase() && !isGameOverPhase();
}

function isDiscussionPhase() {
  return state.phase === "day-discussion";
}

function getSceneKey() {
  if (state.phase === "setup") {
    return "setup";
  }

  if (isRevealPhase()) {
    return "reveal";
  }

  if (
    state.phase === "night-start" ||
    state.phase === "night-step-intro" ||
    state.phase === "night-step-choice" ||
    state.phase === "night-police-result"
  ) {
    return "night";
  }

  if (state.phase === "night-summary" || state.phase === "day-discussion") {
    return "day";
  }

  if (
    state.phase === "vote-entry" ||
    state.phase === "vote-choice" ||
    state.phase === "vote-summary"
  ) {
    return "vote";
  }

  if (state.phase === "game-over") {
    return "finale";
  }

  return "setup";
}

function applyPhaseLayout() {
  const revealPhase = isRevealPhase();
  const gameOverPhase = isGameOverPhase();
  const liveGamePhase = isLiveGamePhase();
  const discussionPhase = isDiscussionPhase();

  document.body.classList.toggle("phase-reveal", revealPhase);
  document.body.classList.toggle("phase-game-over", gameOverPhase);
  document.body.classList.toggle("phase-live-game", liveGamePhase);
  document.body.classList.toggle("phase-discussion", discussionPhase);
  document.body.dataset.scene = getSceneKey();

  if (revealPhase || gameOverPhase) {
    closeLogDrawer();
  }

  if (!gameOverPhase) {
    delete secretCard.dataset.outcome;
  }

  notifyNativePhaseChange();
}

function renderRevealEntry() {
  const player = state.players[state.revealIndex];

  state.phase = "reveal-entry";
  applyPhaseLayout();
  hideChoices();
  updateStatusPills();
  stopTimerInteraction();

  phaseKicker.textContent = "직업 확인";
  phaseTitle.textContent = "직업 배정";
  phaseCopy.textContent = "한 사람씩 직업을 확인한 뒤 다음 사람에게 폰을 넘깁니다.";

  secretLabel.textContent = "다음 확인";
  secretName.textContent = player.label;
  secretInstruction.textContent = `${player.label}만 눈을 뜨고 화면을 확인하세요. 준비가 되면 직업을 공개합니다.`;
  primaryActionButton.textContent = "직업 확인";
  if (!state.revealRolePromptPlayed) {
    state.revealRolePromptPlayed = true;
    announceScene("reveal-role", "지금 화면의 직업을 조용히 확인하세요.");
  }
}

function renderRevealRole() {
  const player = state.players[state.revealIndex];
  const role = ROLE_INFO[player.role];

  state.phase = "reveal-role";
  applyPhaseLayout();

  secretLabel.textContent = `${player.label}의 직업`;
  secretName.textContent = role.label;
  secretInstruction.textContent = `${buildRoleRevealMessage(player, role)} 확인을 누르면 화면이 닫힙니다.`;
  primaryActionButton.textContent = "확인";
}

function renderRevealPass() {
  const player = state.players[state.revealIndex];
  const isLastPlayer = state.revealIndex === state.players.length - 1;

  state.phase = "reveal-pass";
  applyPhaseLayout();

  secretLabel.textContent = "폰 넘기기";
  secretName.textContent = isLastPlayer ? "폰을 가운데로 놓아 주세요" : `다음은 플레이어 ${player.slot + 1}`;
  secretInstruction.textContent = isLastPlayer
    ? `${player.label}의 직업 확인이 끝났습니다. 이제 폰을 가운데로 놓고 손가락을 가운데로 모아 주세요. 모두 준비되면 밤을 시작합니다.`
    : `${player.label}의 직업 확인이 끝났습니다. 이제 폰을 오른쪽으로 넘기고 다음 플레이어만 눈을 뜨세요.`;
  primaryActionButton.textContent = isLastPlayer ? "밤 시작" : "다음 플레이어 준비";
  announceScene(
    isLastPlayer ? "reveal-pass-final" : "reveal-pass",
    isLastPlayer
      ? "직업 확인이 끝났습니다. 이제 폰을 가운데로 놓고 손가락을 가운데로 모아 주세요."
      : "직업 확인이 끝났습니다. 폰을 다음 플레이어에게 넘겨 주세요.",
  );
}

function buildAllyHint(player) {
  if (player.role !== "mafia") {
    return "";
  }

  const allies = state.players.filter(
    (candidate) => candidate.role === "mafia" && candidate.id !== player.id,
  );

  if (!allies.length) {
    return "당신만이 유일한 마피아입니다.";
  }

  return `같은 편은 ${allies.map((ally) => ally.label).join(", ")}입니다.`;
}

function buildRoleRevealMessage(player, role) {
  const opener = pickRevealOpening(player.role);
  const allyHint = buildAllyHint(player);
  return `${opener} ${role.reveal} ${allyHint}`;
}

function pickRevealOpening(roleKey) {
  const candidates = ROLE_REVEAL_OPENERS[roleKey];
  if (!candidates || candidates.length === 0) {
    return `당신은 ${ROLE_INFO[roleKey].label}입니다.`;
  }

  let nextIndex = Math.floor(Math.random() * candidates.length);
  if (candidates.length > 1 && nextIndex === revealLineMemory[roleKey]) {
    nextIndex = (nextIndex + 1) % candidates.length;
  }

  revealLineMemory[roleKey] = nextIndex;
  return candidates[nextIndex];
}

function proceedReveal() {
  state.revealIndex += 1;
  if (state.revealIndex < state.players.length) {
    renderRevealEntry();
    return;
  }
  startNight();
}

function startNight() {
  clearTimer();
  state.phase = "night-start";
  applyPhaseLayout();
  state.nightKillTargetId = null;
  state.nightSaves = [];
  state.activeNightStep = null;
  state.nightQueue = buildNightQueue();

  hideChoices();
  updateStatusPills();
  stopTimerInteraction();

  phaseKicker.textContent = "밤";
  phaseTitle.textContent = `${state.round}일차 밤`;
  phaseCopy.textContent = randomPick(NIGHT_OPENERS);

  secretLabel.textContent = "야간 진행";
  secretName.textContent = "모두 눈을 감아 주세요";
  secretInstruction.textContent = "이제 진행자가 밤 단계를 시작합니다. 안내가 나오는 역할만 눈을 뜨고 화면을 확인하세요.";
  primaryActionButton.textContent = "밤 행동 시작";

  addLog(`밤 ${state.round}`, phaseCopy.textContent);
  announceScene("night-start", "모두 눈을 감아 주세요. 밤이 시작됩니다.");
}

function buildNightQueue() {
  const queue = [];
  const mafiaPlayers = getAlivePlayers("mafia");
  const doctorPlayers = getAlivePlayers("doctor");
  const policePlayers = getAlivePlayers("police");

  if (mafiaPlayers.length) {
    queue.push({
      type: "mafia",
      actorIds: mafiaPlayers.map((player) => player.id),
    });
  }

  doctorPlayers.forEach((player) => {
    queue.push({ type: "doctor", actorId: player.id });
  });

  policePlayers.forEach((player) => {
    queue.push({ type: "police", actorId: player.id });
  });

  return queue;
}

function beginNextNightStep() {
  if (!state.nightQueue.length) {
    resolveNight();
    return;
  }

  state.activeNightStep = state.nightQueue.shift();
  state.phase = "night-step-intro";
  applyPhaseLayout();
  hideChoices();

  const step = state.activeNightStep;

  if (step.type === "mafia") {
    phaseKicker.textContent = "밤";
    phaseTitle.textContent = "마피아 차례";
    phaseCopy.textContent = "마피아만 눈을 뜨고 제거할 대상을 선택합니다.";
    secretLabel.textContent = "비밀 행동";
    secretName.textContent = "마피아만 눈을 뜨세요";
    secretInstruction.textContent = "마피아만 눈을 뜨고 죽이고 싶은 플레이어를 선택하세요.";
    primaryActionButton.textContent = "죽일 플레이어 선택";
    announceScene("night-mafia", "마피아만 눈을 뜨고 죽일 플레이어를 선택하세요.");
    return;
  }

  if (step.type === "doctor") {
    phaseKicker.textContent = "밤";
    phaseTitle.textContent = "의사 차례";
    phaseCopy.textContent = "의사만 눈을 뜨고 보호할 대상을 선택합니다.";
    secretLabel.textContent = "비밀 행동";
    secretName.textContent = "의사만 눈을 뜨세요";
    secretInstruction.textContent = "의사만 눈을 뜨고 살리고 싶은 플레이어를 선택하세요.";
    primaryActionButton.textContent = "살릴 플레이어 선택";
    announceScene("night-doctor", "의사만 눈을 뜨고 살릴 플레이어를 선택하세요.");
    return;
  }

  phaseKicker.textContent = "밤";
  phaseTitle.textContent = "경찰 차례";
  phaseCopy.textContent = "경찰만 눈을 뜨고 조사할 대상을 선택합니다.";
  secretLabel.textContent = "비밀 행동";
  secretName.textContent = "경찰만 눈을 뜨세요";
  secretInstruction.textContent = "경찰만 눈을 뜨고 확인하고 싶은 플레이어를 선택하세요.";
  primaryActionButton.textContent = "조사할 플레이어 선택";
  announceScene("night-police", "경찰만 눈을 뜨고 조사할 플레이어를 선택하세요.");
}

function renderNightChoices() {
  const step = state.activeNightStep;
  const actorId = step.actorId ?? step.actorIds[0];
  const actor = findPlayerById(actorId);
  let candidates = [];

  if (step.type === "mafia") {
    candidates = getAlivePlayers().filter((player) => player.role !== "mafia");
  }

  if (step.type === "doctor") {
    candidates = getAlivePlayers();
  }

  if (step.type === "police") {
    candidates = getAlivePlayers().filter((player) => player.id !== actor.id);
  }

  state.phase = "night-step-choice";
  applyPhaseLayout();
  showChoices(
    candidates,
    step.type === "mafia" ? "choice-danger" : "choice-safe",
    (player) => resolveNightChoice(step, player),
  );
  announceScene(step.type === "mafia" ? "vote-choice" : "reveal-entry");
}

function resolveNightChoice(step, player) {
  if (step.type === "mafia") {
    state.nightKillTargetId = player.id;
    finishNightStep();
    return;
  }

  if (step.type === "doctor") {
    state.nightSaves.push(player.id);
    finishNightStep();
    return;
  }

  const resultText =
    player.role === "mafia"
      ? `${player.label}은(는) 마피아입니다.`
      : `${player.label}은(는) 마피아가 아닙니다.`;

  state.phase = "night-police-result";
  applyPhaseLayout();
  hideChoices();

  phaseKicker.textContent = "밤";
  phaseTitle.textContent = "경찰 결과 확인";
  phaseCopy.textContent = "경찰만 결과를 확인한 뒤 다시 눈을 감아 주세요.";
  secretLabel.textContent = "조사 결과";
  secretName.textContent = "결과 확인";
  secretInstruction.textContent = `${resultText} 확인이 끝나면 폰을 진행자에게 넘겨 주세요.`;
  primaryActionButton.textContent = "다음 비밀 행동";
  announceScene("police-result", "조사 결과를 화면으로만 확인하고 다시 눈을 감아 주세요.");
}

function finishNightStep() {
  state.activeNightStep = null;
  beginNextNightStep();
}

function resolveNight() {
  const saved = state.nightKillTargetId && state.nightSaves.includes(state.nightKillTargetId);
  const victim = saved || !state.nightKillTargetId ? null : findPlayerById(state.nightKillTargetId);

  if (victim) {
    victim.alive = false;
    addLog("새벽의 발견", randomPick(DAWN_WITH_DEATH)(victim.label));
  } else {
    addLog("새벽의 적막", randomPick(DAWN_WITH_SAVE));
  }

  updatePlayerList();

  const winner = getWinner();
  if (winner) {
    endGame(winner);
    return;
  }

  state.phase = "night-summary";
  applyPhaseLayout();
  hideChoices();

  phaseKicker.textContent = "아침";
  phaseTitle.textContent = `${state.round}일차 아침`;
  phaseCopy.textContent = victim
    ? `${victim.label}이(가) 밤사이 제거되었습니다. 살아남은 사람들은 서로를 노려봅니다.`
    : "오늘 아침 희생자는 없습니다. 하지만 모두가 무죄인 것은 아닙니다.";
  secretLabel.textContent = "낮 준비";
  secretName.textContent = "모두 눈을 떠 주세요";
  secretInstruction.textContent = "이제 모두 눈을 뜨고 사건 내용을 확인한 뒤 자유 토론을 시작하세요.";
  primaryActionButton.textContent = "낮 토론 시작";
  announceScene("dawn-open", phaseCopy.textContent);
}

function startDayDiscussion() {
  state.phase = "day-discussion";
  applyPhaseLayout();
  hideChoices();

  phaseKicker.textContent = "낮";
  phaseTitle.textContent = `${state.round}일차 낮`;
  phaseCopy.textContent = "토론을 진행하고, 준비가 되면 비밀 투표를 시작하세요.";
  secretLabel.textContent = "광장";
  secretName.textContent = "낮 토론";
  secretInstruction.textContent = "모두 자유롭게 토론하세요. 충분히 이야기했다면 비밀 투표를 시작합니다.";
  primaryActionButton.textContent = "비밀 투표 시작";

  updateStatusPills();
  prepareDiscussionTimer();
  announceScene("day-discussion", "낮 토론을 시작하세요. 충분히 이야기한 뒤 비밀 투표를 진행하세요.");
}

function startVoting() {
  clearTimer();
  state.votes = [];
  state.voteQueue = [...getAlivePlayers()];
  state.voteIntroPlayed = false;
  renderVoteEntry();
}

function renderVoteEntry() {
  const voter = state.voteQueue[0];

  state.phase = "vote-entry";
  applyPhaseLayout();
  hideChoices();
  stopTimerInteraction();

  phaseKicker.textContent = "투표";
  phaseTitle.textContent = "비밀 투표";
  phaseCopy.textContent = "생존자들이 한 명씩 폰을 받아 처형할 사람을 고릅니다.";
  secretLabel.textContent = "투표자";
  secretName.textContent = voter.label;
  secretInstruction.textContent = `${voter.label}만 화면을 보고 처형하고 싶은 플레이어를 선택하세요. 끝나면 다음 사람에게 폰을 넘깁니다.`;
  primaryActionButton.textContent = "투표 열기";
  if (!state.voteIntroPlayed) {
    state.voteIntroPlayed = true;
    announceScene("vote-entry", "플레이어들은 돌아가며 투표를 진행하세요.");
  }
}

function renderVoteChoices() {
  const voter = state.voteQueue[0];
  const candidates = getAlivePlayers().filter((player) => player.id !== voter.id);

  state.phase = "vote-choice";
  applyPhaseLayout();
  phaseKicker.textContent = "투표";
  phaseTitle.textContent = `${voter.label}의 선택`;
  phaseCopy.textContent = "오늘 처형할 사람을 한 명 선택하세요.";

  showChoices(candidates, "", (player) => castVote(voter.id, player.id));
}

function castVote(voterId, targetId) {
  state.votes.push({ voterId, targetId });
  state.voteQueue.shift();

  if (state.voteQueue.length) {
    renderVoteEntry();
    return;
  }

  resolveVotes();
}

function resolveVotes() {
  const counts = new Map();

  state.votes.forEach((vote) => {
    counts.set(vote.targetId, (counts.get(vote.targetId) ?? 0) + 1);
  });

  const ranking = [...counts.entries()].sort((left, right) => right[1] - left[1]);
  const topCount = ranking[0]?.[1] ?? 0;
  const topTargets = ranking.filter((entry) => entry[1] === topCount);

  state.phase = "vote-summary";
  applyPhaseLayout();
  hideChoices();

  if (topTargets.length !== 1) {
    const tieLine = randomPick(TIE_TEXT);
    phaseKicker.textContent = "저녁";
    phaseTitle.textContent = "처형 없음";
    phaseCopy.textContent = "동률이 나와 오늘은 아무도 처형되지 않습니다.";
    secretLabel.textContent = "결론";
    secretName.textContent = "표가 갈렸습니다";
    secretInstruction.textContent = tieLine;
    primaryActionButton.textContent = "다음 밤";
    addLog("흩어진 표", tieLine);
    announceScene("vote-tie", "표가 갈려 아무도 처형되지 않았습니다.");
    return;
  }

  const executed = findPlayerById(topTargets[0][0]);
  executed.alive = false;
  updatePlayerList();
  addLog("광장의 판결", randomPick(EXECUTION_TEXT)(executed.label, ROLE_INFO[executed.role].label));

  const winner = getWinner();
  if (winner) {
    endGame(winner);
    return;
  }

  phaseKicker.textContent = "저녁";
  phaseTitle.textContent = "투표 종료";
  phaseCopy.textContent = `${executed.label}이(가) 광장에서 사라졌습니다. 남은 사람들은 다시 밤을 맞이합니다.`;
  secretLabel.textContent = "정체 공개";
  secretName.textContent = executed.label;
  secretInstruction.textContent = `역할은 ${ROLE_INFO[executed.role].label}였습니다.`;
  primaryActionButton.textContent = "다음 밤";
  announceScene("vote-result", `${executed.label}의 정체가 공개되었습니다.`);
}

function getWinner() {
  const alivePlayers = getAlivePlayers();
  const mafiaAliveCount = alivePlayers.filter((player) => player.role === "mafia").length;
  const townAliveCount = alivePlayers.length - mafiaAliveCount;

  if (mafiaAliveCount === 0) {
    return "town";
  }

  if (mafiaAliveCount >= townAliveCount) {
    return "mafia";
  }

  return null;
}

function endGame(winner) {
  clearTimer();
  state.phase = "game-over";
  applyPhaseLayout();
  hideChoices();
  updatePlayerList(true);
  stopTimerInteraction();
  secretCard.dataset.outcome = winner;
  state.awaitingNextGameApproval = false;
  primaryActionButton.disabled = false;

  phaseKicker.textContent = "Game Over";
  phaseTitle.textContent = "게임 종료";
  phaseCopy.textContent = WIN_TEXT[winner];
  secretLabel.textContent = "최종 결과";
  secretName.textContent = winner === "town" ? "시민 승리" : "마피아 승리";
  secretInstruction.textContent =
    `${WIN_TEXT[winner]}\n\n정체 공개\n${state.players.map((player) => `${player.label}: ${ROLE_INFO[player.role].label}`).join("\n")}\n\n아래 버튼을 누르면 새 게임을 시작합니다.`;
  primaryActionButton.textContent = "새 게임 시작";

  if (!state.gameOverReported) {
    state.gameOverReported = true;
    notifyNativeGameFinished();
  }

  addLog(winner === "town" ? "안개의 종말" : "어둠의 승리", WIN_TEXT[winner]);
  announceScene(winner === "town" ? "win-town" : "win-mafia", WIN_TEXT[winner]);
}

function resetToSetup() {
  clearTimer();
  stopNarration();
  closeLogDrawer();
  closeRestartModal();
  state.awaitingNextGameApproval = false;
  state.phase = "setup";
  applyPhaseLayout();
  state.players = [];
  state.logCount = 0;
  state.revealRolePromptPlayed = false;
  state.voteIntroPlayed = false;
  setupView.classList.remove("hidden");
  gameView.classList.add("hidden");
  logToggleButton.classList.add("hidden");
  logToggleButton.textContent = "사건 기록";
  primaryActionButton.disabled = false;
  updateTimerUI();
}

function showChoices(players, extraClass, onSelect) {
  secretCard.classList.add("hidden");
  choiceList.classList.remove("hidden");
  choiceList.innerHTML = "";

  players.forEach((player) => {
    const button = choiceTemplate.content.firstElementChild.cloneNode(true);
    button.textContent = player.label;
    if (extraClass) {
      button.classList.add(extraClass);
    }
    button.addEventListener("click", () => {
      primeAudioFromGesture();
      onSelect(player);
    });
    choiceList.appendChild(button);
  });
}

function hideChoices() {
  choiceList.classList.add("hidden");
  choiceList.innerHTML = "";
  secretCard.classList.remove("hidden");
}

function updatePlayerList(revealAllRoles = false) {
  playerList.innerHTML = "";

  state.players.forEach((player) => {
    const chip = document.createElement("article");
    chip.className = `player-chip ${player.alive ? "alive" : "dead"}`;

    const name = document.createElement("span");
    name.className = "player-name";
    name.textContent = player.label;

    const meta = document.createElement("span");
    meta.className = "player-meta";
    if (revealAllRoles) {
      meta.textContent = ROLE_INFO[player.role].label;
    } else if (player.alive) {
      meta.textContent = "생존";
    } else {
      meta.textContent = `탈락 · ${ROLE_INFO[player.role].label}`;
    }

    chip.append(name, meta);
    playerList.appendChild(chip);
  });

  rosterMeta.textContent = "";
  updateStatusPills();
}

function updateStatusPills() {
  const aliveCount = getAlivePlayers().length;
  roundPill.textContent =
    state.phase === "reveal-entry" || state.phase === "reveal-role" || state.phase === "reveal-pass"
      ? "직업 배정"
      : `${state.round}일차`;
  alivePill.textContent = `생존 ${aliveCount}명`;
  configPill.textContent =
    `마피아 ${state.config.mafiaCount} · 의사 ${state.config.doctorCount} · 경찰 ${state.config.policeCount} · 시민 ${getCitizenCount()}`;
}

function getAlivePlayers(role) {
  return state.players.filter((player) => player.alive && (!role || player.role === role));
}

function findPlayerById(id) {
  return state.players.find((player) => player.id === id);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function addLog(title, description) {
  state.logCount += 1;
  logToggleButton.textContent = `사건 기록 ${state.logCount}`;

  const entry = document.createElement("article");
  entry.className = "log-entry";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const body = document.createElement("p");
  body.textContent = description;

  entry.append(heading, body);
  logList.prepend(entry);
}

function openLogDrawer() {
  logDrawer.classList.remove("hidden");
  logDrawer.setAttribute("aria-hidden", "false");
}

function closeLogDrawer() {
  logDrawer.classList.add("hidden");
  logDrawer.setAttribute("aria-hidden", "true");
}

function openRestartModal() {
  restartModal.classList.remove("hidden");
  restartModal.setAttribute("aria-hidden", "false");
}

function closeRestartModal() {
  restartModal.classList.add("hidden");
  restartModal.setAttribute("aria-hidden", "true");
}

function confirmRestartGame() {
  closeRestartModal();
  stopNarration();
  resetToSetup();
}

function prepareDiscussionTimer() {
  state.timerRemaining = state.config.timerSeconds;

  if (state.config.timerSeconds === 0) {
    clearTimer();
    timerModeLabel.textContent = "수동 진행";
    timerValue.textContent = "--:--";
    timerToggleButton.disabled = true;
    timerResetButton.disabled = true;
    timerToggleButton.textContent = "시작";
    return;
  }

  timerToggleButton.disabled = false;
  timerResetButton.disabled = false;
  timerModeLabel.textContent = "진행 중";
  startTimer();
}

function handleTimerToggle() {
  if (state.phase !== "day-discussion" || state.config.timerSeconds === 0) {
    return;
  }

  if (state.timerRemaining <= 0) {
    state.timerRemaining = state.config.timerSeconds;
    startTimer();
    return;
  }

  if (state.timerId) {
    clearTimer();
    timerModeLabel.textContent = "일시정지";
    updateTimerUI();
    return;
  }

  startTimer();
}

function handleTimerReset() {
  if (state.phase !== "day-discussion" || state.config.timerSeconds === 0) {
    return;
  }

  clearTimer();
  state.timerRemaining = state.config.timerSeconds;
  timerModeLabel.textContent = "대기 중";
  updateTimerUI();
}

function startTimer() {
  clearTimer();
  timerModeLabel.textContent = "진행 중";
  updateTimerUI();

  state.timerId = window.setInterval(() => {
    state.timerRemaining -= 1;
    updateTimerUI();

    if (state.timerRemaining <= 0) {
      clearTimer();
      state.timerRemaining = 0;
      timerModeLabel.textContent = "시간 종료";
      updateTimerUI();
      announceScene("timer-end", "토론 시간이 끝났습니다.");
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function stopTimerInteraction() {
  clearTimer();
  timerToggleButton.disabled = true;
  timerResetButton.disabled = true;
  timerModeLabel.textContent = "대기 중";
  updateTimerUI();
}

function updateTimerUI() {
  if (state.config.timerSeconds === 0) {
    timerValue.textContent = "--:--";
  } else if (state.phase === "day-discussion") {
    timerValue.textContent = formatTime(state.timerRemaining);
  } else {
    timerValue.textContent = formatTime(state.config.timerSeconds);
  }

  if (state.phase !== "day-discussion" || state.config.timerSeconds === 0) {
    timerToggleButton.textContent = "시작";
    return;
  }

  if (state.timerRemaining <= 0) {
    timerToggleButton.textContent = "다시";
    return;
  }

  timerToggleButton.textContent = state.timerId ? "일시정지" : "시작";
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function runStoreCaptureMode() {
  document.body.classList.add("store-capture");
  configureStoreCaptureConfig();

  switch (STORE_CAPTURE_MODE) {
    case "reveal":
      renderStoreCaptureReveal();
      break;
    case "night":
      renderStoreCaptureNight();
      break;
    case "vote":
      renderStoreCaptureVote();
      break;
    case "finale":
      renderStoreCaptureFinale();
      break;
    case "setup":
    default:
      renderStoreCaptureSetup();
      break;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.body.dataset.captureReady = "true";
      window.__STORE_CAPTURE_READY = true;
    });
  });
}

function configureStoreCaptureConfig() {
  playerCountSelect.value = "5";
  refreshRoleControls();
  mafiaCountSelect.value = "1";
  doctorCountSelect.value = "1";
  policeCountSelect.value = "1";
  timerSecondsSelect.value = "600";
  handleConfigChange();
}

function createStoreCapturePlayers() {
  return [
    { id: "store-p1", slot: 1, label: "플레이어 1", role: "citizen", alive: true },
    { id: "store-p2", slot: 2, label: "플레이어 2", role: "mafia", alive: true },
    { id: "store-p3", slot: 3, label: "플레이어 3", role: "doctor", alive: true },
    { id: "store-p4", slot: 4, label: "플레이어 4", role: "police", alive: true },
    { id: "store-p5", slot: 5, label: "플레이어 5", role: "citizen", alive: true },
  ];
}

function prepareStoreCaptureGameShell() {
  clearTimer();
  closeLogDrawer();
  closeRestartModal();
  setupView.classList.add("hidden");
  gameView.classList.remove("hidden");
  logToggleButton.classList.add("hidden");
  logToggleButton.textContent = "사건 기록";
  state.logCount = 0;
  logList.innerHTML = "";
  state.awaitingNextGameApproval = false;
  state.gameOverReported = true;
  state.round = 2;
  state.revealIndex = 0;
  state.nightQueue = [];
  state.activeNightStep = null;
  state.nightKillTargetId = null;
  state.nightSaves = [];
  state.voteQueue = [];
  state.votes = [];
  primaryActionButton.disabled = false;
  updatePlayerList();
}

function renderStoreCaptureSetup() {
  resetToSetup();
  configureStoreCaptureConfig();
  document.body.dataset.captureReady = "false";
  state.gameOverReported = true;
}

function renderStoreCaptureReveal() {
  state.players = createStoreCapturePlayers();
  state.revealIndex = 3;
  state.round = 1;
  prepareStoreCaptureGameShell();
  renderRevealRole();
}

function renderStoreCaptureNight() {
  state.players = createStoreCapturePlayers();
  prepareStoreCaptureGameShell();
  state.nightQueue = [{ type: "mafia", actorIds: ["store-p2"] }];
  beginNextNightStep();
  renderNightChoices();
}

function renderStoreCaptureVote() {
  state.players = createStoreCapturePlayers().map((player) =>
    player.id === "store-p5" ? { ...player, alive: false } : player,
  );
  prepareStoreCaptureGameShell();
  updatePlayerList();
  state.voteQueue = [findPlayerById("store-p4")];
  renderVoteChoices();
}

function renderStoreCaptureFinale() {
  state.players = createStoreCapturePlayers().map((player) => {
    if (player.id === "store-p2" || player.id === "store-p5") {
      return { ...player, alive: false };
    }
    return player;
  });
  prepareStoreCaptureGameShell();
  endGame("town");
}
