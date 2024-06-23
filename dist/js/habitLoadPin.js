async function loadPinned() {
    try {
        const response = await fetch('/api/me/pinned');
        const data = await response.json();

        if (response.ok) {
            const topicElement = document.getElementById('pinnedTopic');
            const contentElement = document.getElementById('pinnedContent');

            topicElement.textContent = data.topic.replace('<br>', '');
            contentElement.value = data.content;
        } else {
            console.error('Error fetching pinned post:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const pinnedTextDiv = document.querySelector('.pinnedText');
pinnedTextDiv.addEventListener('input', debounce(async () => {
    const newTopic = document.getElementById('pinnedTopic').innerHTML;
    const newContent = document.getElementById('pinnedContent').value;

    try {
        const response = await fetch('/api/me/pinned', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic: newTopic, content: newContent })
        });

        if (response.ok) {
        } else {
            const errorData = await response.json();
            console.error('Error updating pinned text:', errorData.error);
            alert('Đã xảy ra lỗi khi cập nhật nội dung. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
}, 300));

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

loadPinned();