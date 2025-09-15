import {
	agregarAlCarrito,
	actualizarContadorCarrito,
	obtenerTotalItems,
} from "./carritoStorage.js";
import { dividirCon2Decimales } from "./utils.js";

// Función auxiliar para formatear las claves
function formatClave(clave) {
	// Convertir camelCase a palabras separadas y capitalizar
	return clave
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
}

// Función para manejar el click en las miniaturas
function manejarClickMiniatura(event) {
	const img = event.target.closest("img");
	if (img && img.parentElement.classList.contains("thumbnail")) {
		const imgSrc = img.src;

		// Cambiar imagen principal
		document.getElementById("main-product-image").src = imgSrc;

		// Actualizar clases active
		document.querySelectorAll(".thumbnail").forEach((thumb) => {
			thumb.classList.remove("active");
		});
		img.parentElement.classList.add("active");
	}
}

const prueba = document.getElementById("title-id");
const barraImg = document.getElementById("mini-img-prod");
barraImg.addEventListener("click", manejarClickMiniatura);
const verCarrito = document.getElementById("showCart");
let totalElementsInCart = obtenerTotalItems();
if (totalElementsInCart !== null && totalElementsInCart > 0) {
	/// si hay elementos en el carrito muestro la cantidad en el boton ver carrito
	document.querySelector(".cart-count").textContent =
		"(" + totalElementsInCart + ")";
} else {
	document.querySelector(".cart-count").textContent = "";
	// desactivo el boton
	verCarrito.disabled = true;
}

const baseUrl = "https://68b624a5e5dc090291b0f556.mockapi.io/rsmedia/apiv1/";
const productId = localStorage.getItem("productoSeleccionado");

prueba.textContent = `Producto ID: ${productId}`;
console.log("ID del producto seleccionado:", productId);

// Función para obtener un producto por ID
async function obtenerProductoPorId(id) {
	try {
		const response = await fetch(`${baseUrl}products/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}
		const producto = await response.json();
		return producto;
	} catch (error) {
		console.error("Error al obtener el producto:", error);
		throw error;
	}
}

// Usar la función

try {
	if (!productId) {
		throw new Error(
			"No se encontró el ID del producto en el almacenamiento local."
		);
	} else {
		console.log("ID del producto seleccionado:", productId);
		obtenerProductoPorId(productId)
			.then((producto) => {
				console.log("Producto obtenido:", producto);

				document.getElementById("product-title").textContent = producto.name;
				document.getElementById("product-price").innerHTML =
					"$ " + producto.price + '<small class="text-muted">$</small>';
				document.querySelector(
					".installments"
				).innerHTML = `en 12x ${dividirCon2Decimales(
					producto.price,
					12
				)} sin interés`;
				document.getElementById("descripProd").textContent =
					producto.description;
				document.getElementById("prodCat").textContent = producto.category;
				document.getElementById("prodBrand").textContent =
					producto.brand || "N/A";
				document.getElementById("prodEstado").textContent =
					producto.condition || "N/A";
				document.querySelector(
					".stock-info"
				).innerHTML = `<i class="fas fa-check-circle"></i> En stock (${producto.stock} disponibles)`;

				// Manejo de las imágenes laterales
				barraImg.innerHTML = producto.images
					.map(
						(img, index) => `
                    <div class="thumbnail ${index === 0 ? "active" : ""}">
                        <img src="${img}" class="img-fluid" alt="Miniatura ${
							index + 1
						}">      
                    </div>
                `
					)
					.join("");

				// Imagen principal
				document.getElementById("main-product-image").src = producto.images[0];
				procesarEspecificaciones(producto.specifications);
				// Agregar evento al botón "Agregar al carrito"
				document.getElementById("butComp").addEventListener("click", () => {
					const cantidad =
						parseInt(document.getElementById("quantity").value) || 1;
					agregarAlCarrito(producto, cantidad);

					// Mostrar mensaje de confirmación
					Swal.fire({
						icon: "success",
						title: "¡Producto agregado!",
						text: `${producto.name} se agregó al carrito`,
						timer: 2000,
					});
					actualizarContadorCarrito();
					totalElementsInCart = obtenerTotalItems();
					document.querySelector(".cart-count").textContent =
						"(" + totalElementsInCart + ")";
					console.log(
						`Producto ${producto.name} agregado al carrito. Cantidad: ${cantidad}`
					);
					// Redirigir al carrito de compras

					window.location.href = "carrito.html";
				});
				document.getElementById("butAddCart").addEventListener("click", () => {
					const cantidad =
						parseInt(document.getElementById("quantity").value) || 1;
					agregarAlCarrito(producto, cantidad);
					// Mostrar mensaje de confirmación
					Swal.fire({
						icon: "success",
						title: "¡Producto agregado!",
						text: `${producto.name} se agregó al carrito`,
						timer: 2000,
					});
					actualizarContadorCarrito();
					console.log(
						`Producto ${producto.name} agregado al carrito. Cantidad: ${cantidad}`
					);
					totalElementsInCart = obtenerTotalItems();
					document.querySelector(".cart-count").textContent =
						"(" + totalElementsInCart + ")";
					// Habilitar el botón de ver carrito
					verCarrito.disabled = false;
				});
				/// Botón para ver el carrito
				verCarrito.addEventListener("click", () => {
					window.location.href = "carrito.html";
				});
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
} catch (error) {
	console.error("Error al recuperar el ID del producto:", error);

	// Manejo adicional del error si es necesario

	document.getElementById("product-title").textContent =
		"Producto no encontrado";
	document.getElementById("product-price").textContent = "";
}

function procesarEspecificaciones(specifications) {
	const especificacionesIzq = document.getElementById("spec-iz");
	const especificacionesDer = document.getElementById("spec-dr");

	// Limpiar contenedores existentes
	especificacionesIzq.innerHTML = "";
	especificacionesDer.innerHTML = "";

	// Validar si specifications existe y tiene contenido
	if (!specifications || Object.keys(specifications).length === 0) {
		const mensaje = document.createElement("li");
		mensaje.className = "list-group-item text-muted";
		mensaje.textContent = "No hay especificaciones disponibles";
		especificacionesIzq.appendChild(mensaje);
		return;
	}

	// Convertir a array si es un objeto
	let especificacionesArray = [];

	if (Array.isArray(specifications)) {
		// Si ya es un array, usarlo directamente
		especificacionesArray = specifications;
	} else if (typeof specifications === "object" && specifications !== null) {
		// Si es un objeto, convertirlo a array de pares [clave, valor]
		especificacionesArray = Object.entries(specifications);
	} else {
		// Formato no reconocido
		const mensaje = document.createElement("li");
		mensaje.className = "list-group-item text-danger";
		mensaje.textContent = "Formato de especificaciones no válido";
		especificacionesIzq.appendChild(mensaje);
		return;
	}

	// Procesar cada especificación
	especificacionesArray.forEach((espec, index) => {
		let clave, valor;

		// Determinar si es un array de pares [clave, valor] o un objeto con propiedades
		if (Array.isArray(espec) && espec.length === 2) {
			[clave, valor] = espec;
		} else if (typeof espec === "object" && espec !== null) {
			clave = espec.key || espec.nombre || "Especificación";
			valor = espec.value || espec.valor || "N/A";
		} else {
			clave = `Especificación ${index + 1}`;
			valor = espec;
		}

		// Formatear la clave para mejor visualización
		const claveFormateada = formatClave(clave);

		// Crear elemento de lista
		const li = document.createElement("li");
		li.className =
			"list-group-item d-flex justify-content-between align-items-center";
		li.innerHTML = `
            <span class="fw-bold">${claveFormateada}:</span>
            <span class="text-end">${valor}</span>
        `;

		// Alternar entre columnas izquierda y derecha
		if (index % 2 === 0) {
			especificacionesIzq.appendChild(li);
		} else {
			especificacionesDer.appendChild(li);
		}
	});
}
