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
  window.mostrarIngresosSubcategoria = function (subcategoria) {
    document.getElementById("nombreSubcategoria").textContent = subcategoria;
    const modal = document.getElementById("modalTabla");
    if (modal) modal.style.display = "block";
    cargarIngresosEnTabla(subcategoria);
  };

  const cerrar = document.querySelector(".close-tabla");
  if (cerrar) {
    cerrar.addEventListener("click", () => {
      document.getElementById("modalTabla").style.display = "none";
    });
  }

  const modalAgregar = document.getElementById("btnAgregarGasto");
  if (modalAgregar) {
    modalAgregar.addEventListener("click", () => {
      const subcategoriaActual = document.getElementById("nombreSubcategoria").textContent;
      const campoConcepto = document.getElementById("conceptoGastoModal");
      if (campoConcepto && subcategoriaActual) {
        campoConcepto.value = subcategoriaActual;
      }
      document.getElementById("modalAgregarGasto").style.display = "block";
    });
  }

  const modalAgregarCerrar = document.getElementById("cerrarAgregarGasto");
  if (modalAgregarCerrar) {
    modalAgregarCerrar.addEventListener("click", () => {
      document.getElementById("modalAgregarGasto").style.display = "none";
    });
  }

  const formAgregar = document.getElementById("formAgregarGastoModal");
  formAgregar.addEventListener("submit", function (e) {
    e.preventDefault();
    const concepto = document.getElementById("conceptoGastoModal").value;
    const monto = parseFloat(document.getElementById("montoGastoModal").value);
    const descripcion = document.getElementById("descripcionGastoModal").value;
    const fecha = new Date().toLocaleDateString();
    const tipo = "Variable";
    const subcategoria = document.getElementById("nombreSubcategoria").textContent;

    function obtenerNuevoIdIngreso() {
      const ultimoId = parseInt(localStorage.getItem("ultimoIdIngreso")) || 0;
      const nuevoId = ultimoId + 1;
      localStorage.setItem("ultimoIdIngreso", nuevoId);
      return nuevoId;
    }

    const ingreso = {
      id: obtenerNuevoIdIngreso(),
      concepto,
      monto,
      descripcion,
      fecha,
      tipo,
      subcategoria
    };

    guardarIngreso(ingreso);
    formAgregar.reset();
    document.getElementById("modalAgregarGasto").style.display = "none";
    cargarIngresosEnTabla(subcategoria);
  });

  function guardarIngreso(ingreso) {
    const guardados = JSON.parse(localStorage.getItem("misIngresos")) || [];
    guardados.push(ingreso);
    localStorage.setItem("misIngresos", JSON.stringify(guardados));
  }

  function cargarIngresosEnTabla(subcategoria) {
    if (!tablaInicializada) {
      $('#tablaSubcategoria').DataTable({
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          zeroRecords: "No se encontraron resultados",
          info: "Mostrando _START_ a _END_ de _TOTAL_ ingresos",
          infoEmpty: "No hay registros disponibles",
          infoFiltered: "(filtrado de _MAX_ ingresos en total)"
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

    const ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
    const filtrados = ingresos.filter(g => g.subcategoria === subcategoria);

    filtrados.forEach(ingreso => {
      tabla.row.add([
        ingreso.id,
        ingreso.concepto,
        `$${ingreso.monto.toFixed(2)}`,
        ingreso.descripcion || "-",
        ingreso.fecha,
        ingreso.tipo,
        `<button class='btn-editar boton-secundario' data-id='${ingreso.id}'>Editar</button>
         <button class='btn-eliminar boton-peligro' data-id='${ingreso.id}'>Borrar</button>`
      ]);
    });

    tabla.draw();
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-eliminar")) {
      const id = parseInt(e.target.dataset.id);
      eliminarIngreso(id);
    }
    if (e.target.classList.contains("btn-editar")) {
      const id = parseInt(e.target.dataset.id);
      mostrarModalEditarIngreso(id);
    }
  });

  function eliminarIngreso(id) {
    let ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
    ingresos = ingresos.filter(g => g.id !== id);
    localStorage.setItem("misIngresos", JSON.stringify(ingresos));

    const sub = document.getElementById("nombreSubcategoria").textContent;
    if (sub) window.mostrarIngresosSubcategoria(sub.trim());
  }

  function mostrarModalEditarIngreso(id) {
    const ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
    const ingreso = ingresos.find(g => g.id === id);
    if (!ingreso) return;

    document.getElementById("editarGastoIdModal").value = ingreso.id;
    document.getElementById("editarConceptoGastoModal").value = ingreso.concepto;
    document.getElementById("editarMontoGastoModal").value = ingreso.monto;
    document.getElementById("editarDescripcionGastoModal").value = ingreso.descripcion || "";

    document.getElementById("modalEditarGasto").style.display = "block";
  }

  document.getElementById("formEditarGastoModal").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById("editarGastoIdModal").value);
    let ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
    const index = ingresos.findIndex(g => g.id === id);
    if (index === -1) return;

    ingresos[index].concepto = document.getElementById("editarConceptoGastoModal").value;
    ingresos[index].monto = parseFloat(document.getElementById("editarMontoGastoModal").value);
    ingresos[index].descripcion = document.getElementById("editarDescripcionGastoModal").value;

    localStorage.setItem("misIngresos", JSON.stringify(ingresos));

    document.getElementById("modalEditarGasto").style.display = "none";

    const sub = document.getElementById("nombreSubcategoria").textContent;
    if (sub) window.mostrarIngresosSubcategoria(sub.trim());
  });

  document.querySelector("#modalEditarGasto .boton-secundario").onclick = () => {
    document.getElementById("modalEditarGasto").style.display = "none";
  };

  window.actualizarVistasIngresos = function() {
    if (typeof window.cargarConceptosEgresos === 'function') {
      window.cargarConceptosEgresos();
    }
    const subcategoriaActual = document.getElementById("nombreSubcategoria");
    if (subcategoriaActual && subcategoriaActual.textContent.trim()) {
      window.mostrarIngresosSubcategoria(subcategoriaActual.textContent.trim());
    }
  };

});
