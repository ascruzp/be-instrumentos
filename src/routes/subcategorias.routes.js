import { Router } from "express";
import * as subcategoriasControllers from "../controllers/subcategorias.controllers.js";
const router = Router();

router
	.get("/subcategoria/detallesSubCategoria", subcategoriasControllers.getDetallesSubCategorias)
	.put("/subcategoria/editarSubCategoria", subcategoriasControllers.editarSubCategoria)
	.post("/subcategoria/insertarSubCategoria", subcategoriasControllers.insertarSubCategoria)

export default router;
