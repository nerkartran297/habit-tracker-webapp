async function loadHabits() {
    try {
        const response = await fetch('/api/me/habits');
        const habits = await response.json();

        habits.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time}`).getTime();
            return timeA - timeB;
        });

        const alarmContainer = document.querySelector('.alarmContainer');
        alarmContainer.innerHTML = '';

        habits.forEach(habit => {
            const alarmInfo = document.createElement('div');
            alarmInfo.className = `alarmInfo ${habit.important ? 'emergency' : 'calm'}`;
            alarmInfo.dataset.habitId = habit._id;

            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-bell';
            icon.style.fontSize = '2.0rem';
            icon.style.padding = '5px';
            alarmInfo.appendChild(icon);

            const textDiv = document.createElement('div');
            textDiv.style.textAlign = 'center';

            const nameElement = document.createElement('h3');
            nameElement.style.margin = '0';
            nameElement.textContent = habit.name.length > 10 ? habit.name.slice(0, 10) + "..." : habit.name;

            textDiv.appendChild(nameElement);

            const timeElement = document.createElement('p');
            timeElement.style.margin = '0';
            timeElement.textContent = habit.time;
            textDiv.appendChild(timeElement);

            alarmInfo.appendChild(textDiv);
            alarmContainer.appendChild(alarmInfo);

            alarmInfo.addEventListener('click', () => {
                showHabitDetails(habit);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

loadHabits();

function showHabitDetails(habit) {
    const descriptionContainer = document.querySelector('.descriptionContainer');

    // Populate textareas with habit details
    document.querySelector('.guide').style.display = 'none';
    document.querySelector('.guideOption').style.display = 'none';
    descriptionContainer.querySelector('.alarmName').value = habit.name;
    descriptionContainer.querySelector('.alarmTime').value = habit.time;
    descriptionContainer.querySelector('.alarmDescription').value = habit.content || '';

    // Show the name, time, and days of the week containers
    descriptionContainer.querySelector('.alarmName').style.display = 'block';
    descriptionContainer.querySelector('.alarmTime').parentElement.style.display = 'flex'; // Show parent div
    descriptionContainer.querySelector('#daysOfWeekContainer').style.display = 'flex';
    descriptionContainer.querySelector('.alarmDescription').style.display = 'block';

    // Get or create the "Important" checkbox and label
    let importantCheckbox = descriptionContainer.querySelector('#importantEdit');
    let importantLabel = descriptionContainer.querySelector('label[for="importantEdit"]');

    if (!importantCheckbox) { // Create if it doesn't exist
        importantCheckbox = document.createElement('input');
        importantCheckbox.type = 'checkbox';
        importantCheckbox.id = 'importantEdit';

        importantLabel = document.createElement('label');
        importantLabel.htmlFor = 'importantEdit';
        importantLabel.appendChild(importantCheckbox);
        importantLabel.appendChild(document.createTextNode('Important'));
        descriptionContainer.querySelector('.deleteHabitBtn').insertAdjacentElement('beforebegin', importantLabel);
    }

    // Set the checkbox state
    importantCheckbox.checked = habit.important;

    // Populate daysOfWeekContainer with buttons
    const daysOfWeekContainer = descriptionContainer.querySelector('#daysOfWeekContainer');
    daysOfWeekContainer.innerHTML = ''; // Clear any existing buttons

    // Convert daysOfWeekFlags to array of day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfWeekFlags = habit.daysOfWeek; // Get the bitwise flag
    const activeDays = [];

    for (let i = 0; i < 7; i++) {
        if (daysOfWeekFlags & (1 << i)) {
            activeDays.push(dayNames[i]);
        }
    }

    dayNames.forEach((day, index) => {
        const button = document.createElement('button');
        button.id = `btnEdit${day}`;
        button.textContent = day;

        if (habit.daysOfWeek & (1 << index)) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });

        daysOfWeekContainer.appendChild(button);
    });

    daysOfWeekContainer.style.display = 'flex';

    descriptionContainer.querySelector('.deleteHabitBtn').style.display = 'block';
    descriptionContainer.querySelector('.saveHabitBtn').style.display = 'block';

    const saveButton = descriptionContainer.querySelector('.saveHabitBtn');
    saveButton.replaceWith(saveButton.cloneNode(true));

    const deleteButton = descriptionContainer.querySelector('.deleteHabitBtn');
    deleteButton.replaceWith(deleteButton.cloneNode(true));

    descriptionContainer.querySelector('.saveHabitBtn').addEventListener('click', async () => {
        const updatedName = descriptionContainer.querySelector('.alarmName').value;
        const updatedTime = descriptionContainer.querySelector('.alarmTime').value;
        const updatedContent = descriptionContainer.querySelector('.alarmDescription').value;
        const updatedImportant = importantCheckbox.checked;

        // Get selected days of week from edit buttons
        const updatedDaysOfWeek = [];
        daysOfWeekContainer.querySelectorAll('button.active').forEach(btn => {
            updatedDaysOfWeek.push(btn.textContent);
        });

        try {
            const response = await fetch(`/api/habits/${habit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedName,
                    time: updatedTime,
                    content: updatedContent,
                    important: updatedImportant,
                    daysOfWeek: updatedDaysOfWeek
                })
            });

            if (response.ok) {
                alert('Habit updated successfully');
                loadHabits();
                setTimeout(() => { location.reload(); }, 500);
            } else {
                console.error('Error updating habit:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Event listener for deleting the habit
    descriptionContainer.querySelector('.deleteHabitBtn').addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/habits/${habit._id}`, { method: 'DELETE' });
            if (response.ok) {
                // descriptionContainer.querySelector('.deleteHabitBtn').style.display = 'none';
                // descriptionContainer.querySelector('.saveHabitBtn').style.display = 'none';

                // Reset descriptionContainer to initial state
                // descriptionContainer.querySelector('.alarmName').value = 'Look to the left';
                // descriptionContainer.querySelector('.alarmTime').value = 'Choose a habit to see the description';
                // // descriptionContainer.querySelector('.alarmTime').style.display = 'none';
                // // descriptionContainer.querySelector('.alarmName').style.display = 'none';
                // descriptionContainer.querySelector('.alarmDescription').value = 'This is the description';
                // importantCheckbox.checked = false;
                // daysOfWeekContainer.innerHTML = ''; // Clear day buttons
                // loadHabits();
                alert('Habit deleted successfully');
                setTimeout(() => {
                    location.reload();
                }, 500);
                // loadNotif();
            } else {
                console.error('Error deleting habit:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}


function addHabitToUI(habit) {
    const alarmContainer = document.querySelector('.alarmContainer');
    const alarmInfo = document.createElement('div');
    alarmInfo.className = `alarmInfo ${habit.important ? 'emergency' : 'calm'}`;
    alarmInfo.dataset.habitId = habit._id;

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-bell';
    icon.style.fontSize = '2.0rem';
    icon.style.padding = '5px';
    alarmInfo.appendChild(icon);

    const textDiv = document.createElement('div');
    textDiv.style.textAlign = 'center';

    const nameElement = document.createElement('h3');
    nameElement.style.margin = '0';
    nameElement.textContent = habit.name;
    textDiv.appendChild(nameElement);

    const timeElement = document.createElement('p');
    timeElement.style.margin = '0';
    timeElement.textContent = habit.time;
    textDiv.appendChild(timeElement);

    alarmInfo.appendChild(textDiv);
    alarmContainer.appendChild(alarmInfo);
    alarmInfo.addEventListener('click', () => {
        showHabitDetails(habit);
    });
}

const habitBtn = document.getElementById('habitBTN');
const daysOfWeekContainer = document.getElementById('daysOfWeekContainerCreate');

const selectedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

daysOfWeekContainer.querySelectorAll('button').forEach(btn => {
    btn.classList.add('active');
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const dayName = btn.textContent;
        if (selectedDays.includes(dayName)) {
            selectedDays.splice(selectedDays.indexOf(dayName), 1);
        } else {
            selectedDays.push(dayName);
        }
    });
});

habitBtn.addEventListener('click', async () => {
    const name = document.getElementById('habitName').value;
    const time = document.getElementById('habitTime').value;
    const content = document.getElementById('habitDetail').value;
    const important = document.getElementById('important').checked;

    if (name === '' || time === '') {
        alert('Please fill in the name and time of the habit.');
        return;
    }

    try {
        const response = await fetch('/api/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, time, content, important, daysOfWeek: selectedDays })
        });

        const data = await response.json();

        if (response.ok) {
            addHabitToUI(data.habit); // Assuming you have an addHabitToUI function
            document.getElementById('habitName').value = '';
            document.getElementById('habitTime').value = '';
            document.getElementById('habitDetail').value = '';
            document.getElementById('important').checked = false;
            selectedDays.length = 0; // Clear the array
            daysOfWeekContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.add('active');
            });
            alert(data.message);
            loadHabits();
            loadNotif();
        } else {
            console.error('Error creating habit:', data.error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
});

//CUSTOMED ALERT
function showCustomAlert() {
    const customAlert = document.getElementById("customAlert");
    customAlert.style.display = "block";

    setTimeout(function () {
        customAlert.style.opacity = 0;
        setTimeout(function () {
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

            const audio = document.getElementById("notificationSound");
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

document.getElementById('pinnedTopic').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});
