// script.js

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const daySelect = document.getElementById("day-select");
const weekContainer = document.getElementById("week-container");
const clearBtn = document.getElementById("clear-tasks");

// Dias da semana
const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

// Criar colunas para cada dia
function renderDays() {
  weekContainer.innerHTML = "";
  days.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerHTML = `
      <h2>${day}</h2>
      <ul id="list-${day}"></ul>
    `;
    weekContainer.appendChild(dayDiv);
  });
}
renderDays();

// Adicionar tarefa
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const day = daySelect.value;
  const ul = document.getElementById(`list-${day}`);

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <div class="actions">
      <button class="edit">✏️</button>
      <button class="delete">❌</button>
    </div>
  `;

  // Marcar como concluído
  li.querySelector("span").addEventListener("click", () => {
    li.classList.toggle("done");
    saveTasks();
  });

  // Editar
  li.querySelector(".edit").addEventListener("click", () => {
    const newText = prompt("Editar tarefa:", li.querySelector("span").textContent);
    if (newText) {
      li.querySelector("span").textContent = newText;
      saveTasks();
    }
  });

  // Excluir
  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  ul.appendChild(li);
  taskInput.value = "";
  saveTasks();
}

// Limpar semana
clearBtn.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja apagar todas as tarefas da semana?")) {
    localStorage.clear();
    renderDays();
  }
});

// Salvar no localStorage
function saveTasks() {
  const tasks = {};
  days.forEach(day => {
    tasks[day] = [];
    document.querySelectorAll(`#list-${day} li`).forEach(li => {
      tasks[day].push({
        text: li.querySelector("span").textContent,
        done: li.classList.contains("done")
      });
    });
  });
  localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
}

// Carregar do localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("weeklyTasks")) || {};
  days.forEach(day => {
    const ul = document.getElementById(`list-${day}`);
    if (tasks[day]) {
      tasks[day].forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${task.text}</span>
          <div class="actions">
            <button class="edit">✏️</button>
            <button class="delete">❌</button>
          </div>
        `;
        if (task.done) li.classList.add("done");

        li.querySelector("span").addEventListener("click", () => {
          li.classList.toggle("done");
          saveTasks();
        });

        li.querySelector(".edit").addEventListener("click", () => {
          const newText = prompt("Editar tarefa:", li.querySelector("span").textContent);
          if (newText) {
            li.querySelector("span").textContent = newText;
            saveTasks();
          }
        });

        li.querySelector(".delete").addEventListener("click", () => {
          li.remove();
          saveTasks();
        });

        ul.appendChild(li);
      });
    }
  });
}
document.addEventListener("DOMContentLoaded", loadTasks);
