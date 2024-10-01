const showmore = document.getElementById('showmore');
let counter = 2; 

showmore.addEventListener('click', () => {
  fetch('/getmore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ counter: counter }) 
  })
  .then(res=>{
    if(!res.ok)
    {
      throw new Error("Error: ",res.statusText);
    }
    return res.json();
  }) 
  .then(({data,nextdata}) => {
    // console.log("hiiii")
    // console.log("data:" ,data)
    // console.log("nextdata:" ,nextdata)

    if(!nextdata.length)
    {
      showmore.style.display="none";
    }
     console.log(data);
    const container = document.querySelector('.container');
    
    data.forEach(item => {
      if(!item.disable){
      const card = document.createElement('div');
      card.className = 'card';
      card.id = item._id;
      
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.className = 'images';

      const name = document.createElement('h3');
      name.className = 'productName';
      name.textContent = item.name;
      
      const price = document.createElement('h5');
      price.className = 'productPrice';
      price.textContent = `Price: ${item.price}`;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'CardButton';
      
      const addToCart = document.createElement('input');
      addToCart.type = 'button';
      addToCart.name = 'addToCart';
      addToCart.className = 'addToCart';
      addToCart.value = 'Add to Cart';
      
      const desc = document.createElement('input');
      desc.type = 'button';
      desc.name = 'desc';
      desc.className = 'desc';
      desc.value = 'Description';
      
      buttonContainer.appendChild(addToCart);
      buttonContainer.appendChild(desc);
      
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(price);
      card.appendChild(buttonContainer);
      container.appendChild(card);
  }});

    counter += 1; 
  })
  .catch(err => {
    console.log('Error in fetching:', err);
  });
});

document.querySelector('.container').addEventListener('click', function(event) {
  let id;
  if (event.target && event.target.classList.contains('desc')) {
    id = event.target.parentElement.parentElement.id;

    fetch('/popup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
      // console.log("data: ",data);
      const popUpContainer = document.createElement('div');
      popUpContainer.className = 'popup-container';

      const img = document.createElement('img');
      img.src = data.img;
      img.alt = data.name;
      img.className = 'images';

      const name = document.createElement('h3');
      name.innerText = data.name;

      const price = document.createElement('h5');
      price.innerText = `Price: ${data.price}`;

      const color = document.createElement('h5');
      color.innerText = `Color: ${data.color}`;

      const size = document.createElement('h5');
      size.innerText = `Size: ${data.size}`;

      const quantity = document.createElement('h5');
      quantity.innerText = `Quantity: ${data.quantity}`;

      const productNumber = document.createElement('h5');
      productNumber.innerText = `Product Number: ${data.productNumber}`;

      popUpContainer.appendChild(img);
      popUpContainer.appendChild(name);
      popUpContainer.appendChild(price);
      popUpContainer.appendChild(color);
      popUpContainer.appendChild(quantity);
      popUpContainer.appendChild(size);
      popUpContainer.appendChild(productNumber);
   
      const i= document.createElement('i');
      i.className="fa fa-close";
      i.classList.add("cross");
      i.style.fontSize="24px";
      i.style.color="black";
      i.style.position="absolute";
      i.style.top="0.5%";
      i.style.right="1%";
      popUpContainer.appendChild(i);
      popUpContainer.style.position = 'fixed';
      popUpContainer.style.width = '30vw';
      popUpContainer.style.maxHeight = '80vh';
      popUpContainer.style.top = '50%';
      popUpContainer.style.left = '50%';
      popUpContainer.style.transform = 'translate(-50%, -50%)';
      popUpContainer.style.backgroundColor = 'white';
      popUpContainer.style.border = '1px solid black';
      popUpContainer.style.padding = '20px';
      popUpContainer.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.2)';
      popUpContainer.style.zIndex = '1000';
      popUpContainer.style.overflowY = 'auto';
      popUpContainer.style.borderRadius = '8px';
      

      document.body.appendChild(popUpContainer);
    })
    .catch(err => console.log('Error in popup fetch:', err));
  }
});
document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('cross')) {
    const allPopUps = document.querySelectorAll('.popup-container');
    allPopUps.forEach(popUp => {
      document.body.removeChild(popUp);
    });
    }
});
document.addEventListener('click',(event)=>{
  if(event.target && event.target.classList.contains('addToCart')){
    event.target.style.backgroundColor = 'red'; 
    const id = event.target.parentElement.parentElement.id;
    // console.log("id: ",id);
    fetch('/Addcart',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({id})
    })
    .then(res=>{
      if(!res.ok){
        return new Error("Error in response: "+res.statusText);
      }
      return res.json();
    })
    .then(data=>{
      if(data.message=="successful")
      {
        event.target.style.backgroundColor = 'rgb(66, 224, 126)';
          fetch('/updateAmount',{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            }
          })
          .then(res=>{
            if(!res.ok){
              return new Error("Error in response: "+res.statusText);
            }
            return res.json();
          })
          .then(data=>{
            console.log(data);
          })
     }
      else if(data.message=="login"){
        event.target.style.backgroundColor = 'rgb(66, 224, 126)';  
        alert("Please Login First!");
        window.location.href=data.url;
      }
      else
      {
        alert(data.message);
        event.target.style.backgroundColor = 'rgb(66, 224, 126)';  

      }
    })
    .catch(err=>{
      console.log("Error in catch block of cart fetch: ",err);
    })
  }
})