const refreshBtn=document.querySelector('.refresh-btn')
if(refreshBtn){
    console.log(refreshBtn)
    refreshBtn.addEventListener('click', (e)=>{
        const link='/songs/random';
        fetch(link)
            .then(res=>{
                return res.json()//đổi chuỗi json thành js
            })
            .then(data=>{
                if(data.code==200){
                    const songsRandom=data.songsRandom
                    const boxListRandom=document.querySelector('.boxListRandom')
                    const htmls=songsRandom.map(song=>{
                        return `
                        <div class="col-md-4 col-6">
                            <a href="/songs/detail/${song.slug}">
                                <div class="music-item">
                                    <img src=${song.avatar} alt=${song.title} />
                                    <div class="music-text">
                                        <h5 class="mb-0">${song.title}</h5>
                                        <small><i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName}</small>
                                    </div>
                                </div>
                            </a>
                        </div>
                        `
                    })
                    boxListRandom.innerHTML=htmls.join('')
                }
            })
    })
}

// Search suggest 
const boxSearch=document.querySelector('.box-search')
if(boxSearch){
    const input=document.querySelector('input[name="keyword"]')
    const boxSuggest=boxSearch.querySelector('.inner-suggest')
    input.addEventListener('keyup',e=>{
        const keyword=input.value;
        const link=`/search/suggest?keyword=${keyword}`
        fetch(link)
            .then(res=>{
                return res.json()
            })
            .then(data=>{
                if(data.code==200){
                    const songs=data.songs;
                    const singers=data.singers;
                    if(songs.length>0 || singers.length>0){
                        boxSuggest.classList.add('show')
                        const htmlSong=songs.map(song=>{
                            return `
                                <a class="inner-item" href="/songs/detail/${song.slug}">
                                    <div class="inner-image"><img src=${song.avatar} /></div>
                                    <div class="inner-info">
                                        <div class="inner-title">${song.title}</div>
                                        <div class="inner-singer"><i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName}</div>
                                    </div>
                                </a>
                            ` 
                        })
                        const htmlSinger=singers.map(singer=>{
                            return `
                                <a class="inner-item" href="/artist/${singer.slug}">
                                    <div class="inner-image image-artist"><img src=${singer.avatar} /></div>
                                    <div class="inner-info">
                                        <div class="inner-singer"><i class="fa-solid fa-microphone-lines"></i> ${singer.fullName}</div>
                                    </div>
                                </a>
                            ` 
                        })
                        const htmls=htmlSong.concat(htmlSinger)
                        const boxList=boxSuggest.querySelector('.inner-list')
                        boxList.innerHTML=htmls.join('')
                    }
                    else{
                        boxSuggest.classList.remove('show')
                    }
                }
            })

    })

}
// Search suggest  

// button like 
const buttonLike=document.querySelector('[button-like]')
if(buttonLike){
    buttonLike.addEventListener('click',e=>{
        const confirmationModal=document.querySelector('#confirmationModal')
        const active=confirmationModal.classList.contains('inactive')
        if(active){
            confirmationModal.style.display = "block";
            return;
        }
        const idSong=buttonLike.getAttribute('button-like')
        const isActive=buttonLike.classList.contains('active')
        const typeLike=isActive ? 'dislike' :'like';
        const link =`/songs/like/${typeLike}/${idSong}`
        const option={
            method:"PATCH"
        }
        fetch(link,option)
            .then(res=>res.json())
            .then(data=>{
                if(data.code==200){
                    const notification = document.getElementById('notification');
                    const timeout=notification.getAttribute('data-time')
                    if(typeLike=='like'){
                        notification.classList.remove('hidden')
                        notification.classList.add('show')
                        notification.textContent='Bạn đã thích bài hát này'
                    }
                    else{
                        notification.classList.remove('hidden')
                        notification.classList.add('show')
                        notification.textContent='Bạn đã bỏ qua bài hát này'
                    }
                    setTimeout(() => {
                        notification.classList.remove('show')
                        notification.classList.add('hidden')
                    },timeout );
                    buttonLike.querySelector('span').innerHTML=`${data.like} thích`
                    buttonLike.classList.toggle('active')
                    
                }
            })
    })
}
// button like 

// button Favorite song
const buttonFavorite =document.querySelector('[button-favorite]')
if(buttonFavorite){
    buttonFavorite.addEventListener('click',e=>{
        const confirmationModal=document.querySelector('#confirmationModal')
        const active=confirmationModal.classList.contains('inactive')
        if(active){
            confirmationModal.style.display = "block";
            return;
        }
        const idSong=buttonFavorite.getAttribute('button-favorite')
        const isActive=buttonFavorite.classList.contains('active')
        const typeFavorite=isActive ? 'unFavorite' :'favorite';
        const link =`/songs/fovarite/${typeFavorite}/${idSong}`
        const option={
            method:"PATCH"
        }
        fetch(link,option)
            .then(res=>{
                return res.json()
            })
            .then(data=>{
                if(data.code==200){
                    const notification = document.getElementById('notification');
                    const timeout=notification.getAttribute('data-time')
                    if(typeFavorite=='favorite'){
                        notification.classList.remove('hidden')
                        notification.classList.add('show')
                        notification.textContent='Đã thêm bài hát vào thư viện'
                    }
                    else{
                        notification.classList.remove('hidden')
                        notification.classList.add('show')
                        notification.textContent='Đã xóa bài hát vào thư viện'
                    }
                    setTimeout(() => {
                        notification.classList.remove('show')
                        notification.classList.add('hidden')
                    },timeout );
                    buttonFavorite.classList.toggle('active');
                }
            })
    })
}
// button Favorite song
// button Favorite playlist
const buttonFavoritePlaylist =document.querySelectorAll('[button-favorite-playlist]')
if(buttonFavoritePlaylist){
    buttonFavoritePlaylist.forEach(btn=>{
        btn.addEventListener('click',e=>{
            const confirmationModal=document.querySelector('#confirmationModal')
            const active=confirmationModal.classList.contains('inactive')
            if(active){
                confirmationModal.style.display = "block";
                return;
            }
            const idPlaylist=btn.getAttribute('button-favorite-playlist')
            const isActive=btn.classList.contains('active')
            const typeFavorite=isActive ? 'unFavorite' :'favorite';
            const link =`/playlists/favorite/${typeFavorite}/${idPlaylist}`
            const option={
                method:"PATCH"
            }
            fetch(link,option)
                .then(res=>{
                    return res.json()
                })
                .then(data=>{
                    if(data.code==200){
                        const notification = document.getElementById('notification');
                        const timeout=notification.getAttribute('data-time')
                        if(typeFavorite=='favorite'){
                            notification.classList.remove('hidden')
                            notification.classList.add('show')
                            notification.textContent='Đã thêm playlist vào thư viện'
                        }
                        else{
                            notification.classList.remove('hidden')
                            notification.classList.add('show')
                            notification.textContent='Đã xóa playlist vào thư viện'
                        }
                        setTimeout(() => {
                            notification.classList.remove('show')
                            notification.classList.add('hidden')
                        },timeout );
                        btn.classList.toggle('active');
                        //hiển thị thông báo 
                    }
                })
        })
    })
}
// button Favorite playlist

// close auth 
const closeAlert=document.querySelector('[close-alert]')
if(closeAlert){
    closeAlert.addEventListener('click',e=>{
        const confirmationModal=document.querySelector('#confirmationModal')
        confirmationModal.style.display = "none";
    })
}



// close auth 

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
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});


// upload 
const imageInput=document.querySelector('#imageInput')
if(imageInput){
    imageInput.addEventListener('change',e=>{
        const file=e.target.files[0]
        const preview = document.getElementById('preview');
        const defaultIcon = document.getElementById('defaultIcon');
        if(file){
            preview.src=URL.createObjectURL(file)
            preview.style.display="block";
            defaultIcon.style.display="none";
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
        console.log(file)
        if(file){
            source.src = URL.createObjectURL(file)
            uploadAudioPlay.load()
        }
    })
}
// upload 

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
const close_alert=document.querySelector('.alert [close-alert]')
if(close_alert){
    close_alert.addEventListener('click',e=>{
        showAlert.classList.add('d-none')
    })
}
// close show alert 