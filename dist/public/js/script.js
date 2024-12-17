
// aplayer 
const aplayer=document.getElementById('aplayer');
if(aplayer){
    let dataSong=aplayer.getAttribute('data-song')
    let dataSinger=aplayer.getAttribute('data-singer')
    dataSong=JSON.parse(dataSong)
    dataSinger=JSON.parse(dataSinger)
    const ap = new APlayer({
        container: aplayer,
        volume:1,
        autoplay: true,
        lrcType: 1,
        audio: [{
            name:dataSong.title ,
            artist: dataSinger.fullName,
            url:dataSong.audio,
            cover:dataSong.avatar,
            lrc:dataSong.lyrics
        }]
    });
    const avatar=document.querySelector('.inner-avatar ')
    ap.on('play', function () {
        avatar.style.animationPlayState='running'
    });
    ap.on('pause', function () {
        avatar.style.animationPlayState='paused'

    });
    ap.on('ended', function () {
        const link=`/songs/listen/${dataSong._id}`
        const option={
            method: 'PATCH',
        }
        fetch(link, option)
            .then(res=>res.json())
            .then(data=>{
                if(data.code=200){
                    const elementListenSpan=document.querySelector('.inner-listen span')
                    elementListenSpan.innerHTML=`${data.listen} lượt nghe`
                }
            })
    });
}

// aplayer 
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
                    if(songs.length>0){
                        boxSuggest.classList.add('show')
                        const htmls=songs.map(song=>{
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
                    buttonLike.querySelector('span').innerHTML=`${data.like} thích`
                    buttonLike.classList.toggle('active')
                    
                }
            })
    })
}
// button like 

// button Favorite 
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
                    buttonFavorite.classList.toggle('active');
                }
            })
    })
}
// button Favorite 


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