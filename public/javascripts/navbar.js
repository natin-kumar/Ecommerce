document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNav');

  toggler.addEventListener('click', function () {
    navbarCollapse.classList.toggle('show');
  });
});
