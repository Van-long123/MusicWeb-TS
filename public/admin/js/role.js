//delete-item
const buttonDelete=document.querySelectorAll('[button-delete]')
if(buttonDelete.length > 0){
    const formDeleteItem=document.querySelector('#form-delete-item')
    const path=formDeleteItem.getAttribute('data-path')
    buttonDelete.forEach(btn=>{
        btn.addEventListener('click',e=>{
            const id=btn.getAttribute('data-id')
            const action=`${path}/${id}?_method=DELETE`
            formDeleteItem.action=action
            formDeleteItem.submit()
        })
    })
}
//delete-item
