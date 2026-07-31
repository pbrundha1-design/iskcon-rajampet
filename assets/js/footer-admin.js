const adminButton = document.getElementById('admin-button');
if (adminButton) {
  let lastTap = 0;
  adminButton.addEventListener('click', (event) => {
    const now = Date.now();
    if (now - lastTap < 400) {
      window.location.href = '/admin/login';
    }
    lastTap = now;
  });
}
