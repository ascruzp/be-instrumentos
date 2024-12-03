import { Router } from "express";
import * as empleadosControllers from "../controllers/empleados.controllers.js";
const router = Router();

router
	.get("/empleados/detallesEmpleado", empleadosControllers.getDetallesEmpleado)
	.put("/empleados/editarEmpleado", empleadosControllers.editarEmpleado)
	.post("/empleados/insertarEmpleado", empleadosControllers.insertarEmpleado)

export default router;
