const habitsContainer = document.getElementById("habitsContainer");

const addHabitBtn = document.getElementById("addHabit");

const habitInput = document.getElementById("habitInput");

let habits = JSON.parse(localStorage.getItem("habits")) || {};

function saveHabits() {

  localStorage.setItem("habits", JSON.stringify(habits));

}

function calculateStreak(days) {

  let streak = 0;

  const today = new Date();

  for (let i = 0; i < 365; i++) {

    const check = new Date();

    check.setDate(today.getDate() - i);

    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;

    if (days.includes(key)) {

      streak++;

    } else {

      break;

    }

  }

  return streak;

}

function createHabitCard(id, habit) {

  const card = document.createElement("div");

  card.className = "habit-card";

  card.id = id;

  // Header

  const header = document.createElement("div");

  header.className = "habit-header";

  header.innerHTML = `

    <span class="habit-title">${habit.name}</span>

    <button class="remove-btn">✖</button>

  `;

  // Progress Section

  const progressContainer = document.createElement("div");

  progressContainer.className = "progress-container";

  progressContainer.innerHTML = `

    <div class="progress-bar"><div class="progress-fill"></div></div>

    <div class="streak">🔥 Streak: 0 days</div>

  `;

  const progressFill = progressContainer.querySelector(".progress-fill");

  const streakEl = progressContainer.querySelector(".streak");

  // Calendar

  const calHeader = document.createElement("div");

  calHeader.className = "calendar-header";

  calHeader.innerHTML = `

    <button class="prev">◀</button>

    <span class="monthYear"></span>

    <button class="next">▶</button>

  `;

  const weekdays = document.createElement("div");

  weekdays.className = "weekdays";

  weekdays.innerHTML = "<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>";

  const calendar = document.createElement("div");

  calendar.className = "calendar";

  card.appendChild(header);

  card.appendChild(progressContainer);

  card.appendChild(calHeader);

  card.appendChild(weekdays);

  card.appendChild(calendar);

  // Remove habit

  header.querySelector(".remove-btn").addEventListener("click", () => {

    delete habits[id];

    card.remove();

    saveHabits();

  });

  // Calendar navigation

  let currentDate = new Date();

  let currentMonth = currentDate.getMonth();

  let currentYear = currentDate.getFullYear();

  function renderCalendar(y, m) {

    calendar.innerHTML = "";

    const firstDay = new Date(y, m, 1).getDay();

    const daysInMonth = new Date(y, m + 1, 0).getDate();

    calHeader.querySelector(".monthYear").textContent =

      `${new Date(y, m).toLocaleString("default", { month: "long" })} ${y}`;

    // Blank cells

    for (let i = 0; i < firstDay; i++) {

      const empty = document.createElement("div");

      calendar.appendChild(empty);

    }

    // Days

    for (let d = 1; d <= daysInMonth; d++) {

      const cell = document.createElement("div");

      cell.className = "day";

      cell.textContent = d;

      const key = `${y}-${m}-${d}`;

      if (habit.days.includes(key)) cell.classList.add("done");

      cell.addEventListener("click", () => {

        if (habit.days.includes(key)) {

          habit.days = habit.days.filter(k => k !== key);

          cell.classList.remove("done");

        } else {

          habit.days.push(key);

          cell.classList.add("done");

        }

        saveHabits();

        updateProgress();

      });

      calendar.appendChild(cell);

    }

    updateProgress();

  }

  // Update progress + streak

  function updateProgress() {

    const visibleMonthKeyPrefix = `${currentYear}-${currentMonth}-`;

    const monthDays = habit.days.filter(k => k.startsWith(visibleMonthKeyPrefix));

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const percent = Math.round((monthDays.length / daysInMonth) * 100);

    progressFill.style.width = percent + "%";

    streakEl.textContent = `🔥 Streak: ${calculateStreak(habit.days)} days`;

  }

  calHeader.querySelector(".prev").addEventListener("click", () => {

    currentMonth--;

    if (currentMonth < 0) { currentMonth = 11; currentYear--; }

    renderCalendar(currentYear, currentMonth);

  });

  calHeader.querySelector(".next").addEventListener("click", () => {

    currentMonth++;

    if (currentMonth > 11) { currentMonth = 0; currentYear++; }

    renderCalendar(currentYear, currentMonth);

  });

  renderCalendar(currentYear, currentMonth);

  habitsContainer.appendChild(card);

}

// Add new habit

addHabitBtn.addEventListener("click", () => {

  const name = habitInput.value.trim();

  if (!name) return;

  const id = Date.now().toString();

  habits[id] = { name, days: [] };

  saveHabits();

  createHabitCard(id, habits[id]);

  habitInput.value = "";

});

// Load habits

Object.keys(habits).forEach(id => createHabitCard(id, habits[id]));
