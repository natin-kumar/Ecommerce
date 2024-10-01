document.getElementById('submit').addEventListener('click',()=>{
    const mail=document.getElementById('email').value;
    if(mail.trim==""||!mail.includes('@')||mail.length<12)
    {
        alert("Please Enter valid mail");
        return;
    }
    document.getElementById('submit').style.display="none"
    document.querySelector('.response').innerText="Waiting....";

    fetch('/forgetPass',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({mail})
    })
    .then(res=>{
        if(!res.ok){
            throw new Error("Error in forgetPass in res: "+res.statusText)
        }
        return res.json();
    })
    .then(data=>{
        document.querySelector('.response').innerText="";

        if(data.message=="User not found. Please sign up first.")
        {
            alert(data.message);
            window.location.href="/signup";
        }
        else if(data.message=="successful")
        {
            // window.location.href="/otp";
            document.getElementById('p').innerText="Enter OTP: ";
            document.querySelector('.form-group').style.display="none";
            alert(data.message);
            document.getElementById('email').style.display="none";
            document.getElementById('submit').style.display="none";
            const div = document.createElement('div');
            div.innerHTML=`
             <input type="text" class="form-control" style="margin-top=1%;" name="otp" placeholder="Enter OTP" id="otp" maxlength="4">
                           <input type="button" name="verify" id="verify" class="btn btn-custom btn-block" value="Verify OTP">

            `
            div.className='verifyContainer';
            targetElement=document.getElementById('submit');
            targetElement.insertAdjacentElement('afterend', div);
            const verify=document.getElementById('verify');
            verify.addEventListener('click', (req,res)=>{
                const otp=document.getElementById('otp');
                console.log(otp.value);
                fetch('/verifyNewPass',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({otp:otp.value})
                })
                .then(res=>{
                    if (!res.ok) {
                        return res.json().then(error => { throw new Error(error.message); });
                      }
                      return res.json();
                })
                .then(data=>{
                    alert(data.message);
                    if(data.message=="verified")
                    {
                        window.location.href="/resetPass";
                    }
                    else{
                        document.querySelector('.response').innerText="Invalid otp,please enter correct otp";
                        document.querySelector('.response').style.color="red";

                    }
                })
                .catch((err) => {
                    alert(err.message);
                  });
            })

        }
        else{
            document.querySelector('.response').innerText="Invalid otp,please enter correct otp";
        }
    })
    .catch(err=>{
        console.log("Error in forget pass in catch: ",err);
    })
})
