const deleteBtn = document.querySelector('.deleteBTN');

if (deleteBtn) {
    deleteBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const noteId = new URLSearchParams(window.location.search).get('noteId');

        if (confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
            try {
                const response = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Ghi chú đã được xóa thành công!');
                    window.location.href = '/note';
                } else {
                    console.error('Error deleting note:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
}