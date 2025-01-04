const formCreateSong=document.querySelector('#form-create-song')
const contentAlert=document.querySelector('.content_alert')
if(formCreateSong){
    formCreateSong.addEventListener('submit',e=>{
        e.preventDefault();
        const fields = ['title', 'singerId', 'topicId', 'audio', 'lyrics', 'description'];
        for (const field of fields) {
            const value=e.target.elements[`${field}`]?.value.trim();
            if(!value){
                show_alert()
                return
            }
        }
        formCreateSong.submit()
    })
}
function show_alert(){
    contentAlert.style.display='block'
    const time=parseInt(contentAlert.getAttribute('data-time'))||4000
    setTimeout(() => {
        contentAlert.style.display='none'
    }, time);
}
const close_content=document.querySelector(' [close-content]')
if(close_content){
    close_content.addEventListener('click',e=>{
        contentAlert.style.display='none'
    })
}