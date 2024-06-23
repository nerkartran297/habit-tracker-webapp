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