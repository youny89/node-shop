function showMessage (message) {
    if(document.querySelector('.message')) {
        document.querySelector('.message').remove()
    }
    const messageEle = document.createElement('div');
    messageEle.innerText = message;
    messageEle.className = 'message'
    
    document.getElementsByTagName('body')[0].appendChild(messageEle) 
    setTimeout(() => {
        messageEle.classList.add('slideout')
        // messageEle.remove();
    },4000)
}