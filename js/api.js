const RUTA_PRODUCTOS = "./data/productos.json";

async function obtenerProductos() {
  const estadoCarga = document.getElementById("estado-carga");

  try {
    const respuesta = await fetch(RUTA_PRODUCTOS);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const productos = await respuesta.json();
    return productos;
  } catch (error) {
    estadoCarga.innerHTML = `
      <div class="alert alert-danger d-inline-block" role="alert">
        No se pudo cargar el catálogo de Ilusión Rock. Verificá la conexión o el servidor local.
      </div>
    `;
    return [];
  } finally {
    if (estadoCarga && !estadoCarga.querySelector(".alert-danger")) {
      estadoCarga.classList.add("d-none");
    }
  }
}