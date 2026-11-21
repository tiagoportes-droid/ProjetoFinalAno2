import { Router } from "express";
import * as produtoController from "../controllers/produtoController.js";

const router = Router();

router.get("/", produtoController.listarProdutos);
router.get("/categorias", produtoController.listarCategorias);
router.get("/:id", produtoController.buscarProduto);
router.post("/consultas", produtoController.registrarConsulta);

export default router;
