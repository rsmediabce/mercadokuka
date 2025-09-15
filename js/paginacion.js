// Configurar paginación
// paginacion.js
// paginacion.js
let paginationEventListener = null;

export function configurarPaginacion(
	totalPaginas,
	paginaActual,
	callbackMostrarProductos
) {
	const paginationElement = document.getElementById("pagination");

	// Limpiar paginación existente
	paginationElement.innerHTML = "";

	// Eliminar el event listener anterior si existe
	if (paginationEventListener) {
		paginationElement.removeEventListener("click", paginationEventListener);
	}

	// Botón Anterior
	let botAnterior = `<li class="page-item ${
		paginaActual === 1 ? "disabled" : ""
	}">
                        <a class="page-link" href="#" data-page="prev">Anterior</a>
                    </li>`;
	paginationElement.innerHTML = botAnterior;

	// Botones de páginas
	for (let i = 1; i <= totalPaginas; i++) {
		const pageItem = document.createElement("li");
		pageItem.className = "page-item" + (i === paginaActual ? " active" : "");

		const pageLink = document.createElement("a");
		pageLink.className = "page-link";
		pageLink.href = "#";
		pageLink.textContent = i;
		pageLink.dataset.page = i;

		pageItem.appendChild(pageLink);
		paginationElement.appendChild(pageItem);
	}

	// Botón Siguiente
	let botSiguiente = `<li class="page-item ${
		paginaActual === totalPaginas ? "disabled" : ""
	}">
                        <a class="page-link" href="#" data-page="next">Siguiente</a>
                    </li>`;
	paginationElement.innerHTML += botSiguiente;

	// Crear un nuevo event listener
	paginationEventListener = function (e) {
		e.preventDefault();

		if (e.target.tagName === "A") {
			const targetPage = e.target.dataset.page;
			let nuevaPagina = paginaActual;

			if (targetPage === "prev" && paginaActual > 1) {
				nuevaPagina = paginaActual - 1;
			} else if (targetPage === "next" && paginaActual < totalPaginas) {
				nuevaPagina = paginaActual + 1;
			} else if (targetPage && !isNaN(targetPage)) {
				nuevaPagina = parseInt(targetPage);
			}

			// Llamar al callback con la nueva página
			if (nuevaPagina !== paginaActual && callbackMostrarProductos) {
				callbackMostrarProductos(nuevaPagina);
			}
		}
	};

	// Añadir el event listener
	paginationElement.addEventListener("click", paginationEventListener);

	// Actualizar información de página
	const pageInfoElement = document.getElementById("pageInfo");
	if (pageInfoElement) {
		pageInfoElement.textContent = `Página ${paginaActual} de ${totalPaginas}`;
	}
}
