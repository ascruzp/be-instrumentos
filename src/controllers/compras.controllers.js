import pool from "../database.js";

export async function getUltimoNumeroFactura(req, res) {
	try {
		const [num_factura] = await pool.query("SELECT obtener_ultimo_numero_factura() AS ultimo_numero_factura");

		res.json(num_factura);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getBuscarProveedor(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = 5;
		const offset = (page - 1) * pageSize;
		const searchTerm = req.query.search || "";

		const searchQuery = `
            SELECT RUC_proveedor, nombre_proveedor, direccion_proveedor
            FROM proveedor
            WHERE nombre_proveedor LIKE ?
            LIMIT ? OFFSET ?
        `;
		const [productosEncontrados] = await pool.query(searchQuery, [`%${searchTerm}%`, pageSize, offset]);

		const countQuery = `
            SELECT COUNT(*) AS total 
            FROM proveedor
            WHERE nombre_proveedor LIKE ?
        `;
		const [totalProductos] = await pool.query(countQuery, [`%${searchTerm}%`]);
		const total = totalProductos[0].total;
		const totalPages = Math.ceil(total / pageSize);

		const response = {
			count: productosEncontrados.length,
			total: total,
			totalPages: totalPages,
			currentPage: page,
			next: page < totalPages ? `/compras/buscarProveedor?search=${searchTerm}&page=${Number(page) + 1}` : null,
			previous: page > 1 ? `/compras/buscarProveedor?search=${searchTerm}&page=${Number(page) - 1}` : null,
			results: productosEncontrados.map((producto) => ({
				RUC_proveedor: producto.RUC_proveedor,
				nombre_proveedor: producto.nombre_proveedor,
				direccion_proveedor: producto.direccion_proveedor,
			})),
		};

		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function setSubirFactura(req, res) {
	const { id_proveedor, id_metodo_pago, fecha_factura, total_factura, productos } = req.body;

	const productos_json = JSON.stringify(productos);

	try {
		await pool.query(`CALL InsertarFactura(?, ?, ?, ?, ?)`, [id_proveedor, id_metodo_pago, fecha_factura, total_factura, productos_json]);
		res.status(200).json({ message: "Factura registrada exitosamente" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getMostrarFacturaGeneral(req, res) {
	try {
		const [factura] = await pool.query(`Select * from VistaFacturaGeneral`);
		res.status(200).json(factura);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export async function getMostrarFacturaProductos(req, res) {
	const { id_factura } = req.query;
	try {
		const [productos] = await pool.query(`CALL MostrarDetalleCompraSeparado(?)`, [id_factura]);
		res.status(200).json(productos[0]);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
