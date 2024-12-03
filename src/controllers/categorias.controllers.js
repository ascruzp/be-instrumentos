import pool from "../database.js";

export async function getDetallesCategorias(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaCategoria`);

		if (result.length === 0) {
			return res.status(404).json({ message: "No se encontraron categoras." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function editarCategoria(req, res) {
	const { id_categoria, nombre_categoria, estado_categoria } = req.body;

	if (!id_categoria || !nombre_categoria || (estado_categoria !== 0 && estado_categoria !== 1)) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [result] = await pool.query(`CALL EditarCategoria(?, ?, ?)`, [id_categoria, nombre_categoria, estado_categoria]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Categoria no encontrado." });
		}

		res.status(200).json({ message: "Categoria actualizadoa exitosamente." });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function insertarCategoria(req, res) {
	const { nombre_categoria, estado_categoria } = req.body;
	if (!nombre_categoria || (estado_categoria !== 0 && estado_categoria !== 1)) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [insertResult] = await pool.query(`CALL InsertarCategoria(?, ?)`, [nombre_categoria, estado_categoria]);
		const id_categoria = insertResult[0][0].id_categoria;

		const [categoria] = await pool.query(`SELECT * FROM categoria WHERE id_categoria = ?`, [id_categoria]);

		res.json(categoria[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
