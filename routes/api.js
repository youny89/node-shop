const router = require('express').Router();
const {
    onlyPublic,
    onlyPrivate
} = require('../middlewares/isAuth')
const { 
    getImageUploadUrl,
    postAddToCart,
    postRemoveCartItem,
    getProductByFiltername,
    getCategoryWithSubCategory,
    postForgot} = require('../controllers/api');
// const uploader = require('../middlewares/imageUpload');

router.get('/products/:category/:filter',getProductByFiltername)
router.get('/category/:categoryId',getCategoryWithSubCategory)
router.get('/image-upload-url',onlyPrivate,getImageUploadUrl)
router.post('/add-to-cart',onlyPrivate,postAddToCart)
router.post('/remove-cart-item',onlyPrivate,postRemoveCartItem)
router.post('/forgot',onlyPublic,postForgot)

module.exports = router;