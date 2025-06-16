// Carga la barra lateral y resalta la opción activa automáticamente
document.addEventListener('DOMContentLoaded', () => {
  fetch('../components/nav-bar-admin.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('nav-bar-admin').innerHTML = html;
      setActiveNavAuto();

      // Toggle collapse
      const nav = document.querySelector('.side-nav');
      const layout = document.querySelector('.layout');
      const toggleBtn = document.getElementById('side-nav-toggle');
      const logo = document.querySelector('.side-nav-logo');
      const title = document.querySelector('.side-nav-title');

      function toggleNav() {
        nav.classList.toggle('collapsed');
        layout.classList.toggle('nav-collapsed');
      }

      if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', toggleNav);
      }
      if (logo && nav) {
        logo.addEventListener('click', toggleNav);
      }
      if (title && nav) {
        title.addEventListener('click', toggleNav);
      }

      // Responsive: colapsar automáticamente en móvil
      handleNavCollapse();
      window.addEventListener('resize', handleNavCollapse);
    });
});

function handleNavCollapse() {
  const nav = document.querySelector('.side-nav');
  const layout = document.querySelector('.layout');
  if (!nav || !layout) return;
  if (window.innerWidth <= 700) {
    nav.classList.add('collapsed');
    layout.classList.add('nav-collapsed');
  } else {
    nav.classList.remove('collapsed');
    layout.classList.remove('nav-collapsed');
  }
}

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
  if (path.includes('administrador')) setActiveNav('administrador');
  else if (path.includes('ayuda')) setActiveNav('ayuda');
  else if (path.includes('perfil')) setActiveNav('perfil');
}