window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado");

  const ahorros = [
    { categoria: "Fondo de emergencia", monto: 80000 },
    { categoria: "Viaje", monto: 70000 },
    { categoria: "Educación", monto: 60000 },
    { categoria: "Salud", monto: 50000 },
    { categoria: "Tecnología", monto: 40000 },
  ];
  const totalAhorros = ahorros.reduce((acc, a) => acc + a.monto, 0);

  const ingresosSimulados = 1000000;
  const ahorrosSimulados = totalAhorros;

  const gastosRecientes = [
    { categoria: "Transporte", monto: 120000 },
    { categoria: "Comida", monto: 95000 },
    { categoria: "Entretenimiento", monto: 20000 },
    { categoria: "Servicios", monto: 30000 },
    { categoria: "Salud", monto: 15000 },
  ];
  const totalEgresos = gastosRecientes.reduce((acc, g) => acc + g.monto, 0);
  const saldoNeto = ingresosSimulados - totalEgresos;

  document.getElementById(
    "ingresos"
  ).textContent = `Total ingresos: $${ingresosSimulados.toLocaleString()}`;
  document.getElementById(
    "egresos"
  ).textContent = `Total egresos: $${totalEgresos.toLocaleString()}`;
  document.getElementById(
    "neto"
  ).textContent = `Saldo neto: $${saldoNeto.toLocaleString()}`;

  const chartAhorros = new ApexCharts(document.querySelector("#chartAhorros"), {
    series: ahorros.map((a) => a.monto),
    chart: {
      width: 380,
      type: "pie",
      background: "#FFFFFF",
    },
    labels: ahorros.map((a) => a.categoria),
    colors: ["#8D5A97", "#472D4C", "#A569BD", "#B19CD9", "#9B59B6"],
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#FFFFFF"],
        fontSize: "12px",
        fontWeight: "bold",
      },
      formatter: (val, opts) =>
        `$${ahorros[opts.seriesIndex].monto.toLocaleString()}`,
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `$${val.toLocaleString()}` },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#000000",
        useSeriesColors: false,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 250 },
          legend: { position: "bottom" },
        },
      },
    ],
  });
  chartAhorros.render();

  const chartBalance = new ApexCharts(document.querySelector("#chartBalance"), {
    series: [
      {
        name: "Ingresos",
        data: [100000, 120000, 90000, 110000, 130000, 100000],
      },
      { name: "Egresos", data: [40000, 50000, 35000, 45000, 60000, 55000] },
    ],
    chart: {
      type: "line",
      height: 400,
      width: "80%",
      background: "#FFFFFF",
      toolbar: { theme: "light" },
    },
    colors: ["#8D5A97", "#A569BD"],
    stroke: {
      width: 4,
      curve: "smooth",
    },
    markers: {
      size: 6,
      colors: ["#8D5A97", "#A569BD"],
      strokeColors: "#000000",
      strokeWidth: 2,
    },
    xaxis: {
      categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      labels: {
        style: {
          colors: "#000000",
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000000",
          fontSize: "12px",
          fontWeight: "bold",
        },
        formatter: (val) => `$${val.toLocaleString()}`,
      },
    },
    legend: {
      labels: {
        colors: "#000000",
        useSeriesColors: false,
      },
    },
    grid: {
      borderColor: "#472D4C",
      strokeDashArray: 3,
    },
    tooltip: {
  theme: "light",
  style: {
    fontSize: "14px",
    fontWeight: "bold",
    colors: ["#000000"]
  },
  x: {
    show: true,
    formatter: (val) => `Mes: ${val}`,
  },
  y: {
    formatter: function (val, { seriesIndex, w }) {
      try {
        const nombreSerie = w.globals.seriesNames[seriesIndex] || "Valor";
        return `${nombreSerie}: $${val.toLocaleString()}`;
      } catch (e) {
        return `$${val.toLocaleString()}`;
      }
    }
  }
}

  });

  chartBalance.render();

  const chartTreemap = new ApexCharts(
    document.querySelector("#treemap-gastos"),
    {
      series: [
        { data: gastosRecientes.map((g) => ({ x: g.categoria, y: g.monto })) },
      ],
      chart: {
        type: "treemap",
        height: 350,
        background: "#b3b7cf",
      },
      title: {
        text: "Gastos recientes por categoría",
        align: "center",
        style: {
          color: "#000000",
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      colors: ["#8D5A97", "#472D4C", "#A569BD", "#B19CD9", "#9B59B6"],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          colors: ["#FFFFFF"],
        },
        formatter: function (text, op) {
          const valor = op.value.toLocaleString("es-CO");
          return `${text}\n$${valor}`;
        },
      },
      tooltip: {
        theme: "light",
      },
    }
  );
  chartTreemap.render();

  const alertaDiv = document.getElementById("alerta");
  function actualizarAlerta() {
    const mayorGasto = gastosRecientes.reduce((max, gasto) =>
      gasto.monto > max.monto ? gasto : max
    );
    const mensaje = `⚠️ Estás gastando mucho en ${mayorGasto.categoria}. Revisa si puedes reducir ese gasto.`;
    alertaDiv.textContent = mensaje;
  }
  actualizarAlerta();
  setInterval(actualizarAlerta, 10000);

  const recordatorioDiv = document.getElementById("recordatorio");
  const recomendaciones = {
    Transporte: [
      "Camina o usa bicicleta",
      "Comparte transporte",
      "Usa transporte público",
    ],
    Comida: ["Presupuesto semanal", "Compra a granel", "Evita comer fuera"],
    Entretenimiento: [
      "Busca actividades gratuitas",
      "Limita suscripciones",
      "Haz planes en casa",
    ],
    Servicios: [
      "Apaga luces",
      "Desconecta cargadores",
      "Reduce el aire acondicionado",
    ],
    Salud: [
      "Compara medicamentos",
      "Consulta EPS",
      "Usa beneficios del sistema",
    ],
  };
  let categoriaActual = 0;
  let indiceRecomendacion = 0;
  const categorias = Object.keys(recomendaciones);

  function actualizarRecomendacion() {
    const categoria = categorias[categoriaActual];
    const lista = recomendaciones[categoria];
    const texto = `💡 ${categoria}: ${lista[indiceRecomendacion]}`;
    recordatorioDiv.textContent = texto;

    indiceRecomendacion = (indiceRecomendacion + 1) % lista.length;
    if (indiceRecomendacion === 0) {
      categoriaActual = (categoriaActual + 1) % categorias.length;
    }
  }
  actualizarRecomendacion();
  setInterval(actualizarRecomendacion, 12000);

  const mensajeDiv = document.getElementById("mensaje");
  const mensajesApoyo = [
    "¡Vas por buen camino, sigue así!",
    "Recuerda: cada peso que ahorras cuenta.",
    "Mantén la disciplina, tu futuro financiero lo agradecerá.",
    "¡Tú puedes lograr tus metas de ahorro!",
    "Evitar gastos innecesarios te dará más tranquilidad.",
    "Revisar tus finanzas con frecuencia te da control.",
  ];
  let iMensaje = 0;

  function actualizarMensaje() {
    mensajeDiv.textContent = `💬 ${mensajesApoyo[iMensaje]}`;
    iMensaje = (iMensaje + 1) % mensajesApoyo.length;
  }
  actualizarMensaje();
  setInterval(actualizarMensaje, 15000);
});
