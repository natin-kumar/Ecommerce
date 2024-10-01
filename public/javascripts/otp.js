document.getElementById('verifyOtpBtn').addEventListener('click', function () {
    const otp = document.getElementById('otp').value;

    fetch('/verifyOTP', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otp })
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Error: " + res.statusText);
        }
        return res.json();
    })
    .then(data => {
        handleOtpResponse(data);
    })
    .catch(err => {
        handleError("Error in verification: ", err);
    });
});

const verify = document.getElementById('verifyOtpBtn');
const resend = document.getElementById('resendOtp');
let i = 30;

function updateTimer() {
    resend.disabled = true;
    resend.style.backgroundColor = "grey";
    updateStatusMessage(`You can resend OTP after ${i} seconds.`);

    const interval = setInterval(() => {
        i--;
        updateStatusMessage(`You can resend OTP after ${i} seconds.`);
        if (i <= 0) {
            clearInterval(interval);
            resend.disabled = false;
            resend.style.backgroundColor = "green";
            verify.disabled = false;
            updateStatusMessage(""); // Clear status message
        }
    }, 1000);
}

function handleOtpResponse(data) {
    console.log(data);
    const statusMessage = document.querySelector('#statusMessage');
    if (data.message === "OTP not matched!") {
        alert(data.message);
        setTimeout(() => {
            updateStatusMessage("");
        }, 2999);
        return;
    }
    if (data.message === "User already exists." || data.message === "User registered successfully.") {
        window.location.href = "/loginUser";
    }
    if (data.message === "Enter new Password") {
        window.location.href = "/resetPass";
    }
}

function handleError(message, error) {
    console.error(message, error);
    updateStatusMessage("An error occurred. Please try again.");
}

function updateStatusMessage(message) {
    const statusMessage = document.querySelector('#statusMessage');
    statusMessage.innerHTML = message;
}

updateTimer();

resend.addEventListener('click', () => {
    fetch('/resend', {
        method: 'GET'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Error: " + res.statusText);
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
        if (data.message === "OTP resent successfully.") {
            updateStatusMessage("OTP resent successfully.");
            i = 30;  
            updateTimer(); 
        } else {
            updateStatusMessage("Failed to resend OTP.");
        }
        setTimeout(() => {
            updateStatusMessage("");
        }, 3000);
    })
    .catch(err => {
        handleError("Error in resending OTP: ", err);
    });
});
