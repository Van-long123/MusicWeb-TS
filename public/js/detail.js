
// aplayer 
const aplayer = document.getElementById('aplayer');
if (aplayer) {
    let dataSong = aplayer.getAttribute('data-song')
    let dataSinger = aplayer.getAttribute('data-singer')
    dataSong = JSON.parse(dataSong)
    dataSinger = JSON.parse(dataSinger)
    const ap = new APlayer({
        container: aplayer,
        volume: 1,
        autoplay: true,
        lrcType: 1,
        audio: [{
            name: dataSong.title,
            artist: dataSinger.fullName,
            url: dataSong.audio,
            cover: dataSong.avatar,
            lrc: dataSong.lyrics
        }
        ]
    });
    const avatar = document.querySelector('.inner-avatar ')
    ap.on('play', function () {
        avatar.style.animationPlayState = 'running'
    });
    ap.on('pause', function () {
        avatar.style.animationPlayState = 'paused'

    });
    ap.on('ended', function () {
        const link = `/songs/listen/${dataSong._id}`
        const option = {
            method: 'PATCH',
        }
        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                if (data.code = 200) {
                    const elementListenSpan = document.querySelector('.inner-listen span')
                    elementListenSpan.innerHTML = `${data.listen} lượt nghe`
                }
            })
    });
}
function renderPlaylists() {
    return fetch('/playlists/my-playlist')
        .then(res => res.json())
        .then(data => {
            const playlistList = document.querySelector('.playlist-list')
            if (data.code = 200) {
                const myPlaylist = data.myPlaylist
                if (myPlaylist.length > 0) {
                    const htmls = myPlaylist.map((playlist, index) => {
                        return `
                        <li class="playlist-item" data-id=${playlist._id}>
                            <i class="bx bxs-playlist"></i>
                            <span class="playlist-name">${playlist.title}</span>
                        </li>

                        `
                    })

                    playlistList.innerHTML = htmls.join('')
                }
                else {
                    playlistList.innerHTML = `
                    <li class="playlist-item">
                        <i class="icon-playlist"> <svg width="70" height="81" viewBox="0 0 70 81"><g fill="#B3B3B3" fill-rule="nonzero"><path d="M31.818 5.32c-12.09 0-22.67 8.18-25.693 19.854l2.068.555c2.784-10.8 12.489-18.344 23.625-18.344V5.321zM5.33 31.765h2.147c0-1.35.08-2.7.318-4.05l-2.068-.318c-.318 1.43-.397 2.859-.397 4.368zM31.818 25.412c-3.5 0-6.363 2.859-6.363 6.353 0 3.494 2.863 6.353 6.363 6.353 3.5 0 6.364-2.86 6.364-6.353 0-3.494-2.864-6.353-6.364-6.353zm0 10.562c-2.307 0-4.216-1.906-4.216-4.21 0-2.302 1.91-4.208 4.216-4.208 2.307 0 4.216 1.906 4.216 4.209s-1.909 4.209-4.216 4.209z"></path><path d="M31.818 18.026c-7.636 0-13.761 6.195-13.761 13.739 0 7.544 6.125 13.738 13.761 13.738A13.704 13.704 0 0 0 45.58 31.765a13.704 13.704 0 0 0-13.762-13.739zm0 25.412c-6.443 0-11.693-5.24-11.693-11.673s5.25-11.674 11.693-11.674 11.693 5.241 11.693 11.674c0 6.432-5.25 11.673-11.693 11.673z"></path><path d="M41.045 62.18v-2.224c-2.943.953-6.045 1.509-9.227 1.509-16.386-.08-29.67-13.341-29.67-29.7 0-16.36 13.284-29.62 29.67-29.62 16.387 0 29.67 13.26 29.67 29.62 0 1.19-.079 2.461-.238 3.653l2.227-.794c.08-.953.16-1.827.16-2.78C63.636 14.214 49.396 0 31.817 0 14.238 0 0 14.215 0 31.765s14.239 31.764 31.818 31.764c3.182 0 6.284-.476 9.227-1.35z"></path><path d="M37.307 80.365c-1.432 0-2.705-.477-3.58-1.43-1.113-1.111-1.59-2.7-1.352-4.526.239-1.668 1.114-3.335 2.466-4.685 1.352-1.35 3.023-2.224 4.693-2.462.318-.08.636-.08.955-.08.238 0 .477 0 .795.08l2.227.317V47.091c0-1.509.955-2.938 2.387-3.494l18.693-6.909a3.608 3.608 0 0 1 1.273-.238c.795 0 1.511.238 2.147.635.955.715 1.591 1.827 1.591 3.018v11.991c0 7.465 0 11.674-.08 12.07-.238 1.668-1.113 3.336-2.465 4.686-1.352 1.35-3.023 2.224-4.693 2.462-.398.159-.716.159-.955.159-1.432 0-2.704-.477-3.58-1.43-1.113-1.112-1.59-2.7-1.352-4.526.239-1.668 1.114-3.336 2.466-4.686s3.023-2.223 4.693-2.461c.319-.08.637-.08.955-.08.239 0 .477 0 .795.08l2.228.317V45.98L45.5 54.16v18.185c0 .238 0 .556-.08.794-.238 1.668-1.113 3.336-2.465 4.686-1.353 1.35-3.023 2.223-4.694 2.461-.318.08-.636.08-.954.08zm3.182-11.197c-.239 0-.398 0-.637.08-1.272.158-2.545.873-3.58 1.905-1.033 1.032-1.75 2.303-1.908 3.573-.239 1.51.318 2.383.795 2.86.398.396 1.034.793 2.148.793.238 0 .398 0 .636-.079 1.273-.159 2.546-.874 3.58-1.906 1.034-1.032 1.75-2.303 1.909-3.573 0-.239.08-.397.08-.636 0-1.19-.478-1.826-.796-2.223-.398-.238-1.114-.794-2.227-.794zm24.022-8.815c-.238 0-.397 0-.636.08-1.273.158-2.545.873-3.58 1.905-1.034 1.033-1.75 2.303-1.909 3.574-.238 1.509.319 2.382.796 2.859.398.397 1.034.794 2.148.794.238 0 .397 0 .636-.08 1.273-.159 2.545-.873 3.58-1.906 1.034-1.032 1.75-2.303 1.909-3.573 0-.238.08-.397.08-.635 0-1.192-.478-1.827-.796-2.224-.398-.397-1.114-.794-2.228-.794zM45.5 47.25v4.765l22.034-8.1v-3.733c0-1.111-1.114-1.906-2.227-1.508l-18.614 6.829c-.716.238-1.193.953-1.193 1.747z"></path></g></svg></i>
                        <span>Không có playlist</span>
                    </li>
                    `
                }
            }
        })
}
const buttonPlaylist = document.querySelector('[button-playlist]')
if (buttonPlaylist) {
    buttonPlaylist.addEventListener('click',(e) => {
        renderPlaylists().then(()=>{
            eventAddPlaylist()
            document.querySelector('#modal-list-playlist').style.display = 'flex';
        })
        
    })
}



const createPlaylistModal = document.querySelector('#createModalPlaylist')
const createPlay = document.querySelector('.create-play')
if (createPlay) {
    createPlay.addEventListener('click', e => {
        createPlaylistModal.style.display = 'flex';
    })
}

window.onclick = function (event) {
    const modal = document.getElementById('modal-list-playlist');
    if (event.target == modal) {
        modal.style.display = 'none'
    }
}

const closeButtonPlaylist = document.querySelector('#createModalPlaylist .close-button')
if (closeButtonPlaylist) {
    closeButtonPlaylist.addEventListener('click', e => {
        closeModal();
    })
}
function closeModal() {
    createPlaylistModal.style.display = 'none';
}
const createBtn = document.querySelector('.create-btn')
if (createBtn) {
    const invalidFeedback = document.querySelector('.invalid-feedback')
    createBtn.addEventListener('click', e => {
        const playlistInput = document.querySelector('.playlist-input')
        if (playlistInput.value.trim() == '') {
            invalidFeedback.classList.remove('success-playlist')
            invalidFeedback.classList.add('error-playlist')
            invalidFeedback.textContent = "Vui lòng nhập tiêu đề playlist"
            return
        }
        const dataToSend = {
            title: playlistInput.value.trim()
        }
        fetch('/playlists/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    invalidFeedback.classList.add('success-playlist')
                    invalidFeedback.classList.remove('error-playlist')
                    invalidFeedback.textContent = "Đã thêm playlist thành công"
                    playlistInput.value = ""

                    // hiển thị giao diện danh sách phát  
                    renderPlaylists().then(()=>{
                        eventAddPlaylist()
                    })
                    
                }
            })
    })
}

function eventAddPlaylist(){
    const playlistItem=document.querySelectorAll('[data-id]')
    playlistItem.forEach(item=>{
        item.addEventListener('click',e=>{
            const idPlaylist=item.getAttribute('data-id')
            const idSong=document.querySelector('[button-playlist]').getAttribute('button-playlist')
            fetch(`/playlists/add/${idPlaylist}/${idSong}`,{method: 'PATCH'})
            .then(res=>{
                if(res.status==200){
                    return res.json()
                }
                notification("Vui lòng thử lại")
            })
            .then(data=>{
                notification(data.message)
                document.querySelector('#modal-list-playlist').style.display = 'none';
            })
        })
    })
}

function notification(msg){
    const notification = document.getElementById('notification');
    const timeout=notification.getAttribute('data-time')
    notification.classList.remove('hidden')
    notification.classList.add('show')
    notification.textContent=msg
    setTimeout(() => {
        notification.classList.remove('show')
        notification.classList.add('hidden')
    },timeout );
}