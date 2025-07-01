window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado");

    // Variables globales para los gráficos
    let chartAhorros, chartBalance, chartTreemap;

    // Datos base para generar variaciones realistas
    const ahorrosBase = [
        { categoria: "Fondo de emergencia", base: 80000, min: 75000, max: 120000 },
        { categoria: "Viaje", base: 70000, min: 60000, max: 90000 },
        { categoria: "Educación", base: 60000, min: 50000, max: 80000 },
        { categoria: "Salud", base: 50000, min: 40000, max: 70000 },
        { categoria: "Tecnología", base: 40000, min: 30000, max: 60000 },
    ];

    const gastosBase = [
        { categoria: "Transporte", base: 120000, min: 80000, max: 180000 },
        { categoria: "Comida", base: 95000, min: 70000, max: 140000 },
        { categoria: "Entretenimiento", base: 20000, min: 10000, max: 50000 },
        { categoria: "Servicios", base: 30000, min: 25000, max: 45000 },
        { categoria: "Salud", base: 15000, min: 10000, max: 30000 },
    ];

    const balanceBase = {
        ingresos: [100000, 120000, 90000, 110000, 130000, 100000],
        egresos: [40000, 50000, 35000, 45000, 60000, 55000]
    };

    // Función para generar variación realista
    function generarVariacion(valor, min, max) {
        const variacion = (Math.random()+ 0.1) * 0.1; // ±15% de variación
        const nuevoValor = valor * (1 + variacion);
        return Math.max(min, Math.min(max, Math.round(nuevoValor / 1000) * 1000));
    }

    // Función para generar datos actualizados de ahorros
    function generarDatosAhorros() {
        return ahorrosBase.map(item => ({
            categoria: item.categoria,
            monto: generarVariacion(item.base, item.min, item.max)
        }));
    }

    // Función para generar datos actualizados de gastos
    function generarDatosGastos() {
        return gastosBase.map(item => ({
            categoria: item.categoria,
            monto: generarVariacion(item.base, item.min, item.max)
        }));
    }

    // Función para generar datos actualizados de balance
    function generarDatosBalance() {
        const nuevosIngresos = balanceBase.ingresos.map(valor => 
            generarVariacion(valor, valor * 0.7, valor * 1.4)
        );
        const nuevosEgresos = balanceBase.egresos.map(valor => 
            generarVariacion(valor, valor * 0.6, valor * 1.8)
        );
        
        return {
            ingresos: nuevosIngresos,
            egresos: nuevosEgresos
        };
    }

    // Función para actualizar estadísticas principales
    function actualizarEstadisticas(ahorros, gastos, balance) {
        const totalAhorros = ahorros.reduce((acc, a) => acc + a.monto, 0);
        const totalEgresos = gastos.reduce((acc, g) => acc + g.monto, 0);
        const ingresosActuales = balance.ingresos.reduce((acc, i) => acc + i, 0);
        const saldoNeto = ingresosActuales - totalEgresos;

        document.getElementById("ingresos-stat").textContent = `$${ingresosActuales.toLocaleString()}`;
        document.getElementById("egresos-stat").textContent = `$${totalEgresos.toLocaleString()}`;
        document.getElementById("saldo-stat").textContent = `$${saldoNeto.toLocaleString()}`;
        document.getElementById("ahorros-stat").textContent = `$${totalAhorros.toLocaleString()}`;
    }

    // Función para inicializar los gráficos
    function inicializarGraficos() {
        const ahorros = generarDatosAhorros();
        const gastos = generarDatosGastos();
        const balance = generarDatosBalance();

        // Actualizar estadísticas
        actualizarEstadisticas(ahorros, gastos, balance);

        // Gráfico de Ahorros (Pie Chart)
        chartAhorros = new ApexCharts(document.querySelector("#chartAhorros"), {
            series: ahorros.map((a) => a.monto),
            chart: {
                width: 380,
                type: "pie",
                background: "#FFFFFF",
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 1500,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 1000
                    }
                }
            },
            labels: ahorros.map((a) => a.categoria),
            colors: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#45a049"],
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
                    colors: "#333333",
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

        // Gráfico de Balance (Line Chart)
        chartBalance = new ApexCharts(document.querySelector("#chartBalance"), {
            series: [
                {
                    name: "Ingresos",
                    data: balance.ingresos,
                },
                { name: "Egresos", data: balance.egresos },
            ],
            chart: {
                type: "line",
                height: 350,
                background: "#FFFFFF",
                toolbar: { theme: "light" },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 1500,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 1000
                    }
                }
            },
            colors: ["#4CAF50", "#FF9800"],
            stroke: {
                width: 4,
                curve: "smooth",
            },
            markers: {
                size: 6,
                colors: ["#4CAF50", "#FF9800"],
                strokeColors: "#333333",
                strokeWidth: 2,
            },
            xaxis: {
                categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
                labels: {
                    style: {
                        colors: "#333333",
                        fontSize: "12px",
                        fontWeight: "bold",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#333333",
                        fontSize: "12px",
                        fontWeight: "bold",
                    },
                    formatter: (val) => `$${val.toLocaleString()}`,
                },
            },
            legend: {
                labels: {
                    colors: "#333333",
                    useSeriesColors: false,
                },
            },
            grid: {
                borderColor: "#ddd",
                strokeDashArray: 3,
            },
            tooltip: {
                theme: "light",
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    colors: ["#333333"]
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

        // Gráfico Treemap
        chartTreemap = new ApexCharts(
            document.querySelector("#treemap-gastos"),
            {
                series: [
                    { data: gastos.map((g) => ({ x: g.categoria, y: g.monto })) },
                ],
                chart: {
                    type: "treemap",
                    height: 300,
                    background: "#FFFFFF",
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 1500,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 1000
                        }
                    }
                },
                colors: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#1976D2"],
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
    }

    // Función para actualizar todos los gráficos
    function actualizarGraficos() {
        console.log("Actualizando gráficos...");
        
        const nuevosAhorros = generarDatosAhorros();
        const nuevosGastos = generarDatosGastos();
        const nuevoBalance = generarDatosBalance();

        // Actualizar estadísticas
        actualizarEstadisticas(nuevosAhorros, nuevosGastos, nuevoBalance);

        // Actualizar gráfico de ahorros
        chartAhorros.updateSeries(nuevosAhorros.map(a => a.monto));

        // Actualizar gráfico de balance
        chartBalance.updateSeries([
            {
                name: "Ingresos",
                data: nuevoBalance.ingresos,
            },
            { 
                name: "Egresos", 
                data: nuevoBalance.egresos 
            },
        ]);

        // Actualizar gráfico treemap
        chartTreemap.updateSeries([
            { data: nuevosGastos.map((g) => ({ x: g.categoria, y: g.monto })) },
        ]);
    }

    // Inicializar gráficos
    inicializarGraficos();

    // Configurar actualización cada 3 minutos (180000 ms)
    setInterval(actualizarGraficos, 5000);

    // Lógica de alertas (sin cambios)
    const alertaDiv = document.getElementById("alerta");
    function actualizarAlerta() {
        const gastosActuales = generarDatosGastos();
        const mayorGasto = gastosActuales.reduce((max, gasto) =>
            gasto.monto > max.monto ? gasto : max
        );
        const mensaje = `Estás gastando mucho en ${mayorGasto.categoria}. Revisa si puedes reducir ese gasto.`;
        alertaDiv.textContent = mensaje;
    }
    actualizarAlerta();
    setInterval(actualizarAlerta, 10000);

    // Lógica de recomendaciones (sin cambios)
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
        const texto = `${categoria}: ${lista[indiceRecomendacion]}`;
        recordatorioDiv.textContent = texto;

        indiceRecomendacion = (indiceRecomendacion + 1) % lista.length;
        if (indiceRecomendacion === 0) {
            categoriaActual = (categoriaActual + 1) % categorias.length;
        }
    }
    actualizarRecomendacion();
    setInterval(actualizarRecomendacion, 12000);

    // Mensajes motivacionales (sin cambios)
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
        mensajeDiv.textContent = mensajesApoyo[iMensaje];
        iMensaje = (iMensaje + 1) % mensajesApoyo.length;
    }
    actualizarMensaje();
    setInterval(actualizarMensaje, 15000);
});