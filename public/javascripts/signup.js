const nameInput = document.getElementById("name");
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const btn = document.querySelector(".btn-custom");
const response=document.querySelector('.response');
response.innerText="";
response.style.display="none";
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('password');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);

  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});
document.getElementById('togglePasswordconfirm').addEventListener('click', function () {
  const passwordField = document.getElementById('confirm-password');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);

  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});
btn.addEventListener('click', (event) => {
  event.preventDefault(); 
  if (passwordInput.value != confirmPasswordInput.value) {
    response.style.display="block";
    response.innerText=  "Passwords not match.";
    return;
  }
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const number = "1234567890";
  const symbol = "@#$%^&*()/>.<\\";
  const password = passwordInput.value;
  
  const containsUpper = [...upper].some(char => password.includes(char));
  const containsLower = [...lower].some(char => password.includes(char));
  const containsNumber = [...number].some(char => password.includes(char));
  const containsSymbol = [...symbol].some(char => password.includes(char));
  
  if (!containsUpper || !containsLower || !containsNumber || !containsSymbol || password.length < 6) {
    // console.log("hiii");
    response.style.display="block";
    response.innerText=  "Make a strong password."
    response.style.color="red";
      return;
  }
  
  const obj = {
    user: nameInput.value,
    mail: emailInput.value,
    pass: passwordInput.value
  };
  
  fetch('/signup', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(obj)
  })
  .then((res) => {
    if (!res.ok) {
      return res.json().then(error => { throw new Error(error.message); });
    }
    return res.json();
  })
  .then((data) => {
    alert(data.message);
    if (data.message == "Already exists.") {
      window.location.href = "/loginUser";
      // console.log("hii");
    }
    if (data.message == "Signup successful, please verify OTP.") {
      window.location.href = '/verifyOTP';
    }
  })
  .catch((error) => {
    alert(error.message);
  });
});
