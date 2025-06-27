document.addEventListener("DOMContentLoaded", function () {
  // Obtener el usuario autenticado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario_autenticado"));
  const usuarioId = usuario?.id;

  if (!usuarioId) {
    alert("Usuario no autenticado. Redirigiendo al inicio de sesión.");
    window.location.href = "Iniciosesion.html";
    return;
  }

  // Definir clave del localStorage
  const claveLocalStorage = `ahorros_usuario_${usuarioId}`;
  let listaAhorros = JSON.parse(localStorage.getItem(claveLocalStorage)) || [];

  // Mostrar ahorros guardados
  listaAhorros.forEach(crearTarjetaAhorro);

  // Asignar eventos de tarjetas cargadas
  document.querySelectorAll(".tarjeta-ahorro:not(.tarjeta-agregar)").forEach(asignarEventosTarjeta);

  // Botones de cierre de modales
  ["cerrar-modal", "cerrar-modal-editar", "cerrar-modal-eliminar", "cerrar-modal-cuotas"].forEach(id =>
    document.getElementById(id).onclick = () => {
      if (id === "cerrar-modal") ocultarModalDetalle();
      else if (id === "cerrar-modal-editar") ocultarModalEditar();
      else if (id === "cerrar-modal-eliminar") cerrarModalEliminar();
      else document.getElementById("modal-cuotas-ahorro").classList.add("modal-ahorro-oculto");
    }
  );

  // Cerrar modales al hacer clic fuera
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

  // Confirmar eliminación
  document.getElementById("btn-confirmar-eliminar").onclick = function () {
    if (window.tarjetaAEliminar) {
      const conceptoEliminar = window.tarjetaAEliminar.querySelector(".concepto").textContent;
      listaAhorros = listaAhorros.filter(a => a.concepto !== conceptoEliminar);
      localStorage.setItem(claveLocalStorage, JSON.stringify(listaAhorros));
      window.tarjetaAEliminar.remove();
    }
    cerrarModalEliminar();
  };

  // Cancelar eliminación
  document.getElementById("btn-cancelar-eliminar").onclick = cerrarModalEliminar;

  // Botón para agregar ahorro
  document.getElementById("tarjeta-agregar-ahorro").onclick = function () {
    limpiarFormulario();
    document.getElementById("form-editar-ahorro")._tarjeta = null;
    document.getElementById("modal-titulo-editar").textContent = "Agregar Ahorro";
    mostrarModalEditar();
  };

  // Cálculo automático de cuota y número de cuotas
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

    const cuota = Math.round(meta / numCuotas);

    campoNumCuotas.value = numCuotas;
    campoCuota.value = cuota;
  }

  [campoMeta, campoInicio, campoFin, campoFrecuencia].forEach(campo =>
    campo.addEventListener("change", calcularcuotaynumcuota)
  );

  // Botón de fecha de hoy
  const btnHoy = document.getElementById("btn-fecha-actual");
  if (btnHoy) {
    btnHoy.onclick = function () {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      document.getElementById("editar-inicio").value = `${yyyy}-${mm}-${dd}`;
    };
  }

  // Enviar formulario (guardar ahorro)
  document.getElementById("form-editar-ahorro").addEventListener("submit", function (e) {
    e.preventDefault();
    const tarjeta = e.target._tarjeta;
    const [concepto, meta, inicio, fin, frecuencia, cuota, numcuota, descripcion] =
      ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota", "numcuota", "descripcion"].map(id =>
        document.getElementById("editar-" + id).value
      );

    const ahorroObj = {
      concepto,
      meta: parseInt(meta),
      inicio,
      fin,
      frecuencia,
      cuota: parseInt(cuota),
      numcuota: parseInt(numcuota),
      descripcion
    };

    if (!tarjeta) {
      listaAhorros.push(ahorroObj);
      crearTarjetaAhorro(ahorroObj);
    } else {
      const conceptoAntiguo = tarjeta.querySelector(".concepto").textContent;
      const index = listaAhorros.findIndex(a => a.concepto === conceptoAntiguo);
      if (index !== -1) listaAhorros[index] = ahorroObj;

      tarjeta.querySelector(".concepto").textContent = concepto || "Sin concepto";
      tarjeta.querySelector(".monto").textContent = `$${parseInt(meta).toLocaleString()}`;
      const detalle = tarjeta.querySelector(".detalle-tarjeta");
      detalle.innerHTML = obtenerDetalleHTML(ahorroObj);
    }

    localStorage.setItem(claveLocalStorage, JSON.stringify(listaAhorros));
    ocultarModalEditar();
  });

  // Función: Crear tarjeta visual
  function crearTarjetaAhorro(ahorro) {
    const nueva = document.createElement("div");
    nueva.className = "tarjeta-ahorro";
    nueva.innerHTML = `
      <div class="cabecera-tarjeta">
        <div>
          <div class="concepto">${ahorro.concepto || "Sin concepto"}</div>
          <div class="monto">$${parseInt(ahorro.meta).toLocaleString()}</div>
        </div>
        <div class="acciones">
          <button class="btn-editar" title="Editar"><img src="../assets/icons/update.svg" alt="Editar" width="20" /></button>
          <button class="btn-cuotas" title="Cuotas"><img src="../assets/icons/cuotas.svg" alt="Cuotas" width="20" /></button>
          <button class="btn-eliminar" title="Eliminar"><img src="../assets/icons/delete.svg" alt="Eliminar" width="20" /></button>
        </div>
      </div>
      <div class="detalle-tarjeta">${obtenerDetalleHTML(ahorro)}</div>
    `;
    document.querySelector(".tarjetas-ahorros").insertBefore(nueva, document.querySelector(".tarjeta-agregar").nextSibling);
    asignarEventosTarjeta(nueva);
  }

  function obtenerDetalleHTML(ahorro) {
    return `
      <div><strong>Concepto:</strong> ${ahorro.concepto}</div>
      <div><strong>Meta:</strong> $${parseInt(ahorro.meta).toLocaleString()}</div>
      <div><strong>Fecha inicio:</strong> ${ahorro.inicio}</div>
      <div><strong>Fecha fin:</strong> ${ahorro.fin}</div>
      <div><strong>Frecuencia:</strong> ${ahorro.frecuencia}</div>
      <div><strong>Cuota:</strong> $${parseInt(ahorro.cuota).toLocaleString()}</div>
      <div><strong>Número de cuotas:</strong> ${parseInt(ahorro.numcuota)}</div>
      <div><strong>Descripción:</strong> ${ahorro.descripcion || "-"}</div>
    `;
  }

  // Funciones para mostrar/ocultar modales
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
    ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota", "numcuota", "descripcion"].forEach(id =>
      document.getElementById("editar-" + id).value = ""
    );
  }

  function asignarEventosTarjeta(tarjeta) {
    tarjeta.querySelector(".cabecera-tarjeta").onclick = function (e) {
      if (e.target.closest(".btn-editar, .btn-eliminar, .btn-cuotas")) return;
      const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
      ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota", "numcuota", "descripcion"].forEach((id, i) =>
        document.getElementById("modal-" + id).textContent = detalle[i].textContent.split(":")[1].trim()
      );
      mostrarModalDetalle();
    };

    tarjeta.querySelector(".btn-editar").onclick = function (e) {
      e.stopPropagation();
      const detalle = tarjeta.querySelector(".detalle-tarjeta").children;
      ["concepto", "meta", "inicio", "fin", "frecuencia", "cuota", "numcuota", "descripcion"].forEach((id, i) =>
        document.getElementById("editar-" + id).value = detalle[i].textContent.split(":")[1].trim()
      );
      document.getElementById("form-editar-ahorro")._tarjeta = tarjeta;
      document.getElementById("modal-titulo-editar").textContent = "Editar Ahorro";
      mostrarModalEditar();
    };

    tarjeta.querySelector(".btn-eliminar").onclick = function (e) {
      e.stopPropagation();
      window.tarjetaAEliminar = tarjeta;
      document.getElementById("nombre-ahorro-eliminar").textContent = tarjeta.querySelector(".concepto").textContent;
      document.getElementById("modal-eliminar-ahorro").classList.remove("modal-ahorro-oculto");
      document.getElementById("modal-eliminar-ahorro").style.display = "flex";
    };

    tarjeta.querySelector(".btn-cuotas").onclick = function (e) {
      e.stopPropagation();
      generarCuotas(tarjeta);
    };
  }

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
      }

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

  window.editarMonto = function (btn) {
    const td = btn.closest("tr").children[1];
    const actual = td.textContent.replace(/\D/g, "");
    const nuevo = prompt("Nuevo monto:", actual);
    if (nuevo && !isNaN(nuevo)) {
      td.textContent = `$${parseInt(nuevo).toLocaleString()}`;
    }
  };

  window.toggleEstado = function (estado) {
    if (estado.textContent === "Pendiente") {
      estado.textContent = "Registrada";
      estado.classList.remove("cuota-pendiente");
      estado.classList.add("cuota-registrada");
    } else {
      estado.textContent = "Pendiente";
      estado.classList.add("cuota-pendiente");
      estado.classList.remove("cuota-registrada");
    }
  };
});
