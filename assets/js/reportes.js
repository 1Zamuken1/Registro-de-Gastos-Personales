document.addEventListener("DOMContentLoaded", function () {
  if (!verificarAutenticacion()) return;
  inicializarReportes();
});

// === FUNCIONES DE AUTENTICACIÓN ===
function verificarAutenticacion() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) {
    alert(" Debes iniciar sesión para acceder a esta página.");
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

// === FUNCIONES PARA OBTENER DATOS DE INGRESOS ===
function obtenerIngresosUsuario(usuarioId) {
  const clave = `ingresos_usuario_${usuarioId}`;
  return JSON.parse(localStorage.getItem(clave)) || [];
}

function obtenerDatosIngresosParaReporte() {
  const usuarioId = localStorage.getItem("usuarioActivoId");
  if (!usuarioId) {
    console.warn(" No hay usuario activo.");
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

// === FUNCIONES PARA OBTENER DATOS DE EGRESOS ===
function obtenerEgresosUsuario(usuarioId) {
  const clave = `misGastos`;
  const todos = JSON.parse(localStorage.getItem(clave)) || [];
  // Si tus egresos tienen usuarioId, filtra aquí:
  // return todos.filter(g => g.usuarioId === usuarioId);
  return todos;
}

function obtenerDatosEgresosParaReporte() {
  const usuarioId = localStorage.getItem("usuarioActivoId");
  if (!usuarioId) {
    console.warn("No hay usuario activo.");
    return [];
  }
  const egresos = obtenerEgresosUsuario(parseInt(usuarioId));
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

// === INICIALIZACIÓN DE REPORTES ===
function inicializarReportes() {
  crearTablaIngresos();
  crearTablaEgresos();
  cargarDatosEnTabla();
  cargarDatosEnTablaEgresos();
}

// === CREACIÓN DE LA TABLA DE INGRESOS ===
function crearTablaIngresos() {
  const contenedor = document.getElementById('reporte-ingresos');
  contenedor.innerHTML = '';

  const tablaHTML = `
    <div class="reporte-header">
      <h3>Reporte de Ingresos</h3>
      <div class="reporte-stats" id="stats-ingresos">
        <div class="stat-item">
          <span class="stat-label">Total Ingresos:</span>
          <span class="stat-value" id="total-ingresos">$0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Ingresos Fijos:</span>
          <span class="stat-value" id="ingresos-fijos">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Ingresos Variables:</span>
          <span class="stat-value" id="ingresos-variables">0</span>
        </div>
      </div>
    </div>

    <div class="tabla-container">
      <div class="tabla-scroll">
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

  contenedor.innerHTML = tablaHTML;
}

// === CREACIÓN DE LA TABLA DE EGRESOS ===
function crearTablaEgresos() {
  const contenedor = document.getElementById('reporte-egresos');
  contenedor.innerHTML = '';

  const tablaHTML = `
    <div class="reporte-header">
      <h3>Reporte de Egresos</h3>
      <div class="reporte-stats" id="stats-egresos">
        <div class="stat-item">
          <span class="stat-label">Total Egresos:</span>
          <span class="stat-value" id="total-egresos">$0</span>
        </div>
      </div>
    </div>
    <div class="tabla-container">
      <div class="tabla-scroll">
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
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  `;
  contenedor.innerHTML = tablaHTML;
}

// === CARGA DE DATOS EN LA TABLA DE INGRESOS ===
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

  $('#tabla-ingresos').DataTable({
    data: datosTabla,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    responsive: true,
    pageLength: 10,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
    order: [[0, 'desc']],
    columnDefs: [
      { targets: [2], className: 'text-right' },
      { targets: [5], className: 'text-center' }
    ],
    fixedHeader: true,
    scrollY: '300px',
    scrollX: true,
    footerCallback: function (row, data, start, end, display) {
      const api = this.api();
      const totalPagina = api
        .column(2, { page: 'current' })
        .data()
        .reduce((a, b) => {
          const valor = parseFloat(b.replace(/[$,]/g, '')) || 0;
          return a + valor;
        }, 0);

      $(api.column(2).footer()).html(
        `<strong>Total página: $${totalPagina.toLocaleString('es-CO')}</strong>`
      );
    },
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'copy',
        text: ' Copiar',
        className: 'btn-reporte btn-azul'
      },
      {
        extend: 'excel',
        text: 'Excel',
        className: 'btn-reporte btn-verde',
        title: 'Reporte_Ingresos_' + new Date().toISOString().split('T')[0]
      },
      {
        extend: 'pdf',
        text: 'PDF',
        className: 'btn-reporte btn-rojo',
        title: 'Reporte de Ingresos',
        orientation: 'landscape'
      },
      {
        text: 'Actualizar',
        className: 'btn-reporte btn-actualizar btn-morado',
        action: function () {
          actualizarReporte();
        }
      }
    ]
  });
}

// === CARGA DE DATOS EN LA TABLA DE EGRESOS ===
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

  $('#tabla-egresos').DataTable({
    data: datosTabla,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    responsive: true,
    pageLength: 10,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
    order: [[0, 'desc']],
    columnDefs: [
      { targets: [2], className: 'text-right' }
    ],
    fixedHeader: true,
    scrollY: '300px',
    scrollX: true,
    footerCallback: function (row, data, start, end, display) {
      const api = this.api();
      const totalPagina = api
        .column(2, { page: 'current' })
        .data()
        .reduce((a, b) => {
          const valor = parseFloat(b.replace(/[$,]/g, '')) || 0;
          return a + valor;
        }, 0);

      $(api.column(2).footer()).html(
        `<strong>Total página: $${totalPagina.toLocaleString('es-CO')}</strong>`
      );
    },
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'copy',
        text: ' Copiar',
        className: 'btn-reporte btn-azul'
      },
      {
        extend: 'excel',
        text: 'Excel',
        className: 'btn-reporte btn-verde',
        title: 'Reporte_Egresos_' + new Date().toISOString().split('T')[0]
      },
      {
        extend: 'pdf',
        text: 'PDF',
        className: 'btn-reporte btn-rojo',
        title: 'Reporte de Egresos',
        orientation: 'landscape'
      },
      {
        text: 'Actualizar',
        className: 'btn-reporte btn-actualizar btn-morado',
        action: function () {
          cargarDatosEnTablaEgresos();
        }
      }
    ]
  });
}

// === FUNCIONES DE UTILIDAD ===
function actualizarEstadisticas(datos) {
  const totalMonto = datos.reduce((sum, ingreso) => sum + Number(ingreso.monto), 0);
  const ingresosFijos = datos.filter(ingreso => ingreso.fijo === 'Sí').length;
  const ingresosVariables = datos.filter(ingreso => ingreso.fijo === 'No').length;

  document.getElementById('total-ingresos').textContent = `$${totalMonto.toLocaleString('es-CO')}`;
  document.getElementById('ingresos-fijos').textContent = ingresosFijos;
  document.getElementById('ingresos-variables').textContent = ingresosVariables;
}

function actualizarEstadisticasEgresos(datos) {
  const totalMonto = datos.reduce((sum, egreso) => sum + Number(egreso.monto), 0);
  document.getElementById('total-egresos').textContent = `$${totalMonto.toLocaleString('es-CO')}`;
}

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
  mostrarNotificacion('Reporte actualizado correctamente', 'success');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.textContent = mensaje;
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${tipo === 'success' ? '#2ecc71' : tipo === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  `;
  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// === DEBUG UTILITY ===
window.reportesDebug = {
  obtenerDatos: obtenerDatosIngresosParaReporte,
  actualizarReporte,
  mostrarEstadisticas: function () {
    const datos = obtenerDatosIngresosParaReporte();
    console.log('=== ESTADÍSTICAS DE INGRESOS ===');
    console.log('Total registros:', datos.length);
    console.log('Total monto:', datos.reduce((sum, ing) => sum + ing.monto, 0));
    console.log('Ingresos fijos:', datos.filter(ing => ing.fijo === 'Sí').length);
    console.log('Ingresos variables:', datos.filter(ing => ing.fijo === 'No').length);
    console.log('================================');
  }
};