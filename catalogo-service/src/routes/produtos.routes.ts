
import { Router } from "express";
import { produtosService } from "../services/produtos.service";

const router = Router();

router.get("/produtos", async (req, res, next) => {
  try {
    const produtos = await produtosService.listar();
    res.status(200).json(produtos);
  } catch (error) {
    next(error);
  }
});

router.get("/produtos/:id", async (req, res, next) => {
  try {
    const produto = await produtosService.buscarPorId(
      Number(req.params.id)
    );
    res.status(200).json(produto);
  } catch (error) {
    next(error);
  }
});

router.post("/produtos", async (req, res, next) => {
  try {
    const produto = await produtosService.criar(req.body);
    res.status(201).json(produto);
  } catch (error) {
    next(error);
  }
});

router.post("/produtos/:id/reservas", async (req, res, next) => {
  try {
    const reserva = await produtosService.reservar(
      Number(req.params.id),
      req.body?.quantidade
    );
    res.status(200).json(reserva);
  } catch (error) {
    next(error);
  }
});

export default router;
