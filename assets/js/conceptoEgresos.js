const tiposEgreso = [
  { categoria: "Vivienda", subcategorias: ["Arriendo", "Cuota de hipoteca", "Servicios públicos (agua, luz, gas)", "Internet y telefonía", "Administración o mantenimiento", "Reparaciones del hogar", "Aseo y limpieza"] },
  { categoria: "Alimentación", subcategorias: ["Supermercado", "Comidas fuera de casa", "Domicilios", "Cafetería o snacks", "Desayunos en la calle"] },
  { categoria: "Transporte", subcategorias: ["Gasolina", "Pasajes (bus, metro)", "Parqueadero", "Mantenimiento del vehículo", "Seguro vehicular", "Peajes"] },
  { categoria: "Educación", subcategorias: ["Matrículas", "Útiles escolares", "Libros", "Cursos y talleres", "Transporte escolar", "Plataformas educativas"] },
  { categoria: "Salud", subcategorias: ["Medicina prepagada", "Medicamentos", "Consultas médicas", "Exámenes médicos", "Odontología", "Seguros de salud"] },
  { categoria: "Familia e hijos", subcategorias: ["Cuidado de niños", "Ropa para niños", "Juguetes", "Guardería o colegio", "Pañales y artículos de bebé"] },
  { categoria: "Vestuario e imagen", subcategorias: ["Ropa", "Zapatos", "Accesorios", "Peluquería o barbería", "Cosméticos y cuidado personal"] },
  { categoria: "Bienestar y entretenimiento", subcategorias: ["Gimnasio", "Cine", "Salidas y fiestas", "Videojuegos", "Streaming (Netflix, Spotify, etc.)", "Libros de ocio"] },
  { categoria: "Compras generales", subcategorias: ["Electrodomésticos", "Muebles", "Tecnología", "Decoración", "Herramientas"] },
  { categoria: "Finanzas y obligaciones", subcategorias: ["Pago de tarjetas de crédito", "Préstamos personales", "Impuestos", "Multas", "Comisiones bancarias", "Ahorros programados", "Transferencias a terceros"] },
  { categoria: "Mascotas", subcategorias: ["Comida para mascotas", "Veterinario", "Accesorios", "Cuidado o guardería"] },
  { categoria: "Regalos y celebraciones", subcategorias: ["Cumpleaños", "Navidad", "Día de la madre/padre", "Detalles o sorpresas", "Donaciones"] },
  { categoria: "Otros / misceláneos", subcategorias: ["Proyectos personales", "Reparaciones inesperadas", "Gastos imprevistos", "Costos legales o notariales"] }
];

// Crear lista global plana de subcategorías
window.subcategoriasDisponiblesGlobal = [];
tiposEgreso.forEach(grupo => {
  grupo.subcategorias.forEach(sub => {
    window.subcategoriasDisponiblesGlobal.push(sub);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("../components/conceptoEgresos.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("contenedor-concepto").innerHTML = html;
      inicializarModalCategorias();
      cargarSubcategoriasGuardadas(); 
    })
    .catch(error => console.error("Error al cargar el componente:", error));
});

function inicializarModalCategorias() {
  const modal = document.getElementById("modal");
  const btnAbrir = document.getElementById("agregarCategoriaBtn");
  const btnCerrar = document.querySelector(".close");
  const select = document.getElementById("selectorCategorias");
  const contenedor = document.getElementById("categoriasSeleccionadas");

  if (!modal || !btnAbrir || !btnCerrar || !select || !contenedor) return;

  btnAbrir.onclick = () => {
    llenarSelect();
    modal.style.display = "block";
  };

  btnCerrar.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  select.onchange = () => {
    const subcategoria = select.value;
    const idSafe = subcategoria.replace(/\s+/g, "_").toLowerCase();

    if (document.getElementById(`cuadro_${idSafe}`)) {
      modal.style.display = "none";
      return;
    }

    const div = document.createElement("div");
    div.className = "categoria-cuadro";
    div.id = `cuadro_${idSafe}`;
    div.textContent = subcategoria;
    contenedor.appendChild(div);
    modal.style.display = "none";

    // Guardar en localStorage
    let seleccionadas = JSON.parse(localStorage.getItem("subcategoriasSeleccionadas")) || [];
    if (!seleccionadas.includes(subcategoria)) {
      seleccionadas.push(subcategoria);
      localStorage.setItem("subcategoriasSeleccionadas", JSON.stringify(seleccionadas));
    }

    // Mostrar gastos
    window.mostrarGastosSubcategoria(subcategoria);

    // Evento para mostrar modal al hacer clic en el cuadro
    div.onclick = () => {
      window.mostrarGastosSubcategoria(subcategoria);
    };
  };

  function llenarSelect() {
    select.innerHTML = `<option disabled selected>-- Elige una subcategoría --</option>`;
    tiposEgreso.forEach(grupo => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = grupo.categoria;
      grupo.subcategorias.forEach(sub => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });
  }
}

function cargarSubcategoriasGuardadas() {
  const contenedor = document.getElementById("categoriasSeleccionadas");
  if (!contenedor) return;

  const guardadas = JSON.parse(localStorage.getItem("subcategoriasSeleccionadas")) || [];

  guardadas.forEach(subcategoria => {
    const idSafe = subcategoria.replace(/\s+/g, "_").toLowerCase();
    if (!document.getElementById(`cuadro_${idSafe}`)) {
      const div = document.createElement("div");
      div.className = "categoria-cuadro";
      div.id = `cuadro_${idSafe}`;
      div.textContent = subcategoria;

      div.onclick = () => {
        window.mostrarGastosSubcategoria(subcategoria);
      };

      contenedor.appendChild(div);
    }
  });
}
