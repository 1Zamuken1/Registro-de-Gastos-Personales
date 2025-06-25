document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tarjeta-ahorro:not(.tarjeta-agregar)").forEach(asignarEventosTarjeta);

  ["cerrar-modal", "cerrar-modal-editar", "cerrar-modal-eliminar", "cerrar-modal-cuotas"].forEach(id =>
    document.getElementById(id).onclick = () => {
      if (id === "cerrar-modal") ocultarModalDetalle();
      else if (id === "cerrar-modal-editar") ocultarModalEditar();
      else if (id === "cerrar-modal-eliminar") cerrarModalEliminar();
      else document.getElementById("modal-cuotas-ahorro").classList.add("modal-ahorro-oculto");
      
    }
  );

  ["modal-ahorro", "modal-editar-ahorro", "modal-eliminar-ahorro", "modal-cuotas-ahorro"].forEach(id => {
    document.getElementById(id).onclick = e => {
      if (e.target === e.currentTarget) {
        if (id === "modal-ahorro") ocultarModalDetalle();
        else if (id === "modal-editar-ahorro") ocultarModalEditar();
        else if (id === "modal-eliminar-ahorro") cerrarModalEliminar();
        else document.getElementById("modal-cuotas-ahorro").classList.add("modal-ahorro-oculto");
      }
    };
  });

  document.getElementById("btn-confirmar-eliminar").onclick = function () {
    if (window.tarjetaAEliminar) window.tarjetaAEliminar.remove();
    cerrarModalEliminar();
  };

  document.getElementById("btn-cancelar-eliminar").onclick = cerrarModalEliminar;

  document.getElementById("tarjeta-agregar-ahorro").onclick = function () {


    // CÁLCULO DE CUOTA Y NÚMERO DE CUOTAS
const campoMeta = document.getElementById("editar-meta");
const campoInicio = document.getElementById("editar-inicio");
const campoFin = document.getElementById("editar-fin");
const campoFrecuencia = document.getElementById("editar-frecuencia");
const campoNumCuotas = document.getElementById("editar-numcuota");
const campoCuota = document.getElementById("editar-cuota");

function calcularcuotaynumcuota() {
  const meta = parseFloat(campoMeta.value);
  const inicio = new Date(campoInicio.value);
  const fin = new Date(campoFin.value);
  const frecuencia = campoFrecuencia.value.toLowerCase();

  if (!meta || isNaN(inicio) || isNaN(fin) || fin <= inicio || !frecuencia) return;

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const dias = Math.floor((fin - inicio) / milisegundosPorDia);

  let numCuotas = 0;
  if (frecuencia === "diaria") numCuotas = dias;
  else if (frecuencia === "semanal") numCuotas = Math.floor(dias / 7);
  else if (frecuencia === "quincenal") numCuotas = Math.floor(dias / 15);
  else if (frecuencia === "mensual") {
    numCuotas = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
  } else if (frecuencia === "trimestral") {
    numCuotas = Math.floor(((fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth())) / 3);
  } else if (frecuencia === "semestral") {
    numCuotas = Math.floor(((fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth())) / 6);
  } else if (frecuencia === "anual") {
    numCuotas = fin.getFullYear() - inicio.getFullYear();
  }

  if (numCuotas < 1) numCuotas = 1;

  const cuota = meta / numCuotas;

  campoNumCuotas.value = numCuotas;
  campoCuota.value = Math.round(cuota);
}

[campoMeta, campoInicio, campoFin, campoFrecuencia].forEach(campo =>
  campo.addEventListener("change", calcularcuotaynumcuota)
);

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

function cerrarModalEliminar() {
  document.getElementById("modal-eliminar-ahorro").classList.add("modal-ahorro-oculto");
  document.getElementById("modal-eliminar-ahorro").style.display = "";
  window.tarjetaAEliminar = null;
}

function limpiarFormulario() {
  ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota","numcuota", "descripcion"].forEach(id =>
    document.getElementById("editar-" + id).value = ""
  );
}

function asignarEventosTarjeta(tarjeta) {
  tarjeta.querySelector(".cabecera-tarjeta").onclick = function (e) {
    if (e.target.closest(".btn-editar, .btn-eliminar, .btn-cuotas")) return;
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
    ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota","numcuota", "descripcion"].forEach((id, i) =>
      document.getElementById("modal-" + id).textContent = detalle[i].textContent.split(":")[1].trim()
    );
    mostrarModalDetalle();
  };

  tarjeta.querySelector(".btn-editar").onclick = function (e) {
    e.stopPropagation();
    const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
    ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota","numcuota", "descripcion"].forEach((id, i) =>
      document.getElementById("editar-" + id).value = detalle[i].textContent.split(":")[1].trim()
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

  tarjeta.querySelector(".btn-cuotas").onclick = function (e) {
    e.stopPropagation();
    generarCuotas(tarjeta);
  };
}

document.getElementById("form-editar-ahorro").addEventListener("submit", function (e) {
  e.preventDefault();
  const tarjeta = e.target._tarjeta;
  const [concepto, meta, inicio, fin, frecuencia, cuota,numcuota, descripcion] =
    ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota","numcuota", "descripcion"].map(id =>
      document.getElementById("editar-" + id).value
    );

  if (!tarjeta) {
    const nueva = document.createElement("div");
    nueva.className = "tarjeta-ahorro";
    nueva.innerHTML = `
      <div class="cabecera-tarjeta">
        <div>
          <div class="concepto">${concepto || "Sin concepto"}</div>
          <div class="monto">$${parseInt(meta).toLocaleString()}</div>
        </div>
        <div class="acciones">
          <button class="btn-editar" title="Editar">
            <img src="../assets/icons/update.svg" alt="Editar" width="20" height="20" />
          </button>
          <button class="btn-cuotas" title="Cuotas">
            <img src="../assets/icons/cuotas.svg" alt="Cuotas" width="20" height="20" />
          </button>
          <button class="btn-eliminar" title="Eliminar">
            <img src="../assets/icons/delete.svg" alt="Eliminar" width="20" height="20" />
          </button>
        </div>
      </div>
      <div class="detalle-tarjeta">
        <div><strong>Concepto:</strong> ${concepto || "-"}</div>
        <div><strong>Meta:</strong> $${parseInt(meta).toLocaleString()}</div>
        <div><strong>Fecha inicio:</strong> ${inicio}</div>
        <div><strong>Fecha fin:</strong> ${fin}</div>
        <div><strong>Frecuencia:</strong> ${frecuencia}</div>
        <div><strong>Cuota:</strong> $${parseInt(cuota).toLocaleString()}</div>
        <div><strong>Número de cuotas:</strong> ${parseInt(numcuota)}</div>
        <div><strong>Descripción:</strong> ${descripcion || "-"}</div>
      </div>
    `;
    document.querySelector(".tarjetas-ahorros").insertBefore(nueva, document.querySelector(".tarjeta-agregar").nextSibling);
    asignarEventosTarjeta(nueva);
  } else {
    tarjeta.querySelector(".concepto").textContent = concepto || "Sin concepto";
    tarjeta.querySelector(".monto").textContent = `$${parseInt(meta).toLocaleString()}`;
    const detalle = tarjeta.querySelector(".detalle-tarjeta");
    detalle.innerHTML = `
      <div><strong>Concepto:</strong> ${concepto || "-"}</div>
      <div><strong>Meta:</strong> $${parseInt(meta).toLocaleString()}</div>
      <div><strong>Fecha inicio:</strong> ${inicio}</div>
      <div><strong>Fecha fin:</strong> ${fin}</div>
      <div><strong>Frecuencia:</strong> ${frecuencia}</div>
      <div><strong>Cuota:</strong> $${parseInt(cuota).toLocaleString()}</div>
      <div><strong>Número de cuotas:</strong> ${parseInt(numcuota)}</div>
      <div><strong>Descripción:</strong> ${descripcion || "-"}</div>
    `;
  }

  ocultarModalEditar();
});
//AQUI ME TOA MIRAR LO DEL ORDEN DE NUM CUOTA Y CUOTA 
function generarCuotas(tarjeta) {
  const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
  const frecuencia = detalle[4].textContent.split(":")[1].trim().toLowerCase();
  const montoCuota = parseInt(detalle[5].textContent.split(":")[1].replace(/\D/g, ""));
  const numCuotas = parseInt(detalle[6].textContent.split(":")[1].trim());
  const fechaInicio = new Date(detalle[2].textContent.split(":")[1].trim());

  const tbody = document.getElementById("cuerpo-cuotas");
  tbody.innerHTML = "";

  for (let i = 0; i < numCuotas; i++) {
    const fecha = new Date(fechaInicio);
    switch (frecuencia) {
      case "diaria": fecha.setDate(fecha.getDate() + i); break;
      case "semanal": fecha.setDate(fecha.getDate() + i * 7); break;
      case "quincenal": fecha.setDate(fecha.getDate() + i * 15); break;
      case "mensual": fecha.setMonth(fecha.getMonth() + i); break;
      case "trimestral": fecha.setMonth(fecha.getMonth() + i * 3); break;
      case "semestral": fecha.setMonth(fecha.getMonth() + i * 6); break;
      case "anual": fecha.setFullYear(fecha.getFullYear() + i); break;
      default: break;
    }
    
    //TABLA CUOTAS 
    const fechaStr = fecha.toISOString().split("T")[0];
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>$${montoCuota.toLocaleString()}</td>
      <td><input type="date" value="${fechaStr}" /></td>
      <td><span class="estado cuota-pendiente" onclick="toggleEstado(this)">Pendiente</span></td>
      <td><button onclick="editarMonto(this)">Editar</button></td>
    `;
    tbody.appendChild(fila);
  }

  const modal = document.getElementById("modal-cuotas-ahorro");
  modal.classList.remove("modal-ahorro-oculto");
  modal.style.display = "flex";
}

function editarMonto(btn) {
  const td = btn.closest("tr").children[1];
  const actual = td.textContent.replace(/\D/g, "");
  const nuevo = prompt("Nuevo monto:", actual);
  if (nuevo && !isNaN(nuevo)) {
    td.textContent = `$${parseInt(nuevo).toLocaleString()}`;
  }
}

function toggleEstado(estado) {
  if (estado.textContent === "Pendiente") {
    estado.textContent = "Registrada";
    estado.classList.remove("cuota-pendiente");
    estado.classList.add("cuota-registrada");
  } else {
    estado.textContent = "Pendiente";
    estado.classList.add("cuota-pendiente");
    estado.classList.remove("cuota-registrada");
  }
}