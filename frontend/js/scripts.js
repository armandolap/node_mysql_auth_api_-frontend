// get DOM elements
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
        inputsD_none();
        form.classList.add('current');
      break;
      case '4':
        formTitle.innerHTML = "Ver todos los usuarios";
        inputsD_none();
        form.className = '';
      break;
      case '5':
        formTitle.innerHTML = "Ver usuario por id";
        inputsD_none();
        inputs[2].classList.remove('d-none-id');
        inputs[2].classList.remove('d-none');
        form.className = '';
      break;
    }
  });
});

// form submitted and fetch 
form.addEventListener('submit', e => {
  e.preventDefault();
  const fetchMethod = form.getAttribute('fetchMethod');
  if (validateForm(fetchMethod)) {
    const apiOption = e.target.className;
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
      break;
    }
    // fetching form
    fetch('http://127.0.0.1:3000/users/' + apiOption, fetchOptions)
    .then(res => res.json())
    .then(data => {
      fetchResponse(data) 
    })
    .catch( error => {
      msgDiv.innerHTML = "Ha ocurrido un error en la API. " + error;
    });
  }
});

// fetch response
function fetchResponse(data) {
  msgDiv.innerHTML = '';
  if (data.token) { // login
    msgDiv.innerHTML = "Login correcto. <br><br> Token: " + data.token;
    localStorage.setItem("token", data.token);
  } else if (data.message) { // messages
    msgDiv.innerHTML = data.message;
  } else if (data.length >= 0) { // get all users
    data.forEach(user => {
      msgDiv.innerHTML += `
      id: ${user.id} <br> 
      username: ${user.username} <br> 
      created At: ${dateFormat(user.createdAt)} <br> 
      updated At: ${dateFormat(user.updatedAt)} <br><br>
    `;
    });
  } else { // get current user
      msgDiv.innerHTML = `
      id: ${data.id} <br> 
      username: ${data.username} <br> 
      created At: ${dateFormat(data.createdAt)} <br> 
      updated At: ${dateFormat(data.updatedAt)} 
    `;
  }
}

// reset form
function resetForm() {
  form.reset();
  form.className = '';
  msgDiv.innerHTML = '';
  inputs.forEach(input => {
    input.classList.remove('borderValidation');
    input.classList.remove('d-none');
  });
}

// hide form inputs
function inputsD_none() {
  inputs.forEach(input => {
    input.classList.add('d-none');
  });
}

// validate form
function validateForm(fetchMethod) {
  let validation = true;
  if (fetchMethod === 'get') {
    return validation;
  } 
  inputs.forEach(input => {
    if (input.value.length === 0) { 
      input.classList.add('borderValidation');
      validation = false
    } else {
      input.classList.remove('borderValidation');
    }
  });
  return validation;
}

// timestamp mysql to dd/mm/yyyy 
function dateFormat(inputDate) {
  inputDate = new Date(inputDate);
  let date, month, year;
  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();
  date = date
    .toString()
    .padStart(2, '0');
  month = month
    .toString()
    .padStart(2, '0');
  return `${date}/${month}/${year}`;
}