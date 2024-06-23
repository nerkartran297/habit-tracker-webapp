const editButton = document.getElementById('editButton');
if (editButton) {
    editButton.addEventListener('click', (event) => {
        event.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('noteId');
        const editUrl = `/edit?noteId=${noteId}`;
        window.location.href = editUrl;
    });
}