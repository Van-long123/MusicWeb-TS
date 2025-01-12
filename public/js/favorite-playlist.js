// playlist modal 
const createPlaylistModal = document.querySelector('#createPlaylistModal')

function closeModal() {
    createPlaylistModal.style.display = 'none';
}
const createPlaylist = document.querySelector('.create-playlist')
if (createPlaylist) {
    createPlaylist.addEventListener('click', e => {
        createPlaylistModal.style.display = 'block'
    })
}
window.onclick = function (event) {
    const modal = document.getElementById('createPlaylistModal');
    if (event.target == modal) {
        closeModal();
    }
}
const closeButtonPlaylist = document.querySelector('#createPlaylistModal .close-button')
if (closeButtonPlaylist) {
    closeButtonPlaylist.addEventListener('click', e => {
        closeModal();
    })
}
// playlist modal 

// create playlist 
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
                invalidFeedback.classList.add('success-playlist')
                invalidFeedback.classList.remove('error-playlist')
                invalidFeedback.textContent = "Đã thêm playlist thành công"
                const targetElement = document.querySelector('.create-playlist').closest('.col-md-2.col-sm-3.col-12.mb-4')
                const newDiv = document.createElement('div')
                newDiv.classList.add('col-md-2', 'col-sm-3', 'mb-4', 'col-12','playlist')
                newDiv.innerHTML = `
                <div class="playlist-item">
                    <div class="playlist-image-container border-user-play">
                    <img src=${data.dataPlaylist.avatar} alt=${data.dataPlaylist.title} class="playlist-image">
                    <div class="overlay">
                        <div class="button-container">
                        <span class="btn-delete" title="Xóa" >
                            <span class="close-button" button-delete-playlist=${data.dataPlaylist._id}> &times; </span>
                        </span>
                        <a href="/playlists/${data.dataPlaylist.slug}">
                            <button class="play-btn" title=${data.dataPlaylist.title}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white">
                                <polygon points="7 4 19 12 7 20"></polygon>
                            </svg>
                            </button>
                        </a>
                        </div>
                    </div>
                    </div>
                    <div class="playlist-title">${data.dataPlaylist.title}</div>
                    <div class="playlist-artists">User</div>
                </div>
                `
                // Thêm thẻ div vào sau thẻ targetElement
                targetElement.insertAdjacentElement("afterend", newDiv);
                deletePlaylist()
                playlistInput.value=""
            })
    })
}

// create playlist 
let currentButtonDelete = null;
function deletePlaylist() {
    const btnDelete = document.querySelectorAll('[button-delete-playlist]')
    if (btnDelete.length > 0) {
        btnDelete.forEach(btn => {
            btn.addEventListener('click', e => {
                modalOverlay.style.display='block'
                modalDescription.textContent='Playlist của bạn sẽ bị xóa khỏi thư viện cá nhân. Bạn có muốn xóa?'
                currentButtonDelete=btn
            })
        })
    }
}
deletePlaylist()


let currentButtonFavorite = null;
const modalOverlay=document.querySelector('.modal-overlay')
const modalDescription=modalOverlay.querySelector('.modal-description')
const button_favorite = document.querySelectorAll('[button-playlist-favorite]')
if (button_favorite) {
    button_favorite.forEach(btn => {
        btn.addEventListener('click', e => {
            modalOverlay.style.display='block'
            modalDescription.textContent='Playlist bạn yêu thích sẽ bị xóa khỏi thư viện cá nhân. Bạn có muốn xóa?'
            currentButtonFavorite = btn;
        })
    })
}

const buttonCancel=document.querySelector('.button-cancel')
buttonCancel.addEventListener('click', e => {
    modalOverlay.style.display='none'
    currentButtonFavorite = null;
    currentButtonDelete=null
})
const buttonConfirm=document.querySelector('.button-confirm')
buttonConfirm.addEventListener('click', e => {
    if (currentButtonFavorite) {
        deleteFavorite(currentButtonFavorite);
        modalOverlay.style.display = 'none';
    }
    if(currentButtonDelete){
        deleteMyFlaylist(currentButtonDelete)
        modalOverlay.style.display = 'none';
    }
});
function deleteFavorite(btn) {
    const idPlaylist = btn.getAttribute('button-playlist-favorite')
    const typeFavorite = 'unFavorite';
    const link = `/playlists/favorite/${typeFavorite}/${idPlaylist}`
    const option = {
        method: "PATCH"
    }
    fetch(link, option)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if (data.code == 200) {
                const playlist=btn.closest('.playlist')
                playlist.style.display='none'
            }
        })
}


function deleteMyFlaylist(btn) {
    const idPlaylist = btn.getAttribute('button-delete-playlist')
    const dataToSend = {
        id: idPlaylist
    }
    fetch('/playlists/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            console.log(data)
            if (data.code == 200) {
                const playlist=btn.closest('.playlist')
                playlist.style.display='none'
            }
        })
}