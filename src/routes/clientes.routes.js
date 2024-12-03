import { Router } from "express";
import * as clientesControllers from "../controllers/clientes.controllers.js";
const router = Router();

router
	.get("/clientes/detallesCliente", clientesControllers.getDetallesClientes)
	.put("/clientes/editarCliente", clientesControllers.editarCliente)
	.post("/clientes/insertarCliente", clientesControllers.insertarCliente)

export default router;
