import pool from "../database.js";

export async function getDetallesSubCategorias(req, res) {
	try {
		const [result] = await pool.query(`SELECT * FROM VistaSubCategoria`);

		if (result.length === 0) {
			return res.status(404).json({ message: "No se encontraron subcategoras." });
		}

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function editarSubCategoria(req, res) {
	const { id_subcategoria, id_categoria, nombre_subcategoria, estado_subcategoria } = req.body;
	if (!id_categoria || !nombre_subcategoria || !id_subcategoria || (estado_subcategoria !== 0 && estado_subcategoria !== 1)) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [result] = await pool.query(`CALL EditarSubCategoria(?, ?, ?, ?)`, [id_subcategoria, nombre_subcategoria, estado_subcategoria, id_categoria]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Sub-Categoria no encontrado." });
		}

		res.status(200).json({ message: "Sub-Categoria actualizadoa exitosamente." });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function insertarSubCategoria(req, res) {
	const { nombre_categoria, estado_subcategoria, id_categoria, nombre_subcategoria } = req.body;
	if (!nombre_categoria || !id_categoria || !nombre_subcategoria || (estado_subcategoria !== 0 && estado_subcategoria !== 1)) {
		return res.status(400).json({ message: "Todos los campos son obligatorios." });
	}

	try {
		const [insertResult] = await pool.query(`CALL InsertarSubCategoria(?, ?, ? , ?)`, [nombre_categoria, estado_subcategoria, id_categoria, nombre_subcategoria]);
		const id_subcategoria = insertResult[0][0].id_subcategoria;

		const [subcategoria] = await pool.query(`SELECT * FROM subcategoria WHERE id_subcategoria = ?`, [id_subcategoria]);

		res.json(subcategoria[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
