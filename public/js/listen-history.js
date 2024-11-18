// delete-item 
const buttonDelete=document.querySelectorAll('[button-delete]')
if(buttonDelete.length>0){
    const formDeleteItem=document.querySelector('#form-delete-song-history')
    const path=formDeleteItem.getAttribute('data-path')
    buttonDelete.forEach(btn=>{
        btn.addEventListener('click',e=>{
            // const isConfirm=confirm('')
            const id=btn.getAttribute('data-id')
            const action=`${path}/${id}?_method=DELETE`
            formDeleteItem.action=action
            formDeleteItem.submit()
        })
    })
}
// delete-item 

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
// checkboxMulti
const checkall=document.querySelector('#select-all')
if(checkall){
    const inputsId=document.querySelectorAll('input[name="id"]')
    checkall.addEventListener('click',e=>{
        if(checkall.checked==true){
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
    const checkboxMulti=document.querySelector('.checkbox-multi')
    inputsId.forEach(input=>{
        input.addEventListener('click',e=>{
            const countChecked=checkboxMulti.querySelectorAll('input[name="id"]:checked').length
            if(inputsId.length==countChecked){
                checkall.checked=true
            }
            else{
                checkall.checked=false
            }
        })
    })
}
// checkboxMulti

// Form delete multi 
const buttonDeleteCheckbox=document.querySelector('.btn_delete_checkbox')
if(buttonDeleteCheckbox){
    const formDeleteMulti=document.querySelector('.form-delete-multi')
    buttonDeleteCheckbox.addEventListener('click',e=>{
        const checkboxMulti=document.querySelector('.checkbox-multi')
        const inputsChecked=checkboxMulti.querySelectorAll('input[name="id"]:checked')
        if(inputsChecked.length>0){
            ids=[];
            inputsChecked.forEach(input=>{
                ids.push(input.value)
            })
            const inputs=formDeleteMulti.querySelector('input[name="ids"]')
            inputs.value=ids.join(',')
            formDeleteMulti.submit()
        }
        else{
            alert('Vui lòng chọn ít nhất 1 bài hát')
        }
    })
}
// Form delete multi 
