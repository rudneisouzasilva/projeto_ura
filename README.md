# Projeto URA: assistente Clara

Protótipo de URA (atendimento telefônico automático) feito no hackathon. O cliente escolhe uma opção na tela da URA e o back-end envia uma mensagem pelo WhatsApp com a opção escolhida, o protocolo e os dados do atendimento.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `frontend/` | Tela da URA (HTML, CSS e JavaScript) com os áudios da assistente Clara |
| `Backend/` | API em Node.js/Express que recebe a opção e envia a mensagem pelo WhatsApp |

O back-end tem dois provedores de WhatsApp em `Backend/src/providers`: `whatsappWebProvider` (whatsapp-web.js, conecta lendo um QR Code) e `whatsappOficialProvider` (API oficial do WhatsApp).

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Status do back-end e da conexão com o WhatsApp |
| GET | `/health` | Verificação de saúde |
| POST | `/api/ura/opcao` | Recebe a opção escolhida (`opcao`, `descricao`, `origem`, `telefoneCliente`, `callId`, `protocolo`) |

## Como rodar

```bash
cd Backend
npm install
cp .env.example .env   # ajuste os números e o provedor
npm start
```

Com o provedor `web`, o terminal mostra um QR Code para conectar o WhatsApp. Depois abra `frontend/index.html` no navegador. O front-end chama a API em `http://localhost:3000`.
