// === FUNCIONES PRINCIPALES DE GESTIÓN DE USUARIOS ===

function asignarIDsAUsuariosExistentes() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let cambiosRealizados = false;
  let siguienteId = 1;

  usuarios.forEach((usuario) => {
    if (usuario.id && typeof usuario.id === "number") {
      siguienteId = Math.max(siguienteId, usuario.id + 1);
    }
  });

  usuarios.forEach((usuario) => {
    if (!usuario.id || typeof usuario.id !== "number") {
      usuario.id = siguienteId;
      siguienteId++;
      cambiosRealizados = true;
    }
  });

  if (cambiosRealizados) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log("IDs asignados a usuarios existentes");
  }

  return usuarios;
}

function obtenerSiguienteId() {
  const usuarios = obtenerUsuarios();
  if (usuarios.length === 0) return 1;

  const usuariosConId = usuarios.filter(
    (u) => u.id && typeof u.id === "number"
  );
  if (usuariosConId.length === 0) return 1;

  const maxId = Math.max(...usuariosConId.map((u) => u.id));
  return maxId + 1;
}

function obtenerUsuarios() {
  return asignarIDsAUsuariosExistentes();
}

function mostrarInformacionUsuarioActivo() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  const usuarioActivoNombre = localStorage.getItem("usuarioActivo");

  if (usuarioActivoId) {
    const usuario = obtenerUsuarioPorId(parseInt(usuarioActivoId));
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
  } else if (usuarioActivoNombre) {
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

function mostrarUsuarios() {
  const usuarios = obtenerUsuarios();
  document.getElementById("modalUsuarios").style.display = "flex";
  const tabla = $("#tablaUsuarios");

  if ($.fn.DataTable.isDataTable("#tablaUsuarios")) {
    tabla.DataTable().destroy();
  }

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

  tabla.DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    responsive: true,
    pageLength: 10,
    autoWidth: false,
    columns: [
      { searchable: true },
      { searchable: true },
      { searchable: true },
      { searchable: true },
      { searchable: true },
      { searchable: false },
    ],
  });
}

function cerrarModalUsuarios() {
  document.getElementById("modalUsuarios").style.display = "none";
}

function abrirFormularioCreacion() {
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

document.addEventListener("DOMContentLoaded", () => {
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

      const nuevoId = obtenerSiguienteId();

      const nuevoUsuario = {
        id: nuevoId,
        usuario,
        email,
        phone,
        password,
        rol,
      };

      usuarios.push(nuevoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      alert(`✅ Usuario creado correctamente con ID: ${nuevoId}`);
      form.reset();
      cerrarModalCreacion();

      const modal = document.getElementById("modalUsuarios");
      if (modal && modal.style.display === "flex") {
        mostrarUsuarios();
      }
    });
  }

  const btnMostrarUsuarios = document.querySelector(
    '[onclick="mostrarUsuarios()"]'
  );
  if (btnMostrarUsuarios) {
    btnMostrarUsuarios.addEventListener("click", function () {
      mostrarUsuarios();
    });
  }
});

function editarUsuarioModal(id) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    alert("❌ Usuario no encontrado.");
    return;
  }

  document.getElementById("editarIdUsuario").value = usuario.id;
  document.getElementById("editarUsuario").value = usuario.usuario;
  document.getElementById("editarCorreo").value = usuario.email;
  document.getElementById("editarPhone").value = usuario.phone;
  document.getElementById("editarRol").value = usuario.rol;

  document.getElementById("modalEditarUsuario").style.display = "flex";
}

function cerrarModalEdicion() {
  document.getElementById("modalEditarUsuario").style.display = "none";
}

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

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("✅ Usuario actualizado correctamente.");
        cerrarModalEdicion();
        mostrarUsuarios();
      }
    });
  }
});

let usuarioIdParaEliminar = null;

function eliminarUsuarioConfirmar(id) {
  const usuario = obtenerUsuarioPorId(id);
  if (!usuario) {
    alert("❌ Usuario no encontrado.");
    return;
  }

  usuarioIdParaEliminar = id;
  document.getElementById("modalEliminarConfirmacion").style.display = "flex";
}

function cerrarModalEliminacion() {
  usuarioIdParaEliminar = null;
  document.getElementById("modalEliminarConfirmacion").style.display = "none";
}

function confirmarEliminacionUsuario() {
  if (usuarioIdParaEliminar !== null) {
    const usuarios = obtenerUsuarios();
    const actualizados = usuarios.filter(u => u.id !== usuarioIdParaEliminar);

    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    cerrarModalEliminacion();
    mostrarUsuarios();
  }
}

function obtenerUsuarioPorId(id) {
  const usuarios = obtenerUsuarios();
  return usuarios.find((u) => u.id === id);
}

function refrescarUsuarios() {
  const usuarios = obtenerUsuarios();
  console.log("Usuarios actuales:", usuarios);
  return usuarios;
}
