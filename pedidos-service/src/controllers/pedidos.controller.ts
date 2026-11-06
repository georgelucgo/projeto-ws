
import { Request, Response, NextFunction } from "express";
import * as pedidoService from "../services/pedidos.service";

export async function criar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pedido = await pedidoService.criarPedido(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
}

export function listar(req: Request, res: Response) {
  const pedidos = pedidoService.listarPedidos();
  res.status(200).json(pedidos);
}

export function buscarPorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const pedido = pedidoService.buscarPedidoPorId(id);

    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
}
