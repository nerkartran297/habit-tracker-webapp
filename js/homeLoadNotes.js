async function loadNotes() {
    try {
        const response = await fetch('/api/me/notes');
        const notes = await response.json();

        notes.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        const pinnedDoc = document.querySelector('.pinnedDoc');
        pinnedDoc.innerHTML = '';

        notes.forEach(note => {
            const documentElement = document.createElement('a');
            documentElement.href = `viewNote.html?noteId=${note._id}`;
            documentElement.className = 'document';

            const pastelColors = [
                "#E6E6FA",
                "#FFF5EE",
                "#F0FFF0",
                "#F5FFFA",
                "#FDF5E6",
                "#FFFAF0",
                "#F8F8FF",
                "#FAEBD7",
                "#FFE4E1",
                "#D9D2E9",
                "#E2F0CB",
                "#FFF8DC",
                "#F5DEB3",
                "#FFDEAD",
                "#FAF0E6",
                "#FFEBCD",
                "#FFFACD"
            ];
            const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            documentElement.style.backgroundColor = randomColor;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'docImage';
            const imageElement = document.createElement('img');
            imageElement.src = note.image;
            imageContainer.appendChild(imageElement);
            documentElement.appendChild(imageContainer);

            const titleElement = document.createElement('h4');
            titleElement.textContent = note.title;
            titleElement.className = 'docTitle';
            documentElement.appendChild(titleElement);

            const shortDescElement = document.createElement('p');
            shortDescElement.textContent = note.content
                .replace(/<\/?div[^>]*>/g, ' ')
                .replace(/<br\s*\/?>/g, ' ')
                .replace(/\bocenter\b/g, '')
                .replace(/\becenter\b/g, '')
                .replace(/\bimg:\b/g, '. Ảnh: ')
                .replace(/\b:img\b/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/\ . /g, '. ')
                .trim()
                + (note.content.length > 50 ? "..." : "");
            shortDescElement.className = 'docShort';
            documentElement.appendChild(shortDescElement);

            pinnedDoc.appendChild(documentElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

loadNotes();