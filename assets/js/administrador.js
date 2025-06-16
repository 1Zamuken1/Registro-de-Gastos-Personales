/* <script src="
https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js
"></script> */

// === FUNCIONES PRINCIPALES DE GESTIÓN DE USUARIOS ===

// Función para asignar IDs a usuarios existentes que no los tengan
function asignarIDsAUsuariosExistentes() {
  const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
  let cambiosRealizados = false;
  let siguienteId = 1;

  // Primero, encontrar el ID más alto existente
  usuarios.forEach((usuario) => {
    if (usuario.id && typeof usuario.id === "number") {
      siguienteId = Math.max(siguienteId, usuario.id + 1);
    }
  });

  // Luego, asignar IDs a usuarios que no los tengan
  usuarios.forEach((usuario, index) => {
    if (!usuario.id || typeof usuario.id !== "number") {
      usuario.id = siguienteId;
      siguienteId++;
      cambiosRealizados = true;
    }
  });

  if (cambiosRealizados) {
    sessionStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("IDs asignados a usuarios existentes");
  }

  return usuarios;
}

// Función para obtener el próximo ID disponible
function obtenerSiguienteId() {
  const usuarios = obtenerUsuarios();
  if (usuarios.length === 0) return 1;

  // Filtra usuarios que tienen ID válido y encuentra el ID más alto
  const usuariosConId = usuarios.filter(
    (u) => u.id && typeof u.id === "number"
  );
  if (usuariosConId.length === 0) return 1;

  const maxId = Math.max(...usuariosConId.map((u) => u.id));
  return maxId + 1;
}

// Obtener lista de usuarios desde sessionStorage (FUNCIÓN PRINCIPAL)
function obtenerUsuarios() {
  // Siempre obtener usuarios actualizados y asignar IDs si es necesario
  return asignarIDsAUsuariosExistentes();
}

// === FUNCIÓN PARA MOSTRAR INFORMACIÓN DEL USUARIO ACTIVO ===
// === FUNCIÓN PARA MOSTRAR INFORMACIÓN DEL USUARIO ACTIVO ===
function mostrarInformacionUsuarioActivo() {
  const usuarioActivoId = sessionStorage.getItem("usuarioActivoId");
  const usuarioActivoNombre = sessionStorage.getItem("usuarioActivo");
  
  if (usuarioActivoId) {
    const usuario = obtenerUsuarioPorId(parseInt(usuarioActivoId));
    if (usuario) {
      // Actualizar el contenido de la sección informacion
      const informacionDiv = document.querySelector('.informacion');
      if (informacionDiv) {
        informacionDiv.innerHTML = `
          <h2>Panel de Administración - Bienvenido ${usuario.usuario}</h2>
          <p>Usuario: ${usuario.usuario}</p>
          <p>Password: ${usuario.password}</p>
          <p>Email: ${usuario.email}</p>
          <p>Phone: ${usuario.phone}</p>
          <p>Rol: ${usuario.rol}</p>
        `;
      }
    }
  } else if (usuarioActivoNombre) {
    // Fallback si solo tenemos el nombre de usuario
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.usuario === usuarioActivoNombre);
    if (usuario) {
      const informacionDiv = document.querySelector('.informacion');
      if (informacionDiv) {
        informacionDiv.innerHTML = `
          <h2>Panel de Administración - Bienvenido ${usuario.usuario}</h2>
          <p>Usuario: ${usuario.usuario}</p>
          <p>Password: ${usuario.password}</p>
          <p>Email: ${usuario.email}</p>
          <p>Phone: ${usuario.phone}</p>
          <p>Rol: ${usuario.rol}</p>
        `;
      }
    }
  }
}

// === FUNCIONES DE INTERFAZ DE USUARIO ===

// Mostrar el modal de usuarios en tabla
function mostrarUsuarios() {
  const usuarios = obtenerUsuarios();

  // Mostrar el modal primero para asegurar que el DOM esté disponible
  document.getElementById("modalUsuarios").style.display = "flex";

  const tabla = $("#tablaUsuarios");

  // Destruir DataTable si ya existe
  if ($.fn.DataTable.isDataTable("#tablaUsuarios")) {
    tabla.DataTable().destroy();
  }

  // Limpiar manualmente el contenido del tbody
  const tbody = document.querySelector("#tablaUsuarios tbody");
  tbody.innerHTML = "";

usuarios.forEach((u) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${u.id}</td>
    <td>${u.usuario}</td>
    <td>${u.email}</td>
    <td>${u.phone}</td>
    <td>${u.rol}</td>
    <td>
      <button class="btn-editar" onclick="editarUsuarioModal(${u.id})">Editar</button>
      <button class="btn-eliminar" onclick="eliminarUsuarioConfirmar(${u.id})">Eliminar</button>
    </td>
  `;
  tbody.appendChild(tr);
});


  // Volver a inicializar la tabla
  tabla.DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    responsive: true,
    pageLength: 10,
    autoWidth: false,
    columns: [
      { searchable: true }, // ID
      { searchable: true }, // Usuario
      { searchable: true }, // Email
      { searchable: true }, // Teléfono
      { searchable: true }, // Rol
      { searchable: false }, // Acciones
    ],
  });
}



function cerrarModalUsuarios() {
  document.getElementById("modalUsuarios").style.display = "none";
}

// Mostrar modal de creación
function abrirFormularioCreacion() {
  // Mostrar el próximo ID que se asignará
  const proximoId = obtenerSiguienteId();
  const idField = document.getElementById("idUsuario");
  if (idField) {
    idField.value = `#${proximoId} (Se asignará automáticamente)`;
  }

  document.getElementById("modalCrearUsuario").style.display = "flex";
}

function cerrarModalCreacion() {
  document.getElementById("modalCrearUsuario").style.display = "none";
}

// === EVENTOS DEL DOM ===

// Evento: crear usuario desde el formulario modal
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar información del usuario activo al cargar la página
  mostrarInformacionUsuarioActivo();

  const form = document.getElementById("formCrearUsuario");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const usuario = document.getElementById("nuevoUsuario").value.trim();
      const email = document.getElementById("nuevoCorreo").value.trim();
      const phone = document.getElementById("nuevoPhone").value.trim();
      const password = document.getElementById("nuevoPassword").value.trim();
      const rol = document.getElementById("nuevoRol").value;

      // Validaciones básicas
      if (!usuario || !email || !phone || !password || !rol) {
        alert("❌ Todos los campos son obligatorios.");
        return;
      }

      if (!email.includes("@")) {
        alert("❌ El correo electrónico no es válido.");
        return;
      }

      if (!/^[0-9]{7,15}$/.test(phone)) {
        alert("❌ El número de teléfono debe tener entre 7 y 15 dígitos.");
        return;
      }

      if (password.length < 6) {
        alert("❌ La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      const usuarios = obtenerUsuarios();
      const existe = usuarios.find(
        (u) => u.usuario === usuario || u.email === email
      );

      if (existe) {
        alert("❌ El usuario o correo ya existe.");
        return;
      }

      // Generar ID único automáticamente
      const nuevoId = obtenerSiguienteId();

      // Crear nuevo usuario con ID único
      const nuevoUsuario = {
        id: nuevoId,
        usuario,
        email,
        phone,
        password,
        rol,
      };

      usuarios.push(nuevoUsuario);
      sessionStorage.setItem("usuarios", JSON.stringify(usuarios));

      alert(`✅ Usuario creado correctamente con ID: ${nuevoId}`);
      console.log("Nuevo usuario creado:", nuevoUsuario); // Debug

      form.reset();
      cerrarModalCreacion();

      // Actualizar la tabla si está visible
      const modal = document.getElementById("modalUsuarios");
      if (modal && modal.style.display === "flex") {
        mostrarUsuarios();
      }
    });
  }

  // Agregar evento para refrescar usuarios al abrir el modal
  const btnMostrarUsuarios = document.querySelector(
    '[onclick="mostrarUsuarios()"]'
  );
  if (btnMostrarUsuarios) {
    btnMostrarUsuarios.addEventListener("click", function () {
      console.log("Refrescando lista de usuarios..."); // Debug
      mostrarUsuarios();
    });
  }
});

// === NUEVA FUNCIÓN: abrir modal de edición ===
function editarUsuarioModal(id) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    alert("❌ Usuario no encontrado.");
    return;
  }

  // Rellenar campos del modal
  document.getElementById("editarIdUsuario").value = usuario.id;
  document.getElementById("editarUsuario").value = usuario.usuario;
  document.getElementById("editarCorreo").value = usuario.email;
  document.getElementById("editarPhone").value = usuario.phone;
  document.getElementById("editarRol").value = usuario.rol;

  document.getElementById("modalEditarUsuario").style.display = "flex";
}

// Cierra el modal de edición
function cerrarModalEdicion() {
  document.getElementById("modalEditarUsuario").style.display = "none";
}

// === Evento: guardar cambios desde el formulario de edición ===
document.addEventListener("DOMContentLoaded", () => {
  const formEditar = document.getElementById("formEditarUsuario");
  if (formEditar) {
    formEditar.addEventListener("submit", function (e) {
      e.preventDefault();

      const id = parseInt(document.getElementById("editarIdUsuario").value);
      const nuevoUsuario = document.getElementById("editarUsuario").value.trim();
      const nuevoEmail = document.getElementById("editarCorreo").value.trim();
      const nuevoPhone = document.getElementById("editarPhone").value.trim();
      const nuevoRol = document.getElementById("editarRol").value;

      // Validaciones
      if (!nuevoUsuario || !nuevoEmail || !nuevoPhone || !nuevoRol) {
        alert("❌ Todos los campos son obligatorios.");
        return;
      }

      if (!nuevoEmail.includes("@")) {
        alert("❌ El correo electrónico no es válido.");
        return;
      }

      if (!/^[0-9]{7,15}$/.test(nuevoPhone)) {
        alert("❌ El teléfono debe tener entre 7 y 15 dígitos.");
        return;
      }

      const rolesPermitidos = ["administrador", "estudiante", "profesor"];
      if (!rolesPermitidos.includes(nuevoRol)) {
        alert("❌ Rol no válido.");
        return;
      }

      const usuarios = obtenerUsuarios();
      const existe = usuarios.find(
        (u) => u.id !== id && (u.usuario === nuevoUsuario || u.email === nuevoEmail)
      );
      if (existe) {
        alert("❌ Usuario o correo ya existente.");
        return;
      }

      const index = usuarios.findIndex((u) => u.id === id);
      if (index !== -1) {
        usuarios[index] = {
          ...usuarios[index],
          usuario: nuevoUsuario,
          email: nuevoEmail,
          phone: nuevoPhone,
          rol: nuevoRol,
        };

        sessionStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("✅ Usuario actualizado correctamente.");
        cerrarModalEdicion();
        mostrarUsuarios();
      }
    });
  }
});


// Eliminar Usuairos
// Variable temporal para guardar ID del usuario a eliminar
let usuarioIdParaEliminar = null;

// Abrir modal de confirmación
function eliminarUsuarioConfirmar(id) {
  const usuario = obtenerUsuarioPorId(id);
  if (!usuario) {
    alert("❌ Usuario no encontrado.");
    return;
  }

  usuarioIdParaEliminar = id;
  document.getElementById("modalEliminarConfirmacion").style.display = "flex";
}

// Cerrar el modal
function cerrarModalEliminacion() {
  usuarioIdParaEliminar = null;
  document.getElementById("modalEliminarConfirmacion").style.display = "none";
}

// Confirmar y eliminar usuario
function confirmarEliminacionUsuario() {
  if (usuarioIdParaEliminar !== null) {
    const usuarios = obtenerUsuarios();
    const actualizados = usuarios.filter(u => u.id !== usuarioIdParaEliminar);

    sessionStorage.setItem("usuarios", JSON.stringify(actualizados));
    console.log(`✅ Usuario con ID ${usuarioIdParaEliminar} eliminado.`);

    cerrarModalEliminacion();
    mostrarUsuarios(); // refresca tabla
  }
}


// === FUNCIONES AUXILIARES ===

// Función auxiliar para obtener usuario por ID
function obtenerUsuarioPorId(id) {
  const usuarios = obtenerUsuarios();
  return usuarios.find((u) => u.id === id);
}

// Función para refrescar la lista de usuarios (útil para debugging)
function refrescarUsuarios() {
  console.log("Refrescando usuarios desde sessionStorage...");
  const usuarios = obtenerUsuarios();
  console.log("Usuarios actuales:", usuarios);
  return usuarios;
}

// === FUNCIONES DE DEBUG (opcional, remover en producción) ===
// function mostrarEstadoUsuarios() {
//   const usuarios = obtenerUsuarios();
//   console.log("=== ESTADO ACTUAL DE USUARIOS ===");
//   console.log("Total de usuarios:", usuarios.length);
//   console.log("Usuarios:", usuarios);
//   console.log("Próximo ID disponible:", obtenerSiguienteId());
//   console.log("================================");
// }