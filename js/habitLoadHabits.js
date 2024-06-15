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
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

loadHabits();

function showHabitDetails(habit) {
    const descriptionContainer = document.querySelector('.descriptionContainer');
    descriptionContainer.querySelector('.alarmName').textContent = habit.name;
    descriptionContainer.querySelector('.alarmTime').textContent = '( ' + habit.time + ' )';
    descriptionContainer.querySelector('.alarmDescription').innerHTML = habit.content;
    const deleteBtn = descriptionContainer.querySelector('.deleteHabitBtn');
    deleteBtn.style.display = 'block';

    deleteBtn.removeEventListener('click', handleDeleteClick);
    deleteBtn.addEventListener('click', () => handleDeleteClick(habit));

    async function handleDeleteClick(habitToDelete) {
        event.preventDefault();

        try {
            deleteBtn.removeEventListener('click', () => handleDeleteClick(habitToDelete));
            const response = await fetch(`/api/habits/${habitToDelete._id}`, { method: 'DELETE' });
            if (response.ok) {
                loadHabits();
                deleteBtn.removeEventListener('click', handleDeleteClick);
                deleteBtn.style.display = 'none';
                // location.reload();
            } else {
                console.error('Error deleting habit:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
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
habitBtn.addEventListener('click', async () => {
    const name = document.getElementById('habitName').value;
    const time = document.getElementById('habitTime').value;
    console.log(time);
    const content = document.getElementById('habitDetail').value;
    const important = document.getElementById('important').checked;

    if (name === '' || time === '' || content === '') {
        alert('Vui lòng nhập đầy đủ tên, thời gian và nội dung của thói quen.');
        return;
    }

    try {
        const response = await fetch('/api/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, time, content, important })
        });

        const data = await response.json();

        if (response.ok) {
            addHabitToUI(data.habit);
            document.getElementById('habitName').value = '';
            document.getElementById('habitTime').value = '';
            document.getElementById('habitDetail').value = '';
            document.getElementById('important').checked = false;
            alert(data.message);
        } else {
            console.error('Error creating habit:', data.error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
});