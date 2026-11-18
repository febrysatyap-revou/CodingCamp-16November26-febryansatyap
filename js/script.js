// ================= 1. CLOCK, DATE & GREETING =================
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const greetingEl = document.getElementById('greeting');

function updateDateTime() {
  const now = new Date();

  // Format Jam (HH:MM:SS)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds}`;

  // Format Tanggal (contoh: Thursday, November 19, 2026)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('en-US', options);

  // Greeting berdasarkan waktu
  const hour = now.getHours();
  let greetingText = 'Good Evening';
  if (hour >= 5 && hour < 12) {
    greetingText = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    greetingText = 'Good Afternoon';
  }

  greetingEl.textContent = greetingText;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ================= 2. LIGHT / DARK MODE (CHALLENGE 1) =================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('dashboard_theme') || 'light';
setTheme(savedTheme);

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('dashboard_theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

// ================= 3. FOCUS TIMER (25 MINUTES) =================
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

const DEFAULT_TIME = 25 * 60;
let timeLeft = DEFAULT_TIME;
let timerInterval = null;

function renderTimer() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

startBtn.addEventListener('click', () => {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      renderTimer();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert('Focus session complete! Take a break.');
    }
  }, 1000);
});

stopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = DEFAULT_TIME;
  renderTimer();
});

renderTimer();

// ================= 4. TO-DO LIST (NO DUPLICATE & SORT TASKS - CHALLENGES 2 & 3) =================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskWarning = document.getElementById('task-warning');
const sortTasksBtn = document.getElementById('sort-tasks-btn');

let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [
  { id: 1, text: 'belanja', done: false },
  { id: 2, text: 'belajar', done: false }
];

function saveTasks() {
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.className = `task-text ${task.done ? 'done' : ''}`;
    span.textContent = task.text;

    leftDiv.append(checkbox, span);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-small btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const updated = prompt('Edit task:', task.text);
      if (updated && updated.trim()) {
        const trimmed = updated.trim();
        const isDuplicate = tasks.some(
          (t) => t.id !== task.id && t.text.toLowerCase() === trimmed.toLowerCase()
        );
        if (isDuplicate) {
          alert('Task already exists!');
          return;
        }
        task.text = trimmed;
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-small btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actionsDiv.append(editBtn, deleteBtn);
    li.append(leftDiv, actionsDiv);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  // Prevent Duplicate Tasks
  const exists = tasks.some((t) => t.text.toLowerCase() === text.toLowerCase());
  if (exists) {
    taskWarning.textContent = 'Task already exists!';
    return;
  }

  taskWarning.textContent = '';
  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

// Sort Tasks (Belum selesai di atas + urut A-Z)
sortTasksBtn.addEventListener('click', () => {
  tasks.sort((a, b) => {
    if (a.done !== b.done) return a.done - b.done;
    return a.text.localeCompare(b.text);
  });
  saveTasks();
  renderTasks();
});

renderTasks();

// ================= 5. QUICK LINKS =================
const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linksContainer = document.getElementById('links-container');

let quickLinks = JSON.parse(localStorage.getItem('dashboard_links')) || [
  { id: 1, name: 'Google', url: 'https://google.com' },
  { id: 2, name: 'Gmail', url: 'https://google.com' },
  { id: 3, name: 'Calendar', url: 'https://google.com' }
];

function saveLinks() {
  localStorage.setItem('dashboard_links', JSON.stringify(quickLinks));
}

function renderLinks() {
  linksContainer.innerHTML = '';
  quickLinks.forEach((link) => {
    const pill = document.createElement('div');
    pill.className = 'link-pill';

    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.name;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-link-btn';
    delBtn.textContent = '×';
    delBtn.title = 'Remove link';
    delBtn.addEventListener('click', () => {
      quickLinks = quickLinks.filter((l) => l.id !== link.id);
      saveLinks();
      renderLinks();
    });

    pill.append(anchor, delBtn);
    linksContainer.appendChild(pill);
  });
}

linkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();
  if (!name || !url) return;

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  quickLinks.push({ id: Date.now(), name, url });
  linkNameInput.value = '';
  linkUrlInput.value = '';
  saveLinks();
  renderLinks();
});

renderLinks();
