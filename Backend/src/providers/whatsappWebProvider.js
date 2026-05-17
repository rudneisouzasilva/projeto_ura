const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const TARGET_NUMBERS = (process.env.WHATSAPP_TARGET_NUMBERS || "")
  .split(",")
  .map(numero => numero.trim())
  .filter(numero => numero.length > 0);

console.log("Números carregados:", TARGET_NUMBERS);

let whatsappReady = false;
let client = null;

function inicializar() {
  client = new Client({
    authStrategy: new LocalAuth({
      clientId: "emulador-ligacao"
    }),
    puppeteer: {
      headless: true,
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu"
      ]
    }
  });

  client.on("qr", (qr) => {
    console.log("\nEscaneie este QR Code com seu WhatsApp:\n");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    whatsappReady = true;
    console.log("WhatsApp conectado e pronto para enviar mensagens.");
  });

  client.on("authenticated", () => {
    console.log("WhatsApp autenticado.");
  });

  client.on("auth_failure", (msg) => {
    whatsappReady = false;
    console.error("Falha de autenticação:", msg);
  });

  client.on("disconnected", (reason) => {
    whatsappReady = false;
    console.log("WhatsApp desconectado:", reason);
  });

  client.initialize();
}

function isReady() {
  return whatsappReady;
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function validarNumeroBrasil(numeroLimpo) {
  return /^55\d{10,11}$/.test(numeroLimpo);
}

async function enviarParaDestinos(mensagem) {
  if (TARGET_NUMBERS.length === 0) {
    throw new Error("Nenhum número de destino configurado no .env.");
  }

  if (!whatsappReady || !client) {
    throw new Error("WhatsApp ainda não está conectado.");
  }

  const resultados = [];

  for (const numero of TARGET_NUMBERS) {
    const numeroLimpo = numero.replace(/\D/g, "");
    const chatId = `${numeroLimpo}@c.us`;

    try {
      console.log("Tentando enviar para:", chatId);

      if (!validarNumeroBrasil(numeroLimpo)) {
        resultados.push({
          numero: numeroLimpo,
          sucesso: false,
          erro: "Número inválido. Use formato 55 + DDD + número."
        });
        continue;
      }

      const registrado = await client.isRegisteredUser(chatId);

      if (!registrado) {
        resultados.push({
          numero: numeroLimpo,
          sucesso: false,
          erro: "Número não registrado no WhatsApp."
        });
        continue;
      }

      try {
        await client.sendMessage(chatId, mensagem);
      } catch (erroSendMessage) {
        console.log(`client.sendMessage falhou para ${numeroLimpo}. Tentando getChatById...`);

        const chat = await client.getChatById(chatId);
        await chat.sendMessage(mensagem);
      }

      resultados.push({
        numero: numeroLimpo,
        sucesso: true
      });

      await esperar(1500);

    } catch (error) {
      console.error(`Erro ao enviar para ${numeroLimpo}:`, error.message || error);

      resultados.push({
        numero: numeroLimpo,
        sucesso: false,
        erro: error.message || String(error)
      });
    }
  }

  console.log("Resultado do envio:", resultados);

  return resultados;
}

module.exports = {
  inicializar,
  isReady,
  enviarParaDestinos
};