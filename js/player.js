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

function loadVideo() {
    var url = document.getElementById('videoUrl').value;
    var videoId = getVideoIdFromUrl(url);

    if (videoId) {
        player.loadVideoById(videoId);
    } else {
        alert("Link YouTube không hợp lệ!");
    }
}

function getVideoIdFromUrl(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}