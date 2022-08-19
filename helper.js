const nodeMiailer = require('nodemailer');
module.exports.sendEamil = function (options) {
    const transport =  nodeMiailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        port:process.env.EMAIL_PORT,
        host:process.env.EMAIL_HOST,
        secure:false,
        requireTLS:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    });
    
    return transport.sendMail(options);
}

