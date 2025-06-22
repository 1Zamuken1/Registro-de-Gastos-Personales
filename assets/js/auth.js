// Función para verificar la autenticación del usuario
(function verificarAutenticacion() {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) {
    alert("Debes iniciar sesión para acceder.");
    window.location.href = "./inicioSesion.html";
  }
})();
