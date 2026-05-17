const whatsappWebProvider = require("../providers/whatsappWebProvider");
const whatsappOficialProvider = require("../providers/whatsappOficialProvider");

const providerSelecionado = process.env.WHATSAPP_PROVIDER || "web";

function getProvider() {
  if (providerSelecionado === "oficial") {
    return whatsappOficialProvider;
  }

  return whatsappWebProvider;
}

function inicializar() {
  const provider = getProvider();

  if (provider.inicializar) {
    provider.inicializar();
  }
}

function isReady() {
  const provider = getProvider();

  if (provider.isReady) {
    return provider.isReady();
  }

  return false;
}

async function enviarParaDestinos(mensagem) {
  const provider = getProvider();

  return await provider.enviarParaDestinos(mensagem);
}

module.exports = {
  inicializar,
  isReady,
  enviarParaDestinos
};