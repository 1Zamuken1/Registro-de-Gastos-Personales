document.addEventListener("DOMContentLoaded", () => {
  let usuario = null;

  // Leer y validar usuario del localStorage
  try {
    usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  } catch (e) {
    console.warn("usuarioActivo no es JSON válido.");
    localStorage.removeItem("usuarioActivo");
    window.location.href = "Iniciosesion.html";
    return;
  }

  if (usuario && usuario.nombre && usuario.rol) {
    const nombreElemento = document.getElementById("nombreUsuario");
    const rolElemento = document.getElementById("rolUsuario");

    // Capitalizar nombre (primera letra en mayúscula)
    const capitalizar = (texto) =>
      texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

    const nombreCapitalizado = capitalizar(usuario.nombre.trim());

    // Generar saludo según la hora
    const hora = new Date().getHours();
    let saludo = "";
    if (hora >= 6 && hora < 12) {
      saludo = "Buenos días";
    } else if (hora >= 12 && hora < 19) {
      saludo = "Buenas tardes";
    } else {
      saludo = "Buenas noches";
    }

    // Mostrar saludo con nombre
    if (nombreElemento) {
      nombreElemento.textContent = '${saludo}, ${nombreCapitalizado}';
    }

    // Mostrar rol con clase de color
    if (rolElemento) {
      rolElemento.textContent = usuario.rol.toUpperCase();
      rolElemento.classList.remove("rol-admin", "rol-instructor", "rol-aprendiz");

      const rolLimpio = usuario.rol.toLowerCase();
      if (rolLimpio === "administrador") {
        rolElemento.classList.add("rol-admin");
      } else if (rolLimpio === "instructor") {
        rolElemento.classList.add("rol-instructor");
      } else if (rolLimpio === "aprendiz") {
        rolElemento.classList.add("rol-aprendiz");
      }
    }
  } else {
    window.location.href = "Iniciosesion.html";
  }

  // Cerrar sesión
  const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "Iniciosesion.html";
    });
  }
});