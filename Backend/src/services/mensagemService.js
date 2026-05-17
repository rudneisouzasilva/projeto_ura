function montarMensagem(dados) {
  const {
    opcao,
    descricao,
    origem,
    telefoneCliente,
    callId,
    protocolo
  } = dados;

  let mensagemBase;

  switch (opcao) {
    case "1":
      mensagemBase = `Olá! Você selecionou a opção de consultar taxas.

Podemos te ajudar a entender suas taxas atuais e como elas impactam suas vendas.`;
      break;

    case "2":
      mensagemBase = `Olá! Você selecionou a opção sobre mudança automática de taxas.

Suas taxas podem variar conforme volume de vendas, antecipação, modalidade de pagamento e regras comerciais da conta.`;
      break;

    case "3":
      mensagemBase = `Olá! Você selecionou a opção para reduzir taxas.

Alguns caminhos possíveis são: aumentar volume mensal, revisar antecipação, negociar plano comercial e acompanhar metas de faturamento.`;
      break;

    case "4":
      mensagemBase = `Olá! Você solicitou contato com um especialista.

Em breve um atendente poderá analisar sua situação e orientar sobre suas taxas.`;
      break;

    default:
      mensagemBase = `Olá! Você selecionou a opção ${opcao}${descricao ? ` - ${descricao}` : ""}.`;
      break;
  }

  const dadosExtras = [];

  if (origem) {
    dadosExtras.push(`Origem: ${origem}`);
  }

  if (telefoneCliente) {
    dadosExtras.push(`Telefone do cliente: ${telefoneCliente}`);
  }

  if (callId) {
    dadosExtras.push(`ID da ligação: ${callId}`);
  }

  if (protocolo) {
    dadosExtras.push(`Protocolo: ${protocolo}`);
  }

  if (dadosExtras.length === 0) {
    return mensagemBase;
  }

  return `${mensagemBase}

---
Dados do atendimento:
${dadosExtras.join("\n")}`;
}

module.exports = {
  montarMensagem
};