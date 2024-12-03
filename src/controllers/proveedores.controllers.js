import pool from "../database.js";

export async function getDetallesProveedores(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaProveedores`);

		if (result.length === 0) {
			return res.status(404).json({ message: "No se encontraron proveedores." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
export async function editarProveedor(req, res) {
	const { RUC_proveedor, nombre_proveedor, celular_proveedor, direccion_proveedor } = req.body;
	if (!RUC_proveedor || !nombre_proveedor || !celular_proveedor || !direccion_proveedor) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}
	try {
		const [result] = await pool.query(`CALL ActualizarProveedor(?, ?, ?, ?)`, [RUC_proveedor, nombre_proveedor, celular_proveedor, direccion_proveedor]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Proveedor no encontrado." });
		}

		res.status(200).json({ message: "Proveedor actualizado exitosamente." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}
export async function insertarProveedor(req, res) {
	const { RUC_proveedor, nombre_proveedor, celular_proveedor, direccion_proveedor } = req.body;

	if (!RUC_proveedor || !nombre_proveedor || !celular_proveedor || !direccion_proveedor) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}
	try {
		const [insertResult] = await pool.query(`CALL InsertarProveedor(?, ?, ?, ?)`, [RUC_proveedor, nombre_proveedor, celular_proveedor, direccion_proveedor]);
		const [proveedor] = await pool.query(`SELECT * FROM proveedor WHERE RUC_proveedor = ?`, [RUC_proveedor]);
		res.status(201).json(proveedor[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
