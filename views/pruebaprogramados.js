// Este script maneja los ingresos programados: agregarlos, editarlos, eliminarlos, mostrarlos en DataTable y confirmar alertas

let tablaIngresosProgramadosInicializada = false;
let ingresoPendienteConfirmar = null;

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
window.toggleIngresoProgramado = function(id) {
  console.log("Cambiando estado del ingreso ID:", id);
  
  let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
  const index = ingresos.findIndex(i => i.id === id);
  
  if (index === -1) {
    console.error("Ingreso no encontrado con ID:", id);
    alert("Error: No se encontró el ingreso programado.");
    return;
  }
  
  const nuevoEstado = !ingresos[index].activo;
  ingresos[index].activo = nuevoEstado;
  
  if (guardarEnLocalStorage("ingresosProgramados", ingresos)) {
    // Actualizar la tabla
    if (typeof window.actualizarTablaIngresosProgramados === 'function') {
      window.actualizarTablaIngresosProgramados();
    }
    alert(`Ingreso programado ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
  }
};

window.editarIngresoProgramado = function(id) {
  console.log("Editando ingreso ID:", id);
  
  let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
  const ingreso = ingresos.find(i => i.id === id);
  
  if (!ingreso) {
    console.error("Ingreso no encontrado con ID:", id);
    alert("Error: No se encontró el ingreso programado.");
    return;
  }
  
  // Obtener elementos del DOM
  const form = document.getElementById("formIngresoProgramadoModal");
  const modal = document.getElementById("modalFormularioProgramado");
  
  if (!form || !modal) {
    console.error("No se encontraron elementos del formulario");
    return;
  }
  
  // Llenar el formulario con los datos del ingreso
  document.getElementById("montoProgramadoModal").value = ingreso.monto;
  document.getElementById("descripcionProgramadoModal").value = ingreso.descripcion;
  document.getElementById("frecuenciaProgramadoModal").value = ingreso.frecuencia;
  document.getElementById("fechaInicioModal").value = ingreso.fechaInicio;
  document.getElementById("fechaFinModal").value = ingreso.fechaFin || "";
  
  // Cargar subcategorías y seleccionar la actual
  cargarOpcionesSubcategoria();
  setTimeout(() => {
    document.getElementById("subcategoriaProgramadoModal").value = ingreso.subcategoria;
  }, 100);
  
  // Configurar el formulario para modo edición
  form.dataset.modo = "editar";
  form.dataset.editId = ingreso.id;
  
  console.log("Formulario configurado para edición. Modo:", form.dataset.modo, "ID:", form.dataset.editId);
  
  // Mostrar el modal
  modal.style.display = "block";
};

window.eliminarIngresoProgramado = function(id) {
  console.log("Eliminando ingreso ID:", id);
  
  if (!confirm("¿Estás seguro de que quieres eliminar este ingreso programado?")) {
    return;
  }
  
  let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
  const index = ingresos.findIndex(i => i.id === id);
  
  if (index === -1) {
    console.error("Ingreso no encontrado con ID:", id);
    alert("Error: No se encontró el ingreso programado.");
    return;
  }
  
  ingresos.splice(index, 1);
  
  if (guardarEnLocalStorage("ingresosProgramados", ingresos)) {
    // Actualizar la tabla
    if (typeof window.actualizarTablaIngresosProgramados === 'function') {
      window.actualizarTablaIngresosProgramados();
    }
    alert("Ingreso programado eliminado correctamente");
  }
};

// Función para inicializar la tabla (separada para mejor control)
function inicializarTablaIngresosProgramados() {
  console.log("Inicializando tabla de ingresos programados...");
  
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
  const tablaElement = document.getElementById('tablaIngresosProgramados');
  if (!tablaElement) {
    console.error("Elemento tabla no encontrado en el DOM");
    return false;
  }

  try {
    // Destruir tabla existente si ya está inicializada
    if (tablaIngresosProgramadosInicializada) {
      $('#tablaIngresosProgramados').DataTable().destroy();
    }
    
    $('#tablaIngresosProgramados').DataTable({
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
      order: [[0, 'desc']], // Ordenar por ID descendente
      pageLength: 10,
      destroy: true // Permite reinicializar la tabla
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
  
  // Obtener subcategorías del archivo conceptoIngresos.js
  if (window.subcategoriasDisponiblesGlobal && Array.isArray(window.subcategoriasDisponiblesGlobal)) {
    window.subcategoriasDisponiblesGlobal.forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      select.appendChild(opt);
    });
  } else {
    // Fallback: obtener desde localStorage si existe
    const conceptos = JSON.parse(localStorage.getItem("conceptosIngresos")) || [];
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
  const form = document.getElementById("formIngresoProgramadoModal");
  const modal = document.getElementById("modalFormularioProgramado");
  const confirmModal = document.getElementById("modalConfirmarIngreso");

  // Verificar que los elementos existen
  if (!form || !modal || !confirmModal) {
    console.error("Error: No se encontraron elementos necesarios en el DOM");
    return;
  }

  // Mostrar modal de agregar ingreso
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

  // Cerrar modales al hacer clic fuera
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
    let ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
    
    console.log("Modo:", modo); // Debug
    console.log("Ingresos existentes:", ingresos.length); // Debug

    if (modo === "agregar") {
      const nuevo = {
        id: obtenerNuevoId("ultimoIdIngresoProgramado"),
        monto: monto,
        descripcion: descripcion,
        frecuencia: frecuencia,
        subcategoria: subcategoria,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        activo: true,
        fechaCreacion: new Date().toISOString().slice(0, 10)
      };
      
      console.log("Nuevo ingreso programado:", nuevo); // Debug
      ingresos.push(nuevo);
      
    } else if (modo === "editar") {
      const id = parseInt(form.dataset.editId);
      const index = ingresos.findIndex(i => i.id === id);
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
        console.log("Ingreso editado:", ingresos[index]); // Debug
      }
    }

    // Guardar en localStorage con manejo de errores mejorado
    if (guardarEnLocalStorage("ingresosProgramados", ingresos)) {
      // Limpiar formulario y cerrar modal
      form.reset();
      form.removeAttribute('data-modo');
      form.removeAttribute('data-edit-id');
      modal.style.display = "none";
      
      // IMPORTANTE: Actualizar la tabla DESPUÉS de guardar
      setTimeout(() => {
        mostrarIngresosProgramados();
      }, 200);
      
      alert("Ingreso programado guardado correctamente");
    }
  });

  // Inicializar y mostrar ingresos en tabla
  function mostrarIngresosProgramados() {
    console.log("Ejecutando mostrarIngresosProgramados()"); // Debug
    
    // Primero inicializar la tabla si no está inicializada
    if (!tablaIngresosProgramadosInicializada) {
      if (!inicializarTablaIngresosProgramados()) {
        console.error("No se pudo inicializar la tabla");
        return;
      }
    }

    // Obtener la referencia de la tabla
    let tabla;
    try {
      tabla = $('#tablaIngresosProgramados').DataTable();
    } catch (error) {
      console.error("Error al obtener referencia de la tabla:", error);
      // Intentar reinicializar
      if (inicializarTablaIngresosProgramados()) {
        tabla = $('#tablaIngresosProgramados').DataTable();
      } else {
        return;
      }
    }

    // Limpiar tabla
    tabla.clear();

    const ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
    console.log("Ingresos recuperados del localStorage:", ingresos); // Debug
    
    if (ingresos.length === 0) {
      console.log("No hay ingresos programados para mostrar");
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

    // FUNCIÓN PARA LLENAR TABLA DE INGRESOS
    ingresos.forEach(i => {
      console.log("Agregando ingreso a la tabla:", i); // Debug
      
      try {
        // Crear botones con onclick inline (más confiable para DataTables)
        const botonToggle = i.activo 
          ? `<button class="boton-accion boton-pausar" onclick="toggleIngresoProgramado(${i.id})" title="Pausar ingreso">
               ${pauseIcon}
             </button>`
          : `<button class="boton-accion boton-activar" onclick="toggleIngresoProgramado(${i.id})" title="Activar ingreso">
               ${playIcon}
             </button>`;

        const botonEditar = `
          <button class="boton-accion boton-editar" onclick="editarIngresoProgramado(${i.id})" title="Editar ingreso">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `;

        const botonEliminar = `
          <button class="boton-accion boton-eliminar" onclick="eliminarIngresoProgramado(${i.id})" title="Eliminar ingreso">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        `;

        // Crear badge de estado
        const badgeEstado = i.activo 
          ? '<span class="badge-activo">Activo</span>'
          : '<span class="badge-inactivo">Inactivo</span>';

        // Agregar fila a la tabla
        tabla.row.add([
          i.id,
          `$${i.monto.toFixed(2)}`,
          i.descripcion,
          capitalizeFirst(i.frecuencia),
          i.subcategoria,
          formatearFecha(i.fechaInicio),
          i.fechaFin ? formatearFecha(i.fechaFin) : "-",
          badgeEstado,
          `<div class="acciones-ingreso">
             ${botonToggle}
             ${botonEditar}
             ${botonEliminar}
           </div>`
        ]);
        
      } catch (error) {
        console.error("Error al agregar fila a la tabla:", error, i);
      }
    });

    try {
      tabla.draw();
      console.log("Tabla actualizada con", ingresos.length, "ingresos"); // Debug
    } catch (error) {
      console.error("Error al dibujar la tabla:", error);
    }
  }

  // Verificar alertas de ingresos programados
  function verificarAlertas() {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().slice(0, 10);
    const ingresos = JSON.parse(localStorage.getItem("ingresosProgramados")) || [];
    const ingresosEjecutados = JSON.parse(localStorage.getItem("ingresosEjecutados")) || [];

    for (let i of ingresos) {
      if (!i.activo) continue;
      if (fechaHoy < i.fechaInicio) continue;
      if (i.fechaFin && fechaHoy > i.fechaFin) continue;

      // Verificar si ya se ejecutó hoy
      const yaEjecutadoHoy = ingresosEjecutados.some(ej => 
        ej.ingresoId === i.id && ej.fecha === fechaHoy
      );
      
      if (yaEjecutadoHoy) continue;

      // Calcular si debe ejecutarse según la frecuencia
      if (debeEjecutarseHoy(i, fechaHoy)) {
        mostrarConfirmacionIngreso(i);
        break; // Mostrar solo una alerta a la vez
      }
    }
  }

  // Verificar si un ingreso debe ejecutarse hoy
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

  // Mostrar modal de confirmación
  function mostrarConfirmacionIngreso(ingreso) {
    ingresoPendienteConfirmar = ingreso;
    
    // Llenar la información del ingreso
    const montoConfirmar = document.getElementById("montoConfirmar");
    const descripcionConfirmar = document.getElementById("descripcionConfirmar");
    const subcategoriaConfirmar = document.getElementById("subcategoriaConfirmar");
    
    if (montoConfirmar) montoConfirmar.textContent = `$${ingreso.monto.toFixed(2)}`;
    if (descripcionConfirmar) descripcionConfirmar.textContent = ingreso.descripcion;
    if (subcategoriaConfirmar) subcategoriaConfirmar.textContent = ingreso.subcategoria;
    
    confirmModal.style.display = "block";
  }

  // Confirmar ejecución del ingreso programado
  const confirmarBtn = document.getElementById("confirmarIngresoFinal");
  if (confirmarBtn) {
    confirmarBtn.onclick = () => {
      if (!ingresoPendienteConfirmar) return;

      // Crear el ingreso en la tabla principal
      const nuevoIngreso = {
        id: obtenerNuevoId("ultimoIdIngreso"),
        concepto: ingresoPendienteConfirmar.descripcion,
        monto: ingresoPendienteConfirmar.monto,
        descripcion: "Ingreso programado ejecutado automáticamente",
        fecha: new Date().toLocaleDateString(),
        tipo: "Programado",
        subcategoria: ingresoPendienteConfirmar.subcategoria
      };

      // Guardar el ingreso
      const ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
      ingresos.push(nuevoIngreso);
      
      if (guardarEnLocalStorage("misIngresos", ingresos)) {
        // Registrar que se ejecutó hoy
        const ingresosEjecutados = JSON.parse(localStorage.getItem("ingresosEjecutados")) || [];
        ingresosEjecutados.push({
          ingresoId: ingresoPendienteConfirmar.id,
          fecha: new Date().toISOString().slice(0, 10),
          ingresoRegistradoId: nuevoIngreso.id
        });
        
        if (guardarEnLocalStorage("ingresosEjecutados", ingresosEjecutados)) {
          // Limpiar y cerrar
          ingresoPendienteConfirmar = null;
          confirmModal.style.display = "none";
          
          alert("¡Ingreso programado registrado correctamente!");
          
          // Actualizar la vista de ingresos si está visible
          if (typeof window.cargarConceptosIngresos === 'function') {
            window.cargarConceptosIngresos();
          }
        }
      }
    };
  }

  // Función para forzar la actualización de la tabla (útil para debug)
  window.actualizarTablaIngresosProgramados = function() {
    mostrarIngresosProgramados();
  };

  // Inicializar todo cuando todas las dependencias estén listas
  function inicializar() {
    console.log("Iniciando aplicación de ingresos programados...");
    
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
      mostrarIngresosProgramados();
    }, 300);
    
    // Verificar alertas al cargar y cada 5 minutos
    verificarAlertas();
    setInterval(verificarAlertas, 300000); // 5 minutos
  }
  
  // Comenzar inicialización
  inicializar();
});

// Función para verificar el localStorage (solo para debug)
window.debugIngresosProgramados = function() {
    console.log("Ingresos programados en localStorage:", 
        JSON.parse(localStorage.getItem("ingresosProgramados") || "[]"));
    console.log("Último ID ingreso programado:", 
        localStorage.getItem("ultimoIdIngresoProgramado"));
};