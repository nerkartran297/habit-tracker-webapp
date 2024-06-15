const today = new Date();
const calendar = document.querySelector('.calendar');
const webIntro = document.querySelector('.webIntro');

function renderCalendar(date) {
    calendar.innerHTML = '';

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    let prevMonthStartDay = (firstDay - 1 + 7) % 7;

    const header = document.createElement('div');
    header.classList.add('calendarLine', 'dayName');
    for (let i = 0; i < 7; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendarDay');
        dayCell.textContent = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][i];
        header.appendChild(dayCell);
    }
    calendar.appendChild(header);

    let day = 1;
    prevMonthStartDay = 1;
    for (let i = 0; i < 6; i++) {
        const week = document.createElement('div');
        week.classList.add('calendarLine');

        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendarDay');

            if (i === 0 && j < firstDay) {
                dayCell.textContent = (prevLastDate + prevMonthStartDay - 5) < 10 ? `0${prevLastDate + prevMonthStartDay - 5}` : (prevLastDate + prevMonthStartDay - 5);
                dayCell.classList.add('nextMonth');
                prevMonthStartDay++;
            } else if (day > lastDate) {
                dayCell.textContent = (day - lastDate) < 10 ? `0${day - lastDate}` : (day - lastDate);
                dayCell.classList.add('nextMonth');
                day++;
            } else {
                const currentDay = day;
                dayCell.textContent = currentDay < 10 ? `0${currentDay}` : currentDay;
                dayCell.classList.add('cellDay');
                if (currentDay === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayCell.classList.add('today');
                }
                dayCell.addEventListener('click', () => loadNotesForDate(year, month, currentDay));
                day++;
            }

            week.appendChild(dayCell);
        }

        calendar.appendChild(week);
    }
}

async function loadNotesForDate(year, month, day) {
    try {
        const response = await fetch('/api/me/notes');
        const notes = await response.json();
        const selectedDate = new Date(year, month, day);

        const filteredNotes = notes.filter(note => {
            const noteDate = new Date(note.date);
            return noteDate.getFullYear() === selectedDate.getFullYear() &&
                noteDate.getMonth() === selectedDate.getMonth() &&
                noteDate.getDate() === selectedDate.getDate();
        });

        webIntro.innerHTML = '<h3>Notes for ' + selectedDate.toLocaleDateString('en-GB') + ':</h3>';

        if (filteredNotes.length === 0) {
            webIntro.innerHTML += '<p>No notes for this date.</p>';
        } else {
            const ul = document.createElement('ul');
            ul.classList.add('noteList');
            filteredNotes.forEach(note => {
                const li = document.createElement('li');
                li.classList.add('noteItem');
                li.textContent = note.title;

                li.setAttribute('data-noteid', note._id);
                li.addEventListener('click', () => {
                    window.location.href = `/view?noteId=${note._id}`;
                });
                ul.appendChild(li);
            });

            webIntro.appendChild(ul);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

renderCalendar(today);