document.getElementById('file-input').addEventListener('change', async function (event) {
    const fileField = event.target.files[0];

    if (fileField) {
        const formData = new FormData();
        formData.append('notes', fileField);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const imageUrl = result.image_url;
                document.getElementById('uploadedImage').src = imageUrl;
                console.log('Image uploaded successfully:', imageUrl);
            } else {
                console.error('Image upload failed:', result);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
});

const createButton = document.querySelector('.actionButton:nth-child(3)');

createButton.addEventListener('click', async () => {
    const title = document.getElementById('previewTitle').value;
    const inputDate = document.getElementById('previewDate').value;
    const content = document.getElementById('previewBody').innerHTML;
    const parts = inputDate.split('/');
    const isoDate = new Date(parts[2], parts[1] - 1, parts[0]).toISOString();
    const image = document.querySelector('.imgNote').src;

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: image,
                title: title,
                date: isoDate,
                content: content,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Succesfully created!');
            setTimeout(() => { window.location.href = '/note'; }, 500);
        } else {
            console.error('Error creating note:', data.error);
            alert('An error occurred during creating note.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Unexpected error.');
    }
});