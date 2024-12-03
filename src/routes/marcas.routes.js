import { Router } from "express";
import * as marcasControllers from "../controllers/marcas.controllers.js";
const router = Router();

router
	.get("/marcas/detallesMarca", marcasControllers.getDetallesMarcas)
	.put("/marcas/editarMarca", marcasControllers.editarMarca)
	.post("/marcas/insertarMarca", marcasControllers.insertarMarca)

export default router;
