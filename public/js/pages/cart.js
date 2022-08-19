const orderForm = document.getElementById('order-form');
const remvoeBtn = document.querySelectorAll('.remove-btn');
const addressItems = document.querySelectorAll('.address-item');
const addressInputEle = document.getElementById('order_address');

const removeItemHandler = async (e) => {
   const productId = document.getElementById('productId'); 
   if(!productId) return;

   const response = await fetch('/api/remove-cart-item',{
    method:"POST",
    body:JSON.stringify({id:productId.value}),
    headers:{
        "Content-Type":"application/json"
    }
   });

   const data = await response.json();
   if(data.ok) {
    showMessage('카트 상품을 삭제 했습니다.');
    e.target.parentElement.parentElement.remove()

   }
}

function selectAddressHandler(){
    addressInputEle.value = this.querySelector('input').value
}

function searchAddressHandler () {
    new daum.Postcode({
        oncomplete: function(data) {
            const address = data.address;
            addressInputEle.value = address;
        }
    }).open();
}

function orderSubmitHandler (e) {
    e.preventDefault();
    // Validate before submit    
    if(!addressInputEle.value) {
        showMessage('❗ 배송지를 입력해주세요')
        return;
    }

    orderForm.submit();
}

if(remvoeBtn) remvoeBtn.forEach(btn=>btn.addEventListener('click',removeItemHandler)) 
if(addressItems) addressItems.forEach(item=>item.addEventListener('click',selectAddressHandler)) 
if(addressInputEle) addressInputEle.addEventListener('click',searchAddressHandler) 
if(orderForm) orderForm.addEventListener('submit',orderSubmitHandler)


