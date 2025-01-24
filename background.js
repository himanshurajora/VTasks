const taskList = document.getElementById("taskList");
const form = document.getElementById("form");
let tasks = [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementsByClassName("at")[0];
    const value = input.value.trim();
    
    if (value !== "") {
        tasks.push(value);
        input.value = "";
        render();
        
        // Add animation to the newest task
        const newestTask = taskList.firstChild;
        newestTask.style.opacity = "0";
        newestTask.style.transform = "translateY(-10px)";
        requestAnimationFrame(() => {
            newestTask.style.transition = "all 0.3s ease";
            newestTask.style.opacity = "1";
            newestTask.style.transform = "translateY(0)";
        });
    }
});

function render() {
    taskList.innerHTML = "";
    tasks.forEach((val, index) => {
        const item = document.createElement("li");
        let data;
        
        if (isValidUrl(val)) {
            data = `
                <p><a href="${val}" target="_blank" title="Ctrl + Click to open in new tab">${val}</a></p>
                <button name="${index}" class="del" title="Delete task">X</button>
            `;
        } else {
            data = `
                <p>${val}</p>
                <button name="${index}" class="del" title="Delete task">X</button>
            `;
        }
        
        item.innerHTML = data;
        taskList.prepend(item);
    });
    
    addButtonEvents();
    store();
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function store() {
    chrome.storage.local.set({ tasks: tasks });
}

function load() {
    chrome.storage.local.get(['tasks'], function (result) {
        if (result.tasks) {
            tasks = result.tasks;
            render();
        }
    });
}

function addButtonEvents() {
    const buttons = document.getElementsByClassName("del");
    Array.from(buttons).forEach(button => {
        button.addEventListener("click", (e) => {
            const li = e.target.parentElement;
            li.style.transition = "all 0.3s ease";
            li.style.opacity = "0";
            li.style.transform = "translateY(-10px)";
            
            setTimeout(() => {
                remove(e.target.getAttribute("name"));
            }, 300);
        });
    });
}

function remove(index) {
    tasks.splice(parseInt(index), 1);
    render();
}

// Initial load and render
load();