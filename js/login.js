// Login form: Gmail-only email, minimum-length password, password
// show/hide toggle, and role-based redirect
// (Admin -> admin-dashboard.html, User -> user-dashboard.html).
(function () {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // --- Password show/hide toggle ---
  document.querySelectorAll('.login-password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetInput = document.getElementById(btn.dataset.target);
      if (!targetInput) return;
      const isHidden = targetInput.type === 'password';
      targetInput.type = isHidden ? 'text' : 'password';
      btn.querySelector('.icon-eye').style.display = isHidden ? 'none' : '';
      btn.querySelector('.icon-eye-off').style.display = isHidden ? '' : 'none';
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  });

  const GMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

  function showHint(input, message) {
    const hint = form.querySelector(`[data-error-for="${input.id}"]`);
    if (!hint) return;
    if (message) {
      hint.textContent = message;
      hint.classList.add('is-error');
    } else {
      hint.textContent = hint.dataset.default || hint.textContent;
      hint.classList.remove('is-error');
    }
  }

  // Cache each hint's original (non-error) copy so we can restore it.
  form.querySelectorAll('.login-hint').forEach((hint) => {
    hint.dataset.default = hint.textContent;
  });

  function validate() {
    let valid = true;

    if (!GMAIL_PATTERN.test(emailInput.value.trim())) {
      showHint(emailInput, 'Please enter a valid @gmail.com address.');
      valid = false;
    } else {
      showHint(emailInput, '');
    }

    if (passwordInput.value.length < 6) {
      showHint(passwordInput, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      showHint(passwordInput, '');
    }

    return valid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) return;

    const role = form.querySelector('input[name="role"]:checked').value;

    // Persist the signed-in user so other pages (e.g. the dashboards) can
    // read who's logged in via getCurrentUser().
    const user = {
      email: emailInput.value.trim(),
      role: role
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');

    window.location.href = role === 'admin' ? './admin-dashboard.html' : './user-dashboard.html';
  });
})();