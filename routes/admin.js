const router = require('express').Router();
const {
    onlyPublic,
    onlyPrivate
} = require('../middlewares/isAuth')
const {
    getIndex,
    getProductIndex,
    getAddProduct,
    postAddProduct,
    getAddCategory,
    postAddCategory,
    postAddSubCategory
} = require('../controllers/admin')
// const uploader = require('../middlewares/imageUpload');

router.get('/',onlyPrivate,getIndex)
router.get('/products',onlyPrivate,getProductIndex)
router.get('/add-product',onlyPrivate,getAddProduct)
router.get('/add-category',onlyPrivate,getAddCategory)
router.post('/add-product',onlyPrivate,postAddProduct)
router.post('/add-category',onlyPrivate,postAddCategory)
router.post('/add-sub-category',onlyPrivate,postAddSubCategory)

module.exports = router;