let seconds = 0;
let timerInterval = null;
let callActive = false;
let muted = false;
let speaker = false;

const dialScreen = document.getElementById("dialScreen");
const callScreen = document.getElementById("callScreen");
const callInfo = document.getElementById("callInfo");
const callActions = document.getElementById("callActions");
const callStatus = document.getElementById("callStatus");
const callTimer = document.getElementById("callTimer");
const keypadScreen = document.getElementById("keypadScreen");
const endButton = document.getElementById("endButton");
const uraAudio = document.getElementById("uraAudio");
const uraAudio2 = document.getElementById("uraAudio2");
const typedKey = document.getElementById("typedKey");
const muteIcon = document.getElementById("muteIcon");
const speakerIcon = document.getElementById("speakerIcon");
const toast = document.getElementById("toast");
const currentTime = document.getElementById("currentTime");

updateClock();
setInterval(updateClock, 30000);

function updateClock() {
  const now = new Date();

  currentTime.innerText = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function startCall() {
  callActive = true;
  seconds = 0;
  muted = false;
  speaker = false;

  dialScreen.classList.add("hidden");
  callScreen.classList.remove("hidden");

  keypadScreen.classList.add("hidden");
  callInfo.classList.remove("keypad-open");
  callActions.classList.remove("keypad-open");

  callStatus.innerText = "chamando...";
  callTimer.innerText = "00:00";
  callTimer.classList.add("hidden");

  muteIcon.className = "action-circle";
  speakerIcon.className = "action-circle";

  uraAudio.pause();
  uraAudio.currentTime = 0;

  uraAudio2.pause();
  uraAudio2.currentTime = 0;

  setTimeout(() => {
    if (!callActive) return;

    callStatus.innerText = "chamada em andamento";
    callTimer.classList.remove("hidden");

    startTimer();

    uraAudio.play().catch(() => {
      console.log("O navegador bloqueou o áudio automático.");
    });
  }, 900);
}

function toggleKeypad() {
  if (!callActive) return;

  const willOpen = keypadScreen.classList.contains("hidden");

  keypadScreen.classList.toggle("hidden");
  callInfo.classList.toggle("keypad-open", willOpen);
  callActions.classList.toggle("keypad-open", willOpen);

  if (willOpen) {
    typedKey.innerText = "";
  }
}

async function pressKey(option) {
  if (!callActive) return;

  typedKey.innerText = option;

  if (option === "1") {
    await playSecondAudio();
    await sendOptionToBackend(option);
    return;
  }

  await sendOptionToBackend(option);
}

async function sendOptionToBackend(option) {
  const descricao = getOptionText(option);

  try {
    const response = await fetch("http://localhost:3000/api/ura/opcao", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    opcao: "1",
    descricao: "Consulta de taxas via frontend",
    origem: "frontend"
  })
});

    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao acionar backend.");
    }

    console.log("Backend acionado:", data);
  } catch (error) {
    console.error("Erro ao acionar backend:", error.message);
  }
}

async function playSecondAudio() {
  try {
    uraAudio.pause();
    uraAudio.currentTime = 0;

    uraAudio2.pause();
    uraAudio2.currentTime = 0;

    uraAudio2.onended = () => {
      voltarParaDiscador();
    };

    await uraAudio2.play();
  } catch (error) {
    console.error("Erro ao reproduzir audio-ura2.mp3:", error);
  }
}

function getOptionText(option) {
  switch (option) {
    case "1":
      return "Consultar taxas";
    case "2":
      return "Entender mudança automática";
    case "3":
      return "Ver como reduzir taxas";
    case "4":
      return "Falar com especialista";
    case "5":
      return "Consultar status da negociação";
    case "6":
      return "Receber ajuda";
    case "7":
      return "Opção 7";
    case "8":
      return "Opção 8";
    case "9":
      return "Opção 9";
    case "0":
      return "Opção 0";
    case "*":
      return "Asterisco";
    case "#":
      return "Jogo da velha";
    default:
      return "Opção não configurada";
  }
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    seconds++;

    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    callTimer.innerText =
      String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  }, 1000);
}

function endCall() {
  voltarParaDiscador();
}

function voltarParaDiscador() {
  callActive = false;
  seconds = 0;
  muted = false;
  speaker = false;

  clearInterval(timerInterval);

  uraAudio.pause();
  uraAudio.currentTime = 0;

  uraAudio2.pause();
  uraAudio2.currentTime = 0;

  keypadScreen.classList.add("hidden");
  callInfo.classList.remove("keypad-open");
  callActions.classList.remove("keypad-open");

  callStatus.innerText = "chamando...";
  callTimer.innerText = "00:00";
  callTimer.classList.add("hidden");

  muteIcon.className = "action-circle";
  speakerIcon.className = "action-circle";

  callScreen.classList.add("hidden");
  dialScreen.classList.remove("hidden");
}

function toggleMute() {
  if (!callActive) return;

  muted = !muted;

  if (muted) {
    muteIcon.classList.add("is-muted");
  } else {
    muteIcon.classList.remove("is-muted");
  }
}

function toggleSpeaker() {
  if (!callActive) return;

  speaker = !speaker;

  if (speaker) {
    speakerIcon.classList.add("is-on");
  } else {
    speakerIcon.classList.remove("is-on");
  }
}

function showToast(message) {
  toast.innerText = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}