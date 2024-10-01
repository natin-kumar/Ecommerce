document.addEventListener('click',(event)=>{
    if(event.target&&event.target.classList.contains('remove'))
    {
        const id=event.target.parentElement.parentElement.id;
    console.log("id: ",id);
    fetch('/removeItem',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({id})
    })
    .then(res=>{
        if(!res.ok){
            throw new Error('error in removeItem: '+res.statusText);
        }
        return res.json();
    })
    .then(data=>{
        if(data.message=="Successful"){
            const parent=event.target.parentElement.parentElement.parentElement;
            const itemAmount=event.target.parentElement.parentElement.querySelector('.itemTotal').textContent.substring(1);
            const finalAnmount=document.querySelector('.totalPrice').textContent.substring(14);
            parent.removeChild(event.target.parentElement.parentElement); 
            document.querySelector('.totalPrice').textContent=`Total Price: $${finalAnmount-itemAmount}`
            let value=document.querySelector('.cartItems').innerText.substring(13);
            value--;
            document.querySelector('.cartItems').innerText=`Total Items: ${value}`;
            const amt=finalAnmount-itemAmount
            addAmount(amt,id);
        }
    })
    .catch(err=>{
        console.log("Error in removeItem: ",err);
    })
}
})
function quantity(e,flag){
    const qty=e.parentElement.querySelector('.qty');
    const id=e.parentElement.parentElement.id;
    const obj={
        qty: parseInt(qty.value),
        id:id,
        flag
    }
        fetch('/changeQty',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(obj)
        })
        .then(res=>{
            if(!res.ok){
                throw new Error('error in qty changes: '+res.statusText);
            }
            return res.json();
        }).then(data=>{
            if(data.message=="Successful"){
                // console.log("flag: ",flag);
                if(flag==1)
                    qty.value=parseInt(qty.value)+1; 
                    else
                    qty.value-=1;
                if(qty.value==0)
                {
                    const parent=e.parentElement.parentElement.parentElement;
                    const itemAmount=e.parentElement.parentElement.querySelector('.itemTotal').textContent.substring(1);
                    const finalAnmount=document.querySelector('.totalPrice').textContent.substring(14);
                    parent.removeChild(e.parentElement.parentElement); 
                    document.querySelector('.totalPrice').textContent=`Total Price: $${finalAnmount-itemAmount}`
                    let value=document.querySelector('.cartItems').innerText.substring(13);
                    value--;
                    document.querySelector('.cartItems').innerText=`Total Items: ${value}`;
                    const amt=finalAnmount-itemAmount
                    addAmount(amt,id);
                }
                else
                {
                    const parent=e.parentElement.parentElement;
                    const price=parent.querySelector('.itemprice');
                    const display=parent.querySelector('.itemTotal')
                    display.innerHTML=`$${(qty.value*parseInt(price.innerHTML.substring(1))).toFixed(2)}`;
                    const total=document.querySelector('.totalPrice');
                    const arr= parent.parentElement.querySelectorAll('.itemTotal');
                    let sum=0;
                    arr.forEach(e=>{
                        console.log("amt: ",e.innerHTML.substring(1));
                        sum+=parseInt(e.innerHTML.substring(1));
                    })
                    total.innerHTML=`Total Price: $${sum.toFixed(2)}`;
                    addAmount(sum.toFixed(2),id);
                    // console.log("hii")
                }
            }
            else
            {
                alert(data.message);
            }
        })
        .catch(err=>{
            console.log("Error in qty changes: ",err);
        })
    }

    function addAmount(amt,id){
        const obj={
            amt:amt,
            id:id
        }
        console.log(obj);
        fetch('/updateAmount',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(obj)
        })
        .then(res=>{
            if(!res.ok)
            {
                throw ERROR("Error : ",res.statusText);
            }
            return res.json();
        })
        .then(data=>{
            console.log(data);
        })
        .catch(err=>{
            console.log(err);
        })
    }