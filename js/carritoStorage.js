// utils/carritoStorage.js

const CARRITO_KEY = 'carrito_compras';

// Obtener carrito desde localStorage
function obtenerCarrito() {
    const carrito = localStorage.getItem(CARRITO_KEY);
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(producto, cantidad = 1) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si ya existe, actualizar cantidad (sin exceder stock)
        productoExistente.quantity = Math.min(
            productoExistente.quantity + cantidad,
            producto.stock
        );
    } else {
        // Si no existe, agregar nuevo item
        carrito.push({
            id: producto.id,
            name: producto.name,
            price: producto.price,
            quantity: cantidad,
            image: producto.images[0],
            stock: producto.stock
        });
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    return carrito;
}

// Remover producto del carrito
function removerDelCarrito(productoId) {
    const carrito = obtenerCarrito().filter(item => item.id !== productoId);
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    return carrito;
}

// Actualizar cantidad de un producto
function actualizarCantidad(productoId, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === productoId);
    
    if (item) {
        item.quantity = Math.min(nuevaCantidad, item.stock);
        guardarCarrito(carrito);
        actualizarContadorCarrito();
    }
    
    return carrito;
}

// Obtener total de items en carrito
function obtenerTotalItems() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + item.quantity, 0);
}

// Obtener total precio del carrito
function obtenerTotalPrecio() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Limpiar carrito completo
function limpiarCarrito() {
    localStorage.removeItem(CARRITO_KEY);
    actualizarContadorCarrito();
}

// Actualizar contador visual del carrito
function actualizarContadorCarrito() {
    const totalItems = obtenerTotalItems();
    const contador = document.getElementById('carrito-contador');
    
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

export {
    obtenerCarrito,
    guardarCarrito, 
    agregarAlCarrito,
    removerDelCarrito,
    actualizarCantidad,
    obtenerTotalItems,
    obtenerTotalPrecio,
    limpiarCarrito,
    actualizarContadorCarrito
};