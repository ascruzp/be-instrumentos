import pool from "../database.js";

export async function setLogin(req, res) {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({ error: "Complete los campos para entrar" });
		}

		const [rows] = await pool.query("CALL BuscarEstadoCargo(?, ?)", [username, password]);

		if (rows[0][0].resultado === null) {
			return res.status(200).json({
				message: "No encontrado",
				valid: null,
				redirectTo: "/login",
			});
		}

		const estado_cargo = rows[0][0].resultado;

		if (estado_cargo === "1") {
			return res.status(200).json({
				message: "Empleado",
				valid: "1",
				redirectTo: "/ventas",
			});
		} else if (estado_cargo === "2") {
			return res.status(200).json({
				message: "Administrador",
				valid: "2",
				redirectTo: "/",
			});
		} else {
			return res.status(200).json({
				message: "No encontrado",
				valid: "0",
				redirectTo: "/login",
			});
		}
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}
