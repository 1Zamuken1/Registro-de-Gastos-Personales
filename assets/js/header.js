document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("header-bar");
  if (!contenedor) return;

  try {
    const res = await fetch("../components/header.html");
    const html = await res.text();
    contenedor.innerHTML = html;

    const id = parseInt(sessionStorage.getItem("usuarioActivoId"));
    const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) return;

    const saludo = document.getElementById("saludoUsuario");
    if (saludo) saludo.textContent = `Bienvenido ${usuario.rol} ${usuario.usuario}`;

    const btnCerrar = document.getElementById("btnCerrarSesionHeader");
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioActivo");
        sessionStorage.removeItem("usuarioActivoId");
        window.location.href = "inicioSesion.html";
      });
    }

  } catch (error) {
    console.error("Error al cargar el header:", error);
  }
});
