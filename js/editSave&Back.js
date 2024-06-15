const doneBtn = document.querySelector('.actionButton:nth-child(2)');
const backBtn = document.querySelector('.actionButton:nth-child(1)');

backBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('noteId');
    const editUrl = `/view?noteId=${noteId}`;
    window.location.replace(editUrl);
});

doneBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const noteId = new URLSearchParams(window.location.search).get('noteId');
    const title = document.getElementById('previewTitle').value;
    const inputDate = document.getElementById('previewDate').value;
    const content = document.getElementById('previewBody').innerHTML;
    const image = document.querySelector('.imgNote').src;
    const parts = inputDate.split('/');
    const isoDate = new Date(parts[2], parts[1] - 1, parts[0]).toISOString();

    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                date: isoDate,
                content: content.replace('<div><div>', '<div>').replace('</div></div>', '</div>'),
                image
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            const urlParams = new URLSearchParams(window.location.search);
            const noteId = urlParams.get('noteId');
            const editUrl = `/view?noteId=${noteId}`;
            setTimeout(() => { window.location.href = editUrl; }, 500);
        } else {
            console.error('Error updating note:', data.error);
            if (response.status === 404) {
                alert('Can not find the note.');
            } else if (response.status === 401 || response.status === 403) {
                alert('You don not have permission to edit this note.');
            } else {
                alert('There is an error occurred during saving note.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Unexpected Error');
    }
});