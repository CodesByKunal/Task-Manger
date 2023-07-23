let prvstext = "";
let addtasktime = ""
let removetasktime = ""
let taskupdatetime = ""
const alert = document.querySelector(".container-fluid")
const alerttittle = document.querySelector(".alert")
const taskInput = document.querySelector("#task-input")
const addTask = document.querySelector("#addtaskbtn")
let cmpltBtn = document.querySelectorAll(".completebutton")
const localdata = JSON.parse(localStorage.getItem('taskdata'))
let mainContainer = document.querySelector(".main-container")
task = []
if (localdata) {
    task = localdata
    renderTask()
}
function updateselectornode() {
    let selector = document.getElementsByTagName("select");
    for (let index = 0; index < selector.length; index++) {
        selector[index].addEventListener("change", (e) => {
            while (e.target.classList.length > 0) {
                e.target.classList.remove(e.target.classList[0]);
            }
            const currentClassListValue = e.target.value
            const desc = e.target.parentElement.parentElement.parentElement.firstElementChild.innerText
            task.map((x, y) => {
                if (x.desc === desc) {
                    x.priority = e.target.value
                    localStorage.setItem("taskdata", JSON.stringify(task))
                }
            })
            if (currentClassListValue === 'Urgent') {
                e.target.firstElementChild.parentElement.classList.add("Urgent");
            } else if (currentClassListValue === 'Medium') {
                e.target.firstElementChild.parentElement.classList.add("Medium");
            } else {
                e.target.firstElementChild.parentElement.classList.add("Low");
            }
        })

    }
}

function updatenode() {
    const taskText = document.querySelectorAll(".unselectable")
    for (let index = 0; index < taskText.length; index++) {
        taskText[index].addEventListener("dblclick", (e) => {
            e.target.style.backgroundColor = "rgb(26, 25, 25)"
            e.target.setAttribute('contenteditable', 'true');
            clearTimeout(addtasktime)
            clearTimeout(removetasktime)
            clearTimeout(taskupdatetime)
            alert.style.display = "flex";
            alerttittle.classList.remove("alert-danger")
            alerttittle.classList.add("alert-warning")
            alerttittle.innerText = "Edit Task"
            prvstext = e.target.innerText
        })
        taskText[index].addEventListener('blur', (e) => {
            e.target.style.backgroundColor = ""
            e.target.setAttribute('contenteditable', 'false');
            task.map((x, y) => {
                if (x.desc === prvstext) {
                    x.desc = e.target.innerText;
                    localStorage.setItem("taskdata", JSON.stringify(task))
                    alerttittle.classList.remove("alert-warning")
                    alert.style.display = "flex";
                    clearTimeout(addtasktime)
                    alerttittle.innerText = "Task Updated"
                    taskupdatetime = setTimeout(() => {
                        alert.style.display = "none";
                    }, 2000);
                    renderTask();
                }
            })
        })
    }
}

addTask.addEventListener("click", () => {
    if (taskInput.value) {
        task.push({
            "desc": taskInput.value,
            "priority": "",
            "cmplt": "false"
        })
        clearTimeout(addtasktime)
        clearTimeout(removetasktime)
        clearTimeout(taskupdatetime)
        alert.style.display = "flex";
        alerttittle.classList.remove("alert-danger")
        alerttittle.innerText = "Task Added"
        addtasktime = setTimeout(() => {
            alert.style.display = "none";
        }, 2000);
        localStorage.setItem("taskdata", JSON.stringify(task))
        renderTask();
        taskInput.value = ""
    }
})
function renderTask() {
    mainContainer.innerHTML = "";
    task.map((x, y) => {
        const isUrgent = x.priority === "Urgent";
        const isMedium = x.priority === "Medium";
        const isPriority = x.priority === "";
        const isLow = x.priority === "Low";
        const isCmplt = x.cmplt === "true";
        mainContainer.innerHTML += `
        <div class="row p-1">
        <div class="col-12 mb-xl-2 p-1 unselectable">
        <span style="text-decoration: ${isCmplt ? 'line-through' : 'none'}">
          ${x.desc}
        </span>
      </div>
          <hr>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <div class="priority d-flex justify-content-center align-items-center">
              <label for="priority"></label>
              <select class=" ${isUrgent ? "Urgent" : ""} ${isMedium ? "Medium" : ""} ${isPriority ? "default-priority" : ""} ${isLow ? "Low" : ""}">
                <option value="Priority" disabled ${isPriority ? "selected" : ""}>Priority</option>
                <option value="Urgent" ${isUrgent ? "selected" : ""}>Urgent</option>
                <option value="Medium" ${isMedium ? "selected" : ""}>Medium</option>
                <option value="Low" ${isLow ? "selected" : ""}>Low</option>
              </select>
            </div>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-outline-success custombtn completebutton">Done</button>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <button type="button" class="custombtn removebutton btn btn-outline-danger">Remove</button>
          </div>
        </div>
        <br>`;
    });
    updatenode();
    updateselectornode();
    handleRemoveBtn();
    handlecmpltBtn();
}

function handleRemoveBtn() {
    const removeBtn = document.querySelectorAll(".removebutton")
    for (let index = 0; index < removeBtn.length; index++) {
        removeBtn[index].addEventListener("click", (e) => {
            let desc1 = e.target.parentElement.parentElement.firstElementChild.innerText
            task.map((x, y) => {
                if (x.desc === desc1) {
                    task.splice(y, 1)
                    alerttittle.classList.add("alert-danger")
                    alerttittle.innerText = "Task Removed"
                    alert.style.display = "flex";
                    clearTimeout(addtasktime)
                    clearTimeout(removetasktime)
                    clearTimeout(taskupdatetime)
                    removetasktime = setTimeout(() => {
                        alert.style.display = "none";
                    }, 2000);
                    localStorage.setItem("taskdata", JSON.stringify(task))
                }
            })
            renderTask();
        })
    }
}

function handlecmpltBtn() {
    cmpltBtn = document.querySelectorAll(".completebutton")
    for (let index = 0; index < cmpltBtn.length; index++) {
        cmpltBtn[index].addEventListener("click", (e) => {
            let desc1 = e.target.parentElement.parentElement.firstElementChild.innerText
            task.map((x, y) => {
                if (x.desc === desc1) {
                    x.cmplt === "true" ? x.cmplt = "false" : x.cmplt = "true"
                    localStorage.setItem("taskdata", JSON.stringify(task))
                }
            })
            renderTask();
        })
    }
}