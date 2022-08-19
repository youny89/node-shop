const addToCartBtns = document.querySelectorAll('.add-to-cart');

async function handleClickButton(){
    const productId = this.dataset.productid;
    await fetch('/api/add-to-cart',{
        method:'POST',
        body:JSON.stringify({id:productId}),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.ok) return showMessage('상품이 카트에 추가 되었습니다.');
        showMessage('상품을 추가 할수 없습니다..');
    }).catch(err=>{
        showMessage('상품을 추가 할수 없습니다..');
        console.log(error)
    })
}

if(addToCartBtns){
    addToCartBtns.forEach(addToCartBtn=>addToCartBtn.addEventListener('click',handleClickButton))
}
