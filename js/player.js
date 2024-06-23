var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '720',
        width: '1080',
        videoId: '',
        events: {
            'onReady': onPlayerReady
        }
    });
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
            player.loadVideoById(latestVideoId);
            document.getElementById('videoUrl').value = ``;
        }
    } catch (error) {
        console.error("Error loading latest video:", error);
    }
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

    } else {
        alert("Please enter a valid link!");
    }
}

function getVideoIdFromUrl(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}