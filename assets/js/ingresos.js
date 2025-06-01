document.addEventListener("DOMContentLoaded", function () {
  // Asignar eventos a tarjetas existentes
  document.querySelectorAll(".tarjeta-ingreso:not(.tarjeta-agregar)").forEach(asignarEventosTarjeta);

  // Cerrar modales
  ["cerrar-modal", "cerrar-modal-editar", "cerrar-modal-eliminar"].forEach(id =>
    document.getElementById(id).onclick = () => {
      if (id === "cerrar-modal") ocultarModalDetalle();
      else if (id === "cerrar-modal-editar") ocultarModalEditar();
      else cerrarModalEliminar();
    }
  );

  // Cerrar modal al hacer click fuera del contenido
  ["modal-ingreso", "modal-editar-ingreso", "modal-eliminar-ingreso"].forEach(id => {
    document.getElementById(id).onclick = e => {
      if (e.target === e.currentTarget) {
        if (id === "modal-ingreso") ocultarModalDetalle();
        else if (id === "modal-editar-ingreso") ocultarModalEditar();
        else if (id === "modal-eliminar-ingreso") cerrarModalEliminar();
      }
    };
  });

  // Botones eliminar
  document.getElementById("btn-confirmar-eliminar").onclick = function () {
    if (window.tarjetaAEliminar) window.tarjetaAEliminar.remove();
    cerrarModalEliminar();
  };
  document.getElementById("btn-cancelar-eliminar").onclick = cerrarModalEliminar;

  // Agregar ingreso
  document.getElementById("tarjeta-agregar-ingreso").onclick = function () {
    limpiarFormulario();
    document.getElementById("form-editar-ingreso")._tarjeta = null;
    document.getElementById("modal-titulo-editar").textContent = "Agregar Ingreso";
    mostrarModalEditar();
  };
});

// =======================
// COMPONENTE: VER DETALLE DE INGRESO
// =======================
function mostrarModalDetalle() {
  const modal = document.getElementById("modal-ingreso");
  modal.classList.remove("modal-ingreso-oculto");
  modal.style.display = "flex";
}
function ocultarModalDetalle() {
  const modal = document.getElementById("modal-ingreso");
  modal.classList.add("modal-ingreso-oculto");
  modal.style.display = "";
}
function asignarEventosTarjeta(tarjeta) {
  // Detalle
  tarjeta.querySelector(".cabecera-tarjeta").onclick = function (e) {
    if (e.target.closest(".btn-editar, .btn-eliminar")) return;
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
    ["concepto", "monto", "descripcion", "fecha", "fijo"].forEach((id, i) =>
      document.getElementById("modal-" + id).textContent =
        i < 2
          ? tarjeta.querySelector("." + id).textContent
          : detalle[i].textContent.split(":")[1].trim()
    );
    mostrarModalDetalle();
  };
  // Editar
  tarjeta.querySelector(".btn-editar").onclick = function (e) {
    e.stopPropagation();
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
    ["concepto", "monto", "descripcion", "fecha", "fijo"].forEach((id, i) =>
      document.getElementById("editar-" + id).value =
        i < 2
          ? tarjeta.querySelector("." + id).textContent.replace(/[^0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
          : detalle[i].textContent.split(":")[1].trim()
    );
    document.getElementById("form-editar-ingreso")._tarjeta = tarjeta;
    document.getElementById("modal-titulo-editar").textContent = "Editar Ingreso";
    mostrarModalEditar();
  };
  // Eliminar
  tarjeta.querySelector(".btn-eliminar").onclick = function (e) {
    e.stopPropagation();
    window.tarjetaAEliminar = tarjeta;
    document.getElementById("nombre-ingreso-eliminar").textContent = `"${tarjeta.querySelector(".concepto").textContent}"`;
    document.getElementById("modal-eliminar-ingreso").classList.remove("modal-ingreso-oculto");
    document.getElementById("modal-eliminar-ingreso").style.display = "flex";
  };
}

// =======================
// COMPONENTE: EDITAR/AGREGAR INGRESO
// =======================
function mostrarModalEditar() {
  const modal = document.getElementById("modal-editar-ingreso");
  modal.classList.remove("modal-ingreso-oculto");
  modal.style.display = "flex";
}
function ocultarModalEditar() {
  const modal = document.getElementById("modal-editar-ingreso");
  modal.classList.add("modal-ingreso-oculto");
  modal.style.display = "";
}
function limpiarFormulario() {
  ["concepto", "monto", "descripcion", "fecha", "fijo"].forEach(id =>
    document.getElementById("editar-" + id).value = id === "fijo" ? "Sí" : ""
  );
}

// Guardar cambios o agregar nuevo ingreso
document.getElementById("form-editar-ingreso").addEventListener("submit", function (e) {
  e.preventDefault();
  const tarjeta = e.target._tarjeta;
  const [concepto, monto, descripcion, fecha, fijo] = ["concepto", "monto", "descripcion", "fecha", "fijo"].map(id => document.getElementById("editar-" + id).value);

  if (!tarjeta) {
    // Crear nueva tarjeta
    const nueva = document.createElement("div");
    nueva.className = "tarjeta-ingreso";
    nueva.innerHTML = `
      <div class="cabecera-tarjeta">
        <div>
          <div class="concepto">${concepto}</div>
          <div class="monto">$${parseInt(monto).toLocaleString()}</div>
        </div>
        <div class="acciones">
          <button class="btn-editar" title="Editar">
            <img src="../assets/icons/update.svg" alt="Editar" width="20" height="20" />
          </button>
          <button class="btn-eliminar" title="Eliminar">
            <img src="../assets/icons/delete.svg" alt="Eliminar" width="20" height="20" />
          </button>
        </div>
      </div>
      <div class="detalle-tarjeta">
        <div><strong>Concepto:</strong> ${concepto}</div>
        <div><strong>Monto:</strong> $${parseInt(monto).toLocaleString()}</div>
        <div><strong>Descripción:</strong> ${descripcion || "-"}</div>
        <div><strong>Fecha:</strong> ${fecha}</div>
        <div><strong>Fijo:</strong> ${fijo}</div>
      </div>
    `;
    document.querySelector(".tarjetas-ingresos").insertBefore(nueva, document.querySelector(".tarjetas-ingresos").children[1]);
    asignarEventosTarjeta(nueva);
  } else {
    // Editar tarjeta existente
    tarjeta.querySelector(".concepto").textContent = concepto;
    tarjeta.querySelector(".monto").textContent = `$${parseInt(monto).toLocaleString()}`;
    const detalle = tarjeta.querySelector(".detalle-tarjeta");
    detalle.innerHTML = `
      <div><strong>Concepto:</strong> ${concepto}</div>
      <div><strong>Monto:</strong> $${parseInt(monto).toLocaleString()}</div>
      <div><strong>Descripción:</strong> ${descripcion || "-"}</div>
      <div><strong>Fecha:</strong> ${fecha}</div>
      <div><strong>Fijo:</strong> ${fijo}</div>
    `;
  }
  document.getElementById("modal-titulo-editar").textContent = "Editar Ingreso";
  ocultarModalEditar();
});

// =======================
// COMPONENTE: ELIMINAR INGRESO
// =======================
function cerrarModalEliminar() {
  document.getElementById("modal-eliminar-ingreso").classList.add("modal-ingreso-oculto");
  document.getElementById("modal-eliminar-ingreso").style.display = "";
  window.tarjetaAEliminar = null;
}
