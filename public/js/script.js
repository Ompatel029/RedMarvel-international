function toggleMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('active');
}

// Toggle dropdowns on mobile
document.addEventListener('DOMContentLoaded', () => {
  const dropbtns = document.querySelectorAll('.dropbtn');
  dropbtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const dropdown = this.parentElement;
      dropdown.classList.toggle('active');
    });
  });
});
