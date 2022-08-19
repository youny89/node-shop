const forgotForm = document.getElementById('forgot-form');
const emailInput = document.getElementById('email');
const informEle = document.getElementById('inform');
const submitBtn = document.getElementById('submit-btn');

function onSubmitHandler (e) {
    e.preventDefault();
    const email = emailInput.value;
    if(forgotForm.classList.includes('done-email')) forgotForm.classList.add('done-email')
    informEle.textContent='';
    if(!email || email.length < 0 || !email.includes('@')) {
        informEle.textContent = '올바른 이메일을 입력해주세요.'
        return;
    }

    submitBtn.textContent = '이메일 전송 중...'
    fetch('/api/forgot',{
        method:"POST",
        body:JSON.stringify({email}),
        headers:{
            "Content-Type":"application/json"
        }
    })
        .then(response=>response.json())
        .then(data=>{
            submitBtn.textContent='확인';
            if(data.ok) {
                informEle.textContent = '✔  이메일 발송을 완료했습니다.'
                forgotForm.classList.add('done-email')
            } else {
                informEle.textContent='해당 이메일을 찾을수 없습니다.';
            }
        })
        .catch(err=>console.log(err))
}

if(forgotForm) forgotForm.addEventListener('submit',onSubmitHandler)