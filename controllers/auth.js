const crypto = require('crypto')
const { validationResult } = require('express-validator');
const User = require('../models/user')
const asyncHandler = require('../middlewares/asyncHandler');
const {sendEamil} = require('../helper')

/**
 * GET /login
 * 로그인 페이지
 */
exports.getLogin = asyncHandler(async(req,res,next) => {
    res.render('auth/login',{
        pageTitle:"Node-Shop|로그인",
        path:'/login',
        error:{},
        errorMessage:'',
        payload:{}
    })
});
/**
 * POST /logout
 * 로그아웃 프로세스
 */
exports.postLogout = asyncHandler(async(req,res,next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
      });
});
/**
 * POST /login
 * 로그인 프로세스
 */
exports.postLogin = asyncHandler(async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).render('auth/login',{
            pageTitle:"Node-Shop|로그인",
            path:'/login',
            error:errors.mapped(),
            errorMessage:'',
            payload:{...req.body}
        })
    }
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('password email role');
    if(!user) return res.render('auth/login',{
        path:"/login",
        error:"이메이 혹은 비밀번호가 일치하지 않습니다.",
        pageTitle:"로그인",
        error:{
            email:{value:email},
            password:{value:password}
        },
        errorMessage:"이메일 혹인 비밀번호가 일치하지 않습니다.",
        payload:{...req.body}
    });

    const isMatch = await user.matchPassword(password);
    if(!isMatch) return res.render('auth/login',{
        path:"/login",
        error:"이메이 혹은 비밀번호가 일치하지 않습니다.",
        pageTitle:"로그인",
        error:{
            email:{value:email},
            password:{value:password}
        },
        errorMessage:"이메일 혹인 비밀번호가 일치하지 않습니다.",
        payload:{...req.body}

    });
    responseWithSession(req,res,user);
});
/**
 * GET /signup
 * 회원가입 페이지
 */
exports.getSignup = asyncHandler(async(req,res,next) => {
    res.render('auth/signup',{
        pageTitle:"Node-Shop|회원가입",
        path:'/signup',
        error:{},
        errorMessage:'',
        payload:{}
    })
});

/**
 * POST /login
 * 회원가입 프록세스
 */
exports.postSignup = asyncHandler(async(req,res,next) => {
    const errors = validationResult(req);
    const {email, password} = req.body;
    if(!errors.isEmpty()) {
        console.log(errors.mapped())
        return res.render('auth/signup',{
            pageTitle:"Node-Shop|회원가입",
            path:'/signup',
            error:errors.mapped(),
            errorMessage:'',
            payload:{...req.body}
        })
    }
    const user = await User.create({
        email, password
    });

    console.log('sent email to ' + email);

    const result = await sendEamil({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"[테스트] Node-Shop 회원가입",
        text:'[테스트] Node-Shop 회원가입에 감사합니다.'
    });
    console.log(result);
    responseWithSession(req,res,user);

});

/**
 * GET /forgot
 * 이메일 인증 
 */
exports.getForgot = asyncHandler(async(req,res,next) => {
    
   res.render('auth/forgot',{
    pageTitle:"Node-shop|비밀번호찾기",
    path:"/forgot"
   })
});


/**
 * GET /forgot
 * 이메일 인증 
 */
exports.getReset = asyncHandler(async(req,res,next) => {
    const {token} = req.params;
    const user = await User.findOne({resetPasswordToken:token,$gt: {resetPasswordExpires:Date.now()}})
    if(!user) {
        console.log('유효한 토큰이 아닙니다.')
        return res.redirect('/forgot');
    } else {
        res.render('auth/reset',{
         pageTitle:"Node-shop|비밀번호 재설정",
         path:"/reset",
         userId:user._id,
         resetPasswordToken:token,
         error:{},
         payload:{}
        });
    }
});


/**
 * GET /forgot
 * 이메일 인증 
 */
exports.postReset = asyncHandler(async(req,res,next) => {
    console.log(req.body);
    const errors = validationResult(req);
    const {new_password, userId, resetPasswordToken} = req.body;


    if(!errors.isEmpty()) {
        console.log(errors.mapped())
        return res.render('auth/reset',{
            pageTitle:"Node-Shop|회원가입",
            path:'/signup',
            error:errors.mapped(),
            errorMessage:'',
            payload:{...req.body},
            userId,
            resetPasswordToken
        }) 
    }

    const user = await User.findOne({
        _id:userId.toString(),
        resetPasswordToken,
        resetPasswordExpires : {$gt:Date.now()}
    });

    if(!user){
        console.log('유효한 토큰이 아니거나 유효 시간이 지났습니다.')
        return res.redirect('/forgot')
    } 

    user.password = new_password;
    responseWithSession(req,res,user)
});

async function responseWithSession(req,res,user){
    req.session.isLoggedIn = true;
    req.session.isAdmin=user.role==='admin' ? true:false
    req.session.user = {
        id:user.id
    }
    await req.session.save();
    res.redirect('/');
}