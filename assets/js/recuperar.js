const recoverForm = document.getElementById('recoverForm');
const resetForm = document.getElementById('resetForm');

function showError(id, message) {
  const span = document.getElementById(id + 'Error');
  if (span) span.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

recoverForm.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('recoverEmail').value.trim();
  const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email);

  if (usuario) {
    document.getElementById('resetEmail').value = email;
    recoverForm.style.display = 'none';
    resetForm.style.display = 'block';
  } else {
    showError('recoverEmail', "Correo no encontrado.");
  }
});

resetForm.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  const newPass = document.getElementById('newPassword').value.trim();
  const email = document.getElementById('resetEmail').value.trim();

  if (!validarPasswordSegura(newPass)) {
    showError('newPassword', "Debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.");
    return;
  }

  const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex(u => u.email === email);

  if (index !== -1) {
    usuarios[index].password = newPass;
    sessionStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Contraseña actualizada correctamente.");
    window.location.href = "Inicio sesion.html";
  } else {
    showError('newPassword', "Error inesperado. Intenta nuevamente.");
  }
});

function validarPasswordSegura(pass) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pass);
}
