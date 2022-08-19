const router = require('express').Router();
const {body} = require('express-validator')
const User = require('../models/user')

const {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    getForgot,
    getReset,
    postReset,
    postLogout} = require('../controllers/auth')
const {
    onlyPublic,
    onlyPrivate
} = require('../middlewares/isAuth')


router.get('/login',onlyPublic,getLogin);
router.post('/login',
    body('email').isEmail().withMessage('올바른 이메일 주소을 입력해주세요'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
    onlyPublic,postLogin)

router.get('/signup',onlyPublic,getSignup);
router.post('/signup',
    body('email')
        .isEmail().withMessage('올바른 이메일 주소을 입력해주세요')
        .custom(value=>{
            return User.findOne({email:value}).then(user=>{
                if(user) return Promise.reject('이미 존재하는 이메일입니다. 다른 이메일을 입력해주세요.') 
            })
        }),
    body('password').isLength({min:6}).withMessage('최소 6글자 이상 입력해주세요'),
    body('password2').custom((value,{req}) => {
        if (value !== req.body.password) {
            return Promise.reject('비밀번호가 일치하지 않습니다.')
        } else { 
            return Promise
        }
    }),
    onlyPublic,postSignup);

router.post('/logout',onlyPrivate,postLogout);
router.get('/forgot',onlyPublic,getForgot)
router.get('/reset/:token',onlyPublic,getReset)
router.post('/reset',
    body('new_password').isLength({min:6}).withMessage('최소 6글자 이상 입력해주세요'),
    body('new_password2').custom((value,{req}) => {
        if (value !== req.body.new_password) {
            return Promise.reject('비밀번호가 일치하지 않습니다.')
        } else { 
            return Promise
        }
    }),
    onlyPublic,postReset)

module.exports = router;