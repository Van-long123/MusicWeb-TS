// change-status 
const buttonStatus=document.querySelectorAll('[button-status]')
if(buttonStatus.length>0){
    let url=new URL(window.location.href)
    buttonStatus.forEach(btn=>{
        btn.addEventListener('click',e=>{
            const status=btn.getAttribute('button-status')
            if(status){
                url.searchParams.set('status',status)
            }
            else{
                url.searchParams.delete('status')
            }
            window.location.href=url.href   
        })
    })
}
// change-status 

// search 
const formSeach=document.querySelector('#form-search')
if(formSeach){
    let url=new URL(window.location.href)
    formSeach.addEventListener('submit',e=>{
        e.preventDefault()
        const keyword=e.target.elements.keyword.value;
        if(keyword){
            url.searchParams.set('keyword',keyword)
        }
        else{
            url.searchParams.delete('keyword')
        }
        window.location.href=url.href   
    })
}
// search 

//sort 
const sort=document.querySelector('[sort]')
if(sort){
    let url=new URL(window.location.href)
    const sortSelect=document.querySelector('[sort-select]')
    const buttonClear=document.querySelector('[sort-clear]')
    sortSelect.addEventListener('change',e=>{
        const [sortKey,sortValue]=e.target.value.split('-');
        url.searchParams.set('sortKey',sortKey)
        url.searchParams.set('sortValue',sortValue)
        window.location.href=url.href   
    })
    buttonClear.addEventListener('click',e=>{
        url.searchParams.delete('sortKey')
        url.searchParams.delete('sortValue')
        window.location.href=url.href   
    })
    const sortKey=url.searchParams.get('sortKey')
    const sortValue=url.searchParams.get('sortValue')
    if(sortKey&&sortValue){
        const stringSort=`${sortKey}-${sortValue}`
        const optionSelect=document.querySelector(`option[value='${stringSort}']`)
        optionSelect.selected=true
    }

}
//sort 


// show alert
const showAlert=document.querySelector('[show-alert]')
if(showAlert){
    const time=parseInt(showAlert.getAttribute('data-time'))
    setTimeout(() => {
        showAlert.classList.add('d-none')
    }, time);
}
// show alert
// close show alert 
const closeAlert=document.querySelector('[close-alert]')
if(closeAlert){
    closeAlert.addEventListener('click',e=>{
        showAlert.classList.add('d-none')
    })
}
// close show alert 

// pagination 
const buttonPagination=document.querySelectorAll('[button-pagination]')
if(buttonPagination.length > 0){
    let url=new URL(window.location.href);
    buttonPagination.forEach(btn=>{
        btn.addEventListener('click',e=>{
            const page=btn.getAttribute('button-pagination')
            url.searchParams.set('page',page)
            window.location.href=url.href
        })
    })
}
// pagination 


// checkboxMulti
const checkboxMulti=document.querySelector('[checkbox-multi')
if(checkboxMulti){
    const inputCheckAll=document.querySelector('input[name="checkall"]')
    const inputsId=document.querySelectorAll('input[name="id"]')
    inputCheckAll.addEventListener('click',e=>{
        if(inputCheckAll.checked==true){
            inputsId.forEach(input=>{
                input.checked=true
            })
        }
        else{
            inputsId.forEach(input=>{
                input.checked=false
            })
        }
    })
    inputsId.forEach(input=>{
        input.addEventListener('click',e=>{
            const countChecked=checkboxMulti.querySelectorAll('input[name="id"]:checked').length
            if(countChecked==inputsId.length){
                inputCheckAll.checked=true
            }
            else{
                inputCheckAll.checked=false
            }
        })
    })
}
// checkboxMulti

// Form Change Multi
const formChangeMulti=document.querySelector('.form-change-multi')
if(formChangeMulti){
    formChangeMulti.addEventListener('submit',e=>{
        e.preventDefault();
        const checkBoxMulti=document.querySelector('[checkbox-multi]')
        const inputsChecked=checkBoxMulti.querySelectorAll('input[name="id"]:checked')
        const typeChange=e.target.elements.type.value
        if(typeChange=='delete-all'){
            const isConfirm=confirm('Bạn có chắc muốn xóa những bài hát này?')
            if(!isConfirm){
                return;
            }
        }
        if(inputsChecked.length>0){
            let ids=[]
            const inputsId=formChangeMulti.querySelector('input[name="ids"]')
            inputsChecked.forEach(input=>{
                if(typeChange=='change-position'){
                    const position=input.closest('tr').querySelector('input[name="position"]').value
                    ids.push(`${input.value}-${position}`)
                }
                else{
                    ids.push(input.value)
                }
            })
            inputsId.value=ids.join(', ');
            formChangeMulti.submit()
        }
        else{
            alert('Vui lòng chọn ít nhất 1 bài hát')
        }

    })
}
// Form Change Multi

// upload Image 
const uploadImage=document.querySelector('[upload-image]');
if(uploadImage){
    const uploadImageInput=document.querySelector('[upload-image-input]')
    const uploadImagePreview=document.querySelector('[upload-image-preview]')
    uploadImageInput.addEventListener('change',e=>{
        const file=e.target.files[0]
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })

}
const uploadAudio=document.querySelector('[upload-audio]');
if(uploadAudio){
    const uploadAudioInput=document.querySelector('[upload-audio-input]')
    const uploadAudioPlay=document.querySelector('[upload-audio-play]')
    const source=uploadAudioPlay.querySelector('source')
    uploadAudioInput.addEventListener('change',(e)=>{
        const file=e.target.files[0]
        if(file){
            source.src = URL.createObjectURL(file)
            uploadAudioPlay.load()
        }
    })
}
// upload Image 

