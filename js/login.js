// Login form: letters-only name field, Gmail-only email, password match check,
// password show/hide toggles, and role-based redirect
// (Admin -> admin-dashboard.html, User -> user-dashboard.html).
(function () {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const repeatInput = document.getElementById('repeatPassword');

  // --- Live input filtering: strip disallowed characters as the user types ---
  const restrictTo = (input, pattern) => {
    input.addEventListener('input', () => {
      const cleaned = input.value.replace(pattern, '');
      if (cleaned !== input.value) input.value = cleaned;
    });
  };
  restrictTo(nameInput, /[^A-Za-z\s]/g);     // name: letters and spaces

  // --- Password show/hide toggles ---
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
  const NAME_PATTERN = /^[A-Za-z][A-Za-z\s]{1,47}$/;

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

    if (!NAME_PATTERN.test(nameInput.value.trim())) {
      showHint(nameInput, 'Name must contain letters only.');
      valid = false;
    } else {
      showHint(nameInput, '');
    }

    if (!GMAIL_PATTERN.test(emailInput.value.trim())) {
      showHint(emailInput, 'Please enter a valid @gmail.com address.');
      valid = false;
    } else {
      showHint(emailInput, '');
    }

    if (passwordInput.value.length < 6) {
      showHint(repeatInput, 'Password must be at least 6 characters.');
      valid = false;
    } else if (passwordInput.value !== repeatInput.value) {
      showHint(repeatInput, 'Passwords do not match.');
      valid = false;
    } else {
      showHint(repeatInput, '');
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
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      role: role
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');

    window.location.href = role === 'admin' ? './admin-dashboard.html' : './user-dashboard.html';
  });
})();