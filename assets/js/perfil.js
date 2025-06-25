window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-editar");
  const modalInput = document.getElementById("modal-input");
  const modalGuardar = document.getElementById("modal-guardar");
  const modalTitulo = document.getElementById("modal-titulo");
  const togglePassword = document.getElementById("togglePassword");
  const inputContrasena = document.getElementById("inputContrasena");

  let inputActual = null;

  // === Obtener ID del usuario activo desde localStorage ===
  const idUsuarioActivo = parseInt(localStorage.getItem("usuarioActivoId"));
  if (!idUsuarioActivo) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "./inicioSesion.html";
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let usuario = usuarios.find(u => u.id === idUsuarioActivo);

  if (!usuario) {
    alert("Usuario no encontrado.");
    window.location.href = "./inicioSesion.html";
    return;
  }

  // === Mostrar datos en inputs ===
  document.querySelector(".nombre").value = usuario.usuario || "";
  document.querySelector(".correo").value = usuario.email || "";
  document.querySelector(".telefono").value = usuario.phone || "";
  document.querySelector(".contrasena").value = usuario.password || "";
  document.querySelector(".rol").value = usuario.rol || "";

  // === Cerrar sesión ===
  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioActivoId");
    window.location.href = "./inicioSesion.html";
  });

  // === Toggles de notificaciones ===
  ["toggleIcon1", "toggleIcon2", "toggleIcon3"].forEach(id => {
    document.getElementById(id).addEventListener("click", function () {
      this.classList.toggle("bi-toggle-on");
      this.classList.toggle("bi-toggle-off");
    });
  });

  // === Mostrar/Ocultar contraseña ===
  if (togglePassword && inputContrasena) {
    togglePassword.addEventListener("click", () => {
      const oculto = inputContrasena.type === "password";
      inputContrasena.type = oculto ? "text" : "password";
      togglePassword.classList.toggle("bi-eye-slash");
      togglePassword.classList.toggle("bi-eye");
      togglePassword.title = oculto ? "Ocultar contraseña" : "Mostrar contraseña";
    });
  }

  // === Abrir modal de edición ===
  document.querySelectorAll(".input-con-icono img").forEach((icono) => {
    icono.addEventListener("click", () => {
      inputActual = icono.previousElementSibling;
      if (!inputActual || !inputActual.className) return;

      modalInput.value = inputActual.value;
      modalTitulo.textContent = `Editar ${traducirCampo(inputActual.className)}`;
      modal.style.display = "flex";
    });
  });

  // === Guardar cambios desde modal ===
  modalGuardar.addEventListener("click", () => {
    const nuevoValor = modalInput.value.trim();
    if (!inputActual || nuevoValor === "") return;

    const claseCampo = inputActual.className;

    // Validaciones básicas
    if (claseCampo === "correo" && !nuevoValor.includes("@")) {
      alert("❌ El correo no es válido.");
      return;
    }

    if (claseCampo === "telefono" && !/^[0-9]{7,15}$/.test(nuevoValor)) {
      alert("❌ El teléfono debe tener entre 7 y 15 dígitos.");
      return;
    }

    if (claseCampo === "contrasena" && nuevoValor.length < 6) {
      alert("❌ La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validar duplicados (nombre o correo)
    if (["nombre", "correo"].includes(claseCampo)) {
      const campoReal = claseCampo === "nombre" ? "usuario" : "email";
      const duplicado = usuarios.find(
        u => u.id !== idUsuarioActivo && u[campoReal] === nuevoValor
      );
      if (duplicado) {
        alert(`❌ Este ${campoReal} ya está en uso.`);
        return;
      }
    }

    // Actualizar en el DOM
    inputActual.value = nuevoValor;

    // Actualizar en localStorage
    const index = usuarios.findIndex(u => u.id === idUsuarioActivo);
    if (index !== -1) {
      if (claseCampo === "nombre") usuarios[index].usuario = nuevoValor;
      if (claseCampo === "correo") usuarios[index].email = nuevoValor;
      if (claseCampo === "telefono") usuarios[index].phone = nuevoValor;
      if (claseCampo === "contrasena") usuarios[index].password = nuevoValor;

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      console.log("✅ Usuario actualizado correctamente:", usuarios[index]);
    }

    modal.style.display = "none";
  });

  // === Cerrar modal al hacer clic afuera ===
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // === Función de traducción de nombres bonitos ===
  function traducirCampo(campo) {
    switch (campo) {
      case "nombre": return "nombre de usuario";
      case "correo": return "correo";
      case "telefono": return "teléfono";
      case "contrasena": return "contraseña";
      default: return campo;
    }
  }
});
