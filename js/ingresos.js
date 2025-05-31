document.addEventListener('DOMContentLoaded', function() {
    // Asignar eventos a todas las tarjetas existentes (excepto la de agregar)
    document.querySelectorAll('.tarjeta-ingreso:not(.tarjeta-agregar)').forEach(asignarEventosTarjeta);

    // Evento para cerrar modales
    document.getElementById('cerrar-modal').onclick = ocultarModalDetalle;
    document.getElementById('cerrar-modal-editar').onclick = ocultarModalEditar;
    document.getElementById('cerrar-modal-eliminar').onclick = cerrarModalEliminar;

    // Cerrar modal al hacer click fuera del contenido
    document.getElementById('modal-ingreso').onclick = function(e) {
        if (e.target === this) ocultarModalDetalle();
    };
    document.getElementById('modal-editar-ingreso').onclick = function(e) {
        if (e.target === this) ocultarModalEditar();
    };
    document.getElementById('modal-eliminar-ingreso').onclick = function(e) {
        if (e.target === this) cerrarModalEliminar();
    };

    // Botones de eliminar confirmación/cancelación
    document.getElementById('btn-confirmar-eliminar').onclick = function() {
        if (window.tarjetaAEliminar) {
            window.tarjetaAEliminar.remove();
            window.tarjetaAEliminar = null;
        }
        cerrarModalEliminar();
    };
    document.getElementById('btn-cancelar-eliminar').onclick = cerrarModalEliminar;

    // Evento para la tarjeta de agregar
    document.getElementById('tarjeta-agregar-ingreso').addEventListener('click', function() {
        document.getElementById('editar-concepto').value = '';
        document.getElementById('editar-monto').value = '';
        document.getElementById('editar-descripcion').value = '';
        document.getElementById('editar-fecha').value = '';
        document.getElementById('editar-fijo').value = 'Sí';
        document.getElementById('form-editar-ingreso')._tarjeta = null;
        document.getElementById('modal-titulo-editar').textContent = 'Agregar Ingreso';
        mostrarModalEditar();
    });
});

// =======================
// COMPONENTE: VER DETALLE DE INGRESO
// =======================

// Mostrar modal de detalle
function mostrarModalDetalle() {
    const modal = document.getElementById('modal-ingreso');
    modal.classList.remove('modal-ingreso-oculto');
    modal.style.display = 'flex';
}

// Ocultar modal de detalle
function ocultarModalDetalle() {
    const modal = document.getElementById('modal-ingreso');
    modal.classList.add('modal-ingreso-oculto');
    modal.style.display = '';
}

// Asignar evento para ver detalle en cada tarjeta
function asignarEventosTarjeta(tarjeta) {
    // Visualizar detalles
    tarjeta.querySelector('.cabecera-tarjeta').onclick = function(e) {
        if (
            e.target.classList.contains('btn-editar') ||
            e.target.classList.contains('btn-eliminar')
        ) return;
        document.getElementById('modal-concepto').textContent = tarjeta.querySelector('.concepto').textContent;
        document.getElementById('modal-monto').textContent = tarjeta.querySelector('.monto').textContent;
        const detalle = tarjeta.querySelector('.detalle-tarjeta');
        document.getElementById('modal-descripcion').textContent = detalle.querySelector('div:nth-child(3)').textContent.replace('Descripción:', '').trim();
        document.getElementById('modal-fecha').textContent = detalle.querySelector('div:nth-child(4)').textContent.replace('Fecha:', '').trim();
        document.getElementById('modal-fijo').textContent = detalle.querySelector('div:nth-child(5)').textContent.replace('Fijo:', '').trim();
        mostrarModalDetalle();
    };

    // Editar
    tarjeta.querySelector('.btn-editar').onclick = function(e) {
        e.stopPropagation();
        const detalle = tarjeta.querySelector('.detalle-tarjeta');
        document.getElementById('editar-concepto').value = tarjeta.querySelector('.concepto').textContent;
        document.getElementById('editar-monto').value = tarjeta.querySelector('.monto').textContent.replace(/[^0-9]/g, '');
        document.getElementById('editar-descripcion').value = detalle.querySelector('div:nth-child(3)').textContent.replace('Descripción:', '').trim();
        document.getElementById('editar-fecha').value = detalle.querySelector('div:nth-child(4)').textContent.replace('Fecha:', '').trim();
        document.getElementById('editar-fijo').value = detalle.querySelector('div:nth-child(5)').textContent.replace('Fijo:', '').trim();
        document.getElementById('form-editar-ingreso')._tarjeta = tarjeta;
        document.getElementById('modal-titulo-editar').textContent = 'Editar Ingreso';
        mostrarModalEditar();
    };

    // Eliminar
    tarjeta.querySelector('.btn-eliminar').onclick = function(e) {
        e.stopPropagation();
        window.tarjetaAEliminar = tarjeta;
        document.getElementById('nombre-ingreso-eliminar').textContent = `"${tarjeta.querySelector('.concepto').textContent}"`;
        document.getElementById('modal-eliminar-ingreso').classList.remove('modal-ingreso-oculto');
        document.getElementById('modal-eliminar-ingreso').style.display = 'flex';
    };
}

// =======================
// COMPONENTE: EDITAR/AGREGAR INGRESO
// =======================

// Mostrar modal de editar/agregar
function mostrarModalEditar() {
    const modal = document.getElementById('modal-editar-ingreso');
    modal.classList.remove('modal-ingreso-oculto');
    modal.style.display = 'flex';
}

// Ocultar modal de editar/agregar
function ocultarModalEditar() {
    const modal = document.getElementById('modal-editar-ingreso');
    modal.classList.add('modal-ingreso-oculto');
    modal.style.display = '';
}

// Evento para abrir modal de agregar ingreso
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tarjeta-agregar-ingreso').addEventListener('click', function() {
        document.getElementById('editar-concepto').value = '';
        document.getElementById('editar-monto').value = '';
        document.getElementById('editar-descripcion').value = '';
        document.getElementById('editar-fecha').value = '';
        document.getElementById('editar-fijo').value = 'Sí';
        document.getElementById('form-editar-ingreso')._tarjeta = null;
        document.getElementById('modal-titulo-editar').textContent = 'Agregar Ingreso';
        mostrarModalEditar();
    });
});

// Guardar cambios o agregar nuevo ingreso
document.getElementById('form-editar-ingreso').addEventListener('submit', function(e) {
    e.preventDefault();
    const tarjeta = e.target._tarjeta;
    const concepto = document.getElementById('editar-concepto').value;
    const monto = document.getElementById('editar-monto').value;
    const descripcion = document.getElementById('editar-descripcion').value;
    const fecha = document.getElementById('editar-fecha').value;
    const fijo = document.getElementById('editar-fijo').value;

    if (!tarjeta) {
        // Crear nueva tarjeta
        const nueva = document.createElement('div');
        nueva.className = 'tarjeta-ingreso';
        nueva.innerHTML = `
            <div class="cabecera-tarjeta">
                <div>
                    <div class="concepto">${concepto}</div>
                    <div class="monto">$${parseInt(monto).toLocaleString()}</div>
                </div>
                <div class="acciones">
                    <button class="btn-editar" title="Editar">
                        <img src="src/icons/update.svg" alt="Editar" width="20" height="20" />
                    </button>
                    <button class="btn-eliminar" title="Eliminar">
                        <img src="src/icons/delete.svg" alt="Eliminar" width="20" height="20" />
                    </button>
                </div>
            </div>
            <div class="detalle-tarjeta">
                <div><strong>Concepto:</strong> ${concepto}</div>
                <div><strong>Monto:</strong> $${parseInt(monto).toLocaleString()}</div>
                <div><strong>Descripción:</strong> ${descripcion || '-'}</div>
                <div><strong>Fecha:</strong> ${fecha}</div>
                <div><strong>Fijo:</strong> ${fijo}</div>
            </div>
        `;
        // Insertar después de la tarjeta de agregar
        const grid = document.querySelector('.tarjetas-ingresos');
        grid.insertBefore(nueva, grid.children[1]);
        asignarEventosTarjeta(nueva);
    } else {
        // Editar tarjeta existente
        tarjeta.querySelector('.concepto').textContent = concepto;
        tarjeta.querySelector('.monto').textContent = `$${parseInt(monto).toLocaleString()}`;
        const detalle = tarjeta.querySelector('.detalle-tarjeta');
        detalle.innerHTML = `
            <div><strong>Concepto:</strong> ${concepto}</div>
            <div><strong>Monto:</strong> $${parseInt(monto).toLocaleString()}</div>
            <div><strong>Descripción:</strong> ${descripcion || '-'}</div>
            <div><strong>Fecha:</strong> ${fecha}</div>
            <div><strong>Fijo:</strong> ${fijo}</div>
        `;
    }
    document.getElementById('modal-titulo-editar').textContent = 'Editar Ingreso';
    ocultarModalEditar();
});

// =======================
// COMPONENTE: ELIMINAR INGRESO
// =======================

// Mostrar modal de eliminar (ya está en asignarEventosTarjeta)

// Ocultar modal de eliminar
function cerrarModalEliminar() {
    document.getElementById('modal-eliminar-ingreso').classList.add('modal-ingreso-oculto');
    document.getElementById('modal-eliminar-ingreso').style.display = '';
    window.tarjetaAEliminar = null;
}

// Confirmar/cancelar eliminación
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-confirmar-eliminar').onclick = function() {
        if (window.tarjetaAEliminar) {
            window.tarjetaAEliminar.remove();
            window.tarjetaAEliminar = null;
        }
        cerrarModalEliminar();
    };
    document.getElementById('btn-cancelar-eliminar').onclick = cerrarModalEliminar;
});

// =======================
// COMPONENTE: ASIGNACIÓN DE EVENTOS Y CIERRE DE MODALES
// =======================

document.addEventListener('DOMContentLoaded', function() {
    // Asignar eventos a todas las tarjetas existentes (excepto la de agregar)
    document.querySelectorAll('.tarjeta-ingreso:not(.tarjeta-agregar)').forEach(asignarEventosTarjeta);

    // Evento para cerrar modales
    document.getElementById('cerrar-modal').onclick = ocultarModalDetalle;
    document.getElementById('cerrar-modal-editar').onclick = ocultarModalEditar;
    document.getElementById('cerrar-modal-eliminar').onclick = cerrarModalEliminar;

    // Cerrar modal al hacer click fuera del contenido
    document.getElementById('modal-ingreso').onclick = function(e) {
        if (e.target === this) ocultarModalDetalle();
    };
    document.getElementById('modal-editar-ingreso').onclick = function(e) {
        if (e.target === this) ocultarModalEditar();
    };
    document.getElementById('modal-eliminar-ingreso').onclick = function(e) {
        if (e.target === this) cerrarModalEliminar();
    };
});