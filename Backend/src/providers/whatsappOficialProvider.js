function inicializar() {
  console.log("Provider oficial de WhatsApp selecionado.");
  console.log("Configure a integração oficial neste arquivo.");
}

function isReady() {
  return Boolean(
    process.env.WHATSAPP_OFICIAL_TOKEN &&
    process.env.WHATSAPP_OFICIAL_URL
  );
}

async function enviarParaDestinos(mensagem) {
  const TARGET_NUMBERS = (process.env.WHATSAPP_TARGET_NUMBERS || "")
    .split(",")
    .map(numero => numero.trim())
    .filter(numero => numero.length > 0);

  if (TARGET_NUMBERS.length === 0) {
    throw new Error("Nenhum número de destino configurado no .env.");
  }

  if (!isReady()) {
    throw new Error("Provider oficial não configurado. Verifique WHATSAPP_OFICIAL_TOKEN e WHATSAPP_OFICIAL_URL.");
  }

  const resultados = [];

  for (const numero of TARGET_NUMBERS) {
    const numeroLimpo = numero.replace(/\D/g, "");

    try {
      /*
        Aqui entraria a chamada oficial no futuro.

        Exemplo genérico:

        await fetch(process.env.WHATSAPP_OFICIAL_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.WHATSAPP_OFICIAL_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: numeroLimpo,
            message: mensagem
          })
        });
      */

      resultados.push({
        numero: numeroLimpo,
        sucesso: false,
        erro: "Envio oficial ainda não implementado. Este provider é apenas preparação futura."
      });

    } catch (error) {
      resultados.push({
        numero: numeroLimpo,
        sucesso: false,
        erro: error.message || String(error)
      });
    }
  }

  return resultados;
}

module.exports = {
  inicializar,
  isReady,
  enviarParaDestinos
};