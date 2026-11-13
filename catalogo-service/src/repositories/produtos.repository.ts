
import { prisma } from "../lib/prisma";

export const produtosRepository = {

  // Listar produtos
  listar() {
    return prisma.produto.findMany({
      orderBy: { id: "asc" }
    });
  },

  // Buscar produto pelo ID
  buscarPorId(id: number) {
    return prisma.produto.findUnique({
      where: { id }
    });
  },

  // Cadastrar produto
  criar(data: {
    nome: string;
    preco: number;
    estoque: number;
  }) {
    return prisma.produto.create({
      data
    });
  },

  // Diminuir estoque somente se houver quantidade suficiente
  reservar(id: number, quantidade: number) {
    return prisma.produto.updateMany({
      where: {
        id,
        estoque: { gte: quantidade }
      },
      data: {
        estoque: { decrement: quantidade }
      }
    });
  }
};
