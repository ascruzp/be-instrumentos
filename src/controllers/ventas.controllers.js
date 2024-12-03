import pool from "../database.js";
export async function setActualizarBoleta(req, res) {
	try {
		const { numero_boleta, estado_boleta, tracking } = req.body;
		if (!numero_boleta) {
			return res.status(400).json({ message: "Faltan parámetros necesarios (numero_boleta, estado, tracking)" });
		}
		const [result] = await pool.query(
			`UPDATE boleta
             SET estado_boleta = ?, tracking = ?
             WHERE numero_boleta = ?`,
			[estado_boleta, tracking, numero_boleta]
		);
		return res.status(200).json({ message: "Estado de boleta actualizado" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}

export async function getUltimoNumeroBoleta(req, res) {
	try {
		const [num_boleta] = await pool.query("SELECT obtener_ultimo_numero_boleta() AS ultimo_numero_boleta");

		res.json(num_boleta);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getUltimoIDCliente(req, res) {
	try {
		const [num_boleta] = await pool.query("SELECT obtener_ultimo_id_cliente() AS ultimo_id_cliente");

		res.json(num_boleta);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getObtenerIdUsuario(req, res) {
	try {
		const { usuario_cliente } = req.query;
		if (!usuario_cliente) {
			return res.status(400).json({ message: "El campo 'usuario_cliente' es obligatorio." });
		}
		const [result] = await pool.query(`CALL WebObtenerIdCliente(?, @cliente_id)`, [usuario_cliente]);
		const [output] = await pool.query("SELECT @cliente_id AS cliente_id");
		if (!output || output.length === 0 || !output[0].cliente_id) {
			return res.status(404).json({ message: "No se encontró el cliente con ese usuario." });
		}
		const id_cliente = output[0].cliente_id;
		const [boletas] = await pool.query(`SELECT * FROM VistaBoletaGeneral WHERE id_cliente = ?`, [id_cliente]);

		if (!boletas || boletas.length === 0) {
			return res.status(404).json({ message: "No se encontraron boletas para este cliente." });
		}
		const todasLasBoletas = [];
		for (let i = 0; i < boletas.length; i++) {
			const numero_boleta = boletas[i].numero_boleta;
			const [detalleBoleta] = await pool.query(`CALL MostrarDetalleVentaSeparado(?)`, [numero_boleta]);
			todasLasBoletas.push({
				...boletas[i],
				detalle: detalleBoleta,
			});
		}
		return res.json(todasLasBoletas);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getMetodoPagoProducto(req, res) {
	try {
		const [metodosPago] = await pool.query("SELECT id_metodo_pago as value, nombre_metodo_pago as label FROM metodo_pago");
		res.json(metodosPago);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getBuscarProducto(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = 5;
		const offset = (page - 1) * pageSize;
		const searchTerm = req.query.search || "";

		const searchQuery = `
            SELECT id_producto, nombre_producto, precio_unitario
            FROM producto
            WHERE nombre_producto LIKE ?
            LIMIT ? OFFSET ?
        `;
		const [productosEncontrados] = await pool.query(searchQuery, [`%${searchTerm}%`, pageSize, offset]);

		const countQuery = `
            SELECT COUNT(*) AS total 
            FROM producto
            WHERE nombre_producto LIKE ?
        `;
		const [totalProductos] = await pool.query(countQuery, [`%${searchTerm}%`]);
		const total = totalProductos[0].total;
		const totalPages = Math.ceil(total / pageSize);

		const response = {
			count: productosEncontrados.length,
			total: total,
			totalPages: totalPages,
			currentPage: page,
			next: page < totalPages ? `/ventas/buscarProducto?search=${searchTerm}&page=${Number(page) + 1}` : null,
			previous: page > 1 ? `/ventas/buscarProducto?search=${searchTerm}&page=${Number(page) - 1}` : null,
			results: productosEncontrados.map((producto) => ({
				id_producto: producto.id_producto,
				name: producto.nombre_producto,
				precio_unitario: producto.precio_unitario,
			})),
		};

		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function setSubirVenta(req, res) {
	const { cliente, celular_cliente, direccion_cliente, fecha_registro, metodo_pago, fecha_boleta, metodo_entrega, total_venta, productos } = req.body;

	const productos_json = JSON.stringify(productos);

	try {
		await pool.query(`CALL InsertarVenta(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			cliente,
			celular_cliente,
			direccion_cliente,
			fecha_registro,
			metodo_pago,
			fecha_boleta,
			metodo_entrega,
			total_venta,
			productos_json,
		]);
		res.status(200).json({ message: "Venta registrada exitosamente" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getMostrarBoletaGeneral(req, res) {
	try {
		const [boleta] = await pool.query(`Select * from VistaBoletaGeneral`);
		res.status(200).json(boleta);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getMostrarBoletaProductos(req, res) {
	const { id_boleta } = req.query;
	try {
		const [productos] = await pool.query(`CALL MostrarDetalleVentaSeparado(?)`, [id_boleta]);
		res.status(200).json(productos[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function WebsetSubirVenta(req, res) {
	const { cliente_nombre, celular_cliente, direccion_cliente, usuario_cliente, fecha_registro, metodo_pago, fecha_boleta, metodo_entrega, total_venta, productos } = req.body;

	const productos_json = JSON.stringify(productos);

	try {
		await pool.query(`CALL WebInsertarVenta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			cliente_nombre,
			celular_cliente,
			direccion_cliente,
			usuario_cliente,
			fecha_registro,
			metodo_pago,
			fecha_boleta,
			metodo_entrega,
			total_venta,
			productos_json,
		]);

		res.status(200).json({ message: "Venta registrada exitosamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}
