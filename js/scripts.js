//CUSTOMED ALERT
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

function clearAllNotifications() {
    for (const notificationId in scheduledNotifications) {
        clearTimeout(scheduledNotifications[notificationId]);
    }
    scheduledNotifications = {};
}

//SENDING NOTIFICATION WITH HABITS
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

let scheduledNotifications = {};

async function loadNotif() {
    try {
        const response = await fetch('/api/me/habits');
        const habits = await response.json();

        habits.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time}`).getTime();
            return timeA - timeB;
        });

        clearAllNotifications();

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
        console.error('Error loading habits:', error);
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

    const today = now.getDay();
    if (habit.daysOfWeek & (1 << today)) {
        const timeDiff = habitTime.getTime() - now.getTime();

        const notificationId = `habit-${habit.id}`;
        const timeoutId = setTimeout(() => {
            const audio = document.getElementById('notificationSound');
            audio.play();
            new Notification(habit.name, {
                body: habit.content,
                icon: '/assets/img/IMG_1886.JPG'
            });
        }, timeDiff);

        scheduledNotifications[notificationId] = timeoutId;
    }
}

function clearAllNotifications() {
    for (const notificationId in scheduledNotifications) {
        clearTimeout(scheduledNotifications[notificationId]);
    }
    scheduledNotifications = {};
}

loadNotif();



