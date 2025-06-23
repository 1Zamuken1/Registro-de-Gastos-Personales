// === INTEGRACIÓN: SISTEMA DE USUARIOS E INGRESOS ===

let filtroActual = "todos"; // <-- Mueve esto aquí, fuera de cualquier función

document.addEventListener("DOMContentLoaded", function () {
  verificarAutenticacion();
  mostrarIngresosFiltrados();

  document.querySelectorAll(".tarjeta-ingreso:not(.tarjeta-agregar)").forEach(asignarEventosTarjeta);

  ["cerrar-modal", "cerrar-modal-editar", "cerrar-modal-eliminar"].forEach(id =>
    document.getElementById(id).onclick = () => {
      if (id === "cerrar-modal") ocultarModalDetalle();
      else if (id === "cerrar-modal-editar") ocultarModalEditar();
      else cerrarModalEliminar();
    }
  );

  ["modal-ingreso", "modal-editar-ingreso", "modal-eliminar-ingreso"].forEach(id => {
    document.getElementById(id).onclick = e => {
      if (e.target === e.currentTarget) {
        if (id === "modal-ingreso") ocultarModalDetalle();
        else if (id === "modal-editar-ingreso") ocultarModalEditar();
        else if (id === "modal-eliminar-ingreso") cerrarModalEliminar();
      }
    };
  });

  document.getElementById("btn-confirmar-eliminar").onclick = function () {
    if (window.tarjetaAEliminar) {
      eliminarIngresoUsuario(window.tarjetaAEliminar.dataset.ingresoId);
      window.tarjetaAEliminar.remove();
    }
    cerrarModalEliminar();
  };

  document.getElementById("btn-cancelar-eliminar").onclick = cerrarModalEliminar;

  document.getElementById("tarjeta-agregar-ingreso").onclick = function () {
    limpiarFormulario();
    document.getElementById("form-editar-ingreso")._tarjeta = null;
    document.getElementById("modal-titulo-editar").textContent = "Agregar Ingreso";
    mostrarModalEditar();
  };

  // Llenar el select de conceptos
  const selectConcepto = document.getElementById("editar-concepto");
  selectConcepto.innerHTML = CONCEPTOS_INGRESO.map(c => `<option value="${c}">${c}</option>`).join("");
});

// === AUTENTICACIÓN Y USUARIO ACTUAL ===

function verificarAutenticacion() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) {
    alert("❌ Debes iniciar sesión para acceder a esta página.");
    window.location.href = "../views/Iniciosesion.html";
    return false;
  }
  return true;
}

function obtenerUsuarioActual() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) return null;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  return usuarios.find(u => u.id === parseInt(usuarioActivoId));
}

// === GESTIÓN DE INGRESOS ===

function obtenerIngresosUsuario(usuarioId) {
  const clave = `ingresos_usuario_${usuarioId}`;
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarIngresosUsuario(usuarioId, ingresos) {
  const clave = `ingresos_usuario_${usuarioId}`;
  localStorage.setItem(clave, JSON.stringify(ingresos));
}

function obtenerSiguienteIdIngreso(usuarioId) {
  const ingresos = obtenerIngresosUsuario(usuarioId);
  if (ingresos.length === 0) return 1;
  const maxId = Math.max(...ingresos.map(i => i.id || 0));
  return maxId + 1;
}

function agregarIngresoUsuario(usuarioId, ingreso) {
  const ingresos = obtenerIngresosUsuario(usuarioId);
  const nuevoId = obtenerSiguienteIdIngreso(usuarioId);

  const nuevoIngreso = {
    id: nuevoId,
    concepto: ingreso.concepto,
    monto: parseInt(ingreso.monto),
    descripcion: ingreso.descripcion || '',
    fecha: ingreso.fecha,
    fijo: ingreso.fijo,
    fechaCreacion: new Date().toISOString(),
    // Añade estos campos:
    frecuencia: ingreso.frecuencia || null,
    fechaInicio: ingreso.fechaInicio || null
  };

  ingresos.push(nuevoIngreso);
  guardarIngresosUsuario(usuarioId, ingresos);
  return nuevoIngreso;
}

function actualizarIngresoUsuario(usuarioId, ingresoId, datosActualizados) {
  const ingresos = obtenerIngresosUsuario(usuarioId);
  const indice = ingresos.findIndex(i => i.id === parseInt(ingresoId));

  if (indice !== -1) {
    ingresos[indice] = {
      ...ingresos[indice],
      concepto: datosActualizados.concepto,
      monto: parseInt(datosActualizados.monto),
      descripcion: datosActualizados.descripcion || '',
      fecha: datosActualizados.fecha,
      fijo: datosActualizados.fijo,
      fechaModificacion: new Date().toISOString(),
      frecuencia: datosActualizados.frecuencia || null,
      fechaInicio: datosActualizados.fechaInicio || null
    };
    guardarIngresosUsuario(usuarioId, ingresos);
    return ingresos[indice];
  }
  return null;
}

function eliminarIngresoUsuario(ingresoId) {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return false;

  const ingresos = obtenerIngresosUsuario(usuario.id);
  const ingresosActualizados = ingresos.filter(i => i.id !== parseInt(ingresoId));
  guardarIngresosUsuario(usuario.id, ingresosActualizados);
  return true;
}

// === INTERFAZ Y TARJETAS ===

function cargarIngresosUsuario() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;
  const ingresos = obtenerIngresosUsuario(usuario.id);
  const contenedor = document.querySelector(".tarjetas-ingresos");

  contenedor.innerHTML = "";
  ingresos.forEach(ingreso => crearTarjetaIngreso(ingreso, contenedor));
}

function crearTarjetaIngreso(ingreso, contenedor) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-ingreso";
  tarjeta.dataset.ingresoId = ingreso.id;

  // Si el monto es muy largo, ocupa 2 columnas
  if (ingreso.monto.toLocaleString().length > 12) {
    tarjeta.classList.add("monto-grande");
  }

  let detalleHtml = `
    <div><strong>Concepto:</strong> ${ingreso.concepto}</div>
    <div><strong>Monto:</strong> $${ingreso.monto.toLocaleString()}</div>
    <div><strong>Descripción:</strong> ${ingreso.descripcion || "-"}</div>
  `;

  if (ingreso.fijo === "Sí") {
    detalleHtml += `
      <div><strong>Frecuencia:</strong> ${ingreso.frecuencia || "-"}</div>
      <div><strong>Día(s) de recurrencia:</strong> ${calcularDiasRecurrencia(ingreso.fechaInicio, ingreso.frecuencia)}</div>
      <div><strong>Próxima recurrencia:</strong> ${calcularProximaRecurrencia(ingreso.fechaInicio, ingreso.frecuencia)}</div>
      <div><strong>Fecha inicio:</strong> ${ingreso.fechaInicio || "-"}</div>
      <div><strong>Fecha creación:</strong> ${ingreso.fechaCreacion ? new Date(ingreso.fechaCreacion).toLocaleDateString() : "-"}</div>
      <div><strong>Tipo:</strong> Fijo/Programado</div>
    `;
  } else {
    detalleHtml += `
      <div><strong>Fecha recibido:</strong> ${ingreso.fecha || "-"}</div>
      <div><strong>Fecha creación:</strong> ${ingreso.fechaCreacion ? new Date(ingreso.fechaCreacion).toLocaleDateString() : "-"}</div>
      <div><strong>Tipo:</strong> Variable</div>
    `;
  }

  tarjeta.innerHTML = `
    <div class="cabecera-tarjeta">
      <div>
        <div class="concepto">${ingreso.concepto}</div>
        <div class="monto">$${ingreso.monto.toLocaleString()}</div>
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
      ${detalleHtml}
    </div>
  `;

  contenedor.appendChild(tarjeta);

  asignarEventosTarjeta(tarjeta);
}

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
  tarjeta.querySelector(".cabecera-tarjeta").onclick = function (e) {
    if (e.target.closest(".btn-editar, .btn-eliminar")) return;
    const ingresoId = tarjeta.dataset.ingresoId;
    const usuario = obtenerUsuarioActual();
    const ingresos = obtenerIngresosUsuario(usuario.id);
    const ingreso = ingresos.find(i => i.id == ingresoId);

    // Llena el modal con toda la información relevante
    document.getElementById("modal-concepto").textContent = ingreso.concepto;
    document.getElementById("modal-monto").textContent = `$${ingreso.monto.toLocaleString()}`;
    document.getElementById("modal-descripcion").textContent = ingreso.descripcion || "-";

    // Detalles adicionales para ingresos programados
    let detalleExtra = "";
    if (ingreso.fijo === "Sí") {
      detalleExtra += `<div><strong>Frecuencia:</strong> ${ingreso.frecuencia || "-"}</div>`;
      detalleExtra += `<div><strong>Próxima recurrencia:</strong> ${calcularProximaRecurrencia(ingreso.fechaInicio, ingreso.frecuencia)}</div>`;
      detalleExtra += `<div><strong>Fecha inicio:</strong> ${ingreso.fechaInicio || "-"}</div>`;
    } else {
      detalleExtra += `<div><strong>Fecha recibido:</strong> ${ingreso.fecha || "-"}</div>`;
    }

    // Puedes agregar más campos si lo deseas
    document.getElementById("modal-fecha").innerHTML = 
      (ingreso.fijo === "Sí")
        ? `${ingreso.fechaCreacion ? new Date(ingreso.fechaCreacion).toLocaleDateString() : "-"}`
        : `${ingreso.fecha || ingreso.fechaCreacion ? new Date(ingreso.fechaCreacion).toLocaleDateString() : "-"}`;

    document.getElementById("modal-fijo").textContent = ingreso.fijo;

    // Inserta los detalles extra en el modal, si tienes un contenedor específico para ellos
    // Si no, puedes crear uno:
    let detallesContenedor = document.getElementById("modal-detalles-extra");
    if (!detallesContenedor) {
      detallesContenedor = document.createElement("div");
      detallesContenedor.id = "modal-detalles-extra";
      document.getElementById("modal-fijo").parentElement.after(detallesContenedor);
    }
    detallesContenedor.innerHTML = detalleExtra;

    mostrarModalDetalle();
  };

  tarjeta.querySelector(".btn-editar").onclick = function (e) {
    e.stopPropagation();
    const ingresoId = tarjeta.dataset.ingresoId;
    const usuario = obtenerUsuarioActual();
    const ingresos = obtenerIngresosUsuario(usuario.id);
    const ingreso = ingresos.find(i => i.id == ingresoId);

    // Llena los campos comunes
    document.getElementById("editar-concepto").value = ingreso.concepto || "";
    document.getElementById("editar-descripcion").value = ingreso.descripcion || "";

    // Tipo de ingreso
    if (ingreso.fijo === "Sí") {
      document.getElementById("editar-tipo").value = "fijo";
      document.getElementById("campos-variable").style.display = "none";
      document.getElementById("campos-fijo").style.display = "";
      document.getElementById("editar-monto-fijo").value = ingreso.monto || "";
      document.getElementById("editar-frecuencia").value = ingreso.frecuencia || "mensual";
      document.getElementById("editar-fecha-inicio").value = ingreso.fechaInicio || "";
    } else {
      document.getElementById("editar-tipo").value = "variable";
      document.getElementById("campos-variable").style.display = "";
      document.getElementById("campos-fijo").style.display = "none";
      document.getElementById("editar-monto-variable").value = ingreso.monto || "";
      document.getElementById("editar-fecha-variable").value = ingreso.fecha || "";
    }

    document.getElementById("form-editar-ingreso")._tarjeta = tarjeta;
    document.getElementById("modal-titulo-editar").textContent = "Editar Ingreso";
    mostrarModalEditar();
  };

  tarjeta.querySelector(".btn-eliminar").onclick = function (e) {
    e.stopPropagation();
    window.tarjetaAEliminar = tarjeta;
    document.getElementById("nombre-ingreso-eliminar").textContent = `"${tarjeta.querySelector(".concepto").textContent}"`;
    document.getElementById("modal-eliminar-ingreso").classList.remove("modal-ingreso-oculto");
    document.getElementById("modal-eliminar-ingreso").style.display = "flex";
  };
}

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

document.getElementById("editar-tipo").addEventListener("change", function () {
  if (this.value === "variable") {
    document.getElementById("campos-variable").style.display = "";
    document.getElementById("campos-fijo").style.display = "none";
  } else {
    document.getElementById("campos-variable").style.display = "none";
    document.getElementById("campos-fijo").style.display = "";
  }
});

function limpiarFormulario() {
  document.getElementById("editar-tipo").value = "variable";
  document.getElementById("campos-variable").style.display = "";
  document.getElementById("campos-fijo").style.display = "none";
  ["concepto", "descripcion"].forEach(id => document.getElementById("editar-" + id).value = "");
  document.getElementById("editar-monto-variable").value = "";
  document.getElementById("editar-fecha-variable").value = "";
  document.getElementById("editar-monto-fijo").value = "";
  document.getElementById("editar-frecuencia").value = "mensual";
  document.getElementById("editar-fecha-inicio").value = "";
}

document.getElementById("form-editar-ingreso").addEventListener("submit", function (e) {
  e.preventDefault();
  const tipo = document.getElementById("editar-tipo").value;
  let datosIngreso = {
    concepto: document.getElementById("editar-concepto").value,
    descripcion: document.getElementById("editar-descripcion").value,
    tipo
  };

  if (tipo === "variable") {
    datosIngreso.monto = document.getElementById("editar-monto-variable").value;
    datosIngreso.fecha = document.getElementById("editar-fecha-variable").value;
    datosIngreso.fijo = "No";
    if (!datosIngreso.fecha) {
      alert("❌ La fecha es obligatoria.");
      return;
    }
    // Procede normalmente
    guardarIngreso(datosIngreso, e.target._tarjeta);
  } else {
    datosIngreso.monto = document.getElementById("editar-monto-fijo").value;
    datosIngreso.frecuencia = document.getElementById("editar-frecuencia").value;
    datosIngreso.fechaInicio = document.getElementById("editar-fecha-inicio").value;
    datosIngreso.fijo = "Sí";
    if (!datosIngreso.fechaInicio) {
      alert("❌ La fecha de inicio es obligatoria.");
      return;
    }
    // Mostrar modal de confirmación
    mostrarModalConfirmarProgramado(datosIngreso, e.target._tarjeta);
  }
});

function mostrarModalConfirmarProgramado(datosIngreso, tarjeta) {
  const modal = document.getElementById("modal-confirmar-programado");
  modal.classList.remove("modal-ingreso-oculto");
  modal.style.display = "flex";

  // Cerrar modal
  document.getElementById("cerrar-modal-confirmar-programado").onclick =
    document.getElementById("btn-cancelar-programado").onclick = function () {
      modal.classList.add("modal-ingreso-oculto");
      modal.style.display = "";
    };

  // Confirmar
  document.getElementById("btn-confirmar-programado").onclick = function () {
    modal.classList.add("modal-ingreso-oculto");
    modal.style.display = "";
    guardarIngreso(datosIngreso, tarjeta);
  };
}

// Nueva función para guardar (antes estaba en el submit)
function guardarIngreso(datosIngreso, tarjeta) {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    alert("❌ Error de autenticación. Por favor, inicia sesión nuevamente.");
    return;
  }

  if (!datosIngreso.concepto.trim()) {
    alert("❌ El concepto es obligatorio.");
    return;
  }

  if (!datosIngreso.monto || parseInt(datosIngreso.monto) <= 0) {
    alert("❌ El monto debe ser un número mayor a cero.");
    return;
  }

  if (!tarjeta) {
    const nuevoIngreso = agregarIngresoUsuario(usuario.id, datosIngreso);
    crearTarjetaIngreso(nuevoIngreso, document.querySelector(".tarjetas-ingresos"));
    alert("✅ Ingreso agregado correctamente.");
  } else {
    const ingresoId = tarjeta.dataset.ingresoId;
    const ingresoActualizado = actualizarIngresoUsuario(usuario.id, ingresoId, datosIngreso);

    if (ingresoActualizado) {
      tarjeta.querySelector(".concepto").textContent = ingresoActualizado.concepto;
      tarjeta.querySelector(".monto").textContent = `$${ingresoActualizado.monto.toLocaleString()}`;

      const detalle = tarjeta.querySelector(".detalle-tarjeta");
      detalle.innerHTML = `
        <div><strong>Concepto:</strong> ${ingresoActualizado.concepto}</div>
        <div><strong>Monto:</strong> $${ingresoActualizado.monto.toLocaleString()}</div>
        <div><strong>Descripción:</strong> ${ingresoActualizado.descripcion || "-"}</div>
        <div><strong>Fecha:</strong> ${ingresoActualizado.fecha || ingresoActualizado.fechaInicio || "-"}</div>
        <div><strong>Fijo:</strong> ${ingresoActualizado.fijo}</div>
      `;
      alert("✅ Ingreso actualizado correctamente.");
    }
  }

  ocultarModalEditar();
}

function cerrarModalEliminar() {
  document.getElementById("modal-eliminar-ingreso").classList.add("modal-ingreso-oculto");
  document.getElementById("modal-eliminar-ingreso").style.display = "";
  window.tarjetaAEliminar = null;
}

// Para reportes u otros módulos
function obtenerDatosIngresosParaReporte() {
  const usuarioId = localStorage.getItem("usuarioActivoId");
  if (!usuarioId) {
    console.warn("⚠️ No hay usuario activo.");
    return [];
  }

  const clave = `ingresos_usuario_${usuarioId}`;
  const ingresos = JSON.parse(localStorage.getItem(clave)) || [];

  return ingresos.map(({ concepto, monto, descripcion, fecha, fijo }) => ({
    concepto,
    monto,
    descripcion,
    fecha,
    fijo
  }));
}

function mostrarIngresosFiltrados() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;
  let ingresos = obtenerIngresosUsuario(usuario.id);

  if (filtroActual === "programados") {
    ingresos = ingresos.filter(i => i.fijo === "Sí");
  } else if (filtroActual === "variables") {
    ingresos = ingresos.filter(i => i.fijo === "No");
  }
  ingresos.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));

  const contenedor = document.querySelector(".tarjetas-ingresos");
  // Limpia solo las tarjetas de ingreso, NO la de añadir
  contenedor.querySelectorAll(".tarjeta-ingreso:not(.tarjeta-agregar)").forEach(t => t.remove());
  ingresos.forEach(ingreso => crearTarjetaIngreso(ingreso, contenedor));
}

// Cambia el filtro y actualiza los botones activos
function cambiarFiltroIngresos(nuevoFiltro) {
  filtroActual = nuevoFiltro;
  document.querySelectorAll('.btn-filtro-ingresos').forEach(btn => btn.classList.remove('activo'));
  if (nuevoFiltro === "todos") {
    document.getElementById("btn-todos-ingresos").classList.add("activo");
  } else if (nuevoFiltro === "programados") {
    document.getElementById("btn-programados-ingresos").classList.add("activo");
  } else if (nuevoFiltro === "variables") {
    document.getElementById("btn-variables-ingresos").classList.add("activo");
  }
  mostrarIngresosFiltrados();
}

// Eventos para los botones
document.getElementById("btn-todos-ingresos").onclick = () => cambiarFiltroIngresos("todos");
document.getElementById("btn-programados-ingresos").onclick = () => cambiarFiltroIngresos("programados");
document.getElementById("btn-variables-ingresos").onclick = () => cambiarFiltroIngresos("variables");

// Al agregar, editar o eliminar ingresos, llama a mostrarIngresosFiltrados() en vez de cargarIngresosUsuario()

const CONCEPTOS_INGRESO = [
  "Salario",
  "Comisiones",
  "Arriendo",
  "Ventas",
  "Bonos",
  "Honorarios",
  "Intereses",
  "Premios",
  "Otros"
];

function calcularDiasRecurrencia(fechaInicio, frecuencia) {
  // Ejemplo simple: para mensual, muestra el día del mes de la fecha de inicio
  if (!fechaInicio) return "-";
  const fecha = new Date(fechaInicio);
  if (frecuencia === "mensual") return fecha.getDate();
  if (frecuencia === "semanal") return fecha.toLocaleDateString('es-ES', { weekday: 'long' });
  // Puedes agregar más lógica según tus reglas
  return "-";
}

function calcularProximaRecurrencia(fechaInicio, frecuencia) {
  if (!fechaInicio) return "-";
  const hoy = new Date();
  let proxima = new Date(fechaInicio);

  while (proxima < hoy) {
    if (frecuencia === "mensual") {
      proxima.setMonth(proxima.getMonth() + 1);
    } else if (frecuencia === "quincenal") {
      proxima.setDate(proxima.getDate() + 15);
    } else if (frecuencia === "semanal") {
      proxima.setDate(proxima.getDate() + 7);
    } else if (frecuencia === "anual") {
      proxima.setFullYear(proxima.getFullYear() + 1);
    } else {
      break;
    }
  }
  return proxima.toLocaleDateString();
}
