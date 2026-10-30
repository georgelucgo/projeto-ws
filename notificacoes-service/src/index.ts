
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3002;

app.get("/health", (req, res) => {
  res.status(200).json({
    mensagem: "Serviço de Notificações funcionando"
  });
});

app.listen(PORT, () => {
  console.log(`Notificações rodando na porta ${PORT}`);
});
