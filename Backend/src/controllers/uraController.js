const mensagemService = require("../services/mensagemService");
const whatsappService = require("../services/whatsappService");

async function receberOpcao(req, res) {
  try {
    const {
      opcao,
      descricao,
      origem = "frontend",
      telefoneCliente,
      callId,
      protocolo
    } = req.body;

    if (!opcao) {
      return res.status(400).json({
        sucesso: false,
        erro: "A opção é obrigatória."
      });
    }

    const origensPermitidas = ["frontend", "ura", "teste"];

    if (!origensPermitidas.includes(origem)) {
      return res.status(403).json({
        sucesso: false,
        erro: "Origem inválida.",
        origensPermitidas
      });
    }

    if (!whatsappService.isReady()) {
      return res.status(503).json({
        sucesso: false,
        erro: "Serviço de WhatsApp ainda não está conectado."
      });
    }

    const mensagem = mensagemService.montarMensagem({
      opcao,
      descricao,
      origem,
      telefoneCliente,
      callId,
      protocolo
    });

    const resultados = await whatsappService.enviarParaDestinos(mensagem);

    return res.json({
      sucesso: true,
      mensagem: "Opção recebida e processada.",
      dadosRecebidos: {
        opcao,
        descricao,
        origem,
        telefoneCliente,
        callId,
        protocolo
      },
      resultados
    });

  } catch (error) {
    console.error("Erro geral no endpoint da URA:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro geral ao processar envio.",
      detalhe: error.message || String(error)
    });
  }
}

module.exports = {
  receberOpcao
};