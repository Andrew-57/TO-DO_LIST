const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
function completeEdit(taskTextDiv, editIcon) {
    taskTextDiv.blur();
    const finalContent = taskTextDiv.textContent.trim();
    taskTextDiv.textContent = finalContent;
    taskTextDiv.setAttribute("contenteditable", "false");
    editIcon.classList.remove('fa-save');
    editIcon.classList.add('fa-edit');
    saveData();
}
function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === '') {
        alert("Please enter a task!");
        return;
    }
    let li = document.createElement("li");
    let doneIcon = document.createElement("i");
    doneIcon.classList.add("fas", "fa-check-circle", "task-done");
    li.appendChild(doneIcon);
    let textDiv = document.createElement("div");
    textDiv.classList.add("task-text");
    textDiv.setAttribute("contenteditable", "false");
    textDiv.textContent = taskText;
    li.appendChild(textDiv);
    let iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit");
    iconContainer.appendChild(editIcon);
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt");
    iconContainer.appendChild(deleteIcon);
    li.appendChild(iconContainer);
    listContainer.appendChild(li);
    inputBox.value = "";
    saveData();
}
inputBox.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});
listContainer.addEventListener('keypress', function (e) {
    if (e.target.classList.contains('task-text') && e.key === 'Enter') {
        e.preventDefault();
        const taskTextDiv = e.target;
        const listItem = taskTextDiv.closest('li');
        const saveIcon = listItem.querySelector('.fa-save');
        if (saveIcon) {
            completeEdit(taskTextDiv, saveIcon);
        }
    }
});
listContainer.addEventListener("click", function (e) {
    const target = e.target;
    const listItem = target.closest('li');
    if (!listItem) return;
    const taskTextDiv = listItem.querySelector('.task-text');
    if (target.classList.contains("task-done")) {
        if (taskTextDiv.getAttribute("contenteditable") === "true") return; // disable during edit
        listItem.classList.toggle("checked");

        const editIcon = listItem.querySelector('.fa-edit, .fa-save');
        if (listItem.classList.contains("checked")) {
            editIcon.classList.add('disabled');
            taskTextDiv.setAttribute("contenteditable", "false");
        } else {
            editIcon.classList.remove('disabled');
        }
        saveData();
    }
    else if (target.classList.contains("fa-edit") || target.classList.contains("fa-save")) {
        e.stopPropagation();
        if (listItem.classList.contains("checked")) return;
        if (target.classList.contains("fa-save")) {
            completeEdit(taskTextDiv, target);
        } else if (target.classList.contains("fa-edit")) {
            taskTextDiv.setAttribute("contenteditable", "true");
            taskTextDiv.focus();
            target.classList.remove('fa-edit');
            target.classList.add('fa-save');
            document.execCommand('selectAll', false, null);
        }
    }
    else if (target.classList.contains("fa-trash-alt")) {
        listItem.remove();
        saveData();
    }

}, false);
function saveData() {
    let content = listContainer.innerHTML
        .replace(/contenteditable="true"/g, 'contenteditable="false"')
        .replace(/ data-fa-iid="[^"]*"/g, '');
    localStorage.setItem("glass_todo_data", content);
}
function showTask() {
    listContainer.innerHTML = localStorage.getItem("glass_todo_data") || '';
    document.querySelectorAll('#list-container li').forEach(listItem => {
        if (listItem.classList.contains('checked')) {
            const editIcon = listItem.querySelector('.fa-edit');
            if (editIcon) {
                editIcon.classList.add('disabled');
            }
        }
    });
}
listContainer.addEventListener('blur', function (e) {
    if (e.target.classList.contains('task-text') &&
        e.target.getAttribute("contenteditable") === "true") {
        const listItem = e.target.closest('li');
        const saveIcon = listItem.querySelector('.fa-save');
        if (saveIcon) {
            completeEdit(e.target, saveIcon);
        }
    }
}, true);
showTask();
