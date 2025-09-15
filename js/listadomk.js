import { obtenerTotalItems } from "./carritoStorage.js";
import { dividirCon2Decimales } from "./utils.js";
import { configurarPaginacion } from "./paginacion.js";
let data = []; // Todos los productos
let datosActuales = []; // Datos actualmente mostrados (filtrados o no)

console.log("cantidad de elementos carrito:" + obtenerTotalItems());
function mostrarProductos(pagina = 1) {
	console.log("pagina actual: " + pagina);
	paginaActual = pagina; // Actualizar la variable global

	const inicio = (paginaActual - 1) * elementosMostrar;
	const fin = inicio + elementosMostrar;
	const productosAMostrar = datosActuales.slice(inicio, fin);

	container.innerHTML = productosAMostrar
		.map(
			(producto) => `   
        <div class="col-sm-6 col-lg-4 mb-4">
            <div class="product-card">
                <a href="producto.html" class="product-link" data-id="${
									producto.id
								}" style="text-decoration: none; color: inherit;">
                    <img src="${producto.thumbnail}" alt="${
				producto.name
			}" class="img-fluid product-image">
                    <div class="product-title">${producto.name}</div>
					<div class="shipping-info">Condicion: <strong>${
						producto.condition
					}</strong></div>
                    <div class="product-price">${producto.price}</div>
                    <div class="discount-badge">12% OFF</div>
                    <div class="installments">en 12x ${dividirCon2Decimales(
											producto.price,
											12
										)} sin interés</div>
                    <div class="shipping-info">Envío gratis</div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(243)</span>
                    </div>
                </a>
            </div>
        </div>
    `
		)
		.join("");

	// Delegación de eventos (mejor performance)
	container.addEventListener("click", function (e) {
		if (e.target.closest(".product-link")) {
			e.preventDefault();
			const link = e.target.closest(".product-link");
			const productId = link.dataset.id;
			manejarClickProducto(productId);
		}
	});

	// Configurar paginación - SOLO UNA VEZ y con el callback
	configurarPaginacion(totalPaginas, paginaActual, mostrarProductos);
}

function manejarClickProducto(id) {
	console.log("Producto clickeado:", id);
	localStorage.setItem("productoSeleccionado", id);
	window.location.href = `producto.html`;
}

const container = document.getElementById("product-list");
const baseUrl = "https://68b624a5e5dc090291b0f556.mockapi.io/rsmedia/apiv1/";
container.innerHTML = "<h2>Cargando...</h2>";
let elementosMostrar = 6;
let paginaActual = 1;
let totalPaginas = 1;

/// manejar busqueda por categoria con checkboxes
document
	.getElementById("filtro-categoria")
	.addEventListener("change", function (e) {
		// Verificar que el clic fue en un checkbox de categoría
		if (e.target && e.target.matches('input[name="categoria"]')) {
			/// desmarcar otros checkboxes
			const checkboxesCat = document.querySelectorAll(
				'input[name="categoria"]'
			);
			const checkboxesCond = document.querySelectorAll(
				'input[name="condicion"]'
			);
			const checkboxesMarca = document.querySelectorAll('input[name="marca"]');
			checkboxesCond.forEach((checkbox) => (checkbox.checked = false));
			checkboxesMarca.forEach((checkbox) => (checkbox.checked = false));
			checkboxesCat.forEach((checkbox) => {
				if (checkbox !== e.target) {
					checkbox.checked = false;
				}
			});

			// Obtener el término de búsqueda del checkbox seleccionado
			const termino = e.target.value.toLowerCase();

			// Verificar si el checkbox está marcado o no
			if (e.target.checked) {
				const res = fetch(`${baseUrl}products?category=${termino}`)
					.then((response) => response.json())
					.then((productosFiltrados) => {
						datosActuales = productosFiltrados; // ← Aquí actualizas datosActuales
						totalPaginas = Math.ceil(
							productosFiltrados.length / elementosMostrar
						); // Actualizar totalPaginas
						paginaActual = 1; // Reiniciar a la primera página
						mostrarProductos();
						document.getElementById(
							"results-count"
						).textContent = `${productosFiltrados.length} resultados`;
					})
					.catch((error) => {
						console.error("Error al filtrar productos por categoría:", error);
					});
			} else {
				// Si se desmarca el checkbox, mostrar todos los productos
				fetch(`${baseUrl}products`)
					.then((response) => response.json())
					.then((todosLosProductos) => {
						datosActuales = todosLosProductos; // ← Aquí actualizas datosActuales
						totalPaginas = Math.ceil(
							todosLosProductos.length / elementosMostrar
						); // Actualizar totalPaginas
						paginaActual = 1; // Reiniciar a la primera página
						mostrarProductos();
						document.getElementById(
							"results-count"
						).textContent = `${todosLosProductos.length} resultados`;
					})
					.catch((error) => {
						console.error("Error al cargar todos los productos:", error);
					});
			}
		}
	});
// manejar busqueda por condicion con checkboxes
document
	.getElementById("filtro-condicion")
	.addEventListener("change", function (e) {
		// Verificar que el clic fue en un checkbox de condición
		if (e.target && e.target.matches('input[name="condicion"]')) {
			/// desmarcar otros checkboxes
			const checkboxes = document.querySelectorAll('input[name="condicion"]');
			const checkboxesCat = document.querySelectorAll(
				'input[name="categoria"]'
			);
			const checkboxesMarca = document.querySelectorAll('input[name="marca"]');
			checkboxesCat.forEach((checkbox) => (checkbox.checked = false));
			checkboxesMarca.forEach((checkbox) => (checkbox.checked = false));
			checkboxes.forEach((checkbox) => {
				if (checkbox !== e.target) {
					checkbox.checked = false;
				}
			});
			// Obtener el término de búsqueda del checkbox seleccionado
			const termino = e.target.value.toLowerCase();
			// Verificar si el checkbox está marcado o no
			if (e.target.checked) {
				const res = fetch(`${baseUrl}products?condition=${termino}`)
					.then((response) => response.json())
					.then((productosFiltrados) => {
						datosActuales = productosFiltrados; // ← Aquí actualizas datosActuales
						totalPaginas = Math.ceil(
							productosFiltrados.length / elementosMostrar
						); // Actualizar totalPaginas
						paginaActual = 1; // Reiniciar a la primera página
						mostrarProductos();
						document.getElementById(
							"results-count"
						).textContent = `${productosFiltrados.length} resultados`;
					})
					.catch((error) => {
						console.error("Error al filtrar productos por condición:", error);
					});
			} else {
				// Si se desmarca el checkbox, mostrar todos los productos
				fetch(`${baseUrl}products`)
					.then((response) => response.json())
					.then((todosLosProductos) => {
						datosActuales = todosLosProductos; // ← Aquí actualizas datosActuales
						totalPaginas = Math.ceil(
							todosLosProductos.length / elementosMostrar
						); // Actualizar totalPaginas
						paginaActual = 1; // Reiniciar a la primera página
						mostrarProductos();
						document.getElementById(
							"results-count"
						).textContent = `${todosLosProductos.length} resultados`;
					})
					.catch((error) => {
						console.error("Error al cargar todos los productos:", error);
					});
			}
		}
	});
// manejar busqueda por marca con checkboxes
document
	.getElementById("filtro-marca")
	.addEventListener("change", function (e) {
		// Verificar que el clic fue en un checkbox de marca
		if (e.target && e.target.matches('input[name="marca"]')) {
			/// desmarcar otros checkboxes
			const checkboxes = document.querySelectorAll('input[name="marca"]');
			const checkboxesCat = document.querySelectorAll(
				'input[name="categoria"]'
			);
			const checkboxesCond = document.querySelectorAll(
				'input[name="condicion"]'
			);
			checkboxesCat.forEach((checkbox) => (checkbox.checked = false));
			checkboxesCond.forEach((checkbox) => (checkbox.checked = false));
			checkboxes.forEach((checkbox) => {
				if (checkbox !== e.target) {
					checkbox.checked = false;
				}
			});
			// Obtener el término de búsqueda del checkbox seleccionado
			const termino = e.target.value.toLowerCase();
			// Verificar si el checkbox está marcado o no
			if (e.target.checked) {
				const res = fetch(`${baseUrl}products?brand=${termino}`)
					.then((response) => response.json())
					.then((productosFiltrados) => {
						datosActuales = productosFiltrados; // ← Aquí actualizas datosActuales
						totalPaginas = Math.ceil(
							productosFiltrados.length / elementosMostrar
						); // Actualizar totalPaginas
						mostrarProductos();
						document.getElementById(
							"results-count"
						).textContent = `${productosFiltrados.length} resultados`;
					})
					.catch((error) => {
						console.error("Error al filtrar productos por marca:", error);
					});
			} else {
				// Si se desmarca el checkbox, mostrar todos los productos
				fetch(`${baseUrl}products`)
					.then((response) => response.json())
					.then((todosLosProductos) => {
						datosActuales = todosLosProductos; // ← Aquí actualizas datosActuales
						totalPaginas = Math.ceil(
							todosLosProductos.length / elementosMostrar
						); // Actualizar totalPaginas
						paginaActual = 1; // Reiniciar a la primera página
						mostrarProductos();
						document.getElementById(
							"results-count"
						).textContent = `${todosLosProductos.length} resultados`;
					})
					.catch((error) => {
						console.error("Error al cargar todos los productos:", error);
					});
			}
		}
	});

document.querySelector(".sort-select").addEventListener("change", function () {
	alert(
		"Ordenamiento cambiado a: " +
			this.value +
			". En una aplicación real, esto reordenaría los productos."
	);
});
let totalElementsInCart = obtenerTotalItems();
document.querySelector(".cart-count").textContent =
	"(" + totalElementsInCart + ")";

const butShowCart = document.getElementById("showCart");
if (!totalElementsInCart || totalElementsInCart === 0) {
	//desactivar boton carrito
	butShowCart.classList.add("disabled");
}
butShowCart.addEventListener("click", () => {
	window.location.href = "carrito.html";
});

try {
	const res = await fetch(`${baseUrl}products`);
	if (!res.ok) throw new Error("Error al obtener los productos");
	data = await res.json();
	datosActuales = data; // ← Inicializar datosActuales con todos los productos
	localStorage.setItem("productos", JSON.stringify(data));
	const elementos = data.length;
	totalPaginas = Math.ceil(datosActuales.length / elementosMostrar); // Actualizar totalPaginas

	// Obtener las Categorías únicas usando Set y map
	const categoriasUnicas = [
		...new Set(data.map((producto) => producto.category)),
	];
	console.log("Categorías únicas:", categoriasUnicas);
	// Poblar el select con las categorías únicas
	const filtroCategoria = document.getElementById("filtro-categoria");
	categoriasUnicas.forEach((categoria) => {
		const option = document.createElement("div");
		option.classList.add("form-check");
		const input = document.createElement("input");
		input.classList.add("form-check-input");
		input.type = "checkbox";
		input.name = "categoria";
		input.id = `categoria-${categoria}`;
		input.value = categoria;
		option.appendChild(input);
		const label = document.createElement("label");
		label.classList.add("form-check-label");
		label.htmlFor = `categoria-${categoria}`;
		label.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
		option.appendChild(label);
		filtroCategoria.appendChild(option);
	});

	// Filtrar productos al cambiar el select
	filtroCategoria.addEventListener("change", () => {
		const categoriaSeleccionada = filtroCategoria.value;
		let productosFiltrados = data;
		if (categoriaSeleccionada) {
			productosFiltrados = data.filter(
				(producto) => producto.category === categoriaSeleccionada
			);
			console.log(data);
			console.log(productosFiltrados);
			data = productosFiltrados;
		}
		paginaActual = 1; // Reiniciar a la primera página
		mostrarProductos(paginaActual);
		document.getElementById(
			"results-count"
		).textContent = `${productosFiltrados.length} resultados`;
	});

	// Obtener condiciones únicas usando Set y map
	const condicionesUnicas = [
		...new Set(data.map((producto) => producto.condition)),
	];
	console.log("Condiciones únicas:", condicionesUnicas);

	// Poblar el select con las condiciones únicas
	const filtroCondicion = document.getElementById("filtro-condicion");
	condicionesUnicas.forEach((condicion) => {
		const option = document.createElement("div");
		option.classList.add("form-check");
		const input = document.createElement("input");
		input.classList.add("form-check-input");
		input.type = "checkbox";
		input.name = "condicion";
		input.id = `condicion-${condicion}`;
		input.value = condicion;
		option.appendChild(input);
		const label = document.createElement("label");
		label.classList.add("form-check-label");
		label.htmlFor = `condicion-${condicion}`;
		label.textContent = condicion.charAt(0).toUpperCase() + condicion.slice(1);
		option.appendChild(label);
		filtroCondicion.appendChild(option);
	});

	// Filtrar productos al cambiar el select
	filtroCondicion.addEventListener("change", () => {
		const condicionSeleccionada = filtroCondicion.value;
		let productosFiltrados = data;
		if (condicionSeleccionada) {
			productosFiltrados = data.filter(
				(producto) => producto.condition === condicionSeleccionada
			);
		}
		paginaActual = 1; // Reiniciar a la primera página
		mostrarProductos();
		document.getElementById(
			"results-count"
		).textContent = `${productosFiltrados.length} resultados`;
	});
	// obtener las marcas únicas de los productos
	const marcasUnicas = [...new Set(data.map((producto) => producto.brand))];
	console.log("Marcas únicas:", marcasUnicas);
	// poblar el select con las marcas únicas
	const filtroMarca = document.getElementById("filtro-marca");
	marcasUnicas.forEach((marca) => {
		const option = document.createElement("div");
		option.classList.add("form-check");
		const input = document.createElement("input");
		input.classList.add("form-check-input");
		input.type = "checkbox";
		input.name = "marca";
		input.id = `marca-${marca}`;
		input.value = marca;
		option.appendChild(input);
		const label = document.createElement("label");
		label.classList.add("form-check-label");
		label.htmlFor = `marca-${marca}`;
		label.textContent = marca.charAt(0).toUpperCase() + marca.slice(1);
		option.appendChild(label);
		filtroMarca.appendChild(option);
	});
	// filtrar productos al cambiar el select
	filtroMarca.addEventListener("change", () => {
		const marcaSeleccionada = filtroMarca.value;
		let productosFiltrados = data;
		if (marcaSeleccionada) {
			productosFiltrados = data.filter(
				(producto) => producto.brand === marcaSeleccionada
			);
		}
		paginaActual = 1; // Reiniciar a la primera página
		mostrarProductos();
		document.getElementById(
			"results-count"
		).textContent = `${productosFiltrados.length} resultados`;
	});

	// Mostrar el conteo total de resultados
	document.getElementById(
		"results-count"
	).textContent = `${elementos} resultados`;
	console.log(totalPaginas);

	// Mostrar productos inicialmente
	mostrarProductos(paginaActual);
} catch (error) {
	container.innerHTML = `<h2>Error: ${error.message}</h2>`;
}
