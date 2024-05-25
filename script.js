const noteDate = document.getElementById('noteDate');
const noteTitle = document.getElementById('noteTitle');
const noteBodyID = document.getElementById('noteBodyID');

const previewDate = document.getElementById('previewDate');
const previewTitle = document.getElementById('previewTitle');
const previewBody = document.getElementById('previewBody');

const saveButton = document.getElementById('saveButton');

// Function to update preview content
function updatePreview() {
    previewDate.textContent = noteDate.value;
    previewTitle.textContent = noteTitle.value;

    // Replace line breaks with <br> tags for preview
    const previewBodyText = noteBodyID.value.replace(/\n/g, '<br>');
    previewBody.innerHTML = previewBodyText;
}

noteDate.addEventListener('input', updatePreview);
noteTitle.addEventListener('input', updatePreview);
noteBodyID.addEventListener('input', updatePreview);

// Function to load notes from JSON file based on ID
function loadNote(noteID) {
    if (localStorage.getItem('notes')) {
        const notesJSON = localStorage.getItem('notes');
        const notesData = JSON.parse(notesJSON);

        // Find the note with the matching ID
        const matchingNote = notesData.notes.find(note => note.id === noteID);

        if (matchingNote) {
            noteDate.value = matchingNote.date;
            noteTitle.value = matchingNote.title;
            noteBodyID.value = matchingNote.body;
            updatePreview(); // Update preview to reflect loaded data
        }
    }
}

// Function to save notes to JSON file
function saveNotes() {
    const notesData = {
        date: noteDate.value,
        title: noteTitle.value,
        body: noteBodyID.value
    };
    const notesJSON = JSON.stringify(notesData);
    localStorage.setItem('notes', notesJSON);
}

// Function to get URL parameter (noteID)
function getURLParameter(name) {
    const url = new URL(window.location.href);
    const parameter = url.searchParams.get(name);
    return parameter;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const noteID = getURLParameter('noteID'); // Get noteID from URL parameter
    if (noteID) {
        loadNote(noteID); // Load specific note based on ID
    } else {
        // Load the first note if no ID is specified (optional)
        loadNote('1'); // Replace '1' with the ID of the default note
    }
});

saveButton.addEventListener('click', saveNotes);

