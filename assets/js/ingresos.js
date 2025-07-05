// Conceptos predefinidos con descripciones
const CONCEPTOS_INGRESOS = [
  {
    nombre: "Venta de productos",
    descripcion:
      "Ingresos generados por la venta directa de bienes o productos físicos a clientes.",
  },
  {
    nombre: "Prestación de servicios",
    descripcion:
      "Ingresos obtenidos por la provisión de servicios profesionales o técnicos.",
  },
  {
    nombre: "Honorarios profesionales",
    descripcion:
      "Pagos recibidos por servicios profesionales especializados como consultoría, asesoría legal, médica, etc.",
  },
  {
    nombre: "Consultoría",
    descripcion:
      "Ingresos por servicios de consultoría y asesoramiento especializado en diferentes áreas.",
  },
  {
    nombre: "Comisiones por ventas",
    descripcion:
      "Ingresos variables basados en un porcentaje de las ventas realizadas o transacciones completadas.",
  },
  {
    nombre: "Alquileres",
    descripcion:
      "Ingresos periódicos por el arrendamiento de propiedades, equipos u otros activos.",
  },
  {
    nombre: "Dividendos",
    descripcion:
      "Distribuciones de ganancias recibidas por la participación en acciones de empresas.",
  },
  {
    nombre: "Intereses bancarios",
    descripcion:
      "Rendimientos obtenidos por depósitos bancarios, cuentas de ahorro o inversiones financieras.",
  },
  {
    nombre: "Venta de activos",
    descripcion:
      "Ingresos extraordinarios obtenidos por la venta de activos fijos como equipos, inmuebles, etc.",
  },
  {
    nombre: "Regalías",
    descripcion:
      "Pagos recibidos por el uso de derechos de propiedad intelectual, patentes o marcas.",
  },
  {
    nombre: "Subsidios",
    descripcion:
      "Apoyos económicos recibidos de entidades gubernamentales o instituciones.",
  },
  {
    nombre: "Donaciones recibidas",
    descripcion:
      "Ingresos no reembolsables recibidos de terceros sin contraprestación directa.",
  },
];

const CONCEPTOS_PROYECCIONES = [
  {
    nombre: "Proyección de ventas",
    descripcion:
      "Estimación de ingresos futuros basada en análisis de tendencias y proyecciones comerciales.",
  },
  {
    nombre: "Proyección de servicios",
    descripcion:
      "Ingresos esperados por servicios contratados o en proceso de negociación.",
  },
  {
    nombre: "Honorarios proyectados",
    descripcion:
      "Estimación de ingresos por servicios profesionales programados o en desarrollo.",
  },
  {
    nombre: "Consultoría proyectada",
    descripcion:
      "Ingresos esperados por proyectos de consultoría en pipeline o confirmados.",
  },
  {
    nombre: "Comisiones proyectadas",
    descripcion:
      "Estimación de comisiones futuras basadas en metas de ventas y objetivos comerciales.",
  },
  {
    nombre: "Alquileres proyectados",
    descripcion:
      "Ingresos esperados por contratos de arrendamiento en proceso o renovaciones.",
  },
  {
    nombre: "Dividendos proyectados",
    descripcion:
      "Estimación de dividendos futuros basada en el rendimiento esperado de inversiones.",
  },
  {
    nombre: "Intereses proyectados",
    descripcion:
      "Rendimientos esperados de inversiones financieras y depósitos programados.",
  },
  {
    nombre: "Bonificaciones laborales",
    descripcion:
      "Incentivos y bonificaciones laborales programadas o esperadas por desempeño.",
  },
  {
    nombre: "Salario proyectado",
    descripcion:
      "Ingresos salariales esperados incluyendo aumentos programados o promociones.",
  },
  {
    nombre: "Incentivos proyectados",
    descripcion:
      "Estimación de incentivos por cumplimiento de metas y objetivos específicos.",
  },
  {
    nombre: "Contratos futuros",
    descripcion:
      "Ingresos esperados por contratos firmados con fecha de inicio futura.",
  },
];

// Verificar autenticación
function verificarAutenticacion() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) {
    alert("Debe iniciar sesión para acceder a esta página.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Obtener usuario activo
function obtenerUsuarioActivo() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (usuarioActivoId) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.find((u) => u.id === parseInt(usuarioActivoId));
  }
  return null;
}

// Cargar ingresos del usuario desde localStorage
function cargarIngresos() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) return [];

  const clave = `ingresos_usuario_${usuarioActivoId}`;
  const ingresos = localStorage.getItem(clave);
  return ingresos ? JSON.parse(ingresos) : [];
}

// Guardar ingresos del usuario en localStorage
function guardarIngresos(ingresos) {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (!usuarioActivoId) return;

  const clave = `ingresos_usuario_${usuarioActivoId}`;
  localStorage.setItem(clave, JSON.stringify(ingresos));
}

// Poblar conceptos en el modal
function mostrarConceptos(tipo) {
  const conceptosGrid = document.getElementById("conceptosGrid");
  const conceptoModalTitle = document.getElementById("conceptoModalTitle");

  conceptosGrid.innerHTML = "";

  let conceptos = [];
  if (tipo === "Ingreso") {
    conceptos = CONCEPTOS_INGRESOS;
    conceptoModalTitle.textContent = "Seleccionar Concepto de Ingreso";
  } else if (tipo === "Proyección") {
    conceptos = CONCEPTOS_PROYECCIONES;
    conceptoModalTitle.textContent = "Seleccionar Concepto de Proyección";
  }

  conceptos.forEach((concepto) => {
    const conceptoCard = document.createElement("div");
    conceptoCard.className = "concepto-card";
    conceptoCard.innerHTML = `
            <div class="concepto-titulo">${concepto.nombre}</div>
            <div class="concepto-descripcion">${concepto.descripcion}</div>
          `;

    conceptoCard.addEventListener("click", () => {
      seleccionarConcepto(concepto.nombre);
    });

    conceptosGrid.appendChild(conceptoCard);
  });
}

// Seleccionar concepto
function seleccionarConcepto(nombreConcepto) {
  document.getElementById("concepto").value = nombreConcepto;
  cerrarModalConcepto();
}

// Abrir modal de conceptos
function abrirModalConcepto() {
  const tipo = document.getElementById("tipo").value;
  if (!tipo) {
    alert("Primero debe seleccionar un tipo (Ingreso o Proyección)");
    return;
  }

  mostrarConceptos(tipo);
  document.getElementById("conceptoModal").classList.add("active");
}

// Cerrar modal de conceptos
function cerrarModalConcepto() {
  document.getElementById("conceptoModal").classList.remove("active");
}

// Filtrar conceptos en tiempo real
function filtrarConceptos() {
  const searchTerm = document
    .getElementById("searchConcepto")
    .value.toLowerCase();
  const conceptoCards = document.querySelectorAll(".concepto-card");

  conceptoCards.forEach((card) => {
    const titulo = card
      .querySelector(".concepto-titulo")
      .textContent.toLowerCase();
    const descripcion = card
      .querySelector(".concepto-descripcion")
      .textContent.toLowerCase();

    if (titulo.includes(searchTerm) || descripcion.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Calcular la próxima fecha de recurrencia
function calcularProximaFecha(fechaInicial, recurrencia) {
  const fecha = new Date(fechaInicial);
  switch (recurrencia) {
    case "diaria":
      fecha.setDate(fecha.getDate() + 1);
      break;
    case "semanal":
      fecha.setDate(fecha.getDate() + 7);
      break;
    case "quincenal":
      fecha.setDate(fecha.getDate() + 15);
      break;
    case "mensual":
      fecha.setMonth(fecha.getMonth() + 1);
      break;
    case "trimestral":
      fecha.setMonth(fecha.getMonth() + 3);
      break;
    case "semestral":
      fecha.setMonth(fecha.getMonth() + 6);
      break;
    case "anual":
      fecha.setFullYear(fecha.getFullYear() + 1);
      break;
    default:
      return null;
  }
  return fecha.toISOString().split("T")[0];
}

// Verificar si hay recurrencias pendientes
function verificarRecurrenciasPendientes() {
  const hoy = new Date().toISOString().split("T")[0];
  const recurrenciasPendientes = [];

  // Buscar proyecciones activas con recurrencia
  incomes.forEach((income) => {
    if (
      income.tipo === "Proyección" &&
      income.estado === "Activo" &&
      income.recurrencia &&
      income.recurrencia !== "ninguna" &&
      income.proximaRecurrencia === hoy
    ) {
      recurrenciasPendientes.push({
        id: income.id,
        concepto: income.concepto,
        monto: income.monto,
        recurrencia: income.recurrencia,
        proximaRecurrencia: income.proximaRecurrencia,
      });
    }
  });

  return recurrenciasPendientes;
}

// Mostrar modal de recurrencia
function mostrarRecurrenciaModal(recurrencias) {
  const recurrenceItems = document.getElementById("recurrenceItems");
  recurrenceItems.innerHTML = "";

  recurrencias.forEach((item) => {
    const div = document.createElement("div");
    div.className = "recurrence-item";
    div.innerHTML = `
            <div class="recurrence-info">
              <span>${item.concepto}</span>
              <span class="recurrence-amount">${formatCurrency(
                item.monto
              )}</span>
            </div>
            <div>Recurrencia: ${capitalizeFirstLetter(item.recurrencia)}</div>
            <div>Fecha prevista: ${formatDate(item.proximaRecurrencia)}</div>
          `;
    recurrenceItems.appendChild(div);
  });

  document.getElementById("recurrenceModal").classList.add("active");
}

// Capitalizar primera letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Formatear fecha para mostrar
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
}

// Confirmar recurrencias
function confirmarRecurrencias() {
  const hoy = new Date().toISOString().split("T")[0];

  incomes.forEach((income) => {
    if (
      income.tipo === "Proyección" &&
      income.estado === "Activo" &&
      income.recurrencia &&
      income.recurrencia !== "ninguna" &&
      income.proximaRecurrencia === hoy
    ) {
      // Crear registro de ingreso real
      const newId = Math.max(...incomes.map((i) => i.id), 0) + 1;
      incomes.push({
        id: newId,
        concepto: income.concepto,
        monto: income.monto,
        tipo: "Ingreso",
        fecha: hoy,
        estado: "Activo",
        recurrencia: "ninguna",
        proximaRecurrencia: null,
      });

      // Calcular próxima recurrencia
      income.proximaRecurrencia = calcularProximaFecha(
        income.proximaRecurrencia,
        income.recurrencia
      );
    }
  });

  guardarIngresos(incomes);
  renderIncomes();
  calculateTotals();
  document.getElementById("recurrenceModal").classList.remove("active");
}

// Datos iniciales
let incomes = [];

// Elementos del DOM
const incomeTable = document.getElementById("incomeTable");
const incomeModal = document.getElementById("incomeModal");
const modalTitle = document.getElementById("modalTitle");
const sectionTitle = document.getElementById("section-title");
const incomeForm = document.getElementById("incomeForm");
const addIncomeBtn = document.getElementById("addIncome");
const saveIncomeBtn = document.getElementById("saveIncome");
const closeModalBtn = document.getElementById("closeModal");
const cancelModalBtn = document.getElementById("cancelModal");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");
const paginationInfo = document.getElementById("paginationInfo");
const totalIncome = document.getElementById("total-income");
const totalProjection = document.getElementById("total-projection");
const monthIncome = document.getElementById("month-income");
const tipoSelect = document.getElementById("tipo");
const conceptoInput = document.getElementById("concepto");
const selectConceptoBtn = document.getElementById("selectConcepto");
const conceptoModal = document.getElementById("conceptoModal");
const closeConceptoModalBtn = document.getElementById("closeConceptoModal");
const cancelConceptoModalBtn = document.getElementById("cancelConceptoModal");
const searchConceptoInput = document.getElementById("searchConcepto");

// Elementos para el modal de confirmación de eliminación
const deleteModal = document.getElementById("deleteConfirmationModal");
const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

// Elementos para el modal de recurrencia
const recurrenceModal = document.getElementById("recurrenceModal");
const remindLaterBtn = document.getElementById("remindLater");
const confirmRecurrencesBtn = document.getElementById("confirmRecurrences");

// Variables de estado
let currentPage = 1;
let recordsPerPageValue = 10;

// ID del ingreso a eliminar
let incomeToDeleteId = null;

// Funciones
function formatCurrency(amount) {
  return "$" + amount.toLocaleString("es-CO");
}

function calculateTotals() {
  const totalIngresos = incomes
    .filter((i) => i.tipo === "Ingreso")
    .reduce((sum, income) => sum + income.monto, 0);

  const totalProyecciones = incomes
    .filter((i) => i.tipo === "Proyección")
    .reduce((sum, income) => sum + income.monto, 0);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const ingresosMes = incomes
    .filter((i) => {
      if (i.tipo !== "Ingreso") return false;
      const date = new Date(i.fecha);
      return (
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, income) => sum + income.monto, 0);

  totalIncome.textContent = formatCurrency(totalIngresos);
  totalProjection.textContent = formatCurrency(totalProyecciones);
  monthIncome.textContent = formatCurrency(ingresosMes);
}

function renderIncomes() {
  // Filtrar según la búsqueda y filtros
  let filteredIncomes = incomes;

  // Aplicar filtros
  const searchTerm = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  const typeValue = typeFilter.value;

  filteredIncomes = filteredIncomes.filter((income) => {
    // Verificar y proporcionar valores por defecto para propiedades faltantes
    const concepto = income.concepto || "";
    const monto = income.monto || 0;
    const tipo = income.tipo || "";
    const estado = income.estado || "";

    const matchesSearch =
      concepto.toLowerCase().includes(searchTerm) ||
      formatCurrency(monto).toLowerCase().includes(searchTerm) ||
      tipo.toLowerCase().includes(searchTerm);

    const matchesStatus = statusValue === "all" || estado === statusValue;
    const matchesType = typeValue === "all" || tipo === typeValue;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginación
  const totalPages = Math.ceil(filteredIncomes.length / recordsPerPageValue);
  const startIndex = (currentPage - 1) * recordsPerPageValue;
  const paginatedIncomes = filteredIncomes.slice(
    startIndex,
    startIndex + recordsPerPageValue
  );

  // Renderizar tabla
  incomeTable.innerHTML = "";

  if (paginatedIncomes.length === 0) {
    incomeTable.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-light);">No se encontraron registros</td></tr>`;
    paginationInfo.textContent = `Mostrando 0 de ${filteredIncomes.length} registros`;
    return;
  }

  paginatedIncomes.forEach((income) => {
    // Validar y proporcionar valores por defecto para renderizado
    const id = income.id || "N/A";
    const concepto = income.concepto || "Sin concepto";
    const monto = income.monto || 0;
    const tipo = income.tipo || "Sin tipo";
    const fecha = income.fecha || "Sin fecha";
    const estado = income.estado || "Inactivo";

    const tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>${id}</td>
                    <td>${concepto}</td>
                    <td class="amount-cell">${formatCurrency(monto)}</td>
                    <td>${tipo}</td>
                    <td>${fecha}</td>
                    <td><span class="status ${estado.toLowerCase()}">${estado}</span></td>
                    <td class="actions">
                        <div class="action-btn edit" data-id="${id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-btn delete" data-id="${id}">
                            <i class="fas fa-trash"></i>
                        </div>
                    </td>
                `;
    incomeTable.appendChild(tr);
  });

  // Actualizar información de paginación
  const startRecord = startIndex + 1;
  const endRecord = Math.min(
    startIndex + recordsPerPageValue,
    filteredIncomes.length
  );
  paginationInfo.textContent = `Mostrando ${startRecord} a ${endRecord} de ${filteredIncomes.length} registros`;

  // Agregar event listeners a los botones de editar y eliminar
  document.querySelectorAll(".action-btn.edit").forEach((btn) => {
    btn.addEventListener("click", () => editIncome(btn.dataset.id));
  });

  document.querySelectorAll(".action-btn.delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Guardar ID para posible eliminación
      incomeToDeleteId = btn.dataset.id;
      // Mostrar modal de confirmación
      deleteModal.classList.add("active");
    });
  });
}

function openModal(mode = "add", income = null) {
  if (mode === "add") {
    modalTitle.textContent = "Añadir nuevo registro";
    incomeForm.reset();
    document.getElementById("editId").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("fecha").value = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("estado").value = "";
    document.getElementById("recurrencia").value = "ninguna";

    // Limpiar el concepto
    document.getElementById("concepto").value = "";
  } else {
    modalTitle.textContent = "Editar registro";
    document.getElementById("editId").value = income.id;
    document.getElementById("concepto").value = income.concepto;
    document.getElementById("monto").value = income.monto;
    document.getElementById("tipo").value = income.tipo;
    document.getElementById("fecha").value = income.fecha;
    document.getElementById("estado").value = income.estado;
    document.getElementById("recurrencia").value =
      income.recurrencia || "ninguna";
  }
  incomeModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  incomeModal.classList.remove("active");
  document.body.style.overflow = "";
}

function saveIncome() {
  const id = document.getElementById("editId").value;
  const concepto = document.getElementById("concepto").value;
  const monto = parseInt(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;
  const fecha = document.getElementById("fecha").value;
  const estado = document.getElementById("estado").value;
  const recurrencia = document.getElementById("recurrencia").value;

  // Calcular próxima recurrencia si es necesario
  let proximaRecurrencia = null;
  if (recurrencia !== "ninguna") {
    proximaRecurrencia = calcularProximaFecha(fecha, recurrencia);
  }

  if (!concepto || !monto || !tipo || !fecha || !estado) {
    alert("Por favor complete todos los campos obligatorios");
    return;
  }

  if (id) {
    // Editar ingreso existente
    const index = incomes.findIndex((i) => i.id == id);
    if (index !== -1) {
      incomes[index] = {
        id: parseInt(id),
        concepto,
        monto,
        tipo,
        fecha,
        estado,
        recurrencia,
        proximaRecurrencia,
      };
    }
  } else {
    // Añadir nuevo ingreso
    const newId = Math.max(...incomes.map((i) => i.id), 0) + 1;
    incomes.push({
      id: newId,
      concepto,
      monto,
      tipo,
      fecha,
      estado,
      recurrencia,
      proximaRecurrencia,
    });
  }

  // Guardar en localStorage
  guardarIngresos(incomes);

  renderIncomes();
  calculateTotals();
  closeModal();
}

function editIncome(id) {
  const income = incomes.find((i) => i.id == id);
  if (income) {
    openModal("edit", income);
  }
}

function deleteIncome() {
  if (incomeToDeleteId) {
    incomes = incomes.filter((i) => i.id != incomeToDeleteId);
    guardarIngresos(incomes);
    renderIncomes();
    calculateTotals();
    incomeToDeleteId = null;
  }
  deleteModal.classList.remove("active");
}

// Función para establecer la fecha actual
function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").value = today;
}

// Event Listeners
addIncomeBtn.addEventListener("click", () => openModal("add"));
saveIncomeBtn.addEventListener("click", saveIncome);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// Event Listeners para modal de conceptos
selectConceptoBtn.addEventListener("click", abrirModalConcepto);
conceptoInput.addEventListener("click", abrirModalConcepto);
closeConceptoModalBtn.addEventListener("click", cerrarModalConcepto);
cancelConceptoModalBtn.addEventListener("click", cerrarModalConcepto);
searchConceptoInput.addEventListener("input", filtrarConceptos);

// Event Listeners para modal de confirmación de eliminación
confirmDeleteBtn.addEventListener("click", deleteIncome);
cancelDeleteBtn.addEventListener("click", () => {
  incomeToDeleteId = null;
  deleteModal.classList.remove("active");
});
closeDeleteModalBtn.addEventListener("click", () => {
  incomeToDeleteId = null;
  deleteModal.classList.remove("active");
});
document
  .querySelector(".delete-modal-backdrop")
  .addEventListener("click", () => {
    incomeToDeleteId = null;
    deleteModal.classList.remove("active");
  });

// Cerrar modal al hacer clic en el fondo
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

// Cerrar modal de conceptos al hacer clic en el fondo
document.addEventListener("click", (e) => {
  if (e.target.closest("#conceptoModal .modal-backdrop")) {
    cerrarModalConcepto();
  }
});

// Cambio de tipo para limpiar concepto seleccionado
tipoSelect.addEventListener("change", function () {
  // Limpiar el concepto cuando cambie el tipo
  document.getElementById("concepto").value = "";
});

// Filtros y búsqueda
searchInput.addEventListener("input", renderIncomes);
statusFilter.addEventListener("change", renderIncomes);
typeFilter.addEventListener("change", renderIncomes);

// Botón "Hoy" para establecer fecha actual
document.getElementById("btnHoy").addEventListener("click", setTodayDate);

// Event Listeners para recurrencia
confirmRecurrencesBtn.addEventListener("click", confirmarRecurrencias);
remindLaterBtn.addEventListener("click", function () {
  document.getElementById("recurrenceModal").classList.remove("active");
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!verificarAutenticacion()) {
    return;
  }

  // Cargar ingresos del usuario
  incomes = cargarIngresos();

  renderIncomes();
  calculateTotals();

  // Verificar recurrencias pendientes
  const recurrenciasPendientes = verificarRecurrenciasPendientes();
  if (recurrenciasPendientes.length > 0) {
    // Esperar 1 segundo para mostrar el modal después de cargar la página
    setTimeout(() => {
      mostrarRecurrenciaModal(recurrenciasPendientes);
    }, 1000);
  }
});
