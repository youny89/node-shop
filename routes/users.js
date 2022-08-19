const router = require('express').Router();

const { onlyPrivate} = require('../middlewares/isAuth')

const {
    me,
    postUpdateProfile,
    postUpdatePassword,
    postUpdateAddress
} = require('../controllers/users');

router.get('/me',onlyPrivate,me)
router.post('/update-profile',onlyPrivate,postUpdateProfile)
router.post('/update-password',onlyPrivate,postUpdatePassword)
router.post('/update-address',onlyPrivate,postUpdateAddress)

module.exports = router;