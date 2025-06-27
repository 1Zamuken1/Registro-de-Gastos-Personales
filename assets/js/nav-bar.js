// Carga la barra lateral y resalta la opción activa automáticamente
document.addEventListener('DOMContentLoaded', () => {
  fetch('../components/nav-bar.html')
    .then(res => res.text())
    .then(html => {
      // Inserta el HTML en un contenedor temporal
      const temp = document.createElement('div');
      temp.innerHTML = html.trim();
      // Busca el nav real
      const realNav = temp.querySelector('.side-nav');
      // Reemplaza el contenedor por el nav real
      const navBarContainer = document.getElementById('nav-bar');
      navBarContainer.replaceWith(realNav);

      setActiveNavAuto();

      // Toggle collapse
      const nav = realNav;
      const layout = document.querySelector('.layout');
      const toggleBtn = nav.querySelector('#side-nav-toggle');
      const pageContent = document.querySelector('.page-content');

      function toggleNav() {
        nav.classList.toggle('collapsed');
        if (layout) layout.classList.toggle('nav-collapsed');
        // NO modifiques pageContent aquí
        localStorage.setItem('sidebarCollapsed', nav.classList.contains('collapsed'));
      }

      // Restaurar estado guardado
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      if (isCollapsed) {
        nav.classList.add('collapsed');
        if (layout) layout.classList.add('nav-collapsed');
      }

      // Botón de colapso
      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleNav);
      }

      // Responsive: colapsar automáticamente en móvil
      function handleResize() {
        if (window.innerWidth <= 700) {
          nav.classList.add('collapsed');
          if (layout) layout.classList.add('nav-collapsed');
        } else {
          const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
          if (!savedState) {
            nav.classList.remove('collapsed');
            if (layout) layout.classList.remove('nav-collapsed');
          }
        }
      }
      window.addEventListener('resize', handleResize);
      handleResize();
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
  if (path.includes('dashboard')) setActiveNav('dashboard');
  else if (path.includes('ingresos')) setActiveNav('ingresos');
  else if (path.includes('gastos')) setActiveNav('egresos');
  else if (path.includes('ahorros')) setActiveNav('ahorros');
  else if (path.includes('reportes')) setActiveNav('reportes');
  else if (path.includes('ayuda')) setActiveNav('ayuda');
  else if (path.includes('perfil')) setActiveNav('perfil');
}