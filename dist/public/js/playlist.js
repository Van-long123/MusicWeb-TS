
// // aplayer 
const desc=document.querySelector('.desc')
const lyric=document.querySelector('.lyric')
const aplayer=document.getElementById('aplayer');
let dataSong=aplayer.getAttribute('data-song')
let dataSinger=aplayer.getAttribute('data-singer')
dataSinger=JSON.parse(dataSinger)
dataSong=JSON.parse(dataSong)
if(aplayer){
    const data = dataSong.map((item,index)=>{
        return {
            name:item.title ,
            artist: dataSinger[index],
            url:item.audio,
            cover:item.avatar,
            lrc:item.lyrics
        }
    })
    const ap = new APlayer({
        container: aplayer,
        volume:1,
        autoplay: true,
        lrcType: 1,
        audio: data
    });
    ap.on('listswitch', function (index) {
        const vi_tri=index.index
        lyric.textContent=dataSong[vi_tri].rawLyrics
    });
    
}
const aplayerList=document.querySelector('.aplayer-list')
if(aplayerList){
    const aplayerListAuthor=document.querySelectorAll('.aplayer-list-author')
    aplayerListAuthor.forEach((item,index)=>{
        const aplayerListTitle=item.closest('li').querySelector('.aplayer-list-title')
        aplayerListTitle.textContent = `${dataSong[index].title} - ${dataSinger[index]}`
        item.innerHTML=`
            <div class="d-flex">
                <div class="inner-action inner-download me-3">
                    <a href="/songs/download?file_url=${dataSong[index].audio}">
                        <i class="fa-solid fa-download"></i>
                    </a>
                </div>
            </div>
        `
    })
    
    // console.log(aplayerList.querySelector('.aplayer-list-cur').style.backgroundColor = "red");
}
function currentSong(){
    lyric.textContent=dataSong[0].rawLyrics
}
currentSong()
