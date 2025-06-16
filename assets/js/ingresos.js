// === INTEGRACIÓN: SISTEMA DE USUARIOS E INGRESOS ===

document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticación del usuario
  verificarAutenticacion();
  
  // Cargar ingresos del usuario actual
  cargarIngresosUsuario();
  
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
    if (window.tarjetaAEliminar) {
      eliminarIngresoUsuario(window.tarjetaAEliminar.dataset.ingresoId);
      window.tarjetaAEliminar.remove();
    }
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

// === FUNCIONES DE AUTENTICACIÓN Y USUARIOS ===

function verificarAutenticacion() {
  const usuarioActivoId = sessionStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) {
    alert("❌ Debes iniciar sesión para acceder a esta página.");
    window.location.href = "../views/Iniciosesion.html";
    return false;
  }
  return true;
}

function obtenerUsuarioActual() {
  const usuarioActivoId = sessionStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) return null;
  
  const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
  return usuarios.find(u => u.id === parseInt(usuarioActivoId));
}

// === FUNCIONES DE GESTIÓN DE INGRESOS POR USUARIO ===

function obtenerIngresosUsuario(usuarioId) {
  const clave = `ingresos_usuario_${usuarioId}`;
  return JSON.parse(sessionStorage.getItem(clave)) || [];
}

function guardarIngresosUsuario(usuarioId, ingresos) {
  const clave = `ingresos_usuario_${usuarioId}`;
  sessionStorage.setItem(clave, JSON.stringify(ingresos));
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
    fechaCreacion: new Date().toISOString()
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
      fechaModificacion: new Date().toISOString()
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

// === FUNCIONES DE INTERFAZ ===

function cargarIngresosUsuario() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;
  
  const ingresos = obtenerIngresosUsuario(usuario.id);
  const contenedor = document.querySelector(".tarjetas-ingresos");
  
  // Limpiar tarjetas existentes (excepto la de agregar)
  const tarjetasExistentes = contenedor.querySelectorAll(".tarjeta-ingreso:not(.tarjeta-agregar)");
  tarjetasExistentes.forEach(tarjeta => tarjeta.remove());
  
  // Crear tarjetas para cada ingreso
  ingresos.forEach(ingreso => {
    crearTarjetaIngreso(ingreso, contenedor);
  });
}

function crearTarjetaIngreso(ingreso, contenedor) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-ingreso";
  tarjeta.dataset.ingresoId = ingreso.id;
  
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
      <div><strong>Concepto:</strong> ${ingreso.concepto}</div>
      <div><strong>Monto:</strong> $${ingreso.monto.toLocaleString()}</div>
      <div><strong>Descripción:</strong> ${ingreso.descripcion || "-"}</div>
      <div><strong>Fecha:</strong> ${ingreso.fecha}</div>
      <div><strong>Fijo:</strong> ${ingreso.fijo}</div>
    </div>
  `;
  
  // Insertar antes de la tarjeta de agregar
  const tarjetaAgregar = contenedor.querySelector(".tarjeta-agregar");
  contenedor.insertBefore(tarjeta, tarjetaAgregar);
  
  asignarEventosTarjeta(tarjeta);
}

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
    ["concepto", "monto", "descripcion", "fecha", "fijo"].forEach((id, i) => {
      const valor = i < 2
        ? tarjeta.querySelector("." + id).textContent.replace(/[^0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
        : detalle[i].textContent.split(":")[1].trim();
      
      document.getElementById("editar-" + id).value = valor;
    });
    
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
  ["concepto", "monto", "descripcion", "fecha", "fijo"].forEach(id => {
    const elemento = document.getElementById("editar-" + id);
    if (id === "fijo") {
      elemento.value = "Sí";
    } else if (id === "fecha") {
      // Limpiar fecha para que se elija manualmente
      elemento.value = "";
    } else {
      elemento.value = "";
    }
  });
}

// Guardar cambios o agregar nuevo ingreso
document.getElementById("form-editar-ingreso").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    alert("❌ Error de autenticación. Por favor, inicia sesión nuevamente.");
    return;
  }
  
  const tarjeta = e.target._tarjeta;
  const datosIngreso = {};
  
  ["concepto", "monto", "descripcion", "fecha", "fijo"].forEach(id => {
    datosIngreso[id] = document.getElementById("editar-" + id).value;
  });
  
  // Validaciones
  if (!datosIngreso.concepto.trim()) {
    alert("❌ El concepto es obligatorio.");
    return;
  }
  
  if (!datosIngreso.monto || parseInt(datosIngreso.monto) <= 0) {
    alert("❌ El monto debe ser un número mayor a cero.");
    return;
  }
  
  if (!datosIngreso.fecha) {
    alert("❌ La fecha es obligatoria.");
    return;
  }

  if (!tarjeta) {
    // Crear nuevo ingreso
    const nuevoIngreso = agregarIngresoUsuario(usuario.id, datosIngreso);
    crearTarjetaIngreso(nuevoIngreso, document.querySelector(".tarjetas-ingresos"));
    alert("✅ Ingreso agregado correctamente.");
  } else {
    // Editar ingreso existente
    const ingresoId = tarjeta.dataset.ingresoId;
    const ingresoActualizado = actualizarIngresoUsuario(usuario.id, ingresoId, datosIngreso);
    
    if (ingresoActualizado) {
      // Actualizar la tarjeta en el DOM
      tarjeta.querySelector(".concepto").textContent = ingresoActualizado.concepto;
      tarjeta.querySelector(".monto").textContent = `$${ingresoActualizado.monto.toLocaleString()}`;
      
      const detalle = tarjeta.querySelector(".detalle-tarjeta");
      detalle.innerHTML = `
        <div><strong>Concepto:</strong> ${ingresoActualizado.concepto}</div>
        <div><strong>Monto:</strong> $${ingresoActualizado.monto.toLocaleString()}</div>
        <div><strong>Descripción:</strong> ${ingresoActualizado.descripcion || "-"}</div>
        <div><strong>Fecha:</strong> ${ingresoActualizado.fecha}</div>
        <div><strong>Fijo:</strong> ${ingresoActualizado.fijo}</div>
      `;
      alert("✅ Ingreso actualizado correctamente.");
    }
  }
  
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

// === FUNCIONES DE UTILIDAD Y DEBUG ===
function mostrarIngresosUsuario(usuarioId = null) {
  const usuario = usuarioId ? { id: usuarioId } : obtenerUsuarioActual();
  if (!usuario) {
    console.log("No hay usuario activo");
    return;
  }
  
  const ingresos = obtenerIngresosUsuario(usuario.id);
  console.log(`=== INGRESOS DEL USUARIO ${usuario.id} ===`);
  console.log("Total de ingresos:", ingresos.length);
  console.log("Ingresos:", ingresos);
  console.log("=======================================");
}

function limpiarIngresosUsuario(usuarioId = null) {
  const usuario = usuarioId ? { id: usuarioId } : obtenerUsuarioActual();
  if (!usuario) return;
  
  if (confirm(`¿Estás seguro de que deseas eliminar todos los ingresos del usuario ${usuario.id}?`)) {
    const clave = `ingresos_usuario_${usuario.id}`;
    sessionStorage.removeItem(clave);
    cargarIngresosUsuario();
    alert("✅ Ingresos eliminados correctamente.");
  }
}

// Enviar datos a reportes
function obtenerDatosIngresosParaReporte() {
  const usuarioId = sessionStorage.getItem("usuarioActivoId");
  if (!usuarioId) {
    console.warn("⚠️ No hay usuario activo.");
    return [];
  }

  const clave = `ingresos_usuario_${usuarioId}`;
  const ingresos = JSON.parse(sessionStorage.getItem(clave)) || [];

  return ingresos.map(({ concepto, monto, descripcion, fecha, fijo }) => ({
    concepto,
    monto,
    descripcion,
    fecha,
    fijo
  }));
}
