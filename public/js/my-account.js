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


const selectElement=document.querySelector('#selCity')
if(selectElement){
    const selectedCityId = selectElement.getAttribute('city-id');
    const optionToSelect  = selectElement.querySelector(`option[value="${selectedCityId}"]`);
    if(optionToSelect){
        optionToSelect.selected=true
    }
}
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