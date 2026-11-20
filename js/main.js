let catalogoProductos = [];

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const seccionCheckout = document.getElementById("seccion-checkout");
const contadorCarrito = document.getElementById("contador-carrito");
const precioTotalElemento = document.getElementById("precio-total");
const inputBusqueda = document.getElementById("input-busqueda");
const selectCategoria = document.getElementById("select-categoria");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const formCompra = document.getElementById("form-compra");

function mostrarNotificacionToast(mensaje, colorFondo = "#198754") {
  Toastify({
    text: mensaje,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: {
      background: colorFondo,
      borderRadius: "8px",
      fontSize: "14px",
    },
  }).showToast();
}

function renderizarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";

  if (listaProductos.length === 0) {
    contenedorProductos.innerHTML = `
      <div class="col-12 text-center text-secondary my-5">
        <p class="fs-5">No encontramos productos que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  listaProductos.forEach((producto) => {
    const { id, nombre, categoria, precio, imagen, descripcion } = producto;

    const columna = document.createElement("div");
    columna.className = "col-sm-6 col-lg-4";

    columna.innerHTML = `
      <article class="card h-100 bg-black text-light border-secondary card-producto">
        <img src="${imagen}" class="card-img-top" alt="${nombre}" onerror="this.src='https://placehold.co/400x300/1a1a1a/dc3545?text=Ilusion+Rock'">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <span class="badge bg-secondary text-uppercase mb-2">${categoria}</span>
            <h5 class="card-title fw-bold">${nombre}</h5>
            <p class="card-text text-secondary small">${descripcion}</p>
          </div>
          <div class="mt-3">
            <p class="fs-4 fw-bold text-danger mb-2">$${precio.toLocaleString("es-AR")}</p>
            <button class="btn btn-danger w-100 btn-agregar" data-id="${id}">
              Agregar al carrito
            </button>
          </div>
        </div>
      </article>
    `;

    contenedorProductos.appendChild(columna);
  });

  asignarEventosBotonesAgregar();
}

function asignarEventosBotonesAgregar() {
  const botonesAgregar = document.querySelectorAll(".btn-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      const idSeleccionado = Number(evento.currentTarget.dataset.id);
      const productoEncontrado = catalogoProductos.find((prod) => prod.id === idSeleccionado);

      if (productoEncontrado) {
        agregarAlCarrito(productoEncontrado);
        actualizarInterfazCarrito();
        mostrarNotificacionToast(`Agregaste "${productoEncontrado.nombre}" al carrito`);
      }
    });
  });
}

function actualizarInterfazCarrito() {
  contadorCarrito.textContent = calcularTotalUnidades();
  precioTotalElemento.textContent = `$${calcularTotalPrecio().toLocaleString("es-AR")}`;

  carrito.length === 0
    ? seccionCheckout.classList.add("d-none")
    : seccionCheckout.classList.remove("d-none");

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
      <p class="text-secondary text-center my-5">Tu carrito está vacío. ¡Elegí tus prendas favoritas!</p>
    `;
    return;
  }

  contenedorCarrito.innerHTML = "";

  carrito.forEach((item) => {
    const { id, nombre, precio, cantidad } = item;
    const subtotal = precio * cantidad;

    const divItem = document.createElement("div");
    divItem.className = "item-carrito";
    divItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <strong class="small">${nombre}</strong>
        <button class="btn btn-sm text-danger p-0 btn-eliminar" data-id="${id}" title="Eliminar">✕</button>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group btn-group-sm" role="group">
          <button type="button" class="btn btn-outline-secondary btn-restar" data-id="${id}">-</button>
          <span class="btn btn-dark disabled text-light">${cantidad}</span>
          <button type="button" class="btn btn-outline-secondary btn-sumar" data-id="${id}">+</button>
        </div>
        <span class="fw-bold text-danger">$${subtotal.toLocaleString("es-AR")}</span>
      </div>
    `;

    contenedorCarrito.appendChild(divItem);
  });

  asignarEventosControlesCarrito();
}

function asignarEventosControlesCarrito() {
  document.querySelectorAll(".btn-sumar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      modificarCantidad(Number(e.currentTarget.dataset.id), 1);
      actualizarInterfazCarrito();
    });
  });

  document.querySelectorAll(".btn-restar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      modificarCantidad(Number(e.currentTarget.dataset.id), -1);
      actualizarInterfazCarrito();
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      eliminarDelCarrito(Number(e.currentTarget.dataset.id));
      actualizarInterfazCarrito();
      mostrarNotificacionToast("Producto eliminado del carrito", "#dc3545");
    });
  });
}

function filtrarCatalogo() {
  const textoBuscado = inputBusqueda.value.trim().toLowerCase();
  const categoriaSeleccionada = selectCategoria.value;

  const productosFiltrados = catalogoProductos.filter((producto) => {
    const coincideTexto = producto.nombre.toLowerCase().includes(textoBuscado);
    const coincideCategoria =
      categoriaSeleccionada === "todos" || producto.categoria === categoriaSeleccionada;

    return coincideTexto && coincideCategoria;
  });

  renderizarProductos(productosFiltrados);
}

inputBusqueda.addEventListener("input", filtrarCatalogo);
selectCategoria.addEventListener("change", filtrarCatalogo);

btnVaciarCarrito.addEventListener("click", () => {
  Swal.fire({
    title: "¿Vaciar el carrito?",
    text: "Se eliminarán todos los productos seleccionados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
    background: "#1c1c1c",
    color: "#ffffff",
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      vaciarCarritoStorage();
      actualizarInterfazCarrito();
      mostrarNotificacionToast("Carrito vaciado", "#6c757d");
    }
  });
});

formCompra.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombreCliente = document.getElementById("cliente-nombre").value.trim();
  const emailCliente = document.getElementById("cliente-email").value.trim();
  const tipoEntrega = document.getElementById("cliente-entrega").value;
  const totalAbonado = calcularTotalPrecio().toLocaleString("es-AR");
  const numeroOrden = Math.floor(100000 + Math.random() * 900000);

  Swal.fire({
    icon: "success",
    title: "¡Compra confirmada!",
    html: `
      <p>Gracias <strong>${nombreCliente}</strong> por elegir <strong>Ilusión Rock</strong>.</p>
      <p>Orden N.º <strong>#${numeroOrden}</strong></p>
      <p>Modalidad: <strong>${tipoEntrega}</strong></p>
      <p>Total: <strong>$${totalAbonado}</strong></p>
      <small class="text-secondary">Enviamos el detalle a ${emailCliente}</small>
    `,
    confirmButtonColor: "#dc3545",
    background: "#1c1c1c",
    color: "#ffffff",
  });

  vaciarCarritoStorage();
  actualizarInterfazCarrito();
  formCompra.reset();
});

async function iniciarAplicacion() {
  catalogoProductos = await obtenerProductos();
  renderizarProductos(catalogoProductos);
  actualizarInterfazCarrito();
}

iniciarAplicacion();