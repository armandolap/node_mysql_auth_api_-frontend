// get elements
const lis = document.querySelectorAll('li');
const form = document.querySelector('form');
const formTitle = document.querySelector('.formTitle');
const inputs = document.querySelectorAll('input');
const msgDiv = document.querySelector('form div');
// select options
lis.forEach(li => {
  li.addEventListener('click', e => {
    form.classList.remove('d-none');
    resetForm();
    switch(e.target.id) {
      case '1':
        formTitle.innerHTML = "Registro";
        form.classList.add('register');
      break;
      case '2':
        formTitle.innerHTML = "Login";
        form.classList.add('authenticate');
      break;
    }
  });
});
// form submitted and fetch 
form.addEventListener('submit', e => {
  e.preventDefault();
  if (validateForm()) {
    fetch('http://127.0.0.1:3000/users/' + e.target.className, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        username: inputs[0].value, 
        password: inputs[1].value 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        msgDiv.innerHTML = "Login correcto. <br><br> Token: " + data.token;
      } else {
        msgDiv.innerHTML = data.message;
      }
    });
  }
});
// reset form
function resetForm() {
  form.reset();
  form.className = '';
  inputs.forEach(input => {
    input.classList.remove('borderValidation');
  });
}
// validate form
function validateForm() {
  inputs.forEach(input => {
    if (input.value.length === 0) {
      input.classList.add('borderValidation');
      return false;
    } else {
      input.classList.remove('borderValidation');
    }
  });
  return true;
}