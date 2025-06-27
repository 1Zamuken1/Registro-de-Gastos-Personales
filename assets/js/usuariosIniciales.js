const usuariosIniciales = [
  {
    id: 1,
    usuario: "valeria",
    password: "valeria123",
    email: "valeria@mail.com",
    phone: "3001234567",
    rol: "estudiante",
    ingresos: [
      // Programados
      {
        id: 1,
        concepto: "Salario",
        monto: 1200000,
        descripcion: "Pago mensual por trabajo de medio tiempo",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T10:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-01"
      },
      {
        id: 2,
        concepto: "Subsidios estatales o ayudas gubernamentales",
        monto: 700000,
        descripcion: "Subsidio de transporte universitario",
        fecha: "2024-05-05",
        fijo: "Sí",
        fechaCreacion: "2024-05-05T08:30:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-05"
      },
      {
        id: 3,
        concepto: "Ingresos por arriendo de propiedades",
        monto: 400000,
        descripcion: "Alquiler de habitación",
        fecha: "2024-05-10",
        fijo: "Sí",
        fechaCreacion: "2024-05-10T09:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-10"
      },
      // Variables
      {
        id: 4,
        concepto: "Clases particulares o tutorías",
        monto: 250000,
        descripcion: "Tutoría de matemáticas",
        fecha: "2024-05-12",
        fijo: "No",
        fechaCreacion: "2024-05-12T09:30:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 5,
        concepto: "Venta de productos artesanales o hechos en casa",
        monto: 180000,
        descripcion: "Venta de pulseras hechas a mano",
        fecha: "2024-05-18",
        fijo: "No",
        fechaCreacion: "2024-05-18T14:15:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 6,
        concepto: "Premios de sorteos o rifas",
        monto: 100000,
        descripcion: "Premio en rifa universitaria",
        fecha: "2024-05-25",
        fijo: "No",
        fechaCreacion: "2024-05-25T17:00:00",
        frecuencia: null,
        fechaInicio: null
      }
    ],
    egresos: [],
    ahorros: []
  },
  {
    id: 2,
    usuario: "admin",
    password: "123",
    email: "admin@mail.com",
    phone: "3100000000",
    rol: "administrador",
    ingresos: [],
    egresos: [],
    ahorros: []
  },
  {
    id: 3,
    usuario: "jose",
    password: "jose123",
    email: "jose@mail.com",
    phone: "3111111111",
    rol: "profesor",
    ingresos: [
      // Programados
      {
        id: 1,
        concepto: "Salario",
        monto: 2400000,
        descripcion: "Pago mensual por docencia",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T09:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-01"
      },
      {
        id: 2,
        concepto: "Ingresos por arriendo de propiedades",
        monto: 800000,
        descripcion: "Alquiler de apartamento",
        fecha: "2024-05-03",
        fijo: "Sí",
        fechaCreacion: "2024-05-03T08:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-03"
      },
      {
        id: 3,
        concepto: "Ingresos por negocio propio o familiar",
        monto: 500000,
        descripcion: "Ganancias cafetería familiar",
        fecha: "2024-05-10",
        fijo: "Sí",
        fechaCreacion: "2024-05-10T12:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-10"
      },
      // Variables
      {
        id: 4,
        concepto: "Clases particulares o tutorías",
        monto: 350000,
        descripcion: "Clase magistral por invitación",
        fecha: "2024-05-15",
        fijo: "No",
        fechaCreacion: "2024-05-15T11:00:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 5,
        concepto: "Ingresos por contenido digital",
        monto: 500000,
        descripcion: "Ingreso por ventas de curso online",
        fecha: "2024-05-20",
        fijo: "No",
        fechaCreacion: "2024-05-20T16:00:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 6,
        concepto: "Comisiones por ventas",
        monto: 200000,
        descripcion: "Comisión por venta de libros",
        fecha: "2024-05-27",
        fijo: "No",
        fechaCreacion: "2024-05-27T18:00:00",
        frecuencia: null,
        fechaInicio: null
      }
    ],
    egresos: [],
    ahorros: []
  },
  {
    id: 4,
    usuario: "camila",
    password: "camila321",
    email: "camila@mail.com",
    phone: "3122222222",
    rol: "estudiante",
    ingresos: [
      // Programados
      {
        id: 1,
        concepto: "Subsidios estatales o ayudas gubernamentales",
        monto: 700000,
        descripcion: "Ayuda mensual de sostenimiento",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T08:30:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-01"
      },
      {
        id: 2,
        concepto: "Salario",
        monto: 900000,
        descripcion: "Trabajo de medio tiempo",
        fecha: "2024-05-03",
        fijo: "Sí",
        fechaCreacion: "2024-05-03T09:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-03"
      },
      {
        id: 3,
        concepto: "Ingresos por negocio propio o familiar",
        monto: 300000,
        descripcion: "Venta de postres caseros",
        fecha: "2024-05-07",
        fijo: "Sí",
        fechaCreacion: "2024-05-07T10:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-07"
      },
      // Variables
      {
        id: 4,
        concepto: "Venta de productos artesanales o hechos en casa",
        monto: 200000,
        descripcion: "Ventas semanales de bisutería",
        fecha: "2024-05-10",
        fijo: "No",
        fechaCreacion: "2024-05-10T12:45:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 5,
        concepto: "Clases particulares o tutorías",
        monto: 150000,
        descripcion: "Tutorías de matemáticas",
        fecha: "2024-05-22",
        fijo: "No",
        fechaCreacion: "2024-05-22T13:15:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 6,
        concepto: "Premios de sorteos o rifas",
        monto: 80000,
        descripcion: "Premio en sorteo estudiantil",
        fecha: "2024-05-28",
        fijo: "No",
        fechaCreacion: "2024-05-28T17:30:00",
        frecuencia: null,
        fechaInicio: null
      }
    ],
    egresos: [],
    ahorros: []
  },
  {
    id: 5,
    usuario: "pedro",
    password: "pedrito",
    email: "pedro@mail.com",
    phone: "3133333333",
    rol: "profesor",
    ingresos: [
      // Programados
      {
        id: 1,
        concepto: "Salario",
        monto: 2100000,
        descripcion: "Pago regular por docencia",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T07:50:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-01"
      },
      {
        id: 2,
        concepto: "Ingresos por negocio propio o familiar",
        monto: 600000,
        descripcion: "Ganancias panadería familiar",
        fecha: "2024-05-05",
        fijo: "Sí",
        fechaCreacion: "2024-05-05T10:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-05"
      },
      {
        id: 3,
        concepto: "Ingresos por arriendo de propiedades",
        monto: 400000,
        descripcion: "Alquiler de garaje",
        fecha: "2024-05-09",
        fijo: "Sí",
        fechaCreacion: "2024-05-09T11:00:00",
        frecuencia: "mensual",
        fechaInicio: "2024-05-09"
      },
      // Variables
      {
        id: 4,
        concepto: "Clases particulares o tutorías",
        monto: 400000,
        descripcion: "Refuerzo académico",
        fecha: "2024-05-11",
        fijo: "No",
        fechaCreacion: "2024-05-11T10:30:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 5,
        concepto: "Servicios técnicos o asesorías profesionales",
        monto: 600000,
        descripcion: "Servicio profesional",
        fecha: "2024-05-19",
        fijo: "No",
        fechaCreacion: "2024-05-19T15:20:00",
        frecuencia: null,
        fechaInicio: null
      },
      {
        id: 6,
        concepto: "Ingresos por contenido digital",
        monto: 250000,
        descripcion: "Venta de curso en línea",
        fecha: "2024-05-25",
        fijo: "No",
        fechaCreacion: "2024-05-25T18:00:00",
        frecuencia: null,
        fechaInicio: null
      }
    ],
    egresos: [],
    ahorros: []
  },
  {
    id: 6,
    usuario: "laura",
    password: "lauraAdmin",
    email: "laura@mail.com",
    phone: "3144444444",
    rol: "administrador",
    ingresos: [],
    egresos: [],
    ahorros: []
  }
];

// Exportar para Node.js o navegador
if (typeof module !== "undefined") {
  module.exports = usuariosIniciales;
} else {
  window.usuariosIniciales = usuariosIniciales;
}

// Inicialización robusta de ingresos en localStorage para todos los usuarios excepto admin
(function initIngresosUsuarios() {
  if (!Array.isArray(window.usuariosIniciales)) return;
  window.usuariosIniciales.forEach(u => {
    if (u.rol && u.rol.toLowerCase().includes('admin')) return;
    if (!Array.isArray(u.ingresos)) return;
    const programados = u.ingresos.filter(i => i.fijo === "Sí");
    const variables = u.ingresos.filter(i => i.fijo === "No");
    localStorage.setItem(`ingresos_usuario_${u.id}`, JSON.stringify(programados));
    localStorage.setItem(`ingresos_variables_usuario_${u.id}`, JSON.stringify(variables));
    u.ingresos = [];
  });
})();
