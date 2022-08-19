const router = require('express').Router();
const {
    getIndex,
    getSearch,
    getProducts,
    getProduct,
    getCart,
    postClearCart,
    postSingleProductOrder,
    postOrders,
    getOrders,
    getOrderDetail,
    getAddReview,
    postAddReview,
    getSuccess
} = require('../controllers/shop')

const {  onlyPrivate} = require('../middlewares/isAuth')

router.get('/',getIndex);
router.get('/search',getSearch);
router.get('/products',getProducts);
router.get('/products/:productId',getProduct);
router.get('/cart',onlyPrivate,getCart);
router.post('/clear-cart',onlyPrivate,postClearCart);
router.post('/order',onlyPrivate,postSingleProductOrder);
router.post('/orders',onlyPrivate,postOrders);
router.get('/orders',onlyPrivate,getOrders);
router.get('/orders/:orderId',onlyPrivate,getOrderDetail);
router.get('/add-review/:productId',onlyPrivate,getAddReview)
router.post('/add-review/',onlyPrivate,postAddReview)
router.get('/success',onlyPrivate,getSuccess); // kakao 결제 api route
router.get('/cancel',(_,res)=>res.redirect('/')); // kakao 결제 취소시 리다이렉션

module.exports = router;