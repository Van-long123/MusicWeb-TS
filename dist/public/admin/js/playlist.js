const buttonChangeStatus=document.querySelectorAll('[button-change-status]')
if(buttonChangeStatus.length>0){
    const formChangeStatus=document.querySelector('#form-change-status')
    const path=formChangeStatus.getAttribute('data-path')
    buttonChangeStatus.forEach(btn=>{
        btn.addEventListener('click',e=>{
            const statusChange=btn.getAttribute('data-status')
            const id=btn.getAttribute('data-id')
            const statusCurrent=statusChange=='active' ? 'inactive' :'active'
            const action = `${path}/${statusCurrent}/${id}?_method=PATCH`
            formChangeStatus.action=action
            formChangeStatus.submit()
        })
    })
}
const buttonDelete=document.querySelectorAll('[button-delete]')
if(buttonDelete.length>0){
    const formDelete=document.querySelector('#form-delete-item')
    const path=formDelete.getAttribute('data-path')
    buttonDelete.forEach(btn=>{
        btn.addEventListener('click',e=>{
            const id=btn.getAttribute('data-id')
            const action = `${path}/${id}?_method=Delete`
            formDelete.action=action
            formDelete.submit()
        })
    })
}