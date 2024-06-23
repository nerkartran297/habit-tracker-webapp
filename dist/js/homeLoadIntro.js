async function loadIntroduction() {
    try {
        const response = await fetch('/api/me/introduction');
        const data = await response.json();

        if (response.ok) {
            const selfIntroDiv = document.querySelector('.selfIntro');
            const imgPart = selfIntroDiv.querySelector('.imgPart img');
            const textPart = selfIntroDiv.querySelector('.textPart');

            // Cập nhật hình ảnh (nếu có)
            if (data.image) {
                imgPart.src = data.image;
            } else {
                imgPart.style.display = 'none';
            }

            textPart.querySelector('h3').textContent = data.topic;
            textPart.querySelector('p').textContent = data.content;
        } else {
            console.error('Error fetching introduction:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

loadIntroduction();