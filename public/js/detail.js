
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
        }
    ]
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