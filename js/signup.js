// Sign-up form: letters-only username/name, Gmail-only email,
// password match check, terms-acceptance gate, and password
// show/hide toggles, before redirecting on successful submit.
(function () {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const usernameInput = document.getElementById('username');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const agreeInput = document.getElementById('agreeTerms');

  // --- Live input filtering: strip disallowed characters as the user types ---
  const restrictTo = (input, pattern) => {
    input.addEventListener('input', () => {
      const cleaned = input.value.replace(pattern, '');
      if (cleaned !== input.value) input.value = cleaned;
    });
  };
  restrictTo(usernameInput, /[^A-Za-z]/g);   // username: letters only, no spaces
  restrictTo(fullNameInput, /[^A-Za-z\s]/g); // full name: letters and spaces

  // --- Password show/hide toggles ---
  document.querySelectorAll('.signup-password-toggle').forEach((btn) => {
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
  const USERNAME_PATTERN = /^[A-Za-z]{2,24}$/;
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
  form.querySelectorAll('.signup-hint').forEach((hint) => {
    hint.dataset.default = hint.textContent;
  });

  function validate() {
    let valid = true;

    if (!USERNAME_PATTERN.test(usernameInput.value.trim())) {
      showHint(usernameInput, 'Username must be letters only (min 2 characters).');
      valid = false;
    } else {
      showHint(usernameInput, '');
    }

    if (!NAME_PATTERN.test(fullNameInput.value.trim())) {
      showHint(fullNameInput, 'Full name must contain letters only.');
      valid = false;
    } else {
      showHint(fullNameInput, '');
    }

    if (!GMAIL_PATTERN.test(emailInput.value.trim())) {
      showHint(emailInput, 'Please enter a valid @gmail.com address.');
      valid = false;
    } else {
      showHint(emailInput, '');
    }

    if (passwordInput.value.length < 6) {
      showHint(confirmInput, 'Password must be at least 6 characters.');
      valid = false;
    } else if (passwordInput.value !== confirmInput.value) {
      showHint(confirmInput, 'Passwords do not match.');
      valid = false;
    } else {
      showHint(confirmInput, '');
    }

    if (!agreeInput.checked) {
      showHint(agreeInput, 'You must accept the Terms and Conditions to sign up.');
      valid = false;
    } else {
      showHint(agreeInput, '');
    }

    return valid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) return;

    // No dedicated post-signup destination specified — send to login
    // so the new user can sign in with their freshly created account.
    window.location.href = './login.html';
  });
})();