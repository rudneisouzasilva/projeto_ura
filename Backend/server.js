require("dotenv").config();

const express = require("express");
const cors = require("cors");
const uraRoutes = require("./src/routes/uraRoutes");
const whatsappService = require("./src/services/whatsappService");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "Backend rodando",
    whatsappReady: whatsappService.isReady(),
    rotas: {
      ura: "/api/ura/opcao",
      health: "/health"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    whatsappReady: whatsappService.isReady(),
    provider: process.env.WHATSAPP_PROVIDER || "web"
  });
});

app.use("/api/ura", uraRoutes);

whatsappService.inicializar();

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});