import { Router } from "express";
import * as categoriasControllers from "../controllers/categorias.controllers.js";
const router = Router();

router
	.get("/categoria/detallesCategoria", categoriasControllers.getDetallesCategorias)
	.put("/categoria/editarCategoria", categoriasControllers.editarCategoria)
	.post("/categoria/insertarCategoria", categoriasControllers.insertarCategoria)

export default router;
