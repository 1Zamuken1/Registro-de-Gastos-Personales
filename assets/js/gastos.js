let tablaInicializada = false;

// Cambiar de vista entre "ver" y "programar"
document.addEventListener("DOMContentLoaded", () => {
  const btnVer = document.getElementById("btn-ver");
  const btnProgramar = document.getElementById("btn-programar");
  const vistaVer = document.getElementById("vista-ver");
  const vistaProgramar = document.getElementById("vista-programar");

  btnVer.addEventListener("click", () => {
    btnVer.classList.add("activo");
    btnProgramar.classList.remove("activo");
    vistaVer.classList.add("activa");
    vistaProgramar.classList.remove("activa");
  });

  btnProgramar.addEventListener("click", () => {
    btnProgramar.classList.add("activo");
    btnVer.classList.remove("activo");
    vistaProgramar.classList.add("activa");
    vistaVer.classList.remove("activa");
  });

  // Mostrar modal principal con tabla
  window.mostrarGastosSubcategoria = function (subcategoria) {
    document.getElementById("nombreSubcategoria").textContent = subcategoria;

    const modal = document.getElementById("modalTabla");
    if (modal) modal.style.display = "block";

    cargarGastosEnTabla(subcategoria);
  };

  // Cerrar modal de tabla
  const cerrar = document.querySelector(".close-tabla");
  if (cerrar) {
    cerrar.addEventListener("click", () => {
      document.getElementById("modalTabla").style.display = "none";
    });
  }

  // Mostrar modal agregar gasto
  const modalAgregar = document.getElementById("btnAgregarGasto");
  if (modalAgregar) {
    modalAgregar.addEventListener("click", () => {
      // Obtener la subcategoría actual
      const subcategoriaActual = document.getElementById("nombreSubcategoria").textContent;
      
      // Autocompletar el campo concepto con la subcategoría
      const campoConcepto = document.getElementById("conceptoGastoModal");
      if (campoConcepto && subcategoriaActual) {
        campoConcepto.value = subcategoriaActual;
      }
      
      document.getElementById("modalAgregarGasto").style.display = "block";
    });
  }

  // Cerrar modal agregar gasto
  const modalAgregarCerrar = document.getElementById("cerrarAgregarGasto");
  if (modalAgregarCerrar) {
    modalAgregarCerrar.addEventListener("click", () => {
      document.getElementById("modalAgregarGasto").style.display = "none";
    });
  }

  // Guardar nuevo gasto desde el formulario
  const formAgregar = document.getElementById("formAgregarGastoModal");
  formAgregar.addEventListener("submit", function (e) {
    e.preventDefault();
    const concepto = document.getElementById("conceptoGastoModal").value;
    const monto = parseFloat(document.getElementById("montoGastoModal").value);
    const descripcion = document.getElementById("descripcionGastoModal").value;
    const fecha = new Date().toLocaleDateString();
    const tipo = "Variable";
    const subcategoria = document.getElementById("nombreSubcategoria").textContent;
    function obtenerNuevoIdGasto() {
        const ultimoId = parseInt(localStorage.getItem("ultimoIdGasto")) || 0;
        const nuevoId = ultimoId + 1;
        localStorage.setItem("ultimoIdGasto", nuevoId);
        return nuevoId;
    }

    const gasto = {
      id: obtenerNuevoIdGasto(),
      concepto,
      monto,
      descripcion,
      fecha,
      tipo,
      subcategoria
    };

    guardarGasto(gasto);
    formAgregar.reset();
    document.getElementById("modalAgregarGasto").style.display = "none";
    cargarGastosEnTabla(subcategoria);
  });

  // Guardar gasto en localStorage
  function guardarGasto(gasto) {
    const guardados = JSON.parse(localStorage.getItem("misGastos")) || [];
    guardados.push(gasto);
    localStorage.setItem("misGastos", JSON.stringify(guardados));
  }

  // Cargar y mostrar gastos en DataTable
  function cargarGastosEnTabla(subcategoria) {
    if (!tablaInicializada) {
      $('#tablaSubcategoria').DataTable({
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          info: "Mostrando _START_ a _END_ de _TOTAL_ gastos",
          infoEmpty: "No hay registros disponibles",
          infoFiltered: "(filtrado de _MAX_ gastos en total)"
        },
        columns: [
          { title: "ID" },
          { title: "Concepto" },
          { title: "Monto" },
          { title: "Descripción" },
          { title: "Fecha" },
          { title: "Tipo" },
          { title: "Acciones", orderable: false }
        ]
      });
      tablaInicializada = true;
    }

    const tabla = $('#tablaSubcategoria').DataTable();
    tabla.clear();

    const gastos = JSON.parse(localStorage.getItem("misGastos")) || [];
    const filtrados = gastos.filter(g => g.subcategoria === subcategoria);

    filtrados.forEach(gasto => {
      tabla.row.add([
        gasto.id,
        gasto.concepto,
        `$${gasto.monto.toFixed(2)}`,
        gasto.descripcion || "-",
        gasto.fecha,
        gasto.tipo,
        `<button class='btn-editar boton-secundario' data-id='${gasto.id}'>Editar</button>
         <button class='btn-eliminar boton-peligro' data-id='${gasto.id}'>Borrar</button>`
      ]);
    });

    tabla.draw();
  }

    //funcion de botones
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-eliminar")) {
            const id = parseInt(e.target.dataset.id);
            eliminarGasto(id);
        }

        if (e.target.classList.contains("btn-editar")) {
            const id = parseInt(e.target.dataset.id);
            mostrarModalEditarGasto(id);
        }
    });

    function eliminarGasto(id) {
        let gastos = JSON.parse(localStorage.getItem("misGastos")) || [];
        gastos = gastos.filter(g => g.id !== id);
        localStorage.setItem("misGastos", JSON.stringify(gastos));

        // Actualizar tabla sin recargar
        const sub = document.getElementById("nombreSubcategoria").textContent;
        if (sub) window.mostrarGastosSubcategoria(sub.trim());
    }

    function mostrarModalEditarGasto(id) {
        const gastos = JSON.parse(localStorage.getItem("misGastos")) || [];
        const gasto = gastos.find(g => g.id === id);
        if (!gasto) return;

        // Rellenar los campos del modal
        document.getElementById("editarGastoIdModal").value = gasto.id;
        document.getElementById("editarConceptoGastoModal").value = gasto.concepto;
        document.getElementById("editarMontoGastoModal").value = gasto.monto;
        document.getElementById("editarDescripcionGastoModal").value = gasto.descripcion || "";

        // Mostrar el modal
        document.getElementById("modalEditarGasto").style.display = "block";
    }
        document.getElementById("formEditarGastoModal").addEventListener("submit", function (e) {
        e.preventDefault();

        const id = parseInt(document.getElementById("editarGastoIdModal").value);
        let gastos = JSON.parse(localStorage.getItem("misGastos")) || [];
        const index = gastos.findIndex(g => g.id === id);
        if (index === -1) return;

        gastos[index].concepto = document.getElementById("editarConceptoGastoModal").value;
        gastos[index].monto = parseFloat(document.getElementById("editarMontoGastoModal").value);
        gastos[index].descripcion = document.getElementById("editarDescripcionGastoModal").value;

        localStorage.setItem("misGastos", JSON.stringify(gastos));

        // Cerrar el modal
        document.getElementById("modalEditarGasto").style.display = "none";

        // Recargar tabla actual
        const sub = document.getElementById("nombreSubcategoria").textContent;
        if (sub) window.mostrarGastosSubcategoria(sub.trim());
    });
    document.querySelector("#modalEditarGasto .boton-secundario").onclick = () => {
    document.getElementById("modalEditarGasto").style.display = "none";
    };
    window.actualizarVistasGastos = function() {
    if (typeof window.cargarConceptosEgresos === 'function') {
        window.cargarConceptosEgresos();
    }
    
    // Si hay una tabla abierta, recargarla
    const subcategoriaActual = document.getElementById("nombreSubcategoria");
    if (subcategoriaActual && subcategoriaActual.textContent.trim()) {
        window.mostrarGastosSubcategoria(subcategoriaActual.textContent.trim());
    }
};

});