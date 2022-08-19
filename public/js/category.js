const filterContainer = document.getElementById('filter-items');

function renderProductList (products) {
    console.log(products)
    const productList = document.createElement('div'); 
    productList.id = 'product-list';
    productList.className='product-list';
    products.forEach(product=>{
        const productItem = document.createElement('div');
        productItem.className='product-item';
        productItem.innerHTML = `
        <div class="product-image">
            <a href=/products/${product._id}>
                <img src="${product.imageUrl}/public" alt="">
            </a>
        </div>
        <div class="product-content">
            <a href=/products/${product._id}><h3>${product.title}</h3></a>
            <span>${product.price}원</span>
            <span>${product.description}</span>
            <span> review 0 </span>
        </div>
        `
        productList.appendChild(productItem);
    })
    document.getElementById('product-list').replaceWith(productList)
}

function clickFilterHandler () {
    const category = location.href.split('/category/')[1];
    const filter = this.dataset.filter;

    if(category.includes('/')){
        const categoryName = category.split('/')[0];
        const subName = category.split('/')[1];
        console.log(subName)
        fetch(`/api/products/${encodeURIComponent(categoryName)}/${encodeURIComponent(filter)}?sub_name=${encodeURIComponent(subName)}`) 
        .then(response=>{
            console.log(response)
            return response.json()
        })
        .then(data=>{
            console.log(data)
            if(data.ok) {
                renderProductList(data.products);
            }
        })
        .catch(err=>console.dir(err))
    } else {
        fetch(`/api/products/${category}/${filter}`) 
            .then(response=>response.json())
            .then(data=>{
                if(data.ok) {
                    renderProductList(data.products);
                }
            })
            .catch(err=>console.log(err))
    }

}
if(filterContainer){
    filterContainer.querySelectorAll('span').forEach(item=>item.addEventListener('click',clickFilterHandler))
}