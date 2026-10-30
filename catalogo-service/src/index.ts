
import express from "express";
import dotenv from "dotenv";
import { Produto } from "./types";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

// Dados armazenados em memória
const produtos: Produto[] = [
  { id: 1, nome: "Teclado", preco: 150, estoque: 8 },
  { id: 2, nome: "Mouse", preco: 80, estoque: 10 }
];

let proximoId = 3;

// GET - Listar todos os produtos
app.get("/produtos", (req, res) => {
  res.status(200).json(produtos);
});

// GET - Buscar produto pelo ID
app.get("/produtos/:id", (req, res) => {
  const id = Number(req.params.id);

  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({
      mensagem: "Produto não encontrado",
      codigo: "PRODUTO_NAO_ENCONTRADO"
    });
  }

  res.status(200).json(produto);
});

// POST - Cadastrar produto
app.post("/produtos", (req, res) => {
  const { nome, preco, estoque } = req.body ?? {};

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof preco !== "number" ||
    !Number.isFinite(preco) ||
    preco <= 0 ||
    !Number.isInteger(estoque) ||
    estoque < 0
  ) {
    return res.status(400).json({
      mensagem: "Dados do produto são inválidos",
      codigo: "DADOS_INVALIDOS"
    });
  }

  const produto: Produto = {
    id: proximoId++,
    nome: nome.trim(),
    preco,
    estoque
  };

  produtos.push(produto);

  res.status(201).json(produto);
});

// POST - Reservar estoque
app.post("/produtos/:id/reservas", (req, res) => {
  const id = Number(req.params.id);
  const { quantidade } = req.body ?? {};

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return res.status(400).json({
      mensagem: "Quantidade inválida",
      codigo: "QUANTIDADE_INVALIDA"
    });
  }

  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({
      mensagem: "Produto não encontrado",
      codigo: "PRODUTO_NAO_ENCONTRADO"
    });
  }

  if (produto.estoque < quantidade) {
    return res.status(409).json({
      mensagem: "Estoque insuficiente",
      codigo: "ESTOQUE_INSUFICIENTE"
    });
  }

  produto.estoque -= quantidade;

  return res.status(200).json({
    reservado: quantidade,
    estoqueRestante: produto.estoque,
    precoUnitario: produto.preco
  });
});

app.listen(PORT, () => {
  console.log(`Catálogo rodando na porta ${PORT}`);
});
