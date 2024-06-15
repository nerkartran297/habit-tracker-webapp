document.getElementById('login').addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/api/logout', { method: 'POST' })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});