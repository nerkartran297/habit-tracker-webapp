async function loadNotes() {
    try {
        const response = await fetch('/api/me/notes');
        const notes = await response.json();

        notes.sort((a, b) => new Date(b.date) - new Date(a.date));

        const noteBoard = document.querySelector('.noteBoard');
        noteBoard.innerHTML = `<div class="noteSearch" style="margin-bottom:0px;">
            <div style="display:flex; justify-content: space-between; align-items: center;">
                <a class="createNoteBtn" href="/create">Create</a>
                <div style="font-size: 1.0rem;">
                    Sort by:
                    <select id="finder">
                        <option value="none">None</option>
                        <option value="date-asc">Date (Oldest to Newest)</option>
                        <option value="date-desc">Date (Newest to Oldest)</option>
                    </select>
                </div>
            </div>
        </div>`;

        notes.forEach(note => {
            const noteLink = document.createElement('a');
            noteLink.href = `view?noteId=${note._id}`;

            const noteContainer = document.createElement('div');
            noteContainer.className = 'noteContainer';

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
            noteContainer.style.backgroundColor = randomColor;

            noteLink.appendChild(noteContainer);

            const imgElement = document.createElement('img');
            imgElement.src = note.image;
            noteContainer.appendChild(imgElement);

            const noteIntro = document.createElement('div');
            noteIntro.className = 'noteIntro';
            noteContainer.appendChild(noteIntro);

            const titleDateDiv = document.createElement('div');
            titleDateDiv.style.display = 'flex';
            titleDateDiv.style.justifyContent = 'space-between';
            titleDateDiv.style.alignItems = 'center';
            noteIntro.appendChild(titleDateDiv);

            const titleElement = document.createElement('h3');
            titleElement.style.margin = '0';
            titleElement.textContent = note.title;
            titleDateDiv.appendChild(titleElement);

            const dateElement = document.createElement('p');
            dateElement.style.margin = '0';
            dateElement.textContent = new Date(note.date).toLocaleDateString('en-GB');
            titleDateDiv.appendChild(dateElement);

            const contentElement = document.createElement('p');
            contentElement.style.margin = '0';
            contentElement.style.textAlign = 'justify';
            contentElement.textContent = note.content
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
            // console.log(contentElement.textContent);
            noteIntro.appendChild(contentElement);

            noteBoard.appendChild(noteLink);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

loadNotes();