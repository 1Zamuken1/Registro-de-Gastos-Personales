const categoriasPredefinidas = [
  "Alimentación",
  "Transporte",
  "Educación",
  "Salud",
  "Entretenimiento",
  "Servicios",
  "Ropa",
  "Viajes",
  "Tecnología",
  "Hogar",
  "Mascotas",
  "Regalos",
  "Deportes",
  "Libros",
  "Cuidado Personal",
  "Inversiones",
  "Ahorro",
  "Impuestos",
  "Comunicaciones",
  "Gastos Varios",
  "Muebles",
  "Electrodomésticos",
  "Jardinería",
  "Seguros",
  "Mantenimiento",
  "Bebidas",
  "Restaurantes",
  "Cine",
  "Música",
  "Cursos",
  "Suscripciones",
  "Eventos",
  "Telefonía",
  "Internet",
  "Gasolina",
  "Taxi",
  "Parking",
  "Cafetería",
  "Limpieza",
  "Decoración",
  "Herramientas",
  "Vehículos",
  "Reparaciones",
  "Salidas",
  "Niños",
  "Educación Continua",
  "Apps y Software",
  "Donaciones"
];

let categoriasActivas = ["Alimentación", "Transporte"];
let categoriasDisponibles = categoriasPredefinidas.filter(c => !categoriasActivas.includes(c));

const gastosPorCategoria = {
  "Alimentación": [
    { descripcion: "Supermercado", monto: 0, tipo: "fijo", fechaRegistro: "2025-05-01", fechaInicio: "2025-05-01", fechaFin: "2025-06-01", cuotas: [{ monto: 60000 }, { monto: 60000 }] },
    { descripcion: "Restaurante", monto: 45000, tipo: "variable", fechaRegistro: "2025-05-03", cuotas: [] }
  ],
  "Transporte": [
    { descripcion: "Gasolina", monto: 80000, tipo: "variable", fechaRegistro: "2025-05-05", cuotas: [] }
  ]
};

function renderizarCategorias() {
  const contenedor = document.getElementById("categorias");
  contenedor.innerHTML = "";

  // Primero agregar el botón "+"
  const btnAgregar = document.createElement("div");
  btnAgregar.className = "categoria";
  btnAgregar.textContent = "+";
  btnAgregar.onclick = mostrarCategoriasDisponibles;
  contenedor.appendChild(btnAgregar);

  // Luego agregar las categorías activas
  categoriasActivas.forEach(categoria => {
    const div = document.createElement("div");
    div.className = "categoria";
    div.textContent = categoria;
    div.onclick = () => toggleGastosCategoria(categoria);
    contenedor.appendChild(div);
  });

  // Asegurar que categorías están visibles cuando se renderizan
  contenedor.classList.remove("oculto");
  document.getElementById("vista-gastos").classList.add("oculto");
}

function mostrarCategoriasDisponibles() {
  const disponibles = categoriasPredefinidas.filter(c => !categoriasActivas.includes(c));

  if (disponibles.length === 0) {
    alert("No hay más categorías para agregar.");
    return;
  }

  const opciones = disponibles.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const seleccion = prompt("Seleccione una categoría para agregar:\n" + opciones);

  const indice = parseInt(seleccion) - 1;
  if (!isNaN(indice) && disponibles[indice]) {
    categoriasActivas.push(disponibles[indice]);
    gastosPorCategoria[disponibles[indice]] = [];
    renderizarCategorias();
  }
}

function toggleGastosCategoria(categoria) {
  const contenedorGastos = document.getElementById("vista-gastos");
  const contenedorCategorias = document.getElementById("categorias");
  const visible = !contenedorGastos.classList.contains("oculto");

  if (visible) {
    contenedorGastos.classList.add("oculto");
    contenedorGastos.innerHTML = "";
    contenedorCategorias.classList.remove("oculto");
  } else {
    contenedorCategorias.classList.add("oculto");
    contenedorGastos.classList.remove("oculto");
    renderizarGastos(categoria);
  }
}

function renderizarGastos(categoria) {
  const contenedor = document.getElementById("vista-gastos");
  const gastos = gastosPorCategoria[categoria] || [];

  contenedor.innerHTML = `<h2>Gastos en ${categoria}</h2>`;

  let totalCategoria = 0;

  gastos.forEach((gasto, index) => {
    let totalGasto = 0;

    if (gasto.tipo === "fijo" && gasto.cuotas.length > 0) {
      totalGasto = gasto.cuotas.reduce((sum, c) => sum + c.monto, 0);
    } else {
      totalGasto = gasto.monto;
    }

    totalCategoria += totalGasto;

    const div = document.createElement("div");
    div.className = "gasto";

    div.innerHTML = `
      <span>
        ${gasto.descripcion} - $${totalGasto.toLocaleString()} (${gasto.tipo})<br>
        <small>Fecha registro: ${gasto.fechaRegistro || "No disponible"}</small><br>
        ${gasto.tipo === "fijo" ? `
          <small>Desde: ${gasto.fechaInicio || "No disponible"} - Hasta: ${gasto.fechaFin || "No disponible"}</small>
        ` : ""}
      </span>
      <div>
        ${gasto.tipo === "fijo" ? `<button class="boton" onclick="mostrarCuotas('${categoria}', ${index})">+ Cuota</button>` : ""}
        <button class="boton editar" onclick="editarGasto('${categoria}', ${index})">Editar</button>
        <button class="boton eliminar" onclick="eliminarGasto('${categoria}', ${index})">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "total-categoria";
  totalDiv.innerHTML = `<strong>Gastos Totales en ${categoria}: $${totalCategoria.toLocaleString()}</strong>`;
  contenedor.appendChild(totalDiv);

  const btnAgregar = document.createElement("button");
  btnAgregar.className = "boton";
  btnAgregar.textContent = "Agregar Gasto";
  btnAgregar.onclick = () => mostrarFormularioNuevoGasto(categoria);
  contenedor.appendChild(btnAgregar);

  // Botón para volver a categorías
  const btnVolver = document.createElement("button");
  btnVolver.className = "boton eliminar";
  btnVolver.textContent = "Volver a Categorías";
  btnVolver.onclick = () => {
    contenedor.classList.add("oculto");
    document.getElementById("categorias").classList.remove("oculto");
  };
  contenedor.appendChild(btnVolver);
}

function mostrarFormularioNuevoGasto(categoria) {
  const form = document.getElementById("formulario-gasto");
  form.classList.remove("oculto");
  form.innerHTML = `
    <h3>Nuevo Gasto</h3>
    <input type="text" id="desc" placeholder="Descripción">
    <input type="number" id="monto" placeholder="Monto">
    <select id="tipo" onchange="toggleFechasFormulario()">
      <option value="variable">Variable</option>
      <option value="fijo">Fijo</option>
    </select>
    <div id="fechas-fijo" class="oculto">
      <input type="date" id="fecha-inicio" placeholder="Fecha inicio">
      <input type="date" id="fecha-fin" placeholder="Fecha fin">
    </div>
    <button class="boton" onclick="agregarGasto('${categoria}')">Guardar</button>
    <button class="boton eliminar" onclick="cancelarFormularioGasto()">Cancelar</button>
  `;
}

function toggleFechasFormulario() {
  const tipo = document.getElementById("tipo").value;
  const contenedorFechas = document.getElementById("fechas-fijo");
  if (tipo === "fijo") {
    contenedorFechas.classList.remove("oculto");
  } else {
    contenedorFechas.classList.add("oculto");
  }
}

function agregarGasto(categoria) {
  const desc = document.getElementById("desc").value.trim();
  let monto = parseFloat(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;

  if (!desc || isNaN(monto)) {
    alert("Debe ingresar descripción y monto válido");
    return;
  }

  const fechaRegistro = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  let fechaInicio = null;
  let fechaFin = null;

  if (tipo === "fijo") {
    fechaInicio = document.getElementById("fecha-inicio").value;
    fechaFin = document.getElementById("fecha-fin").value;

    if (!fechaInicio || !fechaFin) {
      alert("Debe ingresar fecha inicio y fecha fin para gastos fijos");
      return;
    }

    // Para gastos fijos, monto inicial es 0, se agrega con cuotas
    monto = 0;
  }

  gastosPorCategoria[categoria].push({ descripcion: desc, monto, tipo, fechaRegistro, fechaInicio, fechaFin, cuotas: [] });
  cancelarFormularioGasto();
  renderizarGastos(categoria);
}

function cancelarFormularioGasto() {
  const form = document.getElementById("formulario-gasto");
  form.classList.add("oculto");
  form.innerHTML = "";
}

function editarGasto(categoria, index) {
  const gasto = gastosPorCategoria[categoria][index];
  const form = document.getElementById("formulario-gasto");
  form.classList.remove("oculto");

  form.innerHTML = `
    <h3>Editar Gasto</h3>
    <input type="text" id="desc" value="${gasto.descripcion}">
    <input type="number" id="monto" value="${gasto.monto}">
    <select id="tipo" onchange="toggleFechasFormulario()">
      <option value="variable" ${gasto.tipo === "variable" ? "selected" : ""}>Variable</option>
      <option value="fijo" ${gasto.tipo === "fijo" ? "selected" : ""}>Fijo</option>
    </select>
    <div id="fechas-fijo" class="${gasto.tipo === "fijo" ? "" : "oculto"}">
      <input type="date" id="fecha-inicio" value="${gasto.fechaInicio || ""}">
      <input type="date" id="fecha-fin" value="${gasto.fechaFin || ""}">
    </div>
    <button class="boton" onclick="guardarEdicion('${categoria}', ${index})">Guardar</button>
    <button class="boton eliminar" onclick="cancelarFormularioGasto()">Cancelar</button>
  `;
}

function guardarEdicion(categoria, index) {
  const desc = document.getElementById("desc").value.trim();
  let monto = parseFloat(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;

  if (!desc || isNaN(monto)) {
    alert("Debe ingresar descripción y monto válido");
    return;
  }

  let fechaInicio = null;
  let fechaFin = null;

  if (tipo === "fijo") {
    fechaInicio = document.getElementById("fecha-inicio").value;
    fechaFin = document.getElementById("fecha-fin").value;

    if (!fechaInicio || !fechaFin) {
      alert("Debe ingresar fecha inicio y fecha fin para gastos fijos");
      return;
    }
    monto = 0;
  }

  gastosPorCategoria[categoria][index] = {
    ...gastosPorCategoria[categoria][index],
    descripcion: desc,
    monto,
    tipo,
    fechaInicio,
    fechaFin
  };

  cancelarFormularioGasto();
  renderizarGastos(categoria);
}

function eliminarGasto(categoria, index) {
  if (confirm("¿Está seguro de eliminar este gasto?")) {
    gastosPorCategoria[categoria].splice(index, 1);
    renderizarGastos(categoria);
  }
}

function mostrarCuotas(categoria, indexGasto) {
  const gasto = gastosPorCategoria[categoria][indexGasto];
  let cuotasTexto = gasto.cuotas.map((c, i) => `${i + 1}. $${c.monto.toLocaleString()}`).join("\n");

  const opcion = prompt(`Cuotas actuales:\n${cuotasTexto}\n\nIngrese el monto de la nueva cuota:`);

  const montoCuota = parseFloat(opcion);
  if (!isNaN(montoCuota) && montoCuota > 0) {
    gasto.cuotas.push({ monto: montoCuota });
    renderizarGastos(categoria);
  } else {
    alert("Monto inválido");
  }
}

// Al cargar la página, renderizar categorías
document.addEventListener("DOMContentLoaded", () => {
  renderizarCategorias();
});
