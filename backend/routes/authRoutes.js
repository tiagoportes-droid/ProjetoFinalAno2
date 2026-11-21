import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { exigirLogin } from "../middlewares/auth.js";

const router = Router();

router.post("/cadastro", authController.cadastrar);
router.post("/login", authController.login);
router.get("/perfil", exigirLogin, authController.perfil);
router.put("/perfil", exigirLogin, authController.atualizarPerfil);

export default router;
