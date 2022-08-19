const router = require('express').Router()
const {getProductByCategorys,getProductBySubCategoryId} = require('../controllers/category');

router.get('/:name',getProductByCategorys)
router.get('/:name/:sub_name',getProductBySubCategoryId)

module.exports = router;