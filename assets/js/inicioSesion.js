<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> a998b13a2a4e87a2cadb7aa6bf1ba60757db3c36
// // --- Cambio entre formularios (Login/Register) ---
// const registerbtn = document.querySelector('.register-btn');
// const loginbtn = document.querySelector('.login-btn');
// const container = document.querySelector('.container');

// if (registerbtn && loginbtn && container) {
//   registerbtn.addEventListener('click', () => {
//     container.classList.add('active');
//   });

//   loginbtn.addEventListener('click', () => {
//     container.classList.remove('active');
//   });
// }

// // --- Mostrar errores ---
// function showError(id, message) {
//   const errorSpan = document.getElementById(id + 'Error');
//   if (errorSpan) errorSpan.textContent = message;
// }

// function clearErrors() {
//   document.querySelectorAll('.error').forEach(span => span.textContent = '');
// }

// // --- Función para asignar IDs a usuarios existentes que no los tengan ---
// function asignarIDsAUsuariosExistentes() {
//   const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
//   let cambiosRealizados = false;
//   let siguienteId = 1;

//   usuarios.forEach((usuario, index) => {
//     if (!usuario.id) {
//       usuario.id = siguienteId;
//       cambiosRealizados = true;
//     }
//     siguienteId = Math.max(siguienteId, (usuario.id || 0)) + 1;
//   });

//   if (cambiosRealizados) {
//     sessionStorage.setItem("usuarios", JSON.stringify(usuarios));
//     console.log("IDs asignados a usuarios existentes");
//   }

//   return usuarios;
// }

// // --- Función para obtener el próximo ID disponible ---
// function obtenerSiguienteId() {
//   // Primero asegurar que todos los usuarios tengan ID
//   const usuarios = asignarIDsAUsuariosExistentes();
//   if (usuarios.length === 0) return 1;
  
//   // Filtra usuarios que tienen ID válido y encuentra el ID más alto
//   const usuariosConId = usuarios.filter(u => u.id && typeof u.id === 'number');
//   if (usuariosConId.length === 0) return 1;
  
//   const maxId = Math.max(...usuariosConId.map(u => u.id));
//   return maxId + 1;
// }

// // --- Usuarios iniciales con IDs únicos ---
// const usuariosIniciales = [
//   { id: 1, usuario: "valeria", password: "valeria123", email: "valeria@mail.com", phone: "3001234567", rol: "estudiante" },
//   { id: 2, usuario: "admin", password: "admin123", email: "admin@mail.com", phone: "3100000000", rol: "administrador" },
//   { id: 3, usuario: "jose", password: "jose123", email: "jose@mail.com", phone: "3111111111", rol: "profesor" },
//   { id: 4, usuario: "camila", password: "camila321", email: "camila@mail.com", phone: "3122222222", rol: "estudiante" },
//   { id: 5, usuario: "pedro", password: "pedrito", email: "pedro@mail.com", phone: "3133333333", rol: "profesor" },
//   { id: 6, usuario: "laura", password: "lauraAdmin", email: "laura@mail.com", phone: "3144444444", rol: "administrador" }
// ];

// // Inicializar usuarios solo si no existen en sessionStorage
// if (!sessionStorage.getItem("usuarios")) {
//   sessionStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
// } else {
//   // Si ya existen usuarios, asegurar que todos tengan IDs
//   asignarIDsAUsuariosExistentes();
// }

// // --- Registrar nuevo usuario ---
// function registrarUsuario(usuario, password, email, phone) {
//   const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
//   const existe = usuarios.find(u => u.usuario === usuario || u.email === email);

//   if (existe) {
//     return { exito: false, mensaje: "El usuario o el correo ya existen." };
//   }

//   // Generar ID único automáticamente
//   const nuevoId = obtenerSiguienteId();
  
//   // Crear nuevo usuario con ID único
//   const nuevoUsuario = { 
//     id: nuevoId, 
//     usuario, 
//     password, 
//     email, 
//     phone, 
//     rol: "estudiante" 
//   };
  
//   usuarios.push(nuevoUsuario);
//   sessionStorage.setItem("usuarios", JSON.stringify(usuarios));
//   return { exito: true, mensaje: "Usuario registrado correctamente.", id: nuevoId };
// }

// // --- Validar inicio de sesión ---
// function validarInicioSesion(usuario, password) {
//   const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
//   const u = usuarios.find(u => u.usuario === usuario && u.password === password);
//   if (u) {
//     return { exito: true, usuario: u };
//   } else {
//     return { exito: false, mensaje: "Usuario o contraseña incorrectos." };
//   }
// }

// --- Validar Login ---
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//   loginForm.addEventListener('submit', function (e) {
//     e.preventDefault();
//     clearErrors();

//     const username = document.getElementById('loginUser').value.trim();
//     const password = document.getElementById('loginPass').value.trim();
//     let valid = true;

//     if (!username) {
//       showError('loginUser', 'El usuario es obligatorio.');
//       valid = false;
//     }

//     if (!password) {
//       showError('loginPass', 'La contraseña es obligatoria.');
//       valid = false;
//     }

//     if (valid) {
//       const resultado = validarInicioSesion(username, password);
//       if (resultado.exito) {
//         const usuario = resultado.usuario;
//         sessionStorage.setItem("usuarioActivo", usuario.usuario);
//         // También podemos guardar el ID del usuario activo si lo necesitas
//         sessionStorage.setItem("usuarioActivoId", usuario.id);

//         if (usuario.rol === "estudiante") {
//           window.location.href = "dashboard.html";
//         } else if (usuario.rol === "profesor") {
//           window.location.href = "dashboard.html";
//         } else if (usuario.rol === "administrador") {
//           window.location.href = "administrador.html";
//         }
//       } else {
//         alert(resultado.mensaje);
//       }
//     }
//   });
// }

// // --- Validar Registro ---
// const registerForm = document.getElementById('registerForm');
// if (registerForm) {
//   registerForm.addEventListener('submit', function (e) {
//     e.preventDefault();
//     clearErrors();

//     const username = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const password = document.getElementById("pass").value.trim();
//     const confirmPass = document.getElementById("confirpass").value.trim();
//     const termsChecked = document.getElementById("terms").checked;

//     let valid = true;

//     if (!username) {
//       showError("name", "El nombre de usuario es obligatorio.");
//       valid = false;
//     }
//     if (!email || !email.includes("@")) {
//       showError("email", "El correo electrónico no es válido.");
//       valid = false;
//     }
//     if (!phone || !/^[0-9]{7,15}$/.test(phone)) {
//       showError("phone", "Ingresa un número de teléfono válido.");
//       valid = false;
//     }
//     if (!password || password.length < 8) {
//       showError("pass", "La contraseña debe tener al menos 8 caracteres.");
//       valid = false;
//     }
//     if (password !== confirmPass) {
//       showError("confirpass", "Las contraseñas no coinciden.");
//       valid = false;
//     }
//     if (!termsChecked) {
//       alert("Debes aceptar los términos y condiciones.");
//       valid = false;
//     }

//     if (valid) {
//       const resultado = registrarUsuario(username, password, email, phone);
//       if (resultado.exito) {
//         alert(`Usuario registrado con éxito con Nombre: ${resultado.username}. Ahora puedes iniciar sesión.`);
//         registerForm.reset();
//         container.classList.remove('active'); // cambia a login
//       } else {
//         alert(resultado.mensaje);
//       }
//     }
//   });
// }

// // --- Función auxiliar para obtener usuario por ID (útil para futuras funcionalidades) ---
// function obtenerUsuarioPorId(id) {
//   const usuarios = JSON.parse(sessionStorage.getItem("usuarios")) || [];
//   return usuarios.find(u => u.id === id);
// }

// // --- Función auxiliar para obtener el usuario activo actual ---
// function obtenerUsuarioActivo() {
//   const usuarioActivoId = sessionStorage.getItem("usuarioActivoId");
//   if (usuarioActivoId) {
//     return obtenerUsuarioPorId(parseInt(usuarioActivoId));
//   }
//   return null;
// }

// --- Cambio entre formularios (Login/Register) ---
// --- Cambio entre formularios (Login/Register) ---
<<<<<<< HEAD
=======
=======
>>>>>>> e21b0f4208ec05a3b38d5fc76f313b03e6803481
>>>>>>> a998b13a2a4e87a2cadb7aa6bf1ba60757db3c36
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

// --- Inicializar usuarios e ingresos desde archivo externo si no existen ---
if (!localStorage.getItem("usuarios") && window.usuariosIniciales) {
  localStorage.setItem("usuarios", JSON.stringify(window.usuariosIniciales));

  // También guardar ingresos por usuario en claves separadas
  window.usuariosIniciales.forEach(usuario => {
    const clave = `ingresos_usuario_${usuario.id}`;
    const ingresos = usuario.ingresos || [];
    localStorage.setItem(clave, JSON.stringify(ingresos));
  });
}

// --- Registrar nuevo usuario ---
function registrarUsuario(usuario, password, email, phone) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.usuario === usuario || u.email === email);

  if (existe) {
    return { exito: false, mensaje: "El usuario o el correo ya existen." };
  }

  const nuevoId = Math.max(0, ...usuarios.map(u => u.id || 0)) + 1;

  const nuevoUsuario = {
    id: nuevoId,
    usuario,
    password,
    email,
    phone,
    rol: "estudiante"
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Crear lista vacía de ingresos
  localStorage.setItem(`ingresos_usuario_${nuevoId}`, JSON.stringify([]));

  return { exito: true, mensaje: "Usuario registrado correctamente.", id: nuevoId };
}

// --- Validar inicio de sesión ---
function validarInicioSesion(usuario, password) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
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
        localStorage.setItem("usuarioActivo", usuario.usuario);
        localStorage.setItem("usuarioActivoId", usuario.id);

        localStorage.setItem("usuario_autenticado", JSON.stringify(usuario));

        if (usuario.rol === "estudiante" || usuario.rol === "profesor") {
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
      const resultado = registrarUsuario(username, password, email, phone);
      if (resultado.exito) {
        alert(`Usuario registrado con éxito. Ahora puedes iniciar sesión.`);
        registerForm.reset();
        container.classList.remove('active');
      } else {
        alert(resultado.mensaje);
      }
    }
  });
}

// --- Función auxiliar para obtener usuario por ID ---
function obtenerUsuarioPorId(id) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  return usuarios.find(u => u.id === id);
}

// --- Función auxiliar para obtener el usuario activo actual ---
function obtenerUsuarioActivo() {
  const usuarioActivoId = localStorage.getItem("usuarioActivoId");
  if (usuarioActivoId) {
    return obtenerUsuarioPorId(parseInt(usuarioActivoId));
  }
  return null;
}
// --- Validar que el usuario esté activo antes de cargar la página ---