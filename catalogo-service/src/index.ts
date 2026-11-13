
import express, {
  Request,
  Response,
  NextFunction
} from "express";

import "dotenv/config";
import produtosRoutes from "./routes/produtos.routes";
import { AppError } from "./errors/AppError";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// Registrar rotas
app.use(produtosRoutes);

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

  console.error("Erro interno do Catálogo:", error);

  res.status(500).json({
    mensagem: "Erro interno do servidor",
    codigo: "ERRO_INTERNO"
  });
});

app.listen(PORT, () => {
  console.log(`Catálogo rodando na porta ${PORT}`);
});
