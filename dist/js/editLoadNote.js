async function loadNote() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('noteId');

        const response = await fetch(`/api/notes/${noteId}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('previewTitle').value = data.title;
            document.getElementById('previewDate').value = new Date(data.date).toLocaleDateString('en-GB');
            document.getElementById('previewBody').innerHTML = data.content.replace(/\n/g, '<br>');


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