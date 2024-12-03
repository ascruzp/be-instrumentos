import { Router } from "express";
import * as proveedoresControllers from "../controllers/proveedores.controllers.js";
const router = Router();

router
	.get("/proveedores/detallesProveedor", proveedoresControllers.getDetallesProveedores)
	.put("/proveedores/editarProveedor", proveedoresControllers.editarProveedor)
	.post("/proveedores/insertarProveedor", proveedoresControllers.insertarProveedor)

export default router;
