// --- Cambio entre formularios (Login/Register) ---
const registerbtn = document.querySelector('.register-btn');
const loginbtn = document.querySelector('.login-btn');
const container = document.querySelector('.container');

if (registerbtn && loginbtn && container) {
  registerbtn.addEventListener('click', () => {
    container.classList.add('active');
  });

  loginbtn.addEventListener('click', () => {
    container.classList.remove('active');
  });
}

// --- Mostrar errores ---
function showError(id, message) {
  const errorSpan = document.getElementById(id + 'Error');
  if (errorSpan) errorSpan.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(span => span.textContent = '');
}

// --- Usuarios iniciales ---
const usuariosIniciales = [
  { usuario: "valeria", password: "valeria123", email: "valeria@mail.com", rol: "estudiante"},
  { usuario: "admin", password: "admin123", email: "admin@mail.com", rol: "administrador" },
  { usuario: "jose", password: "jose123", email: "jose@mail.com", rol: "profesor" },
  { usuario: "camila", password: "camila321", email: "camila@mail.com", rol: "estudiante" },
  { usuario: "pedro", password: "pedrito", email: "pedro@mail.com", rol: "profesor" },
   { usuario: "laura", password: "lauraAdmin", rol: "administrador" }
];

if (!sessionStorage.getItem("usuarios")) {
  sessionStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
}

// --- Registrar nuevo usuario ---
function registrarUsuario(usuario, password, email) {
  const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.usuario === usuario || u.email === email);

  if (existe) {
    return { exito: false, mensaje: "El usuario o el correo ya existen." };
  }

  usuarios.push({ usuario, password, email, rol: "estudiante" });
  sessionStorage.setItem("usuarios", JSON.stringify(usuarios));
  return { exito: true, mensaje: "Usuario registrado correctamente." };
}

// --- Validar inicio de sesión ---
function validarInicioSesion(usuario, password) {
  const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
  const u = usuarios.find(u => u.usuario === usuario && u.password === password);
  if (u) {
    return { exito: true, usuario: u };
  } else {
    return { exito: false, mensaje: "Usuario o contraseña incorrectos." };
  }
}

// --- Validar Login ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    let valid = true;

    if (!username) {
      showError('loginUser', 'El usuario es obligatorio.');
      valid = false;
    }

    if (!password) {
      showError('loginPass', 'La contraseña es obligatoria.');
      valid = false;
    }

    if (valid) {
      const resultado = validarInicioSesion(username, password);
      if (resultado.exito) {
        const usuario = resultado.usuario;
        sessionStorage.setItem("usuarioActivo", usuario.usuario);

        if (usuario.rol === "estudiante") {
          window.location.href = "dashboard.html";
        } else if (usuario.rol === "profesor") {
          window.location.href = "dashboard.html";
        } else if (usuario.rol === "administrador") {
          window.location.href = "administrador.html";
        }
      } else {
        alert(resultado.mensaje);
      }
    }
  });
}

// --- Validar Registro ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("pass").value.trim();
    const confirmPass = document.getElementById("confirpass").value.trim();
    const termsChecked = document.getElementById("terms").checked;

    let valid = true;

    if (!username) {
      showError("name", "El nombre de usuario es obligatorio.");
      valid = false;
    }
    if (!email || !email.includes("@")) {
      showError("email", "El correo electrónico no es válido.");
      valid = false;
    }
    if (!phone || !/^[0-9]{7,15}$/.test(phone)) {
      showError("phone", "Ingresa un número de teléfono válido.");
      valid = false;
    }
    if (!password || password.length < 8) {
      showError("pass", "La contraseña debe tener al menos 8 caracteres.");
      valid = false;
    }
    if (password !== confirmPass) {
      showError("confirpass", "Las contraseñas no coinciden.");
      valid = false;
    }
    if (!termsChecked) {
      alert("Debes aceptar los términos y condiciones.");
      valid = false;
    }

    if (valid) {
      const resultado = registrarUsuario(username, password, email);
      if (resultado.exito) {
        alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        registerForm.reset();
        container.classList.remove('active'); // cambia a login
      } else {
        alert(resultado.mensaje);
      }
    }
  });
}
