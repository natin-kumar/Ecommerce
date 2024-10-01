const email = document.getElementById("email");
const pass = document.getElementById('password');
const btn = document.querySelector(".btn-custom"); 
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('password');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);

  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});
btn.addEventListener('click', (event) => {
  event.preventDefault(); 
  const personType = document.querySelector('input[name="person"]:checked')?.value; 

  if (!personType) {
    return alert("Please Select Person Type");
  }
  
  const obj = {
    mail: email.value,
    pass: pass.value,
    person: personType
  };

  fetch('/loginUser', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(obj)
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed " + res.statusText);
    }
    return res.json();
  })
  .then((data) => {
    // console.log(data);

    if (data.redirected) {
      window.location.href = data.url;
    } else if (data.message == 'User not found. Please sign up first.') {
      alert(data.message);
      window.location.href = data.url;
    } else {
      alert(data.message);
    }
  })
  .catch((err) => {
    document.querySelector('.response').innerText=err;
    console.log("Error in login:", err);
  });
});
