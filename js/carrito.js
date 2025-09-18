//import { obtenerCarrito } from './carritoStorage.js';

import {
	obtenerCarrito,
	actualizarCantidad,
	limpiarCarrito,
	removerDelCarrito,
	obtenerTotalItems,
} from "./carritoStorage.js";

// obtener carrito desde localStorage
const suCompra = obtenerCarrito();

console.log(suCompra);
const contenedorCarrito = document.getElementById("cart-container");
const cantidadProductosElem = document.getElementById("total-productos");
const cantidadProductosPago = document.getElementById("total-productos-pago");
cantidadProductosElem.textContent = `Productos (${obtenerTotalItems()})`;
cantidadProductosPago.textContent = `Productos (${obtenerTotalItems()})`;
const totalPrecioElem = document.getElementById("total-precio");
const totalSummaryElem = document.getElementById("total-summary");
const totalPrecioPago = document.getElementById("total-precio-pago");
const totalSummaryPago = document.getElementById("total-summary-pago");
const vaciarCarritoBtn = document.querySelector(".btn-vaciar");
let totalPrecio = 0;

/// si toco el boton 1 en el paso 1 vuelvo al carrito
document.getElementById("paso1").addEventListener("click", function () {
	window.location.href = "carrito.html";
});

// Funcion para modificar el stock con fetch y PUT al pagar un producto
// resta las unidades del stock
async function actualizarStock(idProducto, cantidadVendida) {
	const API_URL =
		"https://68b624a5e5dc090291b0f556.mockapi.io/rsmedia/apiv1/products";

	try {
		// Obtenemos el stock actual
		const responseGet = await fetch(`${API_URL}/${idProducto}`);
		if (!responseGet.ok) throw new Error("Producto no encontrado");

		const producto = await responseGet.json();
		const nuevoStock = producto.stock - cantidadVendida;

		if (nuevoStock < 0) throw new Error("Stock insuficiente");

		// Actualizamos solo el campo stock
		const responsePut = await fetch(`${API_URL}/${idProducto}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...producto, // Mantenemos todos los campos existentes
				stock: nuevoStock, // Sobrescribimos solo el stock
			}),
		});

		if (!responsePut.ok) throw new Error("Error en la actualización");

		return await responsePut.json();
	} catch (error) {
		console.error("Error al actualizar stock:", error.message);
		throw error;
	}
}

// Función para renderizar el carrito
function renderizarCarrito() {
	contenedorCarrito.innerHTML = "";
	totalPrecio = 0;
	suCompra.forEach((item) => {
		const itemElem = document.createElement("div");
		itemElem.className = "cart-item";
		itemElem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$ ${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <div class="quantity-btn btn-decrease" data-id="${
											item.id
										}">-</div>
                    <input type="text" class="quantity-input" value="${
											item.quantity
										}" readonly>
                    <div class="quantity-btn btn-increase" data-id="${
											item.id
										}">+</div>
                </div>
                <button class="cart-item-remove btn-remove" data-id="${
									item.id
								}"><i class="fas fa-trash"></i> Eliminar</button>
            </div>
        `;
		contenedorCarrito.appendChild(itemElem);
		totalPrecio += item.price * item.quantity;
	});
	totalPrecioElem.textContent = "$" + totalPrecio.toFixed(2);
	totalPrecioPago.textContent = "$" + totalPrecio.toFixed(2);
	totalSummaryElem.textContent = "$" + totalPrecio.toFixed(2);
	totalSummaryPago.textContent = "$" + totalPrecio.toFixed(2);
	agregarEventosBotones();
}
// Agregar eventos a los botones
function agregarEventosBotones() {
	document.querySelectorAll(".btn-increase").forEach((btn) => {
		btn.addEventListener("click", () => {
			const id = btn.getAttribute("data-id");
			const item = suCompra.find((i) => i.id === id);
			if (item && item.quantity < item.stock) {
				item.quantity++;
				actualizarCantidad(item.id, item.quantity); // Actualizar en localStorage
				cantidadProductosElem.textContent = `Productos (${obtenerTotalItems()})`;
				cantidadProductosPago.textContent = `Productos (${obtenerTotalItems()})`;
				renderizarCarrito();
			}
		});
	});
	document.querySelectorAll(".btn-decrease").forEach((btn) => {
		btn.addEventListener("click", () => {
			const id = btn.getAttribute("data-id");
			const item = suCompra.find((i) => i.id === id);
			if (item && item.quantity > 1) {
				item.quantity--;
				actualizarCantidad(item.id, item.quantity); // Actualizar en localStorage
				cantidadProductosElem.textContent = `Productos (${obtenerTotalItems()})`;
				cantidadProductosPago.textContent = `Productos (${obtenerTotalItems()})`;
				renderizarCarrito();
			}
		});
	});
	document.querySelectorAll(".btn-remove").forEach((btn) => {
		btn.addEventListener("click", () => {
			const id = btn.getAttribute("data-id");
			const index = suCompra.findIndex((i) => i.id === id);
			if (index !== -1) {
				// confirmar eliminación del producto
				Swal.fire({
					title: "¿Estás seguro?",
					text: "Esta acción eliminará el producto del carrito.",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "Sí, eliminar",
					cancelButtonText: "Cancelar",
				}).then((result) => {
					if (result.isConfirmed) {
						Swal.fire(
							"¡Eliminado!",
							"El producto ha sido eliminado del carrito.",
							"success"
						);
						suCompra.splice(index, 1);
						removerDelCarrito(id); // Actualizar en localStorage
						cantidadProductosElem.textContent = `Productos (${obtenerTotalItems()})`;
						cantidadProductosPago.textContent = `Productos (${obtenerTotalItems()})`;
						renderizarCarrito();
					}
				});
			}
		});
	});
	// Evento para vaciar el carrito
	vaciarCarritoBtn.addEventListener("click", () => {
		//confirmar vaciado del carrito
		Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción vaciará todo el carrito.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sí, vaciar",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				suCompra.length = 0;
				limpiarCarrito(); // Limpiar en localStorage
				cantidadProductosElem.textContent = `Productos (${obtenerTotalItems()})`;
				cantidadProductosPago.textContent = `Productos (${obtenerTotalItems()})`;
				renderizarCarrito();
				Swal.fire("¡Vaciado!", "El carrito ha sido vaciado.", "success");
			}
		});
	});
}

/// simulamos el proceso de pago y actualizacion de stock en caso de confirmacion
document.getElementById("payNow").addEventListener("click", function (e) {
	e.preventDefault();
	if (suCompra.length === 0) {
		Swal.fire({
			title: "Carrito vacío",
			text: "No hay productos en el carrito para procesar el pago.",
			icon: "warning",
			confirmButtonText: "Aceptar",
			confirmButtonColor: "#3085d6",
			allowOutsideClick: false,
		});
		return;
	}

	Swal.fire({
		title: "¿Confirmar pago?",
		text: "¿Está seguro de que desea proceder con el pago?",
		icon: "question",
		showCancelButton: true,
		confirmButtonText: "Sí, pagar",
		cancelButtonText: "Cancelar",
	}).then((result) => {
		if (result.isConfirmed) {
			// Procesamiento simulado de pago
			// Mostrar alerta de procesamiento
			Swal.fire({
				title: "Procesando pago",
				text: "Por favor espere mientras procesamos su pago...",
				icon: "info",
				showConfirmButton: false,
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				},
			});

			// Simular proceso de pago con timeout
			setTimeout(() => {
				/// actualizamos el stock de los productos vendidos
				suCompra.forEach((item) => {
					try {
						console.log(
							`Procesando venta de Item ${item.id} restamdo ${item.quantity} unidades...`
						);
						actualizarStock(item.id, item.quantity);
					} catch (error) {
						console.error("❌ Error al procesar la venta:", error.message);
						// Aquí podrías mostrar una alerta al usuario
						alert(`Error: ${error.message}`);
						throw error;
					}
				});
				// Cerrar la alerta de procesamiento
				Swal.close();

				// Mostrar alerta de éxito
				Swal.fire({
					title: "¡Pago exitoso!",
					text: "Su pago se ha procesado correctamente.",
					icon: "success",
					confirmButtonText: "Continuar comprando",
					confirmButtonColor: "#3085d6",
					allowOutsideClick: false,
				}).then((result) => {
					if (result.isConfirmed) {
						// Redirigir a listadomk.html
						window.location.href = "listadomk.html";

						// Opcional: Limpiar el carrito después del pago exitoso
						suCompra.length = 0;
						limpiarCarrito(); // Limpiar en localStorage
					}
				});
			}, 3000); // 3 segundos de delay
		}
	});
});

// Inicializar renderizado
renderizarCarrito();
