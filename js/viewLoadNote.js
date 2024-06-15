async function loadNote() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('noteId');

        const response = await fetch(`/api/notes/${noteId}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('previewTitle').textContent = data.title;
            document.getElementById('previewDate').textContent = '|' + new Date(data.date).toLocaleDateString('en-GB') + '|';
            document.getElementById('previewBody').innerHTML = data.content
                .replace(/\bocenter\b/g, '<div style="text-align: center;">')
                .replace(/\becenter\b/g, '</div>')
                .replace(/\bimg:\b/g, '<br><div class="embeddedImg"><img src="')
                .replace(/\b:img\b/g, '"/></div>');

            const noteImg = document.querySelector('.noteImg img');
            noteImg.src = data.image;
        } else {
            console.error('Error fetching note:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

loadNote();