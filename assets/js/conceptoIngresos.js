const tiposIngreso = [
  { categoria: "Trabajo y profesión", subcategorias: ["Salario", "Horas extra", "Bonificaciones", "Honorarios profesionales", "Comisiones por ventas", "Propinas"] },
  { categoria: "Negocios y ventas", subcategorias: ["Ventas de productos", "Ganancias de negocio propio", "Alquiler de propiedades", "Venta de activos", "Licencias o franquicias"] },
  { categoria: "Rendimientos financieros", subcategorias: ["Intereses bancarios", "Dividendos", "Ganancias por inversiones", "Rendimientos de CDT", "Criptomonedas"] },
  { categoria: "Subsidios y ayudas", subcategorias: ["Subsidio de transporte", "Subsidio de alimentación", "Apoyos gubernamentales", "Becas o auxilios educativos"] },
  { categoria: "Ingresos ocasionales", subcategorias: ["Regalos en efectivo", "Herencias", "Loterías o premios", "Reembolsos", "Donaciones recibidas"] },
  { categoria: "Educación", subcategorias: ["Clases particulares", "Cursos o talleres dictados", "Mentorías pagas", "Contenidos digitales vendidos"] },
  { categoria: "Tecnología y digital", subcategorias: ["Publicidad en redes", "YouTube / TikTok / Streaming", "Afiliaciones", "Freelance tecnológico", "Apps o software propio"] },
  { categoria: "Otros ingresos", subcategorias: ["Ingresos no clasificados", "Indemnizaciones", "Compensaciones laborales"] }
];

// Crear lista global plana de subcategorías
window.subcategoriasDisponiblesGlobal = [];
tiposIngreso.forEach(grupo => {
  grupo.subcategorias.forEach(sub => {
    window.subcategoriasDisponiblesGlobal.push(sub);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("../components/conceptoIngresos.html")
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

    // Mostrar ingresos
    window.mostrarIngresosSubcategoria(subcategoria);

    // Evento para mostrar modal al hacer clic en el cuadro
    div.onclick = () => {
      window.mostrarIngresosSubcategoria(subcategoria);
    };
  };

  function llenarSelect() {
    select.innerHTML = `<option disabled selected>-- Elige una subcategoría --</option>`;
    tiposIngreso.forEach(grupo => {
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
        window.mostrarIngresosSubcategoria(subcategoria);
      };

      contenedor.appendChild(div);
    }
  });
}
