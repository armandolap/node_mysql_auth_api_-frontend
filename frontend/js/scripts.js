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
    form.reset();
    form.className = '';
    inputs.forEach(input => {
      input.classList.remove('borderValidation');
    });
    switch(e.target.id) {
      case '1':
        formTitle.innerHTML = "Registro";
        form.classList.add('registerForm');
      break;
      case '2':
        formTitle.innerHTML = "Login";
        form.classList.add('loginForm');
      break;
    }
  });
});
// validation
form.addEventListener('submit', e => {
  e.preventDefault();
  let formValidated = true;
  inputs.forEach(input => {
    if (input.value.length === 0) {
      input.classList.add('borderValidation');
      formValidated = false;
    } else {
      input.classList.remove('borderValidation');
    }
  });
  if (formValidated) {
    fetch('http://127.0.0.1:3000/users/register', {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        username: inputs[0].value, 
        password: inputs[1].value 
      })
    })
    .then(res => res.json())
    .then(data => msgDiv.innerHTML=data.message)
  }
});

