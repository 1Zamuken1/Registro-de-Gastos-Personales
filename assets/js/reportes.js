document.addEventListener("DOMContentLoaded", function () {
  if (!verificarAutenticacion()) return;
  
  // Inicializar reportes
  inicializarReportes();
});

// === FUNCIONES DE AUTENTICACIÓN ===
function verificarAutenticacion() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) {
    alert("Debes iniciar sesión para acceder a esta página.");
    window.location.href = "../../views/Iniciosesion.html";
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

// === FUNCIONES PARA OBTENER DATOS ===
function obtenerIngresosUsuario(usuarioId) {
  const clave = `ingresos_usuario_${usuarioId}`;
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function obtenerDatosIngresosParaReporte() {
  const usuarioId = localStorage.getItem("usuarioActivoId");
  if (!usuarioId) {
    console.warn("No hay usuario activo.");
    return [];
  }

  const ingresos = obtenerIngresosUsuario(parseInt(usuarioId));
  return ingresos.map(ingreso => ({
    id: ingreso.id,
    concepto: ingreso.concepto,
    monto: ingreso.monto,
    descripcion: ingreso.descripcion || '-',
    fecha: ingreso.fecha,
    fijo: ingreso.fijo,
    fechaCreacion: ingreso.fechaCreacion
  }));
}

// Obtener egresos sin filtrar por usuario
function obtenerEgresosUsuario() {
  return JSON.parse(localStorage.getItem("misGastos")) || [];
}

function obtenerDatosEgresosParaReporte() {
  const egresos = obtenerEgresosUsuario();
  return egresos.map(egreso => ({
    id: egreso.id,
    concepto: egreso.concepto,
    monto: egreso.monto,
    descripcion: egreso.descripcion || '-',
    fecha: egreso.fecha,
    tipo: egreso.tipo || '-',
    subcategoria: egreso.subcategoria || '-'
  }));
}

function obtenerAhorrosUsuario(usuarioId) {
  const clave = `ahorros_usuario_${usuarioId}`;
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function obtenerDatosAhorrosParaReporte() {
  const usuarioId = localStorage.getItem("usuarioActivoId");
  if (!usuarioId) {
    console.warn("No hay usuario activo.");
    return [];
  }
  const ahorros = obtenerAhorrosUsuario(parseInt(usuarioId));
  return ahorros.map((ahorro, index) => ({
    id: index + 1,
    concepto: ahorro.concepto || '-',
    meta: ahorro.meta || 0,
    totalAcumulado: (ahorro.cuota || 0) * (ahorro.numcuota || 0),
    frecuencia: ahorro.frecuencia || '-',
    inicio: ahorro.inicio || '-',
    fin: ahorro.fin || '-'
  }));
}

// === INICIALIZACIÓN DE REPORTES ===
function inicializarReportes() {
  // Crear contenedores de reportes
  crearContenedoresReportes();
  
  // Cargar datos
  cargarDatosEnTabla();
  cargarDatosEnTablaEgresos();
  cargarDatosEnTablaAhorros();
  
  // Event listeners para botones de actualización
  document.getElementById('refresh-incomes')?.addEventListener('click', actualizarReporte);
  document.getElementById('refresh-expenses')?.addEventListener('click', cargarDatosEnTablaEgresos);
  document.getElementById('refresh-savings')?.addEventListener('click', cargarDatosEnTablaAhorros);
}

// === CREACIÓN DE CONTENEDORES DE REPORTES ===
function crearContenedoresReportes() {
  // Crear estructura para reporte de ingresos
  const contenedorIngresos = document.getElementById('contenedor-reporte-ingresos');
  contenedorIngresos.innerHTML = `
    <div class="report-card">
      <div class="report-header">
        <div class="report-title">
          <i class="fas fa-money-bill-wave"></i>
          <h3>Reporte de Ingresos</h3>
        </div>
        <div class="report-actions">
          <button class="report-btn" id="refresh-incomes">
            <i class="fas fa-sync-alt"></i> Actualizar
          </button>
        </div>
      </div>
      <div class="table-container">
        <div class="report-stats" id="stats-ingresos">
          <div class="dt-buttons" id="buttons-ingresos"></div>
        </div>
        <table id="tabla-ingresos" class="display" style="width:100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Fecha Creación</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  // Crear estructura para reporte de egresos
  const contenedorEgresos = document.getElementById('contenedor-reporte-egresos');
  contenedorEgresos.innerHTML = `
    <div class="report-card">
      <div class="report-header">
        <div class="report-title">
          <i class="fas fa-shopping-cart"></i>
          <h3>Reporte de Egresos</h3>
        </div>
        <div class="report-actions">
          <button class="report-btn" id="refresh-expenses">
            <i class="fas fa-sync-alt"></i> Actualizar
          </button>
        </div>
      </div>
      <div class="table-container">
        <div class="report-stats" id="stats-egresos">
          <div class="dt-buttons" id="buttons-egresos"></div>
        </div>
        <table id="tabla-egresos" class="display" style="width:100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Subcategoría</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  // Crear estructura para reporte de ahorros
  const contenedorAhorros = document.getElementById('contenedor-reporte-ahorros');
  contenedorAhorros.innerHTML = `
    <div class="report-card">
      <div class="report-header">
        <div class="report-title">
          <i class="fas fa-piggy-bank"></i>
          <h3>Reporte de Ahorros</h3>
        </div>
        <div class="report-actions">
          <button class="report-btn" id="refresh-savings">
            <i class="fas fa-sync-alt"></i> Actualizar
          </button>
        </div>
      </div>
      <div class="table-container">
        <div class="report-stats" id="stats-ahorros">
          <div class="dt-buttons" id="buttons-ahorros"></div>
        </div>
        <table id="tabla-ahorros" class="display" style="width:100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Concepto</th>
              <th>Meta</th>
              <th>Total Acumulado</th>
              <th>Frecuencia</th>
              <th>Inicio</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;
}

// === CARGA DE DATOS EN TABLAS ===
function cargarDatosEnTabla() {
  const datos = obtenerDatosIngresosParaReporte();
  actualizarEstadisticas(datos);

  const datosTabla = datos.map(ingreso => [
    ingreso.id,
    ingreso.concepto,
    `$${Number(ingreso.monto).toLocaleString('es-CO')}`,
    ingreso.descripcion,
    formatearFecha(ingreso.fecha),
    ingreso.fijo === 'Sí'
      ? '<span class="badge badge-fijo">Fijo</span>'
      : '<span class="badge badge-variable">Variable</span>',
    formatearFechaCompleta(ingreso.fechaCreacion)
  ]);

  if ($.fn.DataTable.isDataTable('#tabla-ingresos')) {
    $('#tabla-ingresos').DataTable().destroy();
  }

  const table = $('#tabla-ingresos').DataTable({
    data: datosTabla,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    responsive: true,
    pageLength: 5,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
    order: [[0, 'desc']],
    columnDefs: [
      { targets: [2], className: 'text-right' },
      { targets: [5], className: 'text-center' }
    ],
    scrollY: '400px',
    scrollCollapse: true,
    fixedHeader: true,
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'copy',
        text: '<i class="fas fa-copy"></i> Copiar',
        className: 'dt-button'
      },
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'dt-button',
        title: 'Reporte_Ingresos_' + new Date().toISOString().split('T')[0]
      },
      {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'dt-button',
        title: 'Reporte de Ingresos',
        orientation: 'landscape'
      },
      {
        text: '<i class="fas fa-sync-alt"></i> Actualizar',
        className: 'dt-button btn-actualizar',
        action: function () {
          actualizarReporte();
        }
      }
    ]
  });

  // Mover botones al contenedor correspondiente
  table.buttons().container().appendTo('#buttons-ingresos');
}

function cargarDatosEnTablaEgresos() {
  const datos = obtenerDatosEgresosParaReporte();
  actualizarEstadisticasEgresos(datos);

  const datosTabla = datos.map(egreso => [
    egreso.id,
    egreso.concepto,
    `$${Number(egreso.monto).toLocaleString('es-CO')}`,
    egreso.descripcion,
    formatearFecha(egreso.fecha),
    egreso.tipo,
    egreso.subcategoria
  ]);

  if ($.fn.DataTable.isDataTable('#tabla-egresos')) {
    $('#tabla-egresos').DataTable().destroy();
  }

  const table = $('#tabla-egresos').DataTable({
    data: datosTabla,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    responsive: true,
    pageLength: 5,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
    order: [[0, 'desc']],
    columnDefs: [
      { targets: [2], className: 'text-right' }
    ],
    scrollY: '400px',
    scrollCollapse: true,
    fixedHeader: true,
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'copy',
        text: '<i class="fas fa-copy"></i> Copiar',
        className: 'dt-button'
      },
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'dt-button',
        title: 'Reporte_Egresos_' + new Date().toISOString().split('T')[0]
      },
      {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'dt-button',
        title: 'Reporte de Egresos',
        orientation: 'landscape'
      },
      {
        text: '<i class="fas fa-sync-alt"></i> Actualizar',
        className: 'dt-button btn-actualizar',
        action: function () {
          cargarDatosEnTablaEgresos();
        }
      }
    ]
  });

  // Mover botones al contenedor correspondiente
  table.buttons().container().appendTo('#buttons-egresos');
}

function cargarDatosEnTablaAhorros() {
  const datos = obtenerDatosAhorrosParaReporte();
  actualizarEstadisticasAhorros(datos);

  const datosTabla = datos.map(a => [
    a.id,
    a.concepto,
    `$${Number(a.meta).toLocaleString('es-CO')}`,
    `$${Number(a.totalAcumulado).toLocaleString('es-CO')}`,
    a.frecuencia,
    formatearFecha(a.inicio),
    formatearFecha(a.fin)
  ]);

  if ($.fn.DataTable.isDataTable('#tabla-ahorros')) {
    $('#tabla-ahorros').DataTable().destroy();
  }

  const table = $('#tabla-ahorros').DataTable({
    data: datosTabla,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    responsive: true,
    pageLength: 5,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
    order: [[0, 'asc']],
    columnDefs: [
      { targets: [2, 3], className: 'text-right' }
    ],
    scrollY: '400px',
    scrollCollapse: true,
    fixedHeader: true,
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'copy',
        text: '<i class="fas fa-copy"></i> Copiar',
        className: 'dt-button'
      },
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel"></i> Excel',
        className: 'dt-button',
        title: 'Reporte_Ahorros_' + new Date().toISOString().split('T')[0]
      },
      {
        extend: 'pdf',
        text: '<i class="fas fa-file-pdf"></i> PDF',
        className: 'dt-button',
        title: 'Reporte de Ahorros',
        orientation: 'landscape'
      },
      {
        text: '<i class="fas fa-sync-alt"></i> Actualizar',
        className: 'dt-button btn-actualizar',
        action: function () {
          cargarDatosEnTablaAhorros();
        }
      }
    ]
  });

  // Mover botones al contenedor correspondiente
  table.buttons().container().appendTo('#buttons-ahorros');
}

// === ACTUALIZACIÓN DE ESTADÍSTICAS ===
function actualizarEstadisticas(datos) {
  const totalMonto = datos.reduce((sum, ingreso) => sum + Number(ingreso.monto), 0);
  document.getElementById('total-income').textContent = `$${totalMonto.toLocaleString('es-CO')}`;
}

function actualizarEstadisticasEgresos(datos) {
  const totalMonto = datos.reduce((sum, egreso) => sum + Number(egreso.monto), 0);
  document.getElementById('total-expense').textContent = `$${totalMonto.toLocaleString('es-CO')}`;
}

function actualizarEstadisticasAhorros(datos) {
  const totalAcumulado = datos.reduce((sum, ahorro) => sum + ahorro.totalAcumulado, 0);
  document.getElementById('total-savings').textContent = `$${totalAcumulado.toLocaleString('es-CO')}`;
}

// === FUNCIONES DE UTILIDAD ===
function formatearFecha(fecha) {
  if (!fecha) return '-';
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    return date.toLocaleDateString('es-CO');
  } catch {
    return fecha;
  }
}

function formatearFechaCompleta(fechaISO) {
  if (!fechaISO) return '-';
  try {
    const date = new Date(fechaISO);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('es-CO') + ' ' + date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
}

function actualizarReporte() {
  cargarDatosEnTabla();
  mostrarNotificacion('Reporte de ingresos actualizado correctamente', 'success');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  notificacion.className = `notification ${tipo}`;
  notificacion.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check' : 'info'}-circle"></i> ${mensaje}`;
  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.style.opacity = '0';
    setTimeout(() => {
      notificacion.remove();
    }, 500);
  }, 3000);
}