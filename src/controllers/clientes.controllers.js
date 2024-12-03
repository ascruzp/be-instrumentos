import pool from "../database.js";

export async function getDetallesClientes(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaCliente`);

		if (result.length === 0) {
			return res.status(404).json({ message: "No se encontraron clientes." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function editarCliente(req, res) {
	const { id_cliente, nombre_cliente, fecha_registro_cliente, usuario_cliente, password_cliente, celular_cliente, direccion_cliente, dni_cliente } = req.body;

	if (!id_cliente || !nombre_cliente) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const fechaFormateada = new Date(fecha_registro_cliente).toISOString().split("T")[0];
		const [result] = await pool.query(`CALL EditarCliente(?, ?, ?, ?, ?, ?, ?, ?)`, [
			id_cliente,
			nombre_cliente,
			fechaFormateada,
			usuario_cliente,
			password_cliente,
			celular_cliente,
			direccion_cliente,
			dni_cliente,
		]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Cliente no encontrado." });
		}

		res.status(200).json({ message: "Cliente actualizado exitosamente." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}
export async function insertarCliente(req, res) {
	const { nombre_cliente, fecha_registro_cliente, usuario_cliente, password_cliente, celular_cliente, direccion_cliente, dni_cliente } = req.body;

	if (!nombre_cliente || !fecha_registro_cliente) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}
	try {
		const [insertResult] = await pool.query(`CALL InsertarCliente2(?, ?, ?, ?, ?, ?, ?)`, [
			nombre_cliente,
			fecha_registro_cliente,
			usuario_cliente,
			password_cliente,
			celular_cliente,
			direccion_cliente,
			dni_cliente,
		]);
		const id_cliente = insertResult[0][0].id_cliente;
		const [cliente] = await pool.query(`SELECT * FROM cliente WHERE id_cliente = ?`, [id_cliente]);
		res.json(cliente[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
