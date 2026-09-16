const classes = [
  {
    id: 1,
    name: "Cálculo Diferencial",
    teacher: "Figueroa Girón Mario Alberto",
    day: 2, start: "09:00", end: "11:00",
    room: "AULA-14B-201", color: "subject-1"
  },
  {
    id: 1,
    name: "Cálculo Diferencial",
    teacher: "Figueroa Girón Mario Alberto",
    day: 3, start: "12:00", end: "14:00",
    room: "AULA-14B-201", color: "subject-1"
  },
  {
    id: 2,
    name: "Matemáticas Discretas",
    teacher: "Chuchuca Alache Cesar Andres",
    day: 3, start: "09:00", end: "12:00",
    room: "AULA-14B-201", color: "subject-2"
  },
  {
    id: 3,
    name: "Introducción de la Informática",
    teacher: "Olvera Moran Betsy Mabel",
    day: 4, start: "09:00", end: "12:00",
    room: "AULA-14B-201", color: "subject-3"
  },
  {
    id: 4,
    name: "Lenguaje y Comunicación",
    teacher: "Zapata Vega Sany Marcela",
    day: 2, start: "11:00", end: "13:00",
    room: "AULA-14B-201", color: "subject-4"
  },
  {
    id: 5,
    name:"Fundamentos de programación",
    teacher: "Gonzalez Mendoza Otto Rodrigo",
    day: 2, start: "07:00", end: "09:00",
    room: "Labcomputo-14C-204", color: "subject-5"
  },
  {
    id: 5,
    name:"Fundamentos de programación",
    teacher: "Gonzalez Mendoza Otto Rodrigo",
    day: 3, start: "07:00", end: "09:00",
    room: "Labcomputo-14C-204", color: "subject-5"
  },
  {
    id: 5,
    name:"Fundamentos de programación",
    teacher: "Gonzalez Mendoza Otto Rodrigo",
    day: 4, start: "07:00", end: "09:00",
    room: "Labcomputo-14C-204", color: "subject-5"
  },
  {
    id: 6,
    name: "Herramientas digitales",
    teacher: "Vera Mendez Priscila Bethsabe",
    day: 1, start: "07:00", end: "11:00",
    room: "Virtual", color: "subject-6"
  }
];

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const times = ["07:00","08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function minutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(t) {
  return t.replace(":00", ":00");
}

function buildSchedule() {
  const grid = document.getElementById("schedule");

  times.forEach((time, row) => {
    const timeCell = document.createElement("div");
    timeCell.className = "time";
    timeCell.textContent = time;
    timeCell.style.gridColumn = "1";
    timeCell.style.gridRow = row + 2;
    grid.appendChild(timeCell);

    for (let day = 1; day <= 7; day++) {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.style.gridColumn = day + 1;
      slot.style.gridRow = row + 2;
      grid.appendChild(slot);
    }
  });

  classes.forEach(c => {
    const startRow = times.findIndex(t => t === c.start) + 2;
    const duration = (minutes(c.end) - minutes(c.start)) / 60;
    const card = document.createElement("div");
    card.className = `class-card ${c.color}`;
    card.innerHTML = `
      <strong>${c.name}</strong>
      <small>${c.start} - ${c.end}</small>
      <small class="teacher">${c.teacher}</small>
      <small>📍 ${c.room}</small>
    `;

    const cell = document.createElement("div");
    cell.className = "slot";
    cell.style.gridColumn = c.day + 1;
    cell.style.gridRow = `${startRow} / span ${duration}`;
    cell.appendChild(card);
    grid.appendChild(cell);
  });

  // Highlight today's column.
  const today = new Date().getDay(); // Sunday=0
  const todayIndex = today === 0 ? 7 : today;
  if (todayIndex >= 1 && todayIndex <= 7) {
    document.querySelectorAll(".slot").forEach(slot => {
      if (Number(slot.style.gridColumn) === todayIndex + 1) {
        slot.style.background = "rgba(57,119,189,.06)";
      }
    });
  }
}

function buildLegend() {
  const legend = document.getElementById("legendItems");
  const unique = [...new Map(classes.map(c => [c.id, c])).values()];
  unique.forEach(c => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="dot ${c.color}"></span>${c.name}`;
    legend.appendChild(item);
  });
}

function getNextClass() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  let upcoming = classes
    .map(c => {
      let diff;
      if (c.day === day && minutes(c.end) > nowMin) {
        diff = minutes(c.start) > nowMin
          ? minutes(c.start) - nowMin
          : 0;
      } else {
        diff = ((c.day - day + 7) % 7) * 1440 + minutes(c.start) - nowMin;
        if (diff <= 0) diff += 7 * 1440;
      }
      return {...c, diff};
    })
    .sort((a, b) => a.diff - b.diff)[0];

  return upcoming;
}

function updateNextClass() {
  const now = new Date();
  const today = now.getDay() === 0 ? 7 : now.getDay();
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  let next = null;
  let smallestDiff = Infinity;

  classes.forEach(c => {
    let diff;

    if (c.day === today) {
      diff = minutes(c.start) - currentMinutes;

      // Si la clase de hoy ya terminó, ignorarla
      if (diff < 0) return;
    } else {
      diff =
        ((c.day - today + 7) % 7) * 1440 +
        minutes(c.start) -
        currentMinutes;
    }

    if (diff >= 0 && diff < smallestDiff) {
      smallestDiff = diff;
      next = c;
    }
  });

  // Si ya no quedan clases esta semana, buscar la primera de la siguiente
  if (!next) {
    next = classes
      .slice()
      .sort((a, b) => a.day - b.day || minutes(a.start) - minutes(b.start))[0];

    smallestDiff =
      ((next.day - today + 7) % 7) * 1440 +
      minutes(next.start) -
      currentMinutes;

    if (smallestDiff < 0) {
      smallestDiff += 7 * 1440;
    }
  }

  const nextDate = new Date(now);
  let dayDifference = (next.day - today + 7) % 7;

  nextDate.setDate(now.getDate() + dayDifference);

  const [hours, mins] = next.start.split(":").map(Number);
  nextDate.setHours(hours, mins, 0, 0);

  // Si la clase ya pasó hoy, llevarla a la próxima semana
  if (nextDate <= now) {
    nextDate.setDate(nextDate.getDate() + 7);
  }

  const difference = nextDate - now;
  const totalSeconds = Math.max(0, Math.floor(difference / 1000));

  const hrs = Math.floor(totalSeconds / 3600);
  const minsLeft = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  document.getElementById("nextClass").textContent = next.name;

  document.getElementById("nextDetails").textContent =
    `${days[next.day - 1]} · ${next.start} - ${next.end} · 📍 ${next.room}`;

  document.getElementById("countdown").textContent =
    `${String(hrs).padStart(2, "0")}:${String(minsLeft).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeBtn").textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

buildSchedule();
buildLegend();
updateNextClass();
setInterval(updateNextClass, 1000);
