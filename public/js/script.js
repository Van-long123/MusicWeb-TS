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
                                        <small><i class="fa-solid fa-microphone-lines"></i>${song.infoSinger.fullName}</small>
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