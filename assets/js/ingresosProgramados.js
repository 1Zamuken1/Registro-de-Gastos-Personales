// Este script maneja los ingresos programados: agregarlos, editarlos, eliminarlos, mostrarlos en DataTable y confirmar alertas

let tablaIngresosProgramadosInicializada = false;
let ingresoPendienteConfirmar = null;

// Función auxiliar para guardar con manejo de errores - DEFINIDA UNA SOLA VEZ
function guardarEnLocalStorage(key, data) {
  try {
    if (typeof(Storage) === "undefined") {
      throw new Error("LocalStorage no está disponible en este navegador");
    }
    const jsonString = JSON.stringify(data);
    if (jsonString.length > 5000000) {
      throw new Error("Los datos son demasiado grandes para localStorage");
    }
    localStorage.setItem(key, jsonString);
    console.log(`Datos guardados correctamente en ${key}:`, data);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error("Error: LocalStorage está lleno", error);
      alert("Error: No hay suficiente espacio en el almacenamiento local. Intenta limpiar algunos datos.");
    } else {
      console.error(`Error al guardar en ${key}:`, error);
      alert(`Error al guardar: ${error.message}`);
    }
    return false;
  }
}

// Función auxiliar para obtener nuevo ID
function obtenerNuevoId(key) {
  let id = parseInt(localStorage.getItem(key)) || 0;
  id = id + 1;
  localStorage.setItem(key, id.toString());
  console.log(`Nuevo ID para ${key}:`, id);
  return id;
}

// Funciones auxiliares para formato
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES');
}

// FUNCIONES GLOBALES PARA LOS BOTONES
window.toggleIngresoProgramado = function(id) {
  console.log("Cambiando estado del ingreso ID:", id);

  let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
  const index = ingresos.findIndex(g => g.id === id);

  if (index === -1) {
    console.error("Ingreso no encontrado con ID:", id);
    alert("Error: No se encontró el ingreso programado.");
    return;
  }

  const nuevoEstado = !ingresos[index].activo;
  ingresos[index].activo = nuevoEstado;

  if (guardarEnLocalStorage("ingresosProgramados", ingresos)) {
    if (typeof window.actualizarTablaIngresosProgramados === 'function') {
      window.actualizarTablaIngresosProgramados();
    }
    alert(`Ingreso programado ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
  }
};

window.editarIngresoProgramado = function(id) {
  console.log("Editando ingreso ID:", id);

  let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
  const ingreso = ingresos.find(g => g.id === id);

  if (!ingreso) {
    console.error("Ingreso no encontrado con ID:", id);
    alert("Error: No se encontró el ingreso programado.");
    return;
  }

  const form = document.getElementById("formIngresoProgramadoModal");
  const modal = document.getElementById("modalFormularioProgramado");

  if (!form || !modal) {
    console.error("No se encontraron elementos del formulario");
    return;
  }

  document.getElementById("montoProgramadoModal").value = ingreso.monto;
  document.getElementById("descripcionProgramadoModal").value = ingreso.descripcion;
  document.getElementById("frecuenciaProgramadoModal").value = ingreso.frecuencia;
  document.getElementById("fechaInicioModal").value = ingreso.fechaInicio;
  document.getElementById("fechaFinModal").value = ingreso.fechaFin || "";

  cargarOpcionesSubcategoria();
  setTimeout(() => {
    document.getElementById("subcategoriaProgramadoModal").value = ingreso.subcategoria;
  }, 100);

  form.dataset.modo = "editar";
  form.dataset.editId = ingreso.id;

  console.log("Formulario configurado para edición. Modo:", form.dataset.modo, "ID:", form.dataset.editId);

  modal.style.display = "block";
};

window.eliminarIngresoProgramado = function(id) {
  console.log("Eliminando ingreso ID:", id);

  if (!confirm("¿Estás seguro de que quieres eliminar este ingreso programado?")) {
    return;
  }

  let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
  const index = ingresos.findIndex(g => g.id === id);

  if (index === -1) {
    console.error("Ingreso no encontrado con ID:", id);
    alert("Error: No se encontró el ingreso programado.");
    return;
  }

  ingresos.splice(index, 1);

  if (guardarEnLocalStorage("ingresosProgramados", ingresos)) {
    if (typeof window.actualizarTablaIngresosProgramados === 'function') {
      window.actualizarTablaIngresosProgramados();
    }
    alert("Ingreso programado eliminado correctamente");
  }
};

// Función para inicializar la tabla
function inicializarTablaIngresosProgramados() {
  console.log("Inicializando tabla de ingresos programados...");

  if (typeof $ === 'undefined') {
    console.error("jQuery no está disponible");
    return false;
  }

  if (typeof $.fn.DataTable === 'undefined') {
    console.error("DataTables no está disponible");
    return false;
  }

  const tablaElement = document.getElementById('tablaGastosProgramados');
  if (!tablaElement) {
    console.error("Elemento tabla no encontrado en el DOM");
    return false;
  }

  try {
    if (tablaIngresosProgramadosInicializada) {
      $('#tablaGastosProgramados').DataTable().destroy();
    }

    $('#tablaGastosProgramados').DataTable({
      language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "No se encontraron ingresos programados",
        info: "Mostrando _START_ a _END_ de _TOTAL_ ingresos programados",
        infoEmpty: "No hay ingresos programados disponibles",
        infoFiltered: "(filtrado de _MAX_ ingresos programados en total)",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        }
      },
      columns: [
        { title: "ID", width: "5%" },
        { title: "Monto", width: "10%" },
        { title: "Descripción", width: "20%" },
        { title: "Frecuencia", width: "10%" },
        { title: "Subcategoría", width: "15%" },
        { title: "Inicio", width: "10%" },
        { title: "Fin", width: "10%" },
        { title: "Activo", width: "8%" },
        { title: "Acciones", width: "12%", orderable: false }
      ],
      order: [[0, 'desc']],
      pageLength: 10,
      destroy: true
    });

    tablaIngresosProgramadosInicializada = true;
    console.log("Tabla DataTable inicializada correctamente");
    return true;
  } catch (error) {
    console.error("Error al inicializar DataTable:", error);
    return false;
  }
}

// Función para cargar opciones de subcategoría
function cargarOpcionesSubcategoria() {
  const select = document.getElementById("subcategoriaProgramadoModal");
  if (!select) return;

  select.innerHTML = "<option value=''>Seleccionar subcategoría</option>";

  if (window.subcategoriasDisponiblesGlobal && Array.isArray(window.subcategoriasDisponiblesGlobal)) {
    window.subcategoriasDisponiblesGlobal.forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
  } else {
    const conceptos = JSON.parse(localStorage.getItem("conceptosIngresos")) || [];
    conceptos.forEach(concepto => {
      const opt = document.createElement("option");
      opt.value = concepto.nombre;
      opt.textContent = concepto.nombre;
      select.appendChild(opt);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formIngresoProgramadoModal") || document.getElementById("formGastoProgramadoModal");
  const modal = document.getElementById("modalFormularioProgramado");
  const confirmModal = document.getElementById("modalConfirmarGasto");

  if (!form || !modal || !confirmModal) {
    console.error("Error: No se encontraron elementos necesarios en el DOM");
    return;
  }

  const btnAgregar = document.getElementById("btnAgregarProgramado");
  if (btnAgregar) {
    btnAgregar.onclick = () => {
      modal.style.display = "block";
      cargarOpcionesSubcategoria();
      form.reset();
      form.dataset.modo = "agregar";
    };
  }

  const closeBtn = modal.querySelector(".close");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
      form.reset();
    };
  }

  const cancelBtn = document.getElementById("cancelarProgramado");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal.style.display = "none";
      form.reset();
    };
  }

  const closeConfirmBtn = confirmModal.querySelector(".close-confirmar");
  if (closeConfirmBtn) {
    closeConfirmBtn.onclick = () => {
      confirmModal.style.display = "none";
      ingresoPendienteConfirmar = null;
    };
  }

  const cancelConfirmBtn = document.getElementById("cancelarConfirmacion");
  if (cancelConfirmBtn) {
    cancelConfirmBtn.onclick = () => {
      confirmModal.style.display = "none";
      ingresoPendienteConfirmar = null;
    };
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      form.reset();
    }
    if (event.target === confirmModal) {
      confirmModal.style.display = "none";
      ingresoPendienteConfirmar = null;
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const monto = parseFloat(document.getElementById("montoProgramadoModal").value);
    const descripcion = document.getElementById("descripcionProgramadoModal").value.trim();
    const frecuencia = document.getElementById("frecuenciaProgramadoModal").value;
    const subcategoria = document.getElementById("subcategoriaProgramadoModal").value;
    const fechaInicio = document.getElementById("fechaInicioModal").value;
    const fechaFin = document.getElementById("fechaFinModal").value || null;

    if (!monto || monto <= 0) {
      alert("Por favor ingresa un monto válido mayor a 0");
      return;
    }
    if (!descripcion) {
      alert("Por favor ingresa una descripción");
      return;
    }
    if (!frecuencia) {
      alert("Por favor selecciona una frecuencia");
      return;
    }
    if (!subcategoria) {
      alert("Por favor selecciona una subcategoría");
      return;
    }
    if (!fechaInicio) {
      alert("Por favor selecciona una fecha de inicio");
      return;
    }

    const modo = form.dataset.modo || "agregar";
    let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];

    if (modo === "agregar") {
      const nuevo = {
        id: obtenerNuevoId("ultimoIdProgramadoIngreso"),
        monto: monto,
        descripcion: descripcion,
        frecuencia: frecuencia,
        subcategoria: subcategoria,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        activo: true,
        fechaCreacion: new Date().toISOString().slice(0, 10)
      };
      ingresos.push(nuevo);

    } else if (modo === "editar") {
      const id = parseInt(form.dataset.editId);
      const index = ingresos.findIndex(g => g.id === id);
      if (index !== -1) {
        ingresos[index] = {
          ...ingresos[index],
          monto: monto,
          descripcion: descripcion,
          frecuencia: frecuencia,
          subcategoria: subcategoria,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        };
      }
    }

    if (guardarEnLocalStorage("ingresosProgramados", ingresos)) {
      form.reset();
      form.removeAttribute('data-modo');
      form.removeAttribute('data-edit-id');
      modal.style.display = "none";
      setTimeout(() => {
        mostrarIngresosProgramados();
      }, 200);
      alert("Ingreso programado guardado correctamente");
    }
  });

  function mostrarIngresosProgramados() {
    if (!tablaIngresosProgramadosInicializada) {
      if (!inicializarTablaIngresosProgramados()) {
        console.error("No se pudo inicializar la tabla");
        return;
      }
    }

    let tabla;
    try {
      tabla = $('#tablaGastosProgramados').DataTable();
    } catch (error) {
      if (inicializarTablaIngresosProgramados()) {
        tabla = $('#tablaGastosProgramados').DataTable();
      } else {
        return;
      }
    }

    tabla.clear();

    const ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];

    if (ingresos.length === 0) {
      tabla.draw();
      return;
    }

    const pauseIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    `;

    const playIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    `;

    ingresos.forEach(g => {
      const botonToggle = g.activo 
        ? `<button class="boton-accion boton-pausar" onclick="toggleIngresoProgramado(${g.id})" title="Pausar ingreso">
             ${pauseIcon}
           </button>`
        : `<button class="boton-accion boton-activar" onclick="toggleIngresoProgramado(${g.id})" title="Activar ingreso">
             ${playIcon}
           </button>`;

      const botonEditar = `
        <button class="boton-accion boton-editar" onclick="editarIngresoProgramado(${g.id})" title="Editar ingreso">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;

      const botonEliminar = `
        <button class="boton-accion boton-eliminar" onclick="eliminarIngresoProgramado(${g.id})" title="Eliminar ingreso">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;

      const badgeEstado = g.activo 
        ? '<span class="badge-activo">Activo</span>'
        : '<span class="badge-inactivo">Inactivo</span>';

      tabla.row.add([
        g.id,
        `$${g.monto.toFixed(2)}`,
        g.descripcion,
        capitalizeFirst(g.frecuencia),
        g.subcategoria,
        formatearFecha(g.fechaInicio),
        g.fechaFin ? formatearFecha(g.fechaFin) : "-",
        badgeEstado,
        `<div class="acciones-ingreso">
           ${botonToggle}
           ${botonEditar}
           ${botonEliminar}
         </div>`
      ]);
    });

    try {
      tabla.draw();
    } catch (error) {
      console.error("Error al dibujar la tabla:", error);
    }
  }

  function verificarAlertas() {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().slice(0, 10);
    const ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
    const ingresosEjecutados = JSON.parse(localStorage.getItem("ingresosEjecutados")) || [];

    for (let g of ingresos) {
      if (!g.activo) continue;
      if (fechaHoy < g.fechaInicio) continue;
      if (g.fechaFin && fechaHoy > g.fechaFin) continue;

      const yaEjecutadoHoy = ingresosEjecutados.some(ej => 
        ej.ingresoId === g.id && ej.fecha === fechaHoy
      );
      if (yaEjecutadoHoy) continue;

      if (debeEjecutarseHoy(g, fechaHoy)) {
        mostrarConfirmacionIngreso(g);
        break;
      }
    }
  }

  function debeEjecutarseHoy(ingreso, fechaHoy) {
    const fechaInicio = new Date(ingreso.fechaInicio);
    const hoy = new Date(fechaHoy);
    const diffTime = hoy.getTime() - fechaInicio.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    switch (ingreso.frecuencia) {
      case 'diario':
        return diffDays >= 0;
      case 'semanal':
        return diffDays >= 0 && diffDays % 7 === 0;
      case 'mensual':
        return diffDays >= 0 && (diffDays % 30 === 0 || (diffDays > 28 && hoy.getDate() === fechaInicio.getDate()));
      case 'anual':
        return diffDays >= 0 && diffDays % 365 === 0;
      default:
        return false;
    }
  }

  function mostrarConfirmacionIngreso(ingreso) {
    ingresoPendienteConfirmar = ingreso;

    const montoConfirmar = document.getElementById("montoConfirmar");
    const descripcionConfirmar = document.getElementById("descripcionConfirmar");
    const subcategoriaConfirmar = document.getElementById("subcategoriaConfirmar");

    if (montoConfirmar) montoConfirmar.textContent = `$${ingreso.monto.toFixed(2)}`;
    if (descripcionConfirmar) descripcionConfirmar.textContent = ingreso.descripcion;
    if (subcategoriaConfirmar) subcategoriaConfirmar.textContent = ingreso.subcategoria;

    confirmModal.style.display = "block";
  }

  const confirmarBtn = document.getElementById("confirmarGastoFinal");
  if (confirmarBtn) {
    confirmarBtn.onclick = () => {
      if (!ingresoPendienteConfirmar) return;

      const nuevoIngreso = {
        id: obtenerNuevoId("ultimoIdIngreso"),
        concepto: ingresoPendienteConfirmar.descripcion,
        monto: ingresoPendienteConfirmar.monto,
        descripcion: "Ingreso programado ejecutado automáticamente",
        fecha: new Date().toLocaleDateString(),
        tipo: "Programado",
        subcategoria: ingresoPendienteConfirmar.subcategoria
      };

      const ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
      ingresos.push(nuevoIngreso);

      if (guardarEnLocalStorage("misIngresos", ingresos)) {
        const ingresosEjecutados = JSON.parse(localStorage.getItem("ingresosEjecutados")) || [];
        ingresosEjecutados.push({
          ingresoId: ingresoPendienteConfirmar.id,
          fecha: new Date().toISOString().slice(0, 10),
          ingresoRegistradoId: nuevoIngreso.id
        });

        if (guardarEnLocalStorage("ingresosEjecutados", ingresosEjecutados)) {
          ingresoPendienteConfirmar = null;
          confirmModal.style.display = "none";
          alert("¡Ingreso programado registrado correctamente!");
          if (typeof window.cargarConceptosIngresos === 'function') {
            window.cargarConceptosIngresos();
          }
        }
      }
    };
  }

  window.actualizarTablaIngresosProgramados = function() {
    mostrarIngresosProgramados();
  };

  function inicializar() {
    if (typeof $ === 'undefined') {
      setTimeout(inicializar, 100);
      return;
    }
    if (typeof $.fn.DataTable === 'undefined') {
      setTimeout(inicializar, 100);
      return;
    }
    setTimeout(() => {
      mostrarIngresosProgramados();
    }, 300);
    verificarAlertas();
    setInterval(verificarAlertas, 300000);
  }

  inicializar();
});

// Función para verificar el localStorage (solo para debug)
window.debugIngresosProgramados = function() {
  console.log("Ingresos programados en localStorage:",
      JSON.parse(localStorage.getItem("ingresosProgramados") || "[]"));
  console.log("Último ID programado:",
      localStorage.getItem("ultimoIdProgramado"));
};