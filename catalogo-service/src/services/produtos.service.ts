
import { produtosRepository } from "../repositories/produtos.repository";
import { AppError } from "../errors/AppError";

export const produtosService = {

  async listar() {
    const produtos = await produtosRepository.listar();

    return produtos.map(p => ({
      id: p.id,
      nome: p.nome,
      preco: Number(p.preco),
      estoque: p.estoque,
      criadoEm: p.criadoEm
    }));
  },

  async buscarPorId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "ID inválido", 400, "ID_INVALIDO"
      );
    }

    const p = await produtosRepository.buscarPorId(id);

    if (!p) {
      throw new AppError(
        "Produto não encontrado",
        404,
        "PRODUTO_NAO_ENCONTRADO"
      );
    }

    return {
      id: p.id,
      nome: p.nome,
      preco: Number(p.preco),
      estoque: p.estoque,
      criadoEm: p.criadoEm
    };
  },

  async criar(input: unknown) {
    const dados =
      typeof input === "object" &&
      input !== null &&
      !Array.isArray(input)
        ? input as Record<string, unknown>
        : {};

    const { nome, preco, estoque } = dados;

    if (
      typeof nome !== "string" ||
      nome.trim() === "" ||
      typeof preco !== "number" ||
      !Number.isFinite(preco) ||
      preco <= 0 ||
      typeof estoque !== "number" ||
      !Number.isInteger(estoque) ||
      estoque < 0
    ) {
      throw new AppError(
        "Dados do produto são inválidos",
        400,
        "DADOS_INVALIDOS"
      );
    }

    const p = await produtosRepository.criar({
      nome: nome.trim(),
      preco,
      estoque
    });

    return {
      id: p.id,
      nome: p.nome,
      preco: Number(p.preco),
      estoque: p.estoque,
      criadoEm: p.criadoEm
    };
  },

  async reservar(id: number, quantidade: number) {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new AppError(
        "ID inválido", 400, "ID_INVALIDO"
      );
    }

    if (
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      throw new AppError(
        "Quantidade inválida",
        400,
        "QUANTIDADE_INVALIDA"
      );
    }

    const produto = await produtosRepository.buscarPorId(id);

    if (!produto) {
      throw new AppError(
        "Produto não encontrado",
        404,
        "PRODUTO_NAO_ENCONTRADO"
      );
    }

    const resultado = await produtosRepository.reservar(
      id,
      quantidade
    );

    if (resultado.count === 0) {
      throw new AppError(
        "Estoque insuficiente",
        409,
        "ESTOQUE_INSUFICIENTE"
      );
    }

    const atualizado = await produtosRepository.buscarPorId(id);

    if (!atualizado) {
      throw new AppError(
        "Falha ao consultar estoque atualizado",
        500,
        "ERRO_INTERNO"
      );
    }

    return {
      produtoId: id,
      reservado: quantidade,
      precoUnitario: Number(atualizado.preco),
      estoqueRestante: atualizado.estoque
    };
  }
};
