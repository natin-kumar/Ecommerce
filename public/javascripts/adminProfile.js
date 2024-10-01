document.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('del')) {
        fetch('/admin/delete/product', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: target.id })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Error in deleting product: " + res.statusText);
            }
            return res.json();
        })
        .then(data => {
            if (data.message == "successful") {
                const dataElement = target.closest('.col-md-4'); 
                if (dataElement) {
                    dataElement.remove();
                    document.getElementById('len').textContent = "Total Products: " + (document.querySelectorAll('.col-md-4').length || 0);
                }
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
    }

    if (target && target.classList.contains('edit')) {
        const productElement = target.closest('.card'); 

        productElement.querySelectorAll('input').forEach(input => {
            input.removeAttribute('readonly');
        });

        productElement.querySelector('.update').style.display = "block";
        productElement.querySelector('.edit').style.display = "none";

        document.querySelectorAll('.card').forEach(element => {
            if (element !== productElement) {
                element.querySelector('.update').style.display = "none";
                element.querySelector('.edit').style.display = "";
                element.querySelectorAll('input').forEach(input => {
                    input.setAttribute('readonly', 'true');
                });
            }
        });
    }

    if (target && target.classList.contains('update')) {
        const eventId = target.id;
        const productElement = target.closest('.card'); // Adjust selector as needed
        const name = productElement.querySelector(`#productName_${eventId}`).value;
        const price = productElement.querySelector(`#productPrice_${eventId}`).value;
        const productNumber = productElement.querySelector(`#productNumber_${eventId}`).value;
        const color = productElement.querySelector(`#productColor_${eventId}`).value;
        const size = productElement.querySelector(`#productSize_${eventId}`).value;
        const quantity = productElement.querySelector(`#productQuantity_${eventId}`).value;

        if (price[0] !== '$') {
            alert("Price should start with $");
            return;
        }
        const numericPrice = price.slice(1);

        if (isNaN(numericPrice) || numericPrice < 1) {
            alert("Price should be a valid number and not less than $1");
            return;
        }

        if (isNaN(quantity) || quantity < 1) {
            alert("Quantity should be a valid number and not less than 1");
            return;
        }

        if (isNaN(size) || size < 1) {
            alert("Size should be a valid number and not less than 1");
            return;
        }

        if (!color || !productNumber) {
            alert("Please fill all details");
            return;
        }

        const obj = {
            name: name,
            price: `$${numericPrice}`,
            productNumber: productNumber,
            color: color,
            size: size,
            quantity: quantity,
            id: eventId
        };

        fetch('/admin/update/product', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Error in updating product: " + res.statusText);
            }
            return res.json();
        })
        .then(data => {
            if (data.message == "successful") {
                alert(data.message);

                target.style.display = "none";
                productElement.querySelector('.edit').style.display = "block";
                productElement.querySelectorAll('input').forEach(input => {
                    input.setAttribute('readonly', 'true');
                });
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
    }
});
