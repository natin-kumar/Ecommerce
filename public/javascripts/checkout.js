const address = document.getElementById('customerAddress');
const paymentMethod = document.getElementById('paymentMethod').value;
const pay = document.getElementById('pay');

pay.addEventListener('click', () => {
    // console.log("add: ",address.value)
    if (address.value.trim() == "") {
        return alert("Please fill in the address field.");
    }

    const obj = {
        add: address.value,
        payMethod: paymentMethod
    };
   
    fetch('/proceedPayment', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        return res.json(); 
    })
    .then(data => {

        alert(data.message);
        if(data.redirected)
        {
            window.location.href=data.url;
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        alert('There was an issue processing your payment. Please try again later.');
    });
});
