import pool from "../database.js";

export async function getDetallesEmpleado(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaEmpleados`);

		if (result.length === 0) {
			return res.status(404).json({ message: "No se encontraron proveedores." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
export async function editarEmpleado(req, res) {
	const { DNI_empleado, nombre_empleado, apellido_empleado, celular_empleado, direccion_empleado, sexo, estado_empleado, usuario_empleado, contrasena_empleado, estado_cargo } = req.body;

	if (!DNI_empleado || !nombre_empleado || !apellido_empleado || !celular_empleado || !direccion_empleado || !sexo || !estado_empleado || !usuario_empleado || !contrasena_empleado) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [result] = await pool.query(`CALL ActualizarEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			DNI_empleado,
			nombre_empleado,
			apellido_empleado,
			celular_empleado,
			direccion_empleado,
			sexo,
			estado_empleado,
			usuario_empleado,
			contrasena_empleado,
			estado_cargo,
		]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Empleado no encontrado." });
		}

		res.status(200).json({ message: "Empleado actualizado exitosamente." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}

export async function insertarEmpleado(req, res) {
	const { DNI_empleado, nombre_empleado, apellido_empleado, celular_empleado, direccion_empleado, sexo, estado_empleado, usuario_empleado, contrasena_empleado, estado_cargo } = req.body;

	if (!DNI_empleado || !nombre_empleado || !apellido_empleado || !celular_empleado || !direccion_empleado || !sexo || !estado_empleado || !usuario_empleado || !contrasena_empleado) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [insertResult] = await pool.query(`CALL InsertarEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			DNI_empleado,
			nombre_empleado,
			apellido_empleado,
			celular_empleado,
			direccion_empleado,
			sexo,
			estado_empleado,
			usuario_empleado,
			contrasena_empleado,
			estado_cargo,
		]);

		// Buscamos el empleado recién insertado para devolverlo
		const [empleado] = await pool.query(`SELECT * FROM empleado WHERE DNI_empleado = ?`, [DNI_empleado]);

		res.status(201).json(empleado[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}
