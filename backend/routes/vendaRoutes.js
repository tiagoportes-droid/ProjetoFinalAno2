import { Router } from "express";
import * as vendaController from "../controllers/vendaController.js";
import { exigirLogin } from "../middlewares/auth.js";

const router = Router();

router.use(exigirLogin);
router.post("/checkout", vendaController.finalizar);
router.get("/pedidos", vendaController.historico);

export default router;
