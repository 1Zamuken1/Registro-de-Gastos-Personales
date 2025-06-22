const usuariosIniciales = [
  {
    id: 1,
    usuario: "valeria",
    password: "valeria123",
    email: "valeria@mail.com",
    phone: "3001234567",
    rol: "estudiante",
    ingresos: [
      {
        id: 1,
        concepto: "Salario mensual",
        monto: 1200000,
        descripcion: "Pago por trabajo",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T10:00:00"
      },
      {
        id: 2,
        concepto: "Clases particulares",
        monto: 250000,
        descripcion: "Apoyo académico",
        fecha: "2024-05-12",
        fijo: "No",
        fechaCreacion: "2024-05-12T09:30:00"
      },
      {
        id: 3,
        concepto: "Venta de manualidades",
        monto: 180000,
        descripcion: "Hecho a mano",
        fecha: "2024-05-18",
        fijo: "No",
        fechaCreacion: "2024-05-18T14:15:00"
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
      {
        id: 1,
        concepto: "Salario docente",
        monto: 2400000,
        descripcion: "Pago mensual por docencia",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T09:00:00"
      },
      {
        id: 2,
        concepto: "Seminario extra",
        monto: 350000,
        descripcion: "Clase magistral por invitación",
        fecha: "2024-05-15",
        fijo: "No",
        fechaCreacion: "2024-05-15T11:00:00"
      },
      {
        id: 3,
        concepto: "Curso online",
        monto: 500000,
        descripcion: "Ingreso por ventas de curso",
        fecha: "2024-05-20",
        fijo: "No",
        fechaCreacion: "2024-05-20T16:00:00"
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
      {
        id: 1,
        concepto: "Beca estudiantil",
        monto: 700000,
        descripcion: "Ayuda mensual",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T08:30:00"
      },
      {
        id: 2,
        concepto: "Venta de postres",
        monto: 200000,
        descripcion: "Ventas semanales",
        fecha: "2024-05-10",
        fijo: "No",
        fechaCreacion: "2024-05-10T12:45:00"
      },
      {
        id: 3,
        concepto: "Tutorías",
        monto: 150000,
        descripcion: "Tutorías de matemáticas",
        fecha: "2024-05-22",
        fijo: "No",
        fechaCreacion: "2024-05-22T13:15:00"
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
      {
        id: 1,
        concepto: "Salario mensual",
        monto: 2100000,
        descripcion: "Pago regular",
        fecha: "2024-05-01",
        fijo: "Sí",
        fechaCreacion: "2024-05-01T07:50:00"
      },
      {
        id: 2,
        concepto: "Clases particulares",
        monto: 400000,
        descripcion: "Refuerzo académico",
        fecha: "2024-05-11",
        fijo: "No",
        fechaCreacion: "2024-05-11T10:30:00"
      },
      {
        id: 3,
        concepto: "Asesoría externa",
        monto: 600000,
        descripcion: "Servicio profesional",
        fecha: "2024-05-19",
        fijo: "No",
        fechaCreacion: "2024-05-19T15:20:00"
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
