const togglePassowrdVisibility = (inputELement, toggleElement) => {
  if(inputELement.type === 'password') {
    inputELement.type = 'text';
    toggleElement.innerHTML = '<i class="fa fa-eye-slash"></i>';
  } else {
    inputELement.type = 'password';
    toggleElement.innerHTML = '<i class="fa fa-eye"></i>';
  }
}

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const passwordConfirm = document.getElementById('passwordConfirm');
const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');

togglePassword.addEventListener('click', () => {
  togglePassowrdVisibility(passwordInput, togglePassword);
});

togglePasswordConfirm.addEventListener('click', () => {
  togglePassowrdVisibility(passwordConfirm, togglePasswordConfirm);
});