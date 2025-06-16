// === SISTEMA DE REPORTES - INTEGRACIÓN CON INGRESOS ===

document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticación
  if (!verificarAutenticacion()) return;
  
  // Inicializar reportes
  inicializarReportes();
});

// === FUNCIONES DE AUTENTICACIÓN ===
function verificarAutenticacion() {
  const usuarioActivoId = sessionStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) {
    alert(" Debes iniciar sesión para acceder a esta página.");
    window.location.href = "../index.html";
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

// === FUNCIONES PARA OBTENER DATOS DE INGRESOS ===
function obtenerIngresosUsuario(usuarioId) {
  const clave = `ingresos_usuario_${usuarioId}`;
  return JSON.parse(sessionStorage.getItem(clave)) || [];
}

function obtenerDatosIngresosParaReporte() {
  const usuarioId = sessionStorage.getItem("usuarioActivoId");
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

// === INICIALIZACIÓN DE REPORTES ===
function inicializarReportes() {
  crearTablaIngresos();
  cargarDatosEnTabla();
}

// === CREACIÓN DE LA TABLA DE INGRESOS ===
function crearTablaIngresos() {
  const contenedor = document.getElementById('reporte-ingresos');
  
  // Limpiar contenedor
  contenedor.innerHTML = '';
  
  // Crear estructura de la tabla
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
        <tbody>
        </tbody>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Fecha Creación</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
  
  contenedor.innerHTML = tablaHTML;
}

// === CARGA DE DATOS EN LA TABLA ===
function cargarDatosEnTabla() {
  const datos = obtenerDatosIngresosParaReporte();
  
  // Actualizar estadísticas
  actualizarEstadisticas(datos);
  
  // Preparar datos para DataTables
  const datosTabla = datos.map(ingreso => [
    ingreso.id,
    ingreso.concepto,
    `$${ingreso.monto.toLocaleString('es-CO')}`,
    ingreso.descripcion,
    formatearFecha(ingreso.fecha),
    ingreso.fijo === 'Sí' ? 
      '<span class="badge badge-fijo">Fijo</span>' : 
      '<span class="badge badge-variable">Variable</span>',
    formatearFechaCompleta(ingreso.fechaCreacion)
  ]);
  
  // Inicializar DataTables
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
    order: [[0, 'desc']], // Ordenar por ID descendente
    columnDefs: [
      {
        targets: [2], // Columna de monto
        className: 'text-right'
      },
      {
        targets: [5], // Columna de tipo
        className: 'text-center'
      }
    ],
    footerCallback: function (row, data, start, end, display) {
      const api = this.api();
      
      // Calcular total de la página actual
      const totalPagina = api
        .column(2, { page: 'current' })
        .data()
        .reduce((a, b) => {
          const valor = parseFloat(b.replace(/[$,]/g, '')) || 0;
          return a + valor;
        }, 0);
      
      // Actualizar footer
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
        action: function (e, dt, node, config) {
          actualizarReporte();
        }
      }
    ]
  });
}

// === FUNCIONES DE UTILIDAD ===
function actualizarEstadisticas(datos) {
  const totalMonto = datos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
  const ingresosFijos = datos.filter(ingreso => ingreso.fijo === 'Sí').length;
  const ingresosVariables = datos.filter(ingreso => ingreso.fijo === 'No').length;
  
  document.getElementById('total-ingresos').textContent = `$${totalMonto.toLocaleString('es-CO')}`;
  document.getElementById('ingresos-fijos').textContent = ingresosFijos;
  document.getElementById('ingresos-variables').textContent = ingresosVariables;
}

function formatearFecha(fecha) {
  if (!fecha) return '-';
  
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      // Si la fecha no es válida, intentar con el formato que viene del input
      return fecha;
    }
    return date.toLocaleDateString('es-CO');
  } catch (error) {
    return fecha;
  }
}

function formatearFechaCompleta(fechaISO) {
  if (!fechaISO) return '-';
  
  try {
    const date = new Date(fechaISO);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('es-CO') + ' ' + 
           date.toLocaleTimeString('es-CO', { 
             hour: '2-digit', 
             minute: '2-digit' 
           });
  } catch (error) {
    return '-';
  }
}

function actualizarReporte() {
  console.log('Actualizando reporte de ingresos...');
  cargarDatosEnTabla();
  
  // Mostrar mensaje de éxito
  mostrarNotificacion('Reporte actualizado correctamente', 'success');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear notificación temporal
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
  
  // Remover después de 3 segundos
  setTimeout(() => {
    if (notificacion.parentNode) {
      notificacion.parentNode.removeChild(notificacion);
    }
  }, 3000);
}

// === FUNCIONES PÚBLICAS PARA DEBUGGING ===
window.reportesDebug = {
  obtenerDatos: obtenerDatosIngresosParaReporte,
  actualizarReporte: actualizarReporte,
  mostrarEstadisticas: function() {
    const datos = obtenerDatosIngresosParaReporte();
    console.log('=== ESTADÍSTICAS DE INGRESOS ===');
    console.log('Total registros:', datos.length);
    console.log('Total monto:', datos.reduce((sum, ing) => sum + ing.monto, 0));
    console.log('Ingresos fijos:', datos.filter(ing => ing.fijo === 'Sí').length);
    console.log('Ingresos variables:', datos.filter(ing => ing.fijo === 'No').length);
    console.log('================================');
  }
};