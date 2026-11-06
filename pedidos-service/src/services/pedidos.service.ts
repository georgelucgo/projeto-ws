
import { Pedido, CriarPedidoInput } from "../types";
import { pedidos } from "../data/pedidos";
import { reservarEstoque } from "../clients/catalogo.client";
import { AppError } from "../errors/AppError";

let proximoId = 1;

export async function criarPedido(input: CriarPedidoInput) {
  const { produtoId, quantidade, clienteEmail } = input ?? {};

  // 1. Validar os dados
  if (
    !Number.isInteger(produtoId) ||
    produtoId <= 0 ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0 ||
    typeof clienteEmail !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteEmail)
  ) {
    throw new AppError(
      "Dados do pedido são inválidos",
      400,
      "DADOS_INVALIDOS"
    );
  }

  // 2. Reservar estoque no Catálogo
  const reserva = await reservarEstoque(
    produtoId,
    quantidade
  );

  // 3. Calcular o total
  const total = Number(
    (reserva.precoUnitario * quantidade).toFixed(2)
  );

  // 4. Criar o objeto Pedido
  const novoPedido: Pedido = {
    id: proximoId++,
    produtoId,
    quantidade,
    precoUnitario: reserva.precoUnitario,
    total,
    clienteEmail,
    status: "confirmado",
    notificacaoStatus: "nao_enviada",
    criadoEm: new Date().toISOString()
  };

  // 5. Salvar no array
  pedidos.push(novoPedido);

  // 6. Retornar pedido criado
  return novoPedido;
}

export function listarPedidos() {
  return pedidos;
}

export function buscarPedidoPorId(id: number) {
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) {
    throw new AppError(
      "Pedido não encontrado",
      404,
      "PEDIDO_NAO_ENCONTRADO"
    );
  }

  return pedido;
}
