document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tarjeta-ahorro:not(.tarjeta-agregar)").forEach(asignarEventosTarjeta);

  ["cerrar-modal", "cerrar-modal-editar", "cerrar-modal-eliminar"].forEach(id =>
    document.getElementById(id).onclick = () => {
      if (id === "cerrar-modal") ocultarModalDetalle();
      else if (id === "cerrar-modal-editar") ocultarModalEditar();
      else cerrarModalEliminar();
    }
  );

  ["modal-ahorro", "modal-editar-ahorro", "modal-eliminar-ahorro"].forEach(id => {
    document.getElementById(id).onclick = e => {
      if (e.target === e.currentTarget) {
        if (id === "modal-ahorro") ocultarModalDetalle();
        else if (id === "modal-editar-ahorro") ocultarModalEditar();
        else if (id === "modal-eliminar-ahorro") cerrarModalEliminar();
      }
    };
  });

  document.getElementById("btn-confirmar-eliminar").onclick = function () {
    if (window.tarjetaAEliminar) window.tarjetaAEliminar.remove();
    cerrarModalEliminar();
  };
  document.getElementById("btn-cancelar-eliminar").onclick = cerrarModalEliminar;

  document.getElementById("tarjeta-agregar-ahorro").onclick = function () {
    limpiarFormulario();
    document.getElementById("form-editar-ahorro")._tarjeta = null;
    document.getElementById("modal-titulo-editar").textContent = "Agregar Ahorro";
    mostrarModalEditar();
  };
});

function mostrarModalDetalle() {
  const modal = document.getElementById("modal-ahorro");
  modal.classList.remove("modal-ahorro-oculto");
  modal.style.display = "flex";
}

function ocultarModalDetalle() {
  const modal = document.getElementById("modal-ahorro");
  modal.classList.add("modal-ahorro-oculto");
  modal.style.display = "";
}

function asignarEventosTarjeta(tarjeta) {
  tarjeta.querySelector(".cabecera-tarjeta").onclick = function (e) {
    if (e.target.closest(".btn-editar, .btn-eliminar, .btn-cuotas")) return;
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
    ["meta", "inicio", "fin", "frecuencia", "numcuota", "cuota", "descripcion"].forEach((id, i) =>
      document.getElementById("modal-" + id).textContent = detalle[i].textContent.split(":" )[1].trim()
    );
    mostrarModalDetalle();
  };

  tarjeta.querySelector(".btn-editar").onclick = function (e) {
    e.stopPropagation();
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
    ["meta", "inicio", "fin", "frecuencia", "numcuota", "cuota", "descripcion"].forEach((id, i) =>
      document.getElementById("editar-" + id).value = detalle[i].textContent.split(":" )[1].trim()
    );
    document.getElementById("form-editar-ahorro")._tarjeta = tarjeta;
    document.getElementById("modal-titulo-editar").textContent = "Editar Ahorro";
    mostrarModalEditar();
  };

  tarjeta.querySelector(".btn-eliminar").onclick = function (e) {
    e.stopPropagation();
    window.tarjetaAEliminar = tarjeta;
    document.getElementById("nombre-ahorro-eliminar").textContent = `"${tarjeta.querySelector(".concepto").textContent}"`;
    document.getElementById("modal-eliminar-ahorro").classList.remove("modal-ahorro-oculto");
    document.getElementById("modal-eliminar-ahorro").style.display = "flex";
  };
}

function mostrarModalEditar() {
  const modal = document.getElementById("modal-editar-ahorro");
  modal.classList.remove("modal-ahorro-oculto");
  modal.style.display = "flex";
}

function ocultarModalEditar() {
  const modal = document.getElementById("modal-editar-ahorro");
  modal.classList.add("modal-ahorro-oculto");
  modal.style.display = "";
}

function limpiarFormulario() {
  ["meta", "inicio", "fin", "frecuencia", "numcuota", "cuota", "descripcion"].forEach(id =>
    document.getElementById("editar-" + id).value = ""
  );
}

document.getElementById("form-editar-ahorro").addEventListener("submit", function (e) {
  e.preventDefault();
  const tarjeta = e.target._tarjeta;
  const [meta, inicio, fin, frecuencia, numcuota, cuota, descripcion] =
    ["meta", "inicio", "fin", "frecuencia", "numcuota", "cuota", "descripcion"].map(id =>
      document.getElementById("editar-" + id).value
    );

  if (!tarjeta) {
    const nueva = document.createElement("div");
    nueva.className = "tarjeta-ahorro";
    nueva.innerHTML = `
      <div class="cabecera-tarjeta">
        <div>
          <div class="concepto">${descripcion || "Ahorro sin nombre"}</div>
          <div class="monto">$${parseInt(meta).toLocaleString()}</div>
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
        <div><strong>Meta:</strong> $${parseInt(meta).toLocaleString()}</div>
        <div><strong>Fecha inicio:</strong> ${inicio}</div>
        <div><strong>Fecha fin:</strong> ${fin}</div>
        <div><strong>Frecuencia:</strong> ${frecuencia}</div>
        <div><strong>Número de cuotas:</strong> ${parseInt(numcuota)}</div>
        <div><strong>Cuota:</strong> $${parseInt(cuota).toLocaleString()}</div>
        <div><strong>Descripción:</strong> ${descripcion || "-"}</div>
      </div>
    `;
    agregarBotonCuotas(nueva);
  asignarEventosTarjeta(nueva);
  document.querySelector(".tarjetas-ahorros").insertBefore(nueva, document.querySelector(".tarjetas-ahorros").children[1]);
    document.querySelector(".tarjetas-ahorros").insertBefore(nueva, document.querySelector(".tarjetas-ahorros").children[1]);
    asignarEventosTarjeta(nueva);
  } else {
    tarjeta.querySelector(".concepto").textContent = descripcion || "Ahorro sin nombre";
    tarjeta.querySelector(".monto").textContent = `$${parseInt(meta).toLocaleString()}`;
    const detalle = tarjeta.querySelector(".detalle-tarjeta");
    detalle.innerHTML = `
      <div><strong>Meta:</strong> $${parseInt(meta).toLocaleString()}</div>
      <div><strong>Fecha inicio:</strong> ${inicio}</div>
      <div><strong>Fecha fin:</strong> ${fin}</div>
      <div><strong>Frecuencia:</strong> ${frecuencia}</div>
      <div><strong>Número de cuotas:</strong> ${parseInt(numcuota)}</div>
      <div><strong>Cuota:</strong> $${parseInt(cuota).toLocaleString()}</div>
      <div><strong>Descripción:</strong> ${descripcion || "-"}</div>
    `;
  }
  document.getElementById("modal-titulo-editar").textContent = "Editar Ahorro";
  ocultarModalEditar();
});

function cerrarModalEliminar() {
  document.getElementById("modal-eliminar-ahorro").classList.add("modal-ahorro-oculto");
  document.getElementById("modal-eliminar-ahorro").style.display = "";
  window.tarjetaAEliminar = null;
}
function agregarBotonCuotas(tarjeta) {
  const acciones = tarjeta.querySelector(".acciones");
  const btnCuotas = document.createElement("button");
  btnCuotas.className = "btn-cuotas";
  btnCuotas.title = "Ver Cuotas";
  btnCuotas.innerHTML = '<img src="../assets/icons/plus.svg" alt="Cuotas" width="20" height="20" />';
  acciones.appendChild(btnCuotas);
  btnCuotas.onclick = function (e) {
    e.stopPropagation();
    generarCuotas(tarjeta);
  };
}

function generarCuotas(tarjeta) {
  const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
  const numCuotas = parseInt(detalle[4].textContent.split(":")[1].replace(/\D/g, ""));
  const montoCuota = parseInt(detalle[5].textContent.split(":")[1].replace(/\D/g, ""));
  const frecuencia = detalle[3].textContent.split(":")[1].trim().toLowerCase();
  const inicio = new Date(detalle[1].textContent.split(":")[1].trim());

  const tbody = document.getElementById("cuerpo-cuotas");
  tbody.innerHTML = "";

  for (let i = 0; i < numCuotas; i++) {
    const fecha = new Date(inicio);
    if (frecuencia === "mensual") fecha.setMonth(inicio.getMonth() + i);
    else if (frecuencia === "quincenal") fecha.setDate(inicio.getDate() + i * 15);
    else if (frecuencia === "semanal") fecha.setDate(inicio.getDate() + i * 7);
    const fechaStr = fecha.toISOString().split("T")[0];

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>$${montoCuota.toLocaleString()}</td>
      <td><input type="date" value="${fechaStr}"></td>
      <td><span class="estado cuota-pendiente" onclick="toggleEstado(this)">Pendiente</span></td>
      <td><button onclick="editarMonto(this)">Editar</button></td>
    `;
    tbody.appendChild(fila);
  }

  document.getElementById("modal-cuotas-ahorro").classList.remove("modal-ahorro-oculto");
  document.getElementById("modal-cuotas-ahorro").style.display = "flex";
}

function editarMonto(btn) {
  const td = btn.closest("tr").children[1];
  const actual = td.textContent.replace(/\D/g, "");
  const nuevo = prompt("Nuevo monto:", actual);
  if (nuevo && !isNaN(nuevo)) {
    td.textContent = `$${parseInt(nuevo).toLocaleString()}`;
  }
}
function toggleEstado(el) {
  if (el.textContent === "Pendiente") {
    el.textContent = "Registrada";
    el.classList.remove("cuota-pendiente");
    el.classList.add("cuota-registrada");
  } else {
    el.textContent = "Pendiente";
    el.classList.add("cuota-pendiente");
    el.classList.remove("cuota-registrada");
  }
}

document.getElementById("cerrar-modal-cuotas").onclick = function () {
  document.getElementById("modal-cuotas-ahorro").classList.add("modal-ahorro-oculto");
  document.getElementById("modal-cuotas-ahorro").style.display = "";
};
// Mostrar cuotas al dar clic en "+"
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-cuotas")) {
    const tarjeta = e.target.closest(".tarjeta-ahorro");
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;

    const numCuotas = Number(detalle[4].textContent.split(":")[1].trim());
    const montoCuota = Number(detalle[5].textContent.split(":")[1].replace(/[^0-9]/g, ""));

    const tbody = document.getElementById("cuerpo-cuotas");
    tbody.innerHTML = "";

    const hoy = new Date().toISOString().split("T")[0];

    for (let i = 1; i <= numCuotas; i++) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${i}</td>
        <td>$${parseInt(montoCuota).toLocaleString()}</td>
        <td><input type="date" value="${hoy}" /></td>
        <td><span class="estado cuota-pendiente" onclick="toggleEstado(this)">Pendiente</span></td>
        <td><button onclick="editarMonto(this)">Editar</button></td>
      `;
      tbody.appendChild(fila);
    }

    document.getElementById("modal-cuotas-ahorro").classList.remove("modal-ahorro-oculto");
    document.getElementById("modal-cuotas-ahorro").style.display = "flex";
  }
});

// Cerrar modal cuotas
document.getElementById("cerrar-modal-cuotas").onclick = function () {
  document.getElementById("modal-cuotas-ahorro").classList.add("modal-ahorro-oculto");
  document.getElementById("modal-cuotas-ahorro").style.display = "";
};

// Función para editar el monto
function editarMonto(boton) {
  const tdMonto = boton.closest("tr").children[1];
  const montoActual = tdMonto.textContent.replace(/\D/g, "");
  const nuevoMonto = prompt("Nuevo monto de cuota:", montoActual);
  if (nuevoMonto && !isNaN(nuevoMonto)) {
    tdMonto.textContent = `$${parseInt(nuevoMonto).toLocaleString()}`;
  }
}

// Función para cambiar el estado Pendiente <-> Registrada
function toggleEstado(elemento) {
  if (elemento.textContent === "Pendiente") {
    elemento.textContent = "Registrada";
    elemento.classList.remove("cuota-pendiente");
    elemento.classList.add("cuota-registrada");
  } else {
    elemento.textContent = "Pendiente";
    elemento.classList.remove("cuota-registrada");
    elemento.classList.add("cuota-pendiente");
  }
}
