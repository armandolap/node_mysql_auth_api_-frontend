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
        form.setAttribute('fetchMethod', 'post');
      break;
      case '2':
        formTitle.innerHTML = "Login";
        form.classList.add('authenticate');
        form.setAttribute('fetchMethod', 'post');
      break;
      case '3':
        formTitle.innerHTML = "Ver mi usuario";
        inputs[0].classList.add('d-none');
        inputs[1].classList.add('d-none');
        form.classList.add('current');
        form.setAttribute('fetchMethod', 'get');
      break;
    }
  });
});

// form submitted and fetch 
form.addEventListener('submit', e => {
  e.preventDefault();
  console.log(validateForm());
  if (validateForm()) {
    const apiOption = e.target.className;
    const fetchMethod = form.getAttribute('fetchMethod');
    let fetchOptions = {};
    // fetch opcions obj
    switch (fetchMethod) {
      case 'post':
        fetchOptions = {
          method: 'post',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: inputs[0].value, 
            password: inputs[1].value 
          })
        }
        break;
      case 'get': 
        const token = localStorage.getItem("token");
        fetchOptions = {
          method: 'get',
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": "Bearer " + token
          },
        }
    }
    
    fetch('http://127.0.0.1:3000/users/' + apiOption, fetchOptions)
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        msgDiv.innerHTML = "Login correcto. <br><br> Token: " + data.token;
        localStorage.setItem("token", data.token);
      } else if (data.message) {
        msgDiv.innerHTML = data.message;
      } else {
        msgDiv.innerHTML = `id: ${data.id}, username: ${data.username}`; 
      }
    })
    .catch( error => {
      msgDiv.innerHTML = "Ha ocurrido un error en la API. " + error;
    });
  }
});

// reset form
function resetForm() {
  form.reset();
  form.className, msgDiv.innerHTML = '';
  inputs.forEach(input => {
    input.classList.remove('borderValidation');
    input.classList.remove('d-none');
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
 // return true;
}