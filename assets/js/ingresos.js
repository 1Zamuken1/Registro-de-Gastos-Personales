// === INTEGRACIÓN: SISTEMA DE USUARIOS E INGRESOS ===

let filtroActual = "todos";

document.addEventListener("DOMContentLoaded", function () {
  verificarAutenticacion();
  mostrarIngresosFiltrados();
  mostrarGraficoPorFiltro();
  //renderizarGraficoPorFiltro();

  // Cargar nav-bar
  cargarNavBar();

  // Eventos para cerrar modales
  ["cerrar-modal", "cerrar-modal-editar", "cerrar-modal-eliminar"].forEach(
    (id) =>
      (document.getElementById(id).onclick = () => {
        if (id === "cerrar-modal") ocultarModalDetalle();
        else if (id === "cerrar-modal-editar") ocultarModalEditar();
        else cerrarModalEliminar();
      })
  );

  // Eventos para cerrar modales haciendo click fuera
  ["modal-ingreso", "modal-editar-ingreso", "modal-eliminar-ingreso"].forEach(
    (id) => {
      document.getElementById(id).onclick = (e) => {
        if (e.target === e.currentTarget) {
          if (id === "modal-ingreso") ocultarModalDetalle();
          else if (id === "modal-editar-ingreso") ocultarModalEditar();
          else if (id === "modal-eliminar-ingreso") cerrarModalEliminar();
        }
      };
    }
  );

  // Eventos para eliminar ingreso
  document.getElementById("btn-confirmar-eliminar").onclick = function () {
    if (window.tarjetaAEliminar) {
      eliminarIngresoUsuario(window.tarjetaAEliminar.dataset.ingresoId);
      window.tarjetaAEliminar.remove();
    }
    cerrarModalEliminar();
  };

  document.getElementById("btn-cancelar-eliminar").onclick =
    cerrarModalEliminar;

  // Evento para agregar ingreso
  document.getElementById("tarjeta-agregar-ingreso").onclick = function () {
    limpiarFormularioVariable();
    // Mostrar el modal adecuado según el filtro
    if (filtroActual === "variables") {
      document
        .getElementById("modal-formulario-variable")
        .classList.remove("modal-ingreso-oculto");
      document.getElementById("modal-formulario-variable").style.display =
        "flex";
    } else if (filtroActual === "programados") {
      document
        .getElementById("modal-formulario-programado")
        .classList.remove("modal-ingreso-oculto");
      document.getElementById("modal-formulario-programado").style.display =
        "flex";
    }
    // Oculta el modal de edición si está abierto
    ocultarModalEditar();
  };

  // Evento para cambio de tipo de ingreso
  document
    .getElementById("editar-tipo")
    .addEventListener("change", function () {
      if (this.value === "variable") {
        document.getElementById("campos-variable").style.display = "";
        document.getElementById("campos-fijo").style.display = "none";
      } else {
        document.getElementById("campos-variable").style.display = "none";
        document.getElementById("campos-fijo").style.display = "";
      }
    });

  // Evento para el formulario de editar/agregar
  document
    .getElementById("form-editar-ingreso")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const tipo = document.getElementById("editar-tipo").value;
      let datosIngreso = {
        concepto: document.getElementById("editar-concepto").value,
        descripcion: document.getElementById("editar-descripcion").value,
        tipo,
      };

      if (tipo === "variable") {
        datosIngreso.monto = document.getElementById(
          "editar-monto-variable"
        ).value;
        datosIngreso.fecha = document.getElementById(
          "editar-fecha-variable"
        ).value;
        datosIngreso.fijo = "No";
        if (!datosIngreso.fecha) {
          alert("❌ La fecha es obligatoria.");
          return;
        }
        guardarIngreso(datosIngreso, e.target._tarjeta);
      } else {
        datosIngreso.monto = document.getElementById("editar-monto-fijo").value;
        datosIngreso.frecuencia =
          document.getElementById("editar-frecuencia").value;
        datosIngreso.fechaInicio = document.getElementById(
          "editar-fecha-inicio"
        ).value;
        datosIngreso.fijo = "Sí";
        if (!datosIngreso.fechaInicio) {
          alert("❌ La fecha de inicio es obligatoria.");
          return;
        }
        mostrarModalConfirmarProgramado(datosIngreso, e.target._tarjeta);
      }
    });

  // Eventos para filtros
  document.getElementById("btn-todos-ingresos").onclick = () =>
    cambiarFiltroIngresos("todos");
  document.getElementById("btn-programados-ingresos").onclick = () =>
    cambiarFiltroIngresos("programados");
  document.getElementById("btn-variables-ingresos").onclick = () =>
    cambiarFiltroIngresos("variables");

  // Evento para mostrar modal de conceptos
  const inputConcepto = document.getElementById("editar-concepto");
  inputConcepto.readOnly = true;
  inputConcepto.onclick = mostrarModalConceptos;

  // Evento para cerrar modal de conceptos
  document.getElementById("cerrar-modal-conceptos").onclick = function () {
    document
      .getElementById("modal-conceptos")
      .classList.add("modal-ingreso-oculto");
    document.getElementById("modal-conceptos").style.display = "";
  };

  // Evento para abrir modal de conceptos en formulario programado
  document.getElementById("concepto-programado").onclick = function () {
    mostrarModalConceptosProgramado();
  };

  document.getElementById("cancelar-programado").onclick = function () {
    document
      .getElementById("modal-formulario-programado")
      .classList.add("modal-ingreso-oculto");
    document.getElementById("modal-formulario-programado").style.display = "";
  };

  document.getElementById("cerrar-modal-formulario-programado").onclick =
    function () {
      document
        .getElementById("modal-formulario-programado")
        .classList.add("modal-ingreso-oculto");
      document.getElementById("modal-formulario-programado").style.display = "";
    };
  document.getElementById("cancelar-variable").onclick = function () {
    document
      .getElementById("modal-formulario-variable")
      .classList.add("modal-ingreso-oculto");
    document.getElementById("modal-formulario-variable").style.display = "";
  };

  // Botón "Hoy" para formulario de creación
  const btnHoyProgramado = document.getElementById("btn-hoy-programado");
  if (btnHoyProgramado) {
    btnHoyProgramado.onclick = function () {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      document.getElementById(
        "fecha-inicio-programado"
      ).value = `${yyyy}-${mm}-${dd}`;
    };
  }

  // Botón "Hoy" para formulario de edición
  const btnHoyEditar = document.getElementById("btn-hoy-editar-programado");
  if (btnHoyEditar) {
    btnHoyEditar.onclick = function () {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      document.getElementById(
        "editar-fecha-inicio"
      ).value = `${yyyy}-${mm}-${dd}`;
    };
  }

  document
    .getElementById("form-programado")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const usuario = obtenerUsuarioActual();
      if (!usuario) {
        alert(
          "❌ Error de autenticación. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      // Obtén los valores del formulario
      const concepto = document
        .getElementById("concepto-programado")
        .value.trim();
      const descripcion = document
        .getElementById("descripcion-programado")
        .value.trim();
      const monto = parseInt(
        document.getElementById("monto-programado").value,
        10
      );
      const frecuencia = document.getElementById("frecuencia-programado").value;
      const fechaInicio = document.getElementById(
        "fecha-inicio-programado"
      ).value;

      if (!concepto) {
        alert("❌ El concepto es obligatorio.");
        return;
      }
      if (!monto || monto <= 0) {
        alert("❌ El monto debe ser mayor a cero.");
        return;
      }
      if (!fechaInicio) {
        alert("❌ La fecha de inicio es obligatoria.");
        return;
      }

      // Crea el objeto de ingreso programado
      const ingresos = obtenerIngresosUsuario(usuario.id);
      const nuevoId = obtenerSiguienteIdIngreso(usuario.id);

      const nuevoIngreso = {
        id: nuevoId,
        concepto,
        descripcion,
        monto,
        frecuencia,
        fechaInicio,
        fijo: "Sí",
        fechaCreacion: new Date().toISOString(),
      };

      // Muestra el modal de confirmación en vez de guardar directamente
      mostrarModalConfirmarProgramado(nuevoIngreso, null);
    });

  // Botón "Hoy" para variable
  const btnHoyVariable = document.getElementById("btn-hoy-variable");
  if (btnHoyVariable) {
    btnHoyVariable.onclick = function () {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const dd = String(hoy.getDate()).padStart(2, "0");
      document.getElementById("fecha-variable").value = `${yyyy}-${mm}-${dd}`;
    };
  }

  // Guardar ingreso variable
  document
    .getElementById("form-variable")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const usuario = obtenerUsuarioActual();
      if (!usuario) {
        alert(
          "❌ Error de autenticación. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      const concepto = document
        .getElementById("concepto-variable")
        .value.trim();
      const descripcion = document
        .getElementById("descripcion-variable")
        .value.trim();
      const monto = parseInt(
        document.getElementById("monto-variable").value,
        10
      );
      const fecha = document.getElementById("fecha-variable").value;

      if (!concepto) {
        alert("❌ El concepto es obligatorio.");
        return;
      }
      if (!monto || monto <= 0) {
        alert("❌ El monto debe ser mayor a cero.");
        return;
      }
      if (!fecha) {
        alert("❌ La fecha es obligatoria.");
        return;
      }

      // Guardar en ingresos_variables_usuario_{id}
      const clave = `ingresos_variables_usuario_${usuario.id}`;
      const ingresos = JSON.parse(localStorage.getItem(clave)) || [];
      const nuevoId =
        ingresos.length > 0
          ? Math.max(...ingresos.map((i) => i.id || 0)) + 1
          : 1;

      const nuevoIngreso = {
        id: nuevoId,
        concepto,
        descripcion,
        monto,
        fecha,
        fijo: "No",
        fechaCreacion: new Date().toISOString(),
      };

      ingresos.push(nuevoIngreso);
      localStorage.setItem(clave, JSON.stringify(ingresos));

      document
        .getElementById("modal-formulario-variable")
        .classList.add("modal-ingreso-oculto");
      document.getElementById("modal-formulario-variable").style.display = "";
      mostrarIngresosFiltrados(); // Debes adaptar esta función para mostrar ambos tipos si lo deseas
      alert("✅ Ingreso variable guardado correctamente.");
    });
});

// === CARGA DEL NAV-BAR ===
function cargarNavBar() {
  // Aquí iría la lógica para cargar el nav-bar si no está implementada en nav-bar.js
  // Por ahora solo es un placeholder
}

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
  return usuarios.find((u) => u.id === parseInt(usuarioActivoId));
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
  const maxId = Math.max(...ingresos.map((i) => i.id || 0));
  return maxId + 1;
}

function agregarIngresoUsuario(usuarioId, ingreso) {
  const ingresos = obtenerIngresosUsuario(usuarioId);
  const nuevoId = obtenerSiguienteIdIngreso(usuarioId);

  const nuevoIngreso = {
    id: nuevoId,
    concepto: ingreso.concepto,
    monto: parseInt(ingreso.monto),
    descripcion: ingreso.descripcion || "",
    fecha: ingreso.fecha,
    fijo: ingreso.fijo,
    fechaCreacion: new Date().toISOString(),
    frecuencia: ingreso.frecuencia || null,
    fechaInicio: ingreso.fechaInicio || null,
  };

  ingresos.push(nuevoIngreso);
  guardarIngresosUsuario(usuarioId, ingresos);
  return nuevoIngreso;
}

function actualizarIngresoUsuario(usuarioId, ingresoId, datosActualizados) {
  const ingresos = obtenerIngresosUsuario(usuarioId);
  const indice = ingresos.findIndex((i) => i.id === parseInt(ingresoId));

  if (indice !== -1) {
    ingresos[indice] = {
      ...ingresos[indice],
      concepto: datosActualizados.concepto,
      monto: parseInt(datosActualizados.monto),
      descripcion: datosActualizados.descripcion || "",
      fecha: datosActualizados.fecha,
      fijo: datosActualizados.fijo,
      fechaModificacion: new Date().toISOString(),
      frecuencia: datosActualizados.frecuencia || null,
      fechaInicio: datosActualizados.fechaInicio || null,
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
  const ingresosActualizados = ingresos.filter(
    (i) => i.id !== parseInt(ingresoId)
  );
  guardarIngresosUsuario(usuario.id, ingresosActualizados);
  return true;
}

// === INTERFAZ Y TARJETAS ===
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
      <div><strong>Día(s) de recurrencia:</strong> ${calcularDiasRecurrencia(
        ingreso.fechaInicio,
        ingreso.frecuencia
      )}</div>
      <div><strong>Próxima recurrencia:</strong> ${calcularProximaRecurrencia(
        ingreso.fechaInicio,
        ingreso.frecuencia
      )}</div>
      <div><strong>Fecha inicio:</strong> ${ingreso.fechaInicio || "-"}</div>
      <div><strong>Fecha creación:</strong> ${
        ingreso.fechaCreacion
          ? new Date(ingreso.fechaCreacion).toLocaleDateString()
          : "-"
      }</div>
      <div><strong>Tipo:</strong> Fijo/Programado</div>
    `;
  } else {
    detalleHtml += `
      <div><strong>Fecha recibido:</strong> ${ingreso.fecha || "-"}</div>
      <div><strong>Fecha creación:</strong> ${
        ingreso.fechaCreacion
          ? new Date(ingreso.fechaCreacion).toLocaleDateString()
          : "-"
      }</div>
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
    const ingreso = ingresos.find((i) => i.id == ingresoId);

    // Llena el modal con información básica
    document.getElementById("modal-concepto").textContent = ingreso.concepto;
    document.getElementById(
      "modal-monto"
    ).textContent = `$${ingreso.monto.toLocaleString()}`;
    document.getElementById("modal-descripcion").textContent =
      ingreso.descripcion || "-";
    document.getElementById("modal-fecha").textContent = ingreso.fechaCreacion
      ? new Date(ingreso.fechaCreacion).toLocaleDateString()
      : "-";
    document.getElementById("modal-fijo").textContent = ingreso.fijo;

    // Mostrar próxima recurrencia solo si es programado
    if (ingreso.fijo === "Sí") {
      document.getElementById("modal-proxima-recurrencia-row").style.display =
        "";
      document.getElementById("modal-proxima-recurrencia").textContent =
        calcularProximaRecurrencia(ingreso.fechaInicio, ingreso.frecuencia);
    } else {
      document.getElementById("modal-proxima-recurrencia-row").style.display =
        "none";
      document.getElementById("modal-proxima-recurrencia").textContent = "";
    }

    mostrarModalDetalle();
  };

  tarjeta.querySelector(".btn-editar").onclick = function (e) {
    e.stopPropagation();
    const ingresoId = tarjeta.dataset.ingresoId;
    const usuario = obtenerUsuarioActual();
    const ingresos = obtenerIngresosUsuario(usuario.id);
    const ingreso = ingresos.find((i) => i.id == ingresoId);

    // Llena los campos comunes
    document.getElementById("editar-concepto").value = ingreso.concepto || "";
    document.getElementById("editar-descripcion").value =
      ingreso.descripcion || "";

    // Tipo de ingreso
    if (ingreso.fijo === "Sí") {
      document.getElementById("editar-tipo").value = "fijo";
      document.getElementById("campos-variable").style.display = "none";
      document.getElementById("campos-fijo").style.display = "";
      document.getElementById("editar-monto-fijo").value = ingreso.monto || "";
      document.getElementById("editar-frecuencia").value =
        ingreso.frecuencia || "mensual";
      document.getElementById("editar-fecha-inicio").value =
        ingreso.fechaInicio || "";
    } else {
      document.getElementById("editar-tipo").value = "variable";
      document.getElementById("campos-variable").style.display = "";
      document.getElementById("campos-fijo").style.display = "none";
      document.getElementById("editar-monto-variable").value =
        ingreso.monto || "";
      document.getElementById("editar-fecha-variable").value =
        ingreso.fecha || "";
    }

    document.getElementById("form-editar-ingreso")._tarjeta = tarjeta;
    document.getElementById("modal-titulo-editar").textContent =
      "Editar Ingreso";
    mostrarModalEditar();
  };

  tarjeta.querySelector(".btn-eliminar").onclick = function (e) {
    e.stopPropagation();
    window.tarjetaAEliminar = tarjeta;
    document.getElementById("nombre-ingreso-eliminar").textContent = `"${
      tarjeta.querySelector(".concepto").textContent
    }"`;
    document
      .getElementById("modal-eliminar-ingreso")
      .classList.remove("modal-ingreso-oculto");
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

function limpiarFormulario() {
  document.getElementById("editar-tipo").value = "variable";
  document.getElementById("campos-variable").style.display = "";
  document.getElementById("campos-fijo").style.display = "none";
  ["concepto", "descripcion"].forEach(
    (id) => (document.getElementById("editar-" + id).value = "")
  );
  document.getElementById("editar-monto-variable").value = "";
  document.getElementById("editar-fecha-variable").value = "";
  document.getElementById("editar-monto-fijo").value = "";
  document.getElementById("editar-frecuencia").value = "mensual";
  document.getElementById("editar-fecha-inicio").value = "";
}

// Limpia el formulario variable
function limpiarFormularioVariable() {
  document.getElementById("concepto-variable").value = "";
  document.getElementById("descripcion-variable").value = "";
  document.getElementById("monto-variable").value = "";
  document.getElementById("fecha-variable").value = "";
}

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
    crearTarjetaIngreso(
      nuevoIngreso,
      document.querySelector(".tarjetas-ingresos")
    );
    alert("✅ Ingreso agregado correctamente.");
  } else {
    const ingresoId = tarjeta.dataset.ingresoId;
    const ingresoActualizado = actualizarIngresoUsuario(
      usuario.id,
      ingresoId,
      datosIngreso
    );

    if (ingresoActualizado) {
      tarjeta.querySelector(".concepto").textContent =
        ingresoActualizado.concepto;
      tarjeta.querySelector(
        ".monto"
      ).textContent = `$${ingresoActualizado.monto.toLocaleString()}`;

      const detalle = tarjeta.querySelector(".detalle-tarjeta");
      detalle.innerHTML = `
        <div><strong>Concepto:</strong> ${ingresoActualizado.concepto}</div>
        <div><strong>Monto:</strong> $${ingresoActualizado.monto.toLocaleString()}</div>
        <div><strong>Descripción:</strong> ${
          ingresoActualizado.descripcion || "-"
        }</div>
        <div><strong>Fecha:</strong> ${
          ingresoActualizado.fecha || ingresoActualizado.fechaInicio || "-"
        }</div>
        <div><strong>Fijo:</strong> ${ingresoActualizado.fijo}</div>
      `;
      alert("✅ Ingreso actualizado correctamente.");
    }
  }

  ocultarModalEditar();
  mostrarIngresosFiltrados();
  actualizarGraficoIngresos();
}

function cerrarModalEliminar() {
  document
    .getElementById("modal-eliminar-ingreso")
    .classList.add("modal-ingreso-oculto");
  document.getElementById("modal-eliminar-ingreso").style.display = "";
  window.tarjetaAEliminar = null;
}

function mostrarIngresosFiltrados() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

  let ingresos = [];
  if (filtroActual === "programados") {
    ingresos = obtenerIngresosUsuario(usuario.id).filter(
      (i) => i.fijo === "Sí"
    );
  } else if (filtroActual === "variables") {
    // Cargar ingresos variables del storage separado
    ingresos =
      JSON.parse(
        localStorage.getItem(`ingresos_variables_usuario_${usuario.id}`)
      ) || [];
  } else {
    // Mostrar ambos tipos
    const programados = obtenerIngresosUsuario(usuario.id);
    const variables =
      JSON.parse(
        localStorage.getItem(`ingresos_variables_usuario_${usuario.id}`)
      ) || [];
    ingresos = [...programados, ...variables];
  }

  ingresos.sort(
    (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)
  );

  const contenedor = document.querySelector(".tarjetas-ingresos");
  contenedor
    .querySelectorAll(".tarjeta-ingreso:not(.tarjeta-agregar)")
    .forEach((t) => t.remove());
  ingresos.forEach((ingreso) => crearTarjetaIngreso(ingreso, contenedor));
}

function actualizarTituloIngresos() {
  const titulo = document.querySelector("h1");
  if (!titulo) return;
  if (filtroActual === "programados") {
    titulo.textContent = "Ingresos Programados";
  } else if (filtroActual === "variables") {
    titulo.textContent = "Ingresos Variables";
  } else {
    titulo.textContent = "Mis Ingresos";
  }
}

// Modifica cambiarFiltroIngresos para actualizar el título
function cambiarFiltroIngresos(nuevoFiltro) {
  filtroActual = nuevoFiltro;
  document
    .querySelectorAll(".btn-filtro-ingresos")
    .forEach((btn) => btn.classList.remove("activo"));
  if (nuevoFiltro === "todos") {
    document.getElementById("btn-todos-ingresos").classList.add("activo");
    document.getElementById("tarjeta-agregar-ingreso").style.display = "none";
  } else if (nuevoFiltro === "programados") {
    document.getElementById("btn-programados-ingresos").classList.add("activo");
    document.getElementById("tarjeta-agregar-ingreso").style.display = "";
  } else if (nuevoFiltro === "variables") {
    document.getElementById("btn-variables-ingresos").classList.add("activo");
    document.getElementById("tarjeta-agregar-ingreso").style.display = "";
  }
  actualizarTituloIngresos(); // <-- Llama aquí
  mostrarIngresosFiltrados();
  mostrarGraficoPorFiltro(); // <-- Llama a mostrar/ocultar gráfico
}

function mostrarGraficoPorFiltro() {
  if (filtroActual === "todos") {
    renderizarGraficoIngresos();
  } else if (filtroActual === "programados") {
    renderizarGraficoSoloProgramados();
  } else if (filtroActual === "variables") {
    renderizarGraficoSoloVariables();
  }
}

function mostrarModalConceptos() {
  const modal = document.getElementById("modal-conceptos");
  const lista = document.getElementById("lista-conceptos");
  lista.innerHTML = "";

  CONCEPTOS_INGRESO.forEach((concepto) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-concepto";
    tarjeta.style =
      "background:#f8f9fa;border-radius:12px;padding:18px;cursor:pointer;box-shadow:0 2px 8px #e1d5ee;transition:.2s;";
    tarjeta.innerHTML = `
      <div style="font-weight:700;color:#9B59B6;font-size:1.1rem;margin-bottom:8px;">${concepto.nombre}</div>
      <div style="color:#555;font-size:0.98rem;">${concepto.descripcion}</div>
    `;
    tarjeta.onclick = function () {
      document.getElementById("editar-concepto").value = concepto.nombre;
      modal.classList.add("modal-ingreso-oculto");
      modal.style.display = "";
    };
    tarjeta.onmouseover = () =>
      (tarjeta.style.boxShadow = "0 4px 16px #d1b3e6");
    tarjeta.onmouseout = () => (tarjeta.style.boxShadow = "0 2px 8px #e1d5ee");
    lista.appendChild(tarjeta);
  });

  modal.classList.remove("modal-ingreso-oculto");
  modal.style.display = "flex";
}

// Nueva función para seleccionar concepto en formulario programado
function mostrarModalConceptosProgramado() {
  const modal = document.getElementById("modal-conceptos");
  const lista = document.getElementById("lista-conceptos");
  lista.innerHTML = "";

  CONCEPTOS_INGRESO.forEach((concepto) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-concepto";
    tarjeta.style =
      "background:#f8f9fa;border-radius:12px;padding:18px;cursor:pointer;box-shadow:0 2px 8px #e1d5ee;transition:.2s;";
    tarjeta.innerHTML = `
      <div style="font-weight:700;color:#9B59B6;font-size:1.1rem;margin-bottom:8px;">${concepto.nombre}</div>
      <div style="color:#555;font-size:0.98rem;">${concepto.descripcion}</div>
    `;
    tarjeta.onclick = function () {
      document.getElementById("concepto-programado").value = concepto.nombre;
      modal.classList.add("modal-ingreso-oculto");
      modal.style.display = "";
    };
    tarjeta.onmouseover = () =>
      (tarjeta.style.boxShadow = "0 4px 16px #d1b3e6");
    tarjeta.onmouseout = () => (tarjeta.style.boxShadow = "0 2px 8px #e1d5ee");
    lista.appendChild(tarjeta);
  });

  modal.classList.remove("modal-ingreso-oculto");
  modal.style.display = "flex";
}

function calcularDiasRecurrencia(fechaInicio, frecuencia) {
  if (!fechaInicio) return "-";
  const fecha = new Date(fechaInicio);
  if (frecuencia === "mensual") return fecha.getDate();
  if (frecuencia === "semanal")
    return fecha.toLocaleDateString("es-ES", { weekday: "long" });
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
    fijo,
  }));
}

function obtenerDatosGraficoIngresos(rango = "mes") {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return { categorias: [], programados: [], variables: [] };

  // Obtener ingresos programados y variables
  const programados = obtenerIngresosUsuario(usuario.id).filter(
    (i) => i.fijo === "Sí"
  );
  const variables =
    JSON.parse(
      localStorage.getItem(`ingresos_variables_usuario_${usuario.id}`)
    ) || [];

  const hoy = new Date();
  let categorias = [];
  let datosProgramados = [];
  let datosVariables = [];

  if (rango === "dia") {
    // Últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      const label = d.toLocaleDateString();
      categorias.push(label);

      // Suma de montos para ese día
      datosProgramados.push(
        programados
          .filter(
            (ing) =>
              new Date(ing.fechaInicio || ing.fecha).toLocaleDateString() ===
              label
          )
          .reduce((sum, ing) => sum + Number(ing.monto), 0)
      );

      datosVariables.push(
        variables
          .filter((ing) => new Date(ing.fecha).toLocaleDateString() === label)
          .reduce((sum, ing) => sum + Number(ing.monto), 0)
      );
    }
  } else if (rango === "mes") {
    // Días del mes actual
    const diasEnMes = new Date(
      hoy.getFullYear(),
      hoy.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= diasEnMes; i++) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth(), i);
      const label = i.toString();
      categorias.push(label);

      datosProgramados.push(
        programados
          .filter((ing) => {
            const fecha = new Date(ing.fechaInicio || ing.fecha);
            return (
              fecha.getFullYear() === hoy.getFullYear() &&
              fecha.getMonth() === hoy.getMonth() &&
              fecha.getDate() === i
            );
          })
          .reduce((sum, ing) => sum + Number(ing.monto), 0)
      );

      datosVariables.push(
        variables
          .filter((ing) => {
            const fecha = new Date(ing.fecha);
            return (
              fecha.getFullYear() === hoy.getFullYear() &&
              fecha.getMonth() === hoy.getMonth() &&
              fecha.getDate() === i
            );
          })
          .reduce((sum, ing) => sum + Number(ing.monto), 0)
      );
    }
  } else if (
    rango === "trimestre" ||
    rango === "semestre" ||
    rango === "anio"
  ) {
    // Por mes
    let meses = 12;
    if (rango === "trimestre") meses = 3;
    if (rango === "semestre") meses = 6;
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    for (let i = meses - 1; i >= 0; i--) {
      let mes = mesActual - i;
      let anio = anioActual;
      if (mes < 0) {
        mes += 12;
        anio--;
      }
      const label = new Date(anio, mes, 1).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      categorias.push(label);

      datosProgramados.push(
        programados
          .filter((ing) => {
            const fecha = new Date(ing.fechaInicio || ing.fecha);
            return fecha.getFullYear() === anio && fecha.getMonth() === mes;
          })
          .reduce((sum, ing) => sum + Number(ing.monto), 0)
      );

      datosVariables.push(
        variables
          .filter((ing) => {
            const fecha = new Date(ing.fecha);
            return fecha.getFullYear() === anio && fecha.getMonth() === mes;
          })
          .reduce((sum, ing) => sum + Number(ing.monto), 0)
      );
    }
  }

  return {
    categorias,
    programados: datosProgramados,
    variables: datosVariables,
  };
}

let chartIngresos = null;
let chartProgramados = null;
let chartVariables = null;

function renderizarGraficoIngresos() {
  // Verifica que el elemento exista antes de continuar
  const chartDiv = document.querySelector("#chart-ingresos");
  if (!chartDiv) return;

  const rango = document.getElementById("select-rango-grafico").value;
  const datos = obtenerDatosGraficoIngresos(rango);

  // Asegura que los datos sean arrays
  const programados = Array.isArray(datos.programados) ? datos.programados : [];
  const variables = Array.isArray(datos.variables) ? datos.variables : [];

  // Títulos y subtítulos dinámicos
  let titulo = "Ingresos recibidos por ";
  let subtitulo = "";
  if (rango === "dia") {
    titulo += "los últimos 7 días";
    subtitulo = "Cada punto representa un día";
  } else if (rango === "mes") {
    titulo += "el mes actual";
    subtitulo = "Cada punto representa un día del mes";
  } else if (rango === "trimestre") {
    titulo += "el último trimestre";
    subtitulo = "Cada punto representa un mes";
  } else if (rango === "semestre") {
    titulo += "el último semestre";
    subtitulo = "Cada punto representa un mes";
  } else if (rango === "anio") {
    titulo += "el año actual";
    subtitulo = "Cada punto representa un mes";
  }

  // Asigna el título y subtítulo solo en HTML
  document.getElementById("grafico-titulo").textContent = titulo;
  document.getElementById("grafico-subtitulo").textContent = subtitulo;

  const options = {
    series: [
      {
        name: "Ingresos programados",
        data: programados,
      },
      {
        name: "Ingresos variables",
        data: variables,
      },
    ],
    chart: {
      height: 370,
      type: "line",
      zoom: { enabled: false },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      background: "transparent",
      offsetY: 0,
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 7,
      colors: ["#43ffb0", "#00eaff"], // Verde claro y cian brillante
      strokeColors: "#101624", // Contraste con fondo
      strokeWidth: 3,
      hover: { size: 11 },
    },
    grid: {
      row: {
        colors: ["rgba(67,255,176,0.10)", "transparent"], // Verde claro muy suave
        opacity: 0.5,
      },
      borderColor: "#43ffb0",
    },
    xaxis: {
      categories: Array.isArray(datos.categorias) ? datos.categorias : [],
      tickAmount:
        Array.isArray(datos.categorias) && datos.categorias.length > 1
          ? datos.categorias.length - 1
          : 1,
      title: {
        text:
          rango === "dia"
            ? "Día"
            : rango.charAt(0).toUpperCase() + rango.slice(1),
        style: { color: "#43ffb0", fontWeight: 700 },
      },
      labels: {
        style: { fontSize: "1rem", colors: "#baffd9" },
      },
      axisBorder: { color: "#43ffb0" },
      axisTicks: { color: "#43ffb0" },
    },
    yaxis: {
      title: {
        text: "Monto de ingresos",
        style: { color: "#43ffb0", fontWeight: 700 },
      },
      min: 0,
      forceNiceScale: true,
      labels: {
        style: { fontSize: "1rem", colors: "#baffd9" },
        formatter: (val) => "$" + val.toLocaleString(),
      },
      axisBorder: { color: "#43ffb0" },
      axisTicks: { color: "#43ffb0" },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "1.1rem",
      fontWeight: 700,
      markers: {
        width: 18,
        height: 18,
        radius: 6,
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8,
      },
      labels: {
        colors: ["#43ffb0", "#00eaff"],
        useSeriesColors: false,
      },
    },
    colors: ["#43ffb0", "#00eaff"], // Verde claro y cian brillante
    tooltip: {
      theme: "dark",
      style: { fontSize: "1.1rem", color: "#43ffb0" },
      x: { show: true },
      y: {
        formatter: (val) => "$" + val.toLocaleString(),
      },
    },
  };

  // Limpia el gráfico anterior si existe
  if (chartIngresos) {
    chartIngresos.destroy();
    chartIngresos = null;
  }

  chartIngresos = new ApexCharts(chartDiv, options);
  chartIngresos.render();
}
function renderizarGraficoSoloProgramados() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;
  const programados = obtenerIngresosUsuario(usuario.id).filter(
    (i) => i.fijo === "Sí"
  );
  // Ejemplo: mostrar ingresos programados por mes del año actual
  const hoy = new Date();
  let categorias = [];
  let datos = [];
  for (let i = 0; i < 12; i++) {
    const label = new Date(hoy.getFullYear(), i, 1).toLocaleString("default", {
      month: "short",
    });
    categorias.push(label);
    datos.push(
      programados.filter((ing) => {
        const fecha = new Date(ing.fechaInicio || ing.fecha);
        return (
          fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === i
        );
      }).length
    );
  }
  const options = {
    series: [{ name: "Programados", data: datos }],
    chart: { height: 350, type: "line", zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    title: { text: "Ingresos programados por mes", align: "left" },
    xaxis: { categories },
    colors: ["#9B59B6"],
  };
  if (chartProgramados) {
    chartProgramados.updateOptions(options);
  } else {
    chartProgramados = new ApexCharts(
      document.querySelector("#chart-programados"),
      options
    );
    chartProgramados.render();
  }
}

function renderizarGraficoSoloVariables() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;
  const variables =
    JSON.parse(
      localStorage.getItem(`ingresos_variables_usuario_${usuario.id}`)
    ) || [];
  // Ejemplo: mostrar ingresos variables por mes del año actual
  const hoy = new Date();
  let categorias = [];
  let datos = [];
  for (let i = 0; i < 12; i++) {
    const label = new Date(hoy.getFullYear(), i, 1).toLocaleString("default", {
      month: "short",
    });
    categorias.push(label);
    datos.push(
      variables.filter((ing) => {
        const fecha = new Date(ing.fecha);
        return (
          fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === i
        );
      }).length
    );
  }
  const options = {
    series: [{ name: "Variables", data: datos }],
    chart: { height: 350, type: "line", zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    title: { text: "Ingresos variables por mes", align: "left" },
    xaxis: { categories },
    colors: ["#4E8EC6"],
  };
  if (chartVariables) {
    chartVariables.updateOptions(options);
  } else {
    chartVariables = new ApexCharts(
      document.querySelector("#chart-variables"),
      options
    );
    chartVariables.render();
  }
}

if (document.getElementById("chart-ingresos")) {
  renderizarGraficoIngresos();
  document.getElementById("select-rango-grafico").onchange =
    renderizarGraficoIngresos;
}

// Actualizar gráfico cuando se agregan/eliminan ingresos
function actualizarGraficoIngresos() {
  renderizarGraficoPorFiltro();
}

// Llama a actualizarGraficoIngresos() después de guardar/eliminar ingresos
// Ejemplo: después de mostrarIngresosFiltrados();

const CONCEPTOS_INGRESO = [
  {
    nombre: "Salario",
    descripcion:
      "Pago regular recibido por trabajo en relación de dependencia.",
  },
  {
    nombre: "Honorarios profesionales",
    descripcion: "Ingresos por servicios profesionales independientes.",
  },
  {
    nombre: "Comisiones por ventas",
    descripcion: "Ganancias obtenidas por ventas realizadas.",
  },
  {
    nombre: "Bonificaciones laborales",
    descripcion: "Pagos adicionales otorgados por desempeño o logros.",
  },
  {
    nombre: "Ingresos por arriendo de propiedades",
    descripcion:
      "Dinero recibido por alquilar una vivienda, local, oficina o terreno.",
  },
  {
    nombre: "Ingresos por negocio propio o familiar",
    descripcion: "Ganancias de un emprendimiento propio o familiar.",
  },
  {
    nombre: "Dividendos de acciones",
    descripcion: "Pagos recibidos por ser accionista de una empresa.",
  },
  {
    nombre: "Intereses de cuentas o inversiones",
    descripcion: "Ganancias por tener dinero depositado o invertido.",
  },
  {
    nombre: "Pensiones o jubilaciones",
    descripcion: "Pagos periódicos tras el retiro laboral.",
  },
  {
    nombre: "Subsidios estatales o ayudas gubernamentales",
    descripcion: "Apoyos económicos otorgados por el gobierno.",
  },
  {
    nombre: "Ganancias por trabajos freelance",
    descripcion: "Ingresos por trabajos independientes sin contrato fijo.",
  },
  {
    nombre: "Ingresos por clases particulares o tutorías",
    descripcion: "Pagos por brindar enseñanza o apoyo académico.",
  },
  {
    nombre: "Venta de productos artesanales o hechos en casa",
    descripcion: "Ingresos por vender productos elaborados manualmente.",
  },
  {
    nombre: "Ingresos por servicios técnicos o reparaciones",
    descripcion: "Pagos por mantenimiento, instalación o arreglos técnicos.",
  },
  {
    nombre: "Rentas por vehículos alquilados (ej. carros, motos)",
    descripcion: "Ingresos por prestar vehículos a cambio de un pago.",
  },
  {
    nombre: "Regalías por derechos de autor o propiedad intelectual",
    descripcion: "Pagos por uso de obras, inventos o marcas propias.",
  },
  {
    nombre: "Ingresos por contenido digital (YouTube, streaming, etc.)",
    descripcion: "Ganancias por compartir contenido en plataformas digitales.",
  },
  {
    nombre: "Premios de sorteos o rifas",
    descripcion: "Dinero obtenido al ganar un concurso o rifa.",
  },
  {
    nombre: "Alquiler de espacios (habitaciones, bodegas, etc.)",
    descripcion: "Ingresos por arrendar áreas de tu vivienda o propiedad.",
  },
  {
    nombre: "Ingresos por reventa de productos",
    descripcion: "Ganancias por vender productos comprados previamente.",
  },
];
