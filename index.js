import express from "express";
import morgan from "morgan";
import ventasRoutes from "./src/routes/ventas.routes.js";
import comprasRoutes from "./src/routes/compras.routes.js";
import inventarioRoutes from "./src/routes/inventario.routes.js";
import categoriasRoutes from "./src/routes/categorias.routes.js";
import subcategoriasRoutes from "./src/routes/subcategorias.routes.js";
import clientesRoutes from "./src/routes/clientes.routes.js";
import marcasRoutes from "./src/routes/marcas.routes.js";
import usuario from "./src/routes/usuario.routes.js";
import proveedoresRoutes from "./src/routes/proveedores.routes.js";
import empleadosRoutes from "./src/routes/empleados.routes.js";
import loginRoutes from "./src/routes/login.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import { MercadoPagoConfig, Preference } from "mercadopago";
const client = new MercadoPagoConfig({
	accessToken: "APP_USR-7605892655452316-120121-800f464705f575cb46f887cffe7514a4-2132219388",
});
//Intialization
const app = express();

const PORT = process.env.PORT || 4000;
//Settings
app.use(cors());
//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
	const htmlxd = `
    <html lang="es">
<head>
    <title>Silver Music prendido</title>
</head>
<body>
    <h1>API Funcionando</h1>
</body>
</html>
    `;
	res.send(htmlxd);
});

app.post("/mercado", async (req, res) => {
	const { productos } = req.body;
	const items = productos.map((producto) => ({
		title: producto.nombre,
		quantity: Number(producto.cantidad),
		unit_price: Number(producto.precio_unitario),
		currency_id: "PEN",
	}));
	console.log(items);

	try {
		const body = {
			items: items,
			back_urls: {
				success: "https://silvermusic.netlify.app/carrito.html",
				failure: "https://silvermusic.netlify.app/carrito.html",
				pending: "https://silvermusic.netlify.app/carrito.html",
			},
			auto_return: "approved",
		};
		const preference = new Preference(client);
		const result = await preference.create({ body });
		res.json({ id: result.id });
	} catch {
		console.log(error);
		res.status(500).json({ error: "Error al crear la preferencia" });
	}
});

app.use(cookieParser());
app.use(loginRoutes);
app.use(comprasRoutes);
app.use(ventasRoutes);
app.use(categoriasRoutes);
app.use(marcasRoutes);
app.use(subcategoriasRoutes);
app.use(clientesRoutes);
app.use(inventarioRoutes);
app.use(proveedoresRoutes);
app.use(empleadosRoutes);
app.use(usuario); // Agrega las nuevas rutas de login

app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});
