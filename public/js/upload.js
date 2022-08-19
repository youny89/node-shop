const addForm = document.getElementById('add-product');
const fileInput = addForm.querySelector('#image');
const categoryEle = addForm.querySelector('#category')

const submitHandler = e => {
    e.preventDefault()
    // 추가 validate 가능..
    if(!addForm.querySelector('#imageId')) {
        console.log('이미지를 선택해주세요.')
        return;
    } else {
        addForm.submit()
    }
}

const setImageUrlId = id => {
    const input = document.createElement('input');
    input.type='hidden';
    input.name='imageId';
    input.id="imageId"
    input.value=id;
    addForm.appendChild(input);
}

// CF서버로 이미지업로드 요청.
const uploadImageToCF = async (uploadURL) => {
    const image = fileInput.files[0];
    const form = new FormData();
    const productTitle = addForm.querySelector('#title').value;
    form.append('file',image,productTitle)
    const response = await fetch(uploadURL,{
        method:'POST',
        body:form
    });

    const{success, result} = await response.json();
    console.log(result);
    if(!success) return;
    setImageUrlId(result.id);
}


//백엔드 서버에 이미지 업로드를 위한 빈 image url을 요청.
function getImageUploadUrl (e) {
    const file = fileInput.files[0]
    if(file) {
        document.querySelector('.input-file-group img').src = URL.createObjectURL(file);
    }
    // console.log('개발 모드, 실제 이미지 업로드 주석처리')
    fetch('/api/image-upload-url',{
        method:"GET"
    })
    .then(response=>response.json())
    .then(data=>{
        if(!data.ok) return;
        uploadImageToCF(data.uploadURL);
    })
    .catch(err=>console.log(err));

}

function changeCategoryHandler () {
    const categoryId = categoryEle.selectedOptions[0].value;
    const subCategoryEle = document.getElementById('sub_category')
    subCategoryEle.innerHTML=null
    fetch(`/api/category/${categoryId}`)
        .then(response=>response.json())
        .then(data=>{
            if(data.ok) {
                data.category.sub_category.forEach(sub_name=>{
                    const option = document.createElement('option')
                    option.value= sub_name;
                    option.textContent=sub_name;
                    subCategoryEle.appendChild(option)
                });
            }
        })
        .catch(err=>console.log(err))
}

fileInput.addEventListener('change',getImageUploadUrl)
addForm.addEventListener('submit',submitHandler);
categoryEle.addEventListener('change',changeCategoryHandler)