var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '720',
        width: '1080',
        videoId: 'OvLRybrkoaE',
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Không cần xử lý gì ở đây
}

document.getElementById('videoUrl').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
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

        addThumbnailToList(videoId);
        refreshThumbnailList();
    } else {
        alert("Link YouTube không hợp lệ!");
    }
}

function getVideoIdFromUrl(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function addThumbnailToList(videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const currentList = document.getElementById('currentList');

    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = thumbnailUrl;
    thumbnailElement.alt = 'Video Thumbnail';
    thumbnailElement.classList.add('thumbnail');
    thumbnailElement.dataset.videoId = videoId; // Store videoId in the element's dataset
    thumbnailElement.addEventListener('click', handleThumbnailClick);

    currentList.prepend(thumbnailElement); // Add to the beginning of the list
    limitThumbnails(20); // Ensure max 15 thumbnails
}

function handleThumbnailClick(event) {
    const videoId = event.target.dataset.videoId;
    document.getElementById('videoUrl').value = `https://www.youtube.com/watch?v=${videoId}`;
    loadVideo();
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
