// Este script maneja los gastos programados: agregarlos, editarlos, eliminarlos, mostrarlos en DataTable y confirmar alertas

let tablaGastosProgramadosInicializada = false;
let gastoPendienteConfirmar = null;

// Función auxiliar para guardar con manejo de errores - DEFINIDA UNA SOLA VEZ
function guardarEnLocalStorage(key, data) {
  try {
    // Verificar disponibilidad de localStorage
    if (typeof(Storage) === "undefined") {
      throw new Error("LocalStorage no está disponible en este navegador");
    }
    
    // Verificar espacio disponible (aproximado)
    const jsonString = JSON.stringify(data);
    if (jsonString.length > 5000000) { // ~5MB aproximado
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
  console.log(`Nuevo ID para ${key}:`, id); // Debug
  return id;
}

// Funciones auxiliares para formato
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES');
}

// FUNCIONES GLOBALES PARA LOS BOTONES - DEFINIDAS AQUÍ PARA EVITAR PROBLEMAS DE SCOPE
window.toggleGastoProgramado = function(id) {
  console.log("Cambiando estado del gasto ID:", id);
  
  let gastos = JSON.parse(localStorage.getItem("gastosProgramados")) || [];
  const index = gastos.findIndex(g => g.id === id);
  
  if (index === -1) {
    console.error("Gasto no encontrado con ID:", id);
    alert("Error: No se encontró el gasto programado.");
    return;
  }
  
  const nuevoEstado = !gastos[index].activo;
  gastos[index].activo = nuevoEstado;
  
  if (guardarEnLocalStorage("gastosProgramados", gastos)) {
    // Actualizar la tabla
    if (typeof window.actualizarTablaGastosProgramados === 'function') {
      window.actualizarTablaGastosProgramados();
    }
    alert(`Gasto programado ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
  }
};

window.editarGastoProgramado = function(id) {
  console.log("Editando gasto ID:", id);
  
  let gastos = JSON.parse(localStorage.getItem("gastosProgramados")) || [];
  const gasto = gastos.find(g => g.id === id);
  
  if (!gasto) {
    console.error("Gasto no encontrado con ID:", id);
    alert("Error: No se encontró el gasto programado.");
    return;
  }
  
  // Obtener elementos del DOM
  const form = document.getElementById("formGastoProgramadoModal");
  const modal = document.getElementById("modalFormularioProgramado");
  
  if (!form || !modal) {
    console.error("No se encontraron elementos del formulario");
    return;
  }
  
  // Llenar el formulario con los datos del gasto
  document.getElementById("montoProgramadoModal").value = gasto.monto;
  document.getElementById("descripcionProgramadoModal").value = gasto.descripcion;
  document.getElementById("frecuenciaProgramadoModal").value = gasto.frecuencia;
  document.getElementById("fechaInicioModal").value = gasto.fechaInicio;
  document.getElementById("fechaFinModal").value = gasto.fechaFin || "";
  
  // Cargar subcategorías y seleccionar la actual
  cargarOpcionesSubcategoria();
  setTimeout(() => {
    document.getElementById("subcategoriaProgramadoModal").value = gasto.subcategoria;
  }, 100);
  
  // Configurar el formulario para modo edición
  form.dataset.modo = "editar";
  form.dataset.editId = gasto.id;
  
  console.log("Formulario configurado para edición. Modo:", form.dataset.modo, "ID:", form.dataset.editId);
  
  // Mostrar el modal
  modal.style.display = "block";
};

window.eliminarGastoProgramado = function(id) {
  console.log("Eliminando gasto ID:", id);
  
  if (!confirm("¿Estás seguro de que quieres eliminar este gasto programado?")) {
    return;
  }
  
  let gastos = JSON.parse(localStorage.getItem("gastosProgramados")) || [];
  const index = gastos.findIndex(g => g.id === id);
  
  if (index === -1) {
    console.error("Gasto no encontrado con ID:", id);
    alert("Error: No se encontró el gasto programado.");
    return;
  }
  
  gastos.splice(index, 1);
  
  if (guardarEnLocalStorage("gastosProgramados", gastos)) {
    // Actualizar la tabla
    if (typeof window.actualizarTablaGastosProgramados === 'function') {
      window.actualizarTablaGastosProgramados();
    }
    alert("Gasto programado eliminado correctamente");
  }
};

// Función para inicializar la tabla (separada para mejor control)
function inicializarTablaGastosProgramados() {
  console.log("Inicializando tabla de gastos programados...");
  
  // Verificar si jQuery y DataTables están disponibles
  if (typeof $ === 'undefined') {
    console.error("jQuery no está disponible");
    return false;
  }
  
  if (typeof $.fn.DataTable === 'undefined') {
    console.error("DataTables no está disponible");
    return false;
  }
  
  // Verificar si la tabla existe en el DOM
  const tablaElement = document.getElementById('tablaGastosProgramados');
  if (!tablaElement) {
    console.error("Elemento tabla no encontrado en el DOM");
    return false;
  }

  try {
    // Destruir tabla existente si ya está inicializada
    if (tablaGastosProgramadosInicializada) {
      $('#tablaGastosProgramados').DataTable().destroy();
    }
    
    $('#tablaGastosProgramados').DataTable({
      language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "No se encontraron gastos programados",
        info: "Mostrando _START_ a _END_ de _TOTAL_ gastos programados",
        infoEmpty: "No hay gastos programados disponibles",
        infoFiltered: "(filtrado de _MAX_ gastos programados en total)",
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
      order: [[0, 'desc']], // Ordenar por ID descendente
      pageLength: 10,
      destroy: true // Permite reinicializar la tabla
    });
    
    tablaGastosProgramadosInicializada = true;
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
  
  // Obtener subcategorías del archivo conceptoEgresos.js
  if (window.subcategoriasDisponiblesGlobal && Array.isArray(window.subcategoriasDisponiblesGlobal)) {
    window.subcategoriasDisponiblesGlobal.forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
  } else {
    // Fallback: obtener desde localStorage si existe
    const conceptos = JSON.parse(localStorage.getItem("conceptosEgresos")) || [];
    conceptos.forEach(concepto => {
      const opt = document.createElement("option");
      opt.value = concepto.nombre;
      opt.textContent = concepto.nombre;
      select.appendChild(opt);
    });
  }
}

// Espera al DOM para comenzar
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formGastoProgramadoModal");
  const modal = document.getElementById("modalFormularioProgramado");
  const confirmModal = document.getElementById("modalConfirmarGasto");

  // Verificar que los elementos existen
  if (!form || !modal || !confirmModal) {
    console.error("Error: No se encontraron elementos necesarios en el DOM");
    return;
  }

  // Mostrar modal de agregar gasto
  const btnAgregar = document.getElementById("btnAgregarProgramado");
  if (btnAgregar) {
    btnAgregar.onclick = () => {
      modal.style.display = "block";
      cargarOpcionesSubcategoria();
      // Resetear el formulario para modo agregar
      form.reset();
      form.dataset.modo = "agregar";
    };
  }

  // Cerrar modales
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
      gastoPendienteConfirmar = null;
    };
  }
  
  const cancelConfirmBtn = document.getElementById("cancelarConfirmacion");
  if (cancelConfirmBtn) {
    cancelConfirmBtn.onclick = () => {
      confirmModal.style.display = "none";
      gastoPendienteConfirmar = null;
    };
  }

  // Cerrar modales al hacer clic fuera
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      form.reset();
    }
    if (event.target === confirmModal) {
      confirmModal.style.display = "none";
      gastoPendienteConfirmar = null;
    }
  };

  // Submit del formulario - Maneja tanto agregar como editar
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    console.log("Formulario enviado"); // Debug
    
    // Validar campos obligatorios
    const monto = parseFloat(document.getElementById("montoProgramadoModal").value);
    const descripcion = document.getElementById("descripcionProgramadoModal").value.trim();
    const frecuencia = document.getElementById("frecuenciaProgramadoModal").value;
    const subcategoria = document.getElementById("subcategoriaProgramadoModal").value;
    const fechaInicio = document.getElementById("fechaInicioModal").value;
    const fechaFin = document.getElementById("fechaFinModal").value || null;

    // Validaciones
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
    let gastos = JSON.parse(localStorage.getItem("gastosProgramados")) || [];
    
    console.log("Modo:", modo); // Debug
    console.log("Gastos existentes:", gastos.length); // Debug

    if (modo === "agregar") {
      const nuevo = {
        id: obtenerNuevoId("ultimoIdProgramado"),
        monto: monto,
        descripcion: descripcion,
        frecuencia: frecuencia,
        subcategoria: subcategoria,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        activo: true,
        fechaCreacion: new Date().toISOString().slice(0, 10)
      };
      
      console.log("Nuevo gasto programado:", nuevo); // Debug
      gastos.push(nuevo);
      
    } else if (modo === "editar") {
      const id = parseInt(form.dataset.editId);
      const index = gastos.findIndex(g => g.id === id);
      if (index !== -1) {
        gastos[index] = {
          ...gastos[index],
          monto: monto,
          descripcion: descripcion,
          frecuencia: frecuencia,
          subcategoria: subcategoria,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        };
        console.log("Gasto editado:", gastos[index]); // Debug
      }
    }

    // Guardar en localStorage con manejo de errores mejorado
    if (guardarEnLocalStorage("gastosProgramados", gastos)) {
      // Limpiar formulario y cerrar modal
      form.reset();
      form.removeAttribute('data-modo');
      form.removeAttribute('data-edit-id');
      modal.style.display = "none";
      
      // IMPORTANTE: Actualizar la tabla DESPUÉS de guardar
      setTimeout(() => {
        mostrarGastosProgramados();
      }, 200);
      
      alert("Gasto programado guardado correctamente");
    }
  });

  // Inicializar y mostrar gastos en tabla
  function mostrarGastosProgramados() {
    console.log("Ejecutando mostrarGastosProgramados()"); // Debug
    
    // Primero inicializar la tabla si no está inicializada
    if (!tablaGastosProgramadosInicializada) {
      if (!inicializarTablaGastosProgramados()) {
        console.error("No se pudo inicializar la tabla");
        return;
      }
    }

    // Obtener la referencia de la tabla
    let tabla;
    try {
      tabla = $('#tablaGastosProgramados').DataTable();
    } catch (error) {
      console.error("Error al obtener referencia de la tabla:", error);
      // Intentar reinicializar
      if (inicializarTablaGastosProgramados()) {
        tabla = $('#tablaGastosProgramados').DataTable();
      } else {
        return;
      }
    }

    // Limpiar tabla
    tabla.clear();

    const gastos = JSON.parse(localStorage.getItem("gastosProgramados")) || [];
    console.log("Gastos recuperados del localStorage:", gastos); // Debug
    
    if (gastos.length === 0) {
      console.log("No hay gastos programados para mostrar");
      tabla.draw();
      return;
    }

    // Definir los iconos ANTES del forEach
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

    // FUNCIÓN PARA LLENAR TABLA DE GASTOS
    gastos.forEach(g => {
      console.log("Agregando gasto a la tabla:", g); // Debug
      
      try {
        // Crear botones con onclick inline (más confiable para DataTables)
        const botonToggle = g.activo 
          ? `<button class="boton-accion boton-pausar" onclick="toggleGastoProgramado(${g.id})" title="Pausar gasto">
               ${pauseIcon}
             </button>`
          : `<button class="boton-accion boton-activar" onclick="toggleGastoProgramado(${g.id})" title="Activar gasto">
               ${playIcon}
             </button>`;

        const botonEditar = `
          <button class="boton-accion boton-editar" onclick="editarGastoProgramado(${g.id})" title="Editar gasto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `;

        const botonEliminar = `
          <button class="boton-accion boton-eliminar" onclick="eliminarGastoProgramado(${g.id})" title="Eliminar gasto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `;

        // Crear badge de estado
        const badgeEstado = g.activo 
          ? '<span class="badge-activo">Activo</span>'
          : '<span class="badge-inactivo">Inactivo</span>';

        // Agregar fila a la tabla
        tabla.row.add([
          g.id,
          `$${g.monto.toFixed(2)}`,
          g.descripcion,
          capitalizeFirst(g.frecuencia),
          g.subcategoria,
          formatearFecha(g.fechaInicio),
          g.fechaFin ? formatearFecha(g.fechaFin) : "-",
          badgeEstado,
          `<div class="acciones-gasto">
             ${botonToggle}
             ${botonEditar}
             ${botonEliminar}
           </div>`
        ]);
        
      } catch (error) {
        console.error("Error al agregar fila a la tabla:", error, g);
      }
    });

    try {
      tabla.draw();
      console.log("Tabla actualizada con", gastos.length, "gastos"); // Debug
    } catch (error) {
      console.error("Error al dibujar la tabla:", error);
    }
  }

  // Verificar alertas de gastos programados
  function verificarAlertas() {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().slice(0, 10);
    const gastos = JSON.parse(localStorage.getItem("gastosProgramados")) || [];
    const gastosEjecutados = JSON.parse(localStorage.getItem("gastosEjecutados")) || [];

    for (let g of gastos) {
      if (!g.activo) continue;
      if (fechaHoy < g.fechaInicio) continue;
      if (g.fechaFin && fechaHoy > g.fechaFin) continue;

      // Verificar si ya se ejecutó hoy
      const yaEjecutadoHoy = gastosEjecutados.some(ej => 
        ej.gastoId === g.id && ej.fecha === fechaHoy
      );
      
      if (yaEjecutadoHoy) continue;

      // Calcular si debe ejecutarse según la frecuencia
      if (debeEjecutarseHoy(g, fechaHoy)) {
        mostrarConfirmacionGasto(g);
        break; // Mostrar solo una alerta a la vez
      }
    }
  }

  // Verificar si un gasto debe ejecutarse hoy
  function debeEjecutarseHoy(gasto, fechaHoy) {
    const fechaInicio = new Date(gasto.fechaInicio);
    const hoy = new Date(fechaHoy);
    const diffTime = hoy.getTime() - fechaInicio.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    switch (gasto.frecuencia) {
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

  // Mostrar modal de confirmación
  function mostrarConfirmacionGasto(gasto) {
    gastoPendienteConfirmar = gasto;
    
    // Llenar la información del gasto
    const montoConfirmar = document.getElementById("montoConfirmar");
    const descripcionConfirmar = document.getElementById("descripcionConfirmar");
    const subcategoriaConfirmar = document.getElementById("subcategoriaConfirmar");
    
    if (montoConfirmar) montoConfirmar.textContent = `$${gasto.monto.toFixed(2)}`;
    if (descripcionConfirmar) descripcionConfirmar.textContent = gasto.descripcion;
    if (subcategoriaConfirmar) subcategoriaConfirmar.textContent = gasto.subcategoria;
    
    confirmModal.style.display = "block";
  }

  // Confirmar ejecución del gasto programado
  const confirmarBtn = document.getElementById("confirmarGastoFinal");
  if (confirmarBtn) {
    confirmarBtn.onclick = () => {
      if (!gastoPendienteConfirmar) return;

      // Crear el gasto en la tabla principal
      const nuevoGasto = {
        id: obtenerNuevoId("ultimoIdGasto"),
        concepto: gastoPendienteConfirmar.descripcion,
        monto: gastoPendienteConfirmar.monto,
        descripcion: "Gasto programado ejecutado automáticamente",
        fecha: new Date().toLocaleDateString(),
        tipo: "Programado",
        subcategoria: gastoPendienteConfirmar.subcategoria
      };

      // Guardar el gasto
      const gastos = JSON.parse(localStorage.getItem("misGastos")) || [];
      gastos.push(nuevoGasto);
      
      if (guardarEnLocalStorage("misGastos", gastos)) {
        // Registrar que se ejecutó hoy
        const gastosEjecutados = JSON.parse(localStorage.getItem("gastosEjecutados")) || [];
        gastosEjecutados.push({
          gastoId: gastoPendienteConfirmar.id,
          fecha: new Date().toISOString().slice(0, 10),
          gastoRegistradoId: nuevoGasto.id
        });
        
        if (guardarEnLocalStorage("gastosEjecutados", gastosEjecutados)) {
          // Limpiar y cerrar
          gastoPendienteConfirmar = null;
          confirmModal.style.display = "none";
          
          alert("¡Gasto programado registrado correctamente!");
          
          // Actualizar la vista de gastos si está visible
          if (typeof window.cargarConceptosEgresos === 'function') {
            window.cargarConceptosEgresos();
          }
        }
      }
    };
  }

  // Función para forzar la actualización de la tabla (útil para debug)
  window.actualizarTablaGastosProgramados = function() {
    mostrarGastosProgramados();
  };

  // Inicializar todo cuando todas las dependencias estén listas
  function inicializar() {
    console.log("Iniciando aplicación de gastos programados...");
    
    // Verificar dependencias
    if (typeof $ === 'undefined') {
      console.log("Esperando jQuery...");
      setTimeout(inicializar, 100);
      return;
    }
    
    if (typeof $.fn.DataTable === 'undefined') {
      console.log("Esperando DataTables...");
      setTimeout(inicializar, 100);
      return;
    }
    
    // Inicializar tabla y mostrar datos
    setTimeout(() => {
      mostrarGastosProgramados();
    }, 300);
    
    // Verificar alertas al cargar y cada 5 minutos
    verificarAlertas();
    setInterval(verificarAlertas, 300000); // 5 minutos
  }
  
  // Comenzar inicialización
  inicializar();
});

// Función para verificar el localStorage (solo para debug)
window.debugGastosProgramados = function() {
    console.log("Gastos programados en localStorage:", 
        JSON.parse(localStorage.getItem("gastosProgramados") || "[]"));
    console.log("Último ID programado:", 
        localStorage.getItem("ultimoIdProgramado"));
};