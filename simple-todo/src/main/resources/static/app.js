const API = '/api/tasks';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyMsg = document.getElementById('emptyMsg');

async function loadTasks() {
    const res = await fetch(API);
    const tasks = await res.json();
    render(tasks);
}

function render(tasks) {
    taskList.innerHTML = '';
    emptyMsg.style.display = tasks.length ? 'none' : 'block';

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.done) li.classList.add('done');

        const span = document.createElement('span');
        span.textContent = task.title;           // textContent avoids HTML injection
        span.addEventListener('click', () => toggleTask(task.id));

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.className = 'delete';
        del.addEventListener('click', () => deleteTask(task.id));

        li.append(span, del);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    taskInput.value = '';
    loadTasks();
}

async function toggleTask(id) {
    await fetch(`${API}/${id}/toggle`, { method: 'PUT' });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

loadTasks();
