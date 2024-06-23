const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
});

const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (password.length < 8) {
        alert('Mật khẩu phải có ít nhất 8 ký tự.');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            registerError.textContent = data.error;
        }
    } catch (error) {
        console.error('Error:', error);
        registerError.textContent = 'An error occurred during registration.';
    }
});

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // Validation (add your preferred validation logic here)

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Successful login, redirect without trying to parse JSON
            window.location.href = '/home';
        } else {
            const errorData = await response.json(); // Get error details from JSON
            loginError.textContent = errorData.error || 'An error occurred during login.';
            console.error('Error:', errorData);
        }
    } catch (error) {
        // Handle network errors
        console.error('Network Error:', error);
        loginError.textContent = 'Unable to connect to the server.';
    }
});


