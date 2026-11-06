
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import pedidosRoutes from "./routes/pedidos.routes";
import { AppError } from "./errors/AppError";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    mensagem: "Serviço de Pedidos funcionando"
  });
});

// Registrar as rotas
app.use(pedidosRoutes);

// Tratamento de erros
app.use((
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    res.status(error.status).json({
      mensagem: error.message,
      codigo: error.codigo
    });
    return;
  }

  console.error("Erro inesperado:", error);

  res.status(500).json({
    mensagem: "Erro interno do servidor",
    codigo: "ERRO_INTERNO"
  });
});

app.listen(PORT, () => {
  console.log(`Pedidos rodando na porta ${PORT}`);
});
