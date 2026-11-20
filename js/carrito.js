const CLAVE_STORAGE = "carrito_ilusion_rock";

let carrito = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];

function guardarCarritoEnStorage() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
  const { id, nombre, precio, imagen } = producto;

  const existeEnCarrito = carrito.some((item) => item.id === id);

  if (existeEnCarrito) {
    const itemExistente = carrito.find((item) => item.id === id);
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      id,
      nombre,
      precio,
      imagen,
      cantidad: 1,
    });
  }

  guardarCarritoEnStorage();
}

function modificarCantidad(idProducto, cambio) {
  const item = carrito.find((producto) => producto.id === idProducto);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(idProducto);
  } else {
    guardarCarritoEnStorage();
  }
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter((producto) => producto.id !== idProducto);
  guardarCarritoEnStorage();
}

function vaciarCarritoStorage() {
  carrito = [];
  localStorage.removeItem(CLAVE_STORAGE);
}

function calcularTotalPrecio() {
  return carrito.reduce((acumulador, item) => acumulador + item.precio * item.cantidad, 0);
}

function calcularTotalUnidades() {
  return carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
}