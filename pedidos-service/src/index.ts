
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({
    mensagem: "Serviço de Pedidos funcionando"
  });
});

app.listen(PORT, () => {
  console.log(`Pedidos rodando na porta ${PORT}`);
});
