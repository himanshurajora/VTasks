var taskList = document.getElementById("taskList");
var form = document.getElementById("form");
var tasks = [];


form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementsByClassName("at")[0].value != "") {
        tasks.push(document.getElementsByClassName("at")[0].value)
        render();
    }
    document.getElementsByClassName("at")[0].value = "";
})


function render() {
    console.log("render called")
    taskList.innerHTML = "";
    tasks.forEach((val, index) => {
        var item = document.createElement("li");
        var data;
        if (val.slice(0, 4) == "http") {
            data = "<button name='" + index + "' class='del'>-</button> <p> &nbsp; &nbsp; &nbsp; &nbsp; <a href='" + val + "'><abbr title='Ctrl + Click to open the link'>" + val + "</abbr></a></p>"
        } else {
            data = "<button name='" + index + "' class='del'>-</button> <p> &nbsp; &nbsp; &nbsp; &nbsp;" + val + "</p>"
        } item.innerHTML = data;
        taskList.prepend(item);
    })
    addButtonEvents();
    store();
}

function store() {
    chrome.storage.local.set({ tasks: tasks });
}

function load() {
    chrome.storage.local.get(['tasks'], function (result) {
        if (result.tasks) {
            tasks = result.tasks;
            render()
        }
    });
}

function addButtonEvents() {
    var buttons = document.getElementsByClassName("del");
    for (button of buttons) {
        button.addEventListener("click", (e) => {
            remove(e.srcElement.name);
        })
    }
}

function remove(index) {
    tasks.splice(parseInt(index), 1);
    render();
}

//initial load and render
load();