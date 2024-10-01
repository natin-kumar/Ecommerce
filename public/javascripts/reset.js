const response = document.querySelector(".response");
response.innerText = "";
response.style.display = "none";
document.getElementById("submit").addEventListener("click", () => {
  const pass = document.getElementById("new-password");
  const Confpass = document.getElementById("confirm-password");
  if (pass.value !== Confpass.value) {
    response.style.display = "";
    res.innerText = "Passwords do not match.";
    // alert();
    return;
  }
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const number = "1234567890";
  const symbol = "@#$%^&*()/>.<\\";
  const password = pass.value;

  const containsUpper = [...upper].some((char) => password.includes(char));
  const containsLower = [...lower].some((char) => password.includes(char));
  const containsNumber = [...number].some((char) => password.includes(char));
  const containsSymbol = [...symbol].some((char) => password.includes(char));

  if (
    !containsUpper ||
    !containsLower ||
    !containsNumber ||
    !containsSymbol ||
    password.length < 6
  ) {
    // console.log("hiii");
    response.style.display = "";
    response.innerText = "Make a strong password.";
    response.style.color = "red";
    return;
  }
  fetch("/resetPass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({password})
  })
  .then((res)=>{
    if (!res.ok) {
        return res.json().then(error => { throw new Error(error.message); });
      }
      return res.json();
  })
  .then(data=>{
    alert(data.message);
    if(data.message=='Password Update Successful')
    {
        window.location.href = '/loginUser';
    }
  })
  .catch((err) => {
    alert(err.message);
  });
});
