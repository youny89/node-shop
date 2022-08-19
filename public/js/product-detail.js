const addressInputEle = document.getElementById('order_address');
const checkoutContainer = document.getElementById('checkout');
const slideCheckoutBtn = document.getElementById('slide-checkout-btn');
const slideCancelBtn = document.getElementById('cancel-btn');
const addToCartBtn = document.getElementById('add-to-cart');
const reviewList = document.querySelectorAll('.review-item');

function slideCheckoutHandler () {
    checkoutContainer.classList.add('show');
}
function cancelSlideCheckoutHandler () {
    checkoutContainer.classList.remove('show');
}
function searchAddressHandler () {
    new daum.Postcode({
        oncomplete: function(data) {
            const address = data.address;
            addressInputEle.value = address;
        }
    }).open();
}
function reviewItemClickHadnler () {
    this.classList.toggle('active')
}
if(addressInputEle) addressInputEle.addEventListener('click',searchAddressHandler)
if(slideCheckoutBtn) slideCheckoutBtn.addEventListener('click',slideCheckoutHandler)
if(slideCancelBtn) slideCancelBtn.addEventListener('click',cancelSlideCheckoutHandler)
if(reviewList) reviewList.forEach(review=>review.addEventListener('click',reviewItemClickHadnler))
