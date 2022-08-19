const items = document.querySelectorAll('.item')

function next () {
    const currentItem = document.querySelector('.item.current');
    currentItem.classList.remove('current')
    if(currentItem.nextElementSibling){
        currentItem.nextElementSibling.classList.add('current')
    } else {
        items[0].classList.add('current')
    }
}

setInterval(next,4000)