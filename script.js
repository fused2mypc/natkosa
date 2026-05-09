const calendarDays = document.getElementById('calendarDays');
const calendarTitle = document.getElementById('calendarTitle');

const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentDate = new Date();

const MIN_YEAR = 2000;
const MAX_YEAR = 2035;

const specialDates = {

  "2025-05-05": "our first kiss... AGAIN :p",
  "2025-08-29": "grown ass man turned 25",
  "2025-10-31": "THIS ASS IS URS",
  "2025-12-12": "grown ass woman turned 24",
  "2026-05-05": "! 1 year anniversary <3",
};

function renderCalendar(date) {

  calendarDays.innerHTML = '';

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  calendarTitle.textContent =
    `${monthNames[month]} ${year}`;

  // leading empty cells
  for (let i = 0; i < firstDay; i++) {

    const empty = document.createElement('div');
    empty.classList.add('empty');

    calendarDays.appendChild(empty);
  }

  // actual days
  for (let day = 1; day <= daysInMonth; day++) {

    const dayEl = document.createElement('div');

    dayEl.textContent = day;

    const dateKey =
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

if (specialDates[dateKey]) {

  dayEl.classList.add('special-day');

  dayEl.dataset.tooltip = specialDates[dateKey];

}

    const today = new Date();

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayEl.classList.add('today');
    }

    calendarDays.appendChild(dayEl);
  }

}

prevMonthBtn.addEventListener('click', () => {

  const newDate =
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

  if (newDate.getFullYear() >= MIN_YEAR) {

    currentDate = newDate;

    renderCalendar(currentDate);
  }

});

nextMonthBtn.addEventListener('click', () => {

  const newDate =
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

  if (newDate.getFullYear() <= MAX_YEAR) {

    currentDate = newDate;

    renderCalendar(currentDate);
  }

});

renderCalendar(currentDate);

const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(err => console.error('play error', err));
    playBtn.textContent = '⏸';
  } else {
    audio.pause();
    playBtn.textContent = '▶';
  }
});
