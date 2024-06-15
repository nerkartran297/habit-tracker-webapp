//CUSTOME ALERT
function showCustomAlert() {
    const customAlert = document.getElementById("customAlert");
    customAlert.style.display = "block";

    setTimeout(function () {
        customAlert.style.opacity = 0;
        setTimeout(function () {
            nn
            customAlert.style.display = "none";
        }, 1000);
    }, 1500);
}

window.alert = function (message) {
    document.getElementById("customAlert").textContent = message;
    showCustomAlert();
};

//SENDING NOTIFICATION WITH HABITS
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

async function loadNotif() {
    try {
        const response = await fetch('/api/me/habits');
        const habits = await response.json();

        habits.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time}`).getTime();
            return timeA - timeB;
        });

        habits.forEach(habit => {
            if (Notification.permission === 'granted') {
                scheduleNotification(habit);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        scheduleNotification(habit);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function scheduleNotification(habit) {
    const now = new Date();

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(habit.time)) {
        console.error('Invalid habit time format:', habit.time);
        return;
    }

    const [hours, minutes] = habit.time.split(':').map(Number);

    const habitTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
    );

    if (habitTime <= now) {
        habitTime.setDate(habitTime.getDate() + 1);
    }

    const timeDiff = habitTime.getTime() - now.getTime();

    setTimeout(() => {
        new Notification(habit.name, {
            body: habit.content,
            icon: '/assets/img/IMG_1886.JPG'
        });
    }, timeDiff);
}

loadNotif();





