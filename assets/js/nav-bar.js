// Carga la barra lateral y resalta la opción activa automáticamente
document.addEventListener('DOMContentLoaded', () => {
  fetch('../components/nav-bar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('nav-bar').innerHTML = html;
      setActiveNavAuto();
    });
});

// Resalta la opción activa según la URL
function setActiveNav(page) {
  document.querySelectorAll('.side-nav-list li').forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-page') === page);
  });
  document.querySelectorAll('.side-nav-footer-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === page);
  });
}

function setActiveNavAuto() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('inicio')) setActiveNav('inicio');
  else if (path.includes('ingresos')) setActiveNav('ingresos');
  else if (path.includes('gastos')) setActiveNav('gastos');
  else if (path.includes('presupuesto')) setActiveNav('presupuesto');
  else if (path.includes('reportes')) setActiveNav('reportes');
  else if (path.includes('ayuda')) setActiveNav('ayuda');
  else if (path.includes('perfil')) setActiveNav('perfil');
}