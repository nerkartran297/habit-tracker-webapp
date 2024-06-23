var player;
var pos = 0;
var playList;
var playListMode = true;
var hid = false;
var cine = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '720',
        width: '1080',
        videoId: '',
        startSeconds: 0,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

const nxtBtn = document.getElementById('nxtBtn');
const prvBtn = document.getElementById('prvBtn');
const plMode = document.getElementById('plMode');
const loopMode = document.getElementById('loop');
const cineMode = document.getElementById('cineMode');
const addQueue = document.getElementById('addQueue');

// SHIFT ENTER ADD QUEUE
document.querySelector('#videoUrl').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
        var url = document.getElementById('videoUrl').value;
        var videoId = getVideoIdFromUrl(url);

        if (videoId) {
            try {
                const response = await fetch('/add-video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoId })
                });

            } catch (error) {
                console.error("Error saving video:", error);
            }
            document.getElementById('videoUrl').value = '';
            addThumbnailToQueue(videoId);
            refreshThumbnailList();
        } else {
            alert("Please enter a valid link!");
        }
    }
});

// TOGGLE CINE
document.querySelector('#bodi').addEventListener('keydown', (event) => {
    const videoUrlInput = document.getElementById('videoUrl');
    const isTypingInVideoUrl = videoUrlInput === document.activeElement;
    if (event.key.toLowerCase() === 't' && !isTypingInVideoUrl) {
        const youtubePlayer = document.getElementById('youtubePlayer');
        const player = document.getElementById('player');
        cine = !cine;
        cineMode.style.backgroundColor = cine ? 'rgb(121, 166, 218)' : 'rgb(227, 227, 227)';
        cineMode.style.color = cine ? 'white' : 'black';
        [youtubePlayer, player].forEach(element => {
            element.style.transition = 'width 0.2s ease, aspect-ratio 0.2s ease';
            element.style.aspectRatio = cine ? '21 / 9' : '16 / 9';
        });

        youtubePlayer.style.width = cine ? '100%' : '70%';
    }
});

// HIDE UNHIDE
document.querySelector('#bodi').addEventListener('keydown', (event) => {
    const videoUrlInput = document.getElementById('videoUrl');
    const isTypingInVideoUrl = videoUrlInput === document.activeElement;
    if (event.key.toLowerCase() === 'h' && !isTypingInVideoUrl) {
        if (hid == false) {
            hid = true;
            plMode.style.backgroundColor = 'rgb(227, 227, 227)';
            plMode.style.color = 'black';
            document.querySelector('#listContainer').style.display = 'none';
        } else {
            hid = false;
            plMode.style.backgroundColor = 'rgb(121, 166, 218)';
            plMode.style.color = 'white';
            document.querySelector('#listContainer').style.display = 'block';
        }
    }
});

// SHIFT N NEXT
document.querySelector('#bodi').addEventListener('keydown', (event) => {
    const videoUrlInput = document.getElementById('videoUrl');
    const isTypingInVideoUrl = videoUrlInput === document.activeElement;
    if (event.key.toLowerCase() === 'n' && !isTypingInVideoUrl && event.shiftKey) {
        pos = (pos + 1) % playList.length;
        player.loadVideoById({
            videoId: playList[pos]
        });
    }
});

// SHIFT P PREVIOUS
document.querySelector('#bodi').addEventListener('keydown', (event) => {
    const videoUrlInput = document.getElementById('videoUrl');
    const isTypingInVideoUrl = videoUrlInput === document.activeElement;
    if (event.key.toLowerCase() === 'p' && !isTypingInVideoUrl && event.shiftKey) {
        if (pos == 0) pos = playList.length;
        pos = (pos - 1) % playList.length;
        player.loadVideoById({
            videoId: playList[pos]
        });
    }
});

// SHIFT L LOOP
document.querySelector('#bodi').addEventListener('keydown', (event) => {
    const videoUrlInput = document.getElementById('videoUrl');
    const isTypingInVideoUrl = videoUrlInput === document.activeElement;
    if (event.key.toLowerCase() === 'l' && !isTypingInVideoUrl && event.shiftKey) {
        if (playListMode == false) {
            playListMode = true;
            loopMode.style.backgroundColor = 'rgb(121, 166, 218)';
            loopMode.style.color = 'white';
        } else {
            playListMode = false;
            loopMode.style.backgroundColor = 'rgb(227, 227, 227)';
            loopMode.style.color = 'black';
        }
    }
});

addQueue.addEventListener('click', async () => {
    var url = document.getElementById('videoUrl').value;
    var videoId = getVideoIdFromUrl(url);

    if (videoId) {
        try {
            const response = await fetch('/add-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId })
            });

        } catch (error) {
            console.error("Error saving video:", error);
        }
        document.getElementById('videoUrl').value = '';
        addThumbnailToQueue(videoId);
        refreshThumbnailList();
    } else {
        alert("Please enter a valid link!");
    }
});

cineMode.addEventListener('click', () => {
    const youtubePlayer = document.getElementById('youtubePlayer');
    const player = document.getElementById('player');
    cine = !cine;
    cineMode.style.backgroundColor = cine ? 'rgb(121, 166, 218)' : 'rgb(227, 227, 227)';
    cineMode.style.color = cine ? 'white' : 'black';
    [youtubePlayer, player].forEach(element => {
        element.style.transition = 'width 0.2s ease, aspect-ratio 0.2s ease';
        element.style.aspectRatio = cine ? '21 / 9' : '16 / 9';
    });

    youtubePlayer.style.width = cine ? '100%' : '70%';
});

nxtBtn.addEventListener('click', () => {
    pos = (pos + 1) % playList.length;
    player.loadVideoById({
        videoId: playList[pos]
    });
});

prvBtn.addEventListener('click', () => {
    if (pos == 0) pos = playList.length;
    pos = (pos - 1) % playList.length;
    player.loadVideoById({
        videoId: playList[pos]
    });
});

loopMode.addEventListener('click', () => {
    if (playListMode == false) {
        playListMode = true;
        loopMode.style.backgroundColor = 'rgb(121, 166, 218)';
        loopMode.style.color = 'white';
    } else {
        playListMode = false;
        loopMode.style.backgroundColor = 'rgb(227, 227, 227)';
        loopMode.style.color = 'black';
    }
    console.log(playListMode);
});

plMode.addEventListener('click', () => {
    if (hid == false) {
        hid = true;
        plMode.style.backgroundColor = 'rgb(227, 227, 227)';
        plMode.style.color = 'black';
        document.querySelector('#listContainer').style.display = 'none';
    } else {
        hid = false;
        plMode.style.backgroundColor = 'rgb(121, 166, 218)';
        plMode.style.color = 'white';
        document.querySelector('#listContainer').style.display = 'block';
    }
});

function onPlayerStateChange(event) { // New function
    if (playListMode === true) {
        if (event.data === YT.PlayerState.ENDED) {
            pos = (pos + 1) % playList.length;
            player.loadVideoById({
                videoId: playList[pos]
            });
        }
    } else {
        if (event.data === YT.PlayerState.ENDED) {
            pos = pos + 1;
            if (pos < playList.length) {
                player.loadVideoById({
                    videoId: playList[pos]
                });
            }
            else pos = pos - 1;
        }
    }
}

async function onPlayerReady(event) {
    try {
        const response = await fetch('/api/me/latest-video');
        if (!response.ok) {
            throw new Error(`Error fetching latest video: ${response.statusText}`);
        }
        const data = await response.json();
        const latestVideoId = data.latestVideoId;

        if (latestVideoId) {
            player.loadVideoById({
                videoId: latestVideoId
            });
            document.getElementById('videoUrl').value = ``;
        }
    } catch (error) {
        console.error("Error loading latest video:", error);
    }
}

document.getElementById('videoUrl').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        pos = 0;
        loadVideo();
    }
});

async function loadVideo() {
    var url = document.getElementById('videoUrl').value;
    var videoId = getVideoIdFromUrl(url);

    if (videoId) {
        player.loadVideoById(videoId);

        try {
            const response = await fetch('/save-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId })
            });
        } catch (error) {
            console.error("Error saving video:", error);
        }

        document.getElementById('videoUrl').value = '';
        addThumbnailToList(videoId);
        refreshThumbnailList();
    } else {
        alert("Please enter a valid link!");
    }
}

function getVideoIdFromUrl(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function handleThumbnailClick(event) {
    if (event.button === 0) { // Left click
        const videoId = event.target.dataset.videoId;
        document.getElementById('videoUrl').value = `https://www.youtube.com/watch?v=${videoId}`;
        loadVideo();
    }
}

function handleThumbnailRightClick(event) {
    event.preventDefault();

    const videoId = event.target.dataset.videoId;
    const thumbnailElement = event.target;
    document.getElementById('confirmationMessage').textContent = 'Are you sure you want to delete this video?';
    document.getElementById('confirmationModal').style.display = 'block';
    document.getElementById('confirmDelete').onclick = () => {
        deleteVideoFromHistory(videoId)
            .then(() => {
                thumbnailElement.remove();
                refreshThumbnailList();
            })
            .catch(error => console.error("Error deleting video:", error))
            .finally(() => {
                document.getElementById('confirmationModal').style.display = 'none';
            });
    };
    document.getElementById('cancelDelete').onclick = () => {
        document.getElementById('confirmationModal').style.display = 'none';
    };

    document.getElementById('confirmationModal').onclick = () => {
        document.getElementById('confirmationModal').style.display = 'none';
    };
}

async function deleteVideoFromHistory(videoId) {
    try {
        const response = await fetch('/api/me/delete-video', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId })
        });

        if (!response.ok) {
            throw new Error(`Error deleting video: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
}

function addThumbnailToList(videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const currentList = document.getElementById('currentList');

    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = thumbnailUrl;
    thumbnailElement.alt = 'Video Thumbnail';
    thumbnailElement.classList.add('thumbnail');
    thumbnailElement.dataset.videoId = videoId;
    thumbnailElement.addEventListener('click', handleThumbnailClick);
    thumbnailElement.addEventListener('contextmenu', handleThumbnailRightClick);
    thumbnailElement.draggable = true;
    thumbnailElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', videoId);
    });

    thumbnailElement.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    thumbnailElement.addEventListener('drop', handleDrop);
    currentList.prepend(thumbnailElement);
    limitThumbnails(20);
}

async function handleDrop(event) {
    event.preventDefault();

    const droppedVideoId = event.dataTransfer.getData('text/plain');
    const targetThumbnail = event.target.closest('.thumbnail');

    if (!targetThumbnail || droppedVideoId === targetThumbnail.dataset.videoId) {
        return;
    }

    const currentList = document.getElementById('currentList');
    const droppedThumbnail = currentList.querySelector(`[data-video-id="${droppedVideoId}"]`);

    if (droppedThumbnail) {
        currentList.insertBefore(droppedThumbnail, targetThumbnail);

        const updatedPlayList = Array.from(currentList.querySelectorAll('.thumbnail')).map(thumb => thumb.dataset.videoId);

        try {
            const response = await fetch('/api/me/update-list-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listVideo: updatedPlayList })
            });


            if (!response.ok) {
                throw new Error(`Error updating video list: ${response.statusText}`);
            }

            let currentVideo = playList[pos];
            playList = updatedPlayList;
            pos = playList.indexOf(currentVideo);
        } catch (error) {
            console.error("Error updating video list:", error);
        }
    }
}

function addThumbnailToQueue(videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const currentList = document.getElementById('currentList');

    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = thumbnailUrl;
    thumbnailElement.alt = 'Video Thumbnail';
    thumbnailElement.classList.add('thumbnail');
    thumbnailElement.dataset.videoId = videoId;
    thumbnailElement.addEventListener('click', handleThumbnailClick);
    thumbnailElement.addEventListener('contextmenu', handleThumbnailRightClick);
    currentList.append(thumbnailElement);
    limitThumbnails(20);
}

function handleThumbnailClick(event) {
    const videoId = event.target.dataset.videoId;
    pos = playList.indexOf(videoId);

    if (pos !== -1) {
        player.loadVideoById(videoId);
    } else {
        console.error("Video ID not found in playlist.");
    }
}

function limitThumbnails(max) {
    const currentList = document.getElementById('currentList');
    const thumbnails = currentList.querySelectorAll('.thumbnail');
    if (thumbnails.length > max) {
        for (let i = max; i < thumbnails.length; i++) {
            thumbnails[i].remove();
        }
    }
}

async function loadThumbnails() {
    try {
        const response = await fetch('/api/me/list-video');
        if (!response.ok) {
            throw new Error(`Error fetching video list: ${response.statusText}`);
        }
        const data = await response.json();
        const listVideo = data.listVideo.reverse();
        const uniqueVideoIds = Array.from(new Set(listVideo));
        playList = Array.from(new Set(listVideo)).reverse();
        // console.log(playList);

        uniqueVideoIds.forEach(videoId => {
            addThumbnailToList(videoId);
        });
    } catch (error) {
        console.error("Error loading thumbnails:", error);
    }
}

function refreshThumbnailList() {
    const currentList = document.getElementById('currentList');
    currentList.innerHTML = '';
    loadThumbnails();
}

window.addEventListener('load', loadThumbnails);
