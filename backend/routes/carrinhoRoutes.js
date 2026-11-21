import { Router } from "express";
import * as carrinhoController from "../controllers/carrinhoController.js";
import { exigirLogin } from "../middlewares/auth.js";

const router = Router();

router.use(exigirLogin);
router.get("/", carrinhoController.obter);
router.post("/itens", carrinhoController.adicionar);
router.put("/itens/:id", carrinhoController.alterar);
router.delete("/itens/:id", carrinhoController.remover);
router.delete("/", carrinhoController.limpar);

export default router;
