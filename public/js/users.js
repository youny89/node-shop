const container = document.getElementById('update-password-container');
const formToggle = document.getElementById('update-password-toggle');
const showAddressSearch = document.getElementById('address-search');
const showAddAddressBtn =document.getElementById('address-add-btn')
const showListAddressBtn =document.getElementById('addresss-list-btn')


function handleShowAddAddress(){
    if(showListAddressBtn.classList.contains('active')) {
        showListAddressBtn.classList.remove('active')
    }
    showAddAddressBtn.classList.add('active');
    document.getElementById('container-add-address-form').classList.add('active');
    document.getElementById('container-address-list').classList.remove('active')
    
}

function handleShowListAddress(){
    if(showAddAddressBtn.classList.contains('active')) {
        showAddAddressBtn.classList.remove('active')
    }
    showListAddressBtn.classList.add('active');
    document.getElementById('container-add-address-form').classList.remove('active');
    document.getElementById('container-address-list').classList.add('active')
}

const handlePostcode = () => {
    new daum.Postcode({
        oncomplete: function(data) {
           const address = data.address;
           showAddressSearch.value = address;
        }
    }).open();
}


showAddressSearch.addEventListener('click',handlePostcode);
formToggle.addEventListener('click',()=>container.classList.toggle('show'))
showAddAddressBtn.addEventListener('click',handleShowAddAddress)
showListAddressBtn.addEventListener('click',handleShowListAddress)