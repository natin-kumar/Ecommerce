const myform = document.getElementById('productForm');
const save= document.getElementById('save');
save.addEventListener('click',(event)=>{
    event.preventDefault();
    const formObj = new FormData(myform);
    const formDataObject = Object.fromEntries(formObj.entries());
    if(formDataObject.price<1)
    {
        alert("price should not be less than $1");
        return;
    }
    if(formDataObject.quantity<1)
    {
        alert("Quantity should not be less than $1");
        return;
    }
    if(!formDataObject.image){
        alert("Please upload image");
        return;
    }
    if(!formDataObject.color||!formDataObject.size||!formDataObject.productNumber)
    {
        alert("Please fill all details");
        return;
    }
    fetch('/admin/add-product',{
        method:"POST",
        body:formObj
    }).
    then(res=>{
        if(!res.ok){
            throw Error('Error in addProduct: '+res.StatusText);
        }
        return res.json();
    })
    .then(data=>{
        if(data.message=="SuccessFul")
        {
            alert('Product added successfully!');
        }
        else
        {
            alert(data.message);
        }
    })
    .catch(err=>{
        console.log("Error: ",err);
    })
}
)