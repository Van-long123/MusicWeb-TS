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
                                        <small>${song.infoSinger.fullName}</small>
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