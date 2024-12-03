import pool from "../database.js";

export async function getDetallesMarcas(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaMarca`);

		if (result.length === 0) {
			return res.status(404).json({ message: "No se encontraron marcas." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function editarMarca(req, res) {
	const { id_marca, nombre_marca, estado_marca } = req.body;

	if (!id_marca || !nombre_marca || (estado_marca !== 0 && estado_marca !== 1)) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [result] = await pool.query(`CALL EditarMarca(?, ?, ?)`, [id_marca, nombre_marca, estado_marca]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Marca no encontrado." });
		}

		res.status(200).json({ message: "Marca actualizadoa exitosamente." });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function insertarMarca(req, res) {
	const { nombre_marca, estado_marca } = req.body;
	if (!nombre_marca || (estado_marca !== 0 && estado_marca !== 1)) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [insertResult] = await pool.query(`CALL InsertarMarca(?, ?)`, [nombre_marca, estado_marca]);
		const id_marca = insertResult[0][0].id_marca;

		const [marca] = await pool.query(`SELECT * FROM marca WHERE id_marca = ?`, [id_marca]);

		res.json(marca[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
