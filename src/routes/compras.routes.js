import { Router } from "express";
import * as comprasControllers from "../controllers/compras.controllers.js";
const router = Router();

router
	// Obtener ultimo numero boleta
	.get("/compras/ultimoNumeroFactura", comprasControllers.getUltimoNumeroFactura)
	// Buscar productos
	.get("/compras/buscarProveedor", comprasControllers.getBuscarProveedor)
	.get("/compras/verFacturaGeneral", comprasControllers.getMostrarFacturaGeneral)
	.get("/compras/verFacturaProductos", comprasControllers.getMostrarFacturaProductos)
	.post("/compras/subirFactura", comprasControllers.setSubirFactura);

export default router;
